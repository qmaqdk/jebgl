# General #
### Does JebGL run hardware accelerated or are some parts software rendered? ###
JebGL requires an OpenGL 2.0 compatible graphics card and only runs hardware accelerated; there's no software rendering. That being said JebGL does work with Mesa under e.g. Linux.

### Event listeners don't work ###
The Java applet gets all the events when it is selected, and JebGL emulates DOM events accordingly. However, in some browsers you need to click once on the page before events are caught.

### Does JebGL work with Mesa for graphics cards that don't support OpenGL ###
It does! But performance is what you'd expect. Anything with a lot of shader action isn't going to run well.

### Some of the texture images don't load ###
The image.onload is very unreliable on older browsers, and if a script depends on this for texture setup it might not always work. As a workaround you can include the images in the HTML and place them off screen. This way they're already loaded when your script needs them and you can run texture setup directly (see lessons 05 and up).

### The applet never starts after I reload the page ###
JebGL doesn't work well when sharing a JVM with a previous instance. This is the reason we set the `separate_jvm` parameter. If this bug still occurs, please let us know.

# Windows #
### Performance is sometimes bad in IE9 ###
Connect your charger. It seems that IE9 changes the minimal timeout for `setTimeout()` when running on battery.

# Linux #
### class not found com.iola.JebGL ###
This error occurs when using the icedtea-plugin Java plugin. You need to switch to Suns Java plugin instead.

### There's a gray box where the applet should be in Chrome ###
There's an issue with setting applet permissions in Chrome on Linux. If you set _always allow_ the applet wont subsequently load. Until this is fixed you can use _run once_.

# Mac #
### JebGL never shows anything in Firefox, Chrome and Opera ###
There's bug in JOGL on Mac. It only works in Safari right now.