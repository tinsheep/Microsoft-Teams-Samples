const express = require('express');
const bodyparser = require('body-parser');
const env = require('dotenv')
const path = require('path');
const auth = require('./auth');

const app = express();

app.use(express.static(__dirname + '/Styles'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname);

const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

app.get('/configure', function (req, res) {
  res.render('./views/configure');
});

app.get('/GroupChatNotification', function (req, res) {
  var tenantId = req.url.split('=')[1];
  auth.getAccessToken(tenantId).then(async function (token) {
    console.log("token from js file : " + token);
    res.render('./views/GroupChatNotification', { token: JSON.stringify(token) });
  });

});

app.get('/TeamNotification', function (req, res) {
  var tenantId = req.url.split('=')[1];
  auth.getAccessToken(tenantId).then(async function (token) {
    console.log("token from js file : " + token);
    res.render('./views/TeamNotification', { token: JSON.stringify(token) });
  });

});
app.listen(3333, function () {
  console.log('app listening on port 3333!');
});
