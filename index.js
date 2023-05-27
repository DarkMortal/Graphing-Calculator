const fs = require('fs');
const http = require('http');
const path = require('path');

var mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req,res)=>{

    /*if(req.url.includes('partytown'))
        var filePath = "./"+req.url;
    else*/
    var filePath = './build/' + req.url;

    if (filePath == './build//')
        filePath = './build/index.html';

    if(filePath.includes("~")){
        let x = filePath.indexOf("~");
        let temp = filePath.slice(0,x) + filePath.slice(x+1,filePath.length);
        filePath = temp;
    }
    filePath = filePath.trim();

    // console.log(filePath);
    
    var extname = String(path.extname(filePath)).toLowerCase();
    var contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(content, 'utf-8');
            }
            else {
                res.writeHead(500);
                res.end(`Sorry, check with the site admin for error: ${error.code} ..\n`);
            }
        }
        else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 8000 || process.env.PORT;
server.listen(PORT,()=>console.log(`Listening on PORT : ${PORT}`))