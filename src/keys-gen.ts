import { generateKeyPairSync, RSAKeyPairOptions } from 'crypto';
import { join } from 'path';
import { writeFileSync } from 'fs';

export const generateKeyPair = () => {
    const options: RSAKeyPairOptions<'pem', 'pem'> = {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        }
    }
    const { publicKey, privateKey } = generateKeyPairSync('rsa', options);
    writeFileSync(join('resources', 'private.key.pem'), privateKey);
    writeFileSync(join('resources', 'public.key.pem'), publicKey);
}

generateKeyPair();