import * as maptalks from 'maptalks';
import { toJSON } from '../../../common/Util';
import { IconRequestor, GlyphRequestor } from '@maptalks/vector-packer';

// GeoJSONVectorLayer caches data in memory, should use a dedicated worker.
const dedicatedLayers = ['GeoJSONVectorTileLayer'];

export default class WorkerConnection extends maptalks.worker.Actor {

    constructor(workerKey, layer) {
        super(workerKey);
        const mapId = layer.getMap().id;
        this._layer = layer;
        this._mapId = mapId;
        const type = layer.getJSONType();
        this._isDedicated = dedicatedLayers.indexOf(type) >= 0;
        this._dedicatedVTWorkers = {};
        this._iconRequestor = new IconRequestor();
        this._glyphRequestor = new GlyphRequestor();
    }

    initialize(cb) {
        cb(null);
    }

    addLayer(cb) {
        const layer = this._layer;
        const options = layer.getWorkerOptions() || {};
        const layerId = layer.getId(), type = layer.getJSONType();
        const data = {
            mapId : this._mapId,
            layerId,
            command : 'addLayer',
            params : {
                type : type,
                options : options
            }
        };
        if (this._isDedicated) {
            if (this._dedicatedVTWorkers[layerId] === undefined) {
                this._dedicatedVTWorkers[layerId] = this.getDedicatedWorker();
            }
            this.send(data, null, cb, this._dedicatedVTWorkers[layerId]);
        } else {
            this.broadcast(data, null, cb);
        }
    }

    abortTile(url, cb) {
        const layer = this._layer;
        const layerId = layer.getId();
        const data = {
            mapId : this._mapId,
            layerId,
            command : 'abortTile',
            params : {
                url
            }
        };
        if (this._isDedicated) {
            if (this._dedicatedVTWorkers[layerId] === undefined) {
                this._dedicatedVTWorkers[layerId] = this.getDedicatedWorker();
            }
            this.send(data, null, cb, this._dedicatedVTWorkers[layerId]);
        } else {
            this.broadcast(data, null, cb);
        }
    }

    removeLayer(cb) {
        const layerId = this._layer.getId();
        const data = {
            mapId : this._mapId,
            layerId,
            command : 'removeLayer'
        };
        if (this._isDedicated) {
            if (this._dedicatedVTWorkers[layerId] !== undefined) {
                this.send(data, null, cb, this._dedicatedVTWorkers[layerId]);
            }
            delete this._dedicatedVTWorkers[layerId];
        } else {
            this.broadcast(data, null, cb);
        }
    }

    updateStyle(style, cb) {
        const layerId = this._layer.getId();
        const data = {
            mapId : this._mapId,
            layerId,
            command : 'updateStyle',
            params : style
        };
        if (this._isDedicated) {
            if (this._dedicatedVTWorkers[layerId] !== undefined) {
                this.send(data, null, cb, this._dedicatedVTWorkers[layerId]);
            }
        } else {
            this.broadcast(data, null, cb);
        }
    }

    updateOptions(options, cb) {
        const layerId = this._layer.getId();
        const data = {
            mapId : this._mapId,
            layerId,
            command : 'updateOptions',
            params : options
        };
        if (this._isDedicated) {
            if (this._dedicatedVTWorkers[layerId] !== undefined) {
                this.send(data, null, cb, this._dedicatedVTWorkers[layerId]);
            }
        } else {
            this.broadcast(data, null, cb);
        }
    }

    //send(layerId, command, data, buffers, callback, workerId)
    loadTile(context, cb) {
        const layerId = this._layer.getId();
        const data = {
            mapId : this._mapId,
            layerId,
            command : 'loadTile',
            params : {
                tileInfo : toJSON(context.tileInfo),
                glScale : context.glScale,
                zScale : context.zScale
            }
        };
        this.send(data, null, cb, this._dedicatedVTWorkers[layerId]);
    }

    remove() {
        super.remove();
        this._dedicatedVTWorkers = {};
    }

    fetchIconGlyphs({ icons, glyphs }, cb) {
        //error, data, buffers
        const glyphData = this._glyphRequestor.getGlyphs(glyphs);
        const dataBuffers = glyphData.buffers || [];
        this._iconRequestor.getIcons(icons, (err, data) => {
            if (err) {
                throw err;
            }
            if (data.buffers) {
                dataBuffers.push(...data.buffers);
            }
            cb(null, { icons : data.icons, glyphs : glyphData.glyphs }, dataBuffers);
        });
        //error, data, buffers

    }

    setData(geojson, cb) {
        const layerId = this._layer.getId();
        const data = {
            mapId : this._mapId,
            layerId,
            command : 'setData',
            params : {
                data : JSON.stringify(geojson)
            }
        };
        this.send(data, null, cb, this._dedicatedVTWorkers[layerId]);
    }

    _getTileKey(tileInfo) {
        return tileInfo.id;
    }
}
