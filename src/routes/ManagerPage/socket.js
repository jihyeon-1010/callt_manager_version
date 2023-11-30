import React, { useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const SensorComponent = () => {
  useEffect(() => {
    const socket = socketIOClient('http://localhost:3000'); // Use your server URL

    socket.on('sensorData', (data) => {
      // Handle the received sensor data, update state, and UI
      console.log('Received sensor data:', data);
      // Update your React component state or UI with the received data
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      {/* Your React component UI */}
    </div>
  );
};

export default SensorComponent;
