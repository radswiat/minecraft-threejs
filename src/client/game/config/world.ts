export const worldConfig = {
  // world seed ID
  seed: 0,
  // size of each cube
  cubeSize: 20,
  // Number of chunks
  // Min: 9
  // Pattern. 9, 25, 49
  chunks: 9,
  // size of each chunks
  chunkSize: 25, // 26
  // how many chunks to generate at once
  parallelChunkGeneration: 20,
  // CHunk modifier
  chunkMod: 30,
}

// x 0 x    1 => 9
// x 0 x
// x 0 x

// xx 0 xx  5 => 25
// xx 0 xx
// xx 0 xx

// xxx 0 xxx 7 => 49
// xxx 0 xxx
// xxx 0 xxx
