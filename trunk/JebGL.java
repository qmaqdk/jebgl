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

package com.iola;

import java.applet.*;
import java.awt.*;
import com.jogamp.newt.event.KeyAdapter;
import com.jogamp.newt.event.KeyEvent;
import com.jogamp.newt.event.KeyListener;
import com.jogamp.newt.event.MouseAdapter;
import com.jogamp.newt.event.MouseEvent;
import com.jogamp.newt.event.MouseListener;
import com.jogamp.newt.event.awt.AWTKeyAdapter;
import com.jogamp.newt.event.awt.AWTMouseAdapter;
import java.nio.*;
import java.net.URL;
import java.net.MalformedURLException;
import java.awt.image.PixelGrabber;
import java.awt.MediaTracker;
import javax.media.opengl.GLProfile;
import javax.media.opengl.GLRunnable;
//import javax.media.opengl.DebugGL2;
import javax.media.opengl.GLCapabilities;
import javax.media.opengl.GL2;
import javax.media.opengl.GLAutoDrawable;
import javax.media.opengl.GLException;
import javax.media.opengl.awt.GLCanvas;
import com.jogamp.opengl.util.AnimatorBase;
import javax.media.opengl.GLAnimatorControl;

public class JebGL extends Applet {
    private GLAnimatorControl animator;

    // WebGL specific settings
    private int unpack_flip_y_webgl = this.GL_FALSE;
    private int unpack_premultiply_alpha_webgl = this.GL_FALSE;
    private int unpack_colorspace_conversion_webgl = this.GL_BROWSER_DEFAULT_WEBGL;

    public GLCanvas canvas;
    public boolean ready = false;

    private MediaTracker mt; // MediaTracker

    private int[] message = new int[0]; // Messages returned to browser

    /* Ready all WebGL enums, cf
     * http://www.khronos.org/registry/webgl/specs/latest/#5.13
     */

