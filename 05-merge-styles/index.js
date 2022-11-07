const path = require('path');
const fs = require('fs/promises');
const createReadStream = require('fs').createReadStream;
const createWriteStream = require('fs').createWriteStream;

const mergeStyles = async () => {
    try {
        const writableStream = createWriteStream(path.resolve(__dirname, 'project-dist', 'bundle.css'));
        const files = await fs.readdir(path.resolve(__dirname, 'styles'), {withFileTypes: true});
    
        for(const file of files) {
            if (file.isFile() && path.extname(file.name) === '.css') {
                const readableStream = createReadStream(path.resolve(__dirname, 'styles', file.name), {encoding: 'utf-8'});

                readableStream.pipe(writableStream);

                readableStream.on('error', (error) => {
                    console.log(error.message);
                });
            }
        }
    } catch (error) {
        console.log(error.message);
    }
};

mergeStyles();