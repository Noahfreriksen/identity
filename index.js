// index.js
/**
 * Required External Modules
 */
var express = require("express");
var app = express();
const multer = require("multer");

const upload = multer({dest: './'})

const port = process.env.PORT || "7777";

const ThisPersonDoesNotExist = require("thispersondoesnotexist-js")
const path = require("path");
const fs = require('fs')
var bodyParser = require('body-parser');
const cors = require("cors");

/**
 * Pusher configuration
 */
const Pusher = require("pusher");
const { SSL_OP_NO_TLSv1_1 } = require("constants");
const pusher = new Pusher({
    appId: "1302859",
    key: "eece33e6915f81081df4",
    secret: "688f6801f9a3f7501e99",
    cluster: "eu",
    useTLS: true
});

global.currentImage = new Map();
app.use(express.json());

/**
 *  App Configuration
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(__dirname + '/avatars'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.set('trust proxy', true);

/**
 * Routes Definitions
 */
app.post("/pusher/auth", (req, res) => {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const auth = pusher.authenticate(socketId, channel);
    res.send(auth);
});

app.get("/", (req, res) => {
    res.status(200).sendFile(__dirname + '/views/vote.html');
});

app.get("/vote.js", (req, res) => {
    res.status(200).sendFile(__dirname + '/views/vote.js');
});

app.get("/vote.css", (req, res) => {
    res.status(200).sendFile(__dirname + '/views/vote.css');
});

app.get("/tv.html", (req, res) => {
    res.status(200).sendFile(__dirname + '/views/tv.html');
});

app.get("/tv.js", (req, res) => {
    res.status(200).sendFile(__dirname + '/views/tv.js');
});

app.get("/tv.css", (req, res) => {
    res.status(200).sendFile(__dirname + '/views/tv.css');
});

app.get("/neural.png", (req, res) => {
    res.status(200).sendFile(__dirname + '/neural.png');
});

app.get("/getFeatures", (req, res) => {
    res.status(200).sendFile(__dirname + '/features.json');
});

app.get("/Bingana-6YGyx.otf", (req, res) => {
    res.status(200).sendFile(__dirname + '/Bingana-6YGyx.otf');
});

app.get("/Bingana-ywxL3.ttf", (req, res) => {
    res.status(200).sendFile(__dirname + '/Bingana-ywxL3.ttf');
});

app.post("/processImage", (req, res) => {
    let image = req.body.data;
    var base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
    require("fs").writeFile("./image/image.jpeg", base64Data, 'base64', function(err) {
        if(err) {
            console.log(err);
            res.sendStatus(505);
        } else {
            console.log("We processed an image.")
            res.sendStatus(200)
        }
    });
});

app.get("/getImage", (req, res) => {
    // Check if client has an image in avatars that need to be removed
    if (currentImage.has(req.ip)) {
        console.log("Delete image");
        fs.unlink('avatars/' + currentImage.get(req.ip), (err) => {
            if (err) {
                console.error(err)
                return
            }
        });

    }

    const dnte = new ThisPersonDoesNotExist();

    dnte.getImage({
        width: 256, // width of the image (default 128)
        height: 256, // high of the image (default 128)
        type: 'file',  // Type of file to generate (file or base64) (default file)
        path: 'avatars' // Path to save (Applies to type file) (default .)
    }).then(ress => {
        console.log(req.ip);
        currentImage.set(req.ip, ress.data.name)
        res.status(200).send(JSON.stringify(currentImage.get(req.ip)));
        /*
        { 
            status: true,
            data:{ 
                format: 'jpeg',
                width: 256,
                height: 256,
                channels: 3,
                premultiplied: false,
                size: 9575,
                name: 'Q2m4yrR9Is.jpeg' 
            }
        }
        */
    }).catch(err => {
        console.log('error->', err);
    });
});

app.post("/confirm", (req, res) => {
    const json = req.body;
    const sDir = __dirname + "/avatars/";

    for (var i = 0; i < json.length; i++) {
        const feature = json[i];
        dDir = __dirname + "/featured/" + feature + "/";

        if (!fs.existsSync(dDir)) {
            fs.mkdirSync(dDir);
        }

        fs.copyFileSync
            (
                sDir + currentImage.get(req.ip),
                dDir + currentImage.get(req.ip),
                (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('source was copied to destination');
                        console.log(dDir);
                    }
                }
            );
    }
    pusher.trigger("my-channel", "newImage", {});
    res.status(200).send("ok");
});

/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});