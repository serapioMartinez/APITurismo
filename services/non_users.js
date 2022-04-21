const db = require('./bd');

async function getHomeData(){
    const row = await db.query('CALL getHomeData()',[]);
    if (!row) return [];
    else return row;
}
async function buscarCiudades(expresion){
    const row = await db.query('CALL consultarCiudades(?)',[expresion]);
    if (!row) return [];
    else return row;
}
async function consultarEstablecimientos(idCiudad=0, tipo="NT", page=0){
    let query="";
    if(idCiudad==0){
        query=`SELECT establecimientos.idEstablecimiento as ID, establecimientos.nombre as NOMBRE, establecimientos.tipoEstablecimiento AS TIPO, IF(establecimientos.pro=1,establecimiento_pro.calificacion,0) AS CALIFICACION FROM establecimientos LEFT JOIN establecimiento_pro ON establecimiento_pro._idEstablecimiento=establecimientos.idEstablecimiento ORDER BY CALIFICACION DESC,ID DESC LIMIT ${page*10},10`;
        return db.query(query,[])
    }else{
        query=`SELECT establecimientos.idEstablecimiento as ID, establecimientos.nombre AS NOMBRE, IF(establecimientos.pro=1, establecimiento_pro.calificacion,0) AS CALIFICACION FROM establecimientos LEFT JOIN establecimiento_pro ON establecimientos.idEstablecimiento=establecimiento_pro._idEstablecimiento JOIN direccion ON direccion._idEstablecimiento=establecimientos.idEstablecimiento  WHERE establecimientos.tipoEstablecimiento=? AND direccion._idCiudad=? ORDER BY CALIFICACION DESC, ID DESC LIMIT ${page*10},10`;
        return db.query(query,[tipo, idCiudad])
    }
}
async function consultarNotas(idCiudad=0, page=0){
    let query="";
    if(idCiudad==0){
        query=`SELECT notas_ciudad.idNotaCiudad as ID, notas_ciudad.titulo as TITULO, notas_ciudad.fechaPublicacion AS FECHA, ciudades.nombreCiudad AS CIUDAD FROM notas_ciudad JOIN ciudades ON notas_ciudad._idCiudad=ciudades.idCiudad ORDER BY notas_ciudad.fechaPublicacion DESC LIMIT ${page*10},10`;
        return db.query(query,[])
    }else{
        query=`SELECT notas_ciudad.idNotaCiudad as ID, notas_ciudad.titulo as TITULO, notas_ciudad.fechaPublicacion AS FECHA, ciudades.nombreCiudad AS CIUDAD FROM notas_ciudad JOIN ciudades ON notas_ciudad._idCiudad=ciudades.idCiudad WHERE notas_ciudad._idCiudad=? ORDER BY notas_ciudad.fechaPublicacion DESC LIMIT ${page*10},10`;
        return db.query(query,[tipo, idCiudad])
    }
}
async function consultarPlatillos(id_ciudad, page=0){
    return db.query(`SELECT platillos.idPlatillos as ID, platillos.nombre as NOMBRE WHERE platillos._idCiudad=? LIMIT ${page*10},10`,[id_ciudad]);
}
async function consultarZonasTuristicas(id_ciudad, page=0){
    return db.query(`SELECT zonas_turisticas.idZonaTuristica as ID, zonas_turisticas.nombre as NOMBRE, zonas_turisticas.tipoZona as TIPO from zonas_turisticas WHERE zonas_turisticas._idCiudad=? LIMIT ${page*10},10`,[id_ciudad]);
}
async function consultarFestividades(id_ciudad, page=0){
    return db.query(`SELECT festividad.idFecha as ID, festividad.nombre as NOMBRE from festividad WHERE festividad._idCiudad=? limit ${page*10},1`,[id_ciudad]);
}
async function consultarPersonajes(id_ciudad, page=0){
    return db.query(`SELECT personajes_importantes.idPersonajes as ID, personajes_importantes.nombre as NOMBRE FROM personajes_importantes WHERE personajes_importantes._idCiudad=? limit ${page*10},1`,[id_ciudad]);
}
async function consultarNotasCiudad(id_ciudad, page=0){
    return db.query(`SELECT notas_ciudad.idNotaCiudad as ID, notas_ciudad.titulo AS TITULO, notas_ciudad.fechaPublicacion AS FECHA FROM notas_ciudad WHERE notas_ciudad._idCiudad=? LIMIT ${page*10},1`,[id_ciudad]);
}

//Agregar funciones para obtener los datos los datos correspondientes de un elemento

module.exports={
    getHomeData,
    buscarCiudades,
    consultarEstablecimientos,
    consultarNotas,
    consultarFestividades,
    consultarNotasCiudad,
    consultarPersonajes,
    consultarPlatillos,
    consultarZonasTuristicas
}