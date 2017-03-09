require('./main.css');
var logoPath = require('../static/sgabuzen_music_logo.jpg');
var Elm = require('./Main.elm');

var root = document.getElementById('root');

Elm.Main.embed(root, logoPath);
