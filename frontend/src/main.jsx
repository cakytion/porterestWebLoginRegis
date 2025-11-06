import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./AuthContext";
import "./index.css"; // ถ้ามี

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* now the app can access value from auth context*/}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
