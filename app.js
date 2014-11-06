var box = document.querySelector('input');
var btn = document.querySelector('button');
var out = document.querySelector('p.output');

var main = function() {
    var subreddit = box.value.match(/\/?r?\/?(\w+)/)[1];

    if(!subreddit) {
        alert('Please enter a valid subreddit.');
        return;
    }

    getJSONP('http://reddit.com/r/' + subreddit + '/comments.json', generateIpsum);
};

var Generator = function() {
    this.dictionary = {};
    this.last = '';
};

Generator.prototype = {
    constructor: Generator,
    next: function() {
        var dictionary = this.dictionary;

        var allWords = Object.keys(dictionary);
        var numWords = allWords.length;

        var word = "";

        if(!dictionary[this.last]) {
            var index = Math.floor(Math.random()*numWords);
            word = allWords[index];
        } else {
            var possibleWords = Object.keys(dictionary[this.last]);
            var numPossibleWords = possibleWords.length;
            word = possibleWords[Math.floor(Math.random()*numPossibleWords)];
        }

        this.last = word;

        return word || '';
    },
    seed: function(str) {
        var dictionary = this.dictionary;

        var words = str.split(/\W+/);

        for(var i=0; i<words.length-1; i++) {
            dictionary[words[i]] = dictionary[words[i]] || {};
            dictionary[words[i]][words[i+1]] = dictionary[words[i]][words[i+1]] + 1 || 1;
        }
    },
    cut: function() {
        this.last = '';
    }
};

var getJSONP = function(url, cb) {
    btn.disabled = true;

    window.callback = function(data) {
        btn.disabled = false;
        cb(data);
    };

    var script = document.createElement('script');
    script.src = url + '?jsonp=callback';
    document.body.appendChild(script);
};

var getComments = function(data) {
    return data.data.children.map(function(obj) {
        return obj.data.body;
    });
};

var getSentences = function(comments) {
    var allSentences = [];

    comments.forEach(function(comment) {
        comment.split(/[.?!]/).forEach(function(sentence) {
            if(sentence)
                allSentences.push(sentence);
        });
    });

    allSentences = allSentences.map(clean);

    return allSentences;
};

var clean = function(sentence) {
    sentence = sentence.trim();
    sentence = sentence.toLowerCase();
    sentence = sentence.replace(/[^\w\s]/g, '');

    sentence = sentence.replace('i ', 'I '); // Little hack

    return sentence;
};

var generateIpsum = function(res) {
    var comments  = getComments(res);
    var sentences = getSentences(comments);

    var generator = new Generator();

    window.generator = generator;

    sentences.forEach(function(sentence) {
        generator.seed(sentence);
    });

    var ipsum = "";
    for(var i=0; i<6; i++)
        ipsum += generateParagraph(generator) + "<br><br>";

    output(ipsum);
};

var generateSentence = function(generator) {
    var length = Math.floor(Math.random() * 8) + 3;

    var sentence = "";

    for(var i=0; i<length; i++)
        sentence += generator.next() + " ";

    sentence = sentence.trim();
    sentence += randomPunctuation();
    sentence = sentence[0].toUpperCase() + sentence.substr(1);

    generator.cut();

    return sentence;
};

var generateParagraph = function(generator) {
    var paragraph = "";
    var length = Math.floor(Math.random()*20)+4;

    for(var i=0;i<length;i++)
        paragraph += generateSentence(generator) + " ";

    return paragraph;
};

var randomPunctuation = function() {
    return Math.random()<0.9? '.' : '!';
};

var output = function(str) {
    out.innerHTML = str;
};

btn.addEventListener('click', main);
