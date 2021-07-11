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


app.get("/", (request, response) => {
    response.render('index.html');
});

app.get("/url/emotion", (request, response) => {
    const params = {
        'url': request.query.url,
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
        return response.send(analysisResults.result.keywords[0].emotion)
    }).catch(error => {
        console.log("Error: " + error);
    })
});

app.get("/url/sentiment", (request, response) => {
    const params = {
        'url': request.query.url,
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
        return response.send(analysisResults.result.keywords[0].sentiment.label);
    }).catch(error => {
        console.log("Error: " + error);
    })
});

app.get("/text/emotion", (request, response) => {
    const params = {
        'text': request.query.text,
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
        return response.send(analysisResults.result.keywords[0].emotion)
    }).catch(error => {
        console.log('Error:', error);
    });
});

app.get("/text/sentiment", (request, response) => {
    const params = {
        'text': request.query.text,
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
        return response.send(analysisResults.result.keywords[0].sentiment.label)
    }).catch(error => {
        console.log('Error:', error);
    });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

