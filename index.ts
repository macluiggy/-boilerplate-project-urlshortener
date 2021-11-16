'use strict';
require('dotenv').config();
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

let urlModel = mongoose.model('URL', urlSchema)
//console.log(uri)
const responseObject = {}

let urlExtractor = function(url) {
  let urlSplit;
  if (url.indexOf("https") > -1) {
    urlSplit = url.split("https://");
  } else if (url.indexOf("http") > -1) {
    urlSplit = url.split("http://");
  }
  if (urlSplit === undefined) {
    return urlSplit;
  } else {
    return urlSplit[1].split("/")[0];
  }
};

app
  .use(bodyParser.urlencoded({ extended: false }))
  .post('/api/shorturl', (req, res) => {
    const { url } = req.body
    responseObject['original_url'] = url;
    let inputShort = 1

    let test = urlExtractor(url)
    if (!test) {
      res.json({ error: 'invalid url' })
      return
    }
    urlModel
          .findOne({})
          .sort({ short: 'desc' })
          .exec((error, result) => {
            if (!error && result != undefined) {
              inputShort = result.short + 1;
            }
            if (!error) {
              urlModel.findOneAndUpdate(
                { original: url },
                { original: url, short: inputShort },
                { new: true, upsert: true },
                (error, savedUrl) => {
                  if (!error) {
                    responseObject['short_url'] = savedUrl.short;
                    return res.json(responseObject);
                    console.log('log message')
                  }
                }
              )
            }
          })

    //console.log(url)
    //let test = /https?:\/\/(www)?\.?.+\..+/gi.test(url)
  })

app.get('/api/shorturl/:input', (req, res) => {
  let { input: inputShort } = req.params;
  urlModel
        .findOne({ short: inputShort }, (error, result) => {
          if(!error && result) {
            res.redirect(result.original)
          } else {
            res.json({ error: 'URL not found in the database'})
          }
        })
})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
