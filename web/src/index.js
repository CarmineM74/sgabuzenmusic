var logoPath = require('../static/sgabuzen_music_logo.jpg');
let Elm = require('./Main.elm')
let root = document.getElementById('root')
let app = Elm.Main.embed(root, logoPath)
