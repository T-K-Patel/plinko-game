import express from 'express';
import { data } from './data.js';
import fs from 'fs';
import path from 'path';
import { getPlinkoMultiplier } from './GetMultiplierId.js';
import { ACCOUNTS } from './database.js';
const MULTIPLIER = [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16]


const app = express();

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

app.get("/:username/balance", (req, res) => {
    const username = req.params.username;
    if (ACCOUNTS[username]) {
        res.json({ balance: ACCOUNTS[username] });
    } else {
        ACCOUNTS[username] = 1000;
        res.status(200).json({ balance: 1000 });
    }
})

app.get('/:username/bet', (req, res) => {
    const username = req.params.username;
    if ((ACCOUNTS[username] ?? undefined) == undefined) {
        ACCOUNTS[username] = 1000;
    }
    if (ACCOUNTS[username] < 100) { return res.status(400).json({ point: null, earn: 0, error: "Insufficient Balance" }) }
    const mId = getPlinkoMultiplier();
    const point = data[mId][Math.floor(Math.random() * data[mId].length)];
    const m = MULTIPLIER[mId];
    ACCOUNTS[username] += (m - 1) * 100;
    res.json({ point: point, multiplier: m, earn: (m - 1) * 100, updatedBalance: ACCOUNTS[username] });
})

// app.get('/multiplier', (req, res) => {
//     const multipliers = []
//     const count = 10000;
//     const avg = []
//     let i = 0;
//     while (i++ < 1000) {
//         const muls = [];
//         for (let i = 0; i < count; i++) {
//             const mId = getPlinkoMultiplier();
//             muls.push(mId);
//         }
//         const sum = muls.map(a => MULTIPLIER[a]).reduce((a, b) => a + b, 0);
//         avg.push(sum / count);
//         multipliers.push(muls.reduce((a, m) => {
//             a[m] += 1;
//             return a;
//         }, Array.from({ length: 17 }, () => 0)))
//     }
//     res.send({
//         netAvg: avg.reduce((a, b) => a + b, 0) / avg.length,
//         avg: avg.sort(), multipliers
//     });
// })

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});