//@input Asset.RemoteServiceModule rsm

// URL to your API endpoint for getting and updating the light status
const getRequest = RemoteServiceHttpRequest.create();
getRequest.url = "https://spectacles-taupe.vercel.app/api/fetch-data";
getRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;

const postRequest = RemoteServiceHttpRequest.create();
postRequest.url = "https://spectacles-taupe.vercel.app/api/send-data";
postRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Post;

// Track the current light status globally
var isLightOn = false;

// Handle the GET response
function onGetResponse(response) {
    print("GET Status code: " + response.statusCode);
    print("GET Response: " + response.body);
    
    if (response.statusCode == 200) {
        // Parse the response body to get the current light status
        var responseData = JSON.parse(response.body);

        // Store the current status in a global variable
        isLightOn = responseData.lightOn;

        // Toggle the light status: if true (on) -> set to false (off), if false -> set to true
        var newLightStatus = !isLightOn;

        // Prepare the POST request body with the toggled status
        postRequest.body = JSON.stringify({ lightOn: newLightStatus });

        // Send the POST request to update the light status
        script.rsm.performHttpRequest(postRequest, onPostResponse);
    } else {
        print("Failed to fetch light status.");
    }
}

// Handle the POST response
function onPostResponse(response) {
    print("POST Status code: " + response.statusCode);
    print("POST Response: " + response.body);

    if (response.statusCode == 200) {
        // Log success and update the global state
        isLightOn = !isLightOn; // Toggle the global state to reflect the new status
        print("Successfully updated light status! New status: " + (isLightOn ? "On" : "Off"));
    } else {
        print("Failed to update light status.");
    }
}

// Function to trigger the toggle operation
function toggleLightStatus() {
    print("Fetching current light status...");
    // Perform the GET request to get the current light status
    script.rsm.performHttpRequest(getRequest, onGetResponse);
}

// Assign the toggle function to be called on interaction
script.toggleLightStatus = toggleLightStatus;

