import React, { useState, useRef } from 'react';

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const openCamera = async () => {
    setIsCameraOpen(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/png'); // Convert to Base64
    onCapture(imageData);
    closeCamera();
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop()); // Stop camera stream
    }
    setIsCameraOpen(false);
  };

  return (
    <div>
      {isCameraOpen ? (
        <div>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <button onClick={captureImage}>Capture</button>
          <button onClick={closeCamera}>Close</button>
        </div>
      ) : (
        <button onClick={openCamera}>Open Camera</button>
      )}
    </div>
  );
};

export default CameraCapture;
