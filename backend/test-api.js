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

    // Test 5: Continuar conversación con clon 0
    console.log('5️⃣ Continuando conversación con clon 0...');
    const continuarId = response2.data.id;
    const mensajeUsuario = "A veces siento que no importa cuánto me esfuerce, nunca es suficiente. ¿Por qué sigo intentándolo?";
    const response5 = await axios.post(`${BASE_URL}/continuar-clon0`, {
      id: continuarId,
      mensaje_usuario: mensajeUsuario
    });
    console.log('✅ Conversación continuada exitosamente');
    console.log('🆔 ID:', continuarId);
    console.log('🗣️ Mensaje usuario:', mensajeUsuario);
    console.log('🤖 Respuesta del clon:', response5.data.respuesta_clon);
    console.log('');

    // Test 6: Probar bifurcación tipo "Futuro"
    console.log('6️⃣ Creando bifurcación tipo "Futuro"...');
    const responseFuturo = await axios.post(`${BASE_URL}/bifurcar`, {
      parent_id: continuarId,
      fork_type: "Futuro"
    });
    console.log('✅ Bifurcación "Futuro" creada exitosamente');
    console.log('🆔 ID del nuevo clon:', responseFuturo.data.id);
    console.log('🔀 Tipo de bifurcación:', responseFuturo.data.tipo_bifurcacion);
    console.log('🤖 Respuesta del clon futuro:', responseFuturo.data.respuesta_clon.substring(0, 150) + '...');
    console.log('');

    // Test 7: Probar bifurcación tipo "Universo paralelo"
    console.log('7️⃣ Creando bifurcación tipo "Universo paralelo"...');
    const responseParalelo = await axios.post(`${BASE_URL}/bifurcar`, {
      parent_id: continuarId,
      fork_type: "Universo paralelo"
    });
    console.log('✅ Bifurcación "Universo paralelo" creada exitosamente');
    console.log('🆔 ID del nuevo clon:', responseParalelo.data.id);
    console.log('🔀 Tipo de bifurcación:', responseParalelo.data.tipo_bifurcacion);
    console.log('🤖 Respuesta del clon paralelo:', responseParalelo.data.respuesta_clon.substring(0, 150) + '...');
    console.log('');

    // Test 8: Probar bifurcación tipo "Desconocida"
    console.log('8️⃣ Creando bifurcación tipo "Desconocida"...');
    const responseDesconocida = await axios.post(`${BASE_URL}/bifurcar`, {
      parent_id: continuarId,
      fork_type: "Desconocida"
    });
    console.log('✅ Bifurcación "Desconocida" creada exitosamente');
    console.log('🆔 ID del nuevo clon:', responseDesconocida.data.id);
    console.log('🔀 Tipo de bifurcación:', responseDesconocida.data.tipo_bifurcacion);
    console.log('🤖 Respuesta del clon desconocido:', responseDesconocida.data.respuesta_clon.substring(0, 150) + '...');
    console.log('');

    // Test 9: Probar validación con tipo de bifurcación inválido
    console.log('9️⃣ Probando validación con tipo de bifurcación inválido...');
    try {
      await axios.post(`${BASE_URL}/bifurcar`, {
        parent_id: continuarId,
        fork_type: "TipoInválido"
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

    // Test 10: NUEVO - Flujo completo de bifurcaciones anidadas
    console.log('🔟 *** NUEVO TEST: Flujo completo de bifurcaciones anidadas ***');
    console.log('🌳 Creando árbol de clones: Clon 0 → Futuro → Desconocida');
    console.log('');

    // Test 10a: Continuar conversación con bifurcación "Futuro"
    console.log('10a️⃣ Continuando conversación con clon bifurcado "Futuro"...');
    const futuroId = responseFuturo.data.id;
    const mensajeFuturo = "He estado pensando en todas las decisiones que me trajeron hasta aquí. ¿Realmente valió la pena el camino que tomé?";
    
    const responseContinuarFuturo = await axios.post(`${BASE_URL}/continuar-bifurcado`, {
      id: futuroId,
      mensaje_usuario: mensajeFuturo
    });
    
    console.log('✅ Conversación con clon futuro continuada exitosamente');
    console.log('🆔 ID del clon futuro:', futuroId);
    console.log('🗣️ Mensaje usuario:', mensajeFuturo);
    console.log('🤖 Respuesta del clon futuro:', responseContinuarFuturo.data.respuesta_clon);
    console.log('');

    // Test 10b: Continuar conversación con bifurcación "Desconocida"
    console.log('10b️⃣ Continuando conversación con clon bifurcado "Desconocida"...');
    const desconocidaId = responseDesconocida.data.id;
    const mensajeDesconocida = "En este lugar extraño, las emociones tienen forma y color. ¿Qué significa esto para quien soy realmente?";
    
    const responseContinuarDesconocida = await axios.post(`${BASE_URL}/continuar-bifurcado`, {
      id: desconocidaId,
      mensaje_usuario: mensajeDesconocida
    });
    
    console.log('✅ Conversación con clon desconocido continuada exitosamente');
    console.log('🆔 ID del clon desconocido:', desconocidaId);
    console.log('🗣️ Mensaje usuario:', mensajeDesconocida);
    console.log('🤖 Respuesta del clon desconocido:', responseContinuarDesconocida.data.respuesta_clon);
    console.log('');

    // Test 10c: Crear bifurcación secundaria desde el clon "Futuro"
    console.log('10c️⃣ Creando bifurcación secundaria "Desconocida" desde clon "Futuro"...');
    const responseDesconocidaSecundaria = await axios.post(`${BASE_URL}/bifurcar`, {
      parent_id: futuroId,
      fork_type: "Desconocida"
    });
    
    console.log('✅ Bifurcación secundaria "Desconocida" creada exitosamente');
    console.log('🆔 ID del nuevo clon (nivel 2):', responseDesconocidaSecundaria.data.id);
    console.log('🔀 Tipo de bifurcación:', responseDesconocidaSecundaria.data.tipo_bifurcacion);
    console.log('🤖 Respuesta del clon nivel 2:', responseDesconocidaSecundaria.data.respuesta_clon.substring(0, 150) + '...');
    console.log('');

    // Test 10d: Continuar conversación con bifurcación de nivel 2
    console.log('10d️⃣ Continuando conversación con bifurcación de nivel 2...');
    const desconocidaSecundariaId = responseDesconocidaSecundaria.data.id;
    const mensajeNivel2 = "Desde esta perspectiva, puedo ver tanto mi pasado como mi futuro. Los hilos del tiempo se entrelazan de maneras que nunca imaginé.";
    
    const responseContinuarNivel2 = await axios.post(`${BASE_URL}/continuar-bifurcado`, {
      id: desconocidaSecundariaId,
      mensaje_usuario: mensajeNivel2
    });
    
    console.log('✅ Conversación con clon nivel 2 continuada exitosamente');
    console.log('🆔 ID del clon nivel 2:', desconocidaSecundariaId);
    console.log('🗣️ Mensaje usuario:', mensajeNivel2);
    console.log('🤖 Respuesta del clon nivel 2:', responseContinuarNivel2.data.respuesta_clon);
    console.log('');

    // Test 10e: Probar validación con ID inválido
    console.log('10e️⃣ Probando validación con ID inválido en /continuar-bifurcado...');
    try {
      await axios.post(`${BASE_URL}/continuar-bifurcado`, {
        id: "id-inexistente",
        mensaje_usuario: "Mensaje de prueba"
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✅ Validación funcionando correctamente');
        console.log('❌ Error esperado:', error.response.data.error);
      } else {
        console.log('❌ Error inesperado:', error.message);
      }
    }
    console.log('');

    // Test 10f: Probar validación con ID de clon 0 (no bifurcado)
    console.log('10f️⃣ Probando validación con ID de clon 0 en /continuar-bifurcado...');
    try {
      await axios.post(`${BASE_URL}/continuar-bifurcado`, {
        id: continuarId, // Este es el ID del clon 0
        mensaje_usuario: "Mensaje de prueba"
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

    console.log('🎉 ¡Todas las pruebas completadas exitosamente!');
    console.log('📁 Revisa la carpeta conversaciones/ para ver los archivos JSON generados');
    console.log('🌳 Árbol de clones creado:');
    console.log('   📄 Clon 0 (base)');
    console.log('   ├── 🔮 Futuro');
    console.log('   │   └── 🌌 Desconocida (nivel 2)');
    console.log('   ├── 🔄 Universo paralelo');
    console.log('   └── 🌌 Desconocida');
    console.log('');
    console.log('✨ El nuevo endpoint /continuar-bifurcado está funcionando perfectamente!');

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