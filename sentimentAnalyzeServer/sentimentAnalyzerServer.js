const express = require('express');
const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;
    const NaturalLanguageUnderstanding = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const nlu = new NaturalLanguageUnderstanding({
        version: '2021-03-25',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return nlu;
}


app.get("/", (req, res) => {
    res.render('index.html');
});

app.get("/url/emotion", (req, res) => {
    const params = {
        'url': req.query.url,
        'features': {
            'entities': {
                'emotion': true,
                'limit': 1
            },
            'keywords': {
                'emotion': true,
                'limit': 1
            }
        }
    }

    getNLUInstance().analyze(params).then( analysisResults => {
        return res.send(analysisResults.result.keywords[0].emotion)
    }).catch(error => {
        console.log("Error: " + error);
    })
});

app.get("/url/sentiment", (req, res) => {
    const params = {
        'url': req.query.url,
        'features': {
            'entities': {
                'sentiment': true,
                'limit': 1
            },
            'keywords': {
                'sentiment': true,
                'limit': 1
            }
        }
    }

    getNLUInstance().analyze(params).then(analysisResults => {
        const results = analysisResults.result.keywords[0].sentiment.score;
        console.log(results);
        return res.send(results);
    }).catch(error => {
        console.log("Error: " + error);
    })
});

app.get("/text/emotion/", (request, response) => {
    const params = {
        'text': req.query.text,
        'features': {
            'entities': {
                'emotion': true,
                'limit': 1
            },
            'keywords': {
                'emotion': true,
                'limit': 1
            }
        }
    };

    getNLUInstance().analyze(params).then(analysisResults => {
        return res.send(analysisResults.result.keywords[0].emotion)
    }).catch(error => {
        console.log('Error:', error);
    });
});

app.get("/text/sentiment", (req, res) => {
    const params = {
        'text': req.query.text,
        'features': {
            'entities': {
                'sentiment': true,
                'limit': 1
            },
            'keywords': {
                'sentiment': true,
                'limit': 1
            }
        }
    };

    getNLUInstance().analyze(params).then(analysisResults => {
        return res.send(analysisResults.result.keywords[0].sentiment.score)
    }).catch(error => {
        console.log('Error:', error);
    });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

