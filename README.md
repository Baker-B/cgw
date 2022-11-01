# Calculating graphic work

The solution is monolith app on nodejs and express.
The frontend is implemented on handlebars.

## crypto api educational application

1. Симетричний алгоритм шифрування вказано в табл. 1.
2. Для симетричного шифрування файлу використовуйте сесійний ключ KS симетричного алгоритму.
3. Показати два варіанти генерації сесійного ключа KS: 1 варіант. за допомогою системи управління криптографічними ключами; 2 варіант. За парольною фразою. У вигляді парольної фрази виступатиме прізвище на латині.
4. Вибір файлу, для шифрування. Файл міститься локально на комп'ютері користувача.
5. Шифрування файлу за допомогою сесійного ключа KS.
6. Для безпечного зберігання сесійного ключа KS разом із зашифрованим файлом використовуйте асиметричне шифрування за допомогою пари ключів поточного користувача системи. Користувач створює ключову пару RSA розміром 1024 біт. На підставі відкритого ключа створює запит на сертифікацію і передає його в локальний центр сертифікації. Отримує з локального центру сертифікації сертифікат Х.509 свого відкритого ключа та сертифікат Х.509 відкритого ключа центру сертифікації. Сертифікат Х.509 свого відкритого ключа необхідно розмістити в сховище WINDOWS.
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
- Node.js v19.0.0 documentation. [Crypto](https://nodejs.org/api/crypto.html)
