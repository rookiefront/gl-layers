

import * as maptalks from 'maptalks';
import { compileStyle } from '@maptalks/feature-filter';
import { isNil, intersectArray, defined } from './Util';
import { GeoJSON, GEOJSON_TYPES } from './GeoJSON';
import SHADER_MAP from './ShaderMap';

//鼠标事件列表
const MAP_EVENTS = ['mousedown', 'mouseup', 'mousemove', 'contextmenu', 'click', 'dbclick', 'touchstart', 'touchmove', 'touchend'];
const options = {
    'renderer': 'gl',
    'doubleBuffer': false,
    'glOptions': null,
    'markerEvents': true,
    'forceRenderOnZooming': true,
    'forceRenderOnMoving': true,
    'forceRenderOnRotating': true,
    'gltfCoordinateSystem': 'map'//map, gltf两种情况，分别是地图坐标系和gltf模型内部坐标系
};
const regex = /\{*(\$root)*\}/g;

export default class AbstractGLTFLayer extends maptalks.OverlayLayer {
    constructor(id, geometries, options) {
        if (geometries && (!(geometries instanceof maptalks.Geometry) && !Array.isArray(geometries) && !GEOJSON_TYPES[geometries.type])) {
            options = geometries;
            geometries = null;
        }
        super(id, null, options);
        this.pickingId = 0;
        this._markerMap = {};
        this._modelMap = {};
        this._idList = {};
        this.mapEvents = '';
        const style = options && options.style;
        this.setStyle(style);
        if (geometries) {
            this.addGeometry(geometries);
        }
    }

    static registerShader(name, type, config, uniforms) {
        SHADER_MAP[name] = { name, type, config, uniforms };
    }

    static removeShader(name) {
        delete SHADER_MAP[name];
    }

    static getShaders() {
        const shaders = [];
        for (const name in SHADER_MAP) {
            shaders.push({
                shader: name,
                uniforms: SHADER_MAP[name].uniforms,
            });
        }
        return shaders;
    }

    static getShaderMap() {
        return SHADER_MAP;
    }

    addGeometry(geometries, fitView) {
        let geos = GeoJSON.isGeoJSON(geometries) ? GeoJSON.toGeometry(geometries, this.getJSONType()) : geometries;
        geos = Array.isArray(geos) ? geos : [geos];
        for (let i = 0; i < geos.length; i++) {
            if (!this._isAccept(geos[i])) {
                console.error('type of geometry is invalid');
                return;
            }
        }
        super.addGeometry(geos, fitView);
        if (Array.isArray(geos)) {
            this.addMarker(geos);
        }
    }

    addMarker(markers) {
        for (let i = 0; i < markers.length; i++) {
            const marker = markers[i];
            marker._setPickingId(this.pickingId);
            this._markerMap[this.pickingId] = marker;
            // marker._layer = this;
            this._addEvents(marker.getListeningEvents());
            const id = marker.getId();
            if (id) {
                this._idList[id] = marker;
            }
            marker.fire('add', { type : 'add', target : marker, layer : this });
            if (marker.getGLTFMarkerType() === 'multigltfmarker') {
                this.pickingId += marker.getCount();
            } else {
                this.pickingId++;
            }
            // this._loadModel(marker);
        }
    }

    _loadModel(marker) {
        const renderer = this.getRenderer();
        if (renderer) {
            renderer.loginGLTFMarker(marker);
        }
    }

    //
    toJSON(options) {
        if (!options) {
            options = {};
        }
        const profile = {
            'type': this.getJSONType(),
            'id': this.getId(),
            'options': this.config()
        };
        if (isNil(options['style']) || options['style']) {
            profile['style'] = this.getStyle();
        }
        if (isNil(options['geometries']) || options['geometries']) {
            const geoJSONs = [];
            const markers = this['_geoList'];
            for (let i = 0; i < markers.length; i++) {
                const marker = markers[i];
                const json = marker._toJSONObject();
                geoJSONs.push(json);
            }
            profile['geometries'] = geoJSONs;
        }
        return profile;
    }

    _isAccept(marker) {
        if (!marker.getGLTFMarkerType) {
            return false;
        }
        const acceptMarkerTypes = this.options.markerTypes;
        if (acceptMarkerTypes.indexOf(marker.getGLTFMarkerType()) > -1) {
            return true;
        }
        return false;
    }

