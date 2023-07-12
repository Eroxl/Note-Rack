/**
 * Get the distance between two strings
 * @param a
 * @param b
 * @returns Distance between the two strings
 */
const getStringDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;

  if (b.length === 0) return a.length;

  const matrix = [];

  // ~ Increment along the first column of each row
  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // ~ Increment each column in the first row
  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // ~ Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1], // ~ substitution
          matrix[i][j - 1], // ~ insertion
          matrix[i - 1][j], // ~ deletion
        ) + 1;
      }
    }
  }

  return matrix[b.length][a.length];
};

export default getStringDistance;