    /* ClearBufferMask */
    public static final int GL_DEPTH_BUFFER_BIT = GL2.GL_DEPTH_BUFFER_BIT;
    public static final int GL_STENCIL_BUFFER_BIT = GL2.GL_STENCIL_BUFFER_BIT;
    public static final int GL_COLOR_BUFFER_BIT = GL2.GL_COLOR_BUFFER_BIT;
    /* BeginMode */
    public static final int GL_POINTS = GL2.GL_POINTS;
    public static final int GL_LINES = GL2.GL_LINES;
    public static final int GL_LINE_LOOP = GL2.GL_LINE_LOOP;
    public static final int GL_LINE_STRIP = GL2.GL_LINE_STRIP;
    public static final int GL_TRIANGLES = GL2.GL_TRIANGLES;
    public static final int GL_TRIANGLE_STRIP = GL2.GL_TRIANGLE_STRIP;
    public static final int GL_TRIANGLE_FAN = GL2.GL_TRIANGLE_FAN;
    /* BlendingFactorDest */
    public static final int GL_ZERO = GL2.GL_ZERO;
    public static final int GL_ONE = GL2.GL_ONE;
    public static final int GL_SRC_COLOR = GL2.GL_SRC_COLOR;
    public static final int GL_ONE_MINUS_SRC_COLOR = GL2.GL_ONE_MINUS_SRC_COLOR;
    public static final int GL_SRC_ALPHA = GL2.GL_SRC_ALPHA;
    public static final int GL_ONE_MINUS_SRC_ALPHA = GL2.GL_ONE_MINUS_SRC_ALPHA;
    public static final int GL_DST_ALPHA = GL2.GL_DST_ALPHA;
    public static final int GL_ONE_MINUS_DST_ALPHA = GL2.GL_ONE_MINUS_DST_ALPHA;
    /* BlendingFactorSrc */
    public static final int GL_DST_COLOR = GL2.GL_DST_COLOR;
    public static final int GL_ONE_MINUS_DST_COLOR = GL2.GL_ONE_MINUS_DST_COLOR;
    public static final int GL_SRC_ALPHA_SATURATE = GL2.GL_SRC_ALPHA_SATURATE;
    /* BlendEquationSeparate */
    public static final int GL_FUNC_ADD = GL2.GL_FUNC_ADD;
    public static final int GL_BLEND_EQUATION = GL2.GL_BLEND_EQUATION;
    public static final int GL_BLEND_EQUATION_RGB = GL2.GL_BLEND_EQUATION_RGB;
    public static final int GL_BLEND_EQUATION_ALPHA = GL2.GL_BLEND_EQUATION_ALPHA;
    /* BlendSubtract */
    public static final int GL_FUNC_SUBTRACT = GL2.GL_FUNC_SUBTRACT;
    public static final int GL_FUNC_REVERSE_SUBTRACT = GL2.GL_FUNC_REVERSE_SUBTRACT;
    /* Separate Blend Functions */
    public static final int GL_BLEND_DST_RGB = GL2.GL_BLEND_DST_RGB;
    public static final int GL_BLEND_SRC_RGB = GL2.GL_BLEND_SRC_RGB;
    public static final int GL_BLEND_DST_ALPHA = GL2.GL_BLEND_DST_ALPHA;
    public static final int GL_BLEND_SRC_ALPHA = GL2.GL_BLEND_SRC_ALPHA;
    public static final int GL_CONSTANT_COLOR = GL2.GL_CONSTANT_COLOR;
    public static final int GL_ONE_MINUS_CONSTANT_COLOR = GL2.GL_ONE_MINUS_CONSTANT_COLOR;
    public static final int GL_CONSTANT_ALPHA = GL2.GL_CONSTANT_ALPHA;
    public static final int GL_ONE_MINUS_CONSTANT_ALPHA = GL2.GL_ONE_MINUS_CONSTANT_ALPHA;
    public static final int GL_BLEND_COLOR = GL2.GL_BLEND_COLOR;
    /* Buffer Objects */
    public static final int GL_ARRAY_BUFFER = GL2.GL_ARRAY_BUFFER;
    public static final int GL_ELEMENT_ARRAY_BUFFER = GL2.GL_ELEMENT_ARRAY_BUFFER;
    public static final int GL_ARRAY_BUFFER_BINDING = GL2.GL_ARRAY_BUFFER_BINDING;
    public static final int GL_ELEMENT_ARRAY_BUFFER_BINDING = GL2.GL_ELEMENT_ARRAY_BUFFER_BINDING;
    public static final int GL_STREAM_DRAW = GL2.GL_STREAM_DRAW;
    public static final int GL_STATIC_DRAW = GL2.GL_STATIC_DRAW;
    public static final int GL_DYNAMIC_DRAW = GL2.GL_DYNAMIC_DRAW;
    public static final int GL_BUFFER_SIZE = GL2.GL_BUFFER_SIZE;
    public static final int GL_BUFFER_USAGE = GL2.GL_BUFFER_USAGE;
    public static final int GL_CURRENT_VERTEX_ATTRIB = GL2.GL_CURRENT_VERTEX_ATTRIB;
    /* CullFaceMode */
    public static final int GL_FRONT = GL2.GL_FRONT;
    public static final int GL_BACK = GL2.GL_BACK;
    public static final int GL_FRONT_AND_BACK = GL2.GL_FRONT_AND_BACK;
    /* EnableCap */
    public static final int GL_CULL_FACE = GL2.GL_CULL_FACE;
    public static final int GL_BLEND = GL2.GL_BLEND;
    public static final int GL_DITHER = GL2.GL_DITHER;
    public static final int GL_STENCIL_TEST = GL2.GL_STENCIL_TEST;
    public static final int GL_DEPTH_TEST = GL2.GL_DEPTH_TEST;
    public static final int GL_SCISSOR_TEST = GL2.GL_SCISSOR_TEST;
    public static final int GL_POLYGON_OFFSET_FILL = GL2.GL_POLYGON_OFFSET_FILL;
    public static final int GL_SAMPLE_ALPHA_TO_COVERAGE = GL2.GL_SAMPLE_ALPHA_TO_COVERAGE;
    public static final int GL_SAMPLE_COVERAGE = GL2.GL_SAMPLE_COVERAGE;
    /* ErrorCode */
    public static final int GL_NO_ERROR = GL2.GL_NO_ERROR;
    public static final int GL_INVALID_ENUM = GL2.GL_INVALID_ENUM;
    public static final int GL_INVALID_VALUE = GL2.GL_INVALID_VALUE;
    public static final int GL_INVALID_OPERATION = GL2.GL_INVALID_OPERATION;
    public static final int GL_OUT_OF_MEMORY = GL2.GL_OUT_OF_MEMORY;
    /* FrontFaceDirection */
    public static final int GL_CW = GL2.GL_CW;
    public static final int GL_CCW = GL2.GL_CCW;
    /* GetPName */
    public static final int GL_LINE_WIDTH = GL2.GL_LINE_WIDTH;
    public static final int GL_ALIASED_POINT_SIZE_RANGE = GL2.GL_ALIASED_POINT_SIZE_RANGE;
    public static final int GL_ALIASED_LINE_WIDTH_RANGE = GL2.GL_ALIASED_LINE_WIDTH_RANGE;
    public static final int GL_CULL_FACE_MODE = GL2.GL_CULL_FACE_MODE;
    public static final int GL_FRONT_FACE = GL2.GL_FRONT_FACE;
    public static final int GL_DEPTH_RANGE = GL2.GL_DEPTH_RANGE;
    public static final int GL_DEPTH_WRITEMASK = GL2.GL_DEPTH_WRITEMASK;
    public static final int GL_DEPTH_CLEAR_VALUE = GL2.GL_DEPTH_CLEAR_VALUE;
    public static final int GL_DEPTH_FUNC = GL2.GL_DEPTH_FUNC;
    public static final int GL_STENCIL_CLEAR_VALUE = GL2.GL_STENCIL_CLEAR_VALUE;
    public static final int GL_STENCIL_FUNC = GL2.GL_STENCIL_FUNC;
    public static final int GL_STENCIL_FAIL = GL2.GL_STENCIL_FAIL;
    public static final int GL_STENCIL_PASS_DEPTH_FAIL = GL2.GL_STENCIL_PASS_DEPTH_FAIL;
    public static final int GL_STENCIL_PASS_DEPTH_PASS = GL2.GL_STENCIL_PASS_DEPTH_PASS;
    public static final int GL_STENCIL_REF = GL2.GL_STENCIL_REF;
    public static final int GL_STENCIL_VALUE_MASK = GL2.GL_STENCIL_VALUE_MASK;
    public static final int GL_STENCIL_WRITEMASK = GL2.GL_STENCIL_WRITEMASK;
    public static final int GL_STENCIL_BACK_FUNC = GL2.GL_STENCIL_BACK_FUNC;
    public static final int GL_STENCIL_BACK_FAIL = GL2.GL_STENCIL_BACK_FAIL;
    public static final int GL_STENCIL_BACK_PASS_DEPTH_FAIL = GL2.GL_STENCIL_BACK_PASS_DEPTH_FAIL;
    public static final int GL_STENCIL_BACK_PASS_DEPTH_PASS = GL2.GL_STENCIL_BACK_PASS_DEPTH_PASS;
    public static final int GL_STENCIL_BACK_REF = GL2.GL_STENCIL_BACK_REF;
    public static final int GL_STENCIL_BACK_VALUE_MASK = GL2.GL_STENCIL_BACK_VALUE_MASK;
    public static final int GL_STENCIL_BACK_WRITEMASK = GL2.GL_STENCIL_BACK_WRITEMASK;
    public static final int GL_VIEWPORT = GL2.GL_VIEWPORT;
    public static final int GL_SCISSOR_BOX = GL2.GL_SCISSOR_BOX;
    public static final int GL_COLOR_CLEAR_VALUE = GL2.GL_COLOR_CLEAR_VALUE;
    public static final int GL_COLOR_WRITEMASK = GL2.GL_COLOR_WRITEMASK;
    public static final int GL_UNPACK_ALIGNMENT = GL2.GL_UNPACK_ALIGNMENT;
    public static final int GL_PACK_ALIGNMENT = GL2.GL_PACK_ALIGNMENT;
    public static final int GL_MAX_TEXTURE_SIZE = GL2.GL_MAX_TEXTURE_SIZE;
    public static final int GL_MAX_VIEWPORT_DIMS = GL2.GL_MAX_VIEWPORT_DIMS;
    public static final int GL_SUBPIXEL_BITS = GL2.GL_SUBPIXEL_BITS;
    public static final int GL_RED_BITS = GL2.GL_RED_BITS;
    public static final int GL_GREEN_BITS = GL2.GL_GREEN_BITS;
    public static final int GL_BLUE_BITS = GL2.GL_BLUE_BITS;
    public static final int GL_ALPHA_BITS = GL2.GL_ALPHA_BITS;
    public static final int GL_DEPTH_BITS = GL2.GL_DEPTH_BITS;
    public static final int GL_STENCIL_BITS = GL2.GL_STENCIL_BITS;
    public static final int GL_POLYGON_OFFSET_UNITS = GL2.GL_POLYGON_OFFSET_UNITS;
    public static final int GL_POLYGON_OFFSET_FACTOR = GL2.GL_POLYGON_OFFSET_FACTOR;
    public static final int GL_TEXTURE_BINDING_2D = GL2.GL_TEXTURE_BINDING_2D;
    public static final int GL_SAMPLE_BUFFERS = GL2.GL_SAMPLE_BUFFERS;
    public static final int GL_SAMPLES = GL2.GL_SAMPLES;
    public static final int GL_SAMPLE_COVERAGE_VALUE = GL2.GL_SAMPLE_COVERAGE_VALUE;
    public static final int GL_SAMPLE_COVERAGE_INVERT = GL2.GL_SAMPLE_COVERAGE_INVERT;
    /* GetTextureParameter */
    public static final int GL_NUM_COMPRESSED_TEXTURE_FORMATS = GL2.GL_NUM_COMPRESSED_TEXTURE_FORMATS;
    public static final int GL_COMPRESSED_TEXTURE_FORMATS = GL2.GL_COMPRESSED_TEXTURE_FORMATS;
    /* HintMode */
    public static final int GL_DONT_CARE = GL2.GL_DONT_CARE;
    public static final int GL_FASTEST = GL2.GL_FASTEST;
    public static final int GL_NICEST = GL2.GL_NICEST;
    /* HintTarget */
    public static final int GL_GENERATE_MIPMAP_HINT = GL2.GL_GENERATE_MIPMAP_HINT;
    /* DataType */
    public static final int GL_BYTE = GL2.GL_BYTE;
    public static final int GL_UNSIGNED_BYTE = GL2.GL_UNSIGNED_BYTE;
    public static final int GL_SHORT = GL2.GL_SHORT;
    public static final int GL_UNSIGNED_SHORT = GL2.GL_UNSIGNED_SHORT;
    public static final int GL_INT = GL2.GL_INT;
    public static final int GL_UNSIGNED_INT = GL2.GL_UNSIGNED_INT;
    public static final int GL_FLOAT = GL2.GL_FLOAT;
    /* PixelFormat */
    public static final int GL_DEPTH_COMPONENT = GL2.GL_DEPTH_COMPONENT;
    public static final int GL_ALPHA = GL2.GL_ALPHA;
    public static final int GL_RGB = GL2.GL_RGB;
    public static final int GL_RGBA = GL2.GL_RGBA;
    public static final int GL_LUMINANCE = GL2.GL_LUMINANCE;
    public static final int GL_LUMINANCE_ALPHA = GL2.GL_LUMINANCE_ALPHA;
    /* PixelType */
    public static final int GL_UNSIGNED_SHORT_4_4_4_4 = GL2.GL_UNSIGNED_SHORT_4_4_4_4;
    public static final int GL_UNSIGNED_SHORT_5_5_5_1 = GL2.GL_UNSIGNED_SHORT_5_5_5_1;
    public static final int GL_UNSIGNED_SHORT_5_6_5 = GL2.GL_UNSIGNED_SHORT_5_6_5;
    /* Shaders */
    public static final int GL_FRAGMENT_SHADER = GL2.GL_FRAGMENT_SHADER;
    public static final int GL_VERTEX_SHADER = GL2.GL_VERTEX_SHADER;
    public static final int GL_MAX_VERTEX_ATTRIBS = GL2.GL_MAX_VERTEX_ATTRIBS;
    public static final int GL_MAX_VERTEX_UNIFORM_VECTORS = GL2.GL_MAX_VERTEX_UNIFORM_VECTORS;
    public static final int GL_MAX_VARYING_VECTORS = GL2.GL_MAX_VARYING_VECTORS;
    public static final int GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS = GL2.GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS;
    public static final int GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS = GL2.GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS;
    public static final int GL_MAX_TEXTURE_IMAGE_UNITS = GL2.GL_MAX_TEXTURE_IMAGE_UNITS;
    public static final int GL_MAX_FRAGMENT_UNIFORM_VECTORS = GL2.GL_MAX_FRAGMENT_UNIFORM_VECTORS;
    public static final int GL_SHADER_COMPILER = GL2.GL_SHADER_COMPILER;
    public static final int GL_SHADER_TYPE = GL2.GL_SHADER_TYPE;
    public static final int GL_DELETE_STATUS = GL2.GL_DELETE_STATUS;
    public static final int GL_LINK_STATUS = GL2.GL_LINK_STATUS;
    public static final int GL_VALIDATE_STATUS = GL2.GL_VALIDATE_STATUS;
    public static final int GL_ATTACHED_SHADERS = GL2.GL_ATTACHED_SHADERS;
    public static final int GL_ACTIVE_UNIFORMS = GL2.GL_ACTIVE_UNIFORMS;
    public static final int GL_ACTIVE_ATTRIBUTES = GL2.GL_ACTIVE_ATTRIBUTES;
    public static final int GL_SHADING_LANGUAGE_VERSION = GL2.GL_SHADING_LANGUAGE_VERSION;
    public static final int GL_CURRENT_PROGRAM = GL2.GL_CURRENT_PROGRAM;
    /* StencilFunction */
    public static final int GL_NEVER = GL2.GL_NEVER;
    public static final int GL_LESS = GL2.GL_LESS;
    public static final int GL_EQUAL = GL2.GL_EQUAL;
    public static final int GL_LEQUAL = GL2.GL_LEQUAL;
    public static final int GL_GREATER = GL2.GL_GREATER;
    public static final int GL_NOTEQUAL = GL2.GL_NOTEQUAL;
    public static final int GL_GEQUAL = GL2.GL_GEQUAL;
    public static final int GL_ALWAYS = GL2.GL_ALWAYS;
    /* StencilOp */
    public static final int GL_KEEP = GL2.GL_KEEP;
    public static final int GL_REPLACE = GL2.GL_REPLACE;
    public static final int GL_INCR = GL2.GL_INCR;
    public static final int GL_DECR = GL2.GL_DECR;
    public static final int GL_INVERT = GL2.GL_INVERT;
    public static final int GL_INCR_WRAP = GL2.GL_INCR_WRAP;
    public static final int GL_DECR_WRAP = GL2.GL_DECR_WRAP;
    /* StringName */
    public static final int GL_VENDOR = GL2.GL_VENDOR;
    public static final int GL_RENDERER = GL2.GL_RENDERER;
    public static final int GL_VERSION = GL2.GL_VERSION;
    /* TextureMagFilter */
    public static final int GL_NEAREST = GL2.GL_NEAREST;
    public static final int GL_LINEAR = GL2.GL_LINEAR;
    /* TextureMinFilter */
    public static final int GL_NEAREST_MIPMAP_NEAREST = GL2.GL_NEAREST_MIPMAP_NEAREST;
    public static final int GL_LINEAR_MIPMAP_NEAREST = GL2.GL_LINEAR_MIPMAP_NEAREST;
    public static final int GL_NEAREST_MIPMAP_LINEAR = GL2.GL_NEAREST_MIPMAP_LINEAR;
    public static final int GL_LINEAR_MIPMAP_LINEAR = GL2.GL_LINEAR_MIPMAP_LINEAR;
    /* TextureParameterName */
    public static final int GL_TEXTURE_MAG_FILTER = GL2.GL_TEXTURE_MAG_FILTER;
    public static final int GL_TEXTURE_MIN_FILTER = GL2.GL_TEXTURE_MIN_FILTER;
    public static final int GL_TEXTURE_WRAP_S = GL2.GL_TEXTURE_WRAP_S;
    public static final int GL_TEXTURE_WRAP_T = GL2.GL_TEXTURE_WRAP_T;
    /* TextureTarget */
    public static final int GL_TEXTURE_2D = GL2.GL_TEXTURE_2D;
    public static final int GL_TEXTURE = GL2.GL_TEXTURE;
    public static final int GL_TEXTURE_CUBE_MAP = GL2.GL_TEXTURE_CUBE_MAP;
    public static final int GL_TEXTURE_BINDING_CUBE_MAP = GL2.GL_TEXTURE_BINDING_CUBE_MAP;
    public static final int GL_TEXTURE_CUBE_MAP_POSITIVE_X = GL2.GL_TEXTURE_CUBE_MAP_POSITIVE_X;
    public static final int GL_TEXTURE_CUBE_MAP_NEGATIVE_X = GL2.GL_TEXTURE_CUBE_MAP_NEGATIVE_X;
    public static final int GL_TEXTURE_CUBE_MAP_POSITIVE_Y = GL2.GL_TEXTURE_CUBE_MAP_POSITIVE_Y;
    public static final int GL_TEXTURE_CUBE_MAP_NEGATIVE_Y = GL2.GL_TEXTURE_CUBE_MAP_NEGATIVE_Y;
    public static final int GL_TEXTURE_CUBE_MAP_POSITIVE_Z = GL2.GL_TEXTURE_CUBE_MAP_POSITIVE_Z;
    public static final int GL_TEXTURE_CUBE_MAP_NEGATIVE_Z = GL2.GL_TEXTURE_CUBE_MAP_NEGATIVE_Z;
    public static final int GL_MAX_CUBE_MAP_TEXTURE_SIZE = GL2.GL_MAX_CUBE_MAP_TEXTURE_SIZE;
    /* TextureUnit */
    public static final int GL_TEXTURE0 = GL2.GL_TEXTURE0;
    public static final int GL_TEXTURE1 = GL2.GL_TEXTURE1;
    public static final int GL_TEXTURE2 = GL2.GL_TEXTURE2;
    public static final int GL_TEXTURE3 = GL2.GL_TEXTURE3;
    public static final int GL_TEXTURE4 = GL2.GL_TEXTURE4;
    public static final int GL_TEXTURE5 = GL2.GL_TEXTURE5;
    public static final int GL_TEXTURE6 = GL2.GL_TEXTURE6;
    public static final int GL_TEXTURE7 = GL2.GL_TEXTURE7;
    public static final int GL_TEXTURE8 = GL2.GL_TEXTURE8;
    public static final int GL_TEXTURE9 = GL2.GL_TEXTURE9;
    public static final int GL_TEXTURE10 = GL2.GL_TEXTURE10;
    public static final int GL_TEXTURE11 = GL2.GL_TEXTURE11;
    public static final int GL_TEXTURE12 = GL2.GL_TEXTURE12;
    public static final int GL_TEXTURE13 = GL2.GL_TEXTURE13;
    public static final int GL_TEXTURE14 = GL2.GL_TEXTURE14;
    public static final int GL_TEXTURE15 = GL2.GL_TEXTURE15;
    public static final int GL_TEXTURE16 = GL2.GL_TEXTURE16;
    public static final int GL_TEXTURE17 = GL2.GL_TEXTURE17;
    public static final int GL_TEXTURE18 = GL2.GL_TEXTURE18;
    public static final int GL_TEXTURE19 = GL2.GL_TEXTURE19;
    public static final int GL_TEXTURE20 = GL2.GL_TEXTURE20;
    public static final int GL_TEXTURE21 = GL2.GL_TEXTURE21;
    public static final int GL_TEXTURE22 = GL2.GL_TEXTURE22;
    public static final int GL_TEXTURE23 = GL2.GL_TEXTURE23;
    public static final int GL_TEXTURE24 = GL2.GL_TEXTURE24;
    public static final int GL_TEXTURE25 = GL2.GL_TEXTURE25;
    public static final int GL_TEXTURE26 = GL2.GL_TEXTURE26;
    public static final int GL_TEXTURE27 = GL2.GL_TEXTURE27;
    public static final int GL_TEXTURE28 = GL2.GL_TEXTURE28;
    public static final int GL_TEXTURE29 = GL2.GL_TEXTURE29;
    public static final int GL_TEXTURE30 = GL2.GL_TEXTURE30;
    public static final int GL_TEXTURE31 = GL2.GL_TEXTURE31;
    public static final int GL_ACTIVE_TEXTURE = GL2.GL_ACTIVE_TEXTURE;
    /* TextureWrapMode */
    public static final int GL_REPEAT = GL2.GL_REPEAT;
    public static final int GL_CLAMP_TO_EDGE = GL2.GL_CLAMP_TO_EDGE;
    public static final int GL_MIRRORED_REPEAT = GL2.GL_MIRRORED_REPEAT;
    /* Uniform Types */
    public static final int GL_FLOAT_VEC2 = GL2.GL_FLOAT_VEC2;
    public static final int GL_FLOAT_VEC3 = GL2.GL_FLOAT_VEC3;
    public static final int GL_FLOAT_VEC4 = GL2.GL_FLOAT_VEC4;
    public static final int GL_INT_VEC2 = GL2.GL_INT_VEC2;
    public static final int GL_INT_VEC3 = GL2.GL_INT_VEC3;
    public static final int GL_INT_VEC4 = GL2.GL_INT_VEC4;
    public static final int GL_BOOL = GL2.GL_BOOL;
    public static final int GL_BOOL_VEC2 = GL2.GL_BOOL_VEC2;
    public static final int GL_BOOL_VEC3 = GL2.GL_BOOL_VEC3;
    public static final int GL_BOOL_VEC4 = GL2.GL_BOOL_VEC4;
    public static final int GL_FLOAT_MAT2 = GL2.GL_FLOAT_MAT2;
    public static final int GL_FLOAT_MAT3 = GL2.GL_FLOAT_MAT3;
    public static final int GL_FLOAT_MAT4 = GL2.GL_FLOAT_MAT4;
    public static final int GL_SAMPLER_2D = GL2.GL_SAMPLER_2D;
    public static final int GL_SAMPLER_CUBE = GL2.GL_SAMPLER_CUBE;
    /* Vertex Arrays */
    public static final int GL_VERTEX_ATTRIB_ARRAY_ENABLED = GL2.GL_VERTEX_ATTRIB_ARRAY_ENABLED;
    public static final int GL_VERTEX_ATTRIB_ARRAY_SIZE = GL2.GL_VERTEX_ATTRIB_ARRAY_SIZE;
    public static final int GL_VERTEX_ATTRIB_ARRAY_STRIDE = GL2.GL_VERTEX_ATTRIB_ARRAY_STRIDE;
    public static final int GL_VERTEX_ATTRIB_ARRAY_TYPE = GL2.GL_VERTEX_ATTRIB_ARRAY_TYPE;
    public static final int GL_VERTEX_ATTRIB_ARRAY_NORMALIZED = GL2.GL_VERTEX_ATTRIB_ARRAY_NORMALIZED;
    public static final int GL_VERTEX_ATTRIB_ARRAY_POINTER = GL2.GL_VERTEX_ATTRIB_ARRAY_POINTER;
    public static final int GL_VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = GL2.GL_VERTEX_ATTRIB_ARRAY_BUFFER_BINDING;
    /* Shader Source */
    public static final int GL_COMPILE_STATUS = GL2.GL_COMPILE_STATUS;
    /* Shader Precision-Specified Types */
    public static final int GL_LOW_FLOAT = GL2.GL_LOW_FLOAT;
    public static final int GL_MEDIUM_FLOAT = GL2.GL_MEDIUM_FLOAT;
    public static final int GL_HIGH_FLOAT = GL2.GL_HIGH_FLOAT;
    public static final int GL_LOW_INT = GL2.GL_LOW_INT;
    public static final int GL_MEDIUM_INT = GL2.GL_MEDIUM_INT;
    public static final int GL_HIGH_INT = GL2.GL_HIGH_INT;
    /* Framebuffer Object */
    public static final int GL_FRAMEBUFFER = GL2.GL_FRAMEBUFFER;
    public static final int GL_RENDERBUFFER = GL2.GL_RENDERBUFFER;
    public static final int GL_RGBA4 = GL2.GL_RGBA4;
    public static final int GL_RGB5_A1 = GL2.GL_RGB5_A1;
    public static final int GL_RGB565 = GL2.GL_RGB565;
    public static final int GL_DEPTH_COMPONENT16 = GL2.GL_DEPTH_COMPONENT16;
    public static final int GL_STENCIL_INDEX = GL2.GL_STENCIL_INDEX;
    public static final int GL_STENCIL_INDEX8 = GL2.GL_STENCIL_INDEX8;
    public static final int GL_DEPTH_STENCIL = GL2.GL_DEPTH_STENCIL;
    public static final int GL_RENDERBUFFER_WIDTH = GL2.GL_RENDERBUFFER_WIDTH;
    public static final int GL_RENDERBUFFER_HEIGHT = GL2.GL_RENDERBUFFER_HEIGHT;
    public static final int GL_RENDERBUFFER_INTERNAL_FORMAT = GL2.GL_RENDERBUFFER_INTERNAL_FORMAT;
    public static final int GL_RENDERBUFFER_RED_SIZE = GL2.GL_RENDERBUFFER_RED_SIZE;
    public static final int GL_RENDERBUFFER_GREEN_SIZE = GL2.GL_RENDERBUFFER_GREEN_SIZE;
    public static final int GL_RENDERBUFFER_BLUE_SIZE = GL2.GL_RENDERBUFFER_BLUE_SIZE;
    public static final int GL_RENDERBUFFER_ALPHA_SIZE = GL2.GL_RENDERBUFFER_ALPHA_SIZE;
    public static final int GL_RENDERBUFFER_DEPTH_SIZE = GL2.GL_RENDERBUFFER_DEPTH_SIZE;
    public static final int GL_RENDERBUFFER_STENCIL_SIZE = GL2.GL_RENDERBUFFER_STENCIL_SIZE;
    public static final int GL_NONE = GL2.GL_NONE;
    public static final int GL_FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = GL2.GL_FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE;
    public static final int GL_FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = GL2.GL_FRAMEBUFFER_ATTACHMENT_OBJECT_NAME;
    public static final int GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = GL2.GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL;
    public static final int GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = GL2.GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE;
    public static final int GL_FRAMEBUFFER_COMPLETE = GL2.GL_FRAMEBUFFER_COMPLETE;
    public static final int GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT = GL2.GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT;
    public static final int GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = GL2.GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT;
    public static final int GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS = GL2.GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS;
    public static final int GL_FRAMEBUFFER_UNSUPPORTED = GL2.GL_FRAMEBUFFER_UNSUPPORTED;
    public static final int GL_FRAMEBUFFER_BINDING = GL2.GL_FRAMEBUFFER_BINDING;
    public static final int GL_RENDERBUFFER_BINDING = GL2.GL_RENDERBUFFER_BINDING;
    public static final int GL_MAX_RENDERBUFFER_SIZE = GL2.GL_MAX_RENDERBUFFER_SIZE;
    public static final int GL_INVALID_FRAMEBUFFER_OPERATION = GL2.GL_INVALID_FRAMEBUFFER_OPERATION;
    public static final int GL_COLOR_ATTACHMENT0 = GL2.GL_COLOR_ATTACHMENT0;
    public static final int GL_DEPTH_ATTACHMENT = GL2.GL_DEPTH_ATTACHMENT;
    public static final int GL_STENCIL_ATTACHMENT = GL2.GL_STENCIL_ATTACHMENT;
    public static final int GL_DEPTH_STENCIL_ATTACHMENT = GL2.GL_DEPTH_STENCIL_ATTACHMENT;
    /* WebGL-specific enums */
    public static final int GL_UNPACK_FLIP_Y_WEBGL = 37440;
    public static final int GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL = 37441;
    public static final int GL_CONTEXT_LOST_WEBGL = 37442;
    public static final int GL_UNPACK_COLORSPACE_CONVERSION_WEBGL = 37443;
    public static final int GL_BROWSER_DEFAULT_WEBGL = 37444;
    /* JebGL-specific enums */
    public static final int GL_TRUE = GL2.GL_TRUE;
    public static final int GL_FALSE = GL2.GL_FALSE;

