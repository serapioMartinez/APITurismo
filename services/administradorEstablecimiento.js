const db = require('./bd');
//Crear - INSERT, UPDATE
async function checkPermission(username, pass) {
    const row = await db.query("SELECT administrador_establecimiento.idUsuario as ID FROM administrador_establecimiento WHERE administrador_establecimiento.nombreUsuario=? AND administrador_establecimiento.claveAcceso=?", [username, pass]);
    console.log(row)
    if (!row.length) return false;
    else return true;
}
async function iniciarSesion(username, pass){
    const row = await db.query("SELECT administrador_establecimiento.idUsuario AS ID FROM administrador_establecimiento WHERE administrador_establecimiento.nombreUsuario=? AND administrador_establecimiento.claveAcceso=?",
    [username,pass]);
    return row[0];
}  
async function revisarExistenciaAdministracion(username) {
    const row = await db.query("SELECT establecimientos.idEstablecimiento as ID, establecimientos.nombre as NOMBRE from establecimiento_pro JOIN administrador_establecimiento on administrador_establecimiento.idUsuario=establecimiento_pro._idAdministrador JOIN establecimientos ON establecimientos.idEstablecimiento=establecimiento_pro._idEstablecimiento WHERE administrador_establecimiento.nombreUsuario=?",
        [username]);
    return row;
}
async function obtenerDatosUsuario(id){
    const row = await db.query("SELECT administrador_establecimiento.nombre AS NOMBRE, administrador_establecimiento.correo AS CORREO, administrador_establecimiento.imagenUsuario AS FOTO, administrador_establecimiento.cargoEmpresa AS CARGO FROM administrador_establecimiento WHERE administrador_establecimiento.idUsuario=?",[id]);
    return row;
}
async function actualizarDatosUsuario(id, username, nombre, correo, cargo, foto=null){
    const row = await db.query("UPDATE administrador_establecimiento SET administrador_establecimiento.nombreUsuario=?, administrador_establecimiento.nombre=?, administrador_establecimiento.correo=?, administrador_establecimiento.cargoEmpresa=?, administrador_establecimiento.imagenUsuario=? WHERE administrador_establecimiento.idUsuario=?",
    [username, nombre, correo, cargo, foto, id]);
    return row;
}
async function crearEstablecimiento(username, nombre, correo="", telefono, tipo, ciudad, colonia, numero, cp, calle, pagina="", maps=""){
    const row =await db.query("CALL crearEstablecimiento(?,?,?,?,?,?,?,?,?,?,?,?)",[username, nombre, correo, telefono, tipo, ciudad, colonia, numero, cp, calle, pagina, maps]);
    console.log( row)
    return row;
};
async function reclamarEstablecimiento(username,idEstablecimiento){
    const row =await db.query("CALL reclamarEstablecimiento(?,?)",[username,idEstablecimiento]);
    console.log( row)
    return row;
};
async function modificarEstablecimiento(establecimiento, nombre, tipo, correo="", telefono,pagina="", maps=""){
    const row = await db.query("CALL modificarEstablecimiento(?,?,?,?,?,?,?)",[establecimiento, nombre, tipo, telefono, correo, pagina, maps]);
    console.log( row)
    return row;
};
async function crearHorarioAtencion(idEstablecimiento, lunes="-", martes="-", miercoles="-", jueves="-", viernes="-", sabado="-", domingo="-"){
    const row = await db.query("INSERT INTO horario_atencion(horario_atencion._idEstablecimiento, horario_atencion.lunes, horario_atencion.martes, horario_atencion.miercoles, horario_atencion.jueves, horario_atencion.viernes, horario_atencion.sabado, horario_atencion.domingo) VALUES(?,?,?,?,?,?,?,?)",[idEstablecimiento, lunes, martes, miercoles, jueves, viernes, sabado, domingo]);
    console.log( row)
    return row;
};
async function modificarHorarioAtencion(idEstablecimiento, lunes="-", martes="-", miercoles="-", jueves="-", viernes="-", sabado="-", domingo="-"){
    const row = await db.query("UPDATE horario_atencion SET horario_atencion.lunes=?, horario_atencion.martes=?, horario_atencion.miercoles=?, horario_atencion.jueves=?, horario_atencion.viernes=?, horario_atencion.sabado=?, horario_atencion.domingo=? WHERE horario_atencion._idEstablecimiento=?",[lunes, martes, miercoles, jueves, viernes, sabado, domingo,idEstablecimiento]);
    console.log( row)
    return row;
};
async function crearDireccion(idEstablecimiento, idCiudad, colonia, numero, cp, calle){
    const row = await db.query("INSERT INTO direccion(direccion._idEstablecimiento, direccion._idCiudad, direccion.colonia, direccion.numero, direccion.cp, direccion.calle) VALUES(?,?,?,?,?,?)",[idEstablecimiento, idCiudad, colonia, numero, cp, calle]);
    console.log( row)
    return row;
};
async function modificarDireccion(idEstablecimiento, idCiudad, colonia, numero, cp, calle){
    const row = await db.query("UPDATE direccion SET direccion._idCiudad=?, direccion.colonia=?, direccion.numero=?, direccion.cp=?, direccion.calle=? WHERE direccion._idEstablecimiento=?",[idCiudad, colonia, numero, cp, calle, idEstablecimiento]);
    console.log( row)
    return row;
};
async function insertarFotos(data,id_establecimiento){
    let query = "INSERT INTO fotos_establecimiento(fotos_establecimiento.foto, fotos_establecimiento._idEstablecimiento, fotos_establecimiento.descripcion) VALUES";
    let array = [];
    if(data){
        data.forEach(element => {
            query+=`(?,${id_establecimiento},?),`;
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
//async function eliminarFotos(){};
async function insertarSalidaTransporte(transporte, destino, dia, duracion, horas){
    const result = await db.query("INSERT INTO salidas_transporte(salidas_transporte._idTransporte, salidas_transporte._idCiudadDestino, salidas_transporte.dia, salidas_transporte.duracionViaje) VALUES(?,?,?,?)",[transporte, destino, dia, duracion]);
    if(result.affectedRows>0){
        let array=[]
        let query="INSERT INTO hora_salida(hora_salida._idSalidasTransporte, hora_salida.hora)"
        horas.forEach(hora => {
            query+=` VALUES(${result.insertId},?),`;
            array.push(hora);
        });
        query=query.substring(0,query.length-1)
        return await db.query(query,array);
    }
    return [];
}
async function eliminarSalidaTransporte(id){
    return await db.query("DELETE from salidas_transporte WHERE salidas_transporte.idSalidasTransporte=?",[id]);

}
module.exports={
    checkPermission,
    iniciarSesion,
    revisarExistenciaAdministracion,
    obtenerDatosUsuario,
    actualizarDatosUsuario,
    crearEstablecimiento,
    modificarEstablecimiento,
    reclamarEstablecimiento,
    crearHorarioAtencion,
    modificarHorarioAtencion,
    crearDireccion,
    modificarDireccion,
    insertarFotos,
    insertarSalidaTransporte,
    eliminarSalidaTransporte
}