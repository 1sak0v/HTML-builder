const path = require('path');
const fs = require('fs/promises');

const copyDir = async () => {
    try {
        await fs.rm(path.resolve(__dirname, 'files-copy'), {recursive: true, force: true});
        await fs.mkdir(path.resolve(__dirname, 'files-copy'), {recursive: true});

        const files = await fs.readdir(path.resolve(__dirname, 'files'));

        for(const file of files) {
            const fromPath = path.resolve(__dirname, 'files', file);
            const toPath = path.resolve(__dirname, 'files-copy', file);
            await fs.copyFile(fromPath, toPath);
        }
    } catch (error) {
        console.log(error.message);
    }
};

copyDir();
