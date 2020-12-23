import express from 'express';
import { readFile } from "fs";
import { join } from 'path';
import { pem2jwk } from "pem-jwk"

const kid = "my-kid"
const app = express()
app.get('/keys', (req, res) => {
    readFile(join('resources', 'public.key.pem'), (err, pem) => {
        if (err) { return res.status(500); }
        const jwk = pem2jwk(pem);
        res.json({
            keys: [{
                ...jwk,
                kid
            }]
        });
    });
})
app.get('/keys-priv', (req, res) => {
    readFile(join('resources', 'private.key.pem'), (err, pem) => {
        if (err) { return res.status(500); }
        const jwk = pem2jwk(pem);
        res.json({
            keys: [{
                ...jwk,
                kid
            }]
        });
    });
})
app.listen(3344, () => console.log(`JWKS API is on port 3344`))