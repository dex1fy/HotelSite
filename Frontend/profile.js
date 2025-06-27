document.addEventListener('DOMContentLoaded', async () =>  {
    try {
        let email = localStorage.getItem("email");
        if (!email) throw new Error("Email не найден в localStorage");

        const guestResponse = await fetch(
            `http://localhost:5291/api/Profile/GetUser?email=${encodeURIComponent(
                email
            )}`
        );

        if (!guestResponse.ok) throw new Error("Ошибка загрузки пользователя");
        const guest = await guestResponse.json();

        renderProfile(guest);
        
    } catch (error) {
        console.error("Ошибка:", error);
    }
});

function renderProfile(guest) {
    const container = document.getElementById("guest-container");
    console.log(guest);
    if (guest.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    net profilya
                </div>
            </div>
        `;
        return;
    }
            
    container.innerHTML = `
    <div>
        ${guest.guestName ? `<p>${guest.guestName}</p>` : ''}
        ${guest.guestSurname ? `<p>${guest.guestSurname}</p>` : ''}
        ${guest.guestPatronymic ? `<p>${guest.guestPatronymic}</p>` : ''}
        ${guest.guestPhone ? `<p>${guest.guestPhone}</p>` : ''}
        ${guest.guestEmail ? `<p>${guest.guestEmail}</p>` : ''}

    </div>`
}
