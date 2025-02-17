import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Importă BrowserRouter
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Învelește aplicația cu BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Dacă vrei să măsori performanța aplicației, poți folosi această funcție
reportWebVitals();
