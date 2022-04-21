var file = require("fs");

var userInput = [file.read("./user.txt").split(",")];
var queue = [];

userInput.forEach(function (url) {
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
                        var postsString = document.querySelector("#paginator-top > small").innerText.substring(18);
                        var postsInt = parseInt(postsString);

                        if (postsInt > 25) {
                            var floatPages = postsInt / 25;
                            var finalPages = Math.ceil(floatPages);
                        } else {
                            var finalPages = 1;
                        }

                        console.log(finalPages);
                        window.callPhantom(finalPages);
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

Promise.all(queue).then(function (pages) {
    var pageArrayTmp = Array.apply(null, { length: pages }).map(Number.call, Number)
    var pageArrayPagenated = pageArrayTmp.slice(1, pageArrayTmp.length);
    var pageArray = [];

    pageArrayPagenated.forEach(function (page) {
        if (page == 1) {
            pageArray.push(userInput + "?o=" + 0)
        } else {
            var postIdTmp = page * 25;
            var postId = postIdTmp - 25;
            pageArray.push(userInput + "?o=" + postId);
        }
    });

    file.write("./pages.json", JSON.stringify(pageArray));
    slimer.exit();
});

