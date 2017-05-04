# Forever Read 

Forever is a lightweight, offline-storage, multiple-technology powered online book publish platform built in Node.js.

### Forever Read is built on top of the following libraries:

  - [Node.js] - Application Server
  - [Express.js] - Node.js MVC Web Framework 
  - [MongoDB] - database storage
  - [ejs] - HTML templating engine
  - [EmailJS] - SMTP server middleware of Node.js
  - [Quill.js] - opensource rich text solution
  - [typeahead.js] - Frontend regex-fit prompts
  - [chai.js], [mocha.js], [sinon.js] - Node.js test suite
 
### Installation & Setup
1. Install [Node.js] and [MongoDB]
2. Clone this GitHub repository and install dependencies

```sh
$ git clone https://github.com/yjy941124/Forever-Read.git
$ cd Forever-Read
$ npm install
```

3. In a separate shell start MongoDB daemon

```sh
$ sudo mongod
```

4. Put ```credential.json``` into Forever-Read directory, required for [EmailJS]

```sh
{
   "host": "smtp.gmail.com",
   "user": "you.platform.emailaddress@gmail.com",
   "password": "you.platform.emailpassword"
}
```
5. From within the Forever-Read directory, start the application

```sh
$ npm start
```

6. (optional) Open Mongo Shell to view database storage

```sh
$ mongo
$ show dbs
$ use foreverRead
$ show collections
$ db.Users.find({})
$ db.Books.find({})
```
You can also visualize / manipulate the database using [MongoDB Compass]

### DevLogs
detail DevLog of whole development process can be found at [DevLog].

### Contributions
Suggestions for improvement are welcome.


[Node.js]:<https://nodejs.org/en/>
[Express.js]:<https://expressjs.com/>
[MongoDB]:<https://www.mongodb.com/>
[ejs]:<http://www.embeddedjs.com/>
[EmailJS]:<https://www.emailjs.com/>
[Quill.js]:<https://quilljs.com/>
[typeahead.js]:<https://twitter.github.io/typeahead.js/>
[chai.js]:<http://chaijs.com/>
[mocha.js]:<https://mochajs.org/>
[sinon.js]:<http://sinonjs.org/>
[MongoDB Compass]:<https://www.mongodb.com/products/compass>
[DevLog]:<https://github.com/yjy941124/Forever-Read/blob/master/DevLog.md>
