const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

let data = {
    "data": "",
    "error": false,
    "message": "",
    "status": "OK"
};


app.get('/api/sentMail', (req, res) => {
    const newdata = req.body;
    fs.readFile('src/jsons/sent.json', (err, jsondata) => {
        const json = JSON.parse(jsondata)
        json.push(newdata)
        fs.writeFile("src/jsons/sent.json", JSON.stringify(json))
    })
});

app.post('/api/deleteMail', (req, res) => {
    const newdata = req.body.mailData;

    fs.readFile('./src/jsons/deleted.json', 'utf8', (err, jsondata) => {
        if (err) throw err;
        let json = [];
        if (jsondata.length === 0) {
            json = json.push(jsondata);
        } else {
            json = JSON.parse(jsondata);
            json.push(newdata)
        }

        fs.writeFile("./src/jsons/deleted.json", JSON.stringify(json), (err, jdata) => {
            if (err) console.log('error', err);
            data['data'] = jdata;
            data['status'] = 'OK';
            data['message'] = 'Successfully Deleted';
            return res.send(data);
        });
    });
});

app.post('/api/test', (req, res) => {
    return res.send(data);
});

app.use((req, res, next) => {
    res.status(404).send("Sorry, that route doesn't exist.:)");
});
const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log('Node app is running on port ' + port);
});