/* eslint-disable camelcase */
import esm_shadow_vert from './glsl/esm_shadow_vert.glsl';
import esm_shadow_frag from './glsl/esm_shadow_frag.glsl';

//Shader Chunks for includes
const ShaderChunk = {
    esm_shadow_vert,
    esm_shadow_frag
};
/* eslint-enable camelcase */

export default {
    /**
     * Register a new shader segment for includes
     * @param {String} name key name
     * @param {String} source shader segment source
     */
    register(name, source) {
        if (ShaderChunk[name]) {
            throw new Error(`Key of ${name} is already registered in ShaderLib.`);
        }
        ShaderChunk[name] = source;
    },

    /**
     * Compile the given source, replace #include with registered shader sources
     * @param {String} source source to compile
     */
    compile(source) {
        return parseIncludes(source);
    }
};

const pattern = /^[ \t]*#include +<([\w\d.]+)>/gm;

function parseIncludes(string) {
    return string.replace(pattern, replace);
}

function replace(match, include) {
    const replace = ShaderChunk[include];
    if (!replace) {
        throw new Error('Can not resolve #include <' + include + '>');
    }
    return parseIncludes(replace);
}
