const fs = require('fs');
const readline = require('readline');
const multer = require('multer');
const path = require('path');
const { google } = require('googleapis');
const express = require('express');
const router = express.Router();
const OAuth2Data = require('./credentials.json');
const adminCiudad = require('../administradorCiudad');
const adminEstablecimiento = require('../administradorEstablecimiento');
const user = require('../user_app');

const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URL = OAuth2Data.web.redirect_uris[0];

var authed = false;

const SCOPES = ['https://www.googleapis.com/auth/drive.file','https://www.googleapis.com/auth/drive.readonly'];

const TOKEN_PATH = `${__dirname}/token.json`;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

function autorizar() {
    console.log("Autorizando acceso a Drive...")
    //console.log(OAuth2Data.web)
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return obtenerAccessToken(oAuth2Client);
        oAuth2Client.setCredentials(JSON.parse(token));
        authed = true;
        console.log("Acceso autorizado")
        //console.log(JSON.parse(token))
    });
}

function obtenerAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            console.log("Acceso autorizado")
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
                authed = true;
            });
        });
    });
}

const imageStorage = multer.diskStorage({
    //Destino para almacenar la imagen
    destination: 'images',
    filename: (req, file, callback) => {
        console.log("Guardando archivo")
        callback(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});

const imageUpload = multer({
    storage: imageStorage
});

const checkPermissionCity = async function (req, res, next) {

    console.log("Revisando permisos")
    console.log(req.body)
    try {
        if(!req.file && !req.files) {
            console.log("Error: ", "No se ha recibido archivo")
            res.send({error: "No se ha enviado ningun archivo"})
            return
        }
        const permission = await adminCiudad.checkPermission(req.body.username, req.body.pass);
        console.log(`Permisos verificados:\n ${permission}`);
        if (permission) next();
        else {
            fs.unlinkSync(req.file.path);
            res.json({ error: "Falta de permisos para realizar operación" });
        }
    } catch (err) {
        console.log("Un error ha ocurrido mientras verificaba permisos");
        fs.unlinkSync(req.file.path);
        res.json({ error: err.message });
    }
};

const checkPermissionEstablishment = async function (req, res, next) {

    console.log("Revisando permisos")
    try {
        if(!req.file && !req.files) {
            console.log("Error: ", "No se ha recibido archivo")
            res.send({error: "No se ha enviado ningun archivo"})
            return
        }
        const permission = await adminEstablecimiento.checkPermission(req.body.username, req.body.pass);
        console.log(`Permisos verificados:\n ${permission}`);
        if (permission) next();
        else {
            fs.unlinkSync(req.file.path);
            res.json({ error: "Falta de permisos para realizar operación" });
        }
    } catch (err) {
        console.log("Un error ha ocurrido mientras verificaba permisos");
        fs.unlinkSync(req.file.path);
        res.json({ error: err.message });
    }
};

const checkPermissionUser = async function(req, res, next){
    console.log("Revisando persimos de usuario");
    try{
        if(!req.file) {
            console.log("Error: ", "No se ha recibido archivo")
            res.send({error: "No se ha enviado ningun archivo"})
            return
        }
        const permission = await user.checkPermission(req.body.username, req.body.pass);
        console.log(`Permisos verificados:\n ${permission}`);
        if (permission) next();
        else {
            console.log("Falta de permisos para realizar operación")
            fs.unlinkSync(req.file.path);
            res.json({ error: "Falta de permisos para realizar operación" });
        }
    }catch (err) {
        console.log("Un error ha ocurrido mientras verificaba permisos");
        fs.unlinkSync(req.file.path);
        res.json({ error: err.message });
    }
}

router.post('/uploadRepresentativaCiudad', imageUpload.single('image'), checkPermissionCity, async (req, res) => {
    if (!authed) res.status(401).send({ error: "Token de acceso inexistente" });
    console.log(req.file);
    console.log(req.body)
    const drive = google.drive({ version: "v3", auth: oAuth2Client });
    var fileMetadata = {
        name: `RepresentativaCiudad_${Date.now()}${path.extname(req.file.originalname)}`,
        parents: ['117UQ3dPM7h2_HjceEE4KgRMz8mB3EyB_'],//Id del folder

    };
    var media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(req.file.path),
    };
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, name, webContentLink, hasThumbnail, thumbnailLink',
    }, function (err, resp) {
        if (err) {
            //Handle error
            console.log(err.message);
            res.status(401).send({ error: err.message });
        } else {
            console.log('File Id: ', resp.data);
            drive.permissions.create({
                fileId: resp.data.id,
                requestBody: {
                    type: 'anyone',
                    role: 'reader'
                }
            }, function (error, response) {

                if (error) res.status(201).send({ 'error': err.message });
                else {
                    fs.unlinkSync(req.file.path);
                    res.status(201).send(resp.data);
                }
            })
        }
    });

});

