//@input Asset.RemoteServiceModule rsm
//@input Component.Text textComponent

lightOn = false;
const request = RemoteServiceHttpRequest.create();
request.url = "https://spectaclesweb.vercel.app/api";
request.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;
//script.rsm.performHttpRequest(request, onResponse);


function onResponse(response){
    print("Status code: " + response.statusCode);
    print(response.body);
    
    if (response.statusCode === 200) {
        if (lightOn) {
            script.textComponent.textFill.color = new vec4(.70, .70, .70, 1);
        } else {
            script.textComponent.textFill.color = new vec4(1, .98, .474, 1);
        }
        lightOn = !lightOn;
    }
}

function getResponse(){
    print("ceiling lights");
    script.rsm.performHttpRequest(request, onResponse);
}

script.getResponse = getResponse;