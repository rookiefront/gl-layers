import { mat4, vec3 } from 'gl-matrix';
import * as reshader from '@maptalks/reshader.gl';
import  { getGroundTransform } from '../util/util';

//阴影覆盖的pitch范围
const SHADOW_MAX_PITCH = 62;
let VISUAL_EXTENT;

class ShadowProcess {
    static getUniformDeclares() {
        const uniforms = [];
        uniforms.push({
            name: 'shadow_lightProjViewModelMatrix',
            type: 'function',
            fn: function (context, props) {
                const lightProjViews = props['shadow_lightProjViewMatrix'];
                const model = props['modelMatrix'];
                return  mat4.multiply([], lightProjViews, model);
            }
        });
        uniforms.push('shadow_shadowMap', 'shadow_opacity', 'esm_shadow_threshold', 'shadow_color', 'shadow_nearFar');
        return uniforms;
    }

    constructor(regl, sceneConfig, layer) {
        this.renderer = new reshader.Renderer(regl);
        this.sceneConfig = sceneConfig;
        this._esmShadowThreshold = 0.3;
        this._layer = layer;
        this._init();
    }

    resize() {
        const canvas = this.canvas;
        canvas.width = this._layer.getRenderer().canvas.width;
        canvas.height = this._layer.getRenderer().canvas.height;
    }

    _init() {
        const shadowConfig = this.sceneConfig.shadow;
        let shadowRes = 512;
        const quality = shadowConfig.quality;
        if (quality === 'high') {
            shadowRes = 2048;
        } else if (quality === 'medium') {
            shadowRes = 1024;
        }
        const defines = this.getDefines();
        this._shadowPass = new reshader.ShadowPass(this.renderer, { width: shadowRes, height: shadowRes, blurOffset: shadowConfig.blurOffset, defines });
        this._shadowDisplayShader = new reshader.ShadowDisplayShader(defines);

        this._createGround();
    }

    getDefines() {
        const defines = {
            'HAS_SHADOWING': 1,
            'PACK_FLOAT': 1,
            'USE_ESM': 1
        };
        return defines;
    }

    render(displayShadow, projMatrix, viewMatrix, color, opacity, lightDirection, scene, halton, framebuffer, forceRefresh) {
        this._transformGround();
        const map = this._layer.getMap();
        const changed = forceRefresh || this._shadowChanged(map, scene, !!displayShadow);
        let matrix, smap;
        if (changed) {
            const cameraProjViewMatrix = mat4.multiply([], projMatrix, viewMatrix);
            const lightDir = vec3.normalize([], lightDirection);

            if (!VISUAL_EXTENT) {
                VISUAL_EXTENT = map.getContainerExtent();
            }
            //只渲染pitch < SHADOW_MAX_PITCH的范围内的mesh，提高shadowmap精度
            let visualHeight = map.height;
            if (map.getPitch() > SHADOW_MAX_PITCH) {
                visualHeight = map._getVisualHeight(SHADOW_MAX_PITCH);
            }
            const containerExtent = VISUAL_EXTENT.set(0, map.height - visualHeight, map.width, map.height);
            const extent = containerExtent.convertTo(c => map['_containerPointToPoint'](c, map.getGLZoom()));

            const arr = extent.toArray();
            if (displayShadow) {
                scene.addMesh(this._ground);
            }
            const farPlane = arr.map(c => [c.x, c.y, 0, 1]);
            const { lightProjViewMatrix, shadowMap, /* depthFBO, */ blurFBO } = this._shadowPass.render(
                scene,
                { cameraProjViewMatrix, lightDir, farPlane, cameraLookAt: map.cameraLookAt }
            );
            matrix = this._lightProjViewMatrix = lightProjViewMatrix;
            smap = this._shadowMap = shadowMap;
            this._blurFBO = blurFBO;
            this._renderedShadows = scene.getMeshes().reduce((ids, m) => {
                if (m.castShadow) {
                    ids[m.uuid] = {
                        v0: m.version,
                        v1: m.geometry.version
                    };
                }
                return ids;
            }, {});
            this._renderedView = {
                count: scene.getMeshes().length - +!!displayShadow,
                displayShadow: !!displayShadow
            };
            this._updated = true;
        } else {
            matrix = this._lightProjViewMatrix;
            smap = this._shadowMap;
            // fbo = this._blurFBO;
            this._updated = false;
        }
        this._projMatrix = projMatrix;
        this._viewMatrix = viewMatrix;
        if (displayShadow && scene.getMeshes().length) {
            this.displayShadow(color, opacity, halton, framebuffer);
        }
        const uniforms = {
            'shadow_lightProjViewMatrix': matrix,
            'shadow_shadowMap': smap,
            'shadow_opacity': opacity,
            'shadow_color': color,
            'esm_shadow_threshold': this._esmShadowThreshold
        };

        return uniforms;
    }

    displayShadow(color, opacity, halton, framebuffer) {
        const matrix = this._lightProjViewMatrix;
        const ground = this._ground;
        const groundLightProjViewModelMatrix = this._groundLightProjViewModelMatrix || [];
        const canvas = this._layer.getRenderer().canvas;
        //display ground shadows
        this.renderer.render(this._shadowDisplayShader, {
            'halton': halton || [0, 0],
            'globalTexSize': [canvas.width, canvas.height],
            'projMatrix': this._projMatrix,
            'viewMatrix': this._viewMatrix,
            'shadow_lightProjViewModelMatrix': mat4.multiply(groundLightProjViewModelMatrix, matrix, ground.localTransform),
            'shadow_shadowMap': this._shadowMap,
            'esm_shadow_threshold': this._esmShadowThreshold,
            'shadow_opacity': opacity,
            'color': color || [0, 0, 0]
        }, this._groundScene, framebuffer);
    }

    dispose() {
        this._shadowPass.dispose();
        this._shadowDisplayShader.dispose();
        // if (this._shadowMap) {
        // //已经在shadowPass中destroy了
        //     this._shadowMap.destroy();
        // }
        // if (this._blurFBO) {
        //     this._blurFBO.destroy();
        // }
        if (this._ground) {
            this._ground.geometry.dispose();
            this._ground.dispose();
        }
        delete this.renderer;
    }

    isUpdated() {
        return this._updated !== false;
    }

    _shadowChanged(map, scene, displayShadow) {
        // if (this._rendered || !this._rendered && scene.getMeshes().length > 5) {
        //     this._rendered = true;
        //     return false;
        // }
        if (!this._renderedShadows) {
            return true;
        }
        const renderedView = this._renderedView;
        if (scene.getMeshes().length !== renderedView.count || displayShadow !== renderedView.displayShadow) {
            return true;
        }
        const meshes = scene.getMeshes();
        let changed = false;
        for (let i = 0; i < meshes.length; i++) {
            const saved = this._renderedShadows[meshes[i].uuid];
            if (meshes[i].castShadow &&
                (meshes[i].hasSkinAnimation() || !saved ||
                    saved.v0 !== meshes[i].version ||
                    saved.v1 !== meshes[i].geometry.version)) {
                return true;
            }
        }

        return changed;
    }

    _createGround() {
        const planeGeo = new reshader.Plane();
        planeGeo.generateBuffers(this.renderer.regl);
        this._ground = new reshader.Mesh(planeGeo);
        this._groundScene = new reshader.Scene([this._ground]);
    }

    _transformGround() {
        const map = this._layer.getMap();
        const localTransform = getGroundTransform(this._ground.localTransform, map);
        this._ground.setLocalTransform(localTransform);
    }
}

export default ShadowProcess;
