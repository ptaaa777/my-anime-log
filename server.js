const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(__dirname));

let db;


async function initDB() {
    db = await open({
        filename: path.join(__dirname, 'anime.db'),
        driver: sqlite3.Database
    });

    
    await db.exec(`
        CREATE TABLE IF NOT EXISTS animes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL
        )
    `);
    console.log('Database connected successfully!');
}

initDB();


app.get('/api/animes', async (req, res) => {
    const list = await db.all('SELECT * FROM animes');
    res.json(list);
});


app.post('/api/animes', async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'กรุณากรอกชื่ออนิเมะ' });
    
    const result = await db.run('INSERT INTO animes (title) VALUES (?)', [title]);
    res.json({ id: result.lastID, title });
});


app.delete('/api/animes/:id', async (req, res) => {
    const { id } = req.params;
    await db.run('DELETE FROM animes WHERE id = ?', [id]);
    res.json({ message: 'Deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});