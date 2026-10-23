// Adapted from gebrkn/copytables src/lib/matrix.js, MIT, Georg Barikin.
// See LICENSE. Ragged rows are normalized before using these operations.
export const column = (mat, ci) => mat.map(row => row[ci]);
export function transpose(mat) {
  if (!mat.length) return mat;
  return mat[0].map((_, ci) => column(mat, ci));
}
export function trim(mat, fn) {
  const fun = row => row.some(cell => fn(cell));
  mat = mat.filter(fun);
  mat = transpose(mat).filter(fun);
  return transpose(mat);
}
