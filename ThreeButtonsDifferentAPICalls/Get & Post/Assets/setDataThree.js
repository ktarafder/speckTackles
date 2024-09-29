//@input Asset.RemoteServiceModule rsm

// URL to your API endpoint for updating the light status
const putRequest = RemoteServiceHttpRequest.create();
putRequest.url = "https://spectacles-taupe.vercel.app/api/send-data";
putRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Put;

// Initialize a local counter to track the toggle state
var toggleCounter = 0;

// Handle the PUT response
function onPutResponse(response) {
    print("PUT Status code: " + response.statusCode);
    print("PUT Response: " + response.body);

    if (response.statusCode == 200) {
        // Log success and update the local counter value
        toggleCounter += 1; // Increment the counter
        var isLightOn = toggleCounter % 2 !== 0; // Determine light state: odd = On, even = Off
        print("Successfully updated light status! New status: " + (isLightOn ? "On" : "Off"));
    } else {
        print("Failed to update light status.");
    }
}

// Function to trigger the toggle operation
function toggleLightStatus() {
    print("Toggling light status...");
    
    // Increment the counter in the database
    putRequest.body = JSON.stringify({ counter: toggleCounter + 1 }); // Increment the value to reflect the toggle
    script.rsm.performHttpRequest(putRequest, onPutResponse);
}

// Assign the toggle function to be called on interaction
script.toggleLightStatus = toggleLightStatus;