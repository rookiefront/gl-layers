const maptalks = require('maptalks');
require('@maptalks/gl');
require('@maptalks/transcoders.draco');
require('@maptalks/transcoders.ktx2');
require('@maptalks/transcoders.crn');
const { Geo3DTilesLayer, B3DMLoader, Geo3DTransform } = require('../dist/maptalks.3dtiles');
const assert = require('assert');
const startServer = require('./server.js');

const PORT = 39887;
describe('3dtiles layer', () => {
    let container, map;
    let server;
    before(done => {
        server = startServer(PORT, done);
    });

    after(() => {
        server.close();
    });

    function createMap(center) {
        const option = {
            zoom: 17,
            center: center || [0, 0]
        };
        map = new maptalks.Map(container, option);
    }

    beforeEach(() => {
        container = document.createElement('div');
        container.style.width = '800px';
        container.style.height = '600px';
        document.body.appendChild(container);
        createMap();
    });

    afterEach(() => {
        map.remove();
        document.body.innerHTML = '';
    });

    it.skip('workerready event', done => {
        const layer = new Geo3DTilesLayer('3d-tiles', {
            url : 'resources'
        }).addTo(map);
        layer.on('workerready', () => {
            done();
        });
    });

    it('get root tile', done => {
        //example is from http://web3d.smartearth.cn/
        map.setCenterAndZoom([-81.38110, 28.53711], 15);
        const layer = new Geo3DTilesLayer('3d-tiles', {
            services : [
                {
                    url : `http://localhost:${PORT}/resources/tileset.json`
                }
            ]
        }).addTo(map);
        layer.on('workerready', () => {
            layer.getTiles(map.getZoom());
        });
        let count = 0;
        layer.on('loadtileset', () => {
            assert(layer.getRootTiles().length);
            const z = map.getZoom();
            if (count === 1) {
                const tree = layer.getTiles(z);
                assert(tree.root);
                assert(tree.tiles['4']);
                done();
                return;
            }
            layer.getTiles(z);
            count++;
        });
    });

    it('root tile with maxExtent', done => {
        //example is from http://web3d.smartearth.cn/
        map.setCenterAndZoom([-81.38110, 28.53711], 15);
        const layer = new Geo3DTilesLayer('3d-tiles', {
            services : [
                {
                    url : `http://localhost:${PORT}/resources/tileset.json`,
                    maxExtent : [-81.38110, 28.53711, -81.38100, 28.53701]
                }
            ]
        }).addTo(map);
        layer.on('workerready', () => {
            layer.getTiles(map.getZoom());
        });
        let count = 0;
        layer.on('loadtileset', () => {
            assert(layer.getRootTiles().length);
            const z = map.getZoom();
            if (count === 1) {
                const tree = layer.getTiles(z);
                assert(tree.root);
                assert(!tree.tiles['3']);
                done();
                return;
            }
            layer.getTiles(z);
            count++;
        });
    });

    it('cartesian conversion', () => {
        const degree = [-81.38110, 28.53711, 10];
        const cartesian = Geo3DTransform.radianToCartesian3([], toRadian(degree[0]), toRadian(degree[1]), degree[2]);
        const result = [];
        Geo3DTransform.cartesian3ToDegree(result, cartesian);
        assert(closeTo(degree[0], result[0]));
        assert(closeTo(degree[1], result[1]));
        assert(closeTo(degree[2], result[2]));
    });

    it('#59', done => {
        const url = `http://localhost:${PORT}/models/b3dm/59/Tile_066_000.b3dm`;
        const loader = new B3DMLoader();
        loader.load(url).then(b3dm => {
            assert(b3dm);
            // assert(b3dm.gltf.extensions['CESIUM_RTC']);
            // // const mesh = b3dm.gltf.scenes[0].nodes[0].children[0].meshes[0].primitives[0];
            // const meshId = b3dm.gltf.scenes[0].nodes[0].children[0].mesh;
            // const mesh = b3dm.gltf.meshes[meshId].primitives[0];
            // assert(mesh.attributes.NORMAL.array.length, 16242);
            // assert(mesh.attributes.NORMAL.array instanceof Int8Array);

            // assert(mesh.attributes.POSITION.array.length, 24363);
            // assert(mesh.attributes.POSITION.array instanceof Float32Array);
            // // assert(mesh.attributes.POSITION.array.slice(0, 3), [-323.6338806152344, -275.46630859375, -401.045654296875]);

            // assert(mesh.attributes.TEXCOORD_0.array.length, 16242);
            // assert(mesh.attributes.TEXCOORD_0.array instanceof Float32Array);

            // assert(mesh.indices.array.length, 14997);
            // assert(mesh.indices.array instanceof Uint16Array);
            done();
        });
    });

    it('#boundingVolumeToExtent', () => {
        const layer = new Geo3DTilesLayer('3d-tiles', {
            services : [
                {
                    url : `http://localhost:${PORT}/resources/tileset.json`,
                }
            ]
        }).addTo(map);
        const extent = layer.boundingVolumeToExtent({
            boundingVolume: {
                "region": [
                    -1.4204712416151453,
                    0.49800679092376193,
                    -1.4201987843013089,
                    0.49830411301151378,
                    -8.7278216997070359,
                    182.92868769970704
                ]
            }
        });
        assert.deepEqual(extent.toJSON(), {
            xmin: -81.38700706425566,
            ymin: 28.533687288785547,
            xmax: -81.37139641007535,
            ymax: 28.55072258956975
        });

        const extentBox = layer.boundingVolumeToExtent({
            matrix: [
                -0.861058504845289,
                -0.508505900883752,
                0,
                0,
                0.235062586065517,
                -0.398034002262073,
                0.886743770023465,
                0,
                -0.450914439628836,
                0.763538264797279,
                0.462261274956677,
                0,
                -2878053.32383345,
                4873438.61217369,
                2930725.20027488,
                1
            ],
            boundingVolume: {
                "box": [
                    -2.3283064365387e-10,
                    2.14602440176532,
                    52.484822305385,
                    9975.53954897053,
                    0,
                    0,
                    0,
                    6881.10767430486,
                    0,
                    0,
                    0,
                    64.0063447351567
                ]
            }
        });
        assert.deepEqual(extentBox.toJSON(), {
            xmin: 120.46321996224492,
            ymin: 27.443527551741568,
            xmax: 120.66533465490011,
            ymax: 27.622751126358082
        });


        const extentShpere = layer.boundingVolumeToExtent({
            matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            boundingVolume: {
                "sphere": [
                    -2372660.31634378,
                    5384485.98130032,
                    2453717.4743559,
                    535.131755862017
                ]
            }
        });
        assert.deepEqual(extentShpere.toJSON(), { xmin: 113.7753551529886,
            ymin: 22.768881394155017,
            xmax: 113.78578239065746,
            ymax: 22.77849573485838 });
    });

    it('should load model with non-power-of-2-texture', done => {
        map.setCenterAndZoom([120.54632697304714, 27.593883052408984], 17.979611186739113);
        const layer = new Geo3DTilesLayer('3d-tiles', {
            services : [
                {
                    url : `http://localhost:${PORT}/models/b3dm/texture_no_power_of_2/tileset.json`,
                    maximumScreenSpaceError : 32
                }
            ]
        });
        layer.once('tileload', () => {
            layer.once('layerload', () => {
                done();
            });
        });

        layer.addTo(map);
    });

    it('get 404 tile', done => {
        const layer = new Geo3DTilesLayer('3d-tiles', {
            services : [
                {
                    url : `http://localhost:${PORT}/resources/404.json`
                }
            ]
        }).addTo(map);
        layer.on('tileerror', (err) => {
            assert(err.error.status === 404);
            done();
        });
    });

});

function toRadian(d) {
    return d * Math.PI / 180;
}

const EPSILON7 = 1E-7;
function closeTo(a, b) {
    if (a + EPSILON7 > b && a - EPSILON7 < b) {
        return true;
    }
    return false;
}
