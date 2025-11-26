const canvas = new Map<string, string>();

// write test
console.time('Write 250K pixels');
for (let i = 0; i < 250000; i++) {
  canvas.set(`${i % 300},${Math.floor(i / 300)}`, '#FF5733');
}
console.timeEnd('Write 250K pixels');

// read test
console.time('Read 250K pixels');
for (let i = 0; i < 250000; i++) {
  canvas.get(`${i % 300},${Math.floor(i / 300)}`);
}
console.timeEnd('Read 250K pixels');
