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

        case y:
          // code block
          break;

        default:
          // code block
      }

});

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

privatechannel.bind('client-shutter', function(data) {
    console.log("shutter");
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.heigth);
    var form = document.getElementById("myAwesomeForm");
    let image_data_url = canvas.toDataURL('image/jpeg');

    // Split the base64 string in data and contentType
    var block = image_data_url.split(";");
    // Get the content type of the image
    var contentType = block[0].split(":")[1];// In this case "image/jpeg"
    // get the real base64 content of the file
    var realData = block[1].split(",")[1];

    // Convert it to a blob to upload
    var blob = b64toBlob(realData, contentType);

    // Create a FormData and append the file with "image" as parameter name
    var formDataToUpload = new FormData(form);
    formDataToUpload.append("image", blob);

    var request = new XMLHttpRequest();
    request.open("POST", "/postImage");
    request.send(formDataToUpload);
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