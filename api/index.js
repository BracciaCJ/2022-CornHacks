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
    console.log(url);
    if (url){
    pa11y(url, {runners:['axe']}).then((results) => {
        // Diasplay the number of issues found to the user as JSON
        let axeCodes = new Set();
        results.issues.forEach(element => {
            axeCodes.add(element.code);
        });
        AnalyzeResult(axeCodes);
}).catch(()=>{
    res.json({error:`Could not process ${url}`});

});}
else{res.json({error:"Failed to read URL from string"});}
});
let server = app.listen(8080, function() {
    console.log('Server is listening on port 8080');
});


function AnalyzeResult(axeCodeSet){
    console.log(axeCodeSet);
    let totalScore = 100;
    fs.createReadStream('AxeCoreCode.csv')
    .pipe(csv())
    .on('data', (row) => {
        if (axeCodeSet.has(row['Rule ID'])){
            console.log("------------------------")
            console.log("Rule ID: " + row['Rule ID'])
            // console.log(row['blind']);
            // console.log(row['colorblind']);
            // console.log(row['deaf']);
            // console.log(row['deafblind']);

            if (row['blind']){
                totalScore += parseInt(row['blind'])
            }
            if (row['colorblind']){
                totalScore += parseInt(row['colorblind'])
            }
            if (row['deaf']){
                totalScore += parseInt(row['deaf'])
            }
            if (row['deafblind']){
                totalScore += parseInt(row['deafblind'])
            }
            console.log("Total Score: " + totalScore)
        }
    })
    .on('end', () => {
        console.log('Website successfully analyzed');
    });
  };