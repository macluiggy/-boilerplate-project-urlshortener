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
interface SendFileResponse<T> {
  sendFile(path: T): void//sendFile: (path: string) => void
}
app.get('/', function<NONE>(_:NONE, res: SendFileResponse<string>) {
  //res.sendFile(process.cwd() + '/views/index.html');
  res.sendFile(__dirname + '/views/index.html');
});

// Your first API endpoint
interface Json<T> {
  greeting: T;
}
type ApiHelloResponse<T> = {
  json: (json: Json<T>)
}
app.get('/api/hello', function<NoSeUsa>(_: NoSeUsa, res: ApiHelloResponse<string>) {
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


let urlExtractor = function<T extends string>(url: T) {
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
type ApiShortUrlRequest = {
  body: {
    url: string
  }
}
interface ResponseObject {
  [index: string]: string
}
const responseObject: ResponseObject = {}
app
  .use(bodyParser.urlencoded({ extended: false }))
  .post('/api/shorturl', (req: ApiShortUrlRequest, res) => {
    const { url } = req.body
    responseObject['original_url'] = url;
    let inputShort = 1

    let test = urlExtractor<string>(url)
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
