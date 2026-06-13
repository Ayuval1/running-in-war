import L from 'leaflet'

export const startIcon = L.divIcon({
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  html: `
    <div style="
      width:40px;height:40px;border-radius:50%;
      background:rgba(0,229,160,0.18);
      border:3px solid #00E5A0;
      box-shadow:0 0 0 6px rgba(0,229,160,0.2),0 0 0 12px rgba(0,229,160,0.08);
      display:flex;align-items:center;justify-content:center;
      font-size:16px;font-weight:900;color:#00E5A0;
      font-family:Rubik,sans-serif;
    ">א</div>
  `,
})

export const endIcon = L.divIcon({
  className: '',
  iconSize: [32, 45],
  iconAnchor: [16, 45],
  html: `
    <div style="position:relative;width:32px;height:45px">
      <svg width="32" height="45" viewBox="0 0 32 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16C0 28 16 45 16 45C16 45 32 28 32 16C32 7.163 24.837 0 16 0Z" fill="#3B9EFF"/>
      </svg>
      <div style="
        position:absolute;top:7px;left:0;right:0;
        display:flex;align-items:center;justify-content:center;
        font-size:13px;font-weight:900;color:#0f1923;
        font-family:Rubik,sans-serif;
      ">ב</div>
    </div>
  `,
})
