# pystruct

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

<table>
  <thead>
    <tr>
      <th>
        Character
      </th>
      <th>
        Byte order
      </th>
      <th>
        Size
      </th>
      <th>
        Alignment
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        @
      </td>
      <td>
        native (not supported, will throw *)
      </td>
      <td>
        native
      </td>
      <td>
        native
      </td>
    </tr>
    <tr>
      <td>
        =
      </td>
      <td>
        native
      </td>
      <td>
        standard
      </td>
      <td>
        none
      </td>
    </tr>
    <tr>
      <td>
        &lt;
      </td>
      <td>
        little-endian
      </td>
      <td>
        standard
      </td>
      <td>
        none
      </td>
    </tr>
    <tr>
      <td>
        &gt;
      </td>
      <td>
        big-endian
      </td>
      <td>
        standard
      </td>
      <td>
        none
      </td>
    </tr>
    <tr>
      <td>
        !
      </td>
      <td>
        network (= big-endian)
      </td>
      <td>
        standard
      </td>
      <td>
        none
      </td>
    </tr>
  </tbody>
</table>

> \* Will throw `Using native size and alignment (first character is \'@\' or ommited) is not supported!`

<table>
  <thead>
    <tr>
      <th>
        Format
      </th>
      <th>
        C Type
      </th>
      <th>
        Python type
      </th>
      <th>
        Standard size
      </th>
      <th>
        Notes
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        x
      </td>
      <td>
        pad byte
      </td>
      <td>
        no value
      </td>
      <td></td>
      <td>
        (7)
      </td>
    </tr>
    <tr>
      <td>
        c
      </td>
      <td>
        char
      </td>
      <td>
        bytes of length 1
      </td>
      <td>
        1
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        b
      </td>
      <td>
        signed <span>char
      </td>
      <td>
        integer
      </td>
      <td>
        1
      </td>
      <td>
        (1), (2)
      </td>
    </tr>
    <tr>
      <td>
        B
      </td>
      <td>
        unsigned <span>char
      </td>
      <td>
        integer
      </td>
      <td>
        1
      </td>
      <td>
        (2)
      </td>
    </tr>
    <tr>
      <td>
        ?
      </td>
      <td>
        _Bool
      </td>
      <td>
        bool
      </td>
      <td>
        1
      </td>
      <td>
        (1)
      </td>
    </tr>
    <tr>
      <td>
        h
      </td>
      <td>
        short
      </td>
      <td>
        integer
      </td>
      <td>
        2
      </td>
      <td>
        (2)
      </td>
    </tr>
    <tr>
      <td>
        H
      </td>
      <td>
        unsigned <span>short
      </td>
      <td>
        integer
      </td>
      <td>
        2
      </td>
      <td>
        (2)
      </td>
    </tr>
    <tr>
      <td>
        i
      </td>
      <td>
        int
      </td>
      <td>
        integer
      </td>
      <td>
        4
      </td>
      <td>
        (2)
      </td>
    </tr>
    <tr>
      <td>
        I
      </td>
      <td>
        unsigned <span>int
      </td>
      <td>
        integer
      </td>
      <td>
        4
      </td>
      <td>
        (2)
      </td>
    </tr>
    <tr>
      <td>
        l
      </td>
      <td>
        long
      </td>
      <td>
        integer
      </td>
      <td>
        4
      </td>
      <td>
        (2)
      </td>
    </tr>
    <tr>
      <td>
        L
      </td>
      <td>
        unsigned <span>long
      </td>
      <td>
        integer
      </td>
      <td>
        4
      </td>
      <td>
        (2)
      </td>
    </tr>
    <tr>
      <td>
        q
      </td>
      <td>
        long <span>long
      </td>
      <td>
        integer
      </td>
      <td>
        8
      </td>
      <td>
        (2)
      </td>
    </tr>
    <tr>
      <td>
        Q
      </td>
      <td>
        unsigned <span>long long
      </td>
      <td>
        integer
      </td>
      <td>
        8
      </td>
      <td>
        (2)
      </td>
    </tr>
    <tr>
      <td>
        n
      </td>
      <td>
        ssize_t
      </td>
      <td>
        integer
      </td>
      <td>
      </td>
      <td>
        (3), (10)
      </td>
    </tr>
    <tr>
      <td>
        N
      </td>
      <td>
        size_t
      </td>
      <td>
        integer
      </td>
      <td></td>
      <td>
        (3), (10)
      </td>
    </tr>
    <tr>
      <td>
        e
      </td>
      <td>
        (6)
      </td>
      <td>
        float
      </td>
      <td>
        2
      </td>
      <td>
        (4)
      </td>
    </tr>
    <tr>
      <td>
        f
      </td>
      <td>
        float
      </td>
      <td>
        float
      </td>
      <td>
        4
      </td>
      <td>
        (4)
      </td>
    </tr>
    <tr>
      <td>
        d
      </td>
      <td>
        double
      </td>
      <td>
        float
      </td>
      <td>
        8
      </td>
      <td>
        (4)
      </td>
    </tr>
    <tr>
      <td>
        s
      </td>
      <td>
        char[<span>]
      </td>
      <td>
        bytes
      </td>
      <td></td>
      <td>
        (9)
      </td>
    </tr>
    <tr>
      <td>
        p
      </td>
      <td>
        char[<span>]
      </td>
      <td>
        bytes
      </td>
      <td></td>
      <td>
        (8)
      </td>
    </tr>
    <tr>
      <td>
        P
      </td>
      <td>
        void*
      </td>
      <td>
        integer
      </td>
      <td></td>
      <td>
        (5), (10)
      </td>
    </tr>
  </tbody>
