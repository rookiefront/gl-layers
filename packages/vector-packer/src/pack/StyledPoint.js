import { isNil } from '../style/Util';
import { getMarkerPathBase64, evaluateIconSize, evaluateTextSize } from '../style/Marker';
import { getSDFFont, resolveText } from '../style/Text';
import { WritingMode, shapeText, shapeIcon } from './util/shaping';
import { allowsLetterSpacing } from './util/script_detection';
import { convertRTLText } from './util/convert_rtl_text';
import { isFunctionDefinition, interpolated } from '@maptalks/function-type';

const URL_PATTERN = /\{ *([\w_]+) *\}/g;

export default class StyledPoint {
    constructor(feature, symbolDef, loadedSymbol, fnTypes, options) {
        //anchor(世界坐标), offset(normalized offset), tex, size(世界坐标), opacity, rotation
        //u_size_scale 当前像素坐标相对世界坐标的大小, u_rotation map的旋转角度(?)
        this.feature = feature;
        this.symbolDef = symbolDef;
        this.symbol = loadedSymbol;
        this.options = options;
        this._thisReplacer = this._replacer.bind(this);
        this._fnTypes = fnTypes;
    }


    _replacer(str, key) {
        return this.feature.properties[key] || 'default';
    }

    getShape(iconAtlas, glyphAtlas) {
        if (this._shape) {
            return this._shape;
        }
        const { textHorizontalAlignmentFn, textVerticalAlignmentFn, markerHorizontalAlignmentFn, markerVerticalAlignmentFn, textWrapWidthFn } = this._fnTypes;
        let shape;
        const symbol = this.symbol;
        const iconGlyph = this.getIconAndGlyph();
        const properties = this.feature.properties;
        if (iconGlyph && iconGlyph.glyph) {
            const { font, text } = iconGlyph.glyph;
            if (text === '') {
                return null;
            }
            const glyphSize = 24;
            const size = this.size[0],
                fontScale = size / glyphSize;
            const oneEm = 24;
            const keepUpright = symbol['textKeepUpright'],
                textAlongLine = symbol['textRotationAlignment'] === 'map' && symbol['textPlacement'] === 'line' && !symbol['isIconText'];
            const glyphs = glyphAtlas.glyphMap[font],
                hAlignment = textHorizontalAlignmentFn ? textHorizontalAlignmentFn(null, properties) : symbol['textHorizontalAlignment'],
                vAlignment = textVerticalAlignmentFn ? textVerticalAlignmentFn(null, properties) : symbol['textVerticalAlignment'],
                textAnchor = getAnchor(hAlignment, vAlignment),
                lineHeight = 1.2 * oneEm, //TODO 默认的lineHeight的计算
                isAllowLetterSpacing = allowsLetterSpacing(text),
                textLetterSpacing =  isAllowLetterSpacing ? symbol['textLetterSpacing'] / fontScale || 0 : 0,
                textOffset = [symbol['textDx'] / fontScale || 0, symbol['textDy'] / fontScale || 0],
                wrapWidth = textWrapWidthFn ? textWrapWidthFn(null, properties) : symbol['textWrapWidth'],
                textWrapWidth = (wrapWidth || 10 * oneEm) / fontScale;
            shape = {};
            shape.horizontal = shapeText(
                text,
                glyphs,
                textWrapWidth, //默认为10个字符
                lineHeight,
                textAnchor,
                'center',
                textLetterSpacing,
                textOffset,
                oneEm, //verticalHeight
                WritingMode.horizontal
            );
            if (isAllowLetterSpacing && textAlongLine && keepUpright) {
                shape.vertical = shapeText(text, glyphs, textWrapWidth, lineHeight,
                    textAnchor, 'center', textLetterSpacing, textOffset, oneEm, WritingMode.vertical
                );
            }
        } else if (iconGlyph && iconGlyph.icon) {
            if (!iconAtlas.positions[iconGlyph.icon.url]) {
                //图片没有载入成功
                return null;
            }
            const hAlignment = markerHorizontalAlignmentFn ? markerHorizontalAlignmentFn(null, properties) : symbol['markerHorizontalAlignment'];
            const vAlignment = markerVerticalAlignmentFn ? markerVerticalAlignmentFn(null, properties) : symbol['markerVerticalAlignment'];
            const markerAnchor = getAnchor(hAlignment, vAlignment);
            shape = shapeIcon(iconAtlas.positions[iconGlyph.icon.url], markerAnchor);
            if (!this.size) {
                this.size = shape.image.displaySize;
            }
        }
        this._shape = shape;
        return shape;
    }