    /* 
     * Ready all call enums 
     */
    public static final int CALL_NONE = 0;
    public static final int CALL_ACTIVE_TEXTURE = 10001;
    public static final int CALL_ATTACH_SHADER = 10002;
    public static final int CALL_BIND_ATTRIB_LOCATION = 10003;
    public static final int CALL_BIND_BUFFER = 10004;
    public static final int CALL_BIND_FRAMEBUFFER = 10005;
    public static final int CALL_BIND_RENDERBUFFER = 10006;
    public static final int CALL_BIND_TEXTURE = 10007;
    public static final int CALL_BLEND_COLOR = 10008;
    public static final int CALL_BLEND_EQUATION = 10009;
    public static final int CALL_BLEND_EQUATION_SEPARATE = 10010;
    public static final int CALL_BLEND_FUNC = 10011;
    public static final int CALL_BLEND_FUNC_SEPARATE = 10012;
    public static final int CALL_CLEAR = 10013;
    public static final int CALL_CLEAR_COLOR = 10014;
    public static final int CALL_CLEAR_DEPTH = 10015;
    public static final int CALL_CLEAR_STENCIL = 10016;
    public static final int CALL_COLOR_MASK = 10017;
    public static final int CALL_COMPILE_SHADER = 10018;
    public static final int CALL_COPY_TEX_IMAGE_2D = 10019;
    public static final int CALL_COPY_TEX_SUB_IMAGE_2D = 10020;
    public static final int CALL_CULL_FACE = 10021;
    public static final int CALL_DELETE_BUFFER = 10022;
    public static final int CALL_DELETE_FRAMEBUFFER = 10023;
    public static final int CALL_DELETE_PROGRAM = 10024;
    public static final int CALL_DELETE_RENDERBUFFER = 10025;
    public static final int CALL_DELETE_SHADER = 10026;
    public static final int CALL_DELETE_TEXTURE = 10027;
    public static final int CALL_DEPTH_FUNC = 10028;
    public static final int CALL_DEPTH_MASK = 10029;
    public static final int CALL_DEPTH_RANGE = 10030;
    public static final int CALL_DETACH_SHADER = 10031;
    public static final int CALL_DISABLE = 10032;
    public static final int CALL_DISABLE_VERTEX_ATTRIB_ARRAY = 10033;
    public static final int CALL_DRAW_ARRAYS = 10034;
    public static final int CALL_DRAW_ELEMENTS = 10035;
    public static final int CALL_ENABLE = 10036;
    public static final int CALL_ENABLE_VERTEX_ATTRIB_ARRAY = 10037;
    public static final int CALL_FRAMEBUFFER_RENDERBUFFER = 10038;
    public static final int CALL_FRAMEBUFFER_TEXTURE_2D = 10039;
    public static final int CALL_FRONT_FACE = 10040;
    public static final int CALL_GENERATE_MIPMAP = 10041;
    public static final int CALL_HINT = 10042;
    public static final int CALL_LINE_WIDTH = 10043;
    public static final int CALL_LINK_PROGRAM = 10044;
    public static final int CALL_PIXEL_STOREI = 10045;
    public static final int CALL_POLYGON_OFFSET = 10046;
    public static final int CALL_RENDERBUFFER_STORAGE = 10047;
    public static final int CALL_SAMPLE_COVERAGE = 10048;
    public static final int CALL_SCISSOR = 10049;
    public static final int CALL_SHADER_SOURCE = 10050;
    public static final int CALL_STENCIL_FUNC = 10051;
    public static final int CALL_STENCIL_FUNC_SEPARATE = 10052;
    public static final int CALL_STENCIL_MASK = 10053;
    public static final int CALL_STENCIL_MASK_SEPARATE = 10054;
    public static final int CALL_STENCIL_OP = 10055;
    public static final int CALL_STENCIL_OP_SEPARATE = 10056;
    public static final int CALL_TEX_PARAMETERF = 10057;
    public static final int CALL_TEX_PARAMETERI = 10058;
    public static final int CALL_UNIFORM1F = 10059;
    public static final int CALL_UNIFORM1FV = 10060;
    public static final int CALL_UNIFORM1I = 10061;
    public static final int CALL_UNIFORM1IV = 10062;
    public static final int CALL_UNIFORM2F = 10063;
    public static final int CALL_UNIFORM2FV = 10064;
    public static final int CALL_UNIFORM2I = 10065;
    public static final int CALL_UNIFORM2IV = 10066;
    public static final int CALL_UNIFORM3F = 10067;
    public static final int CALL_UNIFORM3FV = 10068;
    public static final int CALL_UNIFORM3I = 10069;
    public static final int CALL_UNIFORM3IV = 10070;
    public static final int CALL_UNIFORM4F = 10071;
    public static final int CALL_UNIFORM4FV = 10072;
    public static final int CALL_UNIFORM4I = 10073;
    public static final int CALL_UNIFORM4IV = 10074;
    public static final int CALL_UNIFORM_MATRIX2FV = 10075;
    public static final int CALL_UNIFORM_MATRIX3FV = 10076;
    public static final int CALL_UNIFORM_MATRIX4FV = 10077;
    public static final int CALL_USE_PROGRAM = 10078;
    public static final int CALL_VALIDATE_PROGRAM = 10079;
    public static final int CALL_VERTEX_ATTRIB1F = 10080;
    public static final int CALL_VERTEX_ATTRIB1FV = 10081;
    public static final int CALL_VERTEX_ATTRIB2F = 10082;
    public static final int CALL_VERTEX_ATTRIB2FV = 10083;
    public static final int CALL_VERTEX_ATTRIB3F = 10084;
    public static final int CALL_VERTEX_ATTRIB3FV = 10085;
    public static final int CALL_VERTEX_ATTRIB4F = 10086;
    public static final int CALL_VERTEX_ATTRIB4FV = 10087;
    public static final int CALL_VERTEX_ATTRIB_POINTER = 10088;
    public static final int CALL_VIEWPORT = 10089;

    /* 
     * Ready all event enums 
     */
    public static final int EVT_MOUSE = 20000;
    public static final int EVT_KEY = 20001;
    public static final int EVT_MOVE = 20002;
    public static final int EVT_DOWN = 20003;
    public static final int EVT_UP = 20004;
    public static final int EVT_PRESS = 20005;
    public static final int EVT_CLICK = 20006;
    public static final int EVT_OVER = 20007;
    public static final int EVT_OUT = 20008;
    public static final int EVT_WHEEL = 20009;

    /* 
     * NullAnimator which catches repaint calls from 
     * the os (does nothing while running)
     */

    public class NullAnimator extends AnimatorBase {
        private boolean running;
        public NullAnimator(GLAutoDrawable drawable) {
            super.add(drawable);
            this.running = false;
        }

        protected String getBaseName(String prefix) {
            return "NullAnimator";
        }

        public boolean start() {
            this.running = true;
            return true;
        }
        
        public boolean stop() {
            this.running = false;
            return true;
        }
        
        public boolean resume() {
            this.running = true;
            return true;
        }

        public boolean pause() {
            this.running = false;
            return true;
        }

        public boolean isAnimating() {
            return this.running;
        }

        public boolean isPaused() {
            return this.running;
        }

        public boolean isStarted() {
            return this.running;
        }
    }

    // Helper function 
    private int[] concat(int[] a, int[] b) {
        int[] out = new int[a.length + b.length];
        for (int i = 0; i<a.length; i++) {
            out[i] = a[i];
        }
        for (int i = 0; i<b.length; i++) {
            out[i+a.length] = b[i];
        }
        return out;
    }

    /*
     * MouseAdapter for mouse events
     */
    class JebGLMouseAdapter extends MouseAdapter {
      private void handle(MouseEvent e, int action) {
          int[] evt = new int[5];
          evt[0] = EVT_MOUSE;
          evt[1] = action;
          evt[2] = e.getButton();
          evt[3] = e.getX();
          evt[4] = e.getY();
          message = concat(message, evt);
      }   
        
      public void mouseClicked(MouseEvent e) {
          this.handle(e, EVT_CLICK);
      }
      public void mouseDragged(MouseEvent e) {
          this.handle(e, EVT_MOVE);
      }
      public void mouseEntered(MouseEvent e) {
          this.handle(e, EVT_OVER);
      }
      public void mouseExited(MouseEvent e) {
          this.handle(e, EVT_OUT);
      }
      public void mouseMoved(MouseEvent e) {
          this.handle(e, EVT_MOVE);
      }
      public void mousePressed(MouseEvent e) {
          this.handle(e, EVT_DOWN);
      }
      public void mouseReleased(MouseEvent e) {
          this.handle(e, EVT_UP);
      }
      public void mouseWheelMoved(MouseEvent e) {
          this.handle(e, EVT_WHEEL);
      }
    }

    /*
     * KeyAdapter for keyboard events
     */
    class JebGLKeyAdapter extends KeyAdapter {
        private void handle(KeyEvent e, int action) {
          int[] evt = new int[4];
          evt[0] = EVT_KEY;
          evt[1] = action;
          evt[2] = e.getKeyChar();
          evt[3] = e.getKeyCode();
          message = concat(message, evt);
        }
        public void keyPressed(KeyEvent e) {
            this.handle(e, EVT_DOWN);
        }
        public void keyReleased(KeyEvent e) {
            this.handle(e, EVT_UP);
        }
        public void keyTyped(KeyEvent e) {
            this.handle(e, EVT_PRESS);
        }
    }

    public void addCanvas(GLCanvas canvas) {
        // Sometimes canvas isn't quite ready, 
        // so we keep trying until we succeed
        try {
            add(canvas, BorderLayout.CENTER);
        } catch (GLException e) {
            canvas.setVisible(true); // May fix a bug where NativeSurface never gets ready
            // Wait 100 ms
            long t0, t1;
            t0 = System.currentTimeMillis();
            do {
                t1 = System.currentTimeMillis();
            } while ((t1-t0) < 100);
            addCanvas(canvas);
        }
    }

    public void init() {
        GLProfile.initSingleton(false);
        setLayout(new BorderLayout());
        GLCapabilities caps = new GLCapabilities(GLProfile.get(GLProfile.GL2));
        caps.setNumSamples(4); // Enable AA
        caps.setSampleBuffers(true); // Needed for AA
        caps.setDoubleBuffered(true);
        canvas = new GLCanvas(caps);
        addCanvas(canvas);
        canvas.setSize(getSize());
        canvas.setAutoSwapBufferMode(true);

        // Create a media tracker
        mt = new MediaTracker(this);
        
        // Enable event listeners
        MouseListener jebglMouse = new JebGLMouseAdapter();
        KeyListener jebglKey = new JebGLKeyAdapter();
        java.awt.Component comp = (java.awt.Component) canvas;
        new AWTMouseAdapter(jebglMouse).addTo(comp);
        new AWTKeyAdapter(jebglKey).addTo(comp);

        // Set dummy animator to prevent external redraw
        animator = new NullAnimator(canvas);
    }
    
    public void start() {
        animator.start();
        ready = true;
    }
    
    public void stop() {
        animator.stop();
    }
    
    public void destroy() {
        ready = false;
        // Close down GLCanvas
        remove(canvas);
    }

    // Method used in JavaScript to call a number of gl commands simultaneously
    public int[] call(String c, String i, String f) {
        if (c.length() > 0) {
            // Collect all the data in arrays
            String[] cs = c.split(",");
            int[] calls = new int[cs.length];
            for (int j=0; j<cs.length; j++) {
                calls[j] = (new Integer(cs[j])).intValue();
            }
            
            int[] ints;
            if (i.length() > 0) {
                String[] is = i.split(",");
                ints = new int[is.length];
                for (int j=0; j<is.length; j++) {
                    ints[j] = (new Integer(is[j])).intValue();
                }
            } else {
                ints = new int[0];
            }

            float[] floats;
            if (f.length() > 0) {
                String[] fs = f.split(",");
                floats = new float[fs.length];
                for (int j=0; j<fs.length; j++) {
                    floats[j] = (new Float(fs[j])).floatValue();
                }
            } else {
                floats = new float[0];
            }
            
            // And run the calls
            runCalls(calls, ints, floats);
        }        

        // Return anything relevant
        int[] msg = message;
        message = new int[0];
        return msg;
    }

