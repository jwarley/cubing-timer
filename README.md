## Description

This is a work-in-progress speedcubing timer with two main goals:

* Replicate a competition solving environment as closely as possible.
* Generate useful comparisons of at-home times to official WCA results.

Most people solve slower in competition than they do at home, partly because their practice routines don't encourage the same mindset as the WCA average format, and partly because they measure their speed differently at home.
Timers may help narrow this gap by better evoking the competition workflow/mindset.

### What works:
* Timer
* Penalties
* Scrambles
* Event switching
* Saving times
* PB Stats
* WCA interface (sort of)

### What doesn't:
* Scramble images
* Mobile
* Automatic sessions (?)
* Looking nice

**Acknowledgements:** AJ Blair (design), Zack Eberhart (code), Michael Gottlieb/Lucas Garron/Shuang Cheng (scramble generators)

## How to Build

Make sure yarn and react-scripts are installed.

To run locally:
```
cd site
yarn start
```

To build for production:
```
cd site
yarn build
```
