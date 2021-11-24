var form = document.getElementById("form");

var pusher = new Pusher('eece33e6915f81081df4', {
    cluster: 'eu'
});

var channel = pusher.subscribe('my-channel');

channel.bind('newImage', function(data) {
    getNewImage();
});

takePicture();

function takePicture()
{
    var video = document.querySelector("#video");

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