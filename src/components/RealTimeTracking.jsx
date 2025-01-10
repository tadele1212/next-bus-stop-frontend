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
                            const nearestStop = await busService.getNearestStop(
                                serviceNo,
                                position.coords.latitude,
                                position.coords.longitude,
                                currentStop?.Seq || 0
                            );
                            console.log('Database Response:', {
                                rawResponse: nearestStop,
                                allKeys: Object.keys(nearestStop),
                                fullData: nearestStop
                            });
                            setCurrentStop(nearestStop);
                        } catch (err) {
                            setError("Failed to fetch nearest stop");
                            console.error(err);
                        }
                    },
                    (err) => {
                        setError("Failed to get location");
                        console.error(err);
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