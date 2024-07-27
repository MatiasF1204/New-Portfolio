document.addEventListener('DOMContentLoaded', function () {
    let formulario = document.getElementById('formulario');
    let errorNombre = document.getElementById('error-name');
    let errorCorreo = document.getElementById('error-correo');
    let errorAsunto = document.getElementById('error-asunto');
    let errorMensaje = document.getElementById('error-mensaje');
    let loading = document.querySelector('.loading');
    let sentMessage = document.querySelector('.sent-message');
    let errorMessage = document.querySelector('.error-message');

    formulario.addEventListener('submit', handleSubmit);

    function validarNombre() {
        let nombre = document.getElementById('name').value.trim();
        if (nombre.length === 0) {
            errorNombre.innerText = "Debe ingresar un nombre!";
            return false;
        }
        if (nombre.length <= 4) {
            errorNombre.innerText = "Escriba el nombre completo!";
            return false;
        }
        errorNombre.innerHTML = '<i class="bi bi-check-circle-fill" style="color: #1dd755; margin-top: 10px;"></i>';
        return true;
    }

    function validarCorreo() {
        let correo = document.getElementById('email').value.trim();
        if (correo.length === 0) {
            errorCorreo.innerHTML = "Debe ingresar un correo electrónico!";
            return false;
        }
        if (!correo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            errorCorreo.innerText = "El correo electrónico ingresado no es válido!";
            return false;
        }
        errorCorreo.innerHTML = '<i class="bi bi-check-circle-fill" style="color: #1dd755; margin-top: 10px;"></i>';
        return true;
    }

    function validarAsunto() {
        let asunto = document.getElementById('subject').value.trim();
        if (asunto.length === 0) {
            errorAsunto.innerHTML = "Debe ingresar un asunto!";
            return false;
        }
        errorAsunto.innerHTML = '<i class="bi bi-check-circle-fill" style="color: #1dd755; margin-top: 10px;"></i>';
        return true;
    }

    function validarMensaje() {
        let mensaje = document.getElementById('message').value.trim();
        const caracteresnecesarios = 15;
        const caracterespendientes = caracteresnecesarios - mensaje.length;
        if (caracterespendientes > 0) {
            errorMensaje.innerHTML = `Faltan ${caracterespendientes} caracteres.`;
            return false;
        }
        errorMensaje.innerHTML = '<i class="bi bi-check-circle-fill" style="color: #1dd755; margin-top: 10px;"></i>';
        return true;
    }

    async function handleSubmit(event) {
        event.preventDefault(); // Previene el envío automático del formulario

        let esValido = true;

        // Ejecutar todas las validaciones
        if (!validarNombre()) esValido = false;
        if (!validarCorreo()) esValido = false;
        if (!validarAsunto()) esValido = false;
        if (!validarMensaje()) esValido = false;

        if (esValido) {
            loading.style.display = 'block';
            sentMessage.style.display = 'none';
            errorMessage.style.display = 'none';

            let data = new FormData(formulario);
            try {
                let response = await fetch(formulario.action, {
                    method: formulario.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Solo mostrar mensaje de éxito
                    sentMessage.style.display = 'block';
                    formulario.reset();
                } else {
                    // Manejar errores si los hay
                    let errorData = await response.json();
                    if (errorData.errors) {
                        errorMessage.innerHTML = errorData.errors.map(error => error.message).join(", ");
                    } else {
                        errorMessage.innerHTML = "Oops! Hubo un problema al enviar el formulario.";
                    }
                    errorMessage.style.display = 'block';
                }
            } catch (error) {
                // Manejar errores de red
                errorMessage.innerHTML = "Oops! Hubo un problema al enviar el formulario.";
                errorMessage.style.display = 'block';
            } finally {
                loading.style.display = 'none';
            }
        }
    }
});
