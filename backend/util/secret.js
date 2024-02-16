const fs = require('fs').promises;
const crypto = require('crypto');
const path = require('path');

const filePath = path.join(__dirname, 'secret.txt');

module.exports=async function secret() {
    try {
        return await fs.readFile(filePath, 'utf-8');
    }
    catch (e) {
        if (e.code === 'ENOENT') {
            const randomString = crypto.randomBytes(32).toString('hex');
            try {
                await fs.writeFile(filePath, randomString, { encoding: 'utf-8' });
                return randomString;
            }
            catch (writeError) {
                console.error('Failed to write the secret to file:', writeError);
                throw writeError;
            }
        }

        else {
            throw e;
        }
    }
}