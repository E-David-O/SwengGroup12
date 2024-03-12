CREATE TABLE IF NOT EXISTS Users (
                id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                username VARCHAR(255) NOT NULL,
                _password VARCHAR(255) NOT NULL,
                json_auth_token VARCHAR(255) NOT NULL,
                _timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

CREATE TABLE IF NOT EXISTS Videos (
                id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                id_account INT,
                videoLink VARCHAR(255) NOT NULL,
                videoPath VARCHAR(255),
                fileFormat VARCHAR(255),
                frameRate INT,
                videoLength VARCHAR(255),
                frame_resolution VARCHAR(255),
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
                id_image VARCHAR(255),
                objectDetected VARCHAR(255),
                confidence FLOAT,
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
--                 username VARCHAR(255) NOT NULL,
--                 _password VARCHAR(255) NOT NULL,
--                 json_auth_token VARCHAR(255) NOT NULL,
--                 _timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                
--             );

-- CREATE TABLE IF NOT EXISTS Video_Table (
--                 id SERIAL PRIMARY KEY UNIQUE NOT NULL,
--                 id_account INT NOT NULL REFERENCES User_Table (id),
--                 video_link VARCHAR(255) NOT NULL,
--                 _timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
--             );

-- CREATE TABLE IF NOT EXISTS Image_Metadata (
--                 id SERIAL PRIMARY KEY UNIQUE NOT NULL,
--                 id_video INT NOT NULL REFERENCES Video_Table (id),
--                 frame_resolution VARCHAR(255) NOT NULL DEFAULT '1920x1080',
--                 _timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
--             );


-- CREATE TABLE IF NOT EXISTS Analyzed_Frames (
--                 id SERIAL PRIMARY KEY UNIQUE NOT NULL,
--                 id_image VARCHAR(255) NOT NULL REFERENCES Image_Metadata (id),
--                 _timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
--             );


-- CREATE TABLE IF NOT EXISTS Access_Table (
--                 id SERIAL PRIMARY KEY UNIQUE NOT NULL,
--                 _success BOOL NOT NULL,
--                 id_account INT NOT NULL REFERENCES User_Table (id),
--                 _timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );




