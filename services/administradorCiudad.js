const db = require('./bd');

async function checkPermission(username, pass) {
    const row = await db.query("SELECT administrador_ciudad.idUsuario as ID from administrador_ciudad WHERE administrador_ciudad.nombreUsuario=? AND administrador_ciudad.claveAcceso=?", [username, pass]);
    console.log(row)
    if (!row.length) return false;
    else return true;
}
async function iniciarSesion(username, pass){
    const row = await db.query("SELECT administrador_ciudad.idUsuario AS ID, IF(ciudades.idCiudad, ciudades.idCiudad,NULL) as CIUDAD FROM administrador_ciudad left join ciudades ON ciudades._id_administrador=administrador_ciudad.idUsuario WHERE administrador_ciudad.nombreUsuario=? AND administrador_ciudad.claveAcceso=?",
    [username,pass]);
    return row[0];
}
async function obtenerDatosUsuario(id){
    const row = await db.query("SELECT administrador_ciudad.nombre AS NOMBRE, administrador_ciudad.correo AS CORREO, administrador_ciudad.imagenUsuario AS FOTO, administrador_ciudad.cargoCiudad AS CARGO FROM administrador_ciudad WHERE administrador_ciudad.idUsuario=?",[id]);
    return row;
}
async function revisarExistenciaAdministracion(username) {
    const row = await db.query("SELECT ciudades.idCiudad as ID, ciudades.nombreCiudad as NOMBRE from ciudades JOIN administrador_ciudad on administrador_ciudad.idUsuario=ciudades._id_administrador WHERE administrador_ciudad.nombreUsuario=?",
        [username]);
    return row;
}
async function actualizarDatosUsuario(id, username, nombre, correo, cargo, foto=null){
    const row = await db.query("UPDATE administrador_ciudad SET administrador_ciudad.nombreUsuario=?, administrador_ciudad.nombre=?, administrador_ciudad.correo=?, administrador_ciudad.cargoCiudad=?, administrador_ciudad.imagenUsuario=? WHERE administrador_ciudad.idUsuario=?",
    [username, nombre, correo, cargo, foto, id]);
    return row;
}
//Generadores de datos - CREATE, UPDATE 
async function generarCiudad(username, ciudad, region, municipio, correo, telefono, magico = 0, tipos="AV", emergencias, descripcion) {
    const row = await db.query("CALL crearCiudad(?,?,?,?,?,?,?,?,?,?)",
        [username, ciudad, region, municipio, correo, telefono, magico, tipos, emergencias, descripcion]);
    return row;
}
async function modificarCiudad(username, correo, telefono, magico, tipos, emergencias, descripcion){
    const row = await db.query("CALL alterarCiudad(?,?,?,?,?,?,?)",[username,correo,telefono,magico,tipos,emergencias,descripcion]);
    return row;
}
async function subirRepresentativa(username,id_image){
    const row = await db.query("CALL subirRepresentativa(?,?)",[username,id_image]);
    return row;
}
async function subirFotoPerfil(username,id_image){
    const row = await db.query("UPDATE administrador_ciudad SET administrador_ciudad.imagenUsuario=? WHERE administrador_ciudad.nombreUsuario=? ",
    [id_image, username]);
    return row;
}
async function subirFotosCiudad(data,id_ciudad){
    let query = "INSERT INTO fotos_ciudad(fotos_ciudad.foto, fotos_ciudad._idCiudad, fotos_ciudad.descripcion) VALUES";
    let array = [];
    if(data){
        data.forEach(element => {
            query+=` (?,${id_ciudad},''),`;
            array.push(element.FOTO);
        });
        query=query.substring(0,query.length-1)
        console.log(query);
        console.log(array)
        const row= await db.query(query,array);
        return row
    }
    return [];
}
async function eliminarFoto(id){
    const row = await db.query("DELETE FROM fotos_ciudad WHERE fotos_ciudad.foto=?",
    [id]);
    return row;
};
async function subirFotoItem(id, foto, item){
    let query = "";
    switch(item){
        case "platillos": query="UPDATE platillos SET platillos.imagen=? WHERE platillos.idPlatillos=?";break;
        case "establecimientos": query="UPDATE establecimientos SET establecimientos.imagenRepresentativa=? WHERE establecimientos.idEstablecimiento=?";break;
        case "personajes": query="UPDATE personajes_importantes SET personajes_importantes.foto=? WHERE personajes_importantes.idPersonajes=?";break;
        case "zonas": query="UPDATE zonas_turisticas SET zonas_turisticas.foto=? WHERE zonas_turisticas.idZonaTuristica=?";break;
        case "notas": query="UPDATE notas_ciudad SET notas_ciudad.imagen=? WHERE notas_ciudad.idNotaCiudad=?";break;
        case "festividades": query="UPDATE festividad SET festividad.imagen=? WHERE festividad.idFecha=?";break;
    }
    const row = await db.query(query,
    [foto, id]);
    return row;
}

