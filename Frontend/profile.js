document.addEventListener("DOMContentLoaded", () => {
    
    document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
        e.preventDefault();  
    
        localStorage.removeItem('email'); 
        
        window.location.href='index.html';  
        
    });
});


document.addEventListener('DOMContentLoaded', async () => {
    try {
        let email = localStorage.getItem("email");
        if (!email) throw new Error("Email не найден в localStorage");

        const guestResponse = await fetch(
            `http://localhost:5291/api/Profile/GetUser?email=${encodeURIComponent(
                email
            )}`
        );

        const reservationsResponse = await fetch(
            `http://localhost:5291/api/Profile/GetUserReservations?email=${encodeURIComponent(
                email
            )}`
        );

        if (!guestResponse.ok) throw new Error("Ошибка загрузки пользователя");
        const guest = await guestResponse.json();

        if (!reservationsResponse.ok) throw new Error("Ошибка загрузки бронирований");
        const reservations = await reservationsResponse.json();

        renderProfile(guest, reservations);

    } catch (error) {
        console.error("Ошибка:", error);
        document.getElementById("guest-container").innerHTML = `
            <div class="alert alert-error">
                Ошибка загрузки данных: ${error.message}
            </div>
        `;
    }
});

function renderProfile(guest, reservations) {
    const container = document.getElementById("guest-container");

    if (!guest || Object.keys(guest).length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                Нет профиля. Пожалуйста, заполните информацию о себе.
            </div>
        `;
        return;
    }

    // Генерация HTML для бронирований (карточки)
    let reservationsHtml = '';
    if (reservations && reservations.length > 0) {
        reservationsHtml = `
<div class="reservations-grid">
    <h3 class="reservations-title">Ваши бронирования</h3>
    <div class="reservations-list">
        ${reservations.map(reservation => `
            <div class="reservation-card" data-reservation-id="${reservation.id}">
                <div class="reservation-header">
                    <span class="reservation-id">Бронирование #${reservation.id}</span>
                    <span class="room-number">Номер ${reservation.roomNumber}</span>
                </div>
                <div class="reservation-dates">
                    <div class="date-group">
                        <span class="date-label">Заезд:</span>
                        <span class="date-value">${new Date(reservation.checkInDate).toLocaleDateString()}</span>
                    </div>
                    <div class="date-group">
                        <span class="date-label">Выезд:</span>
                        <span class="date-value">${new Date(reservation.checkOutDate).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="reservation-footer">
    <span class="created-at">Создано: ${new Date(reservation.createdAt).toLocaleString()}</span>
    <div class="footer-actions">
        <button class="delete-btn" data-reservation-id="${reservation.id}">
            <i class='bx bx-trash'></i> Отменить
        </button>
    </div>                          
</div>                       
            </div>
        `).join('')}
    </div>
</div>
        `;
    } else {
        reservationsHtml = `
            <div class="no-reservations">
                <div class="alert alert-warning">
                    У вас нет активных бронирований
                </div>
            </div>
        `;
    }

    // Основная структура страницы
    container.innerHTML = `
        <div class="profile-container">
            <div class="profile-card">
                <div class="profile-header">
                    <h2>Профиль</h2>
                </div>
                <div class="profile-content">
                    ${guest.guestName ? `<div class="profile-field"><strong>Имя:</strong> ${guest.guestName}</div>` : ''}
                    ${guest.guestSurname ? `<div class="profile-field"><strong>Фамилия:</strong> ${guest.guestSurname}</div>` : ''}
                    ${guest.guestPatronymic ? `<div class="profile-field"><strong>Отчество:</strong> ${guest.guestPatronymic}</div>` : ''}
                    ${guest.guestPhone ? `<div class="profile-field"><strong>Телефон:</strong> ${guest.guestPhone}</div>` : ''}
                    ${guest.guestEmail ? `<div class="profile-field"><strong>Email:</strong> ${guest.guestEmail}</div>` : ''}
                </div>
            </div>

    
            ${reservationsHtml}
        </div>
    `;
}

document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const reservationId = e.target.dataset.reservationId;
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