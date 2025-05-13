import React, { useRef, useEffect, useState } from 'react';

// Main Drawing App component
function App() {
    // Ref to access the canvas element
    const canvasRef = useRef(null);
    // State to track if drawing is currently active
    const [isDrawing, setIsDrawing] = useState(false);
    // State to store the current brush color
    const [brushColor, setBrushColor] = useState('#ffffff'); // Default white
    // State to store the current brush size
    const [brushSize, setBrushSize] = useState(5); // Default size 5

    // Effect hook to set up the canvas context and event listeners on mount
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return; // Ensure canvas ref is available

        // Get the 2D rendering context
        const context = canvas.getContext('2d');

        // Set initial context properties
        context.lineCap = 'round'; // Rounded line ends
        context.lineJoin = 'round'; // Rounded corners for lines

        // --- Event Handlers ---

        // Function to start drawing
        const startDrawing = (event) => {
            // Prevent default behavior to avoid issues with touch events on some devices
            event.preventDefault();
            setIsDrawing(true);
            // Start a new path
            context.beginPath();
            // Move to the starting point (mouse or touch position)
            const { offsetX, offsetY } = getEventCoords(event);
            context.moveTo(offsetX, offsetY);
        };

        // Function to draw while moving
        const draw = (event) => {
            // If not drawing, do nothing
            if (!isDrawing) return;

            // Prevent default behavior
            event.preventDefault();

            // Set the current stroke style (color) and line width (size)
            context.strokeStyle = brushColor;
            context.lineWidth = brushSize;

            // Draw a line to the current mouse or touch position
            const { offsetX, offsetY } = getEventCoords(event);
            context.lineTo(offsetX, offsetY);
            // Stroke the current path
            context.stroke();
        };

        // Function to stop drawing
        const stopDrawing = () => {
            setIsDrawing(false);
            // Close the current path
            context.closePath();
        };

        // Helper function to get coordinates from mouse or touch events
        const getEventCoords = (event) => {
            // Check if it's a touch event
            if (event.touches && event.touches[0]) {
                const rect = canvas.getBoundingClientRect();
                return {
                    offsetX: event.touches[0].clientX - rect.left,
                    offsetY: event.touches[0].clientY - rect.top,
                };
            }
            // Otherwise, assume it's a mouse event
            return {
                offsetX: event.offsetX,
                offsetY: event.offsetY,
            };
        };


        // --- Add Event Listeners ---

        // Mouse events
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing); // Stop drawing if mouse leaves canvas

        // Touch events (for mobile compatibility)
        canvas.addEventListener('touchstart', startDrawing, { passive: false }); // passive: false allows preventDefault
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDrawing);
        canvas.addEventListener('touchcancel', stopDrawing); // Handle touch interruption

        // --- Cleanup Function ---
        // This function runs when the component unmounts or the effect re-runs
        return () => {
            // Remove all event listeners to prevent memory leaks
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseout', stopDrawing);

            canvas.removeEventListener('touchstart', startDrawing);
            canvas.removeEventListener('touchmove', draw);
            canvas.removeEventListener('touchend', stopDrawing);
            canvas.removeEventListener('touchcancel', stopDrawing);
        };
    }, [isDrawing, brushColor, brushSize]); // Dependencies: re-run effect if these states change

    // Function to clear the canvas
    const handleClearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        // Clear the entire canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    // Function to handle color picker change
    const handleColorChange = (event) => {
        setBrushColor(event.target.value);
    };

    // Function to handle brush size slider change
    const handleSizeChange = (event) => {
        setBrushSize(parseInt(event.target.value, 10)); // Parse value as integer
    };

    // Render the UI
    return (
        // Main container with dark background, padding, and flex layout
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8 flex flex-col items-center font-sans">
            <h1 className="text-3xl font-bold mb-8 text-blue-400 text-center">Simple Drawing App</h1>

            {/* Controls Area */}
            <div className="flex flex-wrap justify-center gap-4 mb-6 p-4 bg-gray-800 bg-opacity-60 rounded-lg shadow-lg">
                 {/* Color Picker */}
                 <div className="flex items-center gap-2">
                    <label htmlFor="colorPicker" className="text-gray-300">Color:</label>
                    <input
                        id="colorPicker"
                        type="color"
                        value={brushColor}
                        onChange={handleColorChange}
                        className="w-10 h-10 rounded-md border-none cursor-pointer"
                        title="Choose brush color"
                    />
                 </div>

                 {/* Brush Size Slider */}
                 <div className="flex items-center gap-2">
                    <label htmlFor="sizeSlider" className="text-gray-300">Size:</label>
                     <input
                        id="sizeSlider"
                        type="range"
                        min="1"
                        max="50"
                        value={brushSize}
                        onChange={handleSizeChange}
                        className="w-32 h-6 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        title="Adjust brush size"
                     />
                     <span className="text-gray-300 text-sm">{brushSize}</span>
                 </div>


                {/* Clear Button */}
                <button
                    onClick={handleClearCanvas}
                    className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out"
                >
                    Clear Canvas
                </button>
            </div>


            {/* Drawing Canvas */}
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <canvas
                    ref={canvasRef}
                    width={800} // Set initial width (can be adjusted)
                    height={600} // Set initial height (can be adjusted)
                    className="border-2 border-gray-700 rounded-lg"
                    style={{ touchAction: 'none' }} // Disable default touch actions like scrolling/zooming
                ></canvas>
            </div>

             {/* Footer or additional info (optional) */}
            <div className="text-center mt-8 text-gray-500 text-sm">
              <p>Simple Drawing App built with React and Canvas API.</p>
            </div>
        </div>
    );
}

export default App;
