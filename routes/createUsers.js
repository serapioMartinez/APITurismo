const express = require('express');
const router = express.Router();
const users = require('../services/createUsers');

const unicidadUsuario = async function (req, res, next) {
    data = req.body.data;
    params = req.params;
    console.log(data)
    console.log(params)
    try {
        const usuario = await users.checkUserExist(params.typeUser, data.username);
        const correo = await users.checkMailIsInUse(params.typeUser, data.correo);
        console.log("USUARIOS: "+usuario);
        console.log("CORREO: "+correo)
        if (usuario.length>0 || correo.length>0) {
            console.log("No se puede crear el usuario por problemas de unicidad.");
            const message=[];
            (usuario.length>0)?message.push("Usuario no Disponible"):false;
            (correo.length>0)?message.push("Direccion de correo en uso"):false;
            res.status(403).send({ 'unique': message})
        }else{
        console.log("Usuario Disponible");
        console.log(usuario)
        next();
        }
    } catch (error) {
        console.log("Ha ocurrido un error mientras se revisava unicidad");
        res.send({'error':error.message});
    }
}

router.post('/:typeUser', unicidadUsuario, async (req, res) => {
    const data = req.body.data;
    const params = req.params;
    console.log(data)
    console.log(params)
    try {
        type = params.typeUser.toUpperCase();
        console.log(type)
        if(params.typeUser=="CITY"){
            const result= await users.createAdminCity(
                data.username, 
                data.nombre, 
                data.correo,  
                data.foto, 
                data.cargo, 
                data.clave);
            console.log(result);
            res.status(201).send(result);
        }else if(params.typeUser=="ESTABLISHMENT"){
            const result= await users.createAdminEstablisment(
                data.username, 
                data.nombre, 
                data.correo,  
                data.foto, 
                data.cargo, 
                data.clave);
            console.log(result);
            res.status(201).send(result);
        }else{
            const result= await users.createUserApp(
                data.username, 
                data.nombre, 
                data.fecha, 
                data.correo, 
                data.genero, 
                data.tipo, 
                data.foto, 
                data.clave);
            console.log(result);
            res.status(201).send(result);
        }
    } catch (error) {
        console.log("Ha ocurrido un error mientras se creaba el usuario");
        res.send({'error':error.message});
    }
})

module.exports = router;