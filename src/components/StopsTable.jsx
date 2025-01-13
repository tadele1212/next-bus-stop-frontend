import React, { useState, useEffect } from 'react';
import { busService } from '../services/api';
import './StopsTable.css';
import './LoadingSpinner.css';

function StopsTable({ serviceNo, currentStopSeq, onClose }) {
    const [stops, setStops] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStops = async () => {
            try {
                setLoading(true);
                const stopsData = await busService.getStops(serviceNo);
                setStops(stopsData);
            } catch (err) {
                setError('Failed to load stops');
                console.error('Error fetching stops:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStops();
    }, [serviceNo]);

    if (error) return <div className="error">{error}</div>;

    return (
        <div className="stops-table-container">
            <div className="table-wrapper">
                <div className="table-header">
                    <button onClick={onClose} className="close-button">
                        Close
                    </button>
                    <h2>Bus Service {serviceNo} Route</h2>
                </div>
                
                <div className="table-content">
                    {loading ? (
                        <div className="spinner-container">
                            <div className="spinner"></div>
                        </div>
                    ) : stops.length > 0 ? (
                        <table className="stops-table">
                            <thead>
                                <tr>
                                    <th>Seq</th>
                                    <th>Bus Stop</th>
                                    <th>Distance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stops.map(stop => (
                                    <tr 
                                        key={stop.Seq}
                                        className={stop.Seq === currentStopSeq ? 'current-stop-row' : ''}
                                    >
                                        <td>{stop.Seq}</td>
                                        <td>{stop.Bus_Stop}</td>
                                        <td>{stop.KM.toFixed(2)} km</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-stops">No stops available</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StopsTable; 