    public void runCalls(int[] calls, int[] ints, float[] floats) {
        int i=0;
        int f=0;
        for (int c=0; c<calls.length; c++) {
            // call the relevant method and increase i and f
            // relative to how many parameters were used
            switch (calls[c]) {
            case CALL_NONE:
                break;
            case CALL_ACTIVE_TEXTURE:
                glActiveTexture(ints[i++]);
                break;
            case CALL_ATTACH_SHADER:
                glAttachShader(ints[i++], ints[i++]);
                break;
            case CALL_BIND_ATTRIB_LOCATION:
                System.err.println("FIXME: BindAttribLocation uses a string");
                break;
            case CALL_BIND_BUFFER:
                glBindBuffer(ints[i++], ints[i++]);
                break;
            case CALL_BIND_FRAMEBUFFER:
                glBindFramebuffer(ints[i++], ints[i++]);
                break;
            case CALL_BIND_RENDERBUFFER:
                glBindRenderbuffer(ints[i++], ints[i++]);
                break;
            case CALL_BIND_TEXTURE:
                glBindTexture(ints[i++], ints[i++]);
                break;
            case CALL_BLEND_COLOR:
                glBlendColor(floats[f++], floats[f++], floats[f++], floats[f++]);
                break;
            case CALL_BLEND_EQUATION:
                glBlendEquation(ints[i++]);
                break;
            case CALL_BLEND_EQUATION_SEPARATE:
                glBlendEquationSeparate(ints[i++], ints[i++]);
                break;
            case CALL_BLEND_FUNC:
                glBlendFunc(ints[i++], ints[i++]);
                break;
            case CALL_BLEND_FUNC_SEPARATE:
                glBlendFuncSeparate(ints[i++], ints[i++], ints[i++], ints[i++]);
                break;
            case CALL_CLEAR:
                glClear(ints[i++]);
                break;
            case CALL_CLEAR_COLOR:
                glClearColor(floats[f++], floats[f++], floats[f++], floats[f++]);
                break;
            case CALL_CLEAR_DEPTH:
                glClearDepth(floats[f++]);
                break;
            case CALL_CLEAR_STENCIL:
                glClearStencil(ints[i++]);
                break;
            case CALL_COLOR_MASK:
                glColorMask(ints[i++], ints[i++], ints[i++], ints[i++]);
                break;
            case CALL_COMPILE_SHADER:
                glCompileShader(ints[i++]);
                break;
            case CALL_COPY_TEX_IMAGE_2D:
                glCopyTexImage2D(ints[i++], ints[i++], ints[i++], ints[i++],
                                 ints[i++], ints[i++], ints[i++], ints[i++]);
                break;
            case CALL_COPY_TEX_SUB_IMAGE_2D:
                glCopyTexSubImage2D(ints[i++], ints[i++], ints[i++], ints[i++],
                                    ints[i++], ints[i++], ints[i++], ints[i++]);
                break;
            case CALL_CULL_FACE:
                glCullFace(ints[i++]);
                break;
            case CALL_DELETE_BUFFER:
                glDeleteBuffer(ints[i++]);
                break;
            case CALL_DELETE_FRAMEBUFFER:
                glDeleteFramebuffer(ints[i++]);
                break;
            case CALL_DELETE_PROGRAM:
                glDeleteProgram(ints[i++]);
                break;
            case CALL_DELETE_RENDERBUFFER:
                glDeleteRenderbuffer(ints[i++]);
                break;
            case CALL_DELETE_SHADER:
                glDeleteShader(ints[i++]);
                break;
            case CALL_DELETE_TEXTURE:
                glDeleteTexture(ints[i++]);
                break;
            case CALL_DEPTH_FUNC:
                glDepthFunc(ints[i++]);
                break;
            case CALL_DEPTH_MASK:
                glDepthMask(ints[i++]);
                break;
            case CALL_DEPTH_RANGE:
                glDepthRange(floats[f++], floats[f++]);
                break;
            case CALL_DETACH_SHADER:
                glDetachShader(ints[i++], ints[i++]);
                break;
            case CALL_DISABLE:
                glDisable(ints[i++]);
                break;
            case CALL_DISABLE_VERTEX_ATTRIB_ARRAY:
                glDisableVertexAttribArray(ints[i++]);
                break;
            case CALL_DRAW_ARRAYS:
                glDrawArrays(ints[i++], ints[i++], ints[i++]);
                break;
            case CALL_DRAW_ELEMENTS:
                glDrawElements(ints[i++], ints[i++], ints[i++], ints[i++]);
                break;
            case CALL_ENABLE:
                glEnable(ints[i++]);
                break;
            case CALL_ENABLE_VERTEX_ATTRIB_ARRAY:
                glEnableVertexAttribArray(ints[i++]);
                break;
            case CALL_FRAMEBUFFER_RENDERBUFFER:
                glFramebufferRenderbuffer(ints[i++], ints[i++],
                                          ints[i++], ints[i++]);
                break;
            case CALL_FRAMEBUFFER_TEXTURE_2D:
                glFramebufferTexture2D(ints[i++], ints[i++], ints[i++],
                                       ints[i++], ints[i++]);
                break;
            case CALL_FRONT_FACE:
                glFrontFace(ints[i++]);
                break;
            case CALL_GENERATE_MIPMAP:
                glGenerateMipmap(ints[i++]);
                break;
            case CALL_HINT:
                glHint(ints[i++], ints[i++]);
                break;
            case CALL_LINE_WIDTH:
                glLineWidth(floats[f++]);
                break;
            case CALL_LINK_PROGRAM:
                glLinkProgram(ints[i++]);
                break;
            case CALL_PIXEL_STOREI:
                glPixelStorei(ints[i++], ints[i++]);
                break;
            case CALL_POLYGON_OFFSET:
                glPolygonOffset(floats[f++], floats[f++]);
                break;
            case CALL_RENDERBUFFER_STORAGE:
                glRenderbufferStorage(ints[i++], ints[i++], 
                                      ints[i++], ints[i++]);
                break;
            case CALL_SAMPLE_COVERAGE:
                glSampleCoverage(floats[f++], ints[i++]);
                break;
            case CALL_SCISSOR:
                glScissor(ints[i++], ints[i++], 
                          ints[i++], ints[i++]);
                break;
            case CALL_SHADER_SOURCE:
                System.err.println("FIXME: ShaderSource uses string");
                break;
            case CALL_STENCIL_FUNC:
                glStencilFunc(ints[i++], ints[i++], ints[i++]);
                break;
            case CALL_STENCIL_FUNC_SEPARATE:
                glStencilFuncSeparate(ints[i++], ints[i++], 
                                      ints[i++], ints[i++]);
                break;
            case CALL_STENCIL_MASK:
                glStencilMask(ints[i++]);
                break;
            case CALL_STENCIL_MASK_SEPARATE:
                glStencilMaskSeparate(ints[i++], ints[i++]);
                break;
            case CALL_STENCIL_OP:
                glStencilOp(ints[i++], ints[i++], ints[i++]);
                break;
            case CALL_STENCIL_OP_SEPARATE:
                glStencilOpSeparate(ints[i++], ints[i++], 
                                    ints[i++], ints[i++]);
                break;
            case CALL_TEX_PARAMETERF:
                glTexParameterf(ints[i++], ints[i++], floats[f++]);
                break;
            case CALL_TEX_PARAMETERI:
                glTexParameteri(ints[i++], ints[i++], ints[i++]);
                break;
            case CALL_UNIFORM1F:
                glUniform1f(ints[i++], floats[f++]);
                break;
            case CALL_UNIFORM1I:
                glUniform1i(ints[i++], ints[i++]);
                break;
            case CALL_UNIFORM2F:
                glUniform2f(ints[i++], floats[f++], floats[f++]);
                break;
            case CALL_UNIFORM2I:
                glUniform2i(ints[i++], ints[i++], ints[i++]);
                break;
            case CALL_UNIFORM3F:
                glUniform3f(ints[i++], floats[f++], floats[f++], floats[f++]);
                break;
            case CALL_UNIFORM3I:
                glUniform3i(ints[i++], ints[i++], ints[i++], ints[i++]);
                break;
            case CALL_UNIFORM4F:
                glUniform4f(ints[i++], floats[f++], floats[f++], 
                            floats[f++], floats[f++]);
                break;
            case CALL_UNIFORM4I:
                glUniform4i(ints[i++], ints[i++], ints[i++], 
                            ints[i++], ints[i++]);
                break;
            case CALL_UNIFORM_MATRIX2FV:
                glUniformMatrix2fv(ints[i++], ints[i++], ints[i++], 
                                   floats[f++], floats[f++], floats[f++], 
                                   floats[f++]);
                break;
            case CALL_UNIFORM_MATRIX3FV:
                glUniformMatrix3fv(ints[i++], ints[i++], ints[i++], 
                                   floats[f++], floats[f++], floats[f++], 
                                   floats[f++], floats[f++], floats[f++], 
                                   floats[f++], floats[f++], floats[f++]);
                break;
            case CALL_UNIFORM_MATRIX4FV:
                glUniformMatrix4fv(ints[i++], ints[i++], ints[i++], 
                                   floats[f++], floats[f++], floats[f++], floats[f++],
                                   floats[f++], floats[f++], floats[f++], floats[f++],
                                   floats[f++], floats[f++], floats[f++], floats[f++],
                                   floats[f++], floats[f++], floats[f++], floats[f++]);
                break;
            case CALL_USE_PROGRAM:
                glUseProgram(ints[i++]);
                break;
            case CALL_VALIDATE_PROGRAM:
                glValidateProgram(ints[i++]);
                break;
            case CALL_VERTEX_ATTRIB1F:
                glVertexAttrib1f(ints[i++], floats[f++]);
                break;
            case CALL_VERTEX_ATTRIB2F:
                glVertexAttrib2f(ints[i++], floats[f++], floats[f++]);
                break;
            case CALL_VERTEX_ATTRIB3F:
                glVertexAttrib3f(ints[i++], floats[f++], floats[f++], 
                                 floats[f++]);
                break;
            case CALL_VERTEX_ATTRIB4F:
                glVertexAttrib4f(ints[i++], floats[f++], floats[f++], 
                                 floats[f++], floats[f++]);
                break;
            case CALL_VERTEX_ATTRIB_POINTER:
                glVertexAttribPointer(ints[i++], ints[i++], ints[i++], 
                                      ints[i++], ints[i++], ints[i++]);
                break;
            case CALL_VIEWPORT:
                glViewport(ints[i++], ints[i++], ints[i++], ints[i++]);
                break;
            default:
                System.err.println("JebGL: uncaught call enum: " + calls[c]);
                break;
            }
        }
    }
                     
    /*
     * Invoke objects
     */

    public class ActiveTexture implements GLRunnable {
        private int texture;
        public ActiveTexture(int texture) {
            this.texture = texture;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glActiveTexture(texture);
            return true;
        }
    }

    public class AttachShader implements GLRunnable {
        private int program;
        private int shader;
        public AttachShader(int program, int shader) {
            this.program = program;
            this.shader = shader;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glAttachShader(program, shader);
            return true;
        }
    }

    public class BindAttribLocation implements GLRunnable {
        private int program;
        private int index;
        private String name;
        public BindAttribLocation(int program, int index, String name) {
            this.program = program;
            this.index = index;
            this.name = name;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glBindAttribLocation(program, index, name);
            return true;
        }
    }

    public class BindBuffer implements GLRunnable {
        private int target;
        private int buffer;
        public BindBuffer(int target, int buffer) {
            this.target = target;
            this.buffer = buffer;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glBindBuffer(target, buffer);
            return true;
        }
    }

    public class BindFramebuffer implements GLRunnable {
        private int target;
        private int framebuffer;
        public BindFramebuffer(int target, int framebuffer) {
            this.target = target;
            this.framebuffer = framebuffer;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glBindFramebuffer(target, framebuffer);
            return true;
        }
    }

    public class BindRenderbuffer implements GLRunnable {
        private int target;
        private int renderbuffer;
        public BindRenderbuffer(int target, int renderbuffer) {
            this.target = target;
            this.renderbuffer = renderbuffer;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glBindRenderbuffer(target, renderbuffer);
            return true;
        }
    }

    public class BindTexture implements GLRunnable {
        private int target;
        private int texture;
        public BindTexture(int target, int texture) {
            this.target = target;
            this.texture = texture;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glBindTexture(target, texture);
            return true;
        }
    }

    public class BlendColor implements GLRunnable {
        private float r, g, b, a;
        public BlendColor(float r, float g, float b, float a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glBlendColor(r, g, b, a);
            return true;
        }
    }

    public class BlendEquation implements GLRunnable {
        private int mode;
        public BlendEquation(int mode) {
            this.mode = mode;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glBlendEquation(mode);
            return true;
        }
    }

    public class BlendEquationSeparate implements GLRunnable {
        private int modeRGB;
        private int modeAlpha;
        public BlendEquationSeparate(int modeRGB, int modeAlpha) {
            this.modeRGB = modeRGB;
            this.modeAlpha = modeAlpha;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glBlendEquationSeparate(modeRGB, modeAlpha);
            return true;
        }
    }

    public class BlendFunc implements GLRunnable {
        private int sfactor;
        private int dfactor;
        public BlendFunc(int sfactor, int dfactor) {
            this.sfactor = sfactor;
            this.dfactor = dfactor;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glBlendFunc(sfactor, dfactor);
            return true;
        }
    }

