import  { Crypt } from "hybrid-crypto-js";
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
const crypt = new Crypt({
  // Default AES standard is AES-CBC. Options are:
  // AES-ECB, AES-CBC, AES-CFB, AES-OFB, AES-CTR, AES-GCM, 3DES-ECB, 3DES-CBC, DES-ECB, DES-CBC
  aesStandard: 'AES-CBC',
  // Default RSA standard is RSA-OAEP. Options are:
  // RSA-OAEP, RSAES-PKCS1-V1_5
  rsaStandard: 'RSA-OAEP',
});
const client = JwksRsa({
  cache: true, // Default Value
  cacheMaxEntries: 5, // Default value
  cacheMaxAge: 600000, // Defaults to 10m
  jwksUri: url,
});

const myEncrypt = async (payload: object): Promise<string> => {
  const signingKey = await client.getSigningKeyAsync(kid);
  const publicKey = signingKey.getPublicKey();
  const message = JSON.stringify(payload);
  return crypt.encrypt(publicKey, message);
};

const myDecrypt = async (encryptedData: string): Promise<string> => {
  const privateJwk: Secret = await fetchKey(`${url}-priv`, kid);
  const privateKey = jwkToPem(privateJwk, { private: true });
  const decryptedData = crypt.decrypt(privateKey, encryptedData);
  return decryptedData.message;
};

const payload = {
  userId: "karol",
  resources: "mycode",
};
console.log("oryginal data: ", payload);
const encryptedData: string = await myEncrypt(payload);
console.log("encypted data: ", encryptedData);
const decrypted = await myDecrypt(encryptedData);
console.log("decrypted data: ", decrypted);
