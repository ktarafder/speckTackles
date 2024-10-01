// Initialize the counter variable
let counter = 0;

// Function to turn the light ON
function turnOnLight() {
    console.log("Light is ON");
    // Code to trigger light on
}

// Function to turn the light OFF
function turnOffLight() {
    console.log("Light is OFF");
    // Code to trigger light off
}

// Function to toggle the light state based on the counter value
function toggleLight() {
    if (counter % 2 === 0) {
        turnOffLight();
    } else {
        turnOnLight();
    }
}

// Function to increment the counter (toggle light)
function increment() {
    counter++;
    console.log("Counter: " + counter);
    toggleLight();
}

// Function to decrement the counter (toggle light)
function decrement() {
    if (counter > 0) {
        counter--;
        console.log("Counter: " + counter);
        toggleLight();
    } else {
        console.log("Counter can't go below zero.");
    }
}

// Function to reset the counter (turn lights off)
function reset() {
    counter = 0;
    console.log("Counter has been reset.");
    turnOffLight();
}

// Simulate user interaction
console.log("Initial Counter: " + counter);

// User interactions
increment();  // Output: Counter: 1, Light is ON
increment();  // Output: Counter: 2, Light is OFF
decrement();  // Output: Counter: 1, Light is ON
reset();      // Output: Counter has been reset, Light is OFF