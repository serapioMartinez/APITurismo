const db = require('./bd');

async function getHomeData(){
    const row = await db.query('CALL getHomeData()',[]);
    if (!row) return [];
    else return row;
}
async function buscarCiudades(expresion, page=0){
    const row = await db.query('CALL consultarCiudades(?,?)',[expresion, page]);
    if (!row) return [];
    else return row;
}
async function obtenerDatosCiudad(idCiudad){
    return db.query("SELECT ciudades.idCiudad as ID, ciudades.nombreCiudad as NOMBRE, ciudades.region AS REGION, ciudades.municipio AS MUNICIPIO, ciudades.correo AS CORREO, ciudades.telefono AS TELEFONO, ciudades.urlMaps AS MAPS, ciudades.puebloMagico AS MAGICO, ciudades.tiposTurismo AS TIPOS, ciudades.numero_emergencias AS EMERGENCIAS, ciudades.calificacion AS CALIFICACION, ciudades.descripcion AS DESCRIPCION, ciudades.imagenRepresentativa AS FOTO FROM ciudades WHERE ciudades.idCiudad=?",[idCiudad]);
}
async function obtenerDatosEstablecimiento(idEstablecimiento, idCiudad=null){
    let query = "";
    if (idCiudad==null || idCiudad==0) query = "SELECT establecimientos.idEstablecimiento as ID, establecimientos.nombre AS NOMBRE, establecimientos.tipoEstablecimiento AS TIPO, establecimientos.telefono AS TELEFONO, establecimientos.correo AS CORREO, establecimientos.imagenRepresentativa AS FOTO, establecimientos.pro AS PRO, establecimientos.descripcion as DESCRIPCION, establecimiento_pro.calificacion as CALIFICACION, establecimiento_pro.paginaWeb as WEB FROM establecimientos JOIN establecimiento_pro ON establecimiento_pro._idEstablecimiento=establecimientos.idEstablecimiento WHERE establecimientos.idEstablecimiento=?"
    else query="SELECT establecimientos.idEstablecimiento as ID, establecimientos.nombre AS NOMBRE, establecimientos.tipoEstablecimiento AS TIPO, establecimientos.telefono AS TELEFONO, establecimientos.correo AS CORREO, establecimientos.imagenRepresentativa AS FOTO, establecimientos.pro AS PRO, establecimientos.descripcion as DESCRIPCION, direccion.calle AS CALLE, direccion.colonia AS COLONIA, direccion.numero AS NUMERO, direccion.cp AS CP FROM establecimientos JOIN direccion ON establecimientos.idEstablecimiento=direccion._idEstablecimiento WHERE establecimientos.idEstablecimiento=? AND direccion._idCiudad=?";
    return await db.query(query,(idCiudad==null || idCiudad==0)?[idEstablecimiento]:[idEstablecimiento, idCiudad]);
}
async function obtenerDatosProEstablecimiento(idEstablecimiento){
    return db.query("SELECT establecimiento_pro.calificacion as CALIFICACION, establecimiento_pro.paginaWeb AS PAGINA, establecimiento_pro.urlMaps AS MAPS, establecimiento_pro.tiposPago AS TIPOS, horario_atencion.lunes AS LUNES, horario_atencion.martes AS MARTES, horario_atencion.miercoles AS MIERCOLES, horario_atencion.jueves AS JUEVES, horario_atencion.viernes AS VIERNES, horario_atencion.sabado AS SABADO, horario_atencion.domingo AS DOMINGO FROM establecimiento_pro JOIN horario_atencion ON establecimiento_pro._idEstablecimiento=horario_atencion._idEstablecimiento WHERE establecimiento_pro._idEstablecimiento=?",[idEstablecimiento]);
}
async function obtenerHorariosAtencion(idEstablecimiento){
    return db.query("SELECT horario_atencion.idHorarioAtencion AS ID, horario_atencion.lunes AS LUNES, horario_atencion.martes AS MARTES, horario_atencion.miercoles AS MIERCOLES, horario_atencion.jueves AS JUEVES, horario_atencion.viernes AS VIERNES, horario_atencion.sabado AS SABADO, horario_atencion.domingo AS DOMINGO FROM horario_atencion WHERE horario_atencion._idEstablecimiento=?",[idEstablecimiento]);
}
async function obtenerDirecciones(idEstablecimiento){
    return db.query("SELECT direccion.idDireccion AS ID, ciudades.nombreCiudad AS NOMBRE FROM direccion JOIN ciudades ON direccion._idCiudad= ciudades.idCiudad WHERE direccion._idEstablecimiento=?",[idEstablecimiento])
}
async function obtenerDireccion(idDireccion){
    return db.query("SELECT direccion.colonia AS COLONIA, direccion.numero AS NUMERO, direccion.cp AS CP, direccion.calle AS CALLE, direccion._idCiudad AS ID_CIUDAD, ciudades.nombreCiudad AS CIUDAD FROM direccion JOIN ciudades ON direccion._idCiudad= ciudades.idCiudad WHERE direccion.idDireccion=?",[idDireccion]);
}
async function obtenerSalidaTransporte(idSalida){
    return db.query("SELECT salidas_transporte.dia as DIA, salidas_transporte.duracionViaje AS DURACION FROM salidas_transporte WHERE salidas_transporte.idSalidasTransporte=?",[idSalida]);
}
async function obtenerSalidas(idEstablecimiento){
    return db.query("SELECT DISTINCT salidas_transporte._idCiudadDestino AS ID, ciudades.nombreCiudad AS NOMBRE FROM salidas_transporte JOIN ciudades ON salidas_transporte._idCiudadDestino=ciudades.idCiudad JOIN establecimientos ON salidas_transporte._idTransporte=establecimientos.idEstablecimiento WHERE salidas_transporte._idTransporte=?",[idEstablecimiento]);
}
async function obtenerIdSalidas(idEstablecimiento, idCiudad){
    return db.query("SELECT salidas_transporte.idSalidasTransporte AS ID, salidas_transporte.dia as DIA, salidas_transporte.duracionViaje AS DURACION FROM salidas_transporte WHERE salidas_transporte._idTransporte=? AND salidas_transporte._idCiudadDestino=? ORDER BY salidas_transporte.dia",[idEstablecimiento, idCiudad]);
}
async function obtenerHorasSalidas(idSalida){
    return db.query("SELECT hora_salida.idHora as ID, hora_salida.hora AS HORA FROM hora_salida WHERE hora_salida._idSalidasTransporte=?",[idSalida])
}
async function consultarEstablecimientos(idCiudad=0, tipo="NT", page=0){
    let query="";
    if(idCiudad==0){
        query=`SELECT establecimientos.idEstablecimiento as ID, establecimientos.nombre as NOMBRE, establecimientos.tipoEstablecimiento AS TIPO, IF(establecimientos.pro=1,establecimiento_pro.calificacion,0) AS CALIFICACION FROM establecimientos LEFT JOIN establecimiento_pro ON establecimiento_pro._idEstablecimiento=establecimientos.idEstablecimiento ORDER BY CALIFICACION DESC,ID DESC LIMIT ${page*10},10`;
        return db.query(query,[])
    }else{
        query=`SELECT DISTINCT  establecimientos.idEstablecimiento as ID, establecimientos.nombre AS NOMBRE,establecimientos.pro AS PRO , IF(establecimientos.pro=1, establecimiento_pro.calificacion,0) AS CALIFICACION FROM establecimientos LEFT JOIN establecimiento_pro ON establecimientos.idEstablecimiento=establecimiento_pro._idEstablecimiento JOIN direccion ON direccion._idEstablecimiento=establecimientos.idEstablecimiento  WHERE ${(tipo!="NT")?"establecimientos.tipoEstablecimiento=?  AND":""} direccion._idCiudad=? ORDER BY CALIFICACION DESC, ID DESC LIMIT ${page*10},10`;
        return db.query(query,(tipo!="NT")?[tipo, idCiudad]:[idCiudad]);
    }
}
async function consultarNotas(idCiudad=0, page=0){
    let query="";
    if(idCiudad==0){
        query=`SELECT notas_ciudad.idNotaCiudad as ID, notas_ciudad.titulo as NOMBRE, notas_ciudad.fechaPublicacion AS FECHA, ciudades.nombreCiudad AS CIUDAD FROM notas_ciudad JOIN ciudades ON notas_ciudad._idCiudad=ciudades.idCiudad ORDER BY notas_ciudad.fechaPublicacion DESC LIMIT ${page*10},10`;
        return db.query(query,[])
    }else{
        query=`SELECT notas_ciudad.idNotaCiudad as ID, notas_ciudad.titulo as NOMBRE, notas_ciudad.fechaPublicacion AS FECHA, ciudades.nombreCiudad AS CIUDAD FROM notas_ciudad JOIN ciudades ON notas_ciudad._idCiudad=ciudades.idCiudad WHERE notas_ciudad._idCiudad=? ORDER BY notas_ciudad.fechaPublicacion DESC LIMIT ${page*10},10`;
        return db.query(query,[idCiudad])
    }
}
async function consultarPlatillos(id_ciudad, page=0){
    return db.query(`SELECT platillos.idPlatillos as ID, platillos.nombre as NOMBRE from platillos WHERE platillos._idCiudad=? LIMIT ${page*10},10`,[id_ciudad]);
}
async function consultarZonasTuristicas(id_ciudad, page=0){
    return db.query(`SELECT zonas_turisticas.idZonaTuristica as ID, zonas_turisticas.nombre as NOMBRE, zonas_turisticas.tipoZona as TIPO from zonas_turisticas WHERE zonas_turisticas._idCiudad=? LIMIT ${page*10},10`,[id_ciudad]);
}
async function consultarFestividades(id_ciudad, page=0){
    return db.query(`SELECT festividad.idFecha as ID, festividad.nombre as NOMBRE from festividad WHERE festividad._idCiudad=? limit ${page*10},10`,[id_ciudad]);
}
async function consultarPersonajes(id_ciudad, page=0){
    return db.query(`SELECT personajes_importantes.idPersonajes as ID, personajes_importantes.nombre as NOMBRE FROM personajes_importantes WHERE personajes_importantes._idCiudad=? limit ${page*10},10`,[id_ciudad]);
}
async function consultarNotasCiudad(id_ciudad, page=0){
    return db.query(`SELECT notas_ciudad.idNotaCiudad as ID, notas_ciudad.titulo AS TITULO, notas_ciudad.fechaPublicacion AS FECHA FROM notas_ciudad WHERE notas_ciudad._idCiudad=? LIMIT ${page*10},10`,[id_ciudad]);
}

