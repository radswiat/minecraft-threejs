export default function degAbs(deg) {
  return deg - (Math.floor((deg / 360)) * 360);
}
