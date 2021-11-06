const express = require('express');

const app = express();
app.use(express.json({limit: '500mb'}));
app.use(express.urlencoded({limit: '500mb'}));

// API
const routeUsers = require('./routes/users');
app.use('/user', routeUsers);

// App
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
    console.log(`Example app listening on port ${PORT}!`);
});


process.on('exit', function() {
    console.log(`exiting`);
});
