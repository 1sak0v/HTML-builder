const path = require('path');
const fs = require('fs');
const {stdout, stdin} = process;

stdout.write(`Hello, my friend! Please, enter u text!
To exit write "exit" or press Ctrl + C\n\n`);

const writableStream = fs.createWriteStream(path.resolve(__dirname, 'text.txt'), {encoding: 'utf-8'});

stdin.on('data', (data) => {
    if (data.toString().trim().toLocaleLowerCase() === 'exit') {
        process.exit();
    }
    
    writableStream.write(data);
});

process.on('exit', () => {
    writableStream.end();
    stdout.write('\nBye, my friend! Have a nice day!');
});

process.on('SIGINT', () => {
    process.exit();
});