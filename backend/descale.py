import tempfile, os
import moviepy.editor
from frameselect import select_frames

def start_descale(video):
    
    # empty temp file
    tf = tempfile.NamedTemporaryFile()
    # video contents
    out = video
    # add video contents to empty file
    tf.write(out.read())
    # create audio from temp video file
    vid = moviepy.editor.VideoFileClip(tf.name)
    vid_resized = vid.resize(height=360) # make the height 360px ( According to moviePy documenation The width is then computed so that the width/height ratio is conserved.)
    tf.close()

    # write audio to the file
    tf_path = tempfile.gettempdir() + f"/{video.name}.mp4"
    vid_resized.write_video_file(tf_path)

    # save file to mongo
    f = open(tf_path, "rb")
    select_frames(f.read())
    f.close()
    os.remove(tf_path)

  