router.post('/uploadRepresentativaEstablecimiento', imageUpload.single('image'), checkPermissionEstablishment, async (req, res) => {
    if (!authed) res.status(401).send({ error: "Token de acceso inexistente" });
    console.log(req.file);
    console.log(req.body)
    const drive = google.drive({ version: "v3", auth: oAuth2Client });
    var fileMetadata = {
        name: `RepresentativaEstablecimiento_${Date.now()}${path.extname(req.file.originalname)}`,
        parents: ['117UQ3dPM7h2_HjceEE4KgRMz8mB3EyB_'],//Id del folder

    };
    var media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(req.file.path),
    };
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, name, webContentLink',
    }, function (err, resp) {
        if (err) {
            //Handle error
            console.log(err.message);
            res.status(401).send({ error: err.message });
        } else {
            console.log('File Id: ', resp.data);
            drive.permissions.create({
                fileId: resp.data.id,
                requestBody: {
                    type: 'anyone',
                    role: 'reader'
                }
            }, function (error, response) {

                if (error) res.status(201).send({ 'error': err.message });
                else {
                    fs.unlinkSync(req.file.path);
                    res.status(201).send(resp.data);
                }
            })
        }
    });

});

router.post('/uploadCityPhotos', imageUpload.array('images'), checkPermissionCity, async (req, res) => {
    if (!authed) res.status(401).send({ error: "Token de acceso inexistente" });
    let data_files = [];
    const drive = google.drive({ version: "v3", auth: oAuth2Client });
    for (let i = 0; i < req.files.length; i++) {
        file = req.files[i];
        console.log(file);
        var fileMetadata = {
            name: `foto_ciudad_${Date.now()}${path.extname(file.originalname)}`,
            parents: ['1lenuysEaiQ7JOkMRmzFO7RP2HwRTP97w'],//Id del folder

        };
        var media = {
            mimeType: 'image/jpeg',
            body: fs.createReadStream(file.path),
        };
        const dr = function () {
            const ruta = file.path;

            drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id, name, webContentLink',
            }, function (err, resp) {

                if (err) {
                    //Handle error
                    console.log(err.message);
                    data_files.push({ 'error': err.message });
                } else {
                    console.log('File Id: ', resp.data);
                    drive.permissions.create({
                        fileId: resp.data.id,
                        requestBody: {
                            type: 'anyone',
                            role: 'reader'
                        }
                    }, function (error, response) {

                        if (error) data_files.push({ 'error': err.message });
                        else {
                            fs.unlinkSync(ruta);
                            data_files.push(resp.data);
                            if (i == req.files.length - 1) {
                                console.log(data_files)
                                res.send(data_files);
                            }
                        }
                    })
                }
            });
        }
        dr();
    }

});

router.post('/uploadEstablishmentPhotos', imageUpload.array('images'), checkPermissionEstablishment, async (req, res) => {
    if (!authed) res.status(401).send({ error: "Token de acceso inexistente" });
    console.log(req.files)
    console.log(req.body)
    let data_files = [];
    const drive = google.drive({ version: "v3", auth: oAuth2Client });
    for (let i = 0; i < req.files.length; i++) {
        file = req.files[i];
        console.log(file);
        var fileMetadata = {
            name: `foto_ciudad_${Date.now()}${path.extname(file.originalname)}`,
            parents: ['1IXya39EbZJmFCWnygxqvWst2jNP9w7bc'],//Id del folder

        };
        var media = {
            mimeType: 'image/jpeg',
            body: fs.createReadStream(file.path),
        };
        const dr = function () {
            const ruta = file.path;

            drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id, name, webContentLink',
            }, function (err, resp) {

                if (err) {
                    //Handle error
                    console.log(err.message);
                    data_files.push({ 'error': err.message });
                } else {
                    console.log('File Id: ', resp.data);
                    drive.permissions.create({
                        fileId: resp.data.id,
                        requestBody: {
                            type: 'anyone',
                            role: 'reader'
                        }
                    }, function (error, response) {

                        if (error) data_files.push({ 'error': err.message });
                        else {
                            fs.unlinkSync(ruta);
                            data_files.push(resp.data);
                            if (i == req.files.length - 1) {
                                console.log(data_files)
                                res.send(data_files);
                            }
                        }
                    })
                }
            });
        }
        dr();
    }

});

router.post('/uploadTopicPhoto', imageUpload.single('image'), checkPermissionCity, async (req, res) => {
    console.log("Subiendo foto de topico de ciudad...")
        if (!authed) {
        console.error("Token de acceso inexistente");
        res.status(401).send({ error: "Token de acceso inexistente" });
    }
    console.log(req.file);
    console.log(req.body);
    const drive = google.drive({ version: "v3", auth: oAuth2Client });
    var fileMetadata = {
        name: `topic_city_${req.body.username}_${Date.now()}${path.extname(req.file.originalname)}`,
        parents: ['1xjNFPDODv1S0myW1FY762074CEm7XL-O'],//Id del folder
    };
    var media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(req.file.path),
    };
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, name, webContentLink',
    }, function (err, resp) {
        if (err) {
            //Handle error
            console.log(err.message);
            res.status(401).send({ error: err.message });
        } else {
            console.log('File Id: ', resp.data);
            drive.permissions.create({
                fileId: resp.data.id,
                requestBody: {
                    type: 'anyone',
                    role: 'reader'
                }
            }, function (error, response) {

                if (error) res.status(201).send({ 'error': err.message });
                else {
                    fs.unlinkSync(req.file.path);
                    res.status(201).send(resp.data);
                }
            })
        }
    });
});

