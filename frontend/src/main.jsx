import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import WhatsAppSupport from "./components/WhatsAppSupport";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <WhatsAppSupport />
  </React.StrictMode>,
);
