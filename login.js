

function mostrarRegistro() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
}

function mostrarLogin() {
    document.getElementById("register-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
}

function register() {
    let username = document.getElementById("register-username").value;
    let password = document.getElementById("register-password").value;

    if (!username || !password) {
        alert("Completa todos los campos.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    if (users.find(user => user.username === username)) {
        alert("El usuario ya existe.");
        return;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registro exitoso. Ahora inicia sesión.");
    mostrarLogin();
}

function login() {
    let username = document.getElementById("login-username").value;
    let password = document.getElementById("login-password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(user => user.username === username && user.password === password);
    
    if (user) {
        localStorage.setItem("loggedUser", username);
        window.location.href = "turnos.html"; 
    } else {
        alert("Usuario o contraseña incorrectos.");
    }

    
}

function register() {
    let username = document.getElementById("register-username").value;
    let password = document.getElementById("register-password").value;

    if (!username || !password) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    
   
    if (username.toLowerCase() === "admin" && password === "admin123") {
        users.push({ username: username, password: password, isAdmin: true });
    } else {
        users.push({ username: username, password: password, isAdmin: false });
    }
    
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registro exitoso.");
    window.location.href = "index.html"; 
}

