var file = require("fs");

var posts = JSON.parse(file.read("./posts.json"));
var queue = [];

posts.forEach(function (url) {
    var p = new Promise(function (resolve) {
        var page = require('webpage').create();

        page.open(url)
            .then(function (status) {
                if (status == "success") {
                    var values = [];

                    page.onCallback = function (arg) {
                        values = arg;
                    };

                    page.evaluate(function () {
                        var x = document.querySelectorAll("p");

                        var pagearray = []

                        for (var i = 0; i < x.length; i++) {
                            var cleanlink = x[i].innerText;
                            if (/https:\/\/drive\.google\.com.*/g.test(cleanlink)) {
                                pagearray.push([cleanlink]);
                            }
                        };
                        window.callPhantom(pagearray);
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

Promise.all(queue).then(function (values) {
    var filtered = values.filter(function (el) {
        return el != "";
    });
    var tmp = filtered.map(a => a.toString()).toString().split(",");
    file.write("./links.json", JSON.stringify(tmp));
    file.write("./callback3.txt", "true");
    slimer.exit();
});