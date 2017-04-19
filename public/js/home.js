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
    sortResults('bookname', true);
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
        console.log(bookDirectUrl);
        var bookname = bookListArray[e].bookname.toString();
        var bookgenre = bookListArray[e].bookgenre;
        if (bookgenre == null){
            bookgenre = 'N/A';
        }
        console.log(bookname);
        html += '<tr>'
            +'<td>' + '<a href=' + bookDirectUrl + '>' + bookname + '</a>' + '</td>'
            +'<td>'+bookListArray[e].writerName+'</td>'
            +'<td>'+bookgenre+'</td>'
            +'</tr>';
    }
    $('#booklist-display').html(html);
}

