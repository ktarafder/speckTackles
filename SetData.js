script.remoteServiceModule = require('LensStudio:RemoteServiceModule');
script.remoteServiceModule.apiSpecId = 'http';

var httpRequest = RemoteServiceHttpRequest.create();
httpRequest.url = 'https://spectacles-taupe.vercel.app/api';
httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;

print('Sending request!');

script.remoteServiceModule.performHttpRequest(httpRequest, function (response) {
  print('Request response received');
  print('Status code: ' + response.statusCode);
  print('Content type: ' + response.contentType);
  print('Body: ' + response.body);
  print('Headers: ' + response.headers);
  print('Specific header(date): ' + response.getHeader('date'));
});