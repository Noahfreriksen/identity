let step = "begin";

var pusher = new Pusher('eece33e6915f81081df4', {
    cluster: 'eu'
});

var channel = pusher.subscribe('my-channel');
var privatechannel = pusher.subscribe('private-channel');

privatechannel.bind("pusher:subscription_succeeded", () => {
    privatechannel.trigger('client-step', step);
});

privatechannel.bind("client-requestStep", () => {
    console.log("request step");
    sendStep();
});

var form = document.getElementById("form");
var button = form.appendChild(newElement('button', 'Next', 'feature-button confirm', 'confirm'));
var buttonFS = form.appendChild(newElement('button', 'Fullscreen', 'feature-button confirm', 'confirm'));

let voteCount = 0;
let preCount = 0;

button.addEventListener('click', function () 
{
    console.log("click");
    switch (step)
    {
        case "begin":
            button.innerHTML = "Next";
            voteCount = 0;
            preCount = 0;
            step = "takePicture";
            sendStep();
            break;

        case "takePicture":
            privatechannel.trigger('client-shutter', {});
            button.style.display = 'none';

            voteCount = 0;
            preCount = 0;
            step = "vote";
            setTimeout(function () {
                button.style.display = 'block';
                sendStep();
                getNewFeatures();
            }, 3500);
            break;

        case "vote":
            console.log("vote");
            console.log(voteCount);

            if (voteCount == 0)
            {
                sendStep();
                confirm();
                voteCount++;
            }
            else if (voteCount >= 9)
            {
                if (preCount > 0)
                {
                    step = "results";
                }
                else
                {
                    step = "noresults"
                }
                setTimeout(function () 
                {
                    var btns = document.getElementsByClassName("deletable");
                    console.log(btns);
                    for(var i = 0; i < btns.length; i++)
                    {
                        console.log(btns[i]);
                        btns[i].style.display = 'none';
                    }
                }, 100);

                button.innerHTML = "Stop";
                confirm();
                sendStep();
            }
            else
            {
                confirm();
                voteCount++;
            }
            break;

        case "noresults":
            button.innerHTML = "Next";
            step="begin";
            sendStep();
            break;


    }
})

function getNewFeatures()
{
    console.log("getnewfeatues");
    fetch('/getFeatures').then(response => 
    {
        return response.json();
    }).then(data => 
    {
        const newArray = shuffle(data["features"]);
        var featureList = document.getElementById("featureList");
        featureList.innerHTML = '';

        for (var i = 0; i < 3; i++)
        {
            (function ()
            {
                const feature = newArray[i];
                console.log(feature);
                var btn = featureList.appendChild(newElement('button', feature, 'feature-button unselected deletable', 'fbutton'));
                btn.id = i;
                btn.addEventListener('click', function () 
                {
                    var btn0 = document.getElementById("0");
                    var btn1 = document.getElementById("1");
                    var btn2 = document.getElementById("2");

                    
                    if(btn.classList.contains('selected'))
                    {
                        btn.classList.add('unselected');
                        btn.classList.remove('selected');
                    }
                    else
                    {
                        btn.classList.remove('unselected');
                        btn.classList.add('selected');
                        if (btn.id == '0')
                        {
                            btn1.classList.add('unselected');
                            btn1.classList.remove('selected');
                            btn2.classList.add('unselected');
                            btn2.classList.remove('selected');
                        }
                        else if (btn.id == '1')
                        {
                            btn0.classList.add('unselected');
                            btn0.classList.remove('selected');
                            btn2.classList.add('unselected');
                            btn2.classList.remove('selected'); 
                        }
                        else if (btn.id == '2')
                        {
                            btn0.classList.add('unselected');
                            btn0.classList.remove('selected');
                            btn1.classList.add('unselected');
                            btn1.classList.remove('selected');   
                        }
                    } 
                });
            }());
        }
    }).catch(err => 
    {
        console.log(err)
    });
}

buttonFS.addEventListener("click", function() {
    var docElm = document.documentElement;
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    }
    else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    }
    else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    }
    else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
    }
    buttonFS.style.display = "none";

}, false);

// Helper functions
function shuffle(array) 
{
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

function newElement(tagName, TextContent, ClassName, name) {
    var nTag = document.createElement(tagName);
    nTag.className = ClassName;
    nTag.name = name;
    nTag.appendChild(document.createTextNode(TextContent));
    return nTag;
  }

function confirm()
{
    const btnsSelected = document.getElementsByClassName("selected");
    preCount += btnsSelected.length;
    let featureArray = [];

    for (var i = 0; i < btnsSelected.length; i++)
    {
        const feature = btnsSelected[i].innerHTML;
        featureArray.push(feature);
    }

    var jsonString = JSON.stringify(featureArray);

    var response = fetch('/confirm', 
    {
        method: 'POST',
        headers: 
        {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Transfer-Encoding': 'identity'
        },
        body: jsonString
    }).then(res => 
    {
        if (res.ok) 
        {
            getNewFeatures();
        }
    });
}

function sendStep()
{
    privatechannel.trigger('client-step', step);
}