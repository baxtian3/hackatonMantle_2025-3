# AlterEgo Chain Frontend

A minimalist web application for creating and managing introspective clones of your consciousness, represented as an interactive graph of connected nodes.

## 🚀 Installation and Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Steps to Run Locally

1. **Clone or download the project**
   ```bash
   cd alterego-chain-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Go to `http://localhost:5173`
   - The application should be running

### Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm run preview` - Previews the production build
- `npm run lint` - Runs the linter

## 🔧 Backend Configuration

Ensure your AlterEgo Chain backend is running on `http://localhost:3001` before using the application.

The frontend expects the following endpoints:
- `POST /create-clone0`
- `POST /continue-clone0`
- `POST /fork`
- `POST /continue-fork`

## 🎨 Features

- **Minimalist interface** with a white background and clean typography
- **Interactive graph** displaying clones as connected nodes
- **Real-time chat** with each individual clone
- **Bifurcation system** for Future, Parallel Universe, or Unknown paths
- **Responsive design** adapting to different screen sizes

## 🛠️ Technologies

- **React 18** with TypeScript
- **Vite** as the bundler and development server
- **TailwindCSS** for styling
- **react-force-graph-2d** for graph visualization
- **Lucide React** for icons

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # Basic UI components
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
```

## 🔄 Application Flow

1. **Initial screen**: User describes their personality
2. **Base clone creation**: Generates the first node in the graph
3. **Interaction**: Click on nodes to open conversations
4. **Bifurcation**: Create new versions of the clone
5. **Expansion**: The graph grows as a tree of consciousness

## 🐛 Troubleshooting

- **Connection error**: Verify the backend is running on port 3001
- **CORS issues**: Ensure the backend has CORS configured for localhost:5173
- **Missing dependencies**: Run `npm install` again

## 📝 Development Notes

- The project uses **React.StrictMode** to detect potential issues
- Routes are configured with **path aliases** (`@/` points to `src/`)
- Global state is managed with **Context API**
- All components are typed with **TypeScript**