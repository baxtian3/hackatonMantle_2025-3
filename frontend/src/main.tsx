import React from "react"
import ReactDOM from "react-dom/client"
import { CloneProvider } from "./contexts/CloneContext"
import AlterEgoApp from "./components/AlterEgoApp"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CloneProvider>
      <AlterEgoApp />
    </CloneProvider>
  </React.StrictMode>,
)
