const { exec } = require("child_process");
const { argv } = require('process');
const file = require('fs');
let path = require('path');
file.writeFileSync('./callback1.txt', "false");
file.writeFileSync('./callback2.txt', "false");
file.writeFileSync('./callback3.txt', "false");
file.writeFileSync('./user.txt', "");

var args = argv.slice(2);

for (let i = 0; i < args.length; i++) {
    console.log("Running script for " + args[i]);
    file.writeFileSync('./links_' + i + '.json', "");

    // Get pages
    file.writeFileSync('./user.txt', args[i])
    exec('slimerjs ./modules/getpages.js', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        console.log(stderr);
    });
    file.writeFileSync('./callback1.txt', "false")
    do {} while (file.readFileSync('./callback1.txt', 'utf8') !== "true");
    file.writeFileSync('./user.txt', "")

    // Get posts
    exec('slimerjs ./modules/getposts.js', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        console.log(stderr);
    });
    do {} while (file.readFileSync('./callback2.txt', 'utf8') !== "true");
    file.writeFileSync('./callback2.txt', "false")

    // Get links
    exec('slimerjs ./modules/getdrivelinks.js', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        console.log(stderr);
    });
    do {} while (file.readFileSync('./callback3.txt', 'utf8') !== "true");
    file.writeFileSync('./callback3.txt', "false")
    file.writeFileSync('./links_' + i + '.json', file.readFileSync('./links.json', 'utf8'));
    console.log("Done! File saved as ./links_" + i + ".json");
}
function deleteFiles(name) {
    file.unlinkSync(path.join(__dirname, name));
}
deleteFiles('./callback1.txt');
deleteFiles('./callback2.txt');
deleteFiles('./callback3.txt');
deleteFiles('./user.txt');
deleteFiles('./links.json');
deleteFiles('./pages.json');
deleteFiles('./posts.json');