// PLATILLOS
async function agregarPlatillo(id_ciudad, nombre, descripcion, foto=null){
    return db.query("INSERT INTO platillos(platillos._idCiudad,platillos.nombre,platillos.descripcion, platillos.imagen) values(?,?,?,?)",[id_ciudad,nombre,descripcion,foto]);
}
async function modificarPlatillo(id, nombre, descripcion, foto=null){
    return db.query("UPDATE platillos SET platillos.nombre=? ,platillos.descripcion=? , platillos.imagen=? WHERE platillos.idPlatillos=?",
    [nombre,descripcion,foto, id]);
}

//ZONA TURISTICA
async function agregarZonaTuristica(id_ciudad, nombre,tipo, descripcion, foto=null){
    return db.query("INSERT INTO zonas_turisticas(zonas_turisticas._idCiudad,zonas_turisticas.nombre,zonas_turisticas.tipoZona, zonas_turisticas.descripcion, zonas_turisticas.foto) values(?,?,?,?,?)",[id_ciudad,nombre, tipo,descripcion,foto]);
}
async function modificarZonaTuristica(id, nombre,tipo, descripcion, foto=null){
    return db.query("UPDATE zonas_turisticas SET zonas_turisticas.nombre=? ,zonas_turisticas.tipoZona=?, zonas_turisticas.descripcion=?, zonas_turisticas.foto=? WHERE zonas_turisticas.idZonaTuristica=?",
    [nombre, tipo,descripcion,foto,id]);
}

//FESTIVIDADES
async function agregarfestividad(id_ciudad,dia, mes, nombre, descripcion, foto=null){
    return db.query("INSERT INTO festividad(festividad._idCiudad, festividad.dia, festividad.mes, festividad.nombre, festividad.descripcion, festividad.imagen) VALUES(?,?,?,?,?,?)",[id_ciudad,dia,mes,nombre,descripcion,foto]);
}
async function modificarfestividad(id,dia, mes, nombre, descripcion, foto=null){
    return db.query("UPDATE festividad SET  festividad.dia=?, festividad.mes=?, festividad.nombre=?, festividad.descripcion=?, festividad.imagen=? WHERE festividad.idFecha=?",
    [dia,mes,nombre,descripcion,foto, id]);
}

//PERSONAJES
async function agregarPersonaje( id_ciudad,nombre,nacimiento,fallecimiento,descripcion,foto=null){
    return db.query("INSERT INTO personajes_importantes(personajes_importantes._idCiudad,personajes_importantes.nombre, personajes_importantes.anhoNacimiento, personajes_importantes.anhoFallecimiento, personajes_importantes.descripcion,personajes_importantes.foto) VALUES (?,?,?,?,?,?)",[id_ciudad,nombre, nacimiento, fallecimiento,descripcion,foto]);
}
async function modificarPersonaje( id,nombre,nacimiento,fallecimiento,descripcion,foto=null){
    return db.query("UPDATE personajes_importantes SET personajes_importantes.nombre=?, personajes_importantes.anhoNacimiento=?, personajes_importantes.anhoFallecimiento=?, personajes_importantes.descripcion=?,personajes_importantes.foto=? WHERE personajes_importantes.idPersonajes=?",
    [nombre, nacimiento, fallecimiento,descripcion,foto,id]);
}

//NOTAS
async function agregarNota( id_ciudad, titulo, descripcion,imagen=null){
    let currentDate = new Date();
    return db.query("INSERT INTO notas_ciudad(notas_ciudad._idCiudad, notas_ciudad.titulo, notas_ciudad.descripcion, notas_ciudad.imagen, notas_ciudad.fechaPublicacion) values(?,?,?,?,?)",[id_ciudad,titulo, descripcion, imagen,`${currentDate.getFullYear()}/${currentDate.getMonth()+1}/${currentDate.getDate()}`])
}
async function modificarNota( id, titulo, descripcion,imagen=null){
    return db.query("UPDATE notas_ciudad SET notas_ciudad.titulo=?, notas_ciudad.descripcion=?, notas_ciudad.imagen=? WHERE notas_ciudad.idNotaCiudad=?",
    [titulo, descripcion, imagen, id])
}

