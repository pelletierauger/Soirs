ffmpeg -y -f image2 -framerate 24 \
-i /Volumes/Volumina/frames/grimoire/bouleaux/bouleaux-%05d.png \
-c:v libx264 -x264-params "keyint=15:no-deblock=1" -pix_fmt yuv420p \
-sws_flags spline+accurate_rnd+full_chroma_int \
-vf "colorspace=bt709:iall=bt601-6-625:fast=1" \
-color_range 1 -colorspace 1 -color_primaries 1 -color_trc 1 \
-crf 21 -preset medium \
-threads 1 \
-shortest /Volumes/Volumina/video-renders/grimoire/bouleaux-crf21.mp4


ffmpeg -y -f image2 -framerate 24 \
-i /Volumes/Volumina/frames/grimoire/bouleaux-bw/bouleaux-%05d.png \
-c:v libx264 -x264-params "keyint=15:no-deblock=1" -pix_fmt yuv420p \
-sws_flags spline+accurate_rnd+full_chroma_int \
-vf "colorspace=bt709:iall=bt601-6-625:fast=1" \
-color_range 1 -colorspace 1 -color_primaries 1 -color_trc 1 \
-crf 21 -preset medium \
-threads 1 \
-shortest /Volumes/Volumina/video-renders/grimoire/bouleaux-bw-crf21.mp4


ffmpeg -y -f image2 -framerate 24 \
-i /Volumes/Volumina/frames/grimoire/bouleaux-ora/bouleaux-%05d.png \
-c:v libx264 -x264-params "keyint=15:no-deblock=1" -pix_fmt yuv420p \
-sws_flags spline+accurate_rnd+full_chroma_int \
-vf "colorspace=bt709:iall=bt601-6-625:fast=1" \
-color_range 1 -colorspace 1 -color_primaries 1 -color_trc 1 \
-crf 21 -preset medium \
-threads 1 \
-shortest /Volumes/Volumina/video-renders/grimoire/bouleaux-ora-crf21.mp4


ffmpeg -y -f image2 -framerate 24 \
-i /Volumes/Volumina/frames/baumes/chandelle/chandelle-%05d.png \
-c:v libx264 -x264-params "keyint=15:no-deblock=1" -pix_fmt yuv420p \
-sws_flags spline+accurate_rnd+full_chroma_int \
-vf "colorspace=bt709:iall=bt601-6-625:fast=1" \
-color_range 1 -colorspace 1 -color_primaries 1 -color_trc 1 \
-crf 21 -preset ultrafast \
-threads 1 \
-shortest /Volumes/Volumina/video-renders/baumes/chandelle-crf21.mp4


ffmpeg -y -f image2 -framerate 24 \
-i /Volumes/Volumina/frames/baumes/chandelle2/chandelle2-%05d.png \
-c:v libx264 -x264-params "keyint=15:no-deblock=1" -pix_fmt yuv420p \
-sws_flags spline+accurate_rnd+full_chroma_int \
-vf "colorspace=bt709:iall=bt601-6-625:fast=1" \
-color_range 1 -colorspace 1 -color_primaries 1 -color_trc 1 \
-crf 21 -preset ultrafast \
-threads 1 \
-shortest /Volumes/Volumina/video-renders/baumes/chandelle2-crf21.mp4


ffmpeg -f concat -safe 0 -r 24 \
-i /Users/guillaumepelletier/Desktop/Dropbox/Art/p5/soirs/chandelles-montage.txt \
-c:v libx264 -x264-params "keyint=15:no-deblock=1" -pix_fmt yuv420p \
-sws_flags spline+accurate_rnd+full_chroma_int \
-vf "colorspace=bt709:iall=bt601-6-625:fast=1" \
-color_range 1 -colorspace 1 -color_primaries 1 -color_trc 1 \
-crf 21 -preset ultrafast \
-threads 1 \
 /Volumes/Volumina/video-renders/baumes/chandelles-crf21.mp4


 ——————————————————————————————————

ffmpeg -y -f image2 -framerate 24 \
-i /Volumes/Volumina/frames/baumes/voyante2/voyante-%05d.png \
-c:v libx264 -x264-params "keyint=15:no-deblock=1" -pix_fmt yuv420p \
-sws_flags spline+accurate_rnd+full_chroma_int \
-vf "colorspace=bt709:iall=bt601-6-625:fast=1" \
-color_range 1 -colorspace 1 -color_primaries 1 -color_trc 1 \
-crf 21 -preset ultrafast \
-threads 1 \
-shortest /Volumes/Volumina/video-renders/baumes/voyante2-crf21.mp4


————————————————————————————————————————————————————————————————————

ffmpeg -y -f image2 -framerate 24 \
-i /Volumes/Volumina/frames/baumes/chandelle2b/chandelle2b-%05d.png \
-c:v libx264 -x264-params "keyint=15:no-deblock=1" -pix_fmt yuv420p \
-sws_flags spline+accurate_rnd+full_chroma_int \
-vf "colorspace=bt709:iall=bt601-6-625:fast=1" \
-color_range 1 -colorspace 1 -color_primaries 1 -color_trc 1 \
-crf 21 -preset ultrafast \
-threads 1 \
-shortest /Volumes/Volumina/video-renders/baumes/chandelle2b-crf21.mp4


————————————————————————————————————————————————————————————————————


ffmpeg -y -f concat -safe 0 -r 24 \
-i /Users/guillaumepelletier/Desktop/Dropbox/Art/p5/soirs/baumes-montage.txt \
-c:v libx264 -x264-params "keyint=15:no-deblock=1" -pix_fmt yuv420p \
-sws_flags spline+accurate_rnd+full_chroma_int \
-vf "colorspace=bt709:iall=bt601-6-625:fast=1" \
-color_range 1 -colorspace 1 -color_primaries 1 -color_trc 1 \
-crf 21 -preset ultrafast \
-threads 1 \
 /Volumes/Volumina/video-renders/baumes/montage2b-crf21.mp4


