import matplotlib.animation as animation
# for animation
# for gif
#sudo apt install imagemagick
# for mp4
#sudo apt-get install ffmpeg



def SaveVideo(ha,fname,time):
	ani = animation.FuncAnimation(ha.figure,
		singleframe, fargs=(ha,time,),
		frames=len(ha.lines),
		interval=300, repeat=False)
#
	ani.save(fname, writer='imagemagick', fps=20)

#	writer = animation.ImageMagickWriter(fps=20, bitrate=300)
#	writer.frame_format = 'png'
#	ani.save(filename='../lines.gif', writer=writer)

#	writer = animation.FFMpegWriter(fps=30, codec='libx264')  #or 
#	writer = animation.FFMpegWriter(fps=20, metadata=dict(artist='Me'), bitrate=1800)
#	writer = animation.writers['ffmpeg'](fps=20)
#	ani.save('../lines.gif', writer=writer,dpi=100)

def singleframe(i,ha,time):
	clear_temporal(ha)
	ha.lines[i].set_linestyle('-')
	ha.set_title (("temporal evolution, t=%5.3f" % time[i]), fontsize=16)

def clear_temporal(ha):
	for l in ha.lines:
		l.set_linestyle('None')

