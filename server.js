const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'player',
});


db.connect((err) => {
  if (err) {
    console.error('Błąd połączenia z bazą danych:', err);
  } else {
    console.log('Połączenie z bazą danych udane');

    db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        points INT NOT NULL
      );
    `, (createTableErr) => {
      if (createTableErr) {
        console.error('Błąd tworzenia tabeli:', createTableErr);
      }
    });
  }
});


app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Formularz</h1>
        <form action="/submit" method="post">
          <label for="name">Nazwa:</label>
          <input type="text" name="name" required><br>
          <label for="points">Punkty:</label>
          <input type="number" name="points" required><br>
          <button type="submit">Wyślij</button>
        </form>
      </body>
    </html>
  `);
});


app.post('/submit', (req, res) => {
  const { name, points } = req.body;


  const sql = 'INSERT INTO users (name, points) VALUES (?, ?)';
  db.query(sql, [name, points], (err, result) => {
    if (err) {
      console.error('Błąd dodawania danych do bazy:', err);
      res.send('Błąd dodawania danych do bazy');
    } else {
      console.log('Dane dodane do bazy:', result);
      res.redirect(`/success?name=${name}&points=${points}`);
    }
  });
});


app.get('/success', (req, res) => {
  const { name, points } = req.query;
  res.send(`
    <html>
      <body>
        <h1>Dane zostały dodane pomyślnie!</h1>
        <p>Nazwa: ${name}</p>
        <p>Punkty: ${points}</p>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Aplikacja działa na http://localhost:${port}`);
});
