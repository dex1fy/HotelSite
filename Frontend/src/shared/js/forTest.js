

document.addEventListener('DOMContentLoaded', function() {
    const email = localStorage.getItem('email');
    const element = document.getElementById('forAuthTest');
    
    if (email && element) {
        element.textContent = email;
    } else {
        element.textContent = 'Гость'; // или другое значение по умолчанию
    }
});


// ТЕСТОВЫЙ ФАЙЛ. ПРОВЕРЯЮ КАК РАБОТАЕТ ВХОД. ПОСЛЕ ВХОДА КНОПКА ВХОДА ДОЛЖНА МЕНЯТЬСЯ НА КАКОЙ-ЛИБО ДРУГОЙ ЭЛЕМЕНТ. 
function checkAuth(){
    const email = localStorage.getItem('email'); // ПОЛУЧАЕМ ТОКЕН
    console.log(email)
    const btn = document.getElementById('auth-btn');
    const profIcon = document.getElementById('profile-ico');

    if(email){ // ЕСЛИ ТОКЕН ЕСТЬ - ТО ОТОБРАЖАЕМ Х1 ЗАГЛУШКУ
        btn.style.display = 'none';
        profIcon.style.display = 'block';
    }else{
        btn.style.display = 'block';
        profIcon.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', checkAuth); // 