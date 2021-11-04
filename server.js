const express = require('express');
const app = express();
const port = 8060
const fs = require('fs');
const path = require('path')

const WebSocket = require('ws');
const wsServer = new WebSocket.Server({port: '8082'})
app.use(express.static('public'))


app.get("/",(req, res) => {
    console.log("STARTED");
    res.setHeader("Content-Type", "text/html");
    res.sendFile(__dirname + '/index.html');
    
})


wsServer.on('connection', (ws) => {
    ws.on('massage', (message) => {
        console.log("MESSAGE")
        ws.send(JSON.stringify())
    })
})



app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
  })