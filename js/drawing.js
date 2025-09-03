export function initDrawing(videoWrapper, video, container) {
  let drawing = false;
  let tool = "pen";
  let color = "#ff0000";

  const drawingCanvas = document.createElement("canvas");
  const ctx = drawingCanvas.getContext("2d");
  videoWrapper.appendChild(drawingCanvas);

  // sync canvas with video size
  video.addEventListener("loadedmetadata", () => {
    drawingCanvas.width = video.videoWidth;
    drawingCanvas.height = video.videoHeight;
    drawingCanvas.style.width = "100%";
    drawingCanvas.style.height = "100%";
    drawingCanvas.classList.add("drawing-canvas");
  });

  function getPos(e) {
    const rect = drawingCanvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (drawingCanvas.width / rect.width),
      y: (e.clientY - rect.top) * (drawingCanvas.height / rect.height)
    };
  }

  drawingCanvas.addEventListener("mousedown", e => {
    if (video.paused) {
      drawing = true;
      ctx.beginPath();
      let pos = getPos(e);
      ctx.moveTo(pos.x, pos.y);
    }
  });

  drawingCanvas.addEventListener("mousemove", e => {
    if (drawing && video.paused) {
      let pos = getPos(e);
      if (tool === "pen") {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (tool === "eraser") {
        ctx.clearRect(pos.x - 8, pos.y - 8, 16, 16);
      }
    }
  });

  drawingCanvas.addEventListener("mouseup", () => (drawing = false));

  // controls row
  const controls = document.createElement("div");
  controls.id = "videoControls";

  // Play/Pause
  const playPauseBtn = document.createElement("button");
  playPauseBtn.innerHTML = "⏸️"; 
  playPauseBtn.onclick = () => {
    if (video.paused) {
      video.play();
      playPauseBtn.innerHTML = "⏸️";
    } else {
      video.pause();
      playPauseBtn.innerHTML = "▶️";
    }
  };
  controls.appendChild(playPauseBtn);

  // 🔹 Timeline slider
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = 0;
  slider.max = 100;
  slider.value = 0;
  slider.style.width = "300px";
  controls.appendChild(slider);

  // keep slider synced with video
  video.addEventListener("timeupdate", () => {
    if (!slider.dragging) {
      slider.value = (video.currentTime / video.duration) * 100;
    }
  });

  // allow seeking
  slider.addEventListener("input", () => {
    slider.dragging = true;
    video.currentTime = (slider.value / 100) * video.duration;
  });
  slider.addEventListener("change", () => (slider.dragging = false));

  // Speed controls
  [0.5, 1, 2].forEach(speed => {
    const btn = document.createElement("button");
    btn.textContent = speed + "x";
    if (speed === 1) btn.classList.add("active");
    btn.onclick = () => {
      video.playbackRate = speed;
      controls.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      playPauseBtn.classList.remove("active");
      btn.classList.add("active");
    };
    controls.appendChild(btn);
  });

  // Color pickers
  ["#ff0000", "#00ff00", "#0000ff", "#ffff00"].forEach(c => {
    const colBtn = document.createElement("button");
    colBtn.style.backgroundColor = c;
    colBtn.className = "color-btn";
    colBtn.onclick = () => {
      tool = "pen";
      color = c;
    };
    controls.appendChild(colBtn);
  });

  // Eraser
  const eraserBtn = document.createElement("button");
  eraserBtn.textContent = "Eraser";
  eraserBtn.onclick = () => (tool = "eraser");
  controls.appendChild(eraserBtn);

  // Reset drawings
  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Reset";
  resetBtn.onclick = () =>
    ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  controls.appendChild(resetBtn);

  container.appendChild(controls);
}
