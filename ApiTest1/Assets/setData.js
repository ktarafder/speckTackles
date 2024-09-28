//@input Asset.RemoteServiceModule rsm

const request = RemoteServiceHttpRequest.create();
request.url = "https://spectaclesweb.vercel.app/api";
request.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;
//script.rsm.performHttpRequest(request, onResponse);
function onResponse(response){
    print("Status code 1: " + response.statusCode);
    print(response.body);
}

function getResponse(){
    print("toggled!");
    script.rsm.performHttpRequest(request, onResponse);
}

script.getResponse = getResponse;

//function onResponse(response){
//    print("Status code: " + response.statusCode);
//    print(response.body);
//}
//
//function GetExample() {
//    script.rsm.url = "https://spectaclesweb.vercel.app/api";
//
//    const request = RemoteServiceHttpRequest.create();
//    request.url = "https://spectaclesweb.vercel.app/api";
//    request.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;
//    script.rsm.performHttpRequest(request, onResponse);    
//    
//    
////    let request = RemoteServiceHttpsRequest.create();
//    request.url = apiUrl;   
//    script.rsm.performHttpRequest(request, function(response){      
//        print(response.body);
//
//    })
//}