//Agregar funciones para obtener los datos los datos correspondientes de un elemento
async function obtenerPlatillo(idPlatillo){
    return db.query("SELECT platillos.idPlatillos as ID, platillos.nombre as NOMBRE, platillos.descripcion as DESCRIPCION, platillos.imagen AS FOTO FROM platillos WHERE platillos.idPlatillos=?",[idPlatillo])
}

async function obtenerZonaTuristica(idZona){
    return db.query("SELECT zonas_turisticas.idZonaTuristica AS ID, zonas_turisticas.nombre AS NOMBRE, zonas_turisticas.tipoZona AS TIPO, zonas_turisticas.descripcion AS DESCRIPCION, zonas_turisticas.foto AS FOTO FROM zonas_turisticas WHERE zonas_turisticas.idZonaTuristica=?",[idZona]);
}

async function obtenerFestividad(idFestividad){
    return db.query("SELECT festividad.idFecha AS ID, festividad.nombre AS NOMBRE, festividad.dia AS DIA, festividad.mes AS MES, festividad.descripcion AS DESCRIPCION, festividad.imagen AS FOTO FROM festividad WHERE festividad.idFecha=?",[idFestividad]);
}

async function obtenerPersonaje(idPersonaje){
    return db.query("SELECT personajes_importantes.idPersonajes AS ID, personajes_importantes.nombre AS NOMBRE, DATE_FORMAT(personajes_importantes.anhoNacimiento,'%Y-%m-%d') AS NACIMIENTO, DATE_FORMAT(personajes_importantes.anhoFallecimiento,'%Y-%m-%d') AS FALLECIMIENTO, personajes_importantes.descripcion AS DESCRIPCION, personajes_importantes.foto AS FOTO FROM personajes_importantes WHERE personajes_importantes.idPersonajes=?",[idPersonaje]);
}
async function obtenerNota(idNota){
    return db.query("SELECT notas_ciudad.idNotaCiudad AS ID, notas_ciudad.titulo AS TITULO, notas_ciudad.descripcion AS DESCRIPCION, notas_ciudad.fechaPublicacion AS FECHA, notas_ciudad.imagen AS FOTO, ciudades.nombreCiudad as CIUDAD FROM notas_ciudad JOIN ciudades on notas_ciudad._idCiudad=ciudades.idCiudad WHERE notas_ciudad.idNotaCiudad=?",[idNota]);
}
async function listarCiudades(){
    return await db.query("SELECT ciudades.idCiudad AS ID, ciudades.nombreCiudad AS CIUDAD FROM ciudades",[]);
}
async function obtenerGaleria(id, tipo="CIUDAD"){
    tipo=tipo.toUpperCase();
    if(tipo=="CIUDAD"){
        return await db.query("SELECT fotos_ciudad.foto AS FOTO FROM fotos_ciudad WHERE fotos_ciudad._idCiudad=?",[id])
    }else{
        return await db.query("SELECT fotos_establecimiento.foto AS FOTO FROM fotos_establecimiento WHERE fotos_establecimiento._idEstablecimiento=? ",[id])        
    }
}

module.exports={
    getHomeData,
    obtenerDatosCiudad,
    obtenerDatosEstablecimiento,
    obtenerDatosProEstablecimiento,
    obtenerHorariosAtencion,
    obtenerDirecciones,
    obtenerDireccion,
    obtenerSalidaTransporte,
    obtenerSalidas,
    obtenerIdSalidas,
    obtenerHorasSalidas,
    buscarCiudades,
    consultarEstablecimientos,
    consultarNotas,
    consultarFestividades,
    consultarNotasCiudad,
    consultarPersonajes,
    consultarPlatillos,
    consultarZonasTuristicas,
    obtenerFestividad,
    obtenerNota,
    obtenerPersonaje,
    obtenerPlatillo,
    obtenerZonaTuristica,
    listarCiudades,
    obtenerGaleria
}