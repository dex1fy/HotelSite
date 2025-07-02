document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logoutBtn");
    const authActions = document.getElementById("auth-actions");

    const isAuthenticated = localStorage.getItem("email") !== null;


    function updateAuthUI() {
        if (isAuthenticated) {

            authActions.style.display = "flex";
            loginBtn.style.display = "none";
        } else {
            authActions.style.display = "none";
            loginBtn.style.display = "block";
        }
    }


    loginBtn.addEventListener("click", () => {
        window.location.href = "/src/pages/auth/LoginPage.html";
    });


    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("email");
        window.location.href = "/../../../index.html";
    });

    updateAuthUI();
});

let allRooms = [];
let allBookings = [];
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const roomsResponse = await fetch(
            "http://localhost:5291/api/Rooms/GetAllRooms"
        );
        if (!roomsResponse.ok) throw new Error("Ошибка загрузки комнат");
        allRooms = await roomsResponse.json();

        const bookingsResponse = await fetch(
            "http://localhost:5291/api/Reservation/GetAllReservations"
        );
        if (!bookingsResponse.ok)
            throw new Error("Ошибка загрузки бронирований");
        allBookings = await bookingsResponse.json();

        const urlParams = new URLSearchParams(window.location.search);
        const checkin = urlParams.get("checkin");
        const checkout = urlParams.get("checkout");
        const guests = urlParams.get("guests");

        if (checkin && checkout) {
            document.getElementById("checkin-date").value = checkin;
            document.getElementById("checkout-date").value = checkout;
            document.getElementById("guests").value = guests || 1;

            const filteredRooms = filterRooms(
                allRooms,
                allBookings,
                checkin,
                checkout,
                guests
            );
            renderRooms(filteredRooms);
        } else {
            renderRooms(allRooms);
        }

        document
            .getElementById("filterButton")
            .addEventListener("click", filterAvailableRooms);
    } catch (error) {
        console.error("Ошибка:", error);
        document.getElementById("roomsContainer").innerHTML = `
            <div class="error">${error.message}</div>
        `;
    }
});

function filterRooms(rooms, bookings, checkinDateStr, checkoutDateStr, guests) {
    const checkinDate = new Date(checkinDateStr);
    const checkoutDate = new Date(checkoutDateStr);
    const guestsCount = parseInt(guests) || 1;

    return rooms.filter((room) => {
        if (room.guests < guestsCount) {
            return false;
        }

        const roomBookings = bookings.filter((b) => b.roomId === room.id);

        return !roomBookings.some((booking) => {
            const bookingStart = new Date(booking.checkInDate);
            const bookingEnd = new Date(booking.checkOutDate);

            return (
                (checkinDate >= bookingStart && checkinDate < bookingEnd) ||
                (checkoutDate > bookingStart && checkoutDate <= bookingEnd) ||
                (checkinDate <= bookingStart && checkoutDate >= bookingEnd)
            );
        });
    });
}

function filterAvailableRooms() {
    const checkinInput = document.getElementById("checkin-date").value;
    const checkoutInput = document.getElementById("checkout-date").value;
    const guestsInput = parseInt(document.getElementById("guests").value) || 1;


    if (!checkinInput || !checkoutInput) {
        alert("Выберите обе даты!");
        return;
    }

    const checkinDate = new Date(checkinInput);
    const checkoutDate = new Date(checkoutInput);

    if (checkinDate >= checkoutDate) {
        alert("Дата выезда должна быть позже даты заезда!");
        return;
    }

    const availableRooms = filterRooms(
        allRooms,
        allBookings,
        checkinInput,
        checkoutInput,
        guestsInput
    );
    renderRooms(availableRooms);
}

