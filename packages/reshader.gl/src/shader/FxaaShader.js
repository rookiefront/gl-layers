import QuadShader from './QuadShader.js';
import vert from './glsl/quad.vert';
import frag from './glsl/fxaa.frag';

class FxaaShader extends QuadShader {
    constructor() {
        super({
            vert, frag,
            extraCommandProps: {
                viewport: {
                    x: 0,
                    y: 0,
                    width: (context, props) => {
                        return props['resolution'][0];
                    },
                    height: (context, props) => {
                        return props['resolution'][1];
                    }
                }
            }
        });
    }

    getMeshCommand(regl, mesh) {
        const key = this._dkey || '';
        if (!this.commands[key + '_fxaa']) {
            this.commands[key + '_fxaa'] = this.createREGLCommand(
                regl,
                null,
                mesh.getElements()
            );
        }
        return this.commands[key + '_fxaa'];
    }
}

export default FxaaShader;
