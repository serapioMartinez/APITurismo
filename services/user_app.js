const db = require('./bd');
const config = require('../config');

async function checkPermission(username, pass) {

    const row = await db.query("SELECT usuario_app.idUsuario as ID from usuario_app WHERE usuario_app.nombreUsuario=? AND usuario_app.claveAcceso=?", [username, pass]);
    console.log(row)
    if (!row.length) return false;
    else return true;

}
module.exports = {
    checkPermission
}