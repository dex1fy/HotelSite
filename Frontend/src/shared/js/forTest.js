

document.addEventListener('DOMContentLoaded', function() {
    const email = localStorage.getItem('email');
    const element = document.getElementById('forAuthTest');
    
    if (email && element) {
        element.textContent = email;
    } else {
        element.textContent = 'Гость'; // или другое значение по умолчанию
    }
});