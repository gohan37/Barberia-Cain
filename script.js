document.addEventListener("DOMContentLoaded", function () {
    let loggedUser = localStorage.getItem("loggedUser");
    if (!loggedUser) {
        window.location.href = "index.html";  // Redirige al login si no hay usuario logueado
        return;
    }
    mostrarUsuarios();
    mostrarTurnos();
});

// Mostrar los usuarios en el formulario de agendar
function mostrarUsuarios() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let usuarioSelect = document.getElementById("usuario");

    usuarioSelect.innerHTML = "";
    users.forEach(user => {
        let option = document.createElement("option");
        option.value = user.username;
        option.textContent = user.username;
        usuarioSelect.appendChild(option);
    });
}

// Mostrar los turnos según si el usuario es admin o no
function mostrarTurnos() {
    let loggedUser = localStorage.getItem("loggedUser");
    let turnos = JSON.parse(localStorage.getItem("turnosTabla")) || [];
    let tabla = document.getElementById("turnos-lista");
    tabla.innerHTML = "";

    // Verificar si el usuario es el administrador
    let isAdmin = false;
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUser = users.find(user => user.username === loggedUser);
    if (currentUser && currentUser.isAdmin) {
        isAdmin = true;
    }

    // Si es el admin, mostrar todos los turnos
    if (isAdmin) {
        turnos.forEach((turno, index) => {
            tabla.innerHTML += `<tr><td>${turno.usuario}</td><td>${turno.fecha}</td><td>${turno.costo}</td>
                <td><button onclick="editarTurno(${index})">Editar</button>
                    <button onclick="eliminarTurno(${index})">Eliminar</button></td></tr>`;
        });
    } else {
        // Si es un usuario normal, solo puede ver y modificar sus propios turnos
        turnos.forEach((turno, index) => {
            if (turno.usuario === loggedUser) {
                tabla.innerHTML += `<tr><td>${turno.usuario}</td><td>${turno.fecha}</td><td>${turno.costo}</td>
                    <td><button onclick="editarTurno(${index})">Editar</button>
                        <button onclick="eliminarTurno(${index})">Eliminar</button></td></tr>`;
            }
        });
    }
}

// Agregar turno
document.getElementById("turno-form").addEventListener("submit", function (event) {
    event.preventDefault();

    let fecha = document.getElementById("fecha-hora").value;
    let costo = document.getElementById("costo").value;
    let loggedUser = localStorage.getItem("loggedUser");

    if (!fecha || !costo) {
        alert("Por favor, selecciona una fecha, hora y costo.");
        return;
    }

    let turnos = JSON.parse(localStorage.getItem("turnosTabla")) || [];
    turnos.push({ usuario: loggedUser, fecha, costo });
    localStorage.setItem("turnosTabla", JSON.stringify(turnos));
    mostrarTurnos();
});

// Eliminar turno
function eliminarTurno(index) {
    let loggedUser = localStorage.getItem("loggedUser");
    let turnos = JSON.parse(localStorage.getItem("turnosTabla")) || [];
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Verificar si el usuario logueado es admin
    let isAdmin = false;
    let currentUser = users.find(user => user.username === loggedUser);
    if (currentUser && currentUser.isAdmin) {
        isAdmin = true;
    }

    // Si es admin o el turno pertenece al usuario logueado, proceder con la eliminación
    if (isAdmin || turnos[index].usuario === loggedUser) {
        const confirmar = confirm("¿Estás seguro de que deseas eliminar este turno?");
        if (confirmar) {
            turnos.splice(index, 1);
            localStorage.setItem("turnosTabla", JSON.stringify(turnos));
            mostrarTurnos(); // Volver a mostrar los turnos actualizados
        }
    } else {
        alert("No tienes permiso para eliminar este turno.");
    }
}

function editarTurno(index) {
    let loggedUser = localStorage.getItem("loggedUser");
    let turnos = JSON.parse(localStorage.getItem("turnosTabla")) || [];
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Verificar si el usuario logueado es admin
    let isAdmin = false;
    let currentUser = users.find(user => user.username === loggedUser);
    if (currentUser && currentUser.isAdmin) {
        isAdmin = true;
    }

    // Si es admin, o el turno pertenece al usuario logueado, proceder con la edición
    if (isAdmin || turnos[index].usuario === loggedUser) {
        // Aquí puedes abrir un formulario para editar los turnos (similar al agregar turno)
        const nuevoFecha = prompt("Ingresa la nueva fecha y hora", turnos[index].fecha);
        const nuevoCosto = prompt("Ingresa el nuevo costo", turnos[index].costo);

        if (nuevoFecha && nuevoCosto) {
            turnos[index].fecha = nuevoFecha;
            turnos[index].costo = nuevoCosto;
            localStorage.setItem("turnosTabla", JSON.stringify(turnos));
            mostrarTurnos(); // Volver a mostrar los turnos actualizados
        }
    } else {
        alert("No tienes permiso para editar este turno.");
    }
}

// Cerrar sesión
function logout() {
    localStorage.removeItem("loggedUser");
    window.location.href = "index.html";  // Redirigir al login
}

