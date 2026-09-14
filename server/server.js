import http from 'http';
import express from  'express';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import {connectDB,getDB,health} from './db.js'; 
import {getProductList, updateProduct,addProduct, deleteProduct} from './routes/productRoutes.js' //imports additional routes.
import { onMessage } from './sockets.js';
dotenv.config();
const app = express();

const ALLOWED_ORIGINS = process.env.allowed_origins.split(' ');
const HTTP_PORT = process.env.http_port || 3000;
  
app.use(cors({ //controls what frontend origins are allowed to communicate with the server.
        origin: (origin, callback) => {
        // allow no-origin (e.g., curl/local) and explicit matches
        if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        methods: ['GET','POST','DELETE','PUT'],
        
        }));

app.use(express.json());


//HTTP SERVER
const httpServer = http.createServer(app);


//SOCKETS
const io = new Server(httpServer , {
    cors: {
        origin: (origin, callback) => {
        // allow no-origin (e.g., curl/local) and explicit matches
        if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked for origin: ${origin}`));
        },   // Angular dev server
        methods: ['GET', 'POST','DELETE'],
        
    }
});

async function sockets(){
    io.on('connect',(socket) => {
       onMessage(io,socket); 
    })
}
sockets();


//MONGO CONNECTION
async function mongo() {
  try {
    // Connects the client to the server 
        await connectDB();
        
        //test link to see if server health is good. single ping One ping only..
        health(); // DB health
        app.get('/',(_req,res)=> res.send({ok:true}));

        //Product Routes
        getProductList(app);
        updateProduct(app);
        addProduct(app);
        deleteProduct(app);

        } finally {}
}
mongo().catch(console.dir);


//Start liestening to HTTP Server
httpServer.listen(3000,() => {
    //console.log(`Starting https server at :${HTTP_PORT}`);
});

export { app, httpServer };
