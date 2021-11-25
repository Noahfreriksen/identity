var form = document.getElementById("form");
var text1 = document.querySelector("#text1");
var text2 = document.querySelector("#text2");
var text3 = document.querySelector("#text3");

var canvas = document.querySelector("#canvas");
canvas.style.display = 'none';



var pusher = new Pusher('eece33e6915f81081df4', {
    cluster: 'eu'
});

var channel = pusher.subscribe('my-channel');
var privatechannel = pusher.subscribe('private-channel');

privatechannel.bind("pusher:subscription_succeeded", () => {
    privatechannel.trigger('client-requestStep', {});
});

channel.bind('newImage', function (data) {
    getNewImage();
});

privatechannel.bind("client-step", function (data) {
    console.log(data);
    switch (data) {
        case "begin":
            titleScreen();
            break;

        case "takePicture":
            takePicture();
            break;

        case "vote":
            vote();
            break;
        case "results":
            results();
            break;

        default:
        // code block
    }

});

function results() {
    text1.innerHTML = "The system will run your picture through the machine learning algorithm now."
    text2.innerHTML = "The prejudices of a group of people will be shown on the screen once it's ready."

    text3.innerHTML = ""

    var video = document.querySelector("#video");
    var portrait = document.querySelector("#portrait");

    video.style.display = 'none';
    portrait.style.display = 'none';

    //getNewImage();
}

function vote() {
    text1.innerHTML = "How does this person come across to you?"
    text2.innerHTML = "Select the trait that fits this person best"

    text3.innerHTML = "Fill in your prejudices on the tablet below"

    var video = document.querySelector("#video");
    var portrait = document.querySelector("#portrait");

    video.style.display = 'none';
    portrait.style.display = 'block';

    getNewImage();
}

function titleScreen() {
    text1.innerHTML = "What goes around comes around"
    text2.innerHTML = ""

    text3.innerHTML = "Hit the button on the tablet"

    var video = document.querySelector("#video");
    var portrait = document.querySelector("#portrait");

    video.style.display = 'none';
    portrait.style.display = 'none';

}

function takePicture() {
    text1.innerHTML = "Take a picture of yourself. The top and bottom of your head must be completely visible"
    text2.innerHTML = "The picture will be deleted after the session"

    text3.innerHTML = "Hit the button on the tablet"

    var video = document.querySelector("#video");
    var portrait = document.querySelector("#portrait");

    portrait.style.display = 'none';
    video.style.display = 'block';

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream;
            })
            .catch(function (err0r) {
                console.log("Something went wrong!");
            });
    }
}

privatechannel.bind('client-shutter', function (data) {
    takeScreenshot();
});

function getNewImage() {
    fetch('/getImage').then(response => {
        return response.json();
    }).then(data => {
        var img = document.getElementById("portrait");
        img.src = data;
    }).catch(err => {
        console.log(err)
    });
}

function newElement(tagName, TextContent, ClassName, name) {
    var nTag = document.createElement(tagName);
    nTag.className = ClassName;
    nTag.name = name;
    nTag.appendChild(document.createTextNode(TextContent));
    return nTag;
}

/** 
 * Some magic found on Stackoverflow.
 */
function snap() {
    context.fillRect(0, 0, w, h);
    context.drawImage(video, 0, 0, w, h);
}

/**
 * Grabs screenshot, converts it to base69 and sends it to the node server.
 */
function screenie() {
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.heigth);
    let base64Image = canvas.toDataURL('image/jpeg',0.7);
    var xhr = new XMLHttpRequest();
    var url = "/processImage";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Transfer-Encoding", "chunked")
    var data = JSON.stringify({ "data": base64Image });
    xhr.send(data)
}

/**
 * The timeout function is to make sure that everything is loaded properly. 
 */
function takeScreenshot() {
    setTimeout(function () {
        snap();
        screenie();
    }, 3000);
}