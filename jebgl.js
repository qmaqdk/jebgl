/*!
 * JebGL - Java emulated WebGL canvas v0.1
 * http://jebgl.com/
 *
 * Copyright (c) 2011 IOLA and Martin Qvist
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

 (function() {
     
     /*
      * Make fake ArrayBuffer and typed arrays for browsers that don't know
      * them. Note: these only appear like typed arrays. You can't share 
      * ArrayBuffers and you can't do interleaved array types. They are 
      * mainly used to tell the Java applet how to store the data.
      * 
      * Reference: https://www.khronos.org/registry/typedarray/specs/1.0/
      */

     if (typeof(ArrayBuffer) == "undefined") {
         window.ArrayBuffer = function(length) {
             if (typeof(length) == "undefined" || length == null) {
                // Argument is not optional per spec, but this is what FF4 does.
                 this.byteLength = 0;
             } else {
                 if (length < 0 || length >= Math.pow(2,31)) 
                     throw new RangeError("invalid array length");
                 this.byteLength = length;
             }
         }
     }

     // TypedArray base type
     TypedArray = function(a, b, c) {
         if (typeof(a) == "undefined") {
             // Argument is not optional per spec, but this is what FF4 does.
             this.buffer = new ArrayBuffer();
             this.byteOffset = 0;
             this.byteLength = 0;
             this.length = 0;
         } else if (a == null) {
             // Should throw error according to Khronos conformance test
             throw new Error("invalid arguments");
         } else if (a instanceof ArrayBuffer) {
             if (a.byteLength % this.BYTES_PER_ELEMENT != 0) 
                 throw new Error("invalid arguments");
             this.buffer = a;
             if (typeof(b) != "undefined") {
                 if (b < 0 || b > a.byteLength || b % this.BYTES_PER_ELEMENT != 0) throw new Error("invalid arguments");
                 this.byteOffset = b;
             } else {
                 this.byteOffset = 0;
             }
             if (typeof(c) != "undefined") {
                 if (c < 0 || c > a.byteLength) throw new Error("invalid arguments");
                 this.length = c;
             } else {
                 this.length = a.byteLength / this.BYTES_PER_ELEMENT;
             }
             this.byteLength = this.length * this.BYTES_PER_ELEMENT;
         } else if (a instanceof TypedArray) {
             this.buffer = a.buffer;
             for (var i=0, l=a.length; i<l; i++)
                 this[i] = this.convert(a[i]);
             this.length = a.length;
             this.byteOffset = 0;
             this.byteLength = this.length * this.BYTES_PER_ELEMENT;
         } else if (a instanceof Array) {
             this.buffer = new ArrayBuffer(a.length * this.BYTES_PER_ELEMENT);
             this.byteOffset = 0;
             this.byteLength = this.buffer.byteLength;
             this.length = a.length;
             for (var i=0, l=a.length; i<l; i++)
                 this[i] = this.convert(a[i]);
         } else {
             // Assume a is a number
             if (a < 0) throw new Error("invalid arguments");
             this.length = a;
             this.byteLength = this.length * this.BYTES_PER_ELEMENT;
             if (this.byteLength >= Math.pow(2,31)) 
                 throw new Error("size and count too large");
             this.buffer = new ArrayBuffer(this.byteLength);
             this.byteOffset = 0;
             // Initialize to zero
             for (var i=0; i<this.length; i++)
                 this[i] = 0;
         }
     }
     TypedArray.prototype = {
         set: function(a, offset) {
             if (a instanceof TypedArray || a instanceof Array) {
                 var begin = 0;
                 if (typeof(offset) != "undefined")
                     begin = offset;
                 if (begin + a.length > this.length || begin < 0) 
                     throw new Error("invalid arguments");
                 for (var i=0, l=a.length; i<l; i++)
                     this[i+begin] = this.convert(a[i]);
             } else {
                 throw new Error("invalid arguments");
             }
         },
         subarray: function(begin, end) {
             if (begin < 0) begin = this.length + begin;
             if (typeof(end) == "undefined") 
                 var end = this.length;
             if (end < 0) end = this.length + end;
             if (end > this.length) end = this.length;
             if (begin < 0) begin = 0;
             var o;
             if (end < begin) {
                 o = new this.constructor(0);
             } else {
                 o = new this.constructor(end - begin);
             }
             for (var i=begin; i<end; i++) 
                 o[i - begin] = this[i];
             return o;
         }
     }

     function toInt(v) {
         if (v < 0) {
             return -1*Math.floor(-1*v);
         } else {
             return Math.floor(v);
         }
     }

    if (typeof(Int8Array) == "undefined") {
        window.Int8Array = function(a, b, c) {
            TypedArray.apply(this, arguments);
        }
        Int8Array.prototype = new TypedArray();
        Int8Array.BYTES_PER_ELEMENT = 1;
        Int8Array.prototype.BYTES_PER_ELEMENT = 1;
        Int8Array.prototype.constructor = Int8Array;
        Int8Array.prototype.convert = toInt;
    }

    if (typeof(Uint8Array) == "undefined") {
        window.Uint8Array = function(a, b, c) {
            TypedArray.apply(this, arguments);
        }
        Uint8Array.prototype = new TypedArray();
        Uint8Array.BYTES_PER_ELEMENT = 1;
        Uint8Array.prototype.BYTES_PER_ELEMENT = 1;
        Uint8Array.prototype.constructor = Uint8Array;
        Uint8Array.prototype.convert = toInt;
    }

    if (typeof(Int16Array) == "undefined") {
        window.Int16Array = function(a, b, c) {
            TypedArray.apply(this, arguments);
        }
        Int16Array.prototype = new TypedArray();
        Int16Array.BYTES_PER_ELEMENT = 2;
        Int16Array.prototype.BYTES_PER_ELEMENT = 2;
        Int16Array.prototype.constructor = Int16Array;
        Int16Array.prototype.convert = toInt;
    }

    if (typeof(Uint16Array) == "undefined") {
        window.Uint16Array = function(a, b, c) {
            TypedArray.apply(this, arguments);
        }
        Uint16Array.prototype = new TypedArray();
        Uint16Array.BYTES_PER_ELEMENT = 2;
        Uint16Array.prototype.BYTES_PER_ELEMENT = 2;
        Uint16Array.prototype.constructor = Uint16Array;
        Uint16Array.prototype.convert = toInt;
    }

    if (typeof(Int32Array) == "undefined") {
        window.Int32Array = function(a, b, c) {
            TypedArray.apply(this, arguments);
        }
        Int32Array.prototype = new TypedArray();
        Int32Array.BYTES_PER_ELEMENT = 4;
        Int32Array.prototype.BYTES_PER_ELEMENT = 4;
        Int32Array.prototype.constructor = Int32Array;
        Int32Array.prototype.convert = toInt;
    }

    if (typeof(Uint32Array) == "undefined") {
        window.Uint32Array = function(a, b, c) {
            TypedArray.apply(this, arguments);
        }
        Uint32Array.prototype = new TypedArray();
        Uint32Array.BYTES_PER_ELEMENT = 4;
        Uint32Array.prototype.BYTES_PER_ELEMENT = 4;
        Uint32Array.prototype.constructor = Uint32Array;
        Uint32Array.prototype.convert = toInt;
    }

    if (typeof(Float32Array) == "undefined") {
        window.Float32Array = function(a, b, c) {
            TypedArray.apply(this, arguments);
        }
        Float32Array.prototype = new TypedArray();
        Float32Array.BYTES_PER_ELEMENT = 4;
        Float32Array.prototype.BYTES_PER_ELEMENT = 4;
        Float32Array.prototype.constructor = Float32Array;
        Float32Array.prototype.convert = function(a) { return a;};
    }

    if (typeof(Float64Array) == "undefined") {
        window.Float64Array = function(a, b, c) {
            TypedArray.apply(this, arguments);
        }
        Float64Array.prototype = new TypedArray();
        Float64Array.BYTES_PER_ELEMENT = 8;
        Float64Array.prototype.BYTES_PER_ELEMENT = 8;
        Float64Array.prototype.constructor = Float64Array;
        Float64Array.prototype.convert = function(a) { return a;};
    }

    /*
     * JebGL versions of WebGL objects
     */
    
    function JebGLBuffer(id) {
        this.id = id;
    }
    
    JebGLBuffer.prototype = {
        type: "Emulated WebGLBuffer"
    }

    function JebGLFramebuffer(id) {
        this.id = id;
    }

    JebGLFramebuffer.prototype = {
        type: "Emulated WebGLFramebuffer"
    }

    function JebGLProgram(id) {
        this.id = id;
    }
    
    JebGLProgram.prototype = {
        type: "Emulated WebGLProgram"
    }

    function JebGLRenderbuffer(id) {
        this.id = id;
    }

    JebGLRenderbuffer.prototype = {
        type: "Emulated WebGLRenderbuffer"
    }

    function JebGLShader(id) {
        this.id = id;
    }

    JebGLShader.prototype = {
        type: "Emulated WebGLShader"
    }

    function JebGLTexture(id) {
        this.id = id;
    }

    JebGLTexture.prototype = {
        type: "Emulated WebGLTexture"
    }

    function JebGLUniformLocation(id) {
        this.id = id;
    }

    JebGLUniformLocation.prototype = {
        type: "Emulated WebGLUniformLocation"
    }

    function JebGLActiveInfo(size, type, name) {
        this.size = size;
        this.type = type;
        this.name = name;
    }

    JebGLActiveInfo.prototype = {
        type: "Emulated WebGLActiveInfo"
    }

    function JebGLRenderingContext(applet) {
        // Store applet as canvas and get the actual JebGL applet
        this.JebApp = applet.getSubApplet();
        
        /* Get all WebGL enums from applet, cf
         * http://www.khronos.org/registry/webgl/specs/latest/#5.13
         */
        var glEnums = [
            /* ClearBufferMask */
            "DEPTH_BUFFER_BIT",
            "STENCIL_BUFFER_BIT",
            "COLOR_BUFFER_BIT",
            /* BeginMode */
            "POINTS",
            "LINES",
            "LINE_LOOP",
            "LINE_STRIP",
            "TRIANGLES",
            "TRIANGLE_STRIP",
            "TRIANGLE_FAN",
            /* BlendingFactorDest */
            "ZERO",
            "ONE",
            "SRC_COLOR",
            "ONE_MINUS_SRC_COLOR",
            "SRC_ALPHA",
            "ONE_MINUS_SRC_ALPHA",
            "DST_ALPHA",
            "ONE_MINUS_DST_ALPHA",
            /* BlendingFactorSrc */
            "DST_COLOR",
            "ONE_MINUS_DST_COLOR",
            "SRC_ALPHA_SATURATE",
            /* BlendEquationSeparate */
            "FUNC_ADD",
            "BLEND_EQUATION",
            "BLEND_EQUATION_RGB",
            "BLEND_EQUATION_ALPHA",
            /* BlendSubtract */
            "FUNC_SUBTRACT",
            "FUNC_REVERSE_SUBTRACT",
            /* Separate Blend Functions */
            "BLEND_DST_RGB",
            "BLEND_SRC_RGB",
            "BLEND_DST_ALPHA",
            "BLEND_SRC_ALPHA",
            "CONSTANT_COLOR",
            "ONE_MINUS_CONSTANT_COLOR",
            "CONSTANT_ALPHA",
            "ONE_MINUS_CONSTANT_ALPHA",
            "BLEND_COLOR",
            /* Buffer Objects */
            "ARRAY_BUFFER",
            "ELEMENT_ARRAY_BUFFER",
            "ARRAY_BUFFER_BINDING",
            "ELEMENT_ARRAY_BUFFER_BINDING",
            "STREAM_DRAW",
            "STATIC_DRAW",
            "DYNAMIC_DRAW",
            "BUFFER_SIZE",
            "BUFFER_USAGE",
            "CURRENT_VERTEX_ATTRIB",
            /* CullFaceMode */
            "FRONT",
            "BACK",
            "FRONT_AND_BACK",
            /* EnableCap */
            "CULL_FACE",
            "BLEND",
            "DITHER",
            "STENCIL_TEST",
            "DEPTH_TEST",
            "SCISSOR_TEST",
            "POLYGON_OFFSET_FILL",
            "SAMPLE_ALPHA_TO_COVERAGE",
            "SAMPLE_COVERAGE",
            /* ErrorCode */
            "NO_ERROR",
            "INVALID_ENUM",
            "INVALID_VALUE",
            "INVALID_OPERATION",
            "OUT_OF_MEMORY",
            /* FrontFaceDirection */
            "CW",
            "CCW",
            /* GetPName */
            "LINE_WIDTH",
            "ALIASED_POINT_SIZE_RANGE",
            "ALIASED_LINE_WIDTH_RANGE",
            "CULL_FACE_MODE",
            "FRONT_FACE",
            "DEPTH_RANGE",
            "DEPTH_WRITEMASK",
            "DEPTH_CLEAR_VALUE",
            "DEPTH_FUNC",
            "STENCIL_CLEAR_VALUE",
            "STENCIL_FUNC",
            "STENCIL_FAIL",
            "STENCIL_PASS_DEPTH_FAIL",
            "STENCIL_PASS_DEPTH_PASS",
            "STENCIL_REF",
            "STENCIL_VALUE_MASK",
            "STENCIL_WRITEMASK",
            "STENCIL_BACK_FUNC",
            "STENCIL_BACK_FAIL",
            "STENCIL_BACK_PASS_DEPTH_FAIL",
            "STENCIL_BACK_PASS_DEPTH_PASS",
            "STENCIL_BACK_REF",
            "STENCIL_BACK_VALUE_MASK",
            "STENCIL_BACK_WRITEMASK",
            "VIEWPORT",
            "SCISSOR_BOX",
            "COLOR_CLEAR_VALUE",
            "COLOR_WRITEMASK",
            "UNPACK_ALIGNMENT",
            "PACK_ALIGNMENT",
            "MAX_TEXTURE_SIZE",
            "MAX_VIEWPORT_DIMS",
            "SUBPIXEL_BITS",
            "RED_BITS",
            "GREEN_BITS",
            "BLUE_BITS",
            "ALPHA_BITS",
            "DEPTH_BITS",
            "STENCIL_BITS",
            "POLYGON_OFFSET_UNITS",
            "POLYGON_OFFSET_FACTOR",
            "TEXTURE_BINDING_2D",
            "SAMPLE_BUFFERS",
            "SAMPLES",
            "SAMPLE_COVERAGE_VALUE",
            "SAMPLE_COVERAGE_INVERT",
            /* GetTextureParameter */
            "NUM_COMPRESSED_TEXTURE_FORMATS",
            "COMPRESSED_TEXTURE_FORMATS",
            /* HintMode */
            "DONT_CARE",
            "FASTEST",
            "NICEST",
            /* HintTarget */
            "GENERATE_MIPMAP_HINT",
            /* DataType */
            "BYTE",
            "UNSIGNED_BYTE",
            "SHORT",
            "UNSIGNED_SHORT",
            "INT",
            "UNSIGNED_INT",
            "FLOAT",
            /* PixelFormat */
            "DEPTH_COMPONENT",
            "ALPHA",
            "RGB",
            "RGBA",
            "LUMINANCE",
            "LUMINANCE_ALPHA",
            /* PixelType */
            "UNSIGNED_SHORT_4_4_4_4",
            "UNSIGNED_SHORT_5_5_5_1",
            "UNSIGNED_SHORT_5_6_5",
            /* Shaders */
            "FRAGMENT_SHADER",
            "VERTEX_SHADER",
            "MAX_VERTEX_ATTRIBS",
            "MAX_VERTEX_UNIFORM_VECTORS",
            "MAX_VARYING_VECTORS",
            "MAX_COMBINED_TEXTURE_IMAGE_UNITS",
            "MAX_VERTEX_TEXTURE_IMAGE_UNITS",
            "MAX_TEXTURE_IMAGE_UNITS",
            "MAX_FRAGMENT_UNIFORM_VECTORS",
            "SHADER_COMPILER",
            "SHADER_TYPE",
            "DELETE_STATUS",
            "LINK_STATUS",
            "VALIDATE_STATUS",
            "ATTACHED_SHADERS",
            "ACTIVE_UNIFORMS",
            "ACTIVE_ATTRIBUTES",
            "SHADING_LANGUAGE_VERSION",
            "CURRENT_PROGRAM",
            /* StencilFunction */
            "NEVER",
            "LESS",
            "EQUAL",
            "LEQUAL",
            "GREATER",
            "NOTEQUAL",
            "GEQUAL",
            "ALWAYS",
            /* StencilOp */
            "KEEP",
            "REPLACE",
            "INCR",
            "DECR",
            "INVERT",
            "INCR_WRAP",
            "DECR_WRAP",
            /* StringName */
            "VENDOR",
            "RENDERER",
            "VERSION",
            /* TextureMagFilter */
            "NEAREST",
            "LINEAR",
            /* TextureMinFilter */
            "NEAREST_MIPMAP_NEAREST",
            "LINEAR_MIPMAP_NEAREST",
            "NEAREST_MIPMAP_LINEAR",
            "LINEAR_MIPMAP_LINEAR",
            /* TextureParameterName */
            "TEXTURE_MAG_FILTER",
            "TEXTURE_MIN_FILTER",
            "TEXTURE_WRAP_S",
            "TEXTURE_WRAP_T",
            /* TextureTarget */
            "TEXTURE_2D",
            "TEXTURE",
            "TEXTURE_CUBE_MAP",
            "TEXTURE_BINDING_CUBE_MAP",
            "TEXTURE_CUBE_MAP_POSITIVE_X",
            "TEXTURE_CUBE_MAP_NEGATIVE_X",
            "TEXTURE_CUBE_MAP_POSITIVE_Y",
            "TEXTURE_CUBE_MAP_NEGATIVE_Y",
            "TEXTURE_CUBE_MAP_POSITIVE_Z",
            "TEXTURE_CUBE_MAP_NEGATIVE_Z",
            "MAX_CUBE_MAP_TEXTURE_SIZE",
            /* TextureUnit */
            "TEXTURE0",
            "TEXTURE1",
            "TEXTURE2",
            "TEXTURE3",
            "TEXTURE4",
            "TEXTURE5",
            "TEXTURE6",
            "TEXTURE7",
            "TEXTURE8",
            "TEXTURE9",
            "TEXTURE10",
            "TEXTURE11",
            "TEXTURE12",
            "TEXTURE13",
            "TEXTURE14",
            "TEXTURE15",
            "TEXTURE16",
            "TEXTURE17",
            "TEXTURE18",
            "TEXTURE19",
            "TEXTURE20",
            "TEXTURE21",
            "TEXTURE22",
            "TEXTURE23",
            "TEXTURE24",
            "TEXTURE25",
            "TEXTURE26",
            "TEXTURE27",
            "TEXTURE28",
            "TEXTURE29",
            "TEXTURE30",
            "TEXTURE31",
            "ACTIVE_TEXTURE",
            /* TextureWrapMode */
            "REPEAT",
            "CLAMP_TO_EDGE",
            "MIRRORED_REPEAT",
            /* Uniform Types */
            "FLOAT_VEC2",
            "FLOAT_VEC3",
            "FLOAT_VEC4",
            "INT_VEC2",
            "INT_VEC3",
            "INT_VEC4",
            "BOOL",
            "BOOL_VEC2",
            "BOOL_VEC3",
            "BOOL_VEC4",
            "FLOAT_MAT2",
            "FLOAT_MAT3",
            "FLOAT_MAT4",
            "SAMPLER_2D",
            "SAMPLER_CUBE",
            /* Vertex Arrays */
            "VERTEX_ATTRIB_ARRAY_ENABLED",
            "VERTEX_ATTRIB_ARRAY_SIZE",
            "VERTEX_ATTRIB_ARRAY_STRIDE",
            "VERTEX_ATTRIB_ARRAY_TYPE",
            "VERTEX_ATTRIB_ARRAY_NORMALIZED",
            "VERTEX_ATTRIB_ARRAY_POINTER",
            "VERTEX_ATTRIB_ARRAY_BUFFER_BINDING",
            /* Shader Source */
            "COMPILE_STATUS",
            /* Shader Precision-Specified Types */
            "LOW_FLOAT",
            "MEDIUM_FLOAT",
            "HIGH_FLOAT",
            "LOW_INT",
            "MEDIUM_INT",
            "HIGH_INT",
            /* Framebuffer Object */
            "FRAMEBUFFER",
            "RENDERBUFFER",
            "RGBA4",
            "RGB5_A1",
            "RGB565",
            "DEPTH_COMPONENT16",
            "STENCIL_INDEX",
            "STENCIL_INDEX8",
            "DEPTH_STENCIL",
            "RENDERBUFFER_WIDTH",
            "RENDERBUFFER_HEIGHT",
            "RENDERBUFFER_INTERNAL_FORMAT",
            "RENDERBUFFER_RED_SIZE",
            "RENDERBUFFER_GREEN_SIZE",
            "RENDERBUFFER_BLUE_SIZE",
            "RENDERBUFFER_ALPHA_SIZE",
            "RENDERBUFFER_DEPTH_SIZE",
            "RENDERBUFFER_STENCIL_SIZE",
            "NONE",
            "FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE",
            "FRAMEBUFFER_ATTACHMENT_OBJECT_NAME",
            "FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL",
            "FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE",
            "FRAMEBUFFER_COMPLETE",
            "FRAMEBUFFER_INCOMPLETE_ATTACHMENT",
            "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT",
            "FRAMEBUFFER_INCOMPLETE_DIMENSIONS",
            "FRAMEBUFFER_UNSUPPORTED",
            "FRAMEBUFFER_BINDING",
            "RENDERBUFFER_BINDING",
            "MAX_RENDERBUFFER_SIZE",
            "INVALID_FRAMEBUFFER_OPERATION",
            "COLOR_ATTACHMENT0",
            "DEPTH_ATTACHMENT",
            "STENCIL_ATTACHMENT",
            "DEPTH_STENCIL_ATTACHMENT",
            /* WebGL-specific enums */
            "UNPACK_FLIP_Y_WEBGL",
            "UNPACK_PREMULTIPLY_ALPHA_WEBGL",
            "CONTEXT_LOST_WEBGL",
            "UNPACK_COLORSPACE_CONVERSION_WEBGL",
            "BROWSER_DEFAULT_WEBGL",
            /* JebGL-specific enums */
            "TRUE",
            "FALSE"
        ];

        for (var i=0, l=glEnums.length; i<l; i++) {
            if (typeof(this.JebApp["GL_" + glEnums[i]]) === "undefined")
                throw new Error("GL_" + glEnums[i] + " undefined in applet");
            this[glEnums[i]] = this.JebApp["GL_" + glEnums[i]];
        }

        /* Get all call enums from applet. These are all GL functions
     * which are safe to put in a call list, e.g. with return type void, cf. 
     * http://www.khronos.org/registry/webgl/specs/latest/#5.13, except
     * functions that have variable sized arrays as parameters, e.g. 
     * bufferData and texImage2D, and a few other exceptions 
     * (e.g. delete*, finish, flush).
     */
        var callEnums = [
            "ACTIVE_TEXTURE",
            "ATTACH_SHADER",
            "BIND_ATTRIB_LOCATION",
            "BIND_BUFFER",
            "BIND_FRAMEBUFFER",
            "BIND_RENDERBUFFER",
            "BIND_TEXTURE",
            "BLEND_COLOR",
            "BLEND_EQUATION",
            "BLEND_EQUATION_SEPARATE",
            "BLEND_FUNC",
            "BLEND_FUNC_SEPARATE",
            "CLEAR",
            "CLEAR_COLOR",
            "CLEAR_DEPTH",
            "CLEAR_STENCIL",
            "COLOR_MASK",
            "COMPILE_SHADER",
            "COPY_TEX_IMAGE_2D",
            "COPY_TEX_SUB_IMAGE_2D",
            "CULL_FACE",
            "DELETE_BUFFER",
            "DELETE_FRAMEBUFFER",
            "DELETE_PROGRAM",
            "DELETE_RENDERBUFFER",
            "DELETE_SHADER",
            "DELETE_TEXTURE",
            "DEPTH_FUNC",
            "DEPTH_MASK",
            "DEPTH_RANGE",
            "DETACH_SHADER",
            "DISABLE",
            "DISABLE_VERTEX_ATTRIB_ARRAY",
            "DRAW_ARRAYS",
            "DRAW_ELEMENTS",
            "ENABLE",
            "ENABLE_VERTEX_ATTRIB_ARRAY",
            "FRAMEBUFFER_RENDERBUFFER",
            "FRAMEBUFFER_TEXTURE_2D",
            "FRONT_FACE",
            "GENERATE_MIPMAP",
            "HINT",
            "LINE_WIDTH",
            "LINK_PROGRAM",
            "PIXEL_STOREI",
            "POLYGON_OFFSET",
            "RENDERBUFFER_STORAGE",
            "SAMPLE_COVERAGE",
            "SCISSOR",
            "SHADER_SOURCE",
            "STENCIL_FUNC",
            "STENCIL_FUNC_SEPARATE",
            "STENCIL_MASK",
            "STENCIL_MASK_SEPARATE",
            "STENCIL_OP",
            "STENCIL_OP_SEPARATE",
            "TEX_PARAMETERF",
            "TEX_PARAMETERI",
            "UNIFORM1F",
            "UNIFORM1FV",
            "UNIFORM1I",
            "UNIFORM1IV",
            "UNIFORM2F",
            "UNIFORM2FV",
            "UNIFORM2I",
            "UNIFORM2IV",
            "UNIFORM3F",
            "UNIFORM3FV",
            "UNIFORM3I",
            "UNIFORM3IV",
            "UNIFORM4F",
            "UNIFORM4FV",
            "UNIFORM4I",
            "UNIFORM4IV",
            "UNIFORM_MATRIX2FV",
            "UNIFORM_MATRIX3FV",
            "UNIFORM_MATRIX4FV",
            "USE_PROGRAM",
            "VALIDATE_PROGRAM",
            "VERTEX_ATTRIB1F",
            "VERTEX_ATTRIB1FV",
            "VERTEX_ATTRIB2F",
            "VERTEX_ATTRIB2FV",
            "VERTEX_ATTRIB3F",
            "VERTEX_ATTRIB3FV",
            "VERTEX_ATTRIB4F",
            "VERTEX_ATTRIB4FV",
            "VERTEX_ATTRIB_POINTER",
            "VIEWPORT"
        ];

        for (var i=0, l=callEnums.length; i<l; i++) {
            if (typeof(this.JebApp["CALL_" + callEnums[i]]) === "undefined")
                throw new Error("CALL_" + callEnums[i] + " undefined in applet");
            this["CALL_" + callEnums[i]] = this.JebApp["CALL_" + callEnums[i]];
        }

        this.getContextAttributes = function() {
            // FIXME: return dummy attribute for now
            return { alpha: true,
                     antialias: false,
                     depth: true,
                     premultipliedAlpha: true,
                     stencil: false };
        }

        this.isContextLost = function() {
            // FIXME: return dummy false for now
            return false;
        }

        this.getSupportedExtensions = function() {
            // FIXME: return empty list for now
            return [];
        }

        this.getExtension = function(str) {
            // FIXME: return null for now
            return null;
        }

        // Get call list parameters
        this.maxCalls = this.JebApp.maxCalls;
        this.maxInts = this.JebApp.maxInts;
        this.maxFloats = this.JebApp.maxFloats;

        this.intList = [];
        this.floatList = [];
        this.callList = [];

        // Call timer
        this.callTimer = null;
    }

    JebGLRenderingContext.prototype = {
        bind: function(method) {
            var _this = this;
            return function() {
                method.apply(_this, arguments);
            };
        },

        submit: function() {
            // Zero pad all lists
            for (var i=0; i<this.maxCalls; i++) {
                if (typeof(this.callList[i]) == "undefined") this.callList[i] = 0;
            }
            for (var i=0; i<this.maxInts; i++) {
                if (typeof(this.intList[i]) == "undefined") this.intList[i] = 0;
            }
            for (var i=0; i<this.maxFloats; i++) {
                if (typeof(this.floatList[i]) == "undefined") this.floatList[i] = 0.0;
            }
            try {
                this.JebApp.call(this.callList[0], this.callList[1], this.callList[2],
                                 this.callList[3], this.callList[4], this.callList[5],
                                 this.callList[6], this.callList[7], this.callList[8],
                                 this.callList[9], this.callList[10], this.callList[11],
                                 this.callList[12], this.callList[13], this.callList[14],
                                 this.callList[15], this.callList[16], this.callList[17],
                                 this.callList[18], this.callList[19], this.callList[20],
                                 this.callList[21], this.callList[22], this.callList[23],
                                 this.callList[24], this.callList[25], this.callList[26],
                                 this.callList[27], this.callList[28], this.callList[29],
                                 this.callList[30], this.callList[31], this.callList[32],
                                 this.callList[33], this.callList[34], this.callList[35],
                                 this.callList[36], this.callList[37], this.callList[38],
                                 this.callList[39], this.callList[40], this.callList[41],
                                 this.callList[42], this.callList[43], this.callList[44],
                                 this.callList[45], this.callList[46], this.callList[47],
                                 this.callList[48], this.callList[49], 
                                 this.intList[0], this.intList[1], this.intList[2],
                                 this.intList[3], this.intList[4], this.intList[5],
                                 this.intList[6], this.intList[7], this.intList[8],
                                 this.intList[9], this.intList[10], this.intList[11],
                                 this.intList[12], this.intList[13], this.intList[14],
                                 this.intList[15], this.intList[16], this.intList[17],
                                 this.intList[18], this.intList[19], this.intList[20],
                                 this.intList[21], this.intList[22], this.intList[23],
                                 this.intList[24], this.intList[25], this.intList[26],
                                 this.intList[27], this.intList[28], this.intList[29],
                                 this.intList[30], this.intList[31], this.intList[32],
                                 this.intList[33], this.intList[34], this.intList[35],
                                 this.intList[36], this.intList[37], this.intList[38],
                                 this.intList[39], this.intList[40], this.intList[41],
                                 this.intList[42], this.intList[43], this.intList[44],
                                 this.intList[45], this.intList[46], this.intList[47],
                                 this.intList[48], this.intList[49], 
                                 this.intList[50], this.intList[51], this.intList[52],
                                 this.intList[53], this.intList[54], this.intList[55],
                                 this.intList[56], this.intList[57], this.intList[58],
                                 this.intList[59], this.intList[60], this.intList[61],
                                 this.intList[62], this.intList[63], this.intList[64],
                                 this.intList[65], this.intList[66], this.intList[67],
                                 this.intList[68], this.intList[69], this.intList[70],
                                 this.intList[71], this.intList[72], this.intList[73],
                                 this.intList[74], this.intList[75], this.intList[76],
                                 this.intList[77], this.intList[78], this.intList[79],
                                 this.intList[80], this.intList[81], this.intList[82],
                                 this.intList[83], this.intList[84], this.intList[85],
                                 this.intList[86], this.intList[87], this.intList[88],
                                 this.intList[89], this.intList[90], this.intList[91],
                                 this.intList[92], this.intList[93], this.intList[94],
                                 this.intList[95], this.intList[96], this.intList[97],
                                 this.intList[98], this.intList[99], 
                                 this.floatList[0], this.floatList[1], this.floatList[2],
                                 this.floatList[3], this.floatList[4], this.floatList[5],
                                 this.floatList[6], this.floatList[7], this.floatList[8],
                                 this.floatList[9], this.floatList[10], this.floatList[11],
                                 this.floatList[12], this.floatList[13], this.floatList[14],
                                 this.floatList[15], this.floatList[16], this.floatList[17],
                                 this.floatList[18], this.floatList[19], this.floatList[20],
                                 this.floatList[21], this.floatList[22], this.floatList[23],
                                 this.floatList[24], this.floatList[25], this.floatList[26],
                                 this.floatList[27], this.floatList[28], this.floatList[29],
                                 this.floatList[30], this.floatList[31], this.floatList[32],
                                 this.floatList[33], this.floatList[34], this.floatList[35],
                                 this.floatList[36], this.floatList[37], this.floatList[38],
                                 this.floatList[39], this.floatList[40], this.floatList[41],
                                 this.floatList[42], this.floatList[43], this.floatList[44],
                                 this.floatList[45], this.floatList[46], this.floatList[47],
                                 this.floatList[48], this.floatList[49], 
                                 this.floatList[50], this.floatList[51], this.floatList[52],
                                 this.floatList[53], this.floatList[54], this.floatList[55],
                                 this.floatList[56], this.floatList[57], this.floatList[58],
                                 this.floatList[59], this.floatList[60], this.floatList[61],
                                 this.floatList[62], this.floatList[63], this.floatList[64],
                                 this.floatList[65], this.floatList[66], this.floatList[67],
                                 this.floatList[68], this.floatList[69], this.floatList[70],
                                 this.floatList[71], this.floatList[72], this.floatList[73],
                                 this.floatList[74], this.floatList[75], this.floatList[76],
                                 this.floatList[77], this.floatList[78], this.floatList[79],
                                 this.floatList[80], this.floatList[81], this.floatList[82],
                                 this.floatList[83], this.floatList[84], this.floatList[85],
                                 this.floatList[86], this.floatList[87], this.floatList[88],
                                 this.floatList[89], this.floatList[90], this.floatList[91],
                                 this.floatList[92], this.floatList[93], this.floatList[94],
                                 this.floatList[95], this.floatList[96], this.floatList[97],
                                 this.floatList[98], this.floatList[99]);
            } catch (e) {
                if (typeof(applet) != "undefined" && typeof(applet.getSubApplet().ready) == "boolean" && applet.getSubApplet().ready) {
                    throw new Error(e);
                } // Else the applet is closing and this error may occur in some browsers
            }

            this.intList = [];
            this.floatList = [];
            this.callList = [];

            // Clear the callTimer
            clearTimeout(this.callTimer);
            this.callTimer = null;
        },

        setTimer: function() {
            var sbmt = this.bind(this.finish); // Run glFinish every 100ms
            this.callTimer = setTimeout(sbmt, 1000/10);
        },

        clearTimer: function() {
            clearTimeout(this.callTimer);
            this.callTimer = null;
        },

        addCall: function(f, intParams, floatParams) {
            if (this.callList.length + 1 >= this.maxCalls ||
                this.intList.length + intParams.length >= this.maxInts ||
                this.floatList.length + floatParams.length >= this.maxFloats) {
                // Submit first
                if (this.callTimer) {
                    this.clearTimer();
                }
                this.submit();
            }
            this.callList[this.callList.length] = f;
	    for (var i=0, l=intParams.length; i<l; i++) {
	        this.intList[this.intList.length] = intParams[i];
            }
	    for (var i=0, l=floatParams.length; i<l; i++) {
	        this.floatList[this.floatList.length] = floatParams[i];
	    }
            if (!this.callTimer) {
                this.setTimer();
            }
        },

        /* 
     * WebGL specification methods
     * http://www.khronos.org/registry/webgl/specs/latest
     */

        activeTexture: function(textureEnum) {
            this.addCall(this.CALL_ACTIVE_TEXTURE, [textureEnum], []);
        },

        attachShader: function(program, shader) {
            if (program instanceof JebGLProgram && shader instanceof JebGLShader) {
                this.addCall(this.CALL_ATTACH_SHADER, [program.id, shader.id], []);
            } else if (typeof(shader) == "undefined" || typeof(program) == "undefined" || shader == null || program == null) {
                // Don't throw, cf. WebGL conformance test
                return;
            } else {
                throw new TypeError("attachShader: invalid argument");
            }
        },

        bindAttribLocation: function(program, index, name) {
            // Before calling gl methods directly we submit the call list
            this.submit();
            if (program instanceof JebGLProgram) {
                try {
                    this.JebApp.glBindAttribLocation(program.id, index, name);
                } catch (e) {
                    throw new Error(e);
                }
            } else if (typeof(program) == "undefined" || program == null) {
                try {
                    this.JebApp.glBindAttribLocation(0, index, name);
                } catch (e) {
                    throw new Error(e);
                }
            } else {
                throw new TypeError("bindAttribLocation: invalid argument");
            }
        },
        
        bindBuffer: function(target, buffer) {
            if (buffer instanceof JebGLBuffer) {
                this.addCall(this.CALL_BIND_BUFFER, [target, buffer.id], []);
            } else if (typeof(buffer) == "undefined" || buffer === null) {
                this.addCall(this.CALL_BIND_BUFFER, [target, 0], []);
            } else {
                throw new TypeError("bindBuffer: invalid argument");
            }
        },

        bindFramebuffer: function(target, framebuffer) {
            if (framebuffer instanceof JebGLFramebuffer) {
                this.addCall(this.CALL_BIND_FRAMEBUFFER, [target, framebuffer.id], []);
            } else if (typeof(framebuffer) == "undefined" || framebuffer === null) {
                this.addCall(this.CALL_BIND_FRAMEBUFFER, [target, 0], []);
            } else {
                throw new TypeError("bindFramebuffer: invalid argument");
            }
        },

        bindRenderbuffer: function(target, renderbuffer) {
            if (renderbuffer instanceof JebGLRenderbuffer) {
                this.addCall(this.CALL_BIND_RENDERBUFFER, [target, renderbuffer.id], []);
            } else if (typeof(renderbuffer) == "undefined" || renderbuffer === null) {
                this.addCall(this.CALL_BIND_RENDERBUFFER, [target, 0], []);
            } else { 
                throw new TypeError("bindRenderbuffer: invalid argument");
            }
        },

        bindTexture: function(target, texture) {
            if (texture instanceof JebGLTexture) {
                this.addCall(this.CALL_BIND_TEXTURE, [target, texture.id], []);
            } else if (typeof(texture) == "undefined" || texture === null) {
                this.addCall(this.CALL_BIND_TEXTURE, [target, 0], []);
            } else {
                throw new TypeError("bindTexture: invalid argument");
            }
        },

        blendColor: function(red, green, blue, alpha) {
            this.addCall(this.CALL_BLEND_COLOR, [], [red, green, blue, alpha]);
        },

        blendEquation: function(mode) {
            this.addCall(this.CALL_BLEND_EQUATION, [mode], []);
        },

        blendEquationSeparate: function(modeRGB, modeAlpha) {
            this.addCall(this.CALL_BLEND_EQUATION_SEPARATE, [modeRGB, modeAlpha], []);
        },

        blendFunc: function(sfactor, dfactor) {
            this.addCall(this.CALL_BLEND_FUNC, [sfactor, dfactor], []);
        },

        blendFuncSeparate: function(srcRGB, dstRGB, srcAlpha, dstAlpha) {
            this.addCall(this.CALL_BLEND_FUNC_SEPARATE, [srcRGB, dstRGB,
                                                         srcAlpha, dstAlpha], []);
        },

        bufferData: function(target, data, usage) {
            // Make sure we've submitted eventual bindBuffer commands
            this.submit();
            if (typeof(data) != "undefined" && data != null && typeof(data.length) != "undefined") {
                var size = data.length,
                    it = 0;
                // IE6 fix - it counts one too many
                if (isNaN(data[size-1])) size--;
                if (target == this.ARRAY_BUFFER) {
                    try {
                        // Calling Java methods with arrays is sloooow, so we do this
                        this.JebApp.createUploadf(size);
                        while(it+10 < size) {
                            this.JebApp.uploadDataf(it, data[it], data[it+1], data[it+2],
                                                    data[it+3], data[it+4], data[it+5],
                                                    data[it+6], data[it+7], data[it+8],
                                                    data[it+9]);
                            it+=10;
                        }
                        while(it < size) {
                            this.JebApp.uploadSinglef(it, data[it]);
                            it++;
                        }
                        this.JebApp.glBufferData(target, size, usage);
                        this.JebApp.deleteUploadf();
                    } catch (e) {
                        alert(e.message);
                        throw new Error(e);
                    }
                } else if (target == this.ELEMENT_ARRAY_BUFFER) {
                    try {
                        // Calling Java methods with arrays is sloooow, so we do this
                        this.JebApp.createUploadi(size);
                        while(it+10 < size) {
                            this.JebApp.uploadDatai(it, data[it], data[it+1], data[it+2],
                                                    data[it+3], data[it+4], data[it+5],
                                                    data[it+6], data[it+7], data[it+8],
                                                    data[it+9]);
                            it+=10;
                        }
                        while(it < size) {
                            this.JebApp.uploadSinglei(it, data[it]);
                            it++;
                        }
                        this.JebApp.glBufferData(target, size, usage);
                        this.JebApp.deleteUploadi();
                    } catch (e) {
                        throw new Error(e);
                    }
                } else {
                    throw new Error("Unknown target for bufferData");
                }
            } else {
                try {
                    this.JebApp.glBufferData(target, data, usage);
                } catch(e) {
                    throw new Error(e);
                }
            }
        },

        bufferSubData: function(target, offset, data) {
            // Make sure we've submitted eventual bindBuffer commands
            this.submit();
            if (typeof(data) != "undefined" && data != null && typeof(data.length) != "undefined") {
                var size = data.length,
                    it = 0;
                // IE6 fix - it counts one too many
                if (isNaN(data[size-1])) size--;
                if (target == this.ARRAY_BUFFER) {
                    try {
                        // Calling Java methods with arrays is sloooow, so we do this
                        this.JebApp.createUploadf(size);
                        while(it+10 < size) {
                            this.JebApp.uploadDataf(it, data[it], data[it+1], data[it+2],
                                                    data[it+3], data[it+4], data[it+5],
                                                    data[it+6], data[it+7], data[it+8],
                                                    data[it+9]);
                            it+=10;
                        }
                        while(it < size) {
                            this.JebApp.uploadSinglef(it, data[it]);
                            it++;
                        }
                        this.JebApp.glBufferSubData(target, offset, size);
                        this.JebApp.deleteUploadf();
                    } catch (e) {
                        alert(e.message);
                        throw new Error(e);
                    }
                } else if (target == this.ELEMENT_ARRAY_BUFFER) {
                    try {
                        // Calling Java methods with arrays is sloooow, so we do this
                        this.JebApp.createUploadi(size);
                        while(it+10 < size) {
                            this.JebApp.uploadDatai(it, data[it], data[it+1], data[it+2],
                                                    data[it+3], data[it+4], data[it+5],
                                                    data[it+6], data[it+7], data[it+8],
                                                    data[it+9]);
                            it+=10;
                        }
                        while(it < size) {
                            this.JebApp.uploadSinglei(it, data[it]);
                            it++;
                        }
                        this.JebApp.glBufferSubData(target, offset, size);
                        this.JebApp.deleteUploadi();
                    } catch (e) {
                        throw new Error(e);
                    }
                } else {
                    throw new Error("Unknown target for bufferSubData");
                }
            } else {
                try {
                    this.JebApp.glBufferSubData(target, offset, data);
                } catch(e) {
                    throw new Error(e);
                }
            }
        },

        checkFramebufferStatus: function(target) {
            // Before calling gl methods directly we submit the call list
            this.submit();
            try {
                var status = this.JebApp.glCheckFramebufferStatus(target);
            } catch (e) {
                throw new Error(e);
            }
            return status;
        },
        
        clear: function(mask) {
            this.addCall(this.CALL_CLEAR, [mask], []);
        },
        
        clearColor: function(red, green, blue, alpha) {
            this.addCall(this.CALL_CLEAR_COLOR, [], [red, green, blue, alpha]);
        },

        clearDepth: function(depth) {
            this.addCall(this.CALL_CLEAR_DEPTH, [], [depth]);
        },

        clearStencil: function(s) {
            this.addCall(this.CALL_CLEAR_STENCIL, [s], []);
        },

        colorMask: function(red, green, blue, alpha) {
            var i = [],
                o = [];
            i[0] = red; i[1] = green; i[2] = blue; i[3] = alpha;
            for (var j=0; j<4; j++) {
                if (i[j] === false) {
                    o[j] = this.FALSE;
                } else {
                    o[j] = this.TRUE;
                }
            }
            this.addCall(this.CALL_COLOR_MASK, o, []);
        },

        compileShader: function(shader) {
            if (shader instanceof JebGLShader) {
                this.addCall(this.CALL_COMPILE_SHADER, [shader.id], []);
            } else if (typeof(shader) == "undefined" || shader == null) {
                // Don't throw, cf. WebGL conformance test
                return;
            } else {
                throw new TypeError("compileShader: invalid argument");
            }
        },

        copyTexImage2D: function(target, level, internalformat, x, y, 
                                 width, height, border) {
            this.addCall(this.CALL_COPY_TEX_IMAGE_2D, [target, level, internalformat,
                                                       x, y, width, height, border],
                         []);
        },

        copyTexSubImage2D: function(target, level, xoffset, yoffset, x, y, 
                                    width, height) {
            this.addCall(this.CALL_COPY_TEX_SUB_IMAGE_2D, [target, level, xoffset,
                                                           yoffset, x, y,
                                                           width, height], []);
        },

        createBuffer: function() {
            // Before calling gl methods directly we submit the call list
            this.submit();
            try {
                var buffer = new JebGLBuffer(this.JebApp.glCreateBuffer());
            } catch (e) {
                throw new Error(e);
            }
            return buffer;
        },

        createFramebuffer: function() {
            // Before calling gl methods directly we submit the call list
            this.submit();
            try {
                var buffer = new JebGLFramebuffer(this.JebApp.glCreateFramebuffer());
            } catch (e) {
                throw new Error(e);
            }
            return buffer;
        },
        
        createProgram: function() {
            // Before calling gl methods directly we submit the call list
            this.submit();
            try {
                var program = new JebGLProgram(this.JebApp.glCreateProgram());
            } catch (e) {
                throw new Error(e);
            }
            return program;
        },

        createRenderbuffer: function() {
            // Before calling gl methods directly we submit the call list
            this.submit();
            try {
                var buffer = new JebGLRenderbuffer(this.JebApp.glCreateRenderbuffer());
            } catch (e) {
                throw new Error(e);
            }
            return buffer;
        },

        createShader: function(type) {
            // Before calling gl methods directly we submit the call list
            this.submit();
            try {
                var shader = new JebGLShader(this.JebApp.glCreateShader(type));
            } catch (e) {
                throw new Error("It appears your GPU doesn't support OpenGL 2.0. JebGL requires OpenGL 2.0 or more. (details: glCreateShader method not available)");
            }
            return shader;
        },

        createTexture: function() {
            // Before calling gl methods directly we submit the call list
            this.submit();
            try {
                var texture = new JebGLTexture(this.JebApp.glCreateTexture());
            } catch (e) {
                throw new Error(e);
            }
            return texture;
        },

        cullFace: function(mode) {
            this.addCall(this.CALL_CULL_FACE, [mode], []);
        },

        deleteBuffer: function(buffer) {
            if (buffer instanceof JebGLBuffer) {
                this.addCall(this.CALL_DELETE_BUFFER, [buffer.id], []);
            } else {
                throw new TypeError("deleteBuffer: not a JebGLBuffer");
            }
        },

        deleteFramebuffer: function(buffer) {
            if (buffer instanceof JebGLFramebuffer) {
                this.addCall(this.CALL_DELETE_FRAMEBUFFER, [buffer.id], []);
            } else {
                throw new TypeError("deleteFramebuffer: not a JebGLFramebuffer");
            }
        },

        deleteProgram: function(program) {
            if (program instanceof JebGLProgram) {
                this.addCall(this.CALL_DELETE_PROGRAM, [program.id], []);
            } else {
                throw new TypeError("deleteProgram: not a JebGLProgram");
            }
        },

        deleteRenderbuffer: function(buffer) {
            if (buffer instanceof JebGLRenderbuffer) {
                this.addCall(this.CALL_DELETE_RENDERBUFFER, [buffer.id], []);
            } else { 
                throw new TypeError("deleteRenderbuffer: not a JebGLRenderbuffer");
            }
        },

        deleteShader: function(shader) {
            if (shader instanceof JebGLShader) {
                this.addCall(this.CALL_DELETE_SHADER, [shader.id], []);
            } else {
                throw new TypeError("deleteShader: not a JebGLShader");
            }
        },

        deleteTexture: function(texture) {
            if (texture instanceof JebGLTexture) {
                this.addCall(this.CALL_DELETE_TEXTURE, [texture.id], []);
            } else {
                throw new TypeError("deleteTexture: not a JebGLTexture");
            }
        },

        depthFunc: function(func) {
            this.addCall(this.CALL_DEPTH_FUNC, [func], []);
        },

        depthMask: function(flag) {
            if (flag === false) {
                this.addCall(this.CALL_DEPTH_MASK, [this.FALSE], []);
            } else {
                this.addCall(this.CALL_DEPTH_MASK, [this.TRUE], []);
            }
        },

        depthRange: function(zNear, zFar) {
            this.addCall(this.CALL_DEPTH_RANGE, [], [zNear, zFar]);
        },

        detachShader: function(program, shader) {
            if (program instanceof JebGLProgram && shader instanceof JebGLShader) {
                this.addCall(this.CALL_DETACH_SHADER, [program.id, shader.id], []);
            } else if (typeof(shader) == "undefined" || typeof(program) == "undefined" || shader == null || program == null) {
                // Don't throw, cf. WebGL conformance test
                return;
            } else {
                throw new TypeError("detachShader: invalid argument");
            }
        },

        disable: function(cap) {
            this.addCall(this.CALL_DISABLE, [cap], []);
        },

        disableVertexAttribArray: function(index) {
            this.addCall(this.CALL_DISABLE_VERTEX_ATTRIB_ARRAY, [index], []);
        },

        drawArrays: function(mode, first, count) {
            this.addCall(this.CALL_DRAW_ARRAYS, [mode, first, count], []);
        },

        drawElements: function(mode, count, type, offset) {
            this.addCall(this.CALL_DRAW_ELEMENTS, [mode, count, type, offset], []);
        },

        enable: function(cap) {
            this.addCall(this.CALL_ENABLE, [cap], []);
        },

        enableVertexAttribArray: function(index) {
            this.addCall(this.CALL_ENABLE_VERTEX_ATTRIB_ARRAY, [index], []);
        },

        finish: function() {
            // Submit call list
            this.submit();
            try {
                this.JebApp.glFinish();
            } catch (e) {
                if (typeof(applet) != "undefined" && typeof(applet.getSubApplet().ready) == "boolean" && applet.getSubApplet().ready) {
                    throw new Error(e);
                } // Else the applet is closing and this error may occur in some browsers
            }
        },

        flush: function() {
            // Submit call list
            this.submit();
            try {
                this.JebApp.glFlush();
            } catch (e) {
                throw new Error(e);
            }
        },
        
        framebufferRenderbuffer: function(target, attachment, renderbuffertarget,
                                          renderbuffer) {
            if (renderbuffer instanceof JebGLRenderbuffer) {
                this.addCall(this.CALL_FRAMEBUFFER_RENDERBUFFER, [target, attachment,
                                                                  renderbuffertarget,
                                                                  renderbuffer.id], []);
            } else if (typeof(renderbuffer) == "undefined" || renderbuffer == null) {
                this.addCall(this.CALL_FRAMEBUFFER_RENDERBUFFER, [target, attachment,
                                                                  renderbuffertarget,
                                                                  0], []);
            } else {
                throw new TypeError("framebufferRenderbuffer: invalid argument");
            }
        },

        framebufferTexture2D: function(target, attachment, textarget,
                                       texture, level) {
            if (texture instanceof JebGLTexture) {
                this.addCall(this.CALL_FRAMEBUFFER_TEXTURE_2D, [target, attachment,
                                                                textarget, texture.id,
                                                                level], []);
            } else if (typeof(texture) == "undefined" || texture == null) {
                this.addCall(this.CALL_FRAMEBUFFER_TEXTURE_2D, [target, attachment,
                                                                textarget, 0,
                                                                level], []);
            } else {
                throw new TypeError("framebufferTexture2D: invalid argument");
            }
        },

        frontFace: function(mode) {
            this.addCall(this.CALL_FRONT_FACE, [mode], []);
        },

        generateMipmap: function(target) {
            this.addCall(this.CALL_GENERATE_MIPMAP, [target], []);
        },
        
        getActiveAttrib: function(program, index) {
            // Before calling gl methods directly we submit the call list
            this.submit();
            if (!(program instanceof JebGLProgram)) 
                throw new TypeError("getActiveAttrib: not a JebGLProgram");
            try {
                var activeinfo = this.JebApp.glGetActiveAttrib(program.id, index);
            } catch (e) {
                throw new Error(e);
            }
            var out = "";
            for (var i = 0, l = activeinfo.length; i<l; i++) {
                out += String.fromCharCode(activeinfo[i]);
            }
            return out;
        },

        getActiveUniform: function(program, index) {
            // Before calling gl methods directly we submit the call list
            this.submit();
            if (!(program instanceof JebGLProgram)) 
                throw new TypeError("getActiveUniform: not a JebGLProgram");
            try {
                var activeinfo = this.JebApp.glGetActiveUniform(program.id, index);
            } catch (e) {
                throw new Error(e);
            }
            var out = "";
            for (var i = 0, l = activeinfo.length; i<l; i++) {
                out += String.fromCharCode(activeinfo[i]);
            }
            return out;
        },

        getAttachedShaders: function(program) {
            // Before calling gl methods directly we submit the call list
            this.submit();
            if (!(program instanceof JebGLProgram)) 
                throw new TypeError("getAttachedShaders: not a JebGLProgram");
            try {
                var shaders = this.JebApp.glGetAttachedShaders(program.id);
            } catch (e) {
                throw new Error(e);
            }
            return shaders;
        },

        getAttribLocation: function(program, name) {
            // Before calling gl methods directly we submit the call list
            this.submit();
            if (!(program instanceof JebGLProgram)) 
                throw new TypeError("getAttribLocation: not a JebGLProgram");
            try {
                return this.JebApp.glGetAttribLocation(program.id, name);
            } catch (e) {
                throw new Error(e);
            }
        },

        getParameter: function(pname) {
            //throw new Error("FIXME: not implemented");
        },

        getBufferParameter: function(target, pname) {
            // Before calling gl methods directly we submit the call list
            this.submit();
            try {
                var result = this.JebApp.glGetBufferParameteriv(target, pname);
            } catch (e) {
                throw new Error(e);
            }
            switch(result) {
            case this.TRUE:
                return true;
                break;
            case this.FALSE:
                return false;
                break;
            default:
                return result;
            }
        },

        getError: function() {
            // Make sure the call list is flushed
            this.submit();
            try {
                return this.JebApp.glGetError();
            } catch (e) {
                throw new Error(e);
            }
        },

        getFramebufferAttachmentParameter: function(target, attachment, pname) {
            // Before calling gl methods directly we submit the call list
            this.submit();
            try {
                var result = this.JebApp.glGetFramebufferAttachmentParameteriv(target, attachment, pname);
            } catch (e) {
                throw new Error(e);
            }
            switch(result) {
            case this.TRUE:
                return true;
                break;
            case this.FALSE:
                return false;
                break;
            default:
                return result;
            }
        },

        getProgramParameter: function(program, pname) {
            if (program instanceof JebGLProgram) {
                // Before calling gl methods directly we submit the call list
                this.submit();
                try {
                    var result = this.JebApp.glGetProgramiv(program.id, pname);
                } catch (e) {
                    throw new Error(e);
                }
                switch(result) {
                case this.TRUE:
                    return true;
                    break;
                case this.FALSE:
                    return false;
                    break;
                default:
                    return result;
                }
            } else if (typeof(program) == "undefined" || program == null) {
                // Don't throw, cf. WebGL conformance test
                return null;
            } else {
                throw new TypeError("getProgramParameter: invalid argument");
            }
        },

        getProgramInfoLog: function(program) {
            if (program instanceof JebGLProgram) {
                // Before calling gl methods directly we submit the call list
                this.submit();
                try {
                    var info = this.JebApp.glGetProgramInfoLog(program.id);
                } catch (e) {
                    throw new Error(e);
                }
                var out = "";
                for (var i = 0, l = info.length; i<l; i++) {
                    out += String.fromCharCode(info[i]);
                }
                return out;
            } else if (typeof(program) == "undefined" || program == null) {
                // Don't throw, cf. WebGL conformance test
                return "";
            } else {
                throw new TypeError("getProgramInfoLog: invalid argument");
            }
        },

        getRenderbufferParameter: function(target, pname) {
            // Before calling gl methods directly we submit the call list
            this.submit();
            try {
                var result = this.JebApp.glGetRenderbufferParameteriv(target, pname);
            } catch (e) {
                throw new Error(e);
            }
            switch(result) {
            case this.TRUE:
                return true;
                break;
            case this.FALSE:
                return false;
                break;
            default:
                return result;
            }
        },

        getShaderParameter: function(shader, pname) {
            if (shader instanceof JebGLShader) {
                // Before calling gl methods directly we submit the call list
                this.submit();
                try {
                    var result = this.JebApp.glGetShaderiv(shader.id, pname);
                } catch (e) {
                    throw new Error(e);
                }
                switch(result) {
                case this.TRUE:
                    return true;
                    break;
                case this.FALSE:
                    return false;
                    break;
                default:
                    return result;
                }
            } else if (typeof(shader) == "undefined" || shader == null) {
                // Don't throw, cf. WebGL conformance test
                return null;
            } else {
                throw new TypeError("getShaderParameter: invalid argument");
            }
        },

        getShaderInfoLog: function(shader) {
            if (shader instanceof JebGLShader) {
                // Before calling gl methods directly we submit the call list
                this.submit();
                try {
                    var info = this.JebApp.glGetShaderInfoLog(shader.id);
                } catch (e) {
                    throw new Error(e);
                }
                var out = "";
                for (var i = 0, l = info.length; i<l; i++) {
                    out += String.fromCharCode(info[i]);
                }
                return out;
            } else if (typeof(shader) == "undefined" || shader == null) {
                // Don't throw, cf. WebGL conformance test
                return "";
            } else {
                throw new TypeError("getShaderInfoLog: invalid argument");
            }
        },

        getShaderSource: function(shader) {
            if (shader instanceof JebGLShader) {
                // Before calling gl methods directly we submit the call list
                this.submit();
                try {
                    var source = this.JebApp.glGetShaderSource(shader.id);
                } catch (e) {
                    throw new Error(e);
                }
                var out = "";
                for (var i = 0, l = source.length; i<l; i++) {
                    out += String.fromCharCode(source[i]);
                }
                return out;
            } else if (typeof(shader) == "undefined" || shader == null) {
                // Don't throw, cf. WebGL conformance test
                return "";
            } else {
                throw new TypeError("getShaderSource: invalid argument");
            }
        },

        getTexParameter: function(target, pname) {
            // Before calling gl methods directly we submit the call list
            this.submit();
            try {
                // FIXME: switch between iv and fv according to pname
                var result = this.JebApp.glGetTexParameteriv(target, pname);
            } catch (e) {
                throw new Error(e);
            }
            switch(result) {
            case this.TRUE:
                return true;
                break;
            case this.FALSE:
                return false;
                break;
            default:
                return result;
            }
        },

        getUniform: function(program, location) {
            if (program instanceof JebGLProgram && location instanceof JebGLUniformLocation) {
                // Before calling gl methods directly we submit the call list
                this.submit();
                try {
                    return this.JebApp.glGetUniform(program.id, location.id);
                } catch (e) {
                    throw new Error(e);
                }
            } else if (typeof(program) == "undefined" || typeof(location) == "undefined" || program == null || location == null) {
                // Don't throw, cf. WebGL conformance test
                return null;
            } else {
                throw new TypeError("getUniform: invalid argument");
            }
        },

        getUniformLocation: function(program, name) {
            if (program instanceof JebGLProgram) {
                // Before calling gl methods directly we submit the call list
                this.submit();
                try {
                    return new JebGLUniformLocation(this.JebApp.glGetUniformLocation(program.id, name));
                } catch (e) {
                    throw new Error(e);
                }
            } else if (typeof(program) == "undefined" || program == null) {
                // Don't throw, cf. WebGL conformance test
                return null;
            } else {
                throw new TypeError("getUniformLocation: invalid argument");
            }
        },

        getVertexAttrib: function(index, pname) {
            // Before calling gl methods directly we submit the call list
            this.submit();
            try {
                // FIXME: switch between iv and fv according to pname
                return this.JebApp.glGetVertexAttribiv(index, pname);
            } catch (e) {
                throw new Error(e);
            }
        },

        getVertexAttribOffset: function(index, pname) {
            throw new Error("Not implemented");
        },

        hint: function(target, mode) {
            this.addCall(this.CALL_HINT, [target, mode], []);
        },

        isBuffer: function(buffer) {
            // Before calling gl methods directly we submit the call list
            this.submit();
            if (!(buffer instanceof JebGLBuffer)) 
                throw new TypeError("isBuffer: not a JebGLBuffer");
            try {
                var b = this.JebApp.glIsBuffer(buffer.id);
            } catch (e) {
                throw new Error(e);
            }
            if (b === this.FALSE) {
                return false;
            } else {
                return true;
            }
        },

        isEnabled: function(cap) {
            // Before calling gl methods directly we submit the call list
            this.submit();
            try {
                var b = this.JebApp.glIsEnabled(cap);
            } catch (e) {
                throw new Error(e);
            }
            if (b === this.FALSE) {
                return false;
            } else {
                return true;
            }
        },

        isFramebuffer: function(framebuffer) {
            // Before calling gl methods directly we submit the call list
            this.submit();
            if (!(framebuffer instanceof JebGLFramebuffer)) 
                throw new TypeError("isFramebuffer: not a JebGLFramebuffer");
            try {
                var b = this.JebApp.glIsFramebuffer(framebuffer.id);
            } catch (e) {
                throw new Error(e);
            }
            if (b === this.FALSE) {
                return false;
            } else {
                return true;
            }
        },

        isProgram: function(program) {
            // Before calling gl methods directly we submit the call list
            this.submit();
            if (!(program instanceof JebGLProgram)) 
                throw new TypeError("isProgram: not a JebGLProgram");
            try {
                var b = this.JebApp.glIsProgram(program.id);
            } catch (e) {
                throw new Error(e);
            }
            if (b === this.FALSE) {
                return false;
            } else {
                return true;
            }
        },

        isRenderbuffer: function(renderbuffer) {
            // Before calling gl methods directly we submit the call list
            this.submit();
            if (!(renderbuffer instanceof JebGLRenderbuffer)) 
                throw new TypeError("isRenderbuffer: not a JebGLRenderbuffer");
            try {
                var b = this.JebApp.glIsRenderbuffer(renderbuffer.id);
            } catch (e) {
                throw new Error(e);
            }
            if (b === this.FALSE) {
                return false;
            } else {
                return true;
            }
        },

        isShader: function(shader) {
            // Before calling gl methods directly we submit the call list
            this.submit();
            if (!(shader instanceof JebGLShader)) 
                throw new TypeError("isShader: not a JebGLShader");
            try {
                var b = this.JebApp.glIsShader(shader.id);
            } catch (e) {
                throw new Error(e);
            }
            if (b === this.FALSE) {
                return false;
            } else {
                return true;
            }
        },

        isTexture: function(texture) {
            // Before calling gl methods directly we submit the call list
            this.submit();
            if (!(texture instanceof JebGLTexture)) 
                throw new TypeError("isTexture: not a JebGLTexture");
            try {
                var b = this.JebApp.glIsTexture(texture.id);
            } catch (e) {
                throw new Error(e);
            }
            if (b === this.FALSE) {
                return false;
            } else {
                return true;
            }
        },

        lineWidth: function(width) {
            this.addCall(this.CALL_LINE_WIDTH, [], [width]);
        },

        linkProgram: function(program) {
            if (program instanceof JebGLProgram) {
                this.addCall(this.CALL_LINK_PROGRAM, [program.id], []);
            } else if (typeof(program) == "undefined" || program == null) {
                // Don't throw, cf. WebGL conformance test
                return;
            } else {
                throw new TypeError("linkProgram: invalid argument");
            }
        },

        pixelStorei: function(pname, param) {
            if (param === true) {
                this.addCall(this.CALL_PIXEL_STOREI, [pname, this.TRUE], []);
            } else if (param === false) {
                this.addCall(this.CALL_PIXEL_STOREI, [pname, this.FALSE], []);
            } else {
                this.addCall(this.CALL_PIXEL_STOREI, [pname, param], []);
            }
        },

        polygonOffset: function(factor, units) {
            this.addCall(this.CALL_POLYGON_OFFSET, [], [factor, units]);
        },

        readPixels: function(x, y, width, height, format, type, pixels) {
            throw new Error("Not implemented");
        },

        renderbufferStorage: function(target, internalformat, width, height) {
            this.addCall(this.CALL_RENDERBUFFER_STORAGE, [target, internalformat,
                                                          width, height], []);
        },

        sampleCoverage: function(value, invert) {
            var binvert;
            if (invert === false) {
                binvert = this.FALSE;
            } else {
                binvert = this.TRUE;
            }
            this.addCall(this.CALL_SAMPLE_COVERAGE, [binvert], [value]);
        },
        
        scissor: function(x, y, width, height) {
            this.addCall(this.CALL_SCISSOR, [x, y, width, height], []);
        },

        shaderSource: function(shader, source) {
            if (shader instanceof JebGLShader) {
                // Before calling gl methods directly we submit the call list
                this.submit();
                try {
                    this.JebApp.glShaderSource(shader.id, source);
                } catch (e) {
                    throw new Error(e);
                }
            } else if (typeof(shader) == "undefined" || shader == null) {
                // Don't throw, cf. WebGL conformance test
                return;
            } else {
                throw new TypeError("shaderSource: invalid argument");
            }
        },
        
        stencilFunc: function(func, ref, mask) {
            this.addCall(this.CALL_STENCIL_FUNC, [func, ref, mask], []);
        },

        stencilFuncSeparate: function(face, func, ref, mask) {
            this.addCall(this.CALL_STENCIL_FUNC_SEPARATE, [face, func, ref, mask], []);
        },

        stencilMask: function(mask) {
            this.addCall(this.CALL_STENCIL_MASK, [mask], []);
        },

        stencilMaskSeparate: function(face, mask) {
            this.addCall(this.CALL_STENCIL_MASK_SEPARATE, [face, mask], []);
        },

        stencilOp: function(fail, zfail, zpass) {
            this.addCall(this.CALL_STENCIL_OP, [fail, zfail, zpass], []);
        },

        stencilOpSeparate: function(face, fail, zfail, zpass) {
            this.addCall(this.CALL_STENCIL_OP_SEPARATE, [face, fail, zfail, zpass], []);
        },

        texImage2D: function(target, level, internalformat, format, type, image) {
            // Make sure we've submitted eventual bindTexture commands
            this.submit();
            var width = image.width,
                height = image.height;
            if (target == this.TEXTURE_2D) {
                try {
                    this.JebApp.glTexImage2D(target, level, internalformat, width, height, 0, format, type, image.src);
                } catch (e) {
                    throw new Error(e);
                }
            }
        },

        texParameterf: function(target, pname, param) {
            this.addCall(this.CALL_TEX_PARAMETERF, [target, pname, param], []);
        },

        texParameteri: function(target, pname, param) {
            if (param === true) {
                this.addCall(this.CALL_TEX_PARAMETERI, [target, pname, this.TRUE], []);
            } else if (param === false) {
                this.addCall(this.CALL_TEX_PARAMETERI, [target, pname, this.FALSE], []);
            } else {
                this.addCall(this.CALL_TEX_PARAMETERI, [target, pname, param], []);
            }
        },

        texSubImage2D: function(target, level, xoffset, yoffset, 
                                width, height, format, type, pixels) {
            throw new Error("Not implemented");
        },

        uniform1f: function(location, x) {
            if (location instanceof JebGLUniformLocation) {
                this.addCall(this.CALL_UNIFORM1F, [location.id], [x]);
            } else if (typeof(location) == "undefined" || location == null) {
                // Don't throw, cf. WebGL conformance test
                return
            } else {
                throw new Error("uniform1f: invalid argument");
            }
        },

        uniform1fv: function(location, value) {
            if (location instanceof JebGLUniformLocation) {
                this.addCall(this.CALL_UNIFORM2F, [location.id], [value[0]]);
            } else if (typeof(location) == "undefined" || location == null) {
                // Don't throw, cf. WebGL conformance test
                return
            } else {
                throw new Error("uniform1fv: invalid argument");
            }
        },

        uniform1i: function(location, x) {
            if (location instanceof JebGLUniformLocation) {
                if (x === true) {
                    this.addCall(this.CALL_UNIFORM1I, [location.id, this.TRUE], []);
                } else if (x === false) {
                    this.addCall(this.CALL_UNIFORM1I, [location.id, this.FALSE], []);
                } else {
                    this.addCall(this.CALL_UNIFORM1I, [location.id, x], []);
                }
            } else if (typeof(location) == "undefined" || location == null) {
                // Don't throw, cf. WebGL conformance test
                return
            } else {
                throw new Error("uniform1i: invalid argument");
            }
        },

        uniform1iv: function(location, value) {
            if (location instanceof JebGLUniformLocation) {
                this.addCall(this.CALL_UNIFORM1I, [location.id, value[0]], []);
            } else if (typeof(location) == "undefined" || location == null) {
                // Don't throw, cf. WebGL conformance test
                return
            } else {
                throw new Error("uniform1iv: invalid argument");
            }
        },

        uniform2f: function(location, x, y) {
            if (location instanceof JebGLUniformLocation) {
                this.addCall(this.CALL_UNIFORM2F, [location.id], [x, y]);
            } else if (typeof(location) == "undefined" || location == null) {
                // Don't throw, cf. WebGL conformance test
                return
            } else {
                throw new Error("uniform2f: invalid argument");
            }
        },

        uniform2fv: function(location, value) {
            if (location instanceof JebGLUniformLocation) {
                this.addCall(this.CALL_UNIFORM2F, [location.id], [value[0], value[1]]);
            } else if (typeof(location) == "undefined" || location == null) {
                // Don't throw, cf. WebGL conformance test
                return
            } else {
                throw new Error("uniform2fv: invalid argument");
            }
        },

        uniform2i: function(location, x, y) {
            if (location instanceof JebGLUniformLocation) {
                this.addCall(this.CALL_UNIFORM2I, [location.id, x, y], []);
            } else if (typeof(location) == "undefined" || location == null) {
                // Don't throw, cf. WebGL conformance test
                return
            } else {
                throw new Error("uniform2i: invalid argument");
            }
        },

        uniform2iv: function(location, value) {
            if (location instanceof JebGLUniformLocation) {
                this.addCall(this.CALL_UNIFORM2I, [location.id, value[0], value[1]], []);
            } else if (typeof(location) == "undefined" || location == null) {
                // Don't throw, cf. WebGL conformance test
                return
            } else {
                throw new Error("uniform2iv: invalid argument");
            }
        },

        uniform3f: function(location, x, y, z) {
            if (location instanceof JebGLUniformLocation) {
                this.addCall(this.CALL_UNIFORM3F, [location.id], [x, y, z]);
            } else if (typeof(location) == "undefined" || location == null) {
                // Don't throw, cf. WebGL conformance test
                return
            } else {
                throw new Error("uniform3f: invalid argument");
            }
        },

        uniform3fv: function(location, value) {
            if (location instanceof JebGLUniformLocation) {
                this.addCall(this.CALL_UNIFORM3F, [location.id], [value[0], value[1], value[2]]);
            } else if (typeof(location) == "undefined" || location == null) {
                // Don't throw, cf. WebGL conformance test
                return
            } else {
                throw new Error("uniform3fv: invalid argument");
            }
        },

        uniform3i: function(location, x, y, z) {
            if (location instanceof JebGLUniformLocation) {
                this.addCall(this.CALL_UNIFORM3I, [location.id, x, y, z], []);
            } else if (typeof(location) == "undefined" || location == null) {
                // Don't throw, cf. WebGL conformance test
                return
            } else {
                throw new Error("uniform3i: invalid argument");
            }
        },

        uniform3iv: function(location, value) {
            if (location instanceof JebGLUniformLocation) {
                this.addCall(this.CALL_UNIFORM3I, [location.id, value[0], value[1], value[2]], []);
            } else if (typeof(location) == "undefined" || location == null) {
                // Don't throw, cf. WebGL conformance test
                return
            } else {
                throw new Error("uniform3iv: invalid argument");
            }
        },

        uniform4f: function(location, x, y, z, w) {
            if (location instanceof JebGLUniformLocation) {
                this.addCall(this.CALL_UNIFORM4F, [location.id], [x, y, z, w]);
            } else if (typeof(location) == "undefined" || location == null) {
                // Don't throw, cf. WebGL conformance test
                return
            } else {
                throw new Error("uniform4f: invalid argument");
            }
        },

        uniform4fv: function(location, value) {
            if (location instanceof JebGLUniformLocation) {
                this.addCall(this.CALL_UNIFORM4F, [location.id], [value[0], value[1], value[2], value[3]]);
            } else if (typeof(location) == "undefined" || location == null) {
                // Don't throw, cf. WebGL conformance test
                return
            } else {
                throw new Error("uniform4fv: invalid argument");
            }
        },

        uniform4i: function(location, x, y, z, w) {
            if (location instanceof JebGLUniformLocation) {
                this.addCall(this.CALL_UNIFORM4I, [location.id, x, y, z, w], []);
            } else if (typeof(location) == "undefined" || location == null) {
                // Don't throw, cf. WebGL conformance test
                return
            } else {
                throw new Error("uniform4i: invalid argument");
            }
        },

        uniform4iv: function(location, value) {
            if (location instanceof JebGLUniformLocation) {
                this.addCall(this.CALL_UNIFORM4I, [location.id, value[0], value[1], value[2], value[3]], []);
            } else if (typeof(location) == "undefined" || location == null) {
                // Don't throw, cf. WebGL conformance test
                return
            } else {
                throw new Error("uniform4iv: invalid argument");
            }
        },

        uniformMatrix2fv: function(location, transpose, value) {
            if (location instanceof JebGLUniformLocation) {
                var count = 1;
                if (transpose) {
                    this.addCall(this.CALL_UNIFORM_MATRIX2FV, [location.id, count, 1], [value[0], value[1], value[2], value[3]]);
                } else {
                    this.addCall(this.CALL_UNIFORM_MATRIX2FV, [location.id, count, 0], [value[0], value[1], value[2], value[3]]);
                }
            } else if (typeof(location) == "undefined" || location == null) {
                // Don't throw, cf. WebGL conformance test
                return
            } else {
                throw new Error("uniformMatrix2fv: invalid argument");
            }
        },

        uniformMatrix3fv: function(location, transpose, value) {
            if (location instanceof JebGLUniformLocation) {
                var count = 1;
                if (transpose) {
                    this.addCall(this.CALL_UNIFORM_MATRIX3FV, [location.id, count, 1], [value[0], value[1], value[2], value[3], value[4], value[5], value[6], value[7], value[8]]);
                } else {
                    this.addCall(this.CALL_UNIFORM_MATRIX3FV, [location.id, count, 0], [value[0], value[1], value[2], value[3], value[4], value[5], value[6], value[7], value[8]]);
                }
            } else if (typeof(location) == "undefined" || location == null) {
                // Don't throw, cf. WebGL conformance test
                return
            } else {
                throw new Error("uniformMatrix3fv: invalid argument");
            }
        },

        uniformMatrix4fv: function(location, transpose, value) {
            if (location instanceof JebGLUniformLocation) {
                var count = 1;
                if (transpose) {
                    this.addCall(this.CALL_UNIFORM_MATRIX4FV, [location.id, count, 1], [value[0], value[1], value[2], value[3], value[4], value[5], value[6], value[7], value[8], value[9], value[10], value[11], value[12], value[13], value[14], value[15]]);
                } else {
                    this.addCall(this.CALL_UNIFORM_MATRIX4FV, [location.id, count, 0], [value[0], value[1], value[2], value[3], value[4], value[5], value[6], value[7], value[8], value[9], value[10], value[11], value[12], value[13], value[14], value[15]]);
                }
            } else if (typeof(location) == "undefined" || location == null) {
                // Don't throw, cf. WebGL conformance test
                return
            } else {
                throw new Error("uniformMatrix4fv: invalid argument");
            }
        },

        useProgram: function(program) {
            if (program instanceof JebGLProgram) {
                this.addCall(this.CALL_USE_PROGRAM, [program.id], []);
            } else if (typeof(program) == "undefined" || program == null) {
                // Don't throw, cf. WebGL conformance test
                return;
            } else {
                throw new TypeError("useProgram: invalid argument");
            }
        },

        validateProgram: function(program) {
            if (!(program instanceof JebGLProgram)) 
                throw new TypeError("validateProgram: not a JebGLProgram");
            this.addCall(this.CALL_VALIDATE_PROGRAM, [program.id], []);
        },

        vertexAttrib1f: function(indx, x) {
            this.addCall(this.CALL_VERTEX_ATTRIB1F, [indx], [x]);
        },

        vertexAttrib1fv: function(indx, value) {
            this.addCall(this.CALL_VERTEX_ATTRIB1F, [indx], 
                         [value[0]]);
        },

        vertexAttrib2f: function(indx, x, y) {
            this.addCall(this.CALL_VERTEX_ATTRIB2F, [indx], [x, y]);
        },

        vertexAttrib2fv: function(indx, value) {
            this.addCall(this.CALL_VERTEX_ATTRIB2F, [indx], 
                         [value[0], value[1]]);
        },

        vertexAttrib3f: function(indx, x, y, z) {
            this.addCall(this.CALL_VERTEX_ATTRIB3F, [indx], [x, y, z]);
        },

        vertexAttrib3fv: function(indx, value) {
            this.addCall(this.CALL_VERTEX_ATTRIB3F, [indx], 
                         [value[0], value[1], value[2]]);
        },

        vertexAttrib4f: function(indx, x, y, z, w) {
            this.addCall(this.CALL_VERTEX_ATTRIB4F, [indx], [x, y, z, w]);
        },

        vertexAttrib4fv: function(indx, value) {
            this.addCall(this.CALL_VERTEX_ATTRIB4F, [indx], 
                         [value[0], value[1], value[2], value[3]]);
        },

        vertexAttribPointer: function(indx, size, type, normalized, stride, offset) {
            if (normalized) {
                this.addCall(this.CALL_VERTEX_ATTRIB_POINTER, [indx, size, type, 1, stride, offset], []);
            } else {
                this.addCall(this.CALL_VERTEX_ATTRIB_POINTER, [indx, size, type, 0, stride, offset], []);
            }
        },

        viewport: function(x, y, width, height) {
            this.addCall(this.CALL_VIEWPORT, [x, y, width, height], []);
        }

    }

    function waitForApplet(container, applet, f) {
        // Wait for initial applet load
        if (typeof(applet.getSubApplet) == "undefined" || typeof(applet.getSubApplet) == "object") { // The latter part handles a Chrome bug
            setTimeout(function () { waitForApplet(container, applet, f) }, 50);
            return;
        }
        // Get sub applet
        if (typeof(applet.getSubApplet()) == "undefined" || applet.getSubApplet() == null) {
            setTimeout(function () { waitForApplet(container, applet, f) }, 50);
            return;
        }
        // Applet sometimes doesn't reload correctly. This catches that state.
        if (typeof(applet.getSubApplet().ready) != "boolean" || !applet.getSubApplet().ready) {
            // Nearly ready, don't wait as long
            setTimeout(function () { waitForApplet(container, applet, f) }, 50);
            return;
        }

        // Add getContext function to applet
        var gl = new JebGLRenderingContext(applet);
        gl.clearColor(0,0,0,0); // Clear the canvas for noise
        gl.clear(gl.COLOR_BUFFER_BIT);
        container.getContext = function () { return gl; };

        // If we made it here we're ready
        f();
    }

    // JebGL event handler - called from the applet and delegates the event
    window.jebglEvent = {
        list: [],
        register: function(element) {
            var list = window.jebglEvent.list;

            // Add element to listener list
            list.push(element);
        },
        fire: function(event) {
            var list = window.jebglEvent.list,
                webkitCheck = /Safari/i,
                chromeCheck = /Chrome/i,
                evt;
            // Create DOM event
            if (document.createEventObject) {
                // IE
                evt = document.createEventObject();
                switch (event.type) {
                case "mouse":
                    for (var i=0, l=list.length; i<l; i++) {
                        // Mouse events are triggered on the DOM element
                        var element = list[i],
                            par = element,
                            top = 0,
                            left = 0;
                        // IE offset calculation
                        do { 
                            top += par.offsetTop,
                            left += par.offsetLeft;
                        } while (par = par.offsetParent);
                        evt.clientX = event.x + left;
                        evt.clientY = event.y + top; 
                        evt.screenX = evt.clientX + window.screenLeft;
                        evt.screenY = evt.clientY + window.screenTop;
                        evt.button = event.button;
                        switch (event.action) {
                        case "move":
                            evt.setAttribute("type","mousemove");
                            element.fireEvent('onmousemove', evt);
                            break;
                        case "down":
                            evt.setAttribute("type","mousedown");
                            element.fireEvent('onmousedown', evt);
                            break;
                        case "up":
                            evt.setAttribute("type","mouseup");
                            element.fireEvent('onmouseup', evt);
                            break;
                        case "click":
                            evt.setAttribute("type","click");
                            element.fireEvent('onclick', evt);
                            break;
                        case "over":
                            evt.setAttribute("type","mouseover");
                            element.fireEvent('onmouseover', evt);
                            break;
                        case "out":
                            evt.setAttribute("type","mouseout");
                            element.fireEvent('onmouseout', evt);
                            break;
                        case "wheel":
                            throw new Error("not implemented");
                            break;
                        }
                    }
                    break;
                case "key":
                    // Keyboard events are triggered on document
                    evt.keyCode = event.keyCode || event.keyChar.charCodeAt(0);
                    switch (event.action) {
                    case "down":
                        evt.setAttribute("type","keydown");
                        document.fireEvent('onkeydown', evt);
                        break;
                    case "up":
                        evt.setAttribute("type","keyup");
                        document.fireEvent('onkeyup', evt);
                        break;
                    case "press":
                        evt.setAttribute("type","keypress");
                        document.fireEvent('onkeypress', evt);
                        break;
                    }
                    break;
                }
            } else {
                // FF, Chrome, etc.
                switch (event.type) {
                case "mouse":
                    evt = document.createEvent("MouseEvents");
                    for (var i=0, l=list.length; i<l; i++) {
                        var element = list[i],
                            top = element.offsetTop,
                            left = element.offsetLeft,
                            clientX = event.x + left,
                            clientY = event.y + top,
                            screenX,
                            screenY;
                        if (typeof(window.mozInnerScreenX) != "undefined") {
                            // Firefox has a way to get this
                            screenX = clientX + window.mozInnerScreenX;
                            screenY = clientY + window.mozInnerScreenY;
                        } else {
                            // This does not account for toolbars etc.
                            // Alternatively we could steal the offset from a
                            // regular dom click. We only need one per resize
                            screenX = clientX + window.screenX;
                            screenY = clientY + window.screenY;
                        }
                        switch (event.action) {
                        case "move":
                            evt.initMouseEvent('mousemove', true, true, window, 
                                               0, screenX, screenY, clientX, 
                                               clientY, false, false, 
                                               false, false, event.button, null);
                            break;
                        case "down":
                            evt.initMouseEvent('mousedown', true, true, window, 
                                               0, screenX, screenY, clientX, 
                                               clientY, false, false, 
                                               false, false, event.button, null);
                            break;
                        case "up":
                            evt.initMouseEvent('mouseup', true, true, window, 
                                               0, screenX, screenY, clientX, 
                                               clientY, false, false, 
                                               false, false, event.button, null);
                            break;
                        case "click":
                            evt.initMouseEvent('click', true, true, window, 
                                               0, screenX, screenY, clientX, 
                                               clientY, false, false, 
                                               false, false, event.button, null);
                            break;
                        case "over":
                            evt.initMouseEvent('mouseover', true, true, window, 
                                               0, screenX, screenY, clientX, 
                                               clientY, false, false, 
                                               false, false, event.button, null);
                            break;
                        case "out":
                            evt.initMouseEvent('mouseout', true, true, window, 
                                               0, screenX, screenY, clientX, 
                                               clientY, false, false, 
                                               false, false, event.button, null);
                            break;
                        case "wheel":
                            throw new Error("not implemented");
                            break;
                        }
                        // Mouse events are triggered on the DOM element
                        if (typeof(navigator.userAgent) != "undefined" && webkitCheck.test(navigator.userAgent) && !chromeCheck.test(navigator.userAgent)) {
                            // Safari fires most event already, so only fire move 
                            if (evt.type == "mousemove") element.dispatchEvent(evt);
                        } else {
                            element.dispatchEvent(evt);
                        }
                    }
                    break;
                case "key":
                    if (!window.opera) {
                        evt = document.createEvent("KeyboardEvent");
                        if (evt.initKeyEvent) {
                            evt.initKeyEvent('key' + event.action, true, true, null, 
                                             false, false, false, false, 
                                             event.keyCode, 
                                             event.keyChar.charCodeAt(0));
                        } else {
                            // FIXME: this doesn't work because of a webkit bug:
                            // https://bugs.webkit.org/show%5Fbug.cgi?id=16735
                            // evt.initKeyboardEvent('key' + event.action, true, true, null,
                            //                      event.keyChar, 0);
                            
                            // Webkit - try and run with a fake event
                            var fevt = { keyCode: event.keyCode || event.keyChar.charCodeAt(0),
                                charCode: event.keyChar.charCodeAt(0) };
                            if (event.action == "down" && typeof(document.onkeydown) != "undefined" && document.onkeydown != null) {
                                fevt.type = "keydown";
                                document.onkeydown(fevt);
                            }
                            if (event.action == "press" && typeof(document.onkeypress) != "undefined" && document.onkeypress != null) {
                                fevt.type = "keypress";
                                document.onkeypress(fevt);
                            }
                            if (event.action == "up" && typeof(document.onkeyup) != "undefined" && document.onkeyup != null) {
                                fevt.type = "keyup";
                                document.onkeyup(fevt);
                            }
                        }
                        // Keyboard events are triggered on document
                        document.dispatchEvent(evt);
                        break;
                    } else {
                        // Opera - try and run with a fake event
                        var fevt = { keyCode: event.keyCode || event.keyChar.charCodeAt(0),
                            charCode: event.keyChar.charCodeAt(0) };
                        if (event.action == "down" && typeof(document.onkeydown) != "undefined" && document.onkeydown != null) {
                            fevt.type = "keydown";
                            document.onkeydown(fevt);
                        }
                        if (event.action == "press" && typeof(document.onkeypress) != "undefined" && document.onkeypress != null) {
                            fevt.type = "keypress";
                            document.onkeypress(fevt);
                        }
                        if (event.action == "up" && typeof(document.onkeyup) != "undefined" && document.onkeyup != null) {
                            fevt.type = "keyup";
                            document.onkeyup(fevt);
                        }
                    }
                }
            }
        }
    }

    window.jebgl = function(canvas, callback, settings) {
        // Calls callback when applet is fully ready
        if (typeof(canvas) == "undefined") throw new Error("Canvas unspecified.");

        // Default settings
        var jebglJar = "http://jebgl.googlecode.com/files/jebgl-0.1.jar",
            jarLocation = "http://jebgl.googlecode.com/svn/webstart/",
            jnlpLocation = "http://jebgl.googlecode.com/svn/webstart/",
            alwaysApplet = false,
            development = false;

        if (typeof(settings) != "undefined") {
            if (typeof(settings.jebglJar) != "undefined") jebglJar = settings.jebglJar;
            if (typeof(settings.jarLocation) != "undefined") jarLocation = settings.jarLocation;
            if (typeof(settings.jnlpLocation) != "undefined") jnlpLocation = settings.jnlpLocation;
            if (typeof(settings.development) != "undefined") development = settings.development;
            if (typeof(settings.alwaysApplet) != "undefined") alwaysApplet = settings.alwaysApplet;
        }

        // Add timestamp to jebgl.jar in development mode (cache busting)
        if (development) jebglJar += "?" + new Date().getTime();

        if (typeof(canvas.getContext) != "undefined") {
            try {
                var c = canvas.getContext("experimental-webgl");
                if (c != null && !development && !alwaysApplet) {
                    callback();
                    return;
                }
            } catch (e) {
                // Do nothing
            }
        }

        // Ready container element
        var container = document.createElement("div");
        
        // Emulate width and height attributes
        container.width = canvas.width || 300;
        container.height = canvas.height || 150;

        // Copy inline CSS
        if (canvas.style.cssText)
            container.style.cssText = canvas.style.cssText;

        // Make sure size is set correctly
        container.style.width = container.width + 'px';
        container.style.height = container.height + 'px';

        // Copy attributes
        for (i = 0; i < canvas.attributes.length; i++) {
            container.setAttribute(canvas.attributes[i].nodeName, canvas.attributes[i].nodeValue);
        }

        // Ready applet element
        var applet = document.createElement("applet");
        applet.setAttribute("code", "org.jdesktop.applet.util.JNLPAppletLauncher");
        applet.setAttribute("width", canvas.width);
        applet.setAttribute("height", canvas.height);

        // Set applet css
        applet.style.cssText = "position: absolute;";

        var appletParameters = [
            ['archive', jarLocation + 'applet-launcher.jar,' + jarLocation + 'jogl.all.jar,' + jarLocation + 'nativewindow.all.jar,' + jarLocation + 'gluegen-rt.jar,' + jarLocation + 'newt.all.jar,' + jebglJar],
            ['codebase_lookup', 'false'],
            ['subapplet.classname', 'com.iola.JebGL'],
            ['subapplet.displayname', 'JebGL Applet'],
            ['separate_jvm', 'true'],
            ['noddraw.check', 'true'],
            ['progressbar', 'true'],
            ['mayscript', 'true'],
            ['jnlpNumExtensions', '1'],
            ['jnlpExtension1', jnlpLocation + 'jogl-core.jnlp']];
        
        for (var i=0, l=appletParameters.length; i<l; i++) {
            var p = document.createElement("param");
            p.setAttribute("name", appletParameters[i][0]);
            p.setAttribute("value", appletParameters[i][1]);
            applet.appendChild(p);
        }

        // Add applet to container
        container.appendChild(applet);

        // Register container with event handler
        window.jebglEvent.register(container);

        // replace the canvas with the container
        canvas.parentNode.replaceChild(container, canvas);

        // wait for the applet to load
        waitForApplet(container, applet, callback);
    }

})();
