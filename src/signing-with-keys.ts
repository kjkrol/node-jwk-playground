import jwk from 'jsonwebtoken';

export interface PayloadType {
  userId: string;
  resources: string;
}

export const encode = (payload: PayloadType, privateKey: jwk.Secret): string => {
  const token = jwk.sign(
    payload,
    privateKey,
    {
      algorithm: "RS256",
      expiresIn: "32d",
    }
  );
  return token;
};

export const decode = async (token: string, publicKey: jwk.Secret): Promise<any> => {
  return jwk.verify(token, publicKey) as PayloadType;
};
