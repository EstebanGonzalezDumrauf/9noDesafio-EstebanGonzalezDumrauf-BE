const form = document.getElementById('resetPassForm');

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('resetPassForm');
    const userField = document.getElementById('email');

    form.addEventListener('submit', function (event) {
        if (!validateEmail(userField.value)) {
            event.preventDefault();
            alert('Por favor, ingrese una dirección de correo electrónico válida.');
        }
    });

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});

form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const data = new FormData(form);

    const obj = {};

    data.forEach((value, key) => obj[key] = value);

    // Obtener el token de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    fetch(`/api/sessions/resetPassword/${token}`, {
        method: 'POST', 
        body: JSON.stringify(obj),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            window.location.href = '/';
        } else if (result.status === 400) {
            const msjErrorLabel = document.getElementById('msjErrorReset');
            msjErrorLabel.textContent = "Error al intentar restaurar el password.";
        } else if (result.status === 401) {
            const msjErrorLabel = document.getElementById('msjErrorReset');
            msjErrorLabel.textContent = "El enlace no es válido o ha expirado.";
        }
    }).catch(error => {
        console.error('Error al realizar la solicitud:', error);
    });
});

