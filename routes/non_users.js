const express = require('express');
const router = express.Router();
const non_users = require('../services/non_users');

router.get('/', async function(req,res, next){
    try{
         res.json(await non_users.getHomeData());
    }catch(err){
        console.log("Error mientras se obtenian los datos de Home", err.message);
        res.json({error: err.message});
        next(err);
    }
})
router.get('/lugares', async function(req,res, next){
    try{
        res.json(await non_users.buscarCiudades(req.body.expresion));
   }catch(err){
       console.log("Error mientras se obtenian los datos de Home", err.message);
       res.json({error: err.message});
       next(err);
   }
});

module.exports = router;