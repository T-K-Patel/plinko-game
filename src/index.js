import express from 'express';
import { data } from './data.js';
const MULTIPLIER = [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16]
const app = express();

app.set('json spaces', 4);
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/bet', (req, res) => {
    let path = [];
    let counter = 0;
    for (let i = 0; i < 17; i++) {
        if (Math.random() < 0.5) {
            path.push("R");
            counter++;
        } else {
            path.push("L");
        }
    }
    const m = MULTIPLIER[counter];
    const point = data[counter][Math.floor(Math.random() * data[counter].length)];
    res.send({ path: path, point, multiplier: m });
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});