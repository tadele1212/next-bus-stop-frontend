import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { busService } from '../services/api';
import StopsTable from './StopsTable';
import './RealTimeTracking.css';
import './LoadingSpinner.css';

function RealTimeTracking() {
    const [currentStop, setCurrentStop] = useState(null);
    const [error, setError] = useState(null);
    const [showRouteModal, setShowRouteModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { serviceNo } = location.state || {};

    const handleQuit = () => {
        navigate('/');
    };

    // Check if service exists when component mounts
    useEffect(() => {
        const checkService = async () => {
            try {
                const stops = await busService.getStops(serviceNo);
                if (!stops || stops.length === 0) {
                    setError("This service number does not exist. Try a valid service number.");
                    setTimeout(() => {
                        navigate('/');
                    }, 3000); // Redirect after 3 seconds
                }
            } catch (err) {
                setError("This service number does not exist. Try a valid service number.");
                setTimeout(() => {
                    navigate('/');
                }, 3000); // Redirect after 3 seconds
            }
        };
        checkService();
    }, [serviceNo, navigate]);

    useEffect(() => {
        const pollLocation = async () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        try {
                            setLoading(true);
                            const nearestStop = await busService.getNearestStop(
                                serviceNo,
                                position.coords.latitude,
                                position.coords.longitude,
                                currentStop?.Seq || 0
                            );
                            setCurrentStop(nearestStop);
                        } catch (err) {
                            setError("Failed to fetch nearest stop");
                        } finally {
                            setLoading(false);
                        }
                    },
                    (err) => {
                        setError("Failed to get location");
                        setLoading(false);
                    }
                );
            }
        };

        if (!error) { // Only poll if there's no error
            const interval = setInterval(pollLocation, 5000);
            return () => clearInterval(interval);
        }
    }, [serviceNo, currentStop, error]);

    return (
        <div className="tracking-container">
            <button onClick={handleQuit} className="quit-button">
                Quit
            </button>
            <h2>Real-Time Tracking</h2>
            <h3 className="service-number">Bus Service {serviceNo}</h3>
            {loading && !error ? (
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : currentStop ? (
                <div className="current-stop">
                    <h3>Next Stop</h3>
                    <p className="bus-stop-info">{currentStop['Bus Stop']}</p>
                    <p className="sequence-number">{currentStop.Seq}</p>
                    <p className="distance-info">Distance: {currentStop.KM.toFixed(2)} km</p>
                </div>
            ) : null}
            
            <button 
                onClick={() => setShowRouteModal(true)} 
                className="view-route-button"
                disabled={!!error}
            >
                View Full Route
            </button>
            
            {showRouteModal && (
                <StopsTable 
                    serviceNo={serviceNo}
                    currentStopSeq={currentStop?.Seq}
                    onClose={() => setShowRouteModal(false)}
                />
            )}
        </div>
    );
}

export default RealTimeTracking; 