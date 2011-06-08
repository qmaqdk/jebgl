all : jebgl.java
	javac -d . -classpath "../jogl/build/jar/jogl.all.jar:../jogl/build/jar/nativewindow.all.jar:../gluegen/build/gluegen-rt.jar" JebGL.java
	jar cf jebgl.jar com

clean : 
	rm -r com
	rm jebgl.jar
