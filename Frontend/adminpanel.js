document.addEventListener("DOMContentLoaded", () => {
    
    document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
        e.preventDefault();  
    
        localStorage.removeItem('email'); 
        
        window.location.href='index.html';  
        
    });
});


document.addEventListener("DOMContentLoaded", async () => {
    try {
        const allReservationsResponse = await fetch(
            "http://localhost:5291/api/Admin/GetAllReservations"
        );

        if (!allReservationsResponse.ok)
            throw new Error("Ошибка загрузки пользователя");
        const allReservations = await allReservationsResponse.json();

        renderReservations(allReservations);
    } catch (error) {
        console.error("Ошибка:", error);
    }
});


function renderReservations(allReservations) {
    const container = document.getElementById("admin-container");
    console.log(allReservations); 

    if (!allReservations || Object.keys(allReservations).length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    Нет бронирований
                </div>
            </div>
        `;
        return;
    }

    let reservationsHtml = "";
    if (allReservations && allReservations.length > 0) {
        reservationsHtml = `
            <div class="reservations-section mt-4">
                <h4>Все бронирования</h4>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Почта гостя</th>
                            <th>Имя гостя</th>
                            <th>Номер</th>
                            <th>Дата заезда</th>
                            <th>Дата выезда</th>
                            <th>Дата создания брони</th>
                            <th> </th>
                        </tr>
                    </thead>
                    <tbody>
                        ${allReservations
                            .map(
                                (allReservation) => `
                            <tr>
                                <td>${allReservation.email}</td>
                                <td>${allReservation.guestName}</td>
                                <td>${allReservation.roomNumber}</td>
                                <td>${new Date(
                                    allReservation.checkInDate
                                ).toLocaleDateString()}</td>
                                <td>${new Date(
                                    allReservation.checkOutDate
                                ).toLocaleDateString()}</td>
                                <td>${new Date(
                                    allReservation.createdAt
                                ).toLocaleString()}</td>
                                <td><button class="delete-btn" data-id="${allReservation.id}">Удалить</button></td>
                            </tr>
                        `
                            )
                            .join("")}
                    </tbody>
                </table>
            </div>
        `;
    }
    container.innerHTML = reservationsHtml;
}

document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const reservationId = e.target.dataset.id;
        await deleteReservation(reservationId);
    }
});

async function deleteReservation(reservationId) {
    const response = await fetch(
        `http://localhost:5291/api/Admin/DeleteReservation?reservationId=${reservationId}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error("Ошибка при удалении бронирования");
    }

    const result = await response.json();
    console.log("Резервация удалена:", result);

    location.reload();
}