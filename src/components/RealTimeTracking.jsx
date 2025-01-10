import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { busService } from '../services/api';
import './RealTimeTracking.css';

function RealTimeTracking() {
    const [currentStop, setCurrentStop] = useState(null);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { serviceNo } = location.state || {};

    const handleBack = () => {
        navigate('/stops', { state: { serviceNo } });
    };

    useEffect(() => {
        const pollLocation = async () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        try {
                            console.log('Current stop before request:', {
                                currentStop,
                                seq: currentStop?.Seq,
                                lastStopValue: currentStop?.Seq || 0
                            });
                            
                            const nearestStop = await busService.getNearestStop(
                                serviceNo,
                                position.coords.latitude,
                                position.coords.longitude,
                                currentStop?.Seq || 0
                            );
                            
                            console.log('Nearest stop response:', nearestStop);
                            setCurrentStop(nearestStop);
                        } catch (err) {
                            console.error('Error details:', {
                                message: err.message,
                                response: err.response?.data,
                                status: err.response?.status
                            });
                            setError("Failed to fetch nearest stop");
                        }
                    },
                    (err) => {
                        console.error('Geolocation error:', err);
                        setError("Failed to get location");
                    }
                );
            }
        };

        const interval = setInterval(pollLocation, 5000);
        return () => clearInterval(interval);
    }, [serviceNo, currentStop]);

    if (error) return <div className="error">{error}</div>;

    return (
        <div className="tracking-container">
            <h2>Real-Time Tracking</h2>
            {currentStop && (
                <div className="current-stop">
                    <h3>Next Stop</h3>
                    <p className="bus-stop-info"> {currentStop['Bus Stop']}</p>
                    <p className="sequence-number">{currentStop.Seq}</p>
                    <p className="distance-info">Distance: {currentStop.KM.toFixed(2)} km</p>
                </div>
            )}
            <button onClick={handleBack} className="back-button">
                Back to Stops
            </button>
        </div>
    );
}

export default RealTimeTracking; 