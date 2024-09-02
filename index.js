window.addEventListener("scroll", function() {
    var heading = document.querySelector(".heading");
    heading.classList.toggle("active", window.scrollY > 0);
});

const gallery = document.getElementById('gallery');
const accessKey = '9WvhQTuSzbAqe319C9Fcwctiy9iOK6nXOzSv_YJZEXc'; 
let page = 1;
let images = [];
let currentIndex = 0;

async function fetchImages() {
    const response = await fetch(`https://api.unsplash.com/photos?page=${page}&client_id=${accessKey}&per_page=900`);
    const data = await response.json();
    displayImages(data);
}

function displayImages(imageData) {
    imageData.forEach((image, index) => {
        console.log(image);
        
        const imgContainer = document.createElement('div');
        imgContainer.className = 'image-container';
        const img = document.createElement('img');
        img.src = image.urls.small;
        img.alt = image.alt_description;

        img.setAttribute('data-index', index);

        imgContainer.appendChild(img);
        gallery.appendChild(imgContainer);

        img.onload = () => {
            img.style.display = 'block';
        };

        img.onclick = () => openModal(index);
        images.push(image); // Add to the array for later use
    });
    page++;
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            fetchImages();
        }
    });
}, { rootMargin: '200px' });

observer.observe(document.querySelector('footer'));

// Initial load
fetchImages();

// Function to show image in modal
function openModal(index) {
    currentIndex = index;
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.querySelector(".caption");

    modal.style.display = "block";
    modalImg.src = images[currentIndex].urls.full;
    captionText.innerHTML = images[currentIndex].alt_description || "Image";
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById("imageModal");
    modal.style.display = "none";
}

// Show the next image
function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    openModal(currentIndex);
}

// Show the previous image
function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    openModal(currentIndex);
}

// Add event listeners for closing the modal and navigating images
document.querySelector('.close').onclick = closeModal;
document.querySelector('.next').onclick = showNext;
document.querySelector('.prev').onclick = showPrev;
