// Adjust probabilities to ensure the average multiplier is less than 1
const probabilities = [
  0.030, 0.035, 0.040, 0.050, 0.060,
  0.070, 0.080, 0.085, 0.090, 0.085,
  0.080, 0.070, 0.060, 0.050, 0.040,
  0.035, 0.030
];

const totalProbability = probabilities.reduce((sum, p) => sum + p, 0);
const normalizedProbabilities = probabilities.map(p => p / totalProbability);

const cumulativeProbabilities = [];
normalizedProbabilities.reduce((acc, value, index) => {
    cumulativeProbabilities[index] = acc + value;
    return cumulativeProbabilities[index];
}, 0);

export function getPlinkoMultiplier() {
    const random = Math.random();
    for (let i = 0; i < cumulativeProbabilities.length; i++) {
        if (random <= cumulativeProbabilities[i]) {
            return i;
        }
    }
    return 8;
}
