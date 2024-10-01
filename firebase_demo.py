import pyrebase
import time

# Firebase configuration
firebaseConfig = {
    "apiKey": "AIzaSyCFV710VvBWCiL8qpqOzaWR20jGmdkHRwc",
    "authDomain": "spectacles-f3020.firebaseapp.com",
    "databaseURL": "https://spectacles-f3020-default-rtdb.firebaseio.com/",
    "projectId": "spectacles-f3020",
    "storageBucket": "spectacles-f3020.appspot.com",
    "messagingSenderId": "332743998937",
    "appId": "1:332743998937:web:e4d853740b682e1c172dc8"
}

# Initialize Firebase
firebase = pyrebase.initialize_app(firebaseConfig)
db = firebase.database()

# Function to simulate controlling a smart home device
def control_device(device_name, action):
    print(f"Performing action: {action} on {device_name}")
    
    # Simulate logging the action to Firebase
    data = {
        "device": device_name,
        "action": action,
        "timestamp": time.time()
    }
    db.child("smart_home_actions").push(data)

# Example usage of the demo
control_device("Living Room Light", "Turned On")
control_device("Living Room Light", "Turned Off")

# Optionally, read data back from Firebase
actions = db.child("smart_home_actions").get()
print("Logged Actions: ", actions.val())