import { readFileSync } from "fs";
import { join } from "path";
import { Secret } from "jsonwebtoken";
import { encode, decode, PayloadType } from "./signing-with-keys.js"

// test 1
const payload: PayloadType = {
    userId: "karol",
    resources: "mycode",
  };
const privateKey: Secret = readFileSync(join("resources", "private.key.pem"));
const token = encode(payload, privateKey)
console.log(token)

const publicKey: Secret = readFileSync(join("resources", "public.key.pem"));
const decodedToken = await decode(token, publicKey);
console.log(decodedToken)
