// Okay, buckle up kiddos.
// Do not lay eyes on this file unless absolutely necessary
// because it is probably so janky it's literally poisonous.

// create a fake window and document and some fake methods and properties on them
// tnoodle will silently consume these when it's imported and attach objects to them
// this way, tnoodle won't notice it's being called from a worker
// Point of interest: these lines are also present WITHIN the handwritten portion of
// tnoodle.js itself, which I do not pretend to understand even a little bit
const window = self;
const document = {};
document["write"] = function() {};
window.write = document["write"];
document.getElementById = function() {};
document.getElementsByTagName = function() {
    return [];
};
document.readyState = "loaded";
if (window.location) {
    // Firefox actually does set self.location for webworkers
    document.location = window.location;
} else {
    window.location = { href: "", search: "" };
    document.location = window.location;
}

importScripts("../tnoodle.js");

// Note that we have utterly given up on making typescript feel comfortable here
// With great luck that will change in a future version

// Now here are the same setup functions you'd use to call tnoodle normally
window.TNOODLE_ENV = { TNOODLE_333_MIN_DISTANCE: "1" };

// tnoodle somehow calls this
function puzzlesLoaded(puzzles) {
    window.puzzles = puzzles;
}

// log a new scramble to the console whenever a message is passed
onmessage = function(e) {
    console.log(window.puzzles["333"].generateScramble());
};
