import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/client">
      <App />
      <Toaster
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "13px",
            fontFamily: "'DM Sans', sans-serif",
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
);
