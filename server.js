//Imports
import express from 'express';
import res from 'express/lib/response';

//App config
const app = express();
const port = process.env.port || 9000;

//middleware

//Database config

//api routes
app.get('/', (req, re)=>res.status(200).send("Hello world!"));

//listener
app.listen(port, ()=> console.log(`Listening on local host:${port}`));