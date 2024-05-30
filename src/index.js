import express from 'express';
import { data } from './data.js';
import fs from 'fs';
import path from 'path';
import { getPlinkoMultiplier } from './GetMultiplierId.js';
import AccountModel from './AccountModel.js';
import mongoose from 'mongoose';
import { config } from 'dotenv';
config();
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

app.get("/:username/balance", async (req, res) => {
    const username = req.params.username;
    const account = await AccountModel.findOne({ id: "1" });
    const user = account.database.find(a => a.username === username);
    if (user) {
        res.json({ balance: user.balance });
    } else {
        account.database.push({ username, balance: 1000 });
        await account.save();
        res.status(200).json({ balance: 1000 });
    }
})

app.get('/:username/bet', async (req, res) => {
    const username = req.params.username;
    const account = await AccountModel.findOne({ id: "1" });
    let user = account.database.find(a => a.username === username);
    if (!user) {
        user = { username, balance: 1000 };
        account.database.push(user);
        await account.save();
    }
    if (user.balance < 100) { return res.status(400).json({ point: null, earn: 0, error: "Insufficient Balance" }) }
    const mId = getPlinkoMultiplier();
    const point = data[mId][Math.floor(Math.random() * data[mId].length)];
    const m = MULTIPLIER[mId];
    user.balance += (m - 1) * 100;
    await account.save();
    res.json({ point: point, multiplier: m, earn: (m - 1) * 100, updatedBalance: user.balance });
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

mongoose.connect(process.env.MONGODB_URI).then(async () => {

    const account = await AccountModel.findOne({ id: "1" })
    if (!account) {
        await AccountModel.create({ id: "1", database: [] });
    }
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    })
}).catch(e => {
    console.log(e);
})