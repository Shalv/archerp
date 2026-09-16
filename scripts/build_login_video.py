import subprocess, os

images = [
    '/app/applet/src/assets/images/cement_pour_macro_1789549128682.jpg',
    '/app/applet/src/assets/images/concrete_slab_rebar_1789549142660.jpg',
    '/app/applet/src/assets/images/steel_frame_structure_1789549158028.jpg',
    '/app/applet/src/assets/images/modern_villa_exterior_1789549171847.jpg',
    '/app/applet/src/assets/images/interior_dimension_glass_1789549189481.jpg',
    '/app/applet/src/assets/images/cement_pour_macro_1789549128682.jpg'
]

# Create 5 video segments with slow subtle Ken Burns zoom
seg_files = []
for i in range(5):
    img = images[i]
    seg_out = f'/tmp/seg_{i}.mp4'
    seg_files.append(seg_out)
    
    # alternate subtle zoom in / zoom out
    if i % 2 == 0:
        zoom_filter = "zoompan=z='min(zoom+0.0006,1.06)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=75:s=1920x1080:fps=30"
    else:
        zoom_filter = "zoompan=z='if(lte(zoom,1.0),1.06,max(1.001,zoom-0.0006))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=75:s=1920x1080:fps=30"

    cmd = [
        'ffmpeg', '-y', '-loop', '1', '-i', img,
        '-vf', zoom_filter,
        '-t', '2.5',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
        seg_out
    ]
    subprocess.run(cmd, check=True)

# Now join the 5 segments with xfade (offset = 2.0s, duration = 0.5s for each transition)
# seg 0: 0.0 - 2.5s
# xfade 0+1 at 2.0s (len 0.5s) -> out01 ends at 4.0s
# xfade out01+2 at 3.5s (len 0.5s) -> out02 ends at 5.5s
# xfade out02+3 at 5.0s (len 0.5s) -> out03 ends at 7.0s
# xfade out03+4 at 6.5s (len 0.5s) -> out04 ends at 8.5s

filter_complex = (
    "[0:v][1:v]xfade=transition=fade:duration=0.5:offset=2.0[v01];"
    "[v01][2:v]xfade=transition=fade:duration=0.5:offset=3.5[v02];"
    "[v02][3:v]xfade=transition=fade:duration=0.5:offset=5.0[v03];"
    "[v03][4:v]xfade=transition=fade:duration=0.5:offset=6.5[v04]"
)

cmd_concat = [
    'ffmpeg', '-y',
    '-i', seg_files[0],
    '-i', seg_files[1],
    '-i', seg_files[2],
    '-i', seg_files[3],
    '-i', seg_files[4],
    '-filter_complex', filter_complex,
    '-map', '[v04]',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '19',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    '/app/applet/public/videos/login-bg.mp4'
]

subprocess.run(cmd_concat, check=True)

# Also copy to dist/videos/
os.makedirs('/app/applet/dist/videos', exist_ok=True)
subprocess.run(['cp', '/app/applet/public/videos/login-bg.mp4', '/app/applet/dist/videos/login-bg.mp4'], check=True)

# Update poster to frame from the video
subprocess.run([
    'ffmpeg', '-y', '-ss', '00:00:05', '-i', '/app/applet/public/videos/login-bg.mp4',
    '-vframes', '1', '-q:v', '2', '/app/applet/public/videos/login-bg-poster.jpg'
], check=True)
subprocess.run(['cp', '/app/applet/public/videos/login-bg-poster.jpg', '/app/applet/dist/videos/login-bg-poster.jpg'], check=True)

print("SUCCESS: login-bg.mp4 generated successfully!")
