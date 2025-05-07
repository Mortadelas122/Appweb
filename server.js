const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./database.db');

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080; // Usa el puerto de Railway

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS records (id INTEGER PRIMARY KEY, name TEXT, description TEXT)`);

app.get('/', (req, res) => {
    res.redirect('/records');
});

// Obtener todos los registros
app.get('/records', (req, res) => {
    db.all('SELECT * FROM records', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Obtener un registro por ID
app.get('/records/:id', (req, res) => {
    db.get('SELECT * FROM records WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

// Agregar un nuevo registro
app.post('/records', (req, res) => {
    const { name, description } = req.body;
    db.run('INSERT INTO records (name, description) VALUES (?, ?)', [name, description], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, name, description });
    });
});

// Editar un registro
app.put('/records/:id', (req, res) => {
    const { name, description } = req.body;
    db.run('UPDATE records SET name = ?, description = ? WHERE id = ?', [name, description, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Registro actualizado' });
    });
});

// Eliminar un registro
app.delete('/records/:id', (req, res) => {
    db.run('DELETE FROM records WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Registro eliminado' });
    });
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`));
