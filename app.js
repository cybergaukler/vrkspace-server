// Import builtin NodeJS modules to instantiate the service
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

const express = require("express");
const app = express();
app.use(express.static('public'))
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({limit: '5kb'}));

const routeUsers = require('./routes/users');
app.use('/users', routeUsers);


// Create a NodeJS HTTPS listener on port 4000 that points to the Express app
// Use a callback function to tell when the server is created.
https
  .createServer(options, app)
  .listen(4000, ()=>{
    console.log('server is running at port 4000')
  });

process.on('exit', function() {
    console.log(`exiting`);
});
