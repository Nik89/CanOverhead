Roadmap
===============================================================================

All planned changes to this project will be documented in this file.

The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

*******************************************************************************

[1.1.0]
----------------------------------------

Support for RTR frames (1 bit differs in header, no payload), minor UX
improvements

### Added

- RTR frame support
  - Radio button input to select data frame vs RTR frame. The payload text
    input gets disabled for RTR and is not used.
- UX improvements
  - Default values for input forms with some example data to let the user
    quickly run the calculator.
  - CAN ID input in the form is autoselected at page load.
  - Radio button for base of ID to avoid the user typing `0b` or `0x`.
    Default to hex, preselected.
  - Display stuff bits in bold



[1.2.0]
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



[1.3.0]
----------------------------------------

Extended CAN frames with 29-bit IDs.

### Added

- Radio button to select between 11 and 29 bit IDs, for data and RTR frames.
- Adapted computation of the CAN frame bits to support extended CAN frames.
- Bitrate can be provided by the user instead of using one of the default ones.



[1.4.0]
----------------------------------------

CAN FD frames with only one bitrate.

### Added

- Radio button to select between CAN and CAN FD frames for 11 and 29 bit IDs.
  - RTR frames are not available in FD mode.
- Adapted computation of the CAN frame bits to support extended CAN FD frames.
- Effective bitrate and transfer speed computed with the assumption that
  the payload bitrate is equal to the arbitration bitrate.
- Default bitrates list extended on the upper end, adding: 5 Mbit/s, 2 Mbit/s



[1.5.0]
----------------------------------------

CAN FD with flexible datarate.

### Added

- Support for CAN FD with payload birate different than then arbitration
  datarate.



Other ideas
----------------------------------------

- Display of the whole frame also in hexadecimal format, padded with zero-bits
  to the right to the nearest multiple of 8. Display also the amount of
  padding bits added radio button or similar to select input type).
- CAN ID input accepted also in decimal and hexadecimal format,
  e.g. `42` or `11A` (radio button or similar to select input type)
- Payload content input accepted (radio button or similar to select input type)
  also as comma-separated list of bits,
  e.g. `1,0,1,1`, or hexadecimal, e.g. `0b12`. Case insensitive, zero-padding
  to the left required so `b12` is invalid.
- Gzip: test it with small difference between uncompressed and compressed
  files to see which one is provided by the Github web server
- merge all JS and CSS files into the HTML file to have just 1 file in the
  end as a deployment super-compressed deliverable. <script>JS HERE</script>
  and <style>CSS HERE</style>. Comment markers can be added around these lines
  to make it easier for the Py parser to know where to remove lines and where to
  inject new ones. Makes it also really easy to provide the
  calculator to someone as a single deployment file.
