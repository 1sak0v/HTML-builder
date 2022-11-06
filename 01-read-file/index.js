const path = require('path');
const fs = require('fs');
const {stdout} = process;

const readableStream = fs.createReadStream(path.resolve(__dirname, 'text.txt'), {
    encoding: 'utf-8'
});

readableStream.on('data', chunk => {
    stdout.write(chunk);
});

readableStream.on('error', (error) => {
    stdout.write(error);
});