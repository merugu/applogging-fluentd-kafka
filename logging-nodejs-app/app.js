//Load express module
const log4js = require('log4js')
log4js.configure({
    appenders: { fluentd: { type: 'file', filename: '/var/log/fluentd.log' } },
    categories: { default: { appenders: ['fluentd'], level: 'debug' } }
  });
const logger = log4js.getLogger('fluentd');
const express = require('express'),
    app = express(),
    bodyParser = require("body-parser"),
    faker = require('faker');
    
    
app.use(bodyParser.json());

//Define request response in root URL (/)
app.get('/', (req, res)=> {
  res.send('App running successfully!');
})

// Create a basic get API with some response...
app.get('/post-list', (req,res)=>{
    if(!req.query.user_id || req.query.user_id==""){
        res.status(401).send({"message":"User Id parameter is missing"})
    }
    else{
        res.json({
            "userId": 1,
            "id": 1,
            "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
            "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
        })
    }
    logger.debug(fluentdLoggerFormatter(req,res))
})

// Dummy post API with some input params and response.
app.post('/submit-data', (req,res)=>{
    if(!req.body.name || !req.body.email){
        res.status(401).json({
            message : "Mandatory params are missing!"
        })
    }
    else{
        res.status(200).json({
            message : "data saved successfully"
        })
    }
    logger.debug(fluentdLoggerFormatter(req,res))
})

//Launch listening server on port 8080
app.listen(4000, ()=> {
  console.log('App listening on port 4000!')
})

const fluentdLoggerFormatter = (req, res) => {
    return {
        "sourceSytem": "nodejsapp",
        "reqUrl": req.originalUrl,
        "reqBody": req.body,
        "resStatusCode": res.statusCode,
        "receivedTime": new Date().toISOString() 
    }
}

module.exports = app;