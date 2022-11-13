// Import builtin NodeJS modules to instantiate the service
import https from 'https';
import fs from 'fs';
import express from 'express';
import WebSocket, {WebSocketServer} from 'ws';

import routeUsers from './routes/users.js';


const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};

const wss = new WebSocketServer({port: 8080});
wss.on('connection', function connection(ws) {
  ws.on('message', function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        setInterval(
            () => {
              const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});
              client.send(`ui|setTime|${ currentTime } `);
            }
            , 1000);
      }
    });
  });
});

const app = express();
app.use(express.static('public'));
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({limit: '5kb'}));

app.use('/users', routeUsers);


// Create a NodeJS HTTPS listener on port 4000 that points to the Express app
// Use a callback function to tell when the server is created.
https
    .createServer(options, app)
    .listen(4000, ()=>{
      console.log('server is running at port 4000');
    });

process.on('exit', function() {
  console.log('exiting');
});
