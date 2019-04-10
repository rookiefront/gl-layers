#define SHADER_NAME standard
    #extension GL_OES_standard_derivatives : enable
#if defined(GL_EXT_shader_texture_lod)
    #extension GL_EXT_shader_texture_lod : enable
#endif

precision mediump float;

vec4 textureLod(sampler2D sampler1, vec2 coord, float lod) {
    return texture2DLodEXT(sampler1, coord, lod);
}

vec4 textureLod(sampler2D sampler, vec3 coord, float lod) {
    return texture2DProjLodEXT(sampler, coord, lod);
}
