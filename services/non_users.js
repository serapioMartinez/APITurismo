const db = require('./bd');
const config = require('../config');

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
module.exports={
    getHomeData,
    buscarCiudades
}