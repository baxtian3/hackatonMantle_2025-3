# AlterEgo Chain Frontend

Una aplicación web minimalista para crear y gestionar clones introspectivos de tu conciencia, representados como un grafo interactivo de nodos conectados.

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos para ejecutar localmente

1. **Clona o descarga el proyecto**
   \`\`\`bash
   cd alterego-chain-frontend
   \`\`\`

2. **Instala las dependencias**
   \`\`\`bash
   npm install
   \`\`\`

3. **Inicia el servidor de desarrollo**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Abre tu navegador**
   - Ve a `http://localhost:5173`
   - La aplicación debería estar funcionando

### Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## 🔧 Configuración del Backend

Asegúrate de que tu backend de AlterEgo Chain esté ejecutándose en `http://localhost:3001` antes de usar la aplicación.

El frontend espera los siguientes endpoints:
- `POST /crear-clon0`
- `POST /continuar-clon0`
- `POST /bifurcar`
- `POST /continuar-bifurcado`

## 🎨 Características

- **Interfaz minimalista** con fondo blanco y tipografía limpia
- **Grafo interactivo** que muestra los clones como nodos conectados
- **Chat en tiempo real** con cada clon individual
- **Sistema de bifurcación** hacia Futuro, Universo paralelo o Desconocida
- **Responsive design** que se adapta a diferentes tamaños de pantalla

## 🛠️ Tecnologías

- **React 18** con TypeScript
- **Vite** como bundler y servidor de desarrollo
- **TailwindCSS** para estilos
- **react-force-graph-2d** para la visualización del grafo
- **Lucide React** para iconos

## 📁 Estructura del Proyecto

\`\`\`
src/
├── components/
│   ├── ui/           # Componentes UI básicos
│   ├── AlterEgoApp.tsx
│   ├── ChatPanel.tsx
│   ├── GraphView.tsx
│   └── InitialScreen.tsx
├── contexts/
│   └── CloneContext.tsx
├── lib/
│   └── utils.ts
├── index.css
└── main.tsx
\`\`\`

## 🔄 Flujo de la Aplicación

1. **Pantalla inicial**: El usuario describe su personalidad
2. **Creación del clon base**: Se genera el primer nodo en el grafo
3. **Interacción**: Click en nodos para abrir conversaciones
4. **Bifurcación**: Crear nuevas versiones del clon
5. **Expansión**: El grafo crece como un árbol de conciencia

## 🐛 Solución de Problemas

- **Error de conexión**: Verifica que el backend esté ejecutándose en el puerto 3001
- **Problemas de CORS**: Asegúrate de que el backend tenga configurado CORS para localhost:5173
- **Dependencias faltantes**: Ejecuta `npm install` nuevamente

## 📝 Notas de Desarrollo

- El proyecto usa **React.StrictMode** para detectar problemas potenciales
- Las rutas están configuradas con **path aliases** (`@/` apunta a `src/`)
- El estado global se maneja con **Context API**
- Todos los componentes están tipados con **TypeScript**
