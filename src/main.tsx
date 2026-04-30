//  src/main.tsx
import { createRoot } from "react-dom/client"
import "./styles/theme/light.css"
import "./styles/theme/dark.css"
import "./index.css"
import "./styles/table.css"
import "./styles/layout.css"
import "./styles/form.css"
import "./styles/button.css"
import App from "./App"

createRoot(document.getElementById('root')!).render(<App />)
