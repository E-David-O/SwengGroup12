# Databases
## Image Metadata Database
- id : unqiue serial id of the frame/image (Cannot be NULL)
- id_video : the unique id of the video which the frame/image was from
- frame_resolution : the resolution of the frame
- timestamp : timestamp for when frame was sent into the database

## Frame Analyzer Database (Still need to add columns for)
- id : unique serial id of the frame which was analyzed
- 
- timestamp : timestamp when the frame was analyzed

## Objects Detected Database
- id : unqiue id for the individual object
- id_frame : id of the frame which the object was found in (with this we can consult the metadata db to access the video id)
- _object : object detected in from the image
- confidence : confidence of the frame analyzer of what the object is


## User Table Database (Login Info)
- id : unique serial id for the user login info
- username : string of the username with a limit of 255 characters (Cannot be NULL)
- password : string of the password with a limit of 255 characters (maybe later we will work on encrypting) (Cannot be NULL)
- json_auth_token : json authentication token which is tied to the account (Cannot be NULL)
- timestamp : when was the account was created (Cannot be NULL)

## Access Table Database (Who Logs in)
- id : unique serial id for each instance of the login attempts (Cannot be NULL)
- success : was the signin successful (TRUE or FALSE)
- id_of_account : the id of the account that was attempted be accessed (Can be NULL as if they input the wrong username)
- timestamp : timestamp of this action

## Event Database (Actions happening throughout the project)
- Maybe will implement later
