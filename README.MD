## Build project
To build project execute the command:
```bash
    yarn run build
```
## RSA keys generation
To generate public and private keys execute command:
```bash
    yarn run keys-gen
```
Files should be generated in `./resoures` directory

Running this scenario is obligated to execute all others scenarios!
## Signing And Verification with RSA keys
In this scenario :
- In the first step the input payload data would be **signed** using private key - as the result we will get JWT token.
- In the second step the input token would be **verified** using public key - as the result we will get iputed payload.
To run scenario execute the command:
```bash
    yarn run keys-test
```
## Provides RSA keys over HTTP
In this scenario the http server (express) is providing [both generated keys](#rsa-keys-generation).
To run server execute command:
```bash
    yarn run jwks-server
```
When server is up and running 
- the public key is available at url `http://localhost:3344/keys`
```bash
    curl -X GET "http://localhost:3344/keys" | jq
```
- the private key is available at url `http://localhost:3344/keys-priv`
```bash
    curl -X GET "http://localhost:3344/keys-priv" | jq
```
## The example of Signing And Verification with RSA keys where keys are feteched from remote location
Precodition: [jwks-server](#rsa-key-provider-over-http) has to be up and runnig.

In this scenario the client app:
- fetchs private RSA key using HTTP client (axios)
- signs given data payload with obtained private key and produces JWT
- fetchs public RSA key using HTTP client (axios)
- verifies given JWT using obtained public key
- prints report

To run this scenario execute command:
```bash
    yarn run jwks-sign-test-client
```
## Encription (with public key) & decription (with private key)
In this scenario we are:
- encrypting an arbitrary payload message using public RSA key
- encrypting result of previos operation using private keys.
- printing result

Both keys are fetched from [jwks-server](#rsa-key-provider-over-http)

To run scenario execute the command:
```bash
    yarn run encryption-decryption-test
```