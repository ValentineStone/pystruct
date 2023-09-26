# pystruct
# `pystruct` — Interpret bytes as packed binary data

Does basycally the same as Python's struct module:  
https://docs.python.org/3/library/struct.html

Can fully run in browser by using cool modern tech such as `ArrayBuffer`, `TypedArray`, `DataView`, `BigInt`, `TextEncoder` and `TextDecoder`.

Also uses [`@petamoriken/float16`](https://www.npmjs.com/package/@petamoriken/float16) for `Float16` (IEEE 754 half-precision floating-point).

Supports using system endianness.

## Existing alternatives:

> None of the alternative implementations here support `Float16` as of today.

**`jspack`**  
https://www.npmjs.com/package/jspack

This one uses simple Arrays, accoring to some preminary testing mine's faster.  
Also this does not support `p` type which was critical for me.

**`python-struct`**  
https://www.npmjs.com/package/python-struct

This runs on Node's Buffers, so browser requires a polifill.

**`@aksel/structjs`**  
https://www.npmjs.com/package/@aksel/structjs

This one works on `ArrayBuffer` like mine, and the code is feakishly small, very cool yet hard to read for my attention deficit brain.  
Does not support `int64_t` and `uint64_t`, mines does via `BigInt`

## Docs for ease of reference ([copied from python](https://docs.python.org/3/library/struct.html#byte-order-size-and-alignment))

|Character|Byte order|Size|Alignment|
|-|-|-|-|
|@|native (not supported, will throw *)|native|native|
|=|native|standard|none|
|<|little-endian|standard|none|
|>|big-endian|standard|none|
|!|network (= big-endian)|standard|none|

> \* Will throw `Using native size and alignment (first character is \'@\' or ommited) is not supported!`

|Format|C Type|Python type|Standard size|Notes|
|-|-|-|-|-|
|x|pad byte|no value||(7)|
|c|char|bytes of length 1|1||
|b|signed char|integer|1|(1), (2)|
|B|unsigned char|integer|1|(2)|
|?|_Bool|bool|1|(1)|
|h|short|integer|2|(2)|
|H|unsigned short|integer|2|(2)|
|i|int|integer|4|(2)|
|I|unsigned int|integer|4|(2)|
|l|long|integer|4|(2)|
|L|unsigned long|integer|4|(2)|
|q|long long|integer|8|(2)|
|Q|unsigned long long|integer|8|(2)|
|n|ssize_t|integer||(3), (10)|
|N|size_t|integer||(3), (10)|
|e|(6)|float|2|(4)|
|f|float|float|4|(4)|
|d|double|float|8|(4)|
|s|char[]|bytes||(9)|
|p|char[]|bytes||(8)|
|P|void*|integer||(5), (10)|

> (10). My implememntation uses simple `Uint32` for these types for now as a placeholder

Notes:

1. The '?' conversion code corresponds to the _Bool type defined by C99. If this type is not available, it is simulated using a char. In standard mode, it is always represented by one byte.

2. When attempting to pack a non-integer using any of the integer conversion codes, if the non-integer has a `__index__()` method then that method is called to convert the argument to an integer before packing.  
Changed in version 3.2: Added use of the `__index__()` method for non-integers.

3. The 'n' and 'N' conversion codes are only available for the native size (selected as the default or with the '@' byte order character). For the standard size, you can use whichever of the other integer formats fits your application.

4. For the 'f', 'd' and 'e' conversion codes, the packed representation uses the IEEE 754 binary32, binary64 or binary16 format (for 'f', 'd' or 'e' respectively), regardless of the floating-point format used by the platform.

5. The 'P' format character is only available for the native byte ordering (selected as the default or with the '@' byte order character). The byte order character '=' chooses to use little- or big-endian ordering based on the host system. The struct module does not interpret this as native ordering, so the 'P' format is not available.

6. The IEEE 754 binary16 “half precision” type was introduced in the 2008 revision of the IEEE 754 standard. It has a sign bit, a 5-bit exponent and 11-bit precision (with 10 bits explicitly stored), and can represent numbers between approximately 6.1e-05 and 6.5e+04 at full precision. This type is not widely supported by C compilers: on a typical machine, an unsigned short can be used for storage, but not for math operations. See the Wikipedia page on the half-precision floating-point format for more information.

7. When packing, 'x' inserts one NUL byte.

9. The 'p' format character encodes a “Pascal string”, meaning a short variable-length string stored in a fixed number of bytes, given by the count. The first byte stored is the length of the string, or 255, whichever is smaller. The bytes of the string follow. If the string passed in to pack() is too long (longer than the count minus 1), only the leading count-1 bytes of the string are stored. If the string is shorter than count-1, it is padded with null bytes so that exactly count bytes in all are used. Note that for unpack(), the 'p' format character consumes count bytes, but that the string returned can never contain more than 255 bytes.

9. For the 's' format character, the count is interpreted as the length of the bytes, not a repeat count like for the other format characters; for example, '10s' means a single 10-byte string mapping to or from a single Python byte string, while '10c' means 10 separate one byte character elements (e.g., cccccccccc) mapping to or from ten different Python byte objects. (See Examples for a concrete demonstration of the difference.) If a count is not given, it defaults to 1. For packing, the string is truncated or padded with null bytes as appropriate to make it fit. For unpacking, the resulting bytes object always has exactly the specified number of bytes. As a special case, '0s' means a single, empty string (while '0c' means 0 characters).