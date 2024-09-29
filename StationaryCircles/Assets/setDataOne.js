//@input Asset.RemoteServiceModule rsm

const request = RemoteServiceHttpRequest.create();
request.url = "https://spectaclesweb.vercel.app/api";
request.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;
//script.rsm.performHttpRequest(request, onResponse);
function onResponse(response){
    print("Status code: " + response.statusCode);
    print(response.body);
}

function getResponse(){
    print("Second button pressed!");
    script.rsm.performHttpRequest(request, onResponse);
}

script.getResponse = getResponse;