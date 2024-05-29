import express from 'express';
import { data } from './data.js';
import fs from 'fs';
import path from 'path';
const MULTIPLIER = [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16]
const app = express();

const points = []
for (let i = 0; i < 17; i++) {
    for (let j = 0; j < data[i].length; j++) {
        points.push({ i, p: data[i][j] })
    }
}
/**
 * shuffle points array
 */
for (let i = points.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [points[i], points[j]] = [points[j], points[i]];
}

app.set('json spaces', 4);
// app.use(express.static('public'));

app.use((req, res, next) => {
    try {
        const publicFolderPath = path.join(process.cwd(), 'public');
        const filePath = path.join(publicFolderPath, req.path);
        const indexPath = path.join(filePath, 'index.html');
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile() || fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
            // File exists in public folder
            res.sendFile(req.path, { root: './public' });
        } else {
            console.log("file does not exist\n" + filePath)
            next();
        }
    } catch (e) {
        console.log(e)
        next()
    }
})
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/bet', (req, res) => {
    const point = points[Math.floor(Math.random() * points.length)];
    const m = MULTIPLIER[point.i];
    res.send({ point: point.p, multiplier: m });
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});