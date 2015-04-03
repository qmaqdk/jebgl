# Using JebGL #
## Quick start ##
Include `jebgl.js`
```
<script type="text/javascript" src="http://jebgl.googlecode.com/files/jebgl-0.1.js"></script>
```
and call `jebgl()` with the canvas element and the callback function that starts your code. E.g. using JQuery you would change
```
<script type="text/javascript">
  $(function() {
    var context = $("#canvas").get(0).getContext("experimental-webgl");
    drawHandler(context);
  });
</script>
```
to
```
<script type="text/javascript" src="http://jebgl.googlecode.com/files/jebgl-0.1.js"></script>
<script type="text/javascript">
  $(function() {
    jebgl($("#canvas").get(0), function() {
      var context = $("#canvas").get(0).getContext("experimental-webgl");
      drawHandler(context);
    });
  });
</script>
```
The `jebgl()` function checks if WebGL is natively supported, and if not replaces the canvas element with a JebGL applet.

Only the WebGL related code needs to be called inside the `jebgl()` function.

**Note**: The above is only for testing, since the jar and js files are hosted on `jebgl.googlecode.com`. Because of a Javascript security issue this also means that it won't work in Safari. For these reasons we strongly recommend you host the files yourself (see below).

## Host the JebGL jars and js ##
To host the JebGL jars and js on your own site you need to change a couple of parameters to reflect where the jars are located. In addition you need to change the following jnlp-files:
```
jogl-core.jnlp
nativewindow.jnlp
gluegen-rt.jnlp
```
You can get them from `http://jebgl.googlecode.com/svn/webstart`. You need to change the line
```
<jnlp codebase="http://jebgl.googlecode.com/svn/webstart/"
```
and any references to other jnlp-files
```
<extension name="gluegen-rt"   href="http://jebgl.googlecode.com/svn/webstart/gluegen-rt.jnlp" />
```
to reflect where the files are located on your site. Due to the security model of jnlp files these URLs _must_ be absolute.

You also need to download the applet-launcher and the native jar-files (these are the ones the jnlp-files reference)
```
applet-launcher.jar
jogl.all.jar
nativewindow.all.jar
gluegen-rt.jar
jogl-natives-linux-amd64.jar
jogl-natives-linux-i586.jar
jogl-natives-macosx-universal.jar
jogl-natives-windows-amd64.jar
jogl-natives-windows-i586.jar
nativewindow-natives-linux-amd64.jar
nativewindow-natives-linux-i586.jar
nativewindow-natives-macosx-universal.jar
nativewindow-natives-windows-amd64.jar
nativewindow-natives-windows-i586.jar
gluegen-rt-natives-linux-amd64.jar
gluegen-rt-natives-linux-i586.jar
gluegen-rt-natives-macosx-universal.jar
gluegen-rt-natives-windows-amd64.jar
gluegen-rt-natives-windows-i586.jar
```
These can also be found in `http://jebgl.googlecode.com/svn/webstart`.

Finally, you need to let JebGL know where the jar and jnlp files are by setting the `jebglJar`, `jarLocation`, and `jnlpLocation` settings:
```
<script type="text/javascript" src="http://jebgl.googlecode.com/files/jebgl-0.1.js"></script>
<script type="text/javascript">
  $(function() {
    jebgl($("#canvas").get(0), function() {
      var context = $("#canvas").get(0).getContext("experimental-webgl");
      drawHandler(context);
    }, {
      jebglJar: "url/to/jebgl-0.1.jar",
      jarLocation: "url/to/folder/containing/all/other/jars/above",
      jnlpLocation: "http://absolute/url/to/jnlp/files/above"
    });
  });
</script>
```
The URL to the jnlp files _must_ be absolute; JebGL uses [applet-launcher](http://java.net/projects/applet-launcher) which will not accept relative URLs both to and within the jnlp files.