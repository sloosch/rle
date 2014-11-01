##RLE - Run Length Encoding
_the simplest approach for lossless compression_

###Install

`npm install rle`


###API

`Uint32Array RLE.encode(Array<*> stream)`  
Encodes the given stream of binary data by run length. Each "truthy" element in the stream is treated as 1.  
The maximum run length is "limited" to 2^28.  
This function further packs the data to reduce the memory usage by nominal 1/4 of the simple RLE approach.  


`Array<boolean> RLE.decode(Uint32Array stream)`  
Decodes the stream of RLE data to a binary stream.


`Array<number> RLE.encodeSimple(Array<*> stream)`  
Encodes the given data by run length using the simple approach. Each "truthy" element in the stream is treated as 1. 
The return value represents a stream of alternating run lengths starting with the length of 0.


`Array<boolean> RLE.decodeSimple(Array<number> stream)`  
Decodes the stream of **simple** RLE data to a binary stream.


###Example
```javascript
var rle = require('rle');
var blackAndWhite = getBlackAndWhiteData();
var encoded = rle.encode(blackAndWhite.asArray());

//....

var decoded = rle.decode(encoded);
```

####Base64
```javascript
var rleEncoded = rle.encode(data);
base64Encoded = new Buffer(new Uint8Array(rleEncoded.buffer)).toString('base64');

//....

var base64Decoded = new Uint32Array(new Uint8Array(new Buffer(base64Encoded, 'base64')).buffer);
 var rleDecoded = rle.decode(base64Decoded);
```
