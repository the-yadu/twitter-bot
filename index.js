require('dotenv').config()
var Twitter = require('twitter');
var axios = require('axios');
var CronJob = require('cron').CronJob;
var http = require('http');

//create a server object:
http.createServer(function (req, res) {
    res.write('Hello World!'); //write a response to the client
    res.end(); //end the response
}).listen(process.env.NODE_ENV || 8080);

// new CronJob('0 0 19 * * *', postBoredStatusActivity, null, true, 'Asia/Kolkata'); // Post bored status activity every day @ 7PM
// new CronJob('0 0 20 * * *', postQuote, null, true, 'Asia/Kolkata'); // Post a quote every day @ 8PM
// new CronJob('0 0 21 * * *', postJoke, null, true, 'Asia/Kolkata'); // Post a joke every day @ 9PM

console.log("FILE IS INITIATED");

var client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});
function postBoredStatusActivity() {
    // Bored boredApi Working ✅
    axios("https://www.boredapi.com/api/activity").then(response => { return response.data.activity }).then((activity) => {
        client.post('statuses/update', { status: `Getting Bored? \n${activity}` }, function (error, tweet, response) {
            if (!error) {
                console.log(response);
            }
        })
    });
}
function postQuote() {
    // Quotes API Working ✅
    axios("https://favqs.com/api/qotd").then(Response => {
        return Response.data.quote
    }).then((quote) => {
        return [quote.body, quote.author];
    }).then(([body, author]) => {
        client.post('statuses/update', { status: `${body} -${author}` }, function (error, tweet, response) {
            if (!error) {
                console.log(response);
            }
        })
    });
}
function postJoke() {
    axios("https://official-joke-api.appspot.com/random_joke").then(Response => {
        return [Response.data.setup, Response.data.punchline];
    }).then(([setup, punch]) => {
        client.post('statuses/update', { status: `${setup}\n${punch}` }, function (error, tweet, response) {
            if (!error) {
                console.log(tweet);
            }
        })
    });
}

function likeAndRetweet() {
    // Like and (Retweet) #dsciem tweets ✅

    var params = {
        q: '#dsciem',
        count: '100'
    };

    client.get('search/tweets', params, function (error, tweets, response) {
        if (!error) {
            var obj = JSON.parse(response.body);
            var statuses = obj.statuses;
            for (var i = 0; i < statuses.length; i++) {
                console.log(statuses[i].text);
                if (!statuses[i].favorited) {
                    var params2 = {
                        id: statuses[i].id_str
                    };
                    client.post('favorites/create', params2, function (error, tweet, response) {
                        if (!error) {
                            console.log(`${tweet} liked!`);
                        } else {
                            console.log(error);
                        }
                    });
                }
            }
        }
    });
}