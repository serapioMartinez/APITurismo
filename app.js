const express = require('express');
const port = process.env.PORT || 5000;
const app = express();
const non_users = require('./routes/non_users');
const drive = require('./services/drive/drive');
const admin_ciudad =  require('./routes/administradorCiudad');
const admin_establecimiento = require('./routes/administradorEstablecimiento');
const bodyParser = require('body-parser');
/*
var multer = require('multer');
var upload = multer();
*/
drive.autorizar();
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended:true
    })
);
/*
app.use(upload.any()); 
app.use(express.static('public'));
*/
app.get('/', (req, res) => {
    console.log(req)
    res.send("Funciona!");
} );
app.get("/google/callback", function (req, res) {
    const code = req.query.code;
    if (code) {
      // Get an access token based on our OAuth code
      console.log(code+"\n");
      res.send(code);
    }
  });

app.use('/no_users',non_users);
app.use('/admin_ciudad',admin_ciudad);
app.use('/admin_establecimiento', admin_establecimiento);
app.use('/images',drive.router);

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
})