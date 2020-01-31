'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

let network = require('./fabric/network.js');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());


app.get('/queryAllBackups', (req, res) => {
    network.queryAllBackups()
        .then((response) => {
            let backupsRecord = JSON.parse(response);
            res.send(backupsRecord);
        });
});

app.get('/queryBackup', (req, res) => {
    console.log(req.query.key);
    network.queryBackup(req.query.key)
        .then((response) => {
            let backupsRecord = JSON.parse(response);
            res.send(backupsRecord);
        });
});

app.post('/createBackup', (req, res) => {
    console.log(req.body);
    network.queryAllBackups()
        .then((response) => {
            console.log(response);
            let backupsRecord = JSON.parse(response);
            let backupsCount = backupsRecord.length;
            let newKey = 'ELAN' + backupsCount;
            network.createBackup(newKey, req.body.backupTile, req.body.filePath, req.body.fileName, req.body.backupDateTime, req.body.fileHash)
                .then((response) => {
                    res.send(response);
                });
        });
});

// app.post('/changeCarOwner', (req, res) => {
//     network.changeCarOwner(req.body.key, req.body.newOwner)
//         .then((response) => {
//             res.send(response);
//         });
// });

app.listen(process.env.PORT || 8081);