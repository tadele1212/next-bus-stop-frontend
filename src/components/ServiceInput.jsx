import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { busService } from '../services/api.js';
import './ServiceInput.css';

function ServiceInput() {
    const [serviceNo, setServiceNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const stops = await busService.getStops(serviceNo);
            navigate('/stops', { state: { stops, serviceNo } });
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
                    {loading ? 'Loading...' : 'Track Bus'}
                </button>
            </form>
        </div>
    );
}

export default ServiceInput; 