document.addEventListener("DOMContentLoaded", function () {
    let loggedUser = localStorage.getItem("loggedUser");
    if (!loggedUser) {
        window.location.href = "index.html"; 
        return;
    }
    mostrarUsuarios();
    mostrarTurnos();
});


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


function mostrarTurnos() {
    let loggedUser = localStorage.getItem("loggedUser");
    let turnos = JSON.parse(localStorage.getItem("turnosTabla")) || [];
    let tabla = document.getElementById("turnos-lista");
    tabla.innerHTML = "";

   
    let isAdmin = false;
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUser = users.find(user => user.username === loggedUser);
    if (currentUser && currentUser.isAdmin) {
        isAdmin = true;
    }

  
    if (isAdmin) {
        turnos.forEach((turno, index) => {
            tabla.innerHTML += `<tr><td>${turno.usuario}</td><td>${turno.fecha}</td><td>${turno.costo}</td>
                <td><button onclick="editarTurno(${index})">Editar</button>
                    <button onclick="eliminarTurno(${index})">Eliminar</button></td></tr>`;
        });
    } else {
        
        turnos.forEach((turno, index) => {
            if (turno.usuario === loggedUser) {
                tabla.innerHTML += `<tr><td>${turno.usuario}</td><td>${turno.fecha}</td><td>${turno.costo}</td>
                    <td><button onclick="editarTurno(${index})">Editar</button>
                        <button onclick="eliminarTurno(${index})">Eliminar</button></td></tr>`;
            }
        });
    }
}


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


function eliminarTurno(index) {
    let loggedUser = localStorage.getItem("loggedUser");
    let turnos = JSON.parse(localStorage.getItem("turnosTabla")) || [];
    let users = JSON.parse(localStorage.getItem("users")) || [];

    
    let isAdmin = false;
    let currentUser = users.find(user => user.username === loggedUser);
    if (currentUser && currentUser.isAdmin) {
        isAdmin = true;
    }

    
    if (isAdmin || turnos[index].usuario === loggedUser) {
        const confirmar = confirm("¿Estás seguro de que deseas eliminar este turno?");
        if (confirmar) {
            turnos.splice(index, 1);
            localStorage.setItem("turnosTabla", JSON.stringify(turnos));
            mostrarTurnos(); 
        }
    } else {
        alert("No tienes permiso para eliminar este turno.");
    }
}

function editarTurno(index) {
    let loggedUser = localStorage.getItem("loggedUser");
    let turnos = JSON.parse(localStorage.getItem("turnosTabla")) || [];
    let users = JSON.parse(localStorage.getItem("users")) || [];

   
    let isAdmin = false;
    let currentUser = users.find(user => user.username === loggedUser);
    if (currentUser && currentUser.isAdmin) {
        isAdmin = true;
    }

   
    if (isAdmin || turnos[index].usuario === loggedUser) {
       
        const nuevoFecha = prompt("Ingresa la nueva fecha y hora", turnos[index].fecha);
        const nuevoCosto = prompt("Ingresa el nuevo costo", turnos[index].costo);

        if (nuevoFecha && nuevoCosto) {
            turnos[index].fecha = nuevoFecha;
            turnos[index].costo = nuevoCosto;
            localStorage.setItem("turnosTabla", JSON.stringify(turnos));
            mostrarTurnos(); 
        }
    } else {
        alert("No tienes permiso para editar este turno.");
    }
}


function logout() {
    localStorage.removeItem("loggedUser");
    window.location.href = "index.html";  
}

