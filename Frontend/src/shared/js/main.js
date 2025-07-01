document.addEventListener("DOMContentLoaded", () => {
    const authBtn = document.getElementById("auth-btn");
    const logoutBtn = document.getElementById("logoutBtn");
    const profileBtn = document.getElementById("profile-ico");
    const headerActions = document.querySelector(".header-actions");

    const isAuthenticated = localStorage.getItem('email') !== null;

    function updateAuthUI() {
        if (isAuthenticated) {
            authBtn.style.display = 'none';
            headerActions.style.display = 'flex';
        } else {
            authBtn.style.display = 'block';
            headerActions.style.display = 'none';
        }
    }

    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem('email');
        window.location.href = '/../../../index.html';
    });

    updateAuthUI();
});


function init() {
    let map = new ymaps.Map('map-test', {
        center: [41.3867211227208, 2.195605847998997],
        zoom: 18
    });
    let placemark = new ymaps.Placemark([41.3867211227208, 2.195605847998997], {
    });
    map.geoObjects.add(placemark);
}


ymaps.ready(init);

document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelector('.slides');
    const slideItems = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    let currentIndex = 0;
    const totalSlides = slideItems.length;

    function updateSlider() {
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    nextBtn.addEventListener('click', function () {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    });

    prevBtn.addEventListener('click', function () {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    });

    slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
    slider.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        }, 5000);
    });
});