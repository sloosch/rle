var rle = require('./index');
var assert = require('assert');

for(var k = 0; k < 10; k++) {
    var stream = [];
    for (var i = 0; i < 1000 * k; i++) {
        stream[i] = (Math.random() > 0.5) | 0;
    }
    var encoded = rle.encode(stream);
    var encodedS = rle.encodeSimple(stream);

    var decoded = rle.decode(encoded);
    for(var s = 0; s < stream.length; s++) {
        assert.equal(stream[s], decoded[s]);
    }

    console.log('length: ' + stream.length, 'packed :' + encoded.length, 'simple:' + encodedS.length);
}

