const db = require('./bd');
const config = require('../config');

async function checkPermission(username, pass) {

    const row = await db.query("SELECT usuario_app.idUsuario as ID from usuario_app WHERE usuario_app.nombreUsuario=? AND usuario_app.claveAcceso=?", [username, pass]);
    console.log(row)
    if (!row.length) return false;
    else return true;

}

async function publicarResenhaCiudad(usuario, ciudad, contenido){
    const row = await db.query("INSERT INTO resenhas_ciudad(resenhas_ciudad._idUsuario, resenhas_ciudad._idCiudad, resenhas_ciudad.contenido) VALUES(?,?,?)",[usuario, ciudad, contenido]);
    console.log( row)
    return row;
}

async function publicarResenhaEstablecimiento(usuario, establecimiento, contenido){
    const row = await db.query("INSERT INTO resenhas_establecimiento(resenhas_establecimiento._idUsuario, resenhas_establecimiento._idEstablecimiento, resenhas_establecimiento.contenido) VALUES(?,?,?)",[usuario, establecimiento, contenido]);
    console.log( row)
    return row;
}

async function calificarCiudad(usuario, ciudad, calificacion){
    const row = await db.query("INSERT INTO calificaciones_usuarios_ciudades(calificaciones_usuarios_ciudades._idUsuario, calificaciones_usuarios_ciudades._idCiudad, calificaciones_usuarios_ciudades.calificacion) VALUES(?,?,?)",[usuario, ciudad, calificacion]);
    console.log( row)
    return row;
}

async function calificarEstablecimiento(usuario, establecimiento, calificacion){
    const row = await db.query("INSERT INTO calificaciones_establecimiento_usuario(calificaciones_establecimiento_usuario._idUsuario, calificaciones_establecimiento_usuario._idEstablecimiento, calificaciones_establecimiento_usuario.calificacion) VALUES(?,?,?)",
    [usuario, establecimiento, calificacion]);
    console.log( row)
    return row;
}

async function obtenerResenhasCiudad(idCiudad, page=0){
    const row = await db.query(`SELECT usuario_app.nombreUsuario as USUARIO, usuario_app.imagenUsuario as FOTO, resenhas_ciudad.contenido as CONTENIDO FROM resenhas_ciudad JOIN usuario_app ON usuario_app.idUsuario=resenhas_ciudad._idUsuario WHERE resenhas_ciudad._idCiudad=? LIMIT ${page*5},5`,[idCiudad]);
    console.log( row)
    return row;
}

async function obtenerResenhasEstablecimientos(idEstablecimiento, page=0){
    const row = await db.query(`SELECT usuario_app.nombreUsuario as USUARIO, usuario_app.imagenUsuario as FOTO, resenhas_establecimiento.contenido as CONTENIDO FROM resenhas_establecimiento JOIN usuario_app ON usuario_app.idUsuario=resenhas_establecimiento._idUsuario WHERE resenhas_ciudad._idCiudad=? LIMIT ${page*5},5`,[idEstablecimiento]);
    console.log( row)
    return row;    
}

async function agregarEntradaAgenda(usuario, ciudad, transporte, fecha, hora='00:00:00'){
    const row = await db.query("INSERT INTO entradas_usuario_agenda(entradas_usuario_agenda._idUsuario, entradas_usuario_agenda._idCiudad, entradas_usuario_agenda._idTransporte, entradas_usuario_agenda.fechaVisita, entradas_usuario_agenda.hora) VALUES(?,?,?,?,?)",[usuario, ciudad, transporte, fecha, hora]);
    console.log( row)
    return row;
}

async function eliminarEntradaAgenda(id){
    const row = await db.query("DELETE FROM entradas_usuario_agenda WHERE entradas_usuario_agenda.idEntrada=?",[id]);
    console.log( row)
    return row;
}

module.exports = {
    checkPermission,
    publicarResenhaCiudad,
    publicarResenhaEstablecimiento,
    calificarCiudad,
    calificarEstablecimiento,
    obtenerResenhasCiudad,
    obtenerResenhasEstablecimientos,
    agregarEntradaAgenda,
    eliminarEntradaAgenda
}