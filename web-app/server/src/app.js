'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const ipfsClient = require('ipfs-http-client');
const BufferList = require('bl/BufferList');
const fs = require('fs');

const ipfs = ipfsClient('http://localhost:5001');
let network = require('./fabric/network.js');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload({ createParentPath: true }));
app.use(bodyParser.urlencoded({ extended: true }));


const backuptToIPFS = async (req) => {
    const backedUpFile = {
        content: Buffer.from(req.data)
    };

    for await (const file of ipfs.add(backedUpFile)) {
        console.log(file.path)
        return file.path;
    }

    // const uploadBackup = await ipfs.add(backedUpFile);
    // console.log("Backed up hash of file" + uploadBackup[0].path);
    return 'uploadBackup[0].hash';
}

const retrieveBackupFromIPFS = async (req, fileName) => {
    const filePath = req;
    fileName = "backups/" + fileName;

    for await (const file of ipfs.get(filePath)) {
        console.log(file.path)

        const content = new BufferList()
        for await (const chunk of file.content) {
            content.append(chunk)
            // return chunk;
        }

        fs.writeFile(fileName, file, "binary", function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });
        return fileName;

        // console.log(content.toString(fileName))
        // return content;
    }
}

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

app.get('/queryFileIPFS', async (req, res) => {
    console.log(req.query.key);
    console.log("Works : " + req.query.filename);

    try {
        let ipfsHash = req.query.key;
        let ipfsFileName = req.query.filename;
        let downloadedFile = await retrieveBackupFromIPFS(ipfsHash, ipfsFileName);
        // return res.end(downloadedFile);

        // Check if file specified by the filePath exists 
        fs.exists(downloadedFile, function (exists) {
            if (exists) {
                // Content-type is very interesting part that guarantee that
                // Web browser will handle response in an appropriate manner.
                res.writeHead(200, {
                });
                
                fs.createReadStream(downloadedFile).pipe(res);
            } else {
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end("ERROR File does not exist");
            }
        });
    } catch (err) {
        res
            .status(500)
            .send(err);
    }
});

app.post('/createBackup', (req, res) => {
    console.log(req.body);
    network.queryAllBackups()
        .then((response) => {
            console.log(response);
            let backupsRecord = JSON.parse(response);
            let backupsCount = backupsRecord.length;
            let newKey = 'ELAN' + backupsCount;
            network.createBackup(newKey, req.body.backupTitle, req.body.fileHash, req.body.filePath, req.body.fileName, req.body.backupDateTime)
                .then((response) => {
                    res.send(response);
                });
        });
});

app.post('/uploadToIpfs', async (req, res) => {

    try {

        if (!req.files) {
            res.send({ status: false, message: 'No file uploaded!' });
        } else {
            let backupFile = req.files.file;
            console.log("The uploaded file details: " + backupFile.filename);
            let ipfsHash = await backuptToIPFS(backupFile);
            // let ipfsHash = 'QmTNRhKEH8H2zwHjo1i4pjtb8QWVZxJ27ARmRihRCRveGE'

            return res.json({
                'Backup': {
                    'name': `${backupFile.name}`,
                    'ipfsHash': `http://127.0.0.1:8080/ipfs/${ipfsHash}`,
                }
            })
        }
    } catch (err) {
        res
            .status(500)
            .send(err);
    }
});

app.listen(process.env.PORT || 7171, '0.0.0.0');