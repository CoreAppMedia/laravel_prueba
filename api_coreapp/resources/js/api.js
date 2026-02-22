
// Esperar a que el DOM cargue completamente
document.addEventListener('DOMContentLoaded', () => {

    const btn = document.getElementById('btn-test-api');
    const resultDiv = document.getElementById('api-result');
    const jsonOutput = document.getElementById('json-output');

    // Solo ejecutar si el botón existe en la página actual
    if (btn) {
        btn.addEventListener('click', async () => {
            try {
                // Cambiar estado del botón
                btn.disabled = true;
                btn.innerText = 'Cargando...';
                resultDiv.classList.add('hidden');

                // Consumir la API usando Axios (configurado en bootstrap.js)
                const response = await axios.get('/api/test');

                // Mostrar resultado
                jsonOutput.textContent = JSON.stringify(response.data, null, 2);
                resultDiv.classList.remove('hidden');

            } catch (error) {
                console.error('Error:', error);
                jsonOutput.textContent = 'Error al conectar con la API: ' + error.message;
                jsonOutput.classList.replace('text-green-600', 'text-red-600');
                resultDiv.classList.remove('hidden');
            } finally {
                // Restaurar botón
                btn.disabled = false;
                btn.innerText = 'Consultar /api/test';
            }
        });
    }
});