    setStyle(layerStyle) {
        //如果layerStyle为空，则恢复默认样式
        if (!layerStyle) {
            delete this._layerStyle;
            delete this.options.style;
            return this;
        }
        //layer的结构如下:
        //结构一, 为Object
        // {
        //     filed1:'',
        //     filed2:'',
        //     $root:'',
        //     style: [{filter, symbol}, {filter, symbol},...]
        // }
        // 结构二, 为Array
        // [{filter, symbol}, {filter, symbol},...]
        this.options.style = layerStyle;
        this._layerStyle = JSON.parse(JSON.stringify(layerStyle));
        this._styleMarkerList();
        this.fire('setstyle', { target: this, style: this._layerStyle });
        return this;
    }

    getStyle() {
        //返回原始的style
        return this.options.style;
    }

    updateSymbol(idx, symbolProperties) {
        const layerStyle = this.getStyle();
        //同时需要更新this.options.style和this._layerStyle上的symbol
        this._updateSymbolInStyle(idx, symbolProperties, layerStyle);
        this._updateSymbolInStyle(idx, symbolProperties, this._layerStyle);
        this._styleMarkerList();
        this.fire('updatesymbol', { target: this, index: idx, symbol: symbolProperties });
    }

    _updateSymbolInStyle(idx, symbolProperties, layerStyle) {
        if (!layerStyle) {
            return;
        }
        const style = layerStyle.style ? layerStyle.style : layerStyle;
        const symbol = style[idx].symbol || {};
        for (const p in symbolProperties) {
            symbol[p] = symbolProperties[p];
        }
    }

    _styleMarkerList() {
        this['_processRootUrl'](this._layerStyle);
        const cookStyles = this._layerStyle.style ? this._layerStyle.style : this._layerStyle;
        this._cookedStyles = compileStyle(cookStyles);
        const geoList = this['_geoList'];
        geoList.forEach(function (marker) {
            this._styleMarker(marker);
        }, this);
    }

    getGLTFUrls() {
        return Object.keys(this._modelMap);
    }

    _addEvents(events) {
        const splitEvents = maptalks.Util.isString(events) ? events.split(/\s+/).map(e => {
            //mouseleave、mouseenter、mouseout需要置换成map的mousemove事件
            return (e === 'mouseleave' || e === 'mouseenter' || e === 'mouseout') ? 'mousemove' : e;
        }) : events;
        let currentEvents = this.mapEvents;
        const newEvents = intersectArray(splitEvents, MAP_EVENTS).filter(e => {
            return this.mapEvents.indexOf(e) < 0;
        });
        this.mapEvents += ' ' + newEvents.join(' ');
        this.mapEvents = this.mapEvents.trim();
        const domEvents = this.mapEvents.replace(' ', ' dom:');
        currentEvents = currentEvents.replace(' ', ' dom:');
        const map = this.getMap();
        if (map) {
            map.off('dom:' + currentEvents, this._mapEventHandler, this);
            map.on('dom:' + domEvents, this._mapEventHandler, this);
        }
    }
    //去重
    _removeEvents() {
        const newEvents = {};
        let currentEvents = this.mapEvents;
        const geoList = this['_geoList'];
        for (let i = 0; i < geoList.length; i++) {
            const marker = geoList[i];
            //marker自己的事件，置换mouseleave、mouseenter、mouseout为mousemove
            const markerEvents = marker.getListeningEvents().map(e => {
                return (e === 'mouseleave' || e === 'mouseenter' || e === 'mouseout') ? 'mousemove' : e;
            });
            //有效的map事件
            for (let ii = 0; ii < markerEvents.length; ii++) {
                //利用对象字面量进行去重，例如[a, b, c, mousemove] =>  {a:1,b:1,c:1,mousemove:1}
                newEvents[markerEvents[ii]] = 1;
            }
        }
        this.mapEvents = intersectArray(Object.keys(newEvents), MAP_EVENTS).join(' ');
        const domEvents = this.mapEvents.replace(' ', ' dom:');
        currentEvents = currentEvents.replace(' ', ' dom:');
        const map = this.getMap();
        if (map) {
            map.off('dom:' + currentEvents, this._mapEventHandler, this);
            map.on('dom:' + domEvents, this._mapEventHandler, this);
        }
    }

