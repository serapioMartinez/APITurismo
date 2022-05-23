
const db = require('./bd');

async function checkUserExist(type="USER", username){
    type=type.toUpperCase();
    
    console.log("CheckUsername: "+type+" -> "+username);
    let query="";
    switch(type){
        case "USUARIO":
            query="SELECT usuario_app.idUsuario as ID FROM usuario_app WHERE usuario_app.nombreUsuario=?";
            break;
        case "CIUDAD":
            query="SELECT administrador_ciudad.idUsuario as ID FROM administrador_ciudad WHERE administrador_ciudad.nombreUsuario=?";
            break;
        case "ESTABLECIMIENTO":
            query="SELECT administrador_establecimiento.idUsuario as ID FROM administrador_establecimiento WHERE administrador_establecimiento.nombreUsuario=?";
            break;
        default:
            query="SELECT usuario_app.idUsuario as ID FROM usuario_app WHERE usuario_app.nombreUsuario=?";
            break;
    }
    const result_search= await db.query(query,[username]);
    console.log(result_search);
    if(result_search.length>0) return result_search;
    else return [];
}

async function checkMailIsInUse(type="USER", mail){
    type=type.toUpperCase();
    console.log("CheckMail: "+type+" -> "+mail);
    let query="";
    switch(type){
        case "USUARIO":
            query="SELECT usuario_app.idUsuario as ID FROM usuario_app WHERE usuario_app.correo=?";
            break;
        case "CIUDAD":
            query="SELECT administrador_ciudad.idUsuario as ID FROM administrador_ciudad WHERE administrador_ciudad.correo=?";
            break;
        case "ESTABLECIMIENTO":
            query="SELECT administrador_establecimiento.idUsuario as ID FROM administrador_establecimiento WHERE administrador_establecimiento.correo=?";
            break;
        default:
            query="SELECT usuario_app.idUsuario as ID FROM usuario_app WHERE usuario_app.correo=?";
            break;
    }
    const result_search= await db.query(query,[mail]);
    console.log(result_search);
    if(result_search.length>0) return result_search;
    else return [];
}

async function createUserApp(username, name, date, mail, gender, type, photo=null, key){
    return await db.query("INSERT INTO usuario_app(usuario_app.nombreUsuario, usuario_app.nombre, usuario_app.fechaNacimiento, usuario_app.correo, usuario_app.genero, usuario_app.tiposTurismo, usuario_app.imagenUsuario, usuario_app.claveAcceso) VALUES(?,?,?,?,?,?,?,?)",
    [username, name, date, mail, gender, type, photo, key]);
}

async function createAdminCity(username, name, mail, photo=null, position, key){
    return await db.query("INSERT INTO administrador_ciudad(administrador_ciudad.nombreUsuario, administrador_ciudad.nombre, administrador_ciudad.correo, administrador_ciudad.imagenUsuario, administrador_ciudad.cargoCiudad, administrador_ciudad.claveAcceso) VALUES(?,?,?,?,?,?)",
    [username, name, mail, photo, position, key]);
}

async function createAdminEstablisment(username, name, mail, photo=null, position, key){
    return await db.query("INSERT INTO administrador_establecimiento(administrador_establecimiento.nombreUsuario, administrador_establecimiento.nombre, administrador_establecimiento.correo, administrador_establecimiento.imagenUsuario, administrador_establecimiento.cargoEmpresa, administrador_establecimiento.claveAcceso) VALUES(?,?,?,?,?,?)",
    [username, name, mail, photo, position, key]);
}


module.exports={
    createUserApp,
    createAdminCity,
    createAdminEstablisment,
    checkUserExist,
    checkMailIsInUse
}