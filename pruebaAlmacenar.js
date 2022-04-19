const express = require('express');
const router = express.Router();
const path = require('path');
const app = express();
const multer = require('multer');
const port = process.env.PORT || 5000;

const imageStorage = multer.diskStorage({
    //Destino para almacenar la imagen
    destination: 'images',
    filename: (req, file, callback) => {
        callback(null, file.fieldname+'_'+Date.now()+path.extname(file.originalname));
    }
});

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, callback){
        if(!file.originalname.match(/\.(png|jpg)$/)){
            //solo esos formatos
            return callback(new Error("Por favor suba una Imagen"));
        }
        callback(undefined,true);
    }
});

app.get('/', (req, res) => {
    res.send("Hello People");
});
app.post('/uploadImage', imageUpload.single('image'), (req, res) => {
    console.log(req.body);
    res.send(req.file);
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
});
app.listen(port, ()=>{
    console.log(`Server is up on port ${port}`);
});