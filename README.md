# COMS4156
This is the final project of COMS 4156, co-authored by four members from the class - JY, YW, RJ, and YQ.

### March 23 2017 - Jinyang
Note: Reverted to bb9b99f branch.
Implemented some new features
- Render chapter under each book
- Add new chapter

### March 20 2017 - Jinyang
Implemented some new features.
- Add profile page for all users. Writers can now view all book they published. Subscription is not yet implemented.

TODO:
- Implement Subscription.
- See earlier TODOs.
- 
### March 17 2017 - Jinyang
Implemented some new features.
- Now writer can publish a new book. The book is saved in mongodb as "Books" collection. It has "bookname", "bookdes", "writerID", and "writerName". 
- All published books can be viewed at home page. Only bookname and writerName are shown.

TODO:
- add publish chapter under each book feature. (@query parameter look up)
- Right now, any user can still access "/publish" regardless of its role. Need to limit access only to writers.
- ~~Start to build user profile page. (@query parameter again)~~
### March 16 2017 - Jinyang
I have made several updates so far and here's a quick summary of what has been changed from Mar 2.
- Repository is no longer a template. It's now an initial prototype.
- No longer needs to do npm install first. However, if you run into any problem, try npm intall anyway. (Still needs to open mongodb.)
- Update 1: Now can register new users with either being a reader or writer (must specify) - denote as "writer" and "reader" in the database. JS-wise it's called "user.role", same as "user.username".
- Update 2: Move from the original handlebars to ejs view engine.
- Update 3: Certain functions/buttons(publish) are only visible to writers. Can apply same thing to other roles.

TODO:
- Update UI. There is no UI design what so ever right now. 
- ~~Implement simple publish book function (including publish chapter within a book). [Priority].~~
### March 2 2017 - Jinyang
I uploaded a template to start with. This template includes node.js configuration and routing, mongoDB connection, handlebar.js view engine (same as mastache.js), and user signup and login system. This template is modified from https://github.com/pymander/userAuth.git

Right now the user login stays as is in the above work (+google/twitter/etc login, -writer/reader selection), will change it to fit our system soon.

~~Note this template needs to install first.~~ **First install node.js and mongodb before install this package.**
~~Then do,
npm install~~
in the package directory. 
In order to open it, do
```
mongod
```
Note that if do not have permission to create /data/db, do instead
```
sudo mongod
```
in a SECOND terminal, do
```
node index.js
```
in the FIRST terminal.

## First step goal
- ~~simple input text in a box and save in db and render on browser.~~
- ~~modify user login to fit our goal.~~
