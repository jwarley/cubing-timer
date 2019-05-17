## Description

This is a work-in-progress speedcubing timer with two main goals:

* Replicate a competition solving environment as closely as possible.
* Generate useful comparisons of at-home times to official WCA results.

Most people solve slower in competition than they do at home, partly because their practice routines don't encourage the same mindset as the WCA average format, and partly because they measure their speed differently at home.
I claim that correct timer design can mostly fix these problems.

Note: progress on this is very intermittent because I'm chronically in school, but it is definitely going to be finished and it is definitely going to be better than the other things when that happens.

### What works:
* Timer
* Penalties
* Scrambles (mostly)
* Event switching
* Saving times (within a session)

### What doesn't:
* Stats
* Saving times (across sessions)
* WCA interface
* Scramble images
* Mobile

**Acknowledgements:** AJ Blair (design), Zack Eberhart (code)

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

No need to do anything with the Rust server code because it currently does nothing.
