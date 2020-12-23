import axios from "axios";
import jwkToPem from "jwk-to-pem";
import { encode, decode } from "./signing-with-keys.js";

const url = "http://localhost:3344/keys";
const kid = "my-kid";
const payload = {
    userId: "karol",
    resources: "mycode",
  };

const fetchKey = async (url: string, kid: string) => {
  const data = await axios.get(url).then((res) => res.data);
  return data.keys.find((element) => element.kid == kid);
};

const privateKey = jwkToPem(await fetchKey(`${url}-priv`, kid), {
    private: true,
  });
const token = encode(payload, privateKey);
console.log(token);
const publicKey = jwkToPem(await fetchKey(`${url}`, kid), { private: false });
const decodedToken = await decode(token, publicKey);
console.log(decodedToken);
