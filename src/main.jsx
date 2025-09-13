import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRouter from './components/PrivateRoute.jsx';
import Login from './pages/login.jsx';
import App from './App.jsx';
import React from 'react';

ReactDOM.createRoot(document,getElementById("root")).render(

    <React.StrictMode>
        <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path = "/usuarios" element={
                    <PrivateRouter>
                        <App />
                    </PrivateRouter>
                } 
            />

                <Route path='*' element={< login />} />
            </Routes>
        </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
)