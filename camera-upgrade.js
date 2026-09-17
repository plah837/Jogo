/* Upgrade de câmera: arrastar com o dedo acompanha exatamente a direção do gesto. */
(function () {
  const canvas = document.getElementById("game-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  let yaw = 0;
  let pitch = 0.38;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  canvas.style.touchAction = "none";

  const start = (event) => {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    canvas.setPointerCapture?.(event.pointerId);
  };

  const move = (event) => {
    if (!dragging) return;
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;

    // Dedo para a direita: câmera olha para a direita.
    yaw += dx * 0.009;
    // Dedo para cima: câmera olha para cima.
    pitch += dy * 0.007;
    pitch = THREE.MathUtils.clamp(pitch, -0.18, 1.05);
  };

  const end = (event) => {
    dragging = false;
    canvas.releasePointerCapture?.(event.pointerId);
  };

  canvas.addEventListener("pointerdown", start, { passive: true });
  canvas.addEventListener("pointermove", move, { passive: true });
  canvas.addEventListener("pointerup", end, { passive: true });
  canvas.addEventListener("pointercancel", end, { passive: true });

  // Expõe a orientação para o game.js sem criar outro renderizador.
  window.getCameraGesture = () => ({ yaw, pitch });
})();
