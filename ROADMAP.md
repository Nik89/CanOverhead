Roadmap
===============================================================================

All planned changes to this project will be documented in this file.

The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

*******************************************************************************

[1.2.0]
----------------------------------------

Bitrates and transfer time.

### Added

- Bitrates list available: 1 Mbit/s, 800, 500, 250, 125, 50, 20, 10, 5 kbit/s
  - Bitrate can also be provided by the user instead of using one of the
    default ones from the list above
- Calculation of gross/net (effective) bitrate:
  - exact when exact ID and payload is given
  - range when the ID and payload are not known
- Calculation of gross/net (effective) transfer time:
  - exact when exact ID and payload is given
  - range when the ID and payload are not known
- Info popups explaining what all of these fields are.


[1.3.0]
----------------------------------------

CAN FD frames with only one bitrate.

### Added

- Radio button to select between CAN and CAN FD frames for 11 and 29 bit IDs.
  - RTR frames are not available in FD mode.
- Adapted computation of the CAN frame bits to support extended CAN FD frames.
- Effective bitrate and transfer speed computed with the assumption that
  the payload bitrate is equal to the arbitration bitrate.
- Default bitrates list extended on the upper end, adding: 5 Mbit/s, 2 Mbit/s



[1.4.0]
----------------------------------------

CAN FD with flexible data-rate.

### Added

- Support for CAN FD with payload bitrate different than then arbitration
  bitrate.
