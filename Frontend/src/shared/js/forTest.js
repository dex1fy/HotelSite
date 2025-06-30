

document.addEventListener('DOMContentLoaded', function() {
    const email = localStorage.getItem('email');
    const element = document.getElementById('forAuthTest');
    
    if (email && element) {
        element.textContent = email;
    } else {
        element.textContent = 'Гость'; 
    }
});



function checkAuth(){
    const email = localStorage.getItem('email'); 
    console.log(email)
    const btn = document.getElementById('auth-btn');
    const profIcon = document.getElementById('profile-ico');

    if(email){ 
        btn.style.display = 'none';
        profIcon.style.display = 'block';
    }else{
        btn.style.display = 'block';
        profIcon.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', checkAuth); // 