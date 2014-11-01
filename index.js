(function() {
    var RLE = {};
    /**
     * Encodes the given stream of binary data by run length
     * The maximum run length is "limited" to 2^28.
     * This function further packs the data to reduce the memory usage by nominal 1/4 of the simple RLE approach.
     * @param {Array<*>} stream
     * array of binary data. "truthy" values will be treated as 1
     * @returns {Uint32Array}
     * array of 32 bit chunks representing the encoded data
     */
    RLE.encode = function (stream) {
        var out = [0];
        var oidx = 0;
        var mcu = 0;
        var midx = 0;
        var symbol = false;
        for (var i = 0; i <= stream.length; i++) {
            if (i < stream.length && !!stream[i] === symbol) {
                mcu++;
            } else {
                for (var s = 0; s < 4; s++) {
                    var k = (mcu >> (s * 7)) & 0x7f;
                    out[oidx] |= k << (midx * 7 + 4);
                    if (++midx === 4) {
                        oidx++;
                        out[oidx] = 0;
                        midx = 0;
                    }
                    //overflow?
                    if (!(mcu > (1 << 7 * (s + 1)) - 1)) {
                        break;
                    } else {
                        out[oidx] |= 1 << midx;
                    }
                }
                mcu = 1;
                symbol = !symbol;
            }
        }
        return new Uint32Array(out);
    };

    /**
     * Decodes the stream of RLE data to a binary stream
     * @param {Uint32Array} stream
     * encoded stream of RLE encoded data
     * @returns {Array<boolean>}
     * binary representation of the data
     */
    RLE.decode = function (stream) {
        var out = [];
        var mcu = 0;
        var symbol = true;
        var midx = 0;
        var oidx = 0;
        for (var i = 0; i < stream.length; i++) {
            for (var s = 0; s < 4; s++) {
                var overflow = stream[i] & (1 << s);
                if (!overflow) {
                    while (--mcu >= 0) {
                        out[oidx] = symbol;
                        oidx++;
                    }
                    mcu = 0;
                    symbol = !symbol;
                    midx = 0;
                } else {
                    midx++;
                    if (midx === 4) {
                        throw new Error('Corrupted data.');
                    }
                }
                var k = (stream[i] >> (s * 7 + 4)) & 0x7f;
                mcu |= k << (7 * midx);
            }
        }
        while (--mcu >= 0) {
            out[oidx] = symbol;
            oidx++;
        }
        return out;
    };

    /**
     * Encodes the given data by run length using the simple approach.
     * @param {Array<*>}stream
     * array of binary data. "truthy" values will be treated as 1
     * @returns {Array<number>}
     * array of alternating run lengths. Zero first.
     */
    RLE.encodeSimple = function(stream) {
        var out = [0];
        var oidx = 0;
        var symbol = false;
        for(var i = 0; i < stream.length; i++) {
            if(!!stream[i] === symbol) {
                out[oidx]++;
            } else {
                symbol = !symbol;
                oidx++;
                out[oidx] = 1;
            }
        }
        return out;
    };

    /**
     * Decodes the simple RLE stream.
     * @param {Array<number>} stream
     * stream of simple RLE data.
     * @returns {Array<boolean>}
     * binary representation of the data
     */
    RLE.decodeSimple = function(stream) {
        var out = [];
        var symbol = false;
        for(var i = 0; i < stream.length; i++) {
            for(var s = 0; s < stream[i]; s++) {
                out.push(symbol);
            }
            symbol = !symbol;
        }
        return out;
    };

    if('undefined' !== typeof module) {
        module.exports = RLE;
    } else {
        window.RLE = RLE;
    }
}());