all : jebgl.java
	javac -d . -classpath "webstart/jogl.all.jar:webstart/nativewindow.all.jar:webstart/gluegen-rt.jar" JebGL.java
	jar cf jebgl.jar com

clean : 
	rm -r com
	rm jebgl.jar
