document.getElementById('registration-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const form = document.getElementById('registration-form')
    const email = document.getElementById('email')
    const password = document.getElementById('password')
    const confirmPassword = document.getElementById('confirm_password')
    const name = document.getElementById('name')

    const data = { email: email.value, password: password.value, confirmPassword: confirmPassword.value, name: name.value }

    let response = await fetch('http://localhost:5291/api/Authentication/RegisterGuest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    let err;
    if(response.ok){
        localStorage.setItem('email', email.value);
        window.location.href = "../../../index.html"; 
    }
    else{
        err = await response.json();
        email.classList.add('invalid');
        password.classList.add('invalid');
        confirmPassword.classList.add('invalid');
        name.classList.add('invalid');
        form.reset()
        alert("Произошла ошибка регистрации. Попробуйте снова")
    }
});
