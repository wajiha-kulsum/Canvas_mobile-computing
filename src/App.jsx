import React, { useRef, useState, useEffect } from "react";
import "./App.css";

const PaintApp = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState("brush"); // brush, eraser, rectangle, circle, line
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [startPos, setStartPos] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerHeight - 100;
    ctxRef.current = canvas.getContext("2d");
    ctxRef.current.lineCap = "round";
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (mode === "brush" || mode === "eraser") {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(offsetX, offsetY);
    }
    setStartPos({ x: offsetX, y: offsetY });
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = ctxRef.current;

    if (mode === "brush") {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    } else if (mode === "eraser") {
      ctx.strokeStyle = darkMode ? "#ffffff" : "#000000"; // Adapt to mode
      ctx.lineWidth = 20;
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = ctxRef.current;

    if (mode === "rectangle") {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.strokeRect(startPos.x, startPos.y, offsetX - startPos.x, offsetY - startPos.y);
    } else if (mode === "circle") {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      const radius = Math.sqrt(Math.pow(offsetX - startPos.x, 2) + Math.pow(offsetY - startPos.y, 2));
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (mode === "line") {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }

    ctx.beginPath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className={`paint-container ${darkMode ? "dark" : "light"}`}>
      <div className="toolbar">
        <button onClick={() => setMode("brush")}>🖌 Brush</button>
        <button onClick={() => setMode("eraser")}>🧹 Eraser</button>
        <button onClick={() => setMode("rectangle")}>⬛ Rectangle</button>
        <button onClick={() => setMode("circle")}>⚫ Circle</button>
        <button onClick={() => setMode("line")}>📏 Line</button>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <input type="range" min="1" max="20" value={brushSize} onChange={(e) => setBrushSize(e.target.value)} />
        <button onClick={clearCanvas}>🗑 Clear</button>
        <button onClick={() => setDarkMode(!darkMode)}>{darkMode ? "🌙 Dark" : "☀ Light"}</button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        className="canvas"
      />
    </div>
  );
};

export default PaintApp;
