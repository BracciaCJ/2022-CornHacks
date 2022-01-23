const express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
const pa11y = require('pa11y'); 
const csv = require('csv-parser');
const fs = require('fs');

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Function to handle the root path
app.get('/', async function(req, res) {
    // Access the provided 'url' query parameters
    let url = req.query.url;
    if (url){
        pa11y(url, {runners:['axe']}).then(async (results) => {
            // Display Violations and total Score
            let axeCodes = new Set();

            results.issues.forEach(element => {
                axeCodes.add(element.code);
            });
        
            var jsonObj = {
                "totalScore": 100,
                "violations": []
            }

            fs.createReadStream('AxeCoreCode.csv')
            .pipe(csv())
            .on('data', (row) => {
                if (axeCodes.has(row['Rule ID'])){
                    jsonObj['violations'].push(row['Rule ID']);
                    if (row['blind']){
                        jsonObj['totalScore'] += parseInt(row['blind']);
                    }
                    if (row['colorblind']){
                        jsonObj['totalScore'] += parseInt(row['colorblind'])
                    }
                    if (row['deaf']){
                        jsonObj['totalScore'] += parseInt(row['deaf']);
                    }
                    if (row['deafblind']){ 
                        jsonObj['totalScore'] += parseInt(row['deafblind']);
                    }
                }
            })
            .on('end', () => {
                res.json(jsonObj)
            });
        }).catch(()=>{
            res.json({error:`Could not process ${url}`});
        });
    } else {
        res.json({error:"Failed to read URL from string"});
    }
});
let server = app.listen(8080, function() {
    console.log('Server is listening on port 8080');
});
