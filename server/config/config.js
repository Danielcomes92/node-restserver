//=============
//Puerto
//=============
process.env.PORT = process.env.PORT || 3000;

//=============
//Entorno
//=============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=============
//Vencimiento del token
//=============
//60 secs
//60 mins
//24 hs
//30 dias
process.env.CADUCIDAD_TOKEN = '48h';

//============= 
//SEED de autenticacion
//=============
process.env.SEED = process.env.SEED || 'este-es-seed-desarrollo';


//=============
//Base de datos
//=============
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//=============
//Google Client ID
//=============
process.env.CLIENT_ID = process.env.CLIENT_ID || '81253377300-2vptouso98qd1qald37a1j2q3i1hn1um.apps.googleusercontent.com';