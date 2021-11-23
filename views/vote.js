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

                btn.addEventListener('click', function () 
                {
                    if(btn.classList.contains('selected'))
                    {
                        btn.classList.add('unselected');
                        btn.classList.remove('selected');
                    }
                    else
                    {
                        btn.classList.remove('unselected');
                        btn.classList.add('selected');
                    }
                    confirm();
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
var button = form.appendChild(newElement('button', 'Confirm', 'feature-button confirm', 'confirm'));

button.addEventListener('click', function () 
{
    confirm();
})

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
            getNewImage();
            getNewFeatures();
        }
    });
}