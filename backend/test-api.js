const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testAPI() {
  console.log('🧪 Probando API de AlterEgo Chain\n');

  try {
    // Test 1: Verificar que el servidor esté funcionando
    console.log('1️⃣ Probando endpoint de prueba...');
    const response1 = await axios.get(`${BASE_URL}/`);
    console.log('✅ Servidor funcionando:', response1.data.mensaje);
    console.log('📋 Rutas disponibles:', response1.data.rutas_disponibles);
    console.log('');

    // Test 2: Crear clon 0 con semilla válida
    console.log('2️⃣ Creando clon 0...');
    const testSeed = "Soy alguien que siempre se preocupa por lo que piensan los demás. Me cuesta tomar decisiones sin consultar a otros primero.";
    
    const response2 = await axios.post(`${BASE_URL}/crear-clon0`, {
      user_seed: testSeed
    });
    
    console.log('✅ Clon 0 creado exitosamente');
    console.log('🆔 ID:', response2.data.id);
    console.log('🤖 Respuesta del clon:', response2.data.respuesta_clon);
    console.log('');

    // Test 3: Probar con semilla vacía (debe fallar)
    console.log('3️⃣ Probando validación con semilla vacía...');
    try {
      await axios.post(`${BASE_URL}/crear-clon0`, {
        user_seed: ""
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Validación funcionando correctamente');
        console.log('❌ Error esperado:', error.response.data.error);
      } else {
        console.log('❌ Error inesperado:', error.message);
      }
    }
    console.log('');

    // Test 4: Probar con semilla muy larga
    console.log('4️⃣ Probando con semilla larga...');
    const longSeed = "Soy una persona muy introspectiva que pasa mucho tiempo pensando en mis decisiones. Me gusta analizar cada situación desde múltiples ángulos antes de actuar. A veces me paralizo por el exceso de análisis, pero también creo que esta reflexión me ha ayudado a tomar mejores decisiones en momentos importantes. Me preocupa no estar aprovechando mi potencial al máximo, pero también me da miedo cometer errores que puedan afectar a otros. Busco un equilibrio entre la acción y la reflexión.";
    
    const response4 = await axios.post(`${BASE_URL}/crear-clon0`, {
      user_seed: longSeed
    });
    
    console.log('✅ Clon 0 creado con semilla larga');
    console.log('🆔 ID:', response4.data.id);
    console.log('🤖 Respuesta del clon:', response4.data.respuesta_clon.substring(0, 100) + '...');
    console.log('');

    console.log('🎉 ¡Todas las pruebas completadas exitosamente!');
    console.log('📁 Revisa la carpeta conversaciones/ para ver los archivos JSON generados');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📄 Data:', error.response.data);
    }
  }
}

// Ejecutar pruebas
testAPI();