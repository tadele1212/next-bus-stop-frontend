import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ServiceInput from "./components/ServiceInput.jsx";
import StopsTable from "./components/StopsTable.jsx";
import RealTimeTracking from "./components/RealTimeTracking.jsx";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <Routes>
                    <Route path="/" element={<ServiceInput />} />
                    <Route path="/stops" element={<StopsTable />} />
                    <Route path="/tracking" element={<RealTimeTracking />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
