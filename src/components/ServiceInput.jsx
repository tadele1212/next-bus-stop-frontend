import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { busService } from '../services/api.js';
import './ServiceInput.css';

function ServiceInput() {
    const [serviceNo, setServiceNo] = useState(() => {
        // Get last used service number from localStorage
        return localStorage.getItem('lastServiceNo') || '';
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Save current service number to localStorage
            localStorage.setItem('lastServiceNo', serviceNo);
            
            // Get stops but navigate directly to tracking
            await busService.getStops(serviceNo);
            navigate('/tracking', { state: { serviceNo } });
        } catch (err) {
            setError('Failed to fetch bus stops. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="service-input-container">
            <h1>Next Bus Stop</h1>
            <form onSubmit={handleSubmit} className="service-input-form">
                <div className="input-group">
                    <label htmlFor="serviceNo">Enter Bus Service Number</label>
                    <input
                        id="serviceNo"
                        type="text"
                        value={serviceNo}
                        onChange={(e) => setServiceNo(e.target.value)}
                        placeholder="e.g., 163-1"
                        required
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Start Tracking'}
                </button>
            </form>
        </div>
    );
}

export default ServiceInput; 