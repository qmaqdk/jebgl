### About ###
JebGL is a piece of Javascript which lets you run your WebGL apps in browsers lacking WebGL support without having to modify your existing code! Behind the scenes JebGL uses a fallback Java applet to emulate the WebGL canvas if needed, and the Java applet runs hardware accelerated on all platforms using [JOGL](http://jogamp.org/jogl/www/).

![![](http://jebgl.com/media/img/jebgl-ie6-small.jpg)](http://jebgl.com/media/img/jebgl-ie6.jpg)

Video of [IE6 running WebGL content](http://www.youtube.com/watch?v=I45qtFak_Ew).
### Usage ###
See [Usage](http://code.google.com/p/jebgl/wiki/Usage). Essentially, all you need to do is include the `jebgl.js`, and change the function that runs after the page has loaded. E.g. if you call `drawHandler()` you would instead call `jebgl(canvasElement, drawHandler)`. JebGL checks if your browser supports WebGL, and if not it replaces the canvas with the JebGL applet.

### Compatibility ###
JebGL is still work in progress, and there are some known performance issues and bugs. So far the JebGL applet works in the following browsers:

  * Windows: IE9, IE8, IE7, IE6 (!), Firefox, Chrome, Opera
  * Mac: Safari, Firefox, Chrome
  * Linux: Firefox, Chrome, Opera, Epiphany

Firefox, Chrome, Opera and Safari 5.1 are lacking on Mac because of a [bug](https://jogamp.org/bugzilla/show_bug.cgi?id=497) in JOGL. And Safari is lacking on Windows because of a Java/Javascript security issue.

### Demos ###
The following demos are based on the [Learning WebGL lessons](http://learningwebgl.com/blog/?page_id=1217) by Giles Thomas. Small changes have been made to support older browsers.
**Note**: The lessons always runs the applet so you can try it out.
  * [lesson01](http://jebgl.com/examples/lesson01)
  * [lesson02](http://jebgl.com/examples/lesson02)
  * [lesson03](http://jebgl.com/examples/lesson03)
  * [lesson04](http://jebgl.com/examples/lesson04)
  * [lesson05](http://jebgl.com/examples/lesson05)
  * [lesson06](http://jebgl.com/examples/lesson06)
  * [lesson07](http://jebgl.com/examples/lesson07)
  * [lesson08](http://jebgl.com/examples/lesson08)
  * [lesson09](http://jebgl.com/examples/lesson09)
  * [lesson10](http://jebgl.com/examples/lesson10)
  * [lesson11](http://jebgl.com/examples/lesson11)
  * [lesson12](http://jebgl.com/examples/lesson12)
  * [lesson13](http://jebgl.com/examples/lesson13)
  * [lesson14](http://jebgl.com/examples/lesson14)
  * [lesson15](http://jebgl.com/examples/lesson15)
  * [lesson16](http://jebgl.com/examples/lesson16)

### Who's behind this? ###
JebGL was started and is being maintained by Martin Qvist, sponsored by [IOLA](http://www.iola.dk/), an agile little Danish web-development house. If you need commercial support, you're welcome to contact us - read more [here](http://www.iola.dk/jebgl-consulting/). And if you like the project please consider donating. The more money that's in the pool, the more time we can spend on developing JebGL.

[![](https://www.paypal.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=AD2TLBRRSHTE8)