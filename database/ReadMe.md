# Database Tables
## Users
- id `UNIQUE SERIAL PRIMARY KEY` : Unique serial primary key assign to each user
- username `VARCHAR(60000)`: The username for the user 
- _password `VARCHAR(60000)` : A hash version of the users password
- json_auth_token `VARCHAR(60000)` : A hash of the authentication token tied to the users
- _timestamp `TIMESTAMP`: Timestamp of when the user was signed up

## Videos
- id `UNIQUE SERIAL PRIMARY KEY` : Unique serial primary key to identify all submitted videos
- id_account `INT` : ID of the account the videos are tied to
- videoPath `VARCHAR(60000)`: The path to the video in the MinIO bucket
- fileFormat `VARCHAR(60000)` : File format of the submitted video
- frameRate `INT` : Frame rate of the video
- videoLength `INT` : Length of the video in seconds
- frame_resolution `VARCHAR(60000)` : The resolution of the submitted video in the format of '1920x1080'
- _timestamp `TIMESTAMP`: Timestamp of when the video as submitted and added to the database

## Selected Frame
- id `INT` : The id of the frame in respect to the video it came from
- id_video `INT` : The id of the video which the frame is from
- frameNumber `INT` : The frame number from the video to help calculate - where in time the frame was from
- _timestamp `TIMESTAMP` : When the selected frame was added to the database

## Analyzed Frames
id `UNIQUE SERIAL PRIMARY KEY` : Serial unqiue id for the objects from the selected frames
id_image `INT`: ID of the image which the object was found in
objectDetected `VARCHAR(60000)` : What the object detected was
confidence : The confidence of the model that object detected is the actual object
_timestamp `TIMESTAMP` : When the object was found during the analyzing of the frame


# MinIO Buckets
## Videos
This bucket stores all of the submitted videos send from the frontend. They will be descaled for more optimal storage

## Images
This bucket will store all of the analyzed images with boxes around the objects detected in the frames
