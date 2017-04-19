# COMS4156 [![Build Status](https://travis-ci.org/yjy941124/Forever-Read.svg?branch=master)](https://travis-ci.org/yjy941124/Forever-Read)
This is the final project of COMS 4156, co-authored by four members from the class - JY, YW, RJ, and YQ.

### April 18 2017 - Yulong Qiao
Function adjustment:
- initially at homepage, booklists are displayed in alphabetical order

### April 18 2017 - Ruijue Ji
UI improvement:
-  Now navbar displays on every page

### April 14 2017 - Yulong Qiao
bug fix:
- starter-template.css and select-style.css in *layout.ejs* works correctly in chapter page
- remove second button of edit book info in chapters page

navbar:
- click *ForeverRead* to return homepage
- click *Profile* to go to profile page
- Search in *Category* by different genres

Rich text supprt:
- uploadNewChapter and render chapter page supported

added:
- Edit chapters




### April 13 2017 - Jinyang Yu
- Finish Admin mode
- Get a fundamental UI for nav-bar.
- Add rank and category display
TODO:
- Commenting
- Rank
- ~~Category~~
- Previous readme

### April 12 2017 - Jinyang Yu
- Add admin mode.
- Admin is created directly through mongodb - there is no sign up page for admin. 
- Admin can delete entire book.

TODO:
- ~~Admin can delete chapters.~~
- ~~Edit chapters.~~

### April 8 2017 - Yulong Qiao
- Revised logic of all non-empty publish process, include uploadNewChapter, edit bookinfo and publish new book(all subscribed to publish.js)
- Complete modal - alert - border part
### April 7 2017 -  Yulong Qiao 
First day after Iteration 1 demo:
- functions added:
  - within editbook information, the nonempty alert is setup
- problem spotted and functions revised:
  - at chapters.ejs, problems within modal:
    - when edit book info, when someone enter an empty bookname, click submit, he/she will receive a nonempty alert, then he clicked cancel, then back to edit bookinfo again, then content in modal will be what he edit before(empty bookname with alert and red border)[**PARTIALLY FIXED**]

TODO:
- ~~fixed the whole modal - alert - border issue~~
- ~~find a way to save content spacing and forms, maybe turn to Quill~~

### March 30 2017 - Yulong Qiao & Ruijue Ji
Last Day of Iteration 1, today's modifications:

bug fixed:
- two app.get() method in *index.js*: app.get('/books/:bookId/:chapterIdx') and app.get('/books/:bookId/uploadNewChapter') may **confuse** each other, rendering wrong page.
Now the uploadNewChapter address change to '/books/:bookId/chapter/:chapterIdx', I think it's time to make rules that no two ':params' can be put adjacent to each other

functions added:
- former question: receive 404 when including js with src="../public/js/publish.js", fixed with src="../../public/js/publish.js"
- to get rid redundant code
  - every non-empty input tags a class "publish-non-empty" 
  - every ejs with some non-empty inputs subscribes to publish.js

UI improvement:
- web frontend UI improved a lot!
- instead of direct poping-up alert, *uploadNewChapter* and *publish* now have bootstrap alert, leaving signin web business to discuss

### March 30 2017 - Jinyang Yu
bug fix:
- Cannot publish/edit an empty book name.

TODO:
- Add types of alerts.

### March 28 2017 - Yulong Qiao
functions added:
- publish page now have a *return to home* button

comments added:
- now every function of index.js and functions.js have proper comments
- some Lines of Code intended for testing and debugging are deleted

### March 26 2017 - Yulong Qiao
functions added:
- book page now have a *return to home* button

constrains added:
- When a writer publish a new book or editing book infomation
  - **bookname** cannot be empty
  - **book description** and **genre** can be left blank
- after editing book info, user now redirect back to book page

big bug fixed and multiple functions modified - the update bookinfo bug, you might have to db.dropDatabase() to verify it.
- after editing book info, the book infos shown at homepage and profile page are synced, and displayed correctly

### March 25 2017 - Jinyang Yu
Iteration 1 is almost done!
After many bug fixes(not recorded), we have implemented every feature in iteration 1. The remaining jobs are well documenting each function, delete console.log, and other small details. There are no outstanding features or significant bug as of now. (There may be small bugs that we are not yet aware of).


### March 24 2017 - Yulong Qiao
Subcription and Unsubscription function finished:
- chapters page have three buttons - upload chapter, subscribe and unsubscribe
- Anonymous user can only view chapters, no buttons are seen by them, and no functionality is provided.
- Registered user (both writer and reader) can subscribe to one book by clicking *subscribe* button, and they are redirect to home page, after they click back to this book, *subscribe* button is hide, and *unsubscription* button is shown, they can just unsubscribe by clicking on it.
- If a user is a **writer**, and the book that he is browing is written by him (the writerID of book equals id of user), then *upload new chapter* button is shown to him, and he can click on it and upload new things.

TODO:
- ~~the booknames of one user's subscription should be shown on that user's profile page as anchors.~~

### March 24 2017 - Jinyang
Bug fix
- Now only writer can publish page(previously publish is not visible to reader, but reader can still access through directly type in URL
- Now only the correct writer can update a new chapter

TODO:
- UI
- ~~Some detail implementation(Stuff like add a home button for every page)~~
- ~~Subscription(Waiting on Yulong)~~

### March 23 2017 - Ruijue
Implement two new features. 
1. Add book genre(s) when publish, show in index and chapters page 
2. Edit book information in chapters page

TODO:
1. ~~Verify whether new book name is unique~~
2. Change checkbox style for book genres
3. ~~Only allow writer of the book to edit book info and update new chapter (done)~~
4. ~~See earlier TODOs.~~

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
- ~~See earlier TODOs.~~
- 
### March 17 2017 - Jinyang
Implemented some new features.
- Now writer can publish a new book. The book is saved in mongodb as "Books" collection. It has "bookname", "bookdes", "writerID", and "writerName". 
- All published books can be viewed at home page. Only bookname and writerName are shown.

TODO:
- ~~add publish chapter under each book feature. (@query parameter look up)~~
- ~~Right now, any user can still access "/publish" regardless of its role. Need to limit access only to writers.~~
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