//ESTABLECIMIENTO
async function agregarEstablecimiento(id_ciudad, nombre, tipo, telefono, correo, foto=null){
    let resultado = await db.query("INSERT INTO establecimientos(establecimientos.nombre, establecimientos.tipoEstablecimiento, establecimientos.telefono, establecimientos.correo, establecimientos.imagenRepresentativa) values(?,?,?,?,?)",[nombre,tipo,telefono, correo, foto]);
    resultado = await db.query("INSERT INTO direccion(direccion._idEstablecimiento, direccion._idCiudad) values (?,?)",[resultado.insertId,id_ciudad])
    return resultado;
}
async function modificarEstablecimiento(id_establecimiento, nombre, tipo, telefono, correo, foto=null){
    let resultado = await db.query("UPDATE establecimientos SET establecimientos.nombre=?, establecimientos.tipoEstablecimiento=?, establecimientos.telefono=?, establecimientos.correo=?, establecimientos.imagenRepresentativa=? WHERE establecimientos.idEstablecimiento=? AND establecimientos.pro=0",
    [nombre,tipo,telefono, correo, foto, id_establecimiento]);
    return resultado;
}

//Getters
async function getCountITEMS(id_ciudad, item="PLATILLOS"){
    let query='';
    item=item.toUpperCase();
    switch(item){
        case "PLATILLOS":
            query="SELECT COUNT(*) as CANTIDAD FROM platillos WHERE platillos._idCiudad=?";    
            break;
        case "ZONAS":
            query="SELECT COUNT(*) as CANTIDAD FROM zonas_turisticas WHERE zonas_turisticas._idCiudad=?";
            break;
        case "FESTIVIDADES":
            query="SELECT COUNT(*) as CANTIDAD FROM festividad WHERE festividad._idCiudad=?";
            break;
        case "PERSONAJES":
            query="SELECT COUNT(*) as CANTIDAD FROM personajes_importantes WHERE personajes_importantes._idCiudad=?";
            break;
        case "NOTAS":
            query="SELECT COUNT(*) as CANTIDAD FROM notas_ciudad WHERE notas_ciudad._idCiudad=?";
            break;
        default: 
            query="SELECT COUNT(*) as CANTIDAD FROM platillos WHERE platillos._idCiudad=?";
            break;
    }
    return db.query(query,[id_ciudad]);
}

//DELETE
async function removeITEM(itemID, item){
    let query="";
    
    item=item.toUpperCase();
    switch(item){
        case "PLATILLOS":
            query="DELETE FROM platillos WHERE platillos.idPlatillos=?";    
            break;
        case "ZONAS":
            query="DELETE FROM zonas_turisticas WHERE zonas_turisticas.idZonaTuristica=?";
            break;
        case "FESTIVIDADES":
            query="DELETE FROM festividad WHERE festividad.idFecha=?";
            break;
        case "PERSONAJES":
            query="DELETE FROM personajes_importantes WHERE personajes_importantes.idPersonajes=?";
            break;
        case "NOTAS":
            query="DELETE FROM notas_ciudad WHERE notas_ciudad.idNotaCiudad=?";
            break;
            
        case "ESTABLECIMIENTOS":
            query = "DELETE FROM establecimientos WHERE establecimientos.idEstablecimiento=? AND establecimientos.pro=0";
            break;
    }
    return db.query(query,[itemID]);
    
}

module.exports = {
    checkPermission,
    iniciarSesion,
    obtenerDatosUsuario,
    actualizarDatosUsuario,
    revisarExistenciaAdministracion,
    generarCiudad,
    modificarCiudad,
    subirRepresentativa,
    subirFotosCiudad,
    eliminarFoto,
    subirFotoItem,
    subirFotoPerfil,
    agregarPlatillo,
    modificarPlatillo,
    agregarZonaTuristica,
    modificarZonaTuristica,
    agregarfestividad,
    modificarfestividad,
    agregarNota,
    modificarNota,
    agregarPersonaje,
    modificarPersonaje,
    agregarEstablecimiento,
    modificarEstablecimiento,
    getCountITEMS,
    removeITEM
}