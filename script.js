let users = JSON.parse(localStorage.getItem('users')) || [];

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function registerUser() {
    const newUsername = document.getElementById('new-username').value;
    const newPassword = document.getElementById('new-password').value;

    if (newUsername && newPassword) {
        if (users.some(user => user.username === newUsername)) {
            document.getElementById('register-error').textContent = 'El usuario ya existe. Por favor, elige otro nombre de usuario.';
            return;
        }

        users.push({ username: newUsername, password: newPassword });
        saveUsers();

        document.getElementById('register-success').textContent = 'Usuario registrado con éxito.';
        document.getElementById('new-username').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('register-error').textContent = '';

        setTimeout(() => {
            showLoginForm();
            document.getElementById('register-success').textContent = '';
        }, 2000);
    } else {
        document.getElementById('register-error').textContent = 'Por favor, completa todos los campos.';
    }
}

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        document.getElementById("welcome-section").style.display = "block";
        document.getElementById("welcome-username").innerText = username;
        document.getElementById("login-section").style.display = "none";
        document.getElementById("classification-section").style.display = "block";
        document.getElementById("login-error").textContent = "";
    } else {
        document.getElementById("login-error").textContent = "Usuario o contraseña incorrectos.";
    }
}

function showRegisterForm() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('register-section').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
}

const subtipos = {
    superior: ['Camiseta', 'Camisa', 'Sudadera', 'Chaqueta', 'Blusa'],
    inferior: ['Pantalón', 'Short', 'Falda', 'Pants'],
    accesorio: ['Gorra', 'Sombrero', 'Bufanda', 'Cinturón', 'Guantes']
};

function actualizarSubtipos() {
    const tipoPrenda = document.querySelectorAll('.tipo-prenda');
    tipoPrenda.forEach(select => {
        select.addEventListener('change', function() {
            const subtipoPrenda = this.nextElementSibling;
            const tipo = this.value;
            subtipoPrenda.innerHTML = '<option value="">Seleccione subtipo</option>';
            if (tipo in subtipos) {
                subtipos[tipo].forEach(subtipo => {
                    const option = document.createElement('option');
                    option.value = subtipo.toLowerCase();
                    option.textContent = subtipo;
                    subtipoPrenda.appendChild(option);
                });
            }
        });
    });
}

function agregarPrenda() {
    const container = document.getElementById('prenda-container');
    const nuevaPrenda = document.createElement('div');
    nuevaPrenda.className = 'prenda-input';
    nuevaPrenda.innerHTML = `
        <select class="tipo-prenda">
            <option value="">Seleccione tipo</option>
            <option value="superior">Superior</option>
            <option value="inferior">Inferior</option>
            <option value="accesorio">Accesorio</option>
        </select>
        <select class="subtipo-prenda">
            <option value="">Seleccione subtipo</option>
        </select>
        <select class="material-prenda">
            <option value="">Seleccione material</option>
            <option value="poliester">Poliéster</option>
            <option value="algodon">Algodón</option>
            <option value="lana">Lana</option>
            <option value="mezclilla">Mezclilla</option>
        </select>
        <button type="button" class="remove-prenda">-</button>
    `;
    container.appendChild(nuevaPrenda);
    actualizarSubtipos();
}

function eliminarPrenda(event) {
    if (event.target.classList.contains('remove-prenda')) {
        event.target.closest('.prenda-input').remove();
    }
}

function clasificarPrendas() {
    const prendas = document.querySelectorAll('.prenda-input');
    const clasificacion = {
        superior: {},
        inferior: {},
        accesorio: {}
    };

    prendas.forEach(prenda => {
        const tipo = prenda.querySelector('.tipo-prenda').value;
        const subtipo = prenda.querySelector('.subtipo-prenda').value;
        const material = prenda.querySelector('.material-prenda').value;

        if (tipo && subtipo && material) {
            if (!clasificacion[tipo][subtipo]) {
                clasificacion[tipo][subtipo] = {};
            }
            if (!clasificacion[tipo][subtipo][material]) {
                clasificacion[tipo][subtipo][material] = 0;
            }
            clasificacion[tipo][subtipo][material]++;
        }
    });

    mostrarResultados(clasificacion);
}

function mostrarResultados(clasificacion) {
    const resultadosDiv = document.getElementById('classification-results');
    resultadosDiv.innerHTML = '';

    for (const tipo in clasificacion) {
        if (Object.keys(clasificacion[tipo]).length > 0) {
            const categoriaDiv = document.createElement('div');
            categoriaDiv.className = 'category';
            categoriaDiv.innerHTML = `<h4>${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h4>`;

            for (const subtipo in clasificacion[tipo]) {
                const subtipoDiv = document.createElement('div');
                subtipoDiv.className = 'subcategory';
                subtipoDiv.innerHTML = `<h5>${subtipo.charAt(0).toUpperCase() + subtipo.slice(1)}</h5>`;

                const materialList = document.createElement('ul');
                materialList.className = 'material-list';

                for (const material in clasificacion[tipo][subtipo]) {
                    const cantidad = clasificacion[tipo][subtipo][material];
                    const li = document.createElement('li');
                    li.textContent = `${material.charAt(0).toUpperCase() + material.slice(1)}: ${cantidad}`;
                    materialList.appendChild(li);
                }

                subtipoDiv.appendChild(materialList);
                categoriaDiv.appendChild(subtipoDiv);
            }

            resultadosDiv.appendChild(categoriaDiv);
        }
    }

    document.getElementById('classification-section').style.display = 'none';
    document.getElementById('results-section').style.display = 'block';
}

// Función para reiniciar la clasificación
function resetClassification() {
    document.getElementById('prenda-container').innerHTML = `
        <div class="prenda-input">
            <select class="tipo-prenda">
                <option value="">Seleccione tipo</option>
                <option value="superior">Superior</option>
                <option value="inferior">Inferior</option>
                <option value="accesorio">Accesorio</option>
            </select>
            <select class="subtipo-prenda">
                <option value="">Seleccione subtipo</option>
            </select>
            <select class="material-prenda">
                <option value="">Seleccione material</option>
                <option value="poliester">Poliéster</option>
                <option value="algodon">Algodón</option>
                <option value="lana">Lana</option>
                <option value="mezclilla">Mezclilla</option>
            </select>
            <button type="button" class="remove-prenda">-</button>
        </div>
    `;
    actualizarSubtipos();
    document.getElementById('results-section').style.display = 'none';
    document.getElementById('classification-section').style.display = 'block';
}

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('open');
}

function init() {
    document.getElementById('register-nav-btn').addEventListener('click', showRegisterForm);
    document.getElementById('menu-toggle').addEventListener('click', toggleMenu);
    document.getElementById('add-prenda').addEventListener('click', agregarPrenda);
    document.getElementById('prenda-container').addEventListener('click', eliminarPrenda);
    document.getElementById('classify-btn').addEventListener('click', clasificarPrendas);
    
    document.querySelector('#login-form button').addEventListener('click', login);
    
    actualizarSubtipos();

    const navLinks = document.querySelectorAll('#sidebar a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('open');
        });
    });
}

window.addEventListener('load', init);