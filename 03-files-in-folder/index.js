const path = require('path');
const fs = require('fs/promises');

const getFileInfo = async () => {
    try {
        const files = await fs.readdir(path.resolve(__dirname, 'secret-folder'), {withFileTypes: true});

        for (const file of files) {
            if (file.isFile()) {
                const filePath = path.resolve(__dirname, 'secret-folder', file.name);
                const fileInfo = path.parse(filePath);
                const fileSize = await fs.stat(filePath);
                console.log(`${fileInfo.name} - ${fileInfo.ext.slice(1)} - ${fileSize.size / 1024}kb`);
            }
        }
    } catch (error) {
        console.log(error);
    }
};

getFileInfo();