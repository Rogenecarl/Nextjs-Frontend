// Create user location marker element with modern design
export const createUserLocationMarker = (): HTMLDivElement => {
  const userMarkerElement = document.createElement("div");
  userMarkerElement.innerHTML = `
    <div style="
      position: relative;
      width: 20px;
      height: 20px;
    ">
      <!-- Main user dot -->
      <div style="
        width: 20px;
        height: 20px;
        background: linear-gradient(135deg, #007AFF 0%, #0056CC 100%);
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0, 122, 255, 0.4), 0 2px 4px rgba(0, 0, 0, 0.1);
        position: relative;
        z-index: 2;
      "></div>
      
      <!-- Pulse animation -->
      <div style="
        position: absolute;
        top: -6px;
        left: -6px;
        width: 32px;
        height: 32px;
        background: rgba(0, 122, 255, 0.2);
        border-radius: 50%;
        animation: markerPulse 2s infinite;
        z-index: 1;
      "></div>
    </div>
  `;

  return userMarkerElement;
};