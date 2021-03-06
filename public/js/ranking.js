/* home.js, in corresponding to home.ejs */

$(document).ready(function () {

    //var user = getUser();
    var user_id = $("#parse-user-id").html();
    console.log(user_id);
    var profileRedirectURL = "/profile/" + user_id;
    var userRole = $("#parse-user").html();
    var book_id=$("#parse-book-id").html();
    var bookRedirectURL="/books/"+book_id;
    $("#book-redirect-url").attr("href",bookRedirectURL);
    $("#profile-redirect-url").attr("href", profileRedirectURL);
    sortResults('subscribedNumber', false);
    // $('#rank-display').click(function(e){
    //     sortResults('subscribedNumber',true);
    // })

    $('.form-group .typeahead').typeahead({
                hint: true,
                highlight: true,
                minLength: 1
            },
            {
                name: 'states',
                source: substringMatcher(bookNameListForMatch)
            });
});

// parse bookList to an Array of JSON elements
var bookList = $('#parse-bookList').html();
var bookListArray = JSON.parse(bookList);

// sort BookList by alphabetical order / some pattern we defined
function sortResults(prop, asc) {
    bookListArray = bookListArray.sort(function(a, b) {
        if (asc) return (a[prop] > b[prop]);
        else return (b[prop] > a[prop]);
    });
    showResults();
}

function showResults () {
    var html = '';
    for (var e in bookListArray) {
        var bookDirectUrl = '/books/'+ bookListArray[e]._id.toString();
        var authorURL = '/profile/' + bookListArray[e].writerID.toString();
        console.log(bookDirectUrl);
        var bookname = bookListArray[e].bookname.toString();
        var bookgenre = bookListArray[e].bookgenre;
        var user_id = $('#parse-user-id').html();
        if (bookgenre == null){
            bookgenre = 'N/A';
        }
        console.log(bookname);
        console.log(user_id);
        if (user_id !== undefined){
            html += '<tr>'
                    +'<td>' + '<a href=' + bookDirectUrl + '>' + bookname + '</a>' + '</td>'
                    +'<td>' + '<a href=' + authorURL + '>' + bookListArray[e].writerName + '</a>' + '</td>'
                    +'<td>' + bookgenre + '</td>'
                    +'<td>' + bookListArray[e].subscribedNumber + '</td>'
                    +'</tr>';}
        else{
            html += '<tr>'
                    +'<td>' + '<a href=' + bookDirectUrl + '>' + bookname + '</a>' + '</td>'
                    +'<td>'+ bookListArray[e].writerName + '</td>'
                    +'<td>'+bookgenre+'</td>'
                    +'<td>' + bookListArray[e].subscribedNumber + '</td>'
                    +'</tr>';
        }
    }
    $('#booklist-display').html(html);
}

// bookNameListForMatch is for typeahead.js
var bookNameListForMatch = [];
bookListArray.forEach(function(elem){
    bookNameListForMatch.push(elem.bookname);
});

console.log(bookNameListForMatch);
//<a href= <%= "/profile/"+bookList[i].writerID.toString() %>><%= bookList[i].writerName.toString() %></a>
var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
        var matches, substringRegex;

        // an array that will be populated with substring matches
        matches = [];

        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i');

        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function(i, str) {
            if (substrRegex.test(str)) {
                matches.push(str);
            }
        });

        cb(matches);
    };
};


