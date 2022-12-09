# Calculating graphic work

The project contains 2 main parts:
- Client. `cd client && npm i && npm run start` command will run simple react app on 2022 port.
- Server. `cd ../server && npm i && npm run start:dev` command will start express server on 3000 port.

backend based on [Express application generator](https://expressjs.com/en/starter/generator.html)
`npx express-generator server --view=hbs`
frontend based on [CRA](https://create-react-app.dev/docs/getting-started)

<!--  The solution is monolith app on nodejs and express. -->
<!-- The frontend is implemented on handlebars. -->

**Certificate commands**
   **OpenSSL configure:**
   `$cp /usr/lib/ssl/openssl.cnf /usr/lib/ssl/openssl.cnf.bak`
   `nano /usr/lib/ssl/openssl.cnf`
   `mkdir /mnt/c/adv/nau/demoCA && cd $_`

**Self signed certificate creation:** `cd client/src \`
   `openssl req -x509 -newkey rsa:2048 -days 730 -keyout ./ca/ca_self_key.pem -out ./ca/ca_self_cert.pem`
   _passfrase:_ `self`
   _Country Name (2 letter code) \[AU\]:_ `UK`
   _State or Province Name (full name) \[Some-State\]:_ `Kyiv`
   _Locality Name (eg, city) \[\]:_ `Kyiv`
   _Organization Name (eg, company) \[Internet Widgits Pty Ltd\]:_ `NAU`
   _Organizational Unit Name (eg, section) \[\]:_ `Faculty of Cybersecurity, Computer and Software Engineering`
   _Common Name (e.g. server FQDN or YOUR name) \[\]:_ `Cybersecurity`
   _Email Address \[\]:_ `1141054@stud.nau.edu.ua`


**Read certificate:**
   `openssl x509 –text -in ./ca/ca_self_cert.pem -noout`
   `openssl x509 –text -in ./ca/ca_self_key.pem -noout`

**User's key pair creation:**
   **Create key pair and certificate request:**
      `openssl req -newkey rsa:2048 -keyout ./userCert/user_1_key.pem -out ./userCert/user_1_req.pem`
      _passfrase:_ `sself`
      _Country Name (2 letter code) \[AU\]:_ `UK`
      _State or Province Name (full name) \[Some-State\]:_ `Kyiv`
      _Locality Name (eg, city) \[\]:_ `Kyiv`
      _Organization Name (eg, company) \[Internet Widgits Pty Ltd\]:_ ``
      _Organizational Unit Name (eg, section) \[\]:_ ``
      _Common Name (e.g. server FQDN or YOUR name) \[\]:_ ``
      _Email Address \[\]:_ `user@userdomain.com`
      Please enter the following 'extra' attributes
      to be sent with your certificate request
      A challenge password []:self

   **Signing created request:**
      `openssl ca -md sha256 -keyfile ./ca/ca_self_key.pem -cert ./ca/ca_self_cert.pem -in ./userCert/user_1_req.pem -out ./userCert/user_1_cert.pem`


**Create PKCS#12 certificate:**
   `openssl pkcs12 -export -in ./userCert/user_1_cert.pem -inkey ./userCert/user_1_key.pem -out ./userCert/user_1_cert.p12`

## crypto api educational application

1. Симетричний алгоритм шифрування вказано в табл. 1.
2. Для симетричного шифрування файлу використовуйте сесійний ключ KS симетричного алгоритму.
3. Показати два варіанти генерації сесійного ключа KS:
   1. варіант. за допомогою системи управління криптографічними ключами;
   2. варіант. За парольною фразою. У вигляді парольної фрази виступатиме прізвище на латині.
4. Вибір файлу, для шифрування. Файл міститься локально на комп'ютері користувача.
5. Шифрування файлу за допомогою сесійного ключа KS.
6. Для безпечного зберігання сесійного ключа KS разом із зашифрованим файлом використовуйте асиметричне шифрування за допомогою пари ключів поточного користувача системи.
   - Користувач створює ключову пару RSA розміром 1024 біт.
   - На підставі відкритого ключа створює запит на сертифікацію
   - і передає його в локальний центр сертифікації.
   - Отримує з локального центру сертифікації сертифікат Х.509 свого відкритого ключа та сертифікат Х.509 відкритого ключа центру сертифікації.
   - Сертифікат Х.509 свого відкритого ключа необхідно розмістити в сховище _WINDOWS ???_.
7. Витягти відкритий ключ одержувача з сертифіката Х.509.
8. Провести шифрування сеансового ключа відкритим ключем RSA одержувача і додати до зашифрованого файлу зашифрований сеансовий ключ.
9. Збереження шифротекста в зазначеному файлі.

   Програма-дешифратор
10. Отримання інформації про існуючих криптопровайдерах і підтримуваних ними алгоритмах симетричного шифрування.
11. Вибір алгоритму симетричного шифрування для поточного сеансу шифрування.
12. Дешифрувати зашифрований сеансовий ключ KS, використовуючи закритий ключ одержувача.
13. Вибір зашифрованого файлу, що містить текст, призначений для дешифрування.
14. Збереження відновленого тексту в зазначений файл.

### Sources

- [How to upload files in Node.js and Express](https://attacomsian.com/blog/uploading-files-nodejs-express)
- [Multer: Easily upload files with Node.js and Express](https://blog.logrocket.com/multer-nodejs-express-upload-file/)
- [How to encrypt an uploaded file before saving to disk after posting to express route, then read it back securely?](https://stackoverflow.com/questions/59043812/how-to-encrypt-an-uploaded-file-before-saving-to-disk-after-posting-to-express-r)
- [Symmetric encryption with NodeJS](https://stackoverflow.com/questions/41043878/symmetric-encryption-with-nodejs)
- Node.js v19.0.0 documentation. [Crypto](https://nodejs.org/api/crypto.html)
[Asymmetric Encryption using Nodejs Crypto module](https://stackoverflow.com/questions/54087514/asymmetric-encryption-using-nodejs-crypto-module)
