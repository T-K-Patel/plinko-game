// Adjust probabilities to ensure the average multiplier is less than 1
const probabilities = [0.001, 0.002, 0.005, 0.01, 0.01, 0.02, 0.05, 0.21, 0.28, 0.21, 0.05, 0.02, 0.01, 0.01, 0.005, 0.002, 0.001];

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
