import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../frontend/src/app.jsx'
import './index.css' // File ini berisi directive Tailwind (@tailwind base; dst)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)