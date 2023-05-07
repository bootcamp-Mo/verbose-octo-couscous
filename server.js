/* eslint-disable no-undef */
const express = require('express')
const paths = require('path')
const fs = require('fs')
const uuid = require('uuid')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
	res.sendFile(paths.join(__dirname, 'public', 'index.html'))
})

app.get('/notes', (req, res) => {
	res.sendFile(paths.join(__dirname, 'public', 'notes.html'))
})

app.get('/api/notes', (req, res) => {
	const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'))
	res.json(notes)
})

app.post('/api/notes', (req, res) => {
	const newNote = req.body;
	newNote.id = uuid.v4();
	const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
	notes.push(newNote);
	fs.writeFileSync('./db/db.json', JSON.stringify(notes));
	res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
	const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
	const updatedNotes = notes.filter((note) => note.id !== req.params.id);
	fs.writeFileSync('./db/db.json', JSON.stringify(updatedNotes));
	res.json({ message: 'Note deleted successfully.' });
});

app.listen(PORT, () => {
	console.log(`App listening on PORT ${PORT}`);
});
