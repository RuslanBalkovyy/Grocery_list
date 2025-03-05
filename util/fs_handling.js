const fs = require('fs');
const { logger } = require('./logger')

const text = "some plain text\n";
const pathToFile = "./util/data/testing.txt";

if (fs.existsSync(pathToFile)) {
    fs.appendFile(pathToFile, text, 'utf8', (err) => {
        if (err) {
            logger.error(err);
            return;
        }
        logger.info("Text appended");
    })
} else {
    fs.writeFile(pathToFile, text, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
        logger.info('File created, text added.');
    });
}

module.exports = {
    fsHandling
};