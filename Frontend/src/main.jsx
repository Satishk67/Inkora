import { UserContextProvider } from "./Context/UserContext.jsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

const savedTheme = localStorage.getItem("inkora_theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserContextProvider>
      <App />
    </UserContextProvider>
  </BrowserRouter>,
);
