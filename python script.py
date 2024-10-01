import os
import time

# Path to the text file you want to monitor
file_path = "your_file.txt"

# Get the initial modification time
last_mod_time = os.path.getmtime(file_path)

while True:
    # Get the current modification time
    current_mod_time = os.path.getmtime(file_path)
    
    # Check if the file has been updated
    if current_mod_time != last_mod_time:
        print(f"{file_path} has been updated.")
        
        # Update last_mod_time to the current one
        last_mod_time = current_mod_time
    
    # Wait for 5 seconds before checking again
    time.sleep(5)