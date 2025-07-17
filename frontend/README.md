# AlterEgo Frontend

## 🚀 Installation and Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Steps to Run Locally

1. **Clone or download the project**
   ```bash
   cd frontend
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
   - By default, the app will run on `http://localhost:3000`
   - If you want to use another port (e.g. `5173`), create a `.env.local` file in the root with:
     ```
     PORT=5173
     ```
   - The application should be running now

> ⚠️ **Note**: Although the project uses Vite-like syntax and structure, it is actually built with **Next.js**, which defaults to port `3000`.

### Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm run lint` - Runs the linter
- `npm run start` - Starts the production server

## 🔧 Backend Configuration

Ensure your backend is running on `http://localhost:3001` before using the application.

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
- **Next.js** as the framework
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
- **CORS issues**: Ensure the backend has CORS configured for frontend's origin
- **Wrong port in browser**: Remember Next.js runs on `3000` unless overridden
- **Missing dependencies**: Run `npm install` again

## 📝 Development Notes

- The project uses **React.StrictMode** to detect potential issues
- Routes are configured with **path aliases** (`@/` points to `src/`)
- Global state is managed with **Context API**
- All components are typed with **TypeScript**