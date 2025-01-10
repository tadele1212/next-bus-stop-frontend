import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './StopsTable.css';

function StopsTable() {
    const location = useLocation();
    const navigate = useNavigate();
    const { stops, serviceNo } = location.state || { stops: [], serviceNo: '' };

    // Redirect to home if no serviceNo
    React.useEffect(() => {
        if (!serviceNo) {
            navigate('/');
        }
    }, [serviceNo, navigate]);

    const handleStartTracking = () => {
        navigate('/tracking', { state: { serviceNo } });
    };

    const handleBack = () => {
        navigate('/');
    };

    // Show loading or redirect instead of error
    if (!stops || !stops.length) {
        return (
            <div className="stops-table-container">
                <button onClick={handleBack} className="back-button">
                    Back to Service Input
                </button>
                <div className="no-stops">No stops found</div>
            </div>
        );
    }

    return (
        <div className="stops-table-container">
            <button onClick={handleBack} className="back-button">
                Back to Service Input
            </button>
            <h2>Bus Service {serviceNo} Stops</h2>
            <div className="table-wrapper">
                <table className="stops-table">
                    <thead>
                        <tr>
                            <th>Sequence</th>
                            <th>Road Name</th>
                            <th>Distance (km)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stops.map((stop) => (
                            <tr key={stop.Seq}>
                                <td>{stop.Seq}</td>
                                <td>{stop.Bus_Stop}</td>
                                <td>{stop.KM.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={handleStartTracking} className="start-tracking-btn">
                Start Real-time Tracking
            </button>
        </div>
    );
}

export default StopsTable; 