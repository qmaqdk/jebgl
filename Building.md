# Get the source #
However you want to deploy JebGL you need the latest code
```
svn checkout http://jebgl.googlecode.com/svn/trunk/ jebgl
```
or a release (e.g. 0.1)
```
svn checkout http://jebgl.googlecode.com/svn/releases/0.1/ jebgl
```

# Building JebGL #
In the newly created `jebgl` directory run the following:
```
make
```
You should now have a jebgl.jar in your directory.
**Note**: Release 0.1 didn't include the `webstart` directory in svn, so you need to download it separately. You can find it at http://jebgl.googlecode.com/svn/webstart

# Testing your build #
## Testing with remote jar files ##
**Note**: this does not work in Safari. Safari needs the jars coming from the same origin, see below.

Point your browser to `file:///path/to/jebgl/test-googlecode/test.html`. If all went well you should now see an oscillating red/blue pattern.

## Testing with all jar files local ##
Run the following command in the `jebgl` directory:
```
python -m SimpleHTTPServer 1080
```
This starts a HTTP server in your current directory. Now point your browser to http://localhost:1080/test-local/test.html.

**Note**: This only works from your local machine, as the `test.html` uses local JNLP-files which must have absolute URIs, in our case set to `localhost:1080`