</table>

> (10). My implememntation uses simple `Uint32` for these types for now as a placeholder

Notes:

1. The '?' conversion code corresponds to the _Bool type defined by C99. If this type is not available, it is simulated using a char. In standard mode, it is always represented by one byte.

2. When attempting to pack a non-integer using any of the integer conversion codes, if the non-integer has a __index__() method then that method is called to convert the argument to an integer before packing.  
Changed in version 3.2: Added use of the __index__() method for non-integers.

3. The 'n' and 'N' conversion codes are only available for the native size (selected as the default or with the '@' byte order character). For the standard size, you can use whichever of the other integer formats fits your application.

4. For the 'f', 'd' and 'e' conversion codes, the packed representation uses the IEEE 754 binary32, binary64 or binary16 format (for 'f', 'd' or 'e' respectively), regardless of the floating-point format used by the platform.

5. The 'P' format character is only available for the native byte ordering (selected as the default or with the '@' byte order character). The byte order character '=' chooses to use little- or big-endian ordering based on the host system. The struct module does not interpret this as native ordering, so the 'P' format is not available.

6. The IEEE 754 binary16 “half precision” type was introduced in the 2008 revision of the IEEE 754 standard. It has a sign bit, a 5-bit exponent and 11-bit precision (with 10 bits explicitly stored), and can represent numbers between approximately 6.1e-05 and 6.5e+04 at full precision. This type is not widely supported by C compilers: on a typical machine, an unsigned short can be used for storage, but not for math operations. See the Wikipedia page on the half-precision floating-point format for more information.

7. When packing, 'x' inserts one NUL byte.

9. The 'p' format character encodes a “Pascal string”, meaning a short variable-length string stored in a fixed number of bytes, given by the count. The first byte stored is the length of the string, or 255, whichever is smaller. The bytes of the string follow. If the string passed in to pack() is too long (longer than the count minus 1), only the leading count-1 bytes of the string are stored. If the string is shorter than count-1, it is padded with null bytes so that exactly count bytes in all are used. Note that for unpack(), the 'p' format character consumes count bytes, but that the string returned can never contain more than 255 bytes.

9. For the 's' format character, the count is interpreted as the length of the bytes, not a repeat count like for the other format characters; for example, '10s' means a single 10-byte string mapping to or from a single Python byte string, while '10c' means 10 separate one byte character elements (e.g., cccccccccc) mapping to or from ten different Python byte objects. (See Examples for a concrete demonstration of the difference.) If a count is not given, it defaults to 1. For packing, the string is truncated or padded with null bytes as appropriate to make it fit. For unpacking, the resulting bytes object always has exactly the specified number of bytes. As a special case, '0s' means a single, empty string (while '0c' means 0 characters).