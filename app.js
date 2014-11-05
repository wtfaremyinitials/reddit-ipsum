var box = document.querySelector('input');
var btn = document.querySelector('button');

var main = function() {
    var subreddit = box.value.match(/\/?r?\/?(\w+)/)[1];

    if(!subreddit) {
        alert('Please enter a valid subreddit.');
        return;
    }

    getJSON('http://reddit.com/r/' + subreddit + '/comments.json', generateIpsum);
};

var getJSON = function(url, cb) {
    btn.disabled = true;

    request = new XMLHttpRequest();
    request.open('GET', url, true);

    var error = function() {
        alert('An error occured when connecting to reddit. Sorry about that.');
    };

    request.onload = function() {
        if (request.status >= 200 && request.status < 400){
            data = JSON.parse(request.responseText);
            btn.disabled = false;
            cb(data);
        } else {
            error();
        }
    };

    request.onerror = error;

    request.send();
};

var getComments = function(data) {
    return data.data.children.map(function(obj) {
        return obj.data.body;
    })
};

var generateIpsum = function(res) {
    console.log(getComments(res));
};

var output = function(str) {
    var out = document.createElement('textarea');
    out.innerText = str;
    document.body.appendChild(out);
};

btn.addEventListener('click', main);