    public class BlendFuncSeparate implements GLRunnable {
        private int srcRGB;
        private int dstRGB;
        private int srcAlpha;
        private int dstAlpha;
        public BlendFuncSeparate(int srcRGB, int dstRGB, int srcAlpha, int dstAlpha) {
            this.srcRGB = srcRGB;
            this.dstRGB = dstRGB;
            this.srcAlpha = srcAlpha;
            this.dstAlpha = dstAlpha;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glBlendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha);
            return true;
        }
    }

    public class BufferDataf implements GLRunnable {
        private int target;
        private long size;
        private float[] data;
        private int usage;
        private int bytesPerElement;
        public BufferDataf(int target, long size, float[] data, int usage, int bytesPerElement) {
            this.target = target;
            this.size = size;
            this.data = data;
            this.usage = usage;
            this.bytesPerElement = bytesPerElement;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            ByteBuffer bufdata = ByteBuffer.allocateDirect(bytesPerElement*(int)size);
            bufdata.order(ByteOrder.nativeOrder());
            FloatBuffer fdata = bufdata.asFloatBuffer();
            DoubleBuffer ddata = bufdata.asDoubleBuffer();
            for (int i = 0; i < size; i++) {
                if (bytesPerElement == 4) {
                    fdata.put(data[i]);
                } else if (bytesPerElement == 8) {
                    ddata.put((double) data[i]);
                }
            }
            fdata.position(0);
            ddata.position(0);
            if (bytesPerElement == 4) {
                    gl.glBufferData(target, bytesPerElement*size, fdata, usage);
            } else if (bytesPerElement == 8) {
                gl.glBufferData(target, bytesPerElement*size, ddata, usage);
            }
            return true;
        }
    }

    public class BufferDatai implements GLRunnable {
        private int target;
        private long size;
        private int[] data;
        private int usage;
        private int bytesPerElement;
        public BufferDatai(int target, long size, int[] data, int usage, int bytesPerElement) {
            this.target = target;
            this.size = size;
            this.data = data;
            this.usage = usage;
            this.bytesPerElement = bytesPerElement;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            ByteBuffer i8data = ByteBuffer.allocateDirect(bytesPerElement*(int)size);
            i8data.order(ByteOrder.nativeOrder());
            ShortBuffer i16data = i8data.asShortBuffer();
            IntBuffer i32data = i8data.asIntBuffer();
            for (int i = 0; i < size; i++) {
                if (bytesPerElement == 1) {
                    i8data.put((byte) data[i]);
                } else if (bytesPerElement == 2) {
                    i16data.put((short) data[i]);
                } else if (bytesPerElement == 4) {
                    i32data.put(data[i]);
                }
            }
            i8data.position(0);
            i16data.position(0);
            i32data.position(0);
            if (bytesPerElement == 1) {
                gl.glBufferData(target, bytesPerElement*size, i8data, usage);
            } else if (bytesPerElement == 2) {
                gl.glBufferData(target, bytesPerElement*size, i16data, usage);
            } else if (bytesPerElement == 4) {
                gl.glBufferData(target, bytesPerElement*size, i32data, usage);
            }
            return true;
        }
    }

    public class BufferSubDataf implements GLRunnable {
        private int target;
        private long offset;
        private long size;
        private float[] data;
        private int bytesPerElement;
        public BufferSubDataf(int target, long offset, long size, float[] data, int bytesPerElement) {
            this.target = target;
            this.offset = offset;
            this.size = size;
            this.data = data;
            this.bytesPerElement = bytesPerElement;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            ByteBuffer bufdata = ByteBuffer.allocateDirect(bytesPerElement*(int)size);
            bufdata.order(ByteOrder.nativeOrder());
            FloatBuffer fdata = bufdata.asFloatBuffer();
            DoubleBuffer ddata = bufdata.asDoubleBuffer();
            for (int i = 0; i < size; i++) {
                if (bytesPerElement == 4) {
                    fdata.put(data[i]);
                } else if (bytesPerElement == 8) {
                    ddata.put((double) data[i]);
                }
            }
            fdata.position(0);
            ddata.position(0);
            if (bytesPerElement == 4) {
                gl.glBufferSubData(target, offset, bytesPerElement*size, fdata);
            } else if (bytesPerElement == 8) {
                gl.glBufferSubData(target, offset, bytesPerElement*size, ddata);
            }
            return true;
        }
    }

    public class BufferSubDatai implements GLRunnable {
        private int target;
        private long offset;
        private long size;
        private int[] data;
        private int bytesPerElement;
        public BufferSubDatai(int target, long offset, long size, int[] data, int bytesPerElement) {
            this.target = target;
            this.offset = offset;
            this.size = size;
            this.data = data;
            this.bytesPerElement = bytesPerElement;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            ByteBuffer i8data = ByteBuffer.allocateDirect(bytesPerElement*(int)size);
            i8data.order(ByteOrder.nativeOrder());
            ShortBuffer i16data = i8data.asShortBuffer();
            IntBuffer i32data = i8data.asIntBuffer();
            for (int i = 0; i < size; i++) {
                if (bytesPerElement == 1) {
                    i8data.put((byte) data[i]);
                } else if (bytesPerElement == 2) {
                    i16data.put((short) data[i]);
                } else if (bytesPerElement == 4) {
                    i32data.put(data[i]);
                }
            }
            i8data.position(0);
            i16data.position(0);
            i32data.position(0);
            if (bytesPerElement == 1) {
                gl.glBufferSubData(target, offset, bytesPerElement*size, i8data);
            } else if (bytesPerElement == 2) {
                gl.glBufferSubData(target, offset, bytesPerElement*size, i16data);
            } else if (bytesPerElement == 4) {
                gl.glBufferSubData(target, offset, bytesPerElement*size, i32data);
            }
            return true;
        }
    }

    public class CheckFramebufferStatus implements GLRunnable {
        private int target;
        public int status;
        public CheckFramebufferStatus(int target) {
            this.target = target;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            this.status = gl.glCheckFramebufferStatus(target);
            return true;
        }
    }

    public class Clear implements GLRunnable {
        private int bit;
        public Clear(int bit) {
            this.bit = bit;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glClear(bit);
            return true;
        }
    }

    public class ClearColor implements GLRunnable {
        private float r, g, b, a;
        public ClearColor(float r, float g, float b, float a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glClearColor(r, g, b, a);
            return true;
        }
    }

    public class ClearDepth implements GLRunnable {
        private float depth;
        public ClearDepth(float depth) {
            this.depth = depth;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glClearDepthf(depth);
            return true;
        }
    }

    public class ClearStencil implements GLRunnable {
        private int s;
        public ClearStencil(int s) {
            this.s = s;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glClearStencil(s);
            return true;
        }
    }

    public class ColorMask implements GLRunnable {
        private boolean r, g, b, a;
        public ColorMask(boolean r, boolean g, boolean b, boolean a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glColorMask(r, g, b, a);
            return true;
        }
    }

    public class CompileShader implements GLRunnable {
        private int shader;
        public CompileShader(int shader) {
            this.shader = shader;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glCompileShader(shader);
            return true;
        }
    }

    public class CopyTexImage2D implements GLRunnable {
        private int target;
        private int level;
        private int internalformat;
        private int x;
        private int y;
        private int width;
        private int height;
        private int border;
        public CopyTexImage2D(int target, int level, int internalformat,
                          int x, int y, int width,
                          int height, int border) {
            this.target = target;
            this.level = level;
            this.internalformat = internalformat;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.border = border;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glCopyTexImage2D(target, level, internalformat, x, y, width, 
                                height, border);
            return true;
        }
    }

    public class CopyTexSubImage2D implements GLRunnable {
        private int target;
        private int level;
        private int xoffset;
        private int yoffset;
        private int x;
        private int y;
        private int width;
        private int height;
        public CopyTexSubImage2D(int target, int level, int xoffset,
                                 int yoffset, int x, int y, int width,
                                 int height) {
            this.target = target;
            this.level = level;
            this.xoffset = xoffset;
            this.yoffset = yoffset;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glCopyTexSubImage2D(target, level, xoffset, yoffset, x, y,
                                   width, height);
            return true;
        }
    }

    public class CreateBuffer implements GLRunnable {
        public int[] buffers;
        public CreateBuffer() {
            this.buffers = new int[1];
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGenBuffers(1, buffers, 0);
            return true;
        }
    }

    public class CreateFramebuffer implements GLRunnable {
        public int[] buffers;
        public CreateFramebuffer() {
            this.buffers = new int[1];
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGenFramebuffers(1, buffers, 0);
            return true;
        }
    }

    public class CreateProgram implements GLRunnable {
        public int id;
        public CreateProgram() {
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            this.id = gl.glCreateProgram();
            return true;
        }
    }

    public class CreateRenderbuffer implements GLRunnable {
        public int[] buffers;
        public CreateRenderbuffer() {
            this.buffers = new int[1];
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGenRenderbuffers(1, buffers, 0);
            return true;
        }
    }

    public class CreateShader implements GLRunnable {
        private int type;
        public int id;
        public CreateShader(int type) {
            this.type = type;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();

            //System.err.println("Chosen GLCapabilities: " + drawable.getChosenGLCapabilities());
            //System.err.println("INIT GL IS: " + gl.getClass().getName());
            //System.err.println("GL_VENDOR: " + gl.glGetString(GL2.GL_VENDOR));
            //System.err.println("GL_RENDERER: " + gl.glGetString(GL2.GL_RENDERER));
            //System.err.println("GL_VERSION: " + gl.glGetString(GL2.GL_VERSION));

            //System.err.println(gl.isFunctionAvailable("glCreateShader"));

            this.id = gl.glCreateShader(type);
            return true;
        }
    }
    
    public class CreateTexture implements GLRunnable {
        public int[] textures;
        public CreateTexture() {
            this.textures = new int[1];
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGenTextures(1, textures, 0);
            return true;
        }
    }

    public class CullFace implements GLRunnable {
        private int mode;
        public CullFace(int mode) {
            this.mode = mode;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glCullFace(mode);
            return true;
        }
    }

    public class DeleteBuffer implements GLRunnable {
        public int[] buffers;
        public DeleteBuffer(int b) {
            this.buffers = new int[1];
            this.buffers[0] = b;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glDeleteBuffers(1, buffers, 0);
            return true;
        }
    }

    public class DeleteFramebuffer implements GLRunnable {
        public int[] buffers;
        public DeleteFramebuffer(int b) {
            this.buffers = new int[1];
            this.buffers[0] = b;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glDeleteFramebuffers(1, buffers, 0);
            return true;
        }
    }

    public class DeleteProgram implements GLRunnable {
        private int program;
        public DeleteProgram(int program) {
            this.program = program;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glDeleteProgram(program);
            return true;
        }
    }

    public class DeleteRenderbuffer implements GLRunnable {
        public int[] buffers;
        public DeleteRenderbuffer(int b) {
            this.buffers = new int[1];
            this.buffers[0] = b;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glDeleteRenderbuffers(1, buffers, 0);
            return true;
        }
    }
    
    public class DeleteShader implements GLRunnable {
        private int shader;
        public DeleteShader(int shader) {
            this.shader = shader;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glDeleteShader(shader);
            return true;
        }
    }

    public class DeleteTexture implements GLRunnable {
        public int[] textures;
        public DeleteTexture(int t) {
            this.textures = new int[1];
            this.textures[0] = t;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glDeleteTextures(1, textures, 0);
            return true;
        }
    }

    public class DepthFunc implements GLRunnable {
        private int func;
        public DepthFunc(int func) {
            this.func = func;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glDepthFunc(func);
            return true;
        }
    }

    public class DepthMask implements GLRunnable {
        private boolean flag;
        public DepthMask(boolean flag) {
            this.flag = flag;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glDepthMask(flag);
            return true;
        }
    }

    public class DepthRange implements GLRunnable {
        private float zNear;
        private float zFar;
        public DepthRange(float zNear, float zFar) {
            this.zNear = zNear;
            this.zFar = zFar;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glDepthRangef(zNear, zFar);
            return true;
        }
    }

    public class DetachShader implements GLRunnable {
        private int program;
        private int shader;
        public DetachShader(int program, int shader) {
            this.program = program;
            this.shader = shader;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glDetachShader(program, shader);
            return true;
        }
    }

    public class Disable implements GLRunnable {
        private int cap;
        public Disable(int cap) {
            this.cap = cap;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glDisable(cap);
            return true;
        }
    }

    public class DisableVertexAttribArray implements GLRunnable {
        private int index;
        public DisableVertexAttribArray(int index) {
            this.index = index;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glDisableVertexAttribArray(index);
            return true;
        }
    }

    public class DrawArrays implements GLRunnable {
        private int mode;
        private int first;
        private int count;
        public DrawArrays(int mode, int first, int count) {
            this.mode = mode;
            this.first = first;
            this.count = count;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glDrawArrays(mode, first, count);
            return true;
        }
    }

    public class DrawElements implements GLRunnable {
        private int mode;
        private int count;
        private int type;
        private long offset;
        public DrawElements(int mode, int count, int type, int offset) {
            this.mode = mode;
            this.count = count;
            this.type = type;
            this.offset = (long)offset;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glDrawElements(mode, count, type, offset);
            return true;
        }
    }

    public class Enable implements GLRunnable {
        private int cap;
        public Enable(int cap) {
            this.cap = cap;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glEnable(cap);
            return true;
        }
    }

    public class EnableVertexAttribArray implements GLRunnable {
        private int index;
        public EnableVertexAttribArray(int index) {
            this.index = index;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glEnableVertexAttribArray(index);
            return true;
        }
    }

    public class Finish implements GLRunnable {
        public Finish() {
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glFinish();
            return true;
        }
    }

    public class Flush implements GLRunnable {
        public Flush() {
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glFlush();
            return true;
        }
    }

    public class FramebufferRenderbuffer implements GLRunnable {
        private int target;
        private int attachment;
        private int renderbuffertarget;
        private int renderbuffer;
        public FramebufferRenderbuffer(int target, int attachment,
                                       int renderbuffertarget, int renderbuffer) {
            this.target = target;
            this.attachment = attachment;
            this.renderbuffertarget = renderbuffertarget;
            this.renderbuffer = renderbuffer;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glFramebufferRenderbuffer(target, attachment, renderbuffertarget,
                                         renderbuffer);
            return true;
        }
    }

    public class FramebufferTexture2D implements GLRunnable {
        private int target;
        private int attachment;
        private int textarget;
        private int texture;
        private int level;
        public FramebufferTexture2D(int target, int attachment, int textarget,
                                       int texture, int level) {
            this.target = target;
            this.attachment = attachment;
            this.textarget = textarget;
            this.texture = texture;
            this.level = level;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glFramebufferTexture2D(target, attachment, textarget,
                                      texture, level);
            return true;
        }
    }

    public class FrontFace implements GLRunnable {
        private int mode;
        public FrontFace(int mode) {
            this.mode = mode;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glFrontFace(mode);
            return true;
        }
    }

    public class GenerateMipmap implements GLRunnable {
        private int target;
        public GenerateMipmap(int target) {
            this.target = target;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGenerateMipmap(target);
            return true;
        }
    }

    public class GetActiveAttrib implements GLRunnable {
        private int program;
        private int index;
        private final int bufsize = 256;
        private int[] length;
        public int[] size;
        public int[] type;
        public byte[] name;
        public GetActiveAttrib(int program, int index) {
            this.program = program;
            this.index = index;
            this.length = new int[1];
            this.size = new int[1];
            this.type = new int[1];
            this.name = new byte[bufsize];
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGetActiveAttrib(program, index, bufsize, length,
                                 0, size, 0, type, 0, name, 0);
            return true;
        }
    }

    public class GetActiveUniform implements GLRunnable {
        private int program;
        private int index;
        private final int bufsize = 256;
        private int[] length;
        public int[] size;
        public int[] type;
        public byte[] name;
        public GetActiveUniform(int program, int index) {
            this.program = program;
            this.index = index;
            this.length = new int[1];
            this.size = new int[1];
            this.type = new int[1];
            this.name = new byte[bufsize];
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGetActiveUniform(program, index, bufsize, length,
                                 0, size, 0, type, 0, name, 0);
            return true;
        }
    }

    public class GetAttachedShaders implements GLRunnable {
        private int program;
        private final int maxcount = 256;
        public int[] count;
        public int[] shaders;
        public GetAttachedShaders(int program) {
            this.program = program;
            this.count = new int[1];
            this.shaders = new int[maxcount];
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGetAttachedShaders(program, maxcount, count, 0,
                                    shaders, 0);
            return true;
        }
    }

    public class GetAttribLocation implements GLRunnable {
        private int program;
        private String name;
        public int location;
        public GetAttribLocation(int program, String name) {
            this.program = program;
            this.name = name;
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            this.location = gl.glGetAttribLocation(program, name);
            return true;
        }
    }

    public class GetBufferParameteriv implements GLRunnable {
        private int target;
        private int pname;
        public int[] params;
        public GetBufferParameteriv(int target, int pname) {
            this.target = target;
            this.pname = pname;
            this.params = new int[1];
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGetBufferParameteriv(target, pname, params, 0);
            return true;
        }
    }

    public class GetError implements GLRunnable {
        public int id;
        public GetError() {
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            this.id = gl.glGetError();
            return true;
        }
    }

    public class GetFloatv implements GLRunnable {
        private int pname;
        public float[] params;
        public GetFloatv(int pname) {
            this.pname = pname;
            this.params = new float[1];
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGetFloatv(pname, params, 0);
            return true;
        }
    }

    public class GetFramebufferAttachmentParameteriv implements GLRunnable {
        private int target;
        private int attachment;
        private int pname;
        public int[] params;
        public GetFramebufferAttachmentParameteriv(int target, int attachment, int pname) {
            this.target = target;
            this.attachment = attachment;
            this.pname = pname;
            this.params = new int[1];
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGetFramebufferAttachmentParameteriv(target, attachment, pname, params, 0);
            return true;
        }
    }

    public class GetIntegerv implements GLRunnable {
        private int pname;
        public int[] params;
        public GetIntegerv(int pname) {
            this.pname = pname;
            this.params = new int[1];
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGetIntegerv(pname, params, 0);
            return true;
        }
    }

    public class GetProgramiv implements GLRunnable {
        private int program;
        private int pname;
        public int[] params;
        public GetProgramiv(int program, int pname) {
            this.program = program;
            this.pname = pname;
            this.params = new int[1];
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGetProgramiv(program, pname, params, 0);
            return true;
        }
    }

    public class GetProgramInfoLog implements GLRunnable {
        private int program;
        private final int bufsize = 1024;
        public int[] length;
        public byte[] infolog;
        public GetProgramInfoLog(int program) {
            this.program = program;
            this.length = new int[1];
            this.infolog = new byte[bufsize];
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGetProgramiv(program, gl.GL_INFO_LOG_LENGTH, length, 0);
            gl.glGetProgramInfoLog(program, bufsize, length, 0, infolog, 0);
            return true;
        }
    }

    public class GetRenderbufferParameteriv implements GLRunnable {
        private int target;
        private int pname;
        public int[] params;
        public GetRenderbufferParameteriv(int target, int pname) {
            this.target = target;
            this.pname = pname;
            this.params = new int[1];
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGetRenderbufferParameteriv(target, pname, params, 0);
            return true;
        }
    }

    public class GetShaderInfoLog implements GLRunnable {
        private int shader;
        private int bufsize;
        public int[] length;
        public byte[] infolog;
        public GetShaderInfoLog(int shader) {
            this.shader = shader;
            this.length = new int[1];
            this.infolog = new byte[1024];
            this.bufsize = 1024;
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGetShaderiv(shader, gl.GL_INFO_LOG_LENGTH, length, 0);
            gl.glGetShaderInfoLog(shader, bufsize, length, 0, infolog, 0);
            return true;
        }
    }

    public class GetShaderiv implements GLRunnable {
        private int shader;
        private int pname;
        public int[] params;
        public GetShaderiv(int shader, int pname) {
            this.shader = shader;
            this.pname = pname;
            this.params = new int[1];
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGetShaderiv(shader, pname, params, 0);
            return true;
        }
    }

    public class GetShaderSource implements GLRunnable {
        private int shader;
        private final int bufsize = 1024;
        public int[] length;
        public byte[] source;
        public GetShaderSource(int shader) {
            this.shader = shader;
            this.length = new int[1];
            this.source = new byte[bufsize];
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGetShaderSource(shader, bufsize, length, 0, source, 0);
            return true;
        }
    }

    public class GetString implements GLRunnable {
        private int name;
        public String result;
        public GetString(int name) {
            this.name = name;
            this.result = new String();
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            result = gl.glGetString(name);
            return true;
        }
    }

    public class GetTexParameterfv implements GLRunnable {
        private int target;
        private int pname;
        public float[] params;
        public GetTexParameterfv(int target, int pname) {
            this.target = target;
            this.pname = pname;
            this.params = new float[1];
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGetTexParameterfv(target, pname, params, 0);
            return true;
        }
    }

    public class GetTexParameteriv implements GLRunnable {
        private int target;
        private int pname;
        public int[] params;
        public GetTexParameteriv(int target, int pname) {
            this.target = target;
            this.pname = pname;
            this.params = new int[1];
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGetTexParameteriv(target, pname, params, 0);
            return true;
        }
    }

    public class GetUniform implements GLRunnable {
        private int program;
        private int location;
        public float[] result;
        public GetUniform(int program, int location) {
            this.program = program;
            this.location = location;
            result = new float[16]; // Just set 16 for now
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGetUniformfv(program, location, result, 0);
            return true;
        }
    }

    public class GetUniformLocation implements GLRunnable {
        private int program;
        private String name;
        public int location;
        public GetUniformLocation(int program, String name) {
            this.program = program;
            this.name = name;
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            this.location = gl.glGetUniformLocation(program, name);
            return true;
        }
    }

    public class GetVertexAttribfv implements GLRunnable {
        private int index;
        private int pname;
        public float[] params;
        public GetVertexAttribfv(int index, int pname) {
            this.index = index;
            this.pname = pname;
            this.params = new float[1];
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGetVertexAttribfv(index, pname, params, 0);
            return true;
        }
    }

    public class GetVertexAttribiv implements GLRunnable {
        private int index;
        private int pname;
        public int[] params;
        public GetVertexAttribiv(int index, int pname) {
            this.index = index;
            this.pname = pname;
            this.params = new int[1];
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glGetVertexAttribiv(index, pname, params, 0);
            return true;
        }
    }

    // GetVertexAttribPointer - excluded from JOGL

    public class Hint implements GLRunnable {
        private int target;
        private int mode;
        public Hint(int target, int mode) {
            this.target = target;
            this.mode = mode;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glHint(target, mode);
            return true;
        }
    }

    public class IsBuffer implements GLRunnable {
        private int buffer;
        public boolean result;
        public IsBuffer(int buffer) {
            this.buffer = buffer;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            result = gl.glIsBuffer(buffer);
            return true;
        }
    }

    public class IsEnabled implements GLRunnable {
        private int cap;
        public boolean result;
        public IsEnabled(int cap) {
            this.cap = cap;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            result = gl.glIsEnabled(cap);
            return true;
        }
    }

    public class IsFramebuffer implements GLRunnable {
        private int framebuffer;
        public boolean result;
        public IsFramebuffer(int framebuffer) {
            this.framebuffer = framebuffer;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            result = gl.glIsFramebuffer(framebuffer);
            return true;
        }
    }

    public class IsProgram implements GLRunnable {
        private int program;
        public boolean result;
        public IsProgram(int program) {
            this.program = program;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            result = gl.glIsProgram(program);
            return true;
        }
    }

    public class IsRenderbuffer implements GLRunnable {
        private int renderbuffer;
        public boolean result;
        public IsRenderbuffer(int renderbuffer) {
            this.renderbuffer = renderbuffer;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            result = gl.glIsRenderbuffer(renderbuffer);
            return true;
        }
    }

    public class IsShader implements GLRunnable {
        private int shader;
        public boolean result;
        public IsShader(int shader) {
            this.shader = shader;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            result = gl.glIsShader(shader);
            return true;
        }
    }

    public class IsTexture implements GLRunnable {
        private int texture;
        public boolean result;
        public IsTexture(int texture) {
            this.texture = texture;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            result = gl.glIsTexture(texture);
            return true;
        }
    }

    public class LineWidth implements GLRunnable {
        private float width;
        public LineWidth(float width) {
            this.width = width;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glLineWidth(width);
            return true;
        }
    }

    public class LinkProgram implements GLRunnable {
        private int program;
        public LinkProgram(int program) {
            this.program = program;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glLinkProgram(program);
            return true;
        }
    }

    // ReadPixels

    public class PixelStorei implements GLRunnable {
        private int pname;
        private int param;
        public PixelStorei(int pname, int param) {
            this.pname = pname;
            this.param = param;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glPixelStorei(pname, param);
            return true;
        }
    }

    public class PolygonOffset implements GLRunnable {
        private float factor;
        private float units;
        public PolygonOffset(float factor, float units) {
            this.factor = factor;
            this.units = units;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glPolygonOffset(factor, units);
            return true;
        }
    }

    public class RenderbufferStorage implements GLRunnable {
        private int target;
        private int internalformat;
        private int width;
        private int height;
        public RenderbufferStorage(int target, int internalformat, 
                                   int width, int height) {
            this.target = target;
            this.internalformat = internalformat;
            this.width = width;
            this.height = height;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glRenderbufferStorage(target, internalformat, width, height);
            return true;
        }
    }

    public class SampleCoverage implements GLRunnable {
        private float value;
        private boolean invert;
        public SampleCoverage(float value, boolean invert) {
            this.value = value;
            this.invert = invert;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glSampleCoverage(value, invert);
            return true;
        }
    }

    public class Scissor implements GLRunnable {
        private int x;
        private int y;
        private int width;
        private int height;
        public Scissor(int x, int y, int width, int height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glScissor(x, y, width, height);
            return true;
        }
    }

    public class ShaderSource implements GLRunnable {
        private int shader;
        private int count;
        private String[] string;
        private int[] length;
        public ShaderSource(int shader, String source) {
            this.shader = shader;
            this.string = new String[1];
            this.string[0] = source;
            this.count = string.length;
            this.length = new int[this.count];
            for (int i = 0; i < this.count; i++) {
                this.length[i] = this.string[i].length();
            }
        }

        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glShaderSource(shader, count, string, length, 0);
            return true;
        }
    }

    public class StencilFunc implements GLRunnable {
        private int func;
        private int ref;
        private int mask;
        public StencilFunc(int func, int ref, int mask) {
            this.func = func;
            this.ref = ref;
            this.mask = mask;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glStencilFunc(func, ref, mask);
            return true;
        }
    }

    public class StencilFuncSeparate implements GLRunnable {
        private int face;
        private int func;
        private int ref;
        private int mask;
        public StencilFuncSeparate(int face, int func, int ref, int mask) {
            this.face = face;
            this.func = func;
            this.ref = ref;
            this.mask = mask;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glStencilFuncSeparate(face, func, ref, mask);
            return true;
        }
    }

    public class StencilMask implements GLRunnable {
        private int mask;
        public StencilMask(int mask) {
            this.mask = mask;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glStencilMask(mask);
            return true;
        }
    }

    public class StencilMaskSeparate implements GLRunnable {
        private int face;
        private int mask;
        public StencilMaskSeparate(int face, int mask) {
            this.face = face;
            this.mask = mask;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glStencilMaskSeparate(face, mask);
            return true;
        }
    }

    public class StencilOp implements GLRunnable {
        private int fail;
        private int zfail;
        private int zpass;
        public StencilOp(int fail, int zfail, int zpass) {
            this.fail = fail;
            this.zfail = zfail;
            this.zpass = zpass;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glStencilOp(fail, zfail, zpass);
            return true;
        }
    }
    
    public class StencilOpSeparate implements GLRunnable {
        private int face;
        private int fail;
        private int zfail;
        private int zpass;
        public StencilOpSeparate(int face, int fail, int zfail, int zpass) {
            this.face = face;
            this.fail = fail;
            this.zfail = zfail;
            this.zpass = zpass;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glStencilOpSeparate(face, fail, zfail, zpass);
            return true;
        }
    }

    public class TexImage2D implements GLRunnable {
        private int target;
        private int level;
        private int internalformat;
        private int width;
        private int height;
        private int border;
        private int format;
        private int type;
        private String url;
        private ByteBuffer pixels;
        public TexImage2D(int target, int level, int internalformat,
                          int width, int height, int border,
                          int format, int type, String url) {
            this.target = target;
            this.level = level;
            this.internalformat = internalformat;
            this.width = width;
            this.height = height;
            this.border = border;
            this.format = format;
            this.type = type;
            this.url = url;
            // FIXME: this should be internalformat_size*width*height
            pixels = ByteBuffer.allocateDirect(4*width*height);
            pixels.order(ByteOrder.nativeOrder());
            
            if (url.length() > 0) {
                try {
                    Image img = getImage(new URL(url));
                    
                    mt.addImage(img, 1);
                    try {
                        mt.waitForAll();
                    } catch (InterruptedException e) {
                        System.err.println("getImage interrupted for " + url);
                        return;
                    }
                    
                    int[] data = new int[width*height];
                try {
                    (new PixelGrabber(img, 0, 0, width, height, data, 0, width)).grabPixels();
                } catch (InterruptedException e) {
                    System.err.println("grabPixels interrupted for " + url);
                    return;
                }
                
                // FIXME: This needs to check the color model, etc.
                if (unpack_flip_y_webgl == GL_TRUE) {
                    for (int j=height-1; j>=0; j--) {
                        for (int i=0; i<width; i++) {
                            int pixel = data[j*width+i];
                            pixels.put((byte)((pixel>>16) & 0xff));
                            pixels.put((byte)((pixel>>8) & 0xff));
                            pixels.put((byte)((pixel) & 0xff));
                            pixels.put((byte)((pixel>>24) & 0xff));
                        }
                    }
                } else {
                    for (int j=0; j<height; j++) {
                        for (int i=0; i<width; i++) {
                            int pixel = data[j*width+i];
                            pixels.put((byte)((pixel>>16) & 0xff));
                            pixels.put((byte)((pixel>>8) & 0xff));
                            pixels.put((byte)((pixel) & 0xff));
                            pixels.put((byte)((pixel>>24) & 0xff));
                        }
                    }
                }
                pixels.position(0);
                
                if ((mt.statusAll(false) & MediaTracker.ERRORED) != 0) {
                    System.err.println("MediaTracker error on " + url);
                }
                
                } catch (MalformedURLException e) {
                    System.err.println("Malformed URL: " + url);
                    return;
                }
            } else {
                // Initialize to zero
                for (int j=0; j<height; j++) {
                    for (int i=0; i<width; i++) {
                        pixels.put((byte) 0);
                        pixels.put((byte) 0);
                        pixels.put((byte) 0);
                        pixels.put((byte) 0);
                    }
                }
                pixels.position(0);
            }
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glTexImage2D(target, level, internalformat, width, height,
                            border, format, type, pixels);
            return true;
        }
    }

    public class TexParameterf implements GLRunnable {
        private int target;
        private int pname;
        private float param;
        public TexParameterf(int target, int pname, float param) {
            this.target = target;
            this.pname = pname;
            this.param = param;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glTexParameterf(target, pname, param);
            return true;
        }
    }

    public class TexParameteri implements GLRunnable {
        private int target;
        private int pname;
        private int param;
        public TexParameteri(int target, int pname, int param) {
            this.target = target;
            this.pname = pname;
            this.param = param;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glTexParameteri(target, pname, param);
            return true;
        }
    }

    // TexSubImage2D

    public class Uniform1f implements GLRunnable {
        private int location;
        private float value;
        public Uniform1f(int location, float value) {
            this.location = location;
            this.value = value;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glUniform1f(location, value);
            return true;
        }
    }

    public class Uniform1i implements GLRunnable {
        private int location;
        private int value;
        public Uniform1i(int location, int value) {
            this.location = location;
            this.value = value;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glUniform1i(location, value);
            return true;
        }
    }

    public class Uniform2f implements GLRunnable {
        private int location;
        private float x;
        private float y;
        public Uniform2f(int location, float x, float y) {
            this.location = location;
            this.x = x;
            this.y = y;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glUniform2f(location, x, y);
            return true;
        }
    }

    public class Uniform2i implements GLRunnable {
        private int location;
        private int x;
        private int y;
        public Uniform2i(int location, int x, int y) {
            this.location = location;
            this.x = x;
            this.y = y;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glUniform2i(location, x, y);
            return true;
        }
    }

    public class Uniform3f implements GLRunnable {
        private int location;
        private float x;
        private float y;
        private float z;
        public Uniform3f(int location, float x, float y, float z) {
            this.location = location;
            this.x = x;
            this.y = y;
            this.z = z;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glUniform3f(location, x, y, z);
            return true;
        }
    }

    public class Uniform3i implements GLRunnable {
        private int location;
        private int x;
        private int y;
        private int z;
        public Uniform3i(int location, int x, int y, int z) {
            this.location = location;
            this.x = x;
            this.y = y;
            this.z = z;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glUniform3i(location, x, y, z);
            return true;
        }
    }

    public class Uniform4f implements GLRunnable {
        private int location;
        private float x;
        private float y;
        private float z;
        private float w;
        public Uniform4f(int location, float x, float y, float z, float w) {
            this.location = location;
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glUniform4f(location, x, y, z, w);
            return true;
        }
    }

    public class Uniform4i implements GLRunnable {
        private int location;
        private int x;
        private int y;
        private int z;
        private int w;
        public Uniform4i(int location, int x, int y, int z, int w) {
            this.location = location;
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glUniform4i(location, x, y, z, w);
            return true;
        }
    }

    public class UniformMatrix2fv implements GLRunnable {
        private int location;
        private int count;
        private boolean transpose;
        private float[] value;
        public UniformMatrix2fv(int location, int count, int transpose, float[] value) {
            this.location = location;
            this.count = count;
            if (transpose == 0) {
                this.transpose = false;
            } else {
                this.transpose = true;
            }
            this.value = value;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glUniformMatrix2fv(location, count, transpose, value, 0);
            return true;
        }
    }

    public class UniformMatrix3fv implements GLRunnable {
        private int location;
        private int count;
        private boolean transpose;
        private float[] value;
        public UniformMatrix3fv(int location, int count, int transpose, float[] value) {
            this.location = location;
            this.count = count;
            if (transpose == 0) {
                this.transpose = false;
            } else {
                this.transpose = true;
            }
            this.value = value;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glUniformMatrix3fv(location, count, transpose, value, 0);
            return true;
        }
    }

    public class UniformMatrix4fv implements GLRunnable {
        private int location;
        private int count;
        private boolean transpose;
        private float[] value;
        public UniformMatrix4fv(int location, int count, int transpose, float[] value) {
            this.location = location;
            this.count = count;
            if (transpose == 0) {
                this.transpose = false;
            } else {
                this.transpose = true;
            }
            this.value = value;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glUniformMatrix4fv(location, count, transpose, value, 0);
            return true;
        }
    }

    public class UseProgram implements GLRunnable {
        private int program;
        public UseProgram(int program) {
            this.program = program;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glUseProgram(program);
            return true;
        }
    }

    public class ValidateProgram implements GLRunnable {
        private int program;
        public ValidateProgram(int program) {
            this.program = program;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glValidateProgram(program);
            return true;
        }
    }

    public class VertexAttrib1f implements GLRunnable {
        private int index;
        private float x;
        public VertexAttrib1f(int index, float x) {
            this.index = index;
            this.x = x;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glVertexAttrib1f(index, x);
            return true;
        }
    }

    public class VertexAttrib2f implements GLRunnable {
        private int index;
        private float x;
        private float y;
        public VertexAttrib2f(int index, float x, float y) {
            this.index = index;
            this.x = x;
            this.y = y;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glVertexAttrib2f(index, x, y);
            return true;
        }
    }

    public class VertexAttrib3f implements GLRunnable {
        private int index;
        private float x;
        private float y;
        private float z;
        public VertexAttrib3f(int index, float x, float y, float z) {
            this.index = index;
            this.x = x;
            this.y = y;
            this.z = z;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glVertexAttrib3f(index, x, y, z);
            return true;
        }
    }

    public class VertexAttrib4f implements GLRunnable {
        private int index;
        private float x;
        private float y;
        private float z;
        private float w;
        public VertexAttrib4f(int index, float x, float y, float z, float w) {
            this.index = index;
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glVertexAttrib4f(index, x, y, z, w);
            return true;
        }
    }

    public class VertexAttribPointer implements GLRunnable {
        private int indx;
        private int size;
        private int type;
        private boolean normalized;
        private int stride;
        private long offset;
        public VertexAttribPointer(int indx, int size, int type, int normalized, int stride, int offset) {
            this.indx = indx;
            this.size = size;
            this.type = type;
            if (normalized == 0) {
                this.normalized = false;
            } else {
                this.normalized = true;
            }
            this.stride = stride;
            this.offset = (long)offset;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glVertexAttribPointer(indx, size, type, normalized, stride, offset);
            return true;
        }
    }

    public class Viewport implements GLRunnable {
        private int x;
        private int y;
        private int width;
        private int height;
        public Viewport(int x, int y, int width, int height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        
        public boolean run(GLAutoDrawable drawable) {
            GL2 gl = drawable.getGL().getGL2();
            gl.glViewport(x, y, width, height);
            return true;
        }
    }

    /*
     * Invoke functions
     * 
     * These functions must only recieve single ints, floats or
     * Strings so they can be used in call lists. Booleans are
     * converted to GL_TRUE or GL_FALSE in Javascript, are then
     * recieved here, and should then be converted back to Boolean for
     * the invoke objects (ironically they then convert them back
     * again for the C methods)
     */

    public void glActiveTexture(int texture) {
        canvas.invoke(false, new ActiveTexture(texture));
    }

    public void glAttachShader(int program, int shader) {
        canvas.invoke(false, new AttachShader(program, shader));
    }

    public void glBindAttribLocation(int program, int index, String name) {
        canvas.invoke(false, new BindAttribLocation(program, index, name));
    }

    public void glBindBuffer(int target, int buffer) {
        canvas.invoke(false, new BindBuffer(target, buffer));
    }

    public void glBindFramebuffer(int target, int framebuffer) {
        canvas.invoke(false, new BindFramebuffer(target, framebuffer));
    }

    public void glBindRenderbuffer(int target, int renderbuffer) {
        canvas.invoke(false, new BindRenderbuffer(target, renderbuffer));
    }

    public void glBindTexture(int target, int texture) {
        canvas.invoke(false, new BindTexture(target, texture));
    }

    public void glBlendColor(float red, float green, float blue, float alpha) {
        canvas.invoke(false, new BlendColor(red, green, blue, alpha));
    }

    public void glBlendEquation(int mode) {
        canvas.invoke(false, new BlendEquation(mode));
    }

    public void glBlendEquationSeparate(int modeRGB, int modeAlpha) {
        canvas.invoke(false, new BlendEquationSeparate(modeRGB, modeAlpha));
    }

    public void glBlendFunc(int sfactor, int dfactor) {
        canvas.invoke(false, new BlendFunc(sfactor, dfactor));
    }

    public void glBlendFuncSeparate(int srcRGB, int dstRGB,
                                    int srcAlpha, int dstAlpha) {
        canvas.invoke(false, new BlendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha));
    }

    public void glBufferData(int target, String data, int usage, int bytesPerElement, boolean fp) {
        if (fp) {
            float[] floats;
            if (data.length() > 0) {
                String[] fs = data.split(",");
                floats = new float[fs.length];
                for (int j=0; j<fs.length; j++) {
                    floats[j] = (new Float(fs[j])).floatValue();
                }
            } else {
                floats = new float[0];
            }
            canvas.invoke(false, new BufferDataf(target, floats.length, floats, usage, bytesPerElement));
        } else {
            int[] ints;
            if (data.length() > 0) {
                String[] is = data.split(",");
                ints = new int[is.length];
                for (int j=0; j<is.length; j++) {
                    ints[j] = (new Integer(is[j])).intValue();
                }
            } else {
                ints = new int[0];
            }
            canvas.invoke(false, new BufferDatai(target, ints.length, ints, usage, bytesPerElement));
        }
    }

    public void glBufferSubData(int target, long offset, String data, int bytesPerElement, boolean fp) {
        if (fp) {
            float[] floats;
            if (data.length() > 0) {
                String[] fs = data.split(",");
                floats = new float[fs.length];
                for (int j=0; j<fs.length; j++) {
                    floats[j] = (new Float(fs[j])).floatValue();
                }
            } else {
                floats = new float[0];
            }
            canvas.invoke(false, new BufferSubDataf(target, offset, floats.length, floats, bytesPerElement));
        } else {
            int[] ints;
            if (data.length() > 0) {
                String[] is = data.split(",");
                ints = new int[is.length];
                for (int j=0; j<is.length; j++) {
                    ints[j] = (new Integer(is[j])).intValue();
                }
            } else {
                ints = new int[0];
            }
            canvas.invoke(false, new BufferSubDatai(target, offset, ints.length, ints, bytesPerElement));
        }
    }

    public int glCheckFramebufferStatus(int target) {
        CheckFramebufferStatus s = new CheckFramebufferStatus(target);
        canvas.invoke(false, s);
        canvas.display(); // Flushes the invoke list
        return s.status;
    }

    public void glClear(int bit) {
        // FIXME: temporary sync point
        canvas.display();
        canvas.invoke(false, new Clear(bit));
    }

    public void glClearColor(float r, float g, float b, float a) {
        canvas.invoke(false, new ClearColor(r, g, b, a));
    }

    public void glClearDepth(float depth) {
        canvas.invoke(false, new ClearDepth(depth));
    }

    public void glClearStencil(int s) {
        canvas.invoke(false, new ClearStencil(s));
    }

    public void glColorMask(int red, int green, int blue, int alpha) {
        int[] i = new int[4];
        boolean[] o = new boolean[4];
        i[0] = red; i[1] = green; i[2] = blue; i[3] = alpha;
        for (int j=0; j<4; j++) {
            if (i[j] == GL_FALSE) {
                o[j] = false;
            } else {
                o[j] = true;
            }
        }
        canvas.invoke(false, new ColorMask(o[0], o[1], o[2], o[3]));
    }

    public void glCompileShader(int shader) {
        canvas.invoke(false, new CompileShader(shader));
    }

    public void glCopyTexImage2D(int target, int level, int internalformat,
                                 int x, int y, int width, int height, int border) {
        canvas.invoke(false, new CopyTexImage2D(target, level, internalformat,
                                                x, y, width, height, border));
    }

    public void glCopyTexSubImage2D(int target, int level, int xoffset,
                                    int yoffset, int x, int y, int width,
                                    int height) {
        canvas.invoke(false, new CopyTexSubImage2D(target, level, xoffset,
                                                   yoffset, x, y, width, 
                                                   height));
    }

    public int glCreateBuffer() {
        CreateBuffer b = new CreateBuffer();
        canvas.invoke(false, b);
        canvas.display(); // Flushes the invoke list
        return b.buffers[0];
    }

    public int glCreateFramebuffer() {
        CreateFramebuffer b = new CreateFramebuffer();
        canvas.invoke(false, b);
        canvas.display(); // Flushes the invoke list
        return b.buffers[0];
    }

    public int glCreateProgram() {
        CreateProgram p = new CreateProgram();
        canvas.invoke(false, p);
        canvas.display(); // Flushes the invoke list
        return p.id;
    }

    public int glCreateRenderbuffer() {
        CreateRenderbuffer b = new CreateRenderbuffer();
        canvas.invoke(false, b);
        canvas.display(); // Flushes the invoke list
        return b.buffers[0];
    }

    public int glCreateShader(int type) {
        CreateShader s = new CreateShader(type);
        canvas.invoke(false, s);
        canvas.display(); // Flushes the invoke list
        return s.id;
    }

    public int glCreateTexture() {
        CreateTexture t = new CreateTexture();
        canvas.invoke(false, t);
        canvas.display(); // Flushes the invoke list
        return t.textures[0];
    }

    public void glCullFace(int mode) {
        canvas.invoke(false, new CullFace(mode));
    }

    public void glDeleteBuffer(int buffer) {
        canvas.invoke(false, new DeleteBuffer(buffer));
    }

    public void glDeleteFramebuffer(int buffer) {
        canvas.invoke(false, new DeleteFramebuffer(buffer));
    }

    public void glDeleteProgram(int program) {
        canvas.invoke(false, new DeleteProgram(program));
    }

    public void glDeleteRenderbuffer(int buffer) {
        canvas.invoke(false, new DeleteRenderbuffer(buffer));
    }

    public void glDeleteShader(int shader) {
        canvas.invoke(false, new DeleteShader(shader));
    }

    public void glDeleteTexture(int texture) {
        canvas.invoke(false, new DeleteTexture(texture));
    }

    public void glDepthFunc(int func) {
        canvas.invoke(false, new DepthFunc(func));
    }

    public void glDepthMask(int flag) {
        boolean bflag;
        if (flag == GL_FALSE) {
            bflag = false;
        } else {
            bflag = true;
        }
        canvas.invoke(false, new DepthMask(bflag));
    }

    public void glDepthRange(float zNear, float zFar) {
        canvas.invoke(false, new DepthRange(zNear, zFar));
    }

    public void glDetachShader(int program, int shader) {
        canvas.invoke(false, new DetachShader(program, shader));
    }

    public void glDisable(int cap) {
        canvas.invoke(false, new Disable(cap));
    }

    public void glDisableVertexAttribArray(int index) {
        canvas.invoke(false, new DisableVertexAttribArray(index));
    }

    public void glDrawArrays(int mode, int first, int count) {
        canvas.invoke(false, new DrawArrays(mode, first, count));
    }

    public void glDrawElements(int mode, int count, int type, int offset) {
        canvas.invoke(false, new DrawElements(mode, count, type, offset));
    }

    public void glEnable(int cap) {
        // Beware: Some browsers (e.g. Chrome) have enable() and disable()
        // functions for applets. Not to be confused with this one.
        canvas.invoke(false, new Enable(cap));
    }

    public void glEnableVertexAttribArray(int index) {
        canvas.invoke(false, new EnableVertexAttribArray(index));
    }

    public void glFinish() {
        canvas.invoke(false, new Finish());
        canvas.display(); // Flushes the invoke list
    }

    public void glFlush() {
        canvas.invoke(false, new Flush());
        canvas.display(); // Flushes the invoke list
    }

    public void glFramebufferRenderbuffer(int target, int attachment, 
                                          int renderbuffertarget, int renderbuffer) {
        canvas.invoke(false, new FramebufferRenderbuffer(target, attachment,
                                                         renderbuffertarget,
                                                         renderbuffer));
    }

    public void glFramebufferTexture2D(int target, int attachment, 
                                       int textarget, int texture,
                                       int level) {
        canvas.invoke(false, new FramebufferTexture2D(target, attachment,
                                                      textarget, texture,
                                                      level));
    }

    public void glFrontFace(int mode) {
        canvas.invoke(false, new FrontFace(mode));
    }

    public void glGenerateMipmap(int target) {
        canvas.invoke(false, new GenerateMipmap(target));
    }

    public byte[] glGetActiveAttrib(int program, int index) {
        GetActiveAttrib aa = new GetActiveAttrib(program, index);
        canvas.invoke(false, aa);
        canvas.display(); // Flushes the invoke list
        byte[] size = Integer.toString(aa.size[0]).getBytes();
        byte[] type = Integer.toString(aa.type[0]).getBytes();
        byte[] comma = (new String(",")).getBytes();
        byte[] out = new byte[aa.length[0] + size.length + type.length + 2];
        for (int i = 0; i < size.length; i++) {
            out[i] = size[i];
        }
        out[size.length] = comma[0];
        for (int i = 0; i < type.length; i++) {
            out[size.length + 1 + i] = type[i];
        }
        out[size.length + 1 + type.length] = comma[0];
        for (int i = 0; i < aa.length[0]; i++) {
            out[size.length + 1 + type.length + 1 + i] = aa.name[i];
        }
        return out;
    }

    public byte[] glGetActiveUniform(int program, int index) {
        GetActiveUniform au = new GetActiveUniform(program, index);
        canvas.invoke(false, au);
        canvas.display(); // Flushes the invoke list
        byte[] size = Integer.toString(au.size[0]).getBytes();
        byte[] type = Integer.toString(au.type[0]).getBytes();
        byte[] comma = (new String(",")).getBytes();
        byte[] out = new byte[au.length[0] + size.length + type.length + 2];
        for (int i = 0; i < size.length; i++) {
            out[i] = size[i];
        }
        out[size.length] = comma[0];
        for (int i = 0; i < type.length; i++) {
            out[size.length + 1 + i] = type[i];
        }
        out[size.length + 1 + type.length] = comma[0];
        for (int i = 0; i < au.length[0]; i++) {
            out[size.length + 1 + type.length + 1 + i] = au.name[i];
        }
        return out;
    }

    public int[] glGetAttachedShaders(int program) {
        GetAttachedShaders as = new GetAttachedShaders(program);
        canvas.invoke(false, as);
        canvas.display(); // Flushes the invoke list
        int[] out = new int[as.count[0]];
        for (int i = 0; i < as.shaders[0]; i++) {
            out[i] = as.shaders[i];
        }
        return out;
    }

    public int glGetAttribLocation(int program, String name) {
        GetAttribLocation al = new GetAttribLocation(program, name);
        canvas.invoke(false, al);
        canvas.display(); // Flushes the invoke list
        return al.location;
    }

    public int glGetBufferParameteriv(int target, int pname) {
        GetBufferParameteriv iv = new GetBufferParameteriv(target, pname);
        canvas.invoke(false, iv);
        canvas.display(); // Flushes the invoke list
        return iv.params[0];
    }

    public int glGetError() {
        GetError e = new GetError();
        canvas.invoke(false, e);
        canvas.display(); // Flushes the invoke list
        return e.id;
    }

    public float glGetFloatv(int pname) {
        GetFloatv fv = new GetFloatv(pname);
        canvas.invoke(false, fv);
        canvas.display(); // Flushes the invoke list
        return fv.params[0];
    }

    public int glGetFramebufferAttachmentParameteriv(int target, int attachment,
                                                     int pname) {
        GetFramebufferAttachmentParameteriv iv = 
            new GetFramebufferAttachmentParameteriv(target, attachment, pname);
        canvas.invoke(false, iv);
        canvas.display(); // Flushes the invoke list
        return iv.params[0];
    }

    public int glGetIntegerv(int pname) {
        if (pname == this.GL_UNPACK_FLIP_Y_WEBGL) {
            return this.unpack_flip_y_webgl;
        } else if (pname == this.GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL) {
            return this.unpack_premultiply_alpha_webgl;
        } else if (pname == this.GL_UNPACK_COLORSPACE_CONVERSION_WEBGL) {
            return this.unpack_colorspace_conversion_webgl;
        } else {
            GetIntegerv iv = new GetIntegerv(pname);
            canvas.invoke(false, iv);
            canvas.display(); // Flushes the invoke list
            return iv.params[0];
        }
    }

    public int glGetProgramiv(int program, int pname) {
        GetProgramiv iv = new GetProgramiv(program, pname);
        canvas.invoke(false, iv);
        canvas.display(); // Flushes the invoke list
        return iv.params[0];
    }

    public byte[] glGetProgramInfoLog(int program) {
        GetProgramInfoLog il = new GetProgramInfoLog(program);
        canvas.invoke(false, il);
        canvas.display(); // Flushes the invoke list
        byte[] out = new byte[il.length[0]];
        for (int i = 0; i < il.length[0]; i++) {
            out[i] = il.infolog[i];
        }
        return out;
    }

    public int glGetRenderbufferParameteriv(int target, int pname) {
        GetRenderbufferParameteriv iv = 
            new GetRenderbufferParameteriv(target, pname);
        canvas.invoke(false, iv);
        canvas.display(); // Flushes the invoke list
        return iv.params[0];
    }

    public byte[] glGetShaderInfoLog(int shader) {
        GetShaderInfoLog il = new GetShaderInfoLog(shader);
        canvas.invoke(false, il);
        canvas.display(); // Flushes the invoke list
        byte[] out = new byte[il.length[0]];
        for (int i = 0; i < il.length[0]; i++) {
            out[i] = il.infolog[i];
        }
        return out;
    }

    public int glGetShaderiv(int shader, int pname) {
        GetShaderiv iv = new GetShaderiv(shader, pname);
        canvas.invoke(false, iv);
        canvas.display(); // Flushes the invoke list
        return iv.params[0];
    }

    public byte[] glGetShaderSource(int shader) {
        GetShaderSource ss = new GetShaderSource(shader);
        canvas.invoke(false, ss);
        canvas.display(); // Flushes the invoke list
        byte[] out = new byte[ss.length[0]];
        for (int i = 0; i < ss.length[0]; i++) {
            out[i] = ss.source[i];
        }
        return out;
    }

    public byte[] glGetString(int name) {
        GetString s = new GetString(name);
        canvas.invoke(false, s);
        canvas.display(); // Flushes the invoke list
        byte[] out = s.result.getBytes();
        return out;
    }

    public float glGetTexParameterfv(int target, int pname) {
        GetTexParameterfv fv = new GetTexParameterfv(target, pname);
        canvas.invoke(false, fv);
        canvas.display(); // Flushes the invoke list
        return fv.params[0];
    }

    public int glGetTexParameteriv(int target, int pname) {
        GetTexParameteriv iv = new GetTexParameteriv(target, pname);
        canvas.invoke(false, iv);
        canvas.display(); // Flushes the invoke list
        return iv.params[0];
    }

    public float glGetUniform(int program, int location) {
        GetUniform u = new GetUniform(program, location);
        canvas.invoke(false, u);
        canvas.display(); // Flushes the invoke list
        return u.result[0];
    }

    public int glGetUniformLocation(int program, String name) {
        GetUniformLocation ul = new GetUniformLocation(program, name);
        canvas.invoke(false, ul);
        canvas.display(); // Flushes the invoke list
        return ul.location;
    }

    public float glGetVertexAttribfv(int index, int pname) {
        GetVertexAttribfv fv = new GetVertexAttribfv(index, pname);
        canvas.invoke(false, fv);
        canvas.display(); // Flushes the invoke list
        return fv.params[0];
    }

    public int glGetVertexAttribiv(int index, int pname) {
        GetVertexAttribiv iv = new GetVertexAttribiv(index, pname);
        canvas.invoke(false, iv);
        canvas.display(); // Flushes the invoke list
        return iv.params[0];
    }

    public void glHint(int target, int mode) {
        canvas.invoke(false, new Hint(target, mode));
    }

    public int glIsBuffer(int buffer) {
        IsBuffer is = new IsBuffer(buffer);
        canvas.invoke(false, is);
        canvas.display(); // Flushes the invoke list
        if (is.result == false) {
            return GL_FALSE;
        } else {
            return GL_TRUE;
        }
    }

    public int glIsEnabled(int cap) {
        IsEnabled is = new IsEnabled(cap);
        canvas.invoke(false, is);
        canvas.display(); // Flushes the invoke list
        if (is.result == false) {
            return GL_FALSE;
        } else {
            return GL_TRUE;
        }
    }

    public int glIsFramebuffer(int framebuffer) {
        IsFramebuffer is = new IsFramebuffer(framebuffer);
        canvas.invoke(false, is);
        canvas.display(); // Flushes the invoke list
        if (is.result == false) {
            return GL_FALSE;
        } else {
            return GL_TRUE;
        }
    }

    public int glIsProgram(int program) {
        IsProgram is = new IsProgram(program);
        canvas.invoke(false, is);
        canvas.display(); // Flushes the invoke list
        if (is.result == false) {
            return GL_FALSE;
        } else {
            return GL_TRUE;
        }
    }

    public int glIsRenderbuffer(int renderbuffer) {
        IsRenderbuffer is = new IsRenderbuffer(renderbuffer);
        canvas.invoke(false, is);
        canvas.display(); // Flushes the invoke list
        if (is.result == false) {
            return GL_FALSE;
        } else {
            return GL_TRUE;
        }
    }

    public int glIsShader(int shader) {
        IsShader is = new IsShader(shader);
        canvas.invoke(false, is);
        canvas.display(); // Flushes the invoke list
        if (is.result == false) {
            return GL_FALSE;
        } else {
            return GL_TRUE;
        }
    }

    public int glIsTexture(int texture) {
        IsTexture is = new IsTexture(texture);
        canvas.invoke(false, is);
        canvas.display(); // Flushes the invoke list
        if (is.result == false) {
            return GL_FALSE;
        } else {
            return GL_TRUE;
        }
    }

    public void glLineWidth(float width) {
        canvas.invoke(false, new LineWidth(width));
    }

    public void glLinkProgram(int program) {
        canvas.invoke(false, new LinkProgram(program));
    }

    public void glPixelStorei(int pname, int param) {
        if (pname == this.GL_UNPACK_FLIP_Y_WEBGL) {
            // Handle WebGL pixel store properties
            this.unpack_flip_y_webgl = param;
        } else {
            canvas.invoke(false, new PixelStorei(pname, param));
        }
    }

    public void glPolygonOffset(float factor, float units) {
        canvas.invoke(false, new PolygonOffset(factor, units));
    }

    public void glRenderbufferStorage(int target, int internalformat,
                                      int width, int height) {
        canvas.invoke(false, new RenderbufferStorage(target, internalformat,
                                                     width, height));
    }

    public void glSampleCoverage(float value, int invert) {
        boolean binvert;
        if (invert == GL_FALSE) {
            binvert = false;
        } else {
            binvert = true;
        }
        canvas.invoke(false, new SampleCoverage(value, binvert));
    }

    public void glScissor(int x, int y, int width, int height) {
        canvas.invoke(false, new Scissor(x, y, width, height));
    }

    public void glShaderSource(int shader, String source) {
        canvas.invoke(false, new ShaderSource(shader, source));
    }

    public void glStencilFunc(int func, int ref, int mask) {
        canvas.invoke(false, new StencilFunc(func, ref, mask));
    }

    public void glStencilFuncSeparate(int face, int func, int ref, int mask) {
        canvas.invoke(false, new StencilFuncSeparate(face, func, ref, mask));
    }

    public void glStencilMask(int mask) {
        canvas.invoke(false, new StencilMask(mask));
    }

    public void glStencilMaskSeparate(int face, int mask) {
        canvas.invoke(false, new StencilMaskSeparate(face, mask));
    }

    public void glStencilOp(int fail, int zfail, int zpass) {
        canvas.invoke(false, new StencilOp(fail, zfail, zpass));
    }

    public void glStencilOpSeparate(int face, int fail, int zfail, int zpass) {
        canvas.invoke(false, new StencilOpSeparate(face, fail, zfail, zpass));
    }

    public void glTexImage2D(int target, int level, int internalformat,
                             int width, int height, int border,
                             int format, int type, String url) {
        canvas.invoke(false, new TexImage2D(target, level, internalformat,
                                            width, height, border,
                                            format, type, url));
    }

    public void glTexParameterf(int target, int pname, float param) {
        canvas.invoke(false, new TexParameterf(target, pname, param));
    }

    public void glTexParameteri(int target, int pname, int param) {
        canvas.invoke(false, new TexParameteri(target, pname, param));
    }

    public void glUniform1f(int location, float value) {
        canvas.invoke(false, new Uniform1f(location, value));
    }

    public void glUniform1i(int location, int value) {
        canvas.invoke(false, new Uniform1i(location, value));
    }

    public void glUniform2f(int location, float x, float y) {
        canvas.invoke(false, new Uniform2f(location, x, y));
    }

    public void glUniform2i(int location, int x, int y) {
        canvas.invoke(false, new Uniform2i(location, x, y));
    }

    public void glUniform3f(int location, float x, float y, float z) {
        canvas.invoke(false, new Uniform3f(location, x, y, z));
    }

    public void glUniform3i(int location, int x, int y, int z) {
        canvas.invoke(false, new Uniform3i(location, x, y, z));
    }

    public void glUniform4f(int location, float x, float y, float z, float w) {
        canvas.invoke(false, new Uniform4f(location, x, y, z, w));
    }

    public void glUniform4i(int location, int x, int y, int z, int w) {
        canvas.invoke(false, new Uniform4i(location, x, y, z, w));
    }

    public void glUniformMatrix2fv(int location, int count, int transpose,
                                   float value0, float value1, float value2, 
                                   float value3) {
        float[] value = new float[4];
        value[0] = value0;
        value[1] = value1;
        value[2] = value2;
        value[3] = value3;

        canvas.invoke(false, new UniformMatrix2fv(location, count, transpose, value));
    }

    public void glUniformMatrix3fv(int location, int count, int transpose,
                                   float value0, float value1, float value2, float value3,
                                   float value4, float value5, float value6, float value7,
                                   float value8) {
        float[] value = new float[9];
        value[0] = value0;
        value[1] = value1;
        value[2] = value2;
        value[3] = value3;
        value[4] = value4;
        value[5] = value5;
        value[6] = value6;
        value[7] = value7;
        value[8] = value8;

        canvas.invoke(false, new UniformMatrix3fv(location, count, transpose, value));
    }

    public void glUniformMatrix4fv(int location, int count, int transpose,
                                   float value0, float value1, float value2, float value3,
                                   float value4, float value5, float value6, float value7,
                                   float value8, float value9, float value10, float value11,
                                   float value12, float value13, float value14, float value15) {
        float[] value = new float[16];
        value[0] = value0;
        value[1] = value1;
        value[2] = value2;
        value[3] = value3;
        value[4] = value4;
        value[5] = value5;
        value[6] = value6;
        value[7] = value7;
        value[8] = value8;
        value[9] = value9;
        value[10] = value10;
        value[11] = value11;
        value[12] = value12;
        value[13] = value13;
        value[14] = value14;
        value[15] = value15;

        canvas.invoke(false, new UniformMatrix4fv(location, count, transpose, value));
    }

    public void glUseProgram(int program) {
        canvas.invoke(false, new UseProgram(program));
    }

    public void glValidateProgram(int program) {
        canvas.invoke(false, new ValidateProgram(program));
    }

    public void glVertexAttrib1f(int index, float x) {
        canvas.invoke(false, new VertexAttrib1f(index, x));
    }

    public void glVertexAttrib2f(int index, float x, float y) {
        canvas.invoke(false, new VertexAttrib2f(index, x, y));
    }

    public void glVertexAttrib3f(int index, float x, float y, float z) {
        canvas.invoke(false, new VertexAttrib3f(index, x, y, z));
    }

    public void glVertexAttrib4f(int index, float x, float y, float z, float w) {
        canvas.invoke(false, new VertexAttrib4f(index, x, y, z, w));
    }

    public void glVertexAttribPointer(int indx, int size, int type, int normalized, int stride, int offset) {
        canvas.invoke(false, new VertexAttribPointer(indx, size, type, normalized, stride, offset));
    }

    public void glViewport(int x, int y, int width, int height) {
        canvas.invoke(false, new Viewport(x, y, width, height));
    }

}
