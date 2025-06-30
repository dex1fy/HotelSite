import { SUPABASE_URL, SUPABASE_KEY } from "/src/shared/js/config.js";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const form = document.getElementById('login-form')

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        document.getElementById('email').classList.add('invalid');
        document.getElementById('password').classList.add('invalid');
        form.reset();
        alert("Произошла ошибка входа. Попробуйте снова"); 
    } else {
        localStorage.setItem('email', email);
        if(email === "admin@mail.ru"){
            window.location.href = "../../../AdminPanel.html";
        }else{
            window.location.href = "../../../index.html";
        }
    }
});