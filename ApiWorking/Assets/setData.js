//@input Asset.RemoteServiceModule rsm
//@input Component.Text textComponent

const request = RemoteServiceHttpRequest.create();
request.url = "https://spectaclesweb.vercel.app/api";
request.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;
//script.rsm.performHttpRequest(request, onResponse);


function onResponse(response){
    print("Status code: " + response.statusCode);
    print(response.body);
    
    if (response.statusCode === 200) {
        if (script.textComponent.enabled === true) {
            script.textComponent.enabled = false
        } else {
            script.textComponent.enabled = true
        }
    }
}

function getResponse(){
    print("toggled!");
    script.rsm.performHttpRequest(request, onResponse);
}

script.getResponse = getResponse;

