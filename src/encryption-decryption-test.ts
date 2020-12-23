import { publicEncrypt, privateDecrypt, constants } from "crypto";
import axios from "axios";
import { Secret } from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import JwksRsa from "jwks-rsa";

const url = "http://localhost:3344/keys";
const kid = "my-kid";

const fetchKey = async (url: string, kid: string) => {
  const data = await axios.get(url).then((res) => res.data);
  return data.keys.find((element) => element.kid == kid);
};

const client = JwksRsa({
  cache: true, // Default Value
  cacheMaxEntries: 5, // Default value
  cacheMaxAge: 600000, // Defaults to 10m
  jwksUri: url,
});

const encrypt = async (payload: object): Promise<Buffer> => {
  const signingKey = await client.getSigningKeyAsync(kid);
  const publicKey = signingKey.getPublicKey();
  const buffer = Buffer.from(JSON.stringify(payload));
  return publicEncrypt(
    {
      key: publicKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    buffer
  );
};

const decrypt = async (encryptedData: Buffer): Promise<string> => {
  const privateJwk: Secret = await fetchKey(`${url}-priv`, kid);
  const privateKey = jwkToPem(privateJwk, { private: true });
  const decryptedData = privateDecrypt(
    {
      key: privateKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    encryptedData
  );
  return JSON.parse(decryptedData.toString());
};

const payload = {
  userId: "karol",
  resources: "mycode",
};
console.log("oryginal data: ", payload);
const encryptedData: Buffer = await encrypt(payload);
console.log("encypted data: ", encryptedData.toString("base64"));
const decrypted = await decrypt(encryptedData);
console.log("decrypted data: ", decrypted);
