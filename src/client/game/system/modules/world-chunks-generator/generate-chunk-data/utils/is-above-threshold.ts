export default function isAboveThreshold(noise, threshold, thresholdMod, z) {
  return noise < threshold - Math.pow(z + 13, (z + 13) / thresholdMod) / 100
}
