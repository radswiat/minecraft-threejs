export default function toRange(value: number, fromMax: number, fromMin: number, toMax: number, toMin: number): number {
  return ((value - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin
}
