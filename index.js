// index.js
/**
 * Required External Modules
 */
 const express = require("express");
 const ThisPersonDoesNotExist = require("thispersondoesnotexist-js")
 const path = require("path");
 const fs = require('fs')
 var bodyParser = require('body-parser');


/**
 * App Variables
 */
 const app = express();
 const port = process.env.PORT || "8000";

global.currentImage = new Map();

/**
 *  App Configuration
 */
 app.set("views", path.join(__dirname, "views"));
 app.set("view engine", "pug");
 app.use(express.static(__dirname+'/avatars'));
 app.use(bodyParser.json());
 app.set('trust proxy', true);

/**
 * Routes Definitions
 */
app.get("/", (req, res) => {
    res.status(200).sendFile(__dirname + '/views/vote.html');
});

app.get("/vote.js", (req, res) => {
    res.status(200).sendFile(__dirname + '/views/vote.js');
});

app.get("/vote.css", (req, res) => {
    res.status(200).sendFile(__dirname + '/views/vote.css');
});

app.get("/getFeatures", (req, res) => 
{
    res.status(200).sendFile(__dirname + '/features.json');
});

app.get("/getImage", (req, res) => 
{
    // Check if client has an image in avatars that need to be removed
    if (currentImage.has(req.ip))
    {
        console.log("Delete image");
        fs.unlink('avatars/'  + currentImage.get(req.ip), (err) => 
        {
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
    }).then(ress  => {
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
    }).catch(err  => {
        console.log('error->', err);
    });
});

app.post("/confirm", (req, res) => 
{
    const json = req.body;
    const sDir = __dirname + "/avatars/";

    for (var i = 0; i < json.length; i++)
    {
        const feature = json[i];
        dDir = __dirname + "/featured/" + feature + "/";

        if (!fs.existsSync(dDir)){
            fs.mkdirSync(dDir);
        }
        
        fs.copyFileSync
        (
            sDir + currentImage.get(req.ip), 
            dDir + currentImage.get(req.ip),
            (err) => 
            {
                if (err)
                {
                    console.log(err);
                }
                else
                {
                    console.log('source was copied to destination');
                }
            }
        );
    }

    if (currentImage.get(req.ip).length > 1)
    {
        console.log("deleted");
        fs.unlink(sDir  + currentImage.get(req.ip), (err) => 
        {
            if (err) {
                console.error(err)
                return
            }
        });
    }

    res.status(200).send("ok");
});

/**
 * Server Activation
 */
 app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });