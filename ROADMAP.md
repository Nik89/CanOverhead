Roadmap
===============================================================================

All planned changes to this project will be documented in this file.

The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

*******************************************************************************

[0.1.0]
----------------------------------------

Classic CAN 11-bit ID supported, listing all fields, whole frame as bits pre
and post-stuffing, max worst-case theoretical frame length.

### Added

- Classic CAN with 11-bit IDs with the CAN ID and payload content known:
  - CAN ID input accepted in binary, hex and decimal format, e.g. `0b0010010`,
    `0xAA`, `42`.
  - Payload content input accepted in hex format, e.g. `AA, 0x0C...`.
  - Compute and display the whole frame as bits (header, payload, trailer)
    with format `0110 1011 1001 1000 ...` without stuff bits.
    The computation of the [CRC](https://www.can-cia.org/can-knowledge/can/crc/)
    is included in the computation of the trailer.
  - Same as previous point but with stuff bits included.
  - Compute and display the exact amount of added stuff bits.
  - Compute the size in bits of the whole frame (header, payload, trailer)
    without stuff bits.
  - Compute the size range in bits of the whole frame when taking also
    stuff bits into account (min = no stuff bits applied, max = max stuff
    bits applied for CAN ID and payload).


[0.3.0]
----------------------------------------

More input formats accepted.

### Added

- Display of the whole frame also in hexadecimal format, padded with zero-bits
  to the right to the nearest multiple of 8. Display also the amount of
  padding bits added (radio button or similar to select input type).
- CAN ID input accepted also in decimal and hexadecimal format,
  e.g. `42` or `11A` (radio button or similar to select input type)
- Payload content input accepted (radio button or similar to select input type)
  also as comma-separated list of bits,
  e.g. `1,0,1,1`, or hexadecimal, e.g. `0b12`. Case insensitive, zero-padding
  to the left required so `b12` is invalid.
- Make stuff bits bold in the provided output


[0.4.0]
----------------------------------------

Bitrates and transfer time.

### Added

- Bitrates list available: 1 Mbit/s, 800, 500, 250, 125, 50, 20, 10 kbit/s
- Calculation of gross/net (effective) bitrate:
  - exact when exact ID and payload is given
  - range when the ID and payload are not known
- Calculation of gross/net (effective) transfer time:
  - exact when exact ID and payload is given
  - range when the ID and payload are not known



[0.5.0]
----------------------------------------

29-bit CAN IDs.

### Added

- Support for 29-bit CAN IDs (radio button or similar to select between 11
  and 29 bits). Same features as above.



[0.6.0]
----------------------------------------

CAN FD with fixed datarate.

### Added

- Support for CAN FD with payload datarate equal to the arbitration
  datarate.



[1.0.0]
----------------------------------------

CAN FD with flexible datarate.

### Added

- Support for CAN FD with payload datarate different than then
  arbitration datarate.
