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

channel.bind('newImage', function(data) {
    getNewImage();
});

privatechannel.bind("client-step", function(data) {
    console.log(data);
    switch(data) {
        case "begin":
          titleScreen();
          break;

        case "takePicture":
            takePicture();
            break;

        case "vote":
            vote();
            break;

        default:
          // code block
      }

});

function vote()
{
    text1.innerHTML = "How does this person come across to you?"
    text2.innerHTML = "Select the trait that fits this person best"

    text3.innerHTML = "Fill in your prejudices on the tablet below"

    var video = document.querySelector("#video");
    var portrait = document.querySelector("#portrait");

    video.style.display = 'none';
    portrait.style.display = 'block';



}

function titleScreen()
{
    text1.innerHTML = "What goes around comes around"
    text2.innerHTML = ""

    text3.innerHTML = "Hit the button on the tablet"

    var video = document.querySelector("#video");
    var portrait = document.querySelector("#portrait");

    video.style.display = 'none';
    portrait.style.display = 'none';

}

// How does this person come across to you?
// Select the trait that fits this person best
// Make a selection on the tablet below


function takePicture()
{
    text1.innerHTML = "Take a picture of yourself. The top and bottom of your head must be completely visible"
    text2.innerHTML = "The picture will be deleted after the session"

    text3.innerHTML = "Hit the button on the tablet"

    var video = document.querySelector("#video");
    var portrait = document.querySelector("#portrait");

    portrait.style.display = 'none';
    video.style.display = 'block';

    if (navigator.mediaDevices.getUserMedia) 
    {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) 
            {
                video.srcObject = stream;
            })
            .catch(function (err0r) 
            {
                console.log("Something went wrong!");
            });
    }
}

// Afbeelding hier maken
privatechannel.bind('client-shutter', function(data) {
    
});


function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data); // window.atob(b64Data)
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

function getNewImage()
{
    fetch('/getImage').then(response => 
    {
        return response.json();
    }).then(data => 
    {
        var img = document.getElementById("portrait");
        img.src = data;
    }).catch(err => 
    {
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