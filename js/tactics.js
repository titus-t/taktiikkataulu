// js/tactics.js
import { initDrawing } from "./drawing.js";

const categorySelector = document.getElementById("categorySelector");
const tacticButtons = document.getElementById("tacticButtons");
const container = document.getElementById("tacticContainer");

let tacticsData = {};
let currentVideo = null;

fetch("tactics.json")
  .then(res => res.json())
  .then(data => {
    tacticsData = data;
    const categories = Object.keys(data);

    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categorySelector.appendChild(option);
    });

    if (categories.length > 0) {
      categorySelector.value = categories[0];
      populateTactics(categories[0]);
    }
  });

categorySelector.addEventListener("change", function() {
  populateTactics(this.value);
});

function populateTactics(category) {
  tacticButtons.innerHTML = "";
  container.innerHTML = "";
  if (!category || !tacticsData[category]) return;

  tacticsData[category].forEach((tactic, index) => {
    const btn = document.createElement("button");
    btn.textContent = tactic.name;
    btn.addEventListener("click", () => {
      tacticButtons.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      loadTactic(tactic.file);
    });
    tacticButtons.appendChild(btn);
    if (index === 0) {
      btn.classList.add("active");
      loadTactic(tactic.file);
    }
  });
}

function loadTactic(file) {
  container.innerHTML = "";
  currentVideo = null;

  if (file.endsWith(".mp4")) {
    const videoWrapper = document.createElement("div");
    videoWrapper.style.position = "relative";
    videoWrapper.style.width = "100%";

    const video = document.createElement("video");
    video.src = file;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.style.width = "100%";
    videoWrapper.appendChild(video);
    currentVideo = video;

    // add drawing and controls
    initDrawing(videoWrapper, video, container);

    container.appendChild(videoWrapper);

  } else {
    const iframe = document.createElement("iframe");
    iframe.src = file;
    iframe.width = "100%";
    iframe.style.border = "0";
    iframe.style.overflow = "hidden";
    iframe.onload = () => {
      try {
        iframe.style.height = iframe.contentDocument.documentElement.scrollHeight + "px";
      } catch {
        iframe.style.height = "600px";
      }
    };
    container.appendChild(iframe);
  }
}
