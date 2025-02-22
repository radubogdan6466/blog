import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom"; // Importă BrowserRouter
import store from "./getposts/Store"; // Asigură-te că ai importat corect store-ul
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      {" "}
      {/* Wrapping the entire app in BrowserRouter */}
      <App />
    </BrowserRouter>
  </Provider>
);
