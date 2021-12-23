//Imports
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';

//App config
const app = express();
const port = process.env.port || 9000;

//middleware

//Database config
//lo3yuMLCyASdWhXf
const connection_url = 'mongodb+srv://admin:lo3yuMLCyASdWhXf@serverlessinstance0.yg6cm.mongodb.net/message-app-backend?retryWrites=true&w=majority'
mongoose.connect(connection_url);

//api routes
app.get('/', (req, res)=>res.status(200).send("Hello world!"));

app.post('/api/v1/messages/new', (req, res)=>{
    const dbMessage = req.body;

    Messages.create(dbMessage, (err, data)=> {
        const dbMessage = req.body;

        dbMessages.create(dbMessage, (err, data)=> {
            if(err){
                //sends server error
                res.status(500).send(err);
            } else {
                //successful creation
                res.status(201).send(`new message created: \n ${data}`)
            }
        })
    })
})

//listener
app.listen(port, ()=> console.log(`Listening on local host:${port}`));