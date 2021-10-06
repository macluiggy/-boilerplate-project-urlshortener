require('dotenv').config({ path: './sample.env' });
const express = require('express');
const cors = require('cors');
const app = express();
var bodyParser = require('body-parser');
const mongoose = require('mongoose')

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

const uri = process.env.PW
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

let urlSchema = new mongoose.Schema({
  original: { type: String, required: true},
  short: Number
})

let Url = mongoose.model('Url', urlSchema)
//console.log(uri)
app
  .use(bodyParser.urlencoded({ extended: false }))
  .post('/api/shorturl', (req, res) => {
    const { url } = req.body
    console.log(url)
    let test = /https?:\/\/(www)?\.?.+\..+/gi.test(url)
    console.log(test)
    if (test) {
      res.json({
        original_url: url,
      })
    } else {
      res.json({
        error: 'Invalid Url'
      })
    }
  })

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