    //将symbol中url的$root部分用style的root替换
    _processRootUrl(layerStyle) {
        if (maptalks.Util.isString(layerStyle.$root)) {
            layerStyle.style.forEach(stl => {
                const url = stl.symbol.url;
                if (url && url.indexOf('{$root}') > -1) {
                    stl.symbol.url = url.replace(regex, layerStyle.$root);
                }
            });
        }
    }

    _styleMarker(marker) {
        if (!this._cookedStyles) {
            return false;
        }
        for (let i = 0, len = this._cookedStyles.length; i < len; i++) {
            if (this._cookedStyles[i]['filter']({ properties: marker.getProperties() }) === true) {
                const symbol = this._cookedStyles[i]['symbol'];
                const url = symbol.url;
                marker._setPropInExternSymbol('url', url);
                marker.updateSymbol(symbol);
                return true;
            }
        }
        return false;
    }

    _filterOutline(marker) {
        if (!this._cookedStyles) {
            return;
        }
        for (let i = 0, len = this._cookedStyles.length; i < len; i++) {
            if (this._cookedStyles[i]['filter']({ properties: marker.getProperties() }) === true) {
                if (this._cookedStyles[i].outline) {
                    marker.outline();
                }
            }
        }
    }

    removeGeometry(markers) {
        this._removeEvents();
        super.removeGeometry(markers);
    }

    getMapEvents() {
        return this.mapEvents;
    }

    _deleteMarker(marker) {
        const id = maptalks.Util.isString(marker) ? this._idList[marker]._getPickingId() : marker._getPickingId();
        const renderer = this.getRenderer();
        if (renderer) {
            renderer._deleteScene(id);
        }
        delete this._markerMap[id];
        delete this._idList[marker];
    }

    clear() {
        super.clear();
        this._markerMap = {};
        this._idList = {};
        return this;
    }

    _getMarkerMap() {
        return this._markerMap;
    }

    _pick(x, y, options) {
        const renderer = this.getRenderer();
        if (renderer) {
            return renderer._pick(x, y, options);
        }
        return null;
    }

    //判断模型数据是否都载入完成
    _isModelsLoadComplete() {
        const geoList = this['_geoList'];
        for (let i = 0; i < geoList.length; i++) {
            if (!geoList[i].isLoaded()) {
                return false;
            }
        }
        return true;
    }

    _getMarkerContainerExtent(pickingId) {
        const renderer = this.getRenderer();
        if (!renderer) {
            return null;
        }
        return renderer._getMarkerContainerExtent(pickingId);
    }

    _mapEventHandler(e) {
        if (!this.options.markerEvents) {
            return;
        }
        const map = this.getMap();
        if (!map) {
            return;
        }
        this._lastTargetId = this._currentTargetId;
        this._lastTargetIndex = this._currentTargetIndex;
        this._lastPoint = this._currentPoint;
        this._lastMeshId = this._currentMeshId;
        this._lastPickingId = this._currentPickingId;
        const containerPoint = e.containerPoint;
        const x = Math.round(containerPoint.x), y = Math.round(containerPoint.y);
        if (x <= 0 || x >= map.width || y <= 0 || y >= map.height) {
            this._currentTargetId = null;
            this._currentMeshId = null;
            this._currentPoint = null;
            return;
        }
        const result = this._pick(x, y);
        if (!result) {
            return;
        }
        result.coordinate = e.coordinate;
        this._currentTargetId = null;
        if (result.target && result.target.getGLTFMarkerType() === 'gltfmarker') {
            this._currentTargetId = result.target._getPickingId();
        } else if (result.target && result.target.getGLTFMarkerType() === 'multigltfmarker') {
            this._currentTargetId = result.target._getPickingId() + result.index;
        }
        this._currentTargetIndex = result.target ? result.index : null;
        this._currentMeshId = result.meshId;
        this._currentPoint = JSON.stringify(result.point);
        this._currentPickingId = result.pickingId;
        const event = e.type.replace('dom:', '');
        if (event === 'mousemove') {
            const mousemoveTargets = this._getMouseMoveTargets();
            mousemoveTargets.forEach(e => {
                if (e.target.getIndexByPickingId) {
                    e.index = e.target.getIndexByPickingId(e.pickingId);
                }
                e.target.fire(e.type, e);
            });
        } else if (result.target) {
            result.target.fire(event, result);
        }
    }

