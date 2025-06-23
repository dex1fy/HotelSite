import { SUPABASE_URL, SUPABASE_KEY } from "/src/shared/js/config.js";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

//ЛОГИН ПРОИСХОДИТ НА СТОРОНЕ ФРОНТА !!
// получение полей email password с формы входа
document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // страница не перезагрузится

    // получение полей
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const form = document.getElementById('login-form')

    // подключение к супабейз
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        document.getElementById('email').classList.add('invalid');
        document.getElementById('password').classList.add('invalid');
        form.reset();
        alert("Произошла ошибка входа. Попробуйте снова"); // обработка ошибки
    } else {
        localStorage.setItem('email', email);
        window.location.href = "../../../index.html";
    }
});