    getIconAndGlyph() {
        if (this.iconGlyph) {
            return this.iconGlyph;
        }
        const { markerFileFn, markerTypeFn, markerPathFn, markerWidthFn, markerHeightFn, markerFillFn, markerFillPatternFileFn, markerFillOpacityFn, markerTextFitFn, markerTextFitPaddingFn,
            markerLineColorFn, markerLineWidthFn, markerLineOpacityFn, markerLineDasharrayFn, markerLinePatternFileFn, textNameFn,
            textFaceNameFn, textStyleFn, textWeightFn } = this._fnTypes;
        const { zoom } = this.options;
        const result = {};
        const symbol = this.symbol;
        const properties = this.feature.properties;
        const markerFile = markerFileFn ? markerFileFn(null, properties) : symbol.markerFile;
        const markerType = markerTypeFn ? markerTypeFn(null, properties) : symbol.markerType;
        const hasMarker = markerFile || markerType || symbol.markerPath;
        const hasText = !isNil(this.symbolDef.textName);
        let size;
        if (hasMarker) {
            size = evaluateIconSize(symbol, this.symbolDef, properties, zoom) || [0, 0];
            if (symbol.markerTextFit) {
                let textFit = symbol.markerTextFit;
                if (markerTextFitFn) {
                    textFit = markerTextFitFn(zoom, properties);
                }
                if (textFit && textFit !== 'none') {
                    const textSize = symbol.text.textSize;
                    const textName = symbol.text.textName;
                    const text = resolveText(textName, properties);
                    if (!text) {
                        // blank text
                        size[0] = size[1] = -1;
                    } else {
                        if (isFunctionDefinition(textSize) && !symbol.text['__fn_textSize']) {
                            symbol.text['__fn_textSize'] = interpolated(textSize);
                        }
                        const tsize = evaluateTextSize(symbol.text, properties, zoom);
                        if (textFit === 'width' || textFit === 'both') {
                            size[0] = tsize[0] * text.length;
                        }
                        // TODO 这里不支持多行文字
                        if (textFit === 'height' || textFit === 'both') {
                            size[1] = tsize[1];
                        }
                        if (tsize[0] && tsize[1]) {
                            let padding = symbol.markerTextFitPadding || [0, 0, 0, 0];
                            if (markerTextFitPaddingFn) {
                                padding = markerTextFitPaddingFn(zoom, properties);
                            }
                            size[0] += padding[1] + padding[3];
                            size[1] += padding[0] + padding[2];
                        }
                    }

                }
            }
        }
        if (hasText) {
            size = evaluateTextSize(symbol, this.symbolDef, properties, zoom);
        }
        if (!size) {
            return result;
        }
        size[0] = Math.ceil(size[0]);
        size[1] = Math.ceil(size[1]);
        this.size = size;
        // size为0时，仍然能请求图片，例如只有markerFile的symbol，size < 0时的图片应该忽略，例如文字为空的markerTextFit图标
        if (hasMarker && size[0] >= 0 && size[1] >= 0) {
            let icon;
            if (markerType) {
                const url = {};
                url['markerType'] = markerType;
                if (markerType === 'path') {
                    url['markerPath'] = markerPathFn ? markerPathFn(null, properties) : symbol.markerPath;
                }
                if (markerWidthFn) {
                    const width =  markerWidthFn(null, properties);
                    if (!isNil(width)) {
                        url['markerWidth'] = width;
                    }
                } else if (symbol.markerWidth >= 0) {
                    url['markerWidth'] = symbol.markerWidth;
                }
                if (markerHeightFn) {
                    const height = markerHeightFn(null, properties);
                    if (!isNil(height)) {
                        url['markerHeight'] = height;
                    }
                } else if (symbol.markerHeight >= 0) {
                    url['markerHeight'] = symbol.markerHeight;
                }
                if (markerFillFn) {
                    const fill = markerFillFn(null, properties);
                    if (!isNil(fill)) {
                        url['markerFill'] = fill;
                    }
                } else if (symbol.markerFill) {
                    url['markerFill'] = symbol.markerFill;
                }
                if (markerFillPatternFileFn) {
                    const fillPattern = markerFillPatternFileFn(null, properties);
                    if (!isNil(fillPattern)) {
                        url['markerFillPatternFile'] = fillPattern;
                    }
                } else if (symbol.markerFillPatternFile) {
                    url['markerFillPatternFile'] = symbol.markerFillPatternFile;
                }
                if (markerFillOpacityFn) {
                    const fillOpacity = markerFillOpacityFn(null, properties);
                    if (!isNil(fillOpacity)) {
                        url['markerFillOpacity'] = fillOpacity;
                    }
                } else if (symbol.markerFillOpacity >= 0) {
                    url['markerFillOpacity'] = symbol.markerFillOpacity;
                }
                if (markerLineColorFn) {
                    const lineColor = markerLineColorFn(null, properties);
                    if (!isNil(lineColor)) {
                        url['markerLineColor'] = lineColor;
                    }
                } else if (symbol.markerLineColor) {
                    url['markerLineColor'] = symbol.markerLineColor;
                }
                if (markerLineWidthFn) {
                    const lineWidth = markerLineWidthFn(null, properties);
                    if (!isNil(lineWidth)) {
                        url['markerLineWidth'] = lineWidth;
                    }
                } else if (symbol.markerLineWidth >= 0) {
                    url['markerLineWidth'] = symbol.markerLineWidth;
                }
                if (markerLineOpacityFn) {
                    const lineOpacity = markerLineOpacityFn(null, properties);
                    if (!isNil(lineOpacity)) {
                        url['markerLineOpacity'] = lineOpacity;
                    }
                } else if (symbol.markerLineOpacity >= 0) {
                    url['markerLineOpacity'] = symbol.markerLineOpacity;
                }
                if (markerLineDasharrayFn) {
                    const dasharray = markerLineDasharrayFn(null, properties);
                    if (!isNil(dasharray)) {
                        url['markerLineDasharray'] = dasharray;
                    }
                } else if (symbol.markerLineDasharray) {
                    url['markerLineDasharray'] = symbol.markerLineDasharray;
                }
                if (markerLinePatternFileFn) {
                    const linePattern = markerLinePatternFileFn(null, properties);
                    if (!isNil(linePattern)) {
                        url['markerLinePatternFile'] = linePattern;
                    }
                } else if (symbol.markerLinePatternFile) {
                    url['markerLinePatternFile'] = symbol.markerLinePatternFile;
                }
                icon = 'vector://' + JSON.stringify(url);
            } else {
                icon = markerFile ? markerFile.replace(URL_PATTERN, this._thisReplacer) :
                    symbol.markerPath ? getMarkerPathBase64(symbol, size[0], size[1]) : null;
            }
            result.icon = {
                url: icon,
                size
            };
        }

        if (hasText) {
            const textName = textNameFn ? textNameFn(null, properties) : symbol['textName'];
            if (textName || textName === 0) {
                const textFaceName = textFaceNameFn ? textFaceNameFn(null, properties) : symbol['textFaceName'];
                const textStyle = textStyleFn ? textStyleFn(null, properties) : symbol['textStyle'];
                const textWeight = textWeightFn ? textWeightFn(null, properties) : symbol['textWeight'];
                const font = getSDFFont(textFaceName, textStyle, textWeight);
                let text = resolveText(textName, properties);
                //(改为在前端计算)在TextPainter中能通过feature.properties['$label']直接取得标签内容
                // this.feature.properties['$label'] = text;
                // 识别文字中的RTL，并重新排序
                if (text && text.length) {
                    text = convertRTLText(text);
                    result.glyph = {
                        font, text
                    };
                }
            }
        }
        this.iconGlyph = result;
        return result;


        // markerOpacity
        // markerWidth
        // markerHeight
        // markerDx
        // markerDy
        // markerHorizontalAlignment
        // markerVerticalAlignment
        // markerPlacement
        // markerRotation
        // markerFile
        // markerType
        // markerFill
        // markerFillPatternFile
        // markerFillOpacity
        // markerLineColor
        // markerLineWidth
        // markerLineOpacity
        // markerLineDasharray
        // markerLinePatternFile
        // markerPath
        // markerPathWidth
        // markerPathHeight
    }
}

function getAnchor(h, v) {
    if (!v || v === 'middle') {
        v = 'center';
    }
    if (!h || h === 'middle') {
        h = 'center';
    }
    let vv = v !== 'center' ? v : '';
    vv += h !== 'center' ? (vv.length ? '-' : '') + h : '';
    return vv;
}
