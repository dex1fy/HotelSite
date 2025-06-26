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
