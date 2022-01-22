const express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
const pa11y = require('pa11y');
let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Function to handle the root path
app.get('/', function (req, res) {
    // Access the provided 'url' query parameters
    let url = req.query.url;
    console.log(url);
    if (url) {
        pa11y(url).then((results) => {
            // Display the number of issues found to the user as JSON
            res.json({ issues: results.issues.length });
        }).catch(() => {
            res.json({ error: `Could not process ${url}`});

        });
    }
    else { res.json({ error: "Failed to read URL from string" }); }
});
module.exports = app
