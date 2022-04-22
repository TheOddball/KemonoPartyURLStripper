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
    do {
    } while (file.readFileSync('./callback1.txt', 'utf8') !== "true");
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
    do {
    } while (file.readFileSync('./callback2.txt', 'utf8') !== "true");
    
    // Get links
    exec('slimerjs ./modules/getdrivelinks.js', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        console.log(stderr);
    });
    do {
    } while (file.readFileSync('./callback3.txt', 'utf8') !== "true");
    file.writeFileSync('./links_' + i + '.json', file.readFileSync('./links.json', 'utf8'));
}

file.unlinkSync(path.join(__dirname, '/callback1.txt'));
file.unlinkSync(path.join(__dirname, './callback2.txt'));
file.unlinkSync(path.join(__dirname, './callback3.txt'));
file.unlinkSync(path.join(__dirname, './user.txt'));
file.unlinkSync(path.join(__dirname, './pages.json'));
file.unlinkSync(path.join(__dirname, './posts.json'));
file.unlinkSync(path.join(__dirname, './links.json'));
