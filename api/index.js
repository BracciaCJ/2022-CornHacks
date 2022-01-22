const express = require('express');
let app = express();

let server = app.listen(8080, function() {
    console.log('Server is listening on port 8080');
});