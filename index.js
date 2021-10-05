require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
//pilasd
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

//app.use('/public', express.static(`${process.cwd()}/public`));
app.use('/public', express.static(`${__dirname}/public`));
//console.log(process.cwd());
app.get('/', function(req, res) {
  //res.sendFile(process.cwd() + '/views/index.html');
  res.sendFile(__dirname + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  //res.json({ greeting: process.cwd(), a: __dirname });
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