    _getMouseMoveTargets() {
        const eventTargets = [];
        if (defined(this._currentTargetId) && !defined(this._lastTargetId)) {
            eventTargets.push({
                type: 'mouseenter',
                target: this._getEventTarget(this._currentTargetId, 0),
                meshId: this._currentMeshId,
                pickingId: this._currentPickingId,
                point: JSON.parse(this._currentPoint)
            });
        } else if (!defined(this._currentTargetId) && defined(this._lastTargetId)) {
            eventTargets.push({
                type: 'mouseout',
                target: this._getEventTarget(this._lastTargetId, 1),
                meshId: this._lastMeshId,
                pickingId: this._lastPickingId,
                point: JSON.parse(this._lastPoint)
            },
            {
                type: 'mouseleave',
                target: this._getEventTarget(this._lastTargetId, 1),
                meshId: this._lastMeshId,
                pickingId: this._lastPickingId,
                point: JSON.parse(this._lastPoint)
            });
        } else if (defined(this._currentTargetId) && defined(this._lastTargetId)) {
            if (this._currentTargetId === this._lastTargetId) {
                eventTargets.push({
                    type: 'mousemove',
                    target: this._getEventTarget(this._currentTargetId, 0),
                    meshId: this._currentMeshId,
                    pickingId: this._currentPickingId,
                    point: JSON.parse(this._currentPoint)
                });
            } else {
                eventTargets.push({
                    type: 'mouseenter',
                    target: this._getEventTarget(this._currentTargetId, 0),
                    meshId: this._currentMeshId,
                    pickingId: this._currentPickingId,
                    point: JSON.parse(this._currentPoint)
                },
                {
                    type: 'mouseout',
                    target: this._getEventTarget(this._lastTargetId, 1),
                    meshId: this._lastMeshId,
                    pickingId: this._lastPickingId,
                    point: JSON.parse(this._lastPoint)
                },
                {
                    type: 'mouseleave',
                    target: this._getEventTarget(this._lastTargetId, 1),
                    meshId: this._lastMeshId,
                    pickingId: this._lastPickingId,
                    point: JSON.parse(this._lastPoint)
                });
            }
        }
        return eventTargets;
    }

    _getEventTarget(targetId, targetType) {
        if (!defined(targetId)) {
            return;
        }
        if (targetType < 1) {
            const index = this._currentTargetIndex || 0;
            return this._markerMap[targetId - index];
        } else {
            const index = this._lastTargetIndex || 0;
            return this._markerMap[targetId - index];
        }
    }

    _updateGeometries(marker) {
        const renderer = this.getRenderer();
        if (renderer) {
            renderer._updateGeometries(marker);
        }
    }

    outlineBatch(filterIndex) {
        const layerStyle = this._layerStyle.style ? this._layerStyle.style : this._layerStyle;
        layerStyle[filterIndex].outline = true;
        this._cookedStyles = compileStyle(layerStyle);
        const geometries = this['_geoList'];
        geometries.forEach(geometry => {
            this._filterOutline(geometry);
        });
    }

    outlineAll() {
        const geometries = this['_geoList'];
        geometries.forEach(geometry => {
            geometry.outline();
        });
    }

    cancelOutline() {
        if (this._layerStyle) {
            //setStyle过
            const layerStyle = this._layerStyle.style ? this._layerStyle.style : this._layerStyle;
            layerStyle.forEach(style => {
                delete style.outline;
            });
        }
        const geometries = this['_geoList'];
        geometries.forEach(geometry => {
            geometry.cancelOutline();
        });
    }
    
    setGltfCoordinateSystem(coordinateSystem) {
        this.options.gltfCoordinateSystem = coordinateSystem;
    }

    getGltfCoordinateSystem() {
        return this.options.gltfCoordinateSystem;
    }
}

AbstractGLTFLayer.mergeOptions(options);