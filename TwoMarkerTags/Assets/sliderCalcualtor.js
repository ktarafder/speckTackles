// @input Component.SliderObject slider
// @input Component.Text textComponent

// Function to update the text based on the slider value
function updateText() {
    // Get the current value of the slider (which will be between 0 and 1)
    var sliderValue = script.slider.value;

    // Scale the value to be between 0 and 100
    var scaledValue = Math.round(sliderValue * 100);

    // Set the text of the textComponent to display the scaled value
    script.textComponent.text = scaledValue.toString();
}

// Bind the update function to the slider's onValueChanged event
script.slider.api.onValueChanged = updateText;

// Initialize the text with the current slider value
updateText();