//@input Asset.RemoteServiceModule rsm
//@input Component.Text textComponent

// URL to your API endpoint
const putRequest = RemoteServiceHttpRequest.create();
putRequest.url = "https://spectacles-taupe.vercel.app/api/send-data2";
putRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Put;

// Initialize a local counter to track the value
var valueCounter = 90;  // Starting value set to 90

// Handle the PUT response
function onPutResponse(response) {
    print("PUT Status code: " + response.statusCode);
    print("PUT Response: " + response.body);

    if (response.statusCode == 200) {
        // Decrement the counter value by 10 and cap it at 0
        valueCounter = Math.max(valueCounter - 10, 0);  // Decreases by 10, but never goes below 0

        // Display the updated counter value in the text component
        script.textComponent.text = valueCounter + "°";
        print("Successfully updated counter! New value: " + valueCounter);
    } else {
        print("Failed to update counter value.");
    }
}

// Function to trigger the counter decrement operation
function decrementCounter() {
    if (valueCounter > 0) {
        print("Decrementing counter value...");
        
        // Prepare the request body with the updated counter value
        putRequest.body = JSON.stringify({ counter: Math.max(valueCounter - 10, 0) });
        script.rsm.performHttpRequest(putRequest, onPutResponse);
    } else {
        print("Counter is already at 0. Cannot decrement further.");
    }
}

// Assign the decrement function to be called on interaction
script.decrementCounter = decrementCounter;
