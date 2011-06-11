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
 * Make fake ArrayViews for browsers that don't know them
 */

if (typeof(Float32Array) == "undefined") {
    Float32Array = function(a) {
        var o = { length: a.length };
        for (var i = 0, l = a.length; i<l; i++) {
            o[i] = a[i];
        }
        return o;
    }
}

if (typeof(Uint16Array) == "undefined") {
    Uint16Array = function(a) {
        var o = { length: a.length };
        for (var i = 0, l = a.length; i<l; i++) {
            o[i] = a[i];
        }
        return o;
    }
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

function JebGLCanvas(applet) {
    // Store applet as canvas and get the actual JebGL applet
    this.canvas = applet;
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
        "FRAMEBUFFER_COMPLETE",
        "FRAMEBUFFER_INCOMPLETE_ATTACHMENT",
        "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT",
        "FRAMEBUFFER_INCOMPLETE_DIMENSIONS",
        "FRAMEBUFFER_UNSUPPORTED",
        "FRAMEBUFFER_BINDING",
        "RENDERBUFFER_BINDING",
        "MAX_RENDERBUFFER_SIZE",
        "INVALID_FRAMEBUFFER_OPERATION",
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

JebGLCanvas.prototype = {
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
        if (!(program instanceof JebGLProgram)) 
            throw new TypeError("attachShader: not a JebGLProgram");
        if (!(shader instanceof JebGLShader)) 
            throw new TypeError("attachShader: not a JebGLShader");
        this.addCall(this.CALL_ATTACH_SHADER, [program.id, shader.id], []);
    },

    bindAttribLocation: function(program, index, name) {
        // Before calling gl methods directly we submit the call list
        this.submit();
        if (!(program instanceof JebGLProgram)) 
            throw new TypeError("bindAttribLocation: not a JebGLProgram");
        try {
            this.JebApp.glBindAttribLocation(program.id, index, name);
        } catch (e) {
            throw new Error(e);
        }
    },
    
    bindBuffer: function(target, buffer) {
        if (buffer instanceof JebGLBuffer) {
            this.addCall(this.CALL_BIND_BUFFER, [target, buffer.id], []);
        } else if (buffer === null) {
            this.addCall(this.CALL_BIND_BUFFER, [target, 0], []);
        } else {
            throw new TypeError("bindBuffer: not a JebGLBuffer");
        }
    },

    bindFramebuffer: function(target, framebuffer) {
        if (framebuffer instanceof JebGLFramebuffer) {
            this.addCall(this.CALL_BIND_FRAMEBUFFER, [target, framebuffer.id], []);
        } else if (framebuffer === null) {
            this.addCall(this.CALL_BIND_FRAMEBUFFER, [target, 0], []);
        } else {
            throw new TypeError("bindFramebuffer: not a JebGLFramebuffer");
        }
    },

    bindRenderbuffer: function(target, renderbuffer) {
        if (renderbuffer instanceof JebGLRenderbuffer) {
            this.addCall(this.CALL_BIND_RENDERBUFFER, [target, renderbuffer.id], []);
        } else if (renderbuffer === null) {
            this.addCall(this.CALL_BIND_RENDERBUFFER, [target, 0], []);
        } else { 
            throw new TypeError("bindRenderbuffer: not a JebGLRenderbuffer");
        }
    },

    bindTexture: function(target, texture) {
        if (texture instanceof JebGLTexture) {
            this.addCall(this.CALL_BIND_TEXTURE, [target, texture.id], []);
        } else if (texture === null) {
            this.addCall(this.CALL_BIND_TEXTURE, [target, 0], []);
        } else {
            throw new TypeError("bindTexture: not a JebGLTexture");
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
    },

    bufferSubData: function(target, offset, data) {
        throw new Error("Not implemented");
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
        } else {
            throw new TypeError("compileShader: not a JebGLShader");
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
        if (!(program instanceof JebGLProgram)) 
            throw new TypeError("detachShader: not a JebGLProgram");
        if (!(shader instanceof JebGLShader)) 
            throw new TypeError("detachShader: not a JebGLShader");
        this.addCall(this.CALL_DETACH_SHADER, [program.id, shader.id], []);
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
        if (!(renderbuffer instanceof JebGLRenderbuffer))
            throw new TypeError("framebufferRenderbuffer: not a JebGLRenderbuffer");
        this.addCall(this.CALL_FRAMEBUFFER_RENDERBUFFER, [target, attachment,
                                                          renderbuffertarget,
                                                          renderbuffer.id], []);
    },

    framebufferTexture2D: function(target, attachment, textarget,
                                   texture, level) {
        if (!(texture instanceof JebGLTexture))
            throw new TypeError("framebufferTexture2D: not a JebGLTexture");
        this.addCall(this.CALL_FRAMEBUFFER_TEXTURE_2D, [target, attachment,
                                                        textarget, texture.id,
                                                        level], []);
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
        throw new Error("FIXME: not implemented");
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
        // Before calling gl methods directly we submit the call list
        this.submit();
        if (!(program instanceof JebGLProgram)) 
            throw new TypeError("getProgramParameter: not a JebGLProgram");
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
    },

    getProgramInfoLog: function(program) {
        // Before calling gl methods directly we submit the call list
        this.submit();
        if (!(program instanceof JebGLProgram)) 
            throw new TypeError("getProgramInfoLog: not a JebGLProgram");
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
        // Before calling gl methods directly we submit the call list
        this.submit();
        if (!(shader instanceof JebGLShader)) 
            throw new TypeError("getShaderParameter: not a JebGLShader");
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
    },

    getShaderInfoLog: function(shader) {
        // Before calling gl methods directly we submit the call list
        this.submit();
        if (!(shader instanceof JebGLShader)) 
            throw new TypeError("getShaderInfoLog: not a JebGLShader");
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
    },

    getShaderSource: function(shader) {
        // Before calling gl methods directly we submit the call list
        this.submit();
        if (!(shader instanceof JebGLShader)) 
            throw new TypeError("getShaderSource: not a JebGLShader");
        try {
            var source = this.JebApp.glGetShaderSource(shader.id);
        } catch (e) {
            throw new Error(e);
        }
        var out = "";
        for (var i = 0, l = source.length; i<l; i++) {
            out += String.fromCharCode(source[i]);
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
        // Before calling gl methods directly we submit the call list
        this.submit();
        if (!(program instanceof JebGLProgram)) 
            throw new TypeError("getUniform: not a JebGLProgram");
        try {
            return this.JebApp.glGetUniform(program.id, location);
        } catch (e) {
            throw new Error(e);
        }
    },

    getUniformLocation: function(program, name) {
        // Before calling gl methods directly we submit the call list
        this.submit();
        if (!(program instanceof JebGLProgram)) 
            throw new TypeError("getUniformLocation: not a JebGLProgram");
        try {
            return this.JebApp.glGetUniformLocation(program.id, name);
        } catch (e) {
            throw new Error(e);
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
        if (!(program instanceof JebGLProgram)) 
            throw new TypeError("linkProgram: not a JebGLProgram");
        this.addCall(this.CALL_LINK_PROGRAM, [program.id], []);
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
        // Before calling gl methods directly we submit the call list
        this.submit();
        if (!(shader instanceof JebGLShader)) 
            throw new TypeError("shaderSource: not a JebGLShader");
        try {
            this.JebApp.glShaderSource(shader.id, source);
        } catch (e) {
            throw new Error(e);
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
        this.addCall(this.CALL_UNIFORM1F, [location], [x]);
    },

    uniform1fv: function(location, value) {
        this.addCall(this.CALL_UNIFORM1F, [location], [value[0]]);
    },

    uniform1i: function(location, x) {
        if (x === true) {
            this.addCall(this.CALL_UNIFORM1I, [location, this.TRUE], []);
        } else if (x === false) {
            this.addCall(this.CALL_UNIFORM1I, [location, this.FALSE], []);
        } else {
            this.addCall(this.CALL_UNIFORM1I, [location, x], []);
        }
    },

    uniform1iv: function(location, value) {
        this.addCall(this.CALL_UNIFORM1I, [location, value[0]], []);
    },

    uniform2f: function(location, x, y) {
        this.addCall(this.CALL_UNIFORM2F, [location], [x, y]);
    },

    uniform2fv: function(location, value) {
        this.addCall(this.CALL_UNIFORM2F, [location], [value[0], value[1]]);
    },

    uniform2i: function(location, x, y) {
        this.addCall(this.CALL_UNIFORM2I, [location, x, y], []);
    },

    uniform2iv: function(location, value) {
        this.addCall(this.CALL_UNIFORM2I, [location, value[0], value[1]], []);
    },

    uniform3f: function(location, x, y, z) {
        this.addCall(this.CALL_UNIFORM3F, [location], [x, y, z]);
    },

    uniform3fv: function(location, value) {
        this.addCall(this.CALL_UNIFORM3F, [location], 
                     [value[0], value[1], value[2]]);
    },

    uniform3i: function(location, x, y, z) {
        this.addCall(this.CALL_UNIFORM3I, [location, x, y, z], []);
    },

    uniform3iv: function(location, value) {
        this.addCall(this.CALL_UNIFORM3I, [location, value[0], 
                                           value[1], value[2]], []);
    },

    uniform4f: function(location, x, y, z, w) {
        this.addCall(this.CALL_UNIFORM4F, [location], [x, y, z, w]);
    },

    uniform4fv: function(location, value) {
        this.addCall(this.CALL_UNIFORM4F, [location], 
                     [value[0], value[1], value[2], value[3]]);
    },

    uniform4i: function(location, x, y, z, w) {
        this.addCall(this.CALL_UNIFORM4I, [location, x, y, z, w], []);
    },

    uniform4iv: function(location, value) {
        this.addCall(this.CALL_UNIFORM4I, [location, value[0], value[1], 
                                           value[2], value[3]], []);
    },

    uniformMatrix2fv: function(location, transpose, value) {
        var count = 1;
        if (transpose) {
            this.addCall(this.CALL_UNIFORM_MATRIX2FV, [location, count, 1], [value[0], value[1], value[2], value[3]]);
        } else {
            this.addCall(this.CALL_UNIFORM_MATRIX2FV, [location, count, 0], [value[0], value[1], value[2], value[3]]);
        }
    },

    uniformMatrix3fv: function(location, transpose, value) {
        var count = 1;
        if (transpose) {
            this.addCall(this.CALL_UNIFORM_MATRIX3FV, [location, count, 1], [value[0], value[1], value[2], value[3], value[4], value[5], value[6], value[7], value[8]]);
        } else {
            this.addCall(this.CALL_UNIFORM_MATRIX3FV, [location, count, 0], [value[0], value[1], value[2], value[3], value[4], value[5], value[6], value[7], value[8]]);
        }
    },

    uniformMatrix4fv: function(location, transpose, value) {
        var count = 1;
        if (transpose) {
            this.addCall(this.CALL_UNIFORM_MATRIX4FV, [location, count, 1], [value[0], value[1], value[2], value[3], value[4], value[5], value[6], value[7], value[8], value[9], value[10], value[11], value[12], value[13], value[14], value[15]]);
        } else {
            this.addCall(this.CALL_UNIFORM_MATRIX4FV, [location, count, 0], [value[0], value[1], value[2], value[3], value[4], value[5], value[6], value[7], value[8], value[9], value[10], value[11], value[12], value[13], value[14], value[15]]);
        }
    },

    useProgram: function(program) {
        if (!(program instanceof JebGLProgram)) 
            throw new TypeError("useProgram: not a JebGLProgram");
        this.addCall(this.CALL_USE_PROGRAM, [program.id], []);
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

function waitForApplet(applet, f) {
    // Wait for initial applet load
    if (typeof(applet.getSubApplet) == "undefined" || typeof(applet.getSubApplet) == "object") { // The latter part handles a Chrome bug
        setTimeout(function () { waitForApplet(applet, f) }, 50);
        return;
    }
    // Get sub applet
    if (typeof(applet.getSubApplet()) == "undefined" || applet.getSubApplet() == null) {
        setTimeout(function () { waitForApplet(applet, f) }, 50);
        return;
    }
    // Applet sometimes doesn't reload correctly. This catches that state.
    if (typeof(applet.getSubApplet().ready) != "boolean" || !applet.getSubApplet().ready) {
        // Nearly ready, don't wait as long
        setTimeout(function () { waitForApplet(applet, f) }, 50);
        return;
    }

    // Add getContext function to applet
    applet.getContext = function () { return new JebGLCanvas(applet); };

    // If we made it here we're ready
    f();
}

    window.jebgl = function(canvas, callback, settings) {
    // Calls callback when applet is fully ready

    // Default settings
    var jebglJar = "http://jebgl.googlecode.com/files/jebgl-0.1.jar",
        jarLocation = "http://jebgl.googlecode.com/svn/webstart/",
        jnlpLocation = "http://jebgl.googlecode.com/svn/webstart/",
        alwaysApplet = false;

    if (typeof(settings) != "undefined") {
        if (typeof(settings.jebglJar) != "undefined") jebglJar = settings.jebglJar;
        if (typeof(settings.jarLocation) != "undefined") jarLocation = settings.jarLocation;
        if (typeof(settings.jnlpLocation) != "undefined") jnlpLocation = settings.jnlpLocation;
        if (typeof(settings.alwaysApplet) != "undefined") alwaysApplet = settings.alwaysApplet;
    }

    if (typeof(canvas.getContext) != "undefined") {
        try {
            var c = canvas.getContext("experimental-webgl");
            if (c != null && !alwaysApplet) {
                callback();
                return;
            }
        } catch (e) {
            // Do nothing
        }
    }

    // Ready applet element
    var applet = document.createElement("applet");
    applet.setAttribute("code", "org.jdesktop.applet.util.JNLPAppletLauncher");
    applet.setAttribute("width", canvas.offsetWidth);
    applet.setAttribute("height", canvas.offsetHeight);

    // Copy attributes
    for (i = 0; i < canvas.attributes.length; i++) {
        applet.setAttribute(canvas.attributes[i].nodeName, canvas.attributes[i].nodeValue);
    }

    // Copy inline CSS
    applet.style.cssText = canvas.style.cssText;

    var appletParameters = [
        ['archive', jarLocation + '/applet-launcher.jar,' + jarLocation + '/jogl.all.jar,' + jarLocation + '/nativewindow.all.jar,' + jarLocation + '/gluegen-rt.jar,' + jebglJar],
        ['codebase_lookup', 'false'],
        ['subapplet.classname', 'com.iola.JebGL'],
        ['subapplet.displayname', 'JebGL Applet'],
        ['separate_jvm', 'true'],
        ['noddraw.check', 'true'],
        ['progressbar', 'true'],
        ['jnlpNumExtensions', '1'],
        ['jnlpExtension1', jnlpLocation + '/jogl-core.jnlp']];
        
    for (var i=0, l=appletParameters.length; i<l; i++) {
        var p = document.createElement("param");
        p.setAttribute("name", appletParameters[i][0]);
        p.setAttribute("value", appletParameters[i][1]);
        applet.appendChild(p);
    }

    // replace the canvas with the applet
    canvas.parentNode.replaceChild(applet, canvas);

    // wait for the applet to load
    waitForApplet(applet, callback);
}

})();
