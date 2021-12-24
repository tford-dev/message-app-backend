//Imports
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';

//App config
const app = express();
const port = process.env.port || 9000;

//The purpose of pusher is to make mongodb become real-time
const pusher = new Pusher({
  appId: "1321644",
  key: "05d06724ff39336a318a",
  secret: "1c6aef4480d290123147",
  cluster: "mt1",
  useTLS: true
});

pusher.trigger("my-channel", "my-event", {
  message: "hello world"
});

//middleware
app.use(express.json());

//Allows request to come from any endpoint
app.use((request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Accesss-Control-Allow-Headers", "*");
});


//Database config
//GJfDcdn7p6rAZfiO
const connectionUrl = 'mongodb+srv://admin:GJfDcdn7p6rAZfiO@cluster0.gi6ya.mongodb.net/message-app-db?retryWrites=true&w=majority';

//syncs server to cluster
mongoose.connect(connectionUrl);

const db = mongoose.connection;

db.once('open', () => {
    console.log("DB connected");

    //Collection
    const msgCollection = db.collection("messageContents");
    const changeStream = msgCollection.watch();

    changeStream.on('change', (change) => {
        console.log("A change occured", change);

        //Passes request through Pusher
        if(change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted', 
                {
                    name: messageDetails.user,
                    message: messageDetails.message,
                    timestamp: messageDetails.timestamp,
                    recieved: messageDetails.recieved,
                }
            );
        }   else {
            console.log("Error triggering Pusher")
        }
    })
});

//api routes
app.get('/', (req, res)=>res.status(200).send("Hello world!"));

app.get('/messages/sync', (req, res) => {
    Messages.find((err, data)=>{
        if(err){
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    });
});

//POST request to create a new message
app.post('/messages/new', (req, res)=>{
    const dbMessage = req.body;
    Messages.create(dbMessage, (err, data)=> {
        if(err){
            //sends server error
            res.status(500).send(err);
        } else {
            //successful creation
            res.status(201).send(`new message created: \n ${data}`)
        }
    })
})

//listener
app.listen(port, ()=> console.log(`Listening on local host:${port}`));