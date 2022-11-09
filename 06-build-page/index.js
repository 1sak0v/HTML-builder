const path = require('path');
const fs = require('fs');


const buildPage = async () => {
    await fs.promises.rm(path.resolve(__dirname, 'project-dist'), {recursive: true, force: true});
    await fs.promises.mkdir(path.resolve(__dirname, 'project-dist'), {recursive: true});
    await fs.promises.rm(path.resolve(__dirname, 'project-dist', 'assets'), {recursive: true, force: true});
    await fs.promises.mkdir(path.resolve(__dirname, 'project-dist', 'assets'), {recursive: true});

    const copyDir = async (entry, output) => {
        const files = await fs.promises.readdir(entry, {
            withFileTypes: true
        });
        for (const file of files) {
            if (file.isFile()) {
                const fromPath = path.resolve(entry, file.name);
                const toPath = path.resolve(output, file.name);
                await fs.promises.copyFile(fromPath, toPath);
            } else {
                await fs.promises.mkdir(path.resolve(__dirname, 'project-dist', 'assets', file.name), {recursive: true});
                copyDir(path.resolve(entry, file.name), path.resolve(__dirname, 'project-dist', 'assets', file.name));
            }
        }
    };

    copyDir(path.resolve(__dirname, 'assets'), path.resolve(__dirname, 'project-dist/assets'));

    const mergeStyles = async () => {
        try {
            const writableStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'style.css'));
            const files = await fs.promises.readdir(path.resolve(__dirname, 'styles'), {withFileTypes: true});
        
            for(const file of files) {
                if (file.isFile() && path.extname(file.name) === '.css') {
                    const readableStream = fs.createReadStream(path.resolve(__dirname, 'styles', file.name), {encoding: 'utf-8'});
    
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

    const createHTML = async () => {
        await fs.promises.copyFile(path.resolve(__dirname, 'template.html'), path.resolve(__dirname, 'project-dist', 'index.html'));
        let htmlContent = await fs.promises.readFile(path.resolve(__dirname, 'project-dist', 'index.html'), {encoding: 'utf-8'});
        const writableStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'index.html'));
        const files = await fs.promises.readdir(path.resolve(__dirname, 'components'), { withFileTypes: true });

        for(const file of files) {
            if (file.isFile() && path.extname(file.name) === '.html') {
                const htmlComponentContent = await fs.promises.readFile(path.resolve(__dirname, 'components', file.name), {encoding: 'utf-8'});
                const component = path.parse(file.name).name;
                htmlContent = htmlContent.replace(`{{${component}}}`, htmlComponentContent);
            }
        }
        writableStream.write(htmlContent);
    };

    createHTML();
};

buildPage();