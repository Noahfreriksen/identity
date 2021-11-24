function getNewFeatures()
{
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
                var btn = featureList.appendChild(newElement('button', feature, 'feature-button unselected', 'fbutton'));
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

getNewFeatures();

var form = document.getElementById("form");
var button = form.appendChild(newElement('button', 'Next', 'feature-button confirm', 'confirm'));
var buttonFS = form.appendChild(newElement('button', 'Fullscreen', 'feature-button confirm', 'confirm'));

button.addEventListener('click', function () 
{
    confirm();
})

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