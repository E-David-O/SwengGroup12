# The gateway API

## Available endpoints

### POST /upload
Upload a video to be analyzed. Returns the video id of the video for future references.
RETURNS:
{
	"video-id": "",
}
ERRORS:
This operation might fail if insufficient storage exists on the server.

### GET /frames/{video-id}
Returns a list of frame ids that were selected from the video associated with the video id.
RETURNS:
{
	"frames": [],
}
ERRORS:
Fails if invalid video-id supplied. Empty response if no frames have been analysed yet.

### GET /results/{video-id}
Returns both the frame-wise and average analysis result of the image analysis.
RETURNS:
{
	"total-score": [ LIST OF PARAMETERS ],
	"frame-scores: [
		{ "frame": FRAME_NUM, "score": [ PAREMETERS ] },
	],
}
ERRORS:
Fails if invalid video id given. "total-score" null if entire video has not been processed yet. "frame-scores" gives the results of the frames that have been analysed, thereby allowing the calculation of a running average of scores from client.