function renderRooms(rooms) {
    const container = document.getElementById("roomsContainer");

    if (rooms.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    Нет доступных номеров на выбранные даты
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = rooms
        .map(
            (room) => `
          <div class="col-md-4 col-sm-6 mb-4">
                <div class="room-card">
                    <div class="room-slider">
                      ${room.images.length > 0
                    ? `
                        <div class="slider-container">
                          ${room.images
                        .map(
                            (image, index) => `
                        <div class="slide ${index === 0 ? "active" : ""}">
                            <img src="${image}" alt="Номер ${room.roomNumber
                                }" loading="lazy">
                        </div>
                      `
                        )
                        .join("")}
          
                ${room.images.length > 1
                        ? `
                  <div class="slider-controls">
                      <button class="slider-prev">&lt;</button>
                      <button class="slider-next">&gt;</button>
                    </div>
                  <div class="slider-dots"></div>
          `
                        : ""
                    }
      </div>
      `
                    : `
        <div class="no-image">Нет изображения</div>
      `
                }
    </div>

    <div class="room-info">
      <button class="info-btn" data-room-id="${room.id}">
        <i class='bx bx-info-circle'></i>
      </button>
      <h3>Номер ${room.roomNumber}</h3>
      <div class="room-meta">
        <span><i class="icon icon-type"></i> ${room.roomTypeName}</span>
        <span><i class="icon icon-floor"></i> ${room.floor} этаж</span>
        <span><i class="icon icon-guests"></i> ${room.guests} гостей</span>
        <span><i class="icon icon-area"></i> ${room.capacities} м²</span>
      </div>
      
      <div class="room-actions">
        <div class="room-price">
          <span>${room.price} Р</span>
        </div>
        <button class="book-btn" data-room-id="${room.id}" data-room-number="${room.roomNumber
                }">
          Забронировать
        </button>
      </div>
    </div>
  </div>
</div>
    `
        )
        .join("");

    document.querySelectorAll(".info-btn").forEach((button) => {
        button.addEventListener("click", function () {
            const roomId = this.getAttribute("data-room-id");
            const room = allRooms.find((r) => r.id === roomId);

            if (room) {
                document.getElementById("infoRoomNumber").textContent =
                    room.roomNumber;
                document.getElementById("infoDescription").textContent =
                    room.description || "Описание отсутствует";


                const amenitiesList = document.getElementById("infoAmenities");
                amenitiesList.innerHTML =
                    room.amenities && room.amenities.length > 0
                        ? room.amenities
                            .map((a) => `<li>${a.name}</li>`)
                            .join("")
                        : "<li>Нет информации об удобствах</li>";

                document.getElementById("infoModal").style.display = "block";
            }
        });

        document.querySelectorAll('.book-btn').forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();

                // Проверяем, авторизован ли пользователь (например, по наличию email в localStorage)
                const isLoggedIn = localStorage.getItem('email') !== null;

                if (!isLoggedIn) {
                    // Если не авторизован - перенаправляем на страницу входа
                    window.location.href = '/src/pages/auth/LoginPage.html'; 
                } else {
                    // Если авторизован - выполняем действие бронирования
                    const roomId = this.getAttribute('data-room-id');
                    const roomNumber = this.getAttribute('data-room-number');
                    bookRoom(roomId, roomNumber); // Ваша функция бронирования
                }
            });
        });
    });

    const bookButtons = document.querySelectorAll(".book-btn");
    bookButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const roomId = this.getAttribute("data-room-id");
            const roomNumber = this.getAttribute("data-room-number");

            const confirmBtn = document.getElementById("confirmBooking");
            confirmBtn.setAttribute("data-room-id", roomId);

            const checkinDate = document.getElementById("checkin-date").value;
            const checkoutDate = document.getElementById("checkout-date").value;
            const guests = document.getElementById("guests").value || 1;

            document.getElementById("modalRoomNumber").textContent = roomNumber;
            document.getElementById("modalCheckin").textContent = checkinDate;
            document.getElementById("modalCheckout").textContent = checkoutDate;
            document.getElementById("modalGuests").textContent = guests;

            document.getElementById("bookingModal").style.display = "block";
        });
    });

    document.querySelector(".close").addEventListener("click", function () {
        document.getElementById("bookingModal").style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target == document.getElementById("bookingModal")) {
            document.getElementById("bookingModal").style.display = "none";
        }
    });

    document
        .getElementById("confirmBooking")
        .addEventListener("click", function () {
            const roomId = this.getAttribute("data-room-id");
            const checkInDate = document.getElementById("checkin-date").value;
            const checkOutDate = document.getElementById("checkout-date").value;
            const email = localStorage.getItem("email");
            const createdAt = new Date().toISOString();

            const bookingData = {
                roomId: roomId,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                email: email,
                createdAt: createdAt,
            };

            console.log("Отправка данных:", bookingData);

            emailjs
                .send("service_mdybjpf", "template_tzw4jar", {
                    roomId: roomId,
                    checkIn: checkInDate,
                    checkOut: checkOutDate,
                    to_email: email,
                })
                .then(
                    () => {
                        alert("Письмо отправлено!");
                    },
                    (error) => {
                        alert("Ошибка: " + error.text);
                    }
                );

            fetch("http://localhost:5291/api/Reservation/AddReservation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bookingData),
            })
                .then((response) => {
                    if (!response.ok) throw new Error("Ошибка сервера");
                    return response.json();
                })
                .then((data) => {
                    alert("Бронирование успешно создано!");
                    document.getElementById("bookingModal").style.display =
                        "none";
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("Ошибка при бронировании: " + error.message);
                });
        });



    document.querySelectorAll(".info-modal .close").forEach((btn) => {
        btn.addEventListener("click", function () {
            document.getElementById("infoModal").style.display = "none";
        });
    });

    window.addEventListener("click", function (event) {
        if (event.target == document.getElementById("infoModal")) {
            document.getElementById("infoModal").style.display = "none";
        }
    });

    initRoomSliders();
}

function initRoomSliders() {
    document.querySelectorAll(".slider-container").forEach((container) => {
        const slides = container.querySelectorAll(".slide");
        if (slides.length === 0) return;

        const dotsContainer = container.querySelector(".slider-dots");
        let currentSlide = 0;

        slides[0].classList.add("active");


        if (slides.length > 1 && dotsContainer) {
            dotsContainer.innerHTML = "";
            slides.forEach((_, index) => {
                const dot = document.createElement("div");
                dot.classList.add("dot");
                if (index === 0) dot.classList.add("active");
                dot.addEventListener("click", () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
        }

        function goToSlide(index) {
            slides[currentSlide].classList.remove("active");
            slides[index].classList.add("active");

            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll(".dot");
                if (dots.length > 0) {
                    dots[currentSlide]?.classList.remove("active");
                    dots[index]?.classList.add("active");
                }
            }

            currentSlide = index;
        }
        const prevBtn = container.querySelector(".slider-prev");
        const nextBtn = container.querySelector(".slider-next");

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                const newIndex =
                    (currentSlide - 1 + slides.length) % slides.length;
                goToSlide(newIndex);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                const newIndex = (currentSlide + 1) % slides.length;
                goToSlide(newIndex);
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", initRoomSliders);
