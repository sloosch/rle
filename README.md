##RLE - Run Length Encoding
_the simplest approach for lossless compression_

###Install

`npm install rle`


###API

`Array<number> RLE.encode(Array<*> stream)`  
Encodes the given stream of binary data by run length. Each "truthy" element in the stream is treated as 1.  
The maximum run length is "limited" to 2^28.  
This function further packs the data to reduce the memory usage by nominal 1/4 of the simple RLE approach.  


`Array<boolean> RLE.decode(Array<number> stream)`  
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
