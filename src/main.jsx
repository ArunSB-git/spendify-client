import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login.jsx";
import ServerCheck from "./ServerCheck";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login />} />

    <Route
      path="/*"
      element={
        <ServerCheck>
          <App />
        </ServerCheck>
      }
    />
  </Routes>
</BrowserRouter>
);

<BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login />} />

    <Route
      path="/*"
      element={
        <ServerCheck>
          <App />
        </ServerCheck>
      }
    />
  </Routes>
</BrowserRouter>