router.post('/uploadUserProfilePhoto', imageUpload.single('image'), checkPermissionUser,async (req, res) => {
    console.log("Subiendo foto de perfil...")
    if (!authed) {
        console.error("Token de acceso inexistente");
        res.status(401).send({ error: "Token de acceso inexistente" });
    }
    console.log(req.file);
    console.log(req.body);
    const drive = google.drive({ version: "v3", auth: oAuth2Client });
    var fileMetadata = {
        name: `profile_photo_${req.body.username}_${Date.now()}${path.extname(req.file.originalname)}`,
        parents: ['1OESbk59DrnLNChCjys_otR-f_KbBrfOL'],//Id del folder
    };
    var media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(req.file.path),
    };
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, name, webContentLink',
    }, function (err, resp) {
        if (err) {
            //Handle error
            console.log(err.message);
            res.status(401).send({ error: err.message });
        } else {
            console.log('File Id: ', resp.data);
            drive.permissions.create({
                fileId: resp.data.id,
                requestBody: {
                    type: 'anyone',
                    role: 'reader'
                }
            }, function (error, response) {

                if (error) res.status(201).send({ 'error': err.message });
                else {
                    fs.unlinkSync(req.file.path);
                    res.status(201).send(resp.data);
                }
            })
        }
    });

})

router.post('/uploadAdminCityProfilePhoto', imageUpload.single('image'), checkPermissionCity,async (req, res) => {
    console.log("Subiendo foto de perfil...")
    if (!authed) {
        console.error("Token de acceso inexistente");
        res.status(401).send({ error: "Token de acceso inexistente" });
    }
    console.log(req.file);
    console.log(req.body);
    const drive = google.drive({ version: "v3", auth: oAuth2Client });
    var fileMetadata = {
        name: `profile_photo_${req.body.username}_${Date.now()}${path.extname(req.file.originalname)}`,
        parents: ['1OESbk59DrnLNChCjys_otR-f_KbBrfOL'],//Id del folder
    };
    var media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(req.file.path),
    };
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, name, webContentLink',
    }, function (err, resp) {
        if (err) {
            //Handle error
            console.log(err.message);
            res.status(401).send({ error: err.message });
        } else {
            console.log('File Id: ', resp.data);
            drive.permissions.create({
                fileId: resp.data.id,
                requestBody: {
                    type: 'anyone',
                    role: 'reader'
                }
            }, function (error, response) {

                if (error) {
                    console.log(error.message)
                    res.status(201).send({ 'error': err.message });
                }
                else {
                    fs.unlinkSync(req.file.path);
                    res.status(201).send(resp.data);
                }
            })
        }
    });

})

router.post('/uploadAdminEstablishmentProfilePhoto', imageUpload.single('image'), checkPermissionEstablishment,async (req, res) => {
    console.log("Subiendo foto de perfil...")
    if (!authed) {
        console.error("Token de acceso inexistente");
        res.status(401).send({ error: "Token de acceso inexistente" });
    }
    console.log(req.file);
    console.log(req.body);
    const drive = google.drive({ version: "v3", auth: oAuth2Client });
    var fileMetadata = {
        name: `profile_photo_${req.body.username}_${Date.now()}${path.extname(req.file.originalname)}`,
        parents: ['1OESbk59DrnLNChCjys_otR-f_KbBrfOL'],//Id del folder
    };
    var media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(req.file.path),
    };
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, name, webContentLink',
    }, function (err, resp) {
        if (err) {
            //Handle error
            console.log(err);
            res.status(401).send({ error: err.message });
        } else {
            console.log('File Id: ', resp.data);
            drive.permissions.create({
                fileId: resp.data.id,
                requestBody: {
                    type: 'anyone',
                    role: 'reader'
                }
            }, function (error, response) {

                if (error) res.status(201).send({ 'error': err.message });
                else {
                    fs.unlinkSync(req.file.path);
                    res.status(201).send(resp.data);
                }
            })
        }
    });

})

router.delete('/imagen', (req, res)=> {
    console.log("Eliminando archivo");
    if (!authed) {
        console.error("Token de acceso inexistente");
        res.status(401).send({ error: "Token de acceso inexistente" });
    }
    console.log(req.body);
    
    const drive = google.drive({ version: "v3", auth: oAuth2Client });
    drive.files.delete({
        fileId: req.body.fileId
    }, function (err, resp) {
        if (err) {
            //Handle error
            console.log("Error: ", err.message);
            res.status(401).send({ error: err.message });
        } else {
            console.log("Exito: ", "imagen eliminada");
            res.status(200).send({status: "OK"})
        }
    });
});


module.exports = {
    router,
    autorizar
};