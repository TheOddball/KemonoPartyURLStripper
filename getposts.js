var file = require("fs");
var pages = JSON.parse(file.read("./pages.json"));
var queue = [];

pages.forEach(function (url) {
    var p = new Promise(function (resolve) {
        var page = require('webpage').create();

        page.open(url)
            .then(function (status) {
                if (status == "success") {
                    var values = [];

                    page.onCallback = function (arg) {
                        values = arg.toString();
                    };

                    page.evaluate(function () {
                        var x = document.querySelectorAll("a");

                        var pageArray = []

                        for (var i = 0; i < x.length; i++) {
                            var testLink = x[i].href;
                            if (/https:\/\/kemono\.party\/.*\/user\/.*\/post.*/g.test(testLink)) {
                                pageArray.push([testLink]);
                            }
                        };

                        window.callPhantom(pageArray);
                    });
                    resolve(values);
                } else {
                    console.log("Sorry, the page is not loaded for " + url);
                    resolve();
                }
            });
    });
    queue.push(p);
});

Promise.all(queue).then(function (posts) {
    var tmp = posts.map(a => a.toString()).toString().split(",");
    var result = [...new Set(tmp)];
    file.write("./posts.json", JSON.stringify(result));
    slimer.exit();
});