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
        console.log(allBookings);

        renderRooms(allRooms);

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

    const availableRooms = allRooms.filter((room) => {
        if (room.guests < guestsInput) {
            return false;
        }
        
        const roomBookings = allBookings.filter((b) => b.roomId === room.id);

        const isAvailable = !roomBookings.some((booking) => {
            const bookingStart = new Date(booking.checkInDate);
            const bookingEnd = new Date(booking.checkOutDate);

            return (
                (checkinDate >= bookingStart && checkinDate < bookingEnd) ||
                (checkoutDate > bookingStart && checkoutDate <= bookingEnd) ||
                (checkinDate <= bookingStart && checkoutDate >= bookingEnd)
            );
        });

        return isAvailable;
    });

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
        <div class="col-md-4 col-sm-6">
            <div class="room-card">
                <h3>Номер ${room.roomNumber}</h3>
                <p>Тип: ${room.roomTypeName}</p>
                <p>Этаж: ${room.floor}</p>
                <p>Вместимость: ${room.guests} гостей</p>
                <p>${room.description}</p>
        
            </div>
        </div>
    `
        )
        .join("");
}
