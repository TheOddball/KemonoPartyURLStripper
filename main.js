const { exec } = require("child_process");
const { argv } = require('process');
const file = require('fs');
const path = require('path');
const callbackfiles = ["./callback1.txt", "./callback2.txt", "./callback3.txt", "./user.txt", "./links.json", "./pages.json", "./posts.json"];
const args = argv.slice(2);

//Write temp files
callbackfiles.forEach(
    function (name) {
        file.writeFileSync(name, "false")
    }
);

for (let i = 0; i < args.length; i++) {
    console.log("Running script for " + args[i]);
    file.writeFileSync('./links_' + i + '.json', "");

    // Get pages
    file.writeFileSync('./user.txt', args[i])
    exec('slimerjs ./modules/getpages.js', (err) => {
        if (err) {
            return;
        }
    });
    file.writeFileSync('./callback1.txt', "false")
    do { } while (file.readFileSync('./callback1.txt', 'utf8') !== "true");
    file.writeFileSync('./user.txt', "")

    // Get posts
    exec('slimerjs ./modules/getposts.js', (err) => {
        if (err) {
            return;
        }
    });
    do { } while (file.readFileSync('./callback2.txt', 'utf8') !== "true");
    file.writeFileSync('./callback2.txt', "false")

    // Get links
    exec('slimerjs ./modules/getdrivelinks.js', (err) => {
        if (err) {
            return;
        }
    });
    do { } while (file.readFileSync('./callback3.txt', 'utf8') !== "true");
    file.writeFileSync('./callback3.txt', "false")
    if (file.readFileSync('./links.json', 'utf8') !== `[""]`) {
        file.writeFileSync('./links_' + i + '.json', file.readFileSync('./links.json', 'utf8'));
        console.log("Done! File saved as ./links_" + i + ".json for " + args[i] + "!");
    } else {
        console.log("No links found for " + args[i] + "!");
    }
}

//Delete temp files
function deleteFiles(name) {
    file.unlinkSync(path.join(__dirname, name));
}
callbackfiles.forEach(
    function (name) {
        deleteFiles(name);
    }
);