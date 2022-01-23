const express = require('express');
const bodyParser = require('body-parser');
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
    let disabilities = req.query.disabilities;

    let blindIndex = disabilities.search("b");
    let deafIndex = disabilities.search("d");
    let colorBlindIndex = disabilities.search("c");
        
    let isBlind;
    let isDeaf;
    let isColorBlind;

    if (disabilities.charAt(blindIndex+1) == 't'){
        isBlind = true;
    }
    if (disabilities.charAt(deafIndex+1) == 't'){
        isDeaf = true;
    }
    if (disabilities.charAt(colorBlindIndex+1) == 't'){
        isColorBlind = true;
    }

    
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

                    let maxDeduction = 0;

                    if (row['blind'] && isBlind){
                        if (row['blind'] <= maxDeduction){
                            maxDeduction = row['blind']
                        }
                    }
                    if (row['colorblind'] && isColorBlind){
                        if (row['colorblind'] <= maxDeduction){
                            maxDeduction = row['colorblind']
                        }
                    }
                    if (row['deaf'] && isDeaf){
                        if (row['deaf'] <= maxDeduction){
                            maxDeduction = row['deaf']
                        }
                    }

                    jsonObj['totalScore'] += parseInt(maxDeduction);
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
