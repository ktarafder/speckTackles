//@input Asset.RemoteServiceModule rsm

// URL to your API endpoint for fetching humidity and temperature data
const getRequest = RemoteServiceHttpRequest.create();
getRequest.url = "https://spectacles-taupe.vercel.app/api/fetch-hum_temp";
getRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;

// Function to handle the response from the GET request
function onGetResponse(response) {
    print("GET Status code: " + response.statusCode);
    print("GET Response: " + response.body);
    
    if (response.statusCode == 200) {
        // Parse the response body to get the humidity and temperature values
        var responseData = JSON.parse(response.body);

        // Retrieve and print the humidity and temperature values
        var humidity = responseData.hum;
        var temperature = responseData.temp;

        print("Humidity: " + humidity);
        print("Temperature: " + temperature);
    } else {
        print("Failed to fetch humidity and temperature data.");
    }
}

// Function to send the GET request to fetch the data
function fetchHumAndTempData() {
    print("Fetching humidity and temperature data...");
    script.rsm.performHttpRequest(getRequest, onGetResponse);
}

// Assign the function to be called when needed (e.g., button interaction)
script.fetchHumAndTempData = fetchHumAndTempData;
