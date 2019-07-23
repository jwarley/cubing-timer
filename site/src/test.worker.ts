/////////////////////////////////////////////////////
//                      WARNING                    //
//                YOU ARE NOW ENTERING             //
//                   THE JANK ZONE                 //
/////////////////////////////////////////////////////
// This file has gone [0] days without an accident //
/////////////////////////////////////////////////////

// create a fake window and document and some fake methods and properties on them
// tnoodle will silently consume these when it's imported and attach objects to them
// this way, tnoodle won't notice it's being called from a worker
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

importScripts("tnoodle.js");

// Now here are the same setup functions you'd use to call tnoodle normally
window.TNOODLE_ENV = { TNOODLE_333_MIN_DISTANCE: "1" };

// tnoodle somehow calls this
function puzzlesLoaded(puzzles) {
    window.puzzles = puzzles;
}


// reply with a new scramble or scramble image whenever a message is passed
onmessage = function(e) {
    // e.data[0] is the type of request we received (scramble, image, etc.)

    if (e.data[0] === "scramble") {
        // return a new scramble for the puzzle type indicated by e.data[1]
        // e.data[2] is a bool indicating whether to cache this scramble
        const shortName = e.data[1];
        const shouldCache = e.data[2];
        const scram = window.puzzles[shortName].generateScramble();
        postMessage(["scramble", scram, shouldCache]);
    } else if (e.data[0] === "image") {
        // generate an svg image of the scramble passsed in e.data[1] 
        // e.data[2] is the puzzle shortname
        const scram = e.data[1];
        const puzzle = e.data[2];
        const svg_img = tnoodlejs.scrambleToSvg(scram, puzzle, 0, 0);
        postMessage(["image", svg_img]);
    }
};
// onmessage = function(e) {
//     const shortName = e.data[0];
//     const shouldCache = e.data[1];
//     const scram = window.puzzles[shortName].generateScramble();
//     const svg_img = tnoodlejs.scrambleToSvg(scram, window.puzzles[shortName], 0, 0);
//     // console.log(svg_img);
//     postMessage([scram, shouldCache, svg_img]);
// };
