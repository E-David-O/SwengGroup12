CREATE TABLE IF NOT EXISTS Users (
                id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                username VARCHAR(60000) NOT NULL,
                _password VARCHAR(60000) NOT NULL,
                json_auth_token VARCHAR(60000) NOT NULL,
                _timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

CREATE TABLE IF NOT EXISTS Videos (
                id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                id_account INT,
                videoPath VARCHAR(60000),
                fileFormat VARCHAR(60000),
                frameRate INT,
                videoLength INT,
                frame_resolution VARCHAR(60000),
                _timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

CREATE TABLE IF NOT EXISTS SelectedFrame (
                id INT,
                id_video INT,
                frameNumber INT,
                _timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );


CREATE TABLE IF NOT EXISTS AnalyzedFrames (
                id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                id_image VARCHAR(60000),
                objectDetected VARCHAR(60000),
                confidence FLOAT,
                framePath VARCHAR(60000),
                _timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );


CREATE TABLE IF NOT EXISTS AccessLog (
                id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                _success BOOL NOT NULL,
                id_account INT NOT NULL REFERENCES User_Table (id),
                _timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );





-- CREATE TABLE IF NOT EXISTS User_Table (
--                 id SERIAL PRIMARY KEY UNIQUE NOT NULL,
--                 username VARCHAR(60000) NOT NULL,
--                 _password VARCHAR(60000) NOT NULL,
--                 json_auth_token VARCHAR(60000) NOT NULL,
--                 _timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                
--             );

-- CREATE TABLE IF NOT EXISTS Video_Table (
--                 id SERIAL PRIMARY KEY UNIQUE NOT NULL,
--                 id_account INT NOT NULL REFERENCES User_Table (id),
--                 video_link VARCHAR(60000) NOT NULL,
--                 _timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
--             );

-- CREATE TABLE IF NOT EXISTS Image_Metadata (
--                 id SERIAL PRIMARY KEY UNIQUE NOT NULL,
--                 id_video INT NOT NULL REFERENCES Video_Table (id),
--                 frame_resolution VARCHAR(60000) NOT NULL DEFAULT '1920x1080',
--                 _timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
--             );


-- CREATE TABLE IF NOT EXISTS Analyzed_Frames (
--                 id SERIAL PRIMARY KEY UNIQUE NOT NULL,
--                 id_image VARCHAR(60000) NOT NULL REFERENCES Image_Metadata (id),
--                 _timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
--             );


-- CREATE TABLE IF NOT EXISTS Access_Table (
--                 id SERIAL PRIMARY KEY UNIQUE NOT NULL,
--                 _success BOOL NOT NULL,
--                 id_account INT NOT NULL REFERENCES User_Table (id),
--                 _timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );




