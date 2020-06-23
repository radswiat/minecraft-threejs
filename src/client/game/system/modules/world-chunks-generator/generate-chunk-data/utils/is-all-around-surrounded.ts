export default function isAllAroundSurrounded(surrounding): boolean {
  return surrounding.px && surrounding.nx && surrounding.py && surrounding.pz && surrounding.nz && surrounding.ny
}
