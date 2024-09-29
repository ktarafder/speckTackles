//@input Asset.RemoteServiceModule rsm
//@input Component.Text textComponent

// URL to your API endpoint
const putRequest = RemoteServiceHttpRequest.create();
putRequest.url = "https://spectacles-taupe.vercel.app/api/increment";
putRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Put;

// Initialize a local counter to track the value
var valueCounter = 0;

// Handle the PUT response
function onPutResponse(response) {
    print("PUT Status code: " + response.statusCode);
    print("PUT Response: " + response.body);

    if (response.statusCode == 200) {
        // Increment the counter value and cap it at 90
        valueCounter = (valueCounter + 10) % 100;  // Adds 10 and wraps around to 0 after 90

        // Display the updated counter value in the text component
        script.textComponent.text = valueCounter + "°";
        print("Successfully updated counter! New value: " + valueCounter);
    } else {
        print("Failed to update counter value.");
    }
}

// Function to trigger the counter increment operation
function incrementCounter() {
    print("Incrementing counter value...");
    
    // Prepare the request body with the updated counter value
    putRequest.body = JSON.stringify({ counter: valueCounter + 10 > 90 ? 0 : valueCounter + 10 });
    script.rsm.performHttpRequest(putRequest, onPutResponse);
}

// Assign the increment function to be called on interaction
script.incrementCounter = incrementCounter;
