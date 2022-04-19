const db = require('./bd');
//Crear - INSERT, UPDATE
async function checkPermission(username, pass) {
    const row = await db.query("SELECT administrador_establecimiento.idUsuario as ID FROM administrador_establecimiento WHERE administrador_establecimiento.nombreUsuario=? AND administrador_establecimiento.claveAcceso=?", [username, pass]);
    console.log(row)
    if (!row.length) return false;
    else return true;
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
    const row = await db.query("INSERT INTO horario_atencion(horario_atencion._idEstablecimiento, horario_atencion.lunes, horario_atencion.martes, horario_atencion.miercoles, horario_atencion.jueves, horario_atencion.viernes, horario_atencion.sabado, horario_atencion.domingo) VALUES(?,?,?,?,?,?,?)",[idEstablecimiento, lunes, martes, miercoles, jueves, viernes, sabado, domingo]);
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
    crearEstablecimiento,
    modificarEstablecimiento,
    reclamarEstablecimiento,
    crearHorarioAtencion,
    modificarHorarioAtencion,
    crearDireccion,
    modificarDireccion,
    insertarFotos
}