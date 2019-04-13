'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var dns = require('dns');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

let urlCollector = [];
app.post('/api/shorturl/new', (req, res) => {
  let url = new URL( req.body.url );
  dns.lookup( url.hostname , (err, dataDNS)=>{
    if(!err){
      let urlOBJ = {
        original_url: req.body.url,
        short_url: urlCollector.length + 1
      }
      urlCollector.push( urlOBJ );
      console.log('success', urlOBJ)
      
      res.json(urlOBJ);
    } else {
      console.log(' err ', err)
      res.json({error : 'invalid URL'})
    }
  })
})

app.get('/api/shorturl/:shortIndex', (req, res) => {
  let shortcut = req.params.shortIndex;
  if( typeof(parseInt( shortcut )) === 'number' && urlCollector[shortcut - 1]){
    res.redirect(urlCollector[shortcut - 1].original_url)
  }
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});