let allRooms = [];
let allBookings = [];
document.addEventListener("DOMContentLoaded", async () => {
    try {
        
        const roomsResponse = await fetch("http://localhost:5291/api/Rooms/GetAllRooms");
        if (!roomsResponse.ok) throw new Error("Ошибка загрузки комнат");
        allRooms = await roomsResponse.json();

        const bookingsResponse = await fetch("http://localhost:5291/api/Reservation/GetAllReservations");
        if (!bookingsResponse.ok) throw new Error("Ошибка загрузки бронирований");
        allBookings = await bookingsResponse.json();

        const urlParams = new URLSearchParams(window.location.search);
        const checkin = urlParams.get('checkin');
        const checkout = urlParams.get('checkout');
        const guests = urlParams.get('guests');

        if (checkin && checkout) {
            document.getElementById("checkin-date").value = checkin;
            document.getElementById("checkout-date").value = checkout;
            document.getElementById("guests").value = guests || 1;
            
            const filteredRooms = filterRooms(allRooms, allBookings, checkin, checkout, guests);
            renderRooms(filteredRooms);
        } else {
            renderRooms(allRooms);
        }

        document.getElementById("filterButton").addEventListener("click", filterAvailableRooms);
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

    const availableRooms = filterRooms(allRooms, allBookings, checkinInput, checkoutInput, guestsInput);
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
                <p>Описание: ${room.description}</p>
                <p>Вместимость: ${room.capacities}</p>
                <p>Цена: ${room.price} руб./ночь</p>
                <div class="amenities-section">
                    <h4>Удобства:</h4>
                    <ul>
                        ${room.amenities.map(a => `<li>${a.name}</li>`).join('') || '<li>Нет удобств</li>'}
                    </ul>
                </div>
                <button class="btn btn-primary book-btn" data-room-id="${room.id}">Забронировать</button>
            </div>
        </div>
    `
        )
        .join("");
}


// async function renderRooms(rooms) {
//     const container = document.getElementById("roomsContainer");

//     if (rooms.length === 0) {
//         container.innerHTML = `
//             <div class="col-12">
//                 <div class="alert alert-info">
//                     Нет доступных номеров на выбранные даты
//                 </div>
//             </div>
//         `;
//         return;
//     }

//     container.innerHTML = await Promise.all(
//         rooms.map(async (room) => {
//             // Получаем URL изображения (предполагаем, что room.imagePath содержит путь к фото)
//             let imageUrl = '';
//             if (room.photoPath) {
//                 const { data: { publicUrl } } = await supabase
//                     .storage
//                     .from('card') // Замените на имя вашего бакета
//                     .getPublicUrl(room.photoPath);
                
//                 imageUrl = publicUrl;
//             }

//             return `
//                 <div class="col-md-4 col-sm-6">
//                     <div class="room-card">
//                         ${imageUrl ? `
//                             <div class="room-image">
//                                 <img src="${imageUrl}" alt="Номер ${room.roomNumber}" 
//                                      class="img-fluid" 
//                                      onerror="this.src='https://placehold.co/600x400?text=Фото+не+загружено'">
//                             </div>
//                         ` : ''}
//                         <h3>Номер ${room.roomNumber}</h3>
//                         <p>Тип: ${room.roomTypeName}</p>
//                         <p>Этаж: ${room.floor}</p>
//                         <p>Вместимость: ${room.guests} гостей</p>
//                         <p>Описание: ${room.description}</p>
//                         <p>Вместимость: ${room.capacities}</p>
//                         <p>Цена: ${room.price} руб./ночь</p>
//                         <div class="amenities-section">
//                             <h4>Удобства:</h4>
//                             <ul>
//                                 ${room.amenities.map(a => `<li>${a.name}</li>`).join('') || '<li>Нет удобств</li>'}
//                             </ul>
//                         </div>
//                         <button class="btn btn-primary book-btn" data-room-id="${room.id}">Забронировать</button>
//                     </div>
//                 </div>
//             `;
//         })
//     ).then(htmlArray => htmlArray.join(''));
// }

