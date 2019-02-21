// - Importing NodeJS modules - \\
const fs = require('fs');
const http = require('http');
const url = require('url');

// - Importing JSON data file - \\
const json = fs.readFileSync(`${__dirname}/../data/data.json`, 'utf-8');
const laptopData = JSON.parse(json); // Parsing JSON to JS Object

const server = http.createServer((req, res) => {
    // Getting the url path > Parsing it
    const pathName = url.parse(req.url, true).pathname;
    // Getting the query > Parsing it
    const queryID = url.parse(req.url, true).query.id;

    // - PAGE - | - PRODUCTS - \\
    if (pathName === '/products' || pathName === '/') {
        // Base Setup of the running server (200 Header for okay)
        res.writeHead(200, { 'Content-type': 'text/html' });

        fs.readFile(`${__dirname}/../data/templates/template-overview.html`, 'utf-8', (err, data) => { // data returns full template
            let overviewOutput = data;

            // - RENDERING LAPTOP CARDS - \\
            fs.readFile(`${__dirname}/../data/templates/template-card.html`, 'utf-8', (err, data) => { // data returns full template

                // Looping through laptops elements and giving each one of them card template
                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join(''); // map returns the array of each figure created for laptop card. join() converts it to the string
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);
                res.end(overviewOutput);
            });
        });
    // - PAGE - | - LAPTOP OVERVIEW - \\
    } else if (pathName === '/laptop' && queryID < laptopData.length) {
        res.writeHead(200, { 'Content-type': 'text/html' });

        fs.readFile(`${__dirname}/../data/templates/template-laptop.html`, 'utf-8', (err, data) => { // data returns full template
            const laptop = laptopData[queryID];
            const output = replaceTemplate(data, laptop);
            res.end(output);
        });

    // - ROUTE FOR IMAGES - \\
    } else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/../data/img${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg' });
            res.end(data);
        });
    // - PAGE - | - 404 - \\
    } else {
        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end('404 - URL Not Found');
    }
});

// - Setting up server - \\
server.listen(3000, '127.0.0.1', () => {
    console.log('Server running..');
});

// - Function | - Replacing Templates - \\
function replaceTemplate(originalHtml, laptop) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName); // replace returning new string
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
}