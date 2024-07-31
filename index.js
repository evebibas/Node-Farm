const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./starter/modules/replaceTemplate');
const slugify = require('slugify');
////////////////////////////////////////////////////
// FILES
// //Blocking - Synchronous Way
// const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./starter/txt/output.txt', textOut);
// console.log("written to output.txt");

// //Non blocking - Asynchronous Way

// fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data1) => { // a chaque fois qu'il aura lu tout le file la fonction callback sera appellee
//     fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         fs.readFile(`./starter/txt/append.txt`, 'utf-8', (err, data3) => {
//             fs.writeFile(`./starter/txt/newone.txt`, `${data2}/n${data3}` ,'utf-8', (err) => {
//                 console.log("Your file has been created successfully");
//             })
//         })
//     })
// })

// console.log("Reading start.txt");

////////////////////////////////////////////////////////////////
// SERVER




const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html` , 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html` , 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html` , 'utf-8');

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json` , 'utf-8');
const dataObj = JSON.parse(data);

function slugToProductName(slug) {
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}


const server = http.createServer((req, res) => {  // 'res' et 'req' sont des objets
    
    const { query, pathname } = url.parse(req.url, true);   //query: [Object: null prototype] { id: '0' },       //pathname: '/product',
    
    //Overview page
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type':'text/html'
        });
        const cardsHtml = dataObj.map(el=> replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);  
        res.end(output);
    }
    //Product page
    else if(pathname === '/product') {
        res.writeHead(200, {
            'Content-type':'text/html'
        });
        // const product = dataObj[query.prodname];
        const productName = slugToProductName(query.prodname);

        const product = dataObj.find(el => el.productName === productName); // Trouve le produit correspondant par nom

        const output = replaceTemplate(tempProduct, product);  

        res.end(output);
    }
    //API
    else if(pathname === '/api') {
            res.writeHead(200, {
                'Content-type':'application/json'
            });
            res.end(data);
            //__dirname cest la ou est place le fichier actuel
    }
    //Not found page
    else{
        res.writeHead(404, {
            'Content-type':'text/html',
            'my-own-header':'hello'
        });  
        res.end('<h1>Page not found!</h1>');
    }
});  // À chaque fois qu'une requête arrivera sur notre serveur, la fonction callback sera appelée

server.listen(8000, '127.0.0.1', () => {
    console.log('Server is running on port 8000');
});