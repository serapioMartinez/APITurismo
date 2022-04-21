const db = require('./bd');

async function checkPermission(username, pass) {
    const row = await db.query("SELECT administrador_ciudad.idUsuario as ID from administrador_ciudad WHERE administrador_ciudad.nombreUsuario=? AND administrador_ciudad.claveAcceso=?", [username, pass]);
    console.log(row)
    if (!row.length) return false;
    else return true;
}
async function revisarExistenciaAdministracion(username) {
    const row = await db.query("SELECT ciudades.idCiudad as ID, ciudades.nombreCiudad as NOMBRE from ciudades JOIN administrador_ciudad on administrador_ciudad.idUsuario=ciudades._id_administrador WHERE administrador_ciudad.nombreUsuario=?",
        [username]);
    return row;
}
//Generadores de datos - CREATE, UPDATE 
async function generarCiudad(username, ciudad, region, municipio, correo, telefono, magico = 0, tipos, emergencias, descripcion) {
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
async function subirFotosCiudad(username, data,id_ciudad){
    let query = "INSERT INTO fotos_ciudad(fotos_ciudad.foto, fotos_ciudad._idCiudad, fotos_ciudad.descripcion) VALUES";
    let array = [];
    if(data){
        data.forEach(element => {
            query+=`(?,${id_ciudad},?),`;
            array.push(element.ID);
            array.push(element.descripcion);
        });
        query=query.substring(0,query.length-1)
        console.log(query);
        console.log(array)
        const row= await db.query(query,array);
        return row
    }
    return [];
}

async function agregarPlatillo(username,id_ciudad, nombre, descripcion, foto){
    return db.query("INSERT INTO platillos(platillos._idCiudad,platillos.nombre,platillos.descripcion, platillos.imagen) values(?,?,?,?)",[id_ciudad,nombre,descripcion,foto]);
}

async function agregarZonaTuristica(username,id_ciudad, nombre,tipo, descripcion, foto){
    return db.query("INSERT INTO zonas_turisticas(zonas_turisticas._idCiudad,zonas_turisticas.nombre,zonas_turisticas.tipoZona, zonas_turisticas.descripcion, zonas_turisticas.foto) values(?,?,?,?,?)",[id_ciudad,nombre, tipo,descripcion,foto]);
}

async function agregarfestividad(username,id_ciudad,dia, mes, nombre, descripcion, foto){
    return db.query("INSERT INTO festividad(festividad._idCiudad, festividad.dia, festividad.mes, festividad.nombre, festividad.descripcion, festividad.imagen) VALUES(?,?,?,?,?,?)",[id_ciudad,dia,mes,nombre,descripcion,foto]);
}
async function agregarPersonaje(username, id_ciudad,nombre,nacimiento,fallecimiento,descripcion,foto){
    return db.query("INSERT INTO personajes_importantes(personajes_importantes._idCiudad,personajes_importantes.nombre, personajes_importantes.anhoNacimiento, personajes_importantes.anhoFallecimiento, personajes_importantes.descripcion,personajes_importantes.foto) VALUES (?,?,?,?,?,?)",[id_ciudad,nombre, nacimiento, fallecimiento,descripcion,foto]);
}
async function agregarNota(username, id_ciudad, titulo, descripcion,imagen){
    let currentDate = new Date();
    return db.query("INSERT INTO notas_ciudad(notas_ciudad._idCiudad, notas_ciudad.titulo, notas_ciudad.descripcion, notas_ciudad.imagen, notas_ciudad.fechaPublicacion) values(?,?,?,?,?)",[id_ciudad,titulo, descripcion, imagen,`${currentDate.getFullYear()}/${currentDate.getMonth()+1}/${currentDate.getDate()}`])
}
async function agregarEstablecimiento(id_ciudad, nombre, tipo, telefono, correo, foto=null){
    let resultado = await db.query("INSERT INTO establecimientos(establecimientos.nombre, establecimientos.tipoEstablecimiento, establecimientos.telefono, establecimientos.correo, establecimientos.imagenRepresentativa) values(?,?,?,?,?)",[nombre,tipo,telefono, correo, foto]);
    resultado = await db.query("INSERT INTO direccion(direccion._idEstablecimiento, direccion._idCiudad) values (?,?)",[resultado.insertId,id_ciudad])
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
    }
    return db.query(query,[itemID]);
    
}

module.exports = {
    checkPermission,
    revisarExistenciaAdministracion,
    generarCiudad,
    modificarCiudad,
    subirRepresentativa,
    subirFotosCiudad,
    agregarPlatillo,
    agregarZonaTuristica,
    agregarfestividad,
    agregarNota,
    agregarPersonaje,
    agregarEstablecimiento,
    getCountITEMS,
    removeITEM
}