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
    });
};

var getSentences = function(strArr) {

};

var clean = function(sentence) {
    sentence = sentence.trim();
    sentence = sentence.toLowerCase();
    sentence = sentence.replace(/(\W)/g, '');
};

var generateIpsum = function(res) {
    var comments  = getComments(res);
    var sentences = getSentences(comments);

    var generator = new Generator();

    sentences.forEach(function(sentence) {
        generator.seed(sentence);
    });

    var ipsum = "";
    for(var i=0; i<300; i++)
        ipsum = ipsum + generator.next();
    return ipsum;
};

var generateSentence = function(generator) {
    var length = Math.floor(Math.random() * 5) + 3;

    var sentence = "";
    for(var i=0; i<length; i++)
        sentence += generator.next();
    sentence += randomPunctuation();
    sentence[0] = sentence[0].toUpperCase();
    return sentence;
};

var randomPunctuation = function() {
    return Math.random()<0.9? '.' : '!';
};

var output = function(str) {
    var out = document.createElement('textarea');
    out.innerText = str;
    document.body.appendChild(out);
};

btn.addEventListener('click', main);
