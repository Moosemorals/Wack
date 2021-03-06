/*
 * The MIT License
 *
 * Copyright 2016 Osric Wilkinson <osric@fluffypeople.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
"use strict";

var ROTATE_TEXT = " \u27F3";

var g = {
    board: document.getElementById("grid"),
    start: document.getElementById("start"),
    wack: document.getElementById("wack"),
    score: 0,
    time: 0,
    lastTick: 0,
    running: true,
    rotating: false,
    currentEffect: null
};

function score(v) {
    g.score += v;
    if (g.score < 0) {
        g.score = 0;
    }
    showText("score", g.score);
    flash(document.getElementById("score"));
}

var effects = (function () {

    function changeSpeed(time) {
        var style = getStyle(".popup");
        var oldTime = style.getPropertyValue("transition-duration");

        oldTime = parseInt(oldTime, 10);
        console.log("old time: " + oldTime);

        var newTime = oldTime * time;
        console.log("new time: " + newTime);

        style.setProperty("transition-duration", newTime + "ms");
    }

    function startRotate(target) {
        if (!g.rotating) {
            g.rotating = true;
        } else {
            return;
        }
        target.classList.add("rotate");

        target.addEventListener("transitionend", middleRotate, true);
        getStyle(".rotate").setProperty("transform", "rotate(360deg)");
    }

    function middleRotate(e) {
        if (e.target.classList.contains("rotate")) {
            e.target.removeEventListener("transitionend", middleRotate, true);
            e.target.classList.remove("rotate");
            g.rotating = false;
        }
    }

    function addTime(t) {
        g.time -= t;
        updateClock();
        flash(document.getElementById("time"));
    }

    return [
        ["+\u231A", function () {
                score(1);
                addTime(1500);
            }],
        ["+\u231A", function () {
                score(1);
                addTime(1500);
            }],
        //  [ROTATE_TEXT, function () {
        //          startRotate(g.grid);
        //      }],
        ["▶▶", function () {
                score(1);
                changeSpeed(0.5);
            }],
        ["▶▶", function () {
                score(1);
                changeSpeed(0.5);
            }],
        ["◀◀", function () {
                score(1);
                changeSpeed(1.2);
            }],
        ["", function () {
                score(1);
            }],
        ["", function () {
                score(1);
            }],
        ["", function () {
                score(1);
            }],
        ["", function () {
                score(1);
            }],
        ["", function () {
                score(1);
            }],
        ["", function () {
                score(1);
            }]
    ];
})();

function showText(id, text) {
    var s = document.getElementById(id);

    while (s.hasChildNodes()) {
        s.removeChild(s.firstChild);
    }

    s.appendChild(document.createTextNode(text));
}

function getRandomInt() {
    return Math.floor(Math.random() * 4);
}

function moleEnd(e) {
    e.preventDefault();
    e.stopPropagation();
    var mole = e.target;

    mole.removeEventListener("transitionend", moleEnd, true);
    if (mole.parentNode) {
        mole.parentNode.removeChild(mole);
    }
    if (g.running) {
        nextMole();
    }
}

function moleBounce(e) {
    e.preventDefault();
    e.stopPropagation();

    var mole = e.target;
    mole.removeEventListener("transitionend", moleBounce, true);
    mole.addEventListener("transitionend", moleEnd, true);

    mole.classList.remove("popup");
    mole.classList.add("popdown");

    mole.style.transform = "translate3d(" + mole.col + "px, 100px, " + mole.row + "px)";
}

function moleClick(e) {
    var over = e.target;
    var mole = over.parentNode;

    // handle efects
    mole.effects[1]();

    // Stop transition animation
    mole.style.transform = window.getComputedStyle(mole).transform;

    // Tidy event listeners/classes
    over.removeEventListener("click", moleClick);
    if (mole.classList.contains("popup")) {
        mole.removeEventListener("transitionend", moleBounce, true);
        mole.classList.remove("popup");
    } else if (mole.classList.contains("popdown")) {
        mole.removeEventListener("transitionend", moleEnd, true);
        mole.classList.remove("popdown");
    }

    // Start fade transiation
    mole.addEventListener("transitionend", moleEnd, true);
    mole.classList.add("popout");
    mole.style.background = "#fff";
    mole.style.color = "#fff";
}

function moleShow(address) {
    var mole = document.createElement("div");

    do {
        mole.effects = effects[Math.floor(Math.random() * effects.length)];
    } while (mole.effects[0] === ROTATE_TEXT && g.currentEffect === mole.effects[0]);

    g.currentEffect = mole.effects[0];

    mole.classList.add("pop");
    mole.classList.add("popup");
    mole.col = (address.col * 40) + 40;
    mole.row = (address.row * -15);
    mole.style.transform = "translate3d(" + mole.col + "px, 100px, " + mole.row + "px) ";

    var text = document.createElement("span");
    text.appendChild(document.createTextNode(mole.effects[0]));

    mole.appendChild(text);

    setTimeout(function () {
        mole.style.transform = "translate3d(" + mole.col + "px, 50px, " + mole.row + "px) ";
        mole.style.background = "#ffcc66";
    }, 25);

    var over = document.createElement("div");
    over.classList.add("pop-over");
    over.addEventListener("click", moleClick);
    mole.appendChild(over);

    mole.addEventListener("transitionend", moleBounce, true);

    g.block.style.transform = "translate3d(" + (mole.col - 5) + "px, 0px, " + mole.row + "px)";
    g.board.insertBefore(mole, g.block);
}

function nextMole() {
    moleShow({row: getRandomInt(), col: getRandomInt()});
}

function updateClock() {
    var remaining = 30 - (Math.floor(g.time / 1000));

    if (remaining < 0) {
        remaining = 0;
    }

    showText("time", remaining);
    showText("times", (remaining !== 1 ? 's' : ''));
}

function tick() {
    var sleep;
    var now = Date.now();
    var diff = (now - g.lastTick);
    g.lastTick = now;

    g.time += diff;

    updateClock();
    sleep = 1000 - (g.time % 1000);

    if (g.time < 30000) {
        setTimeout(tick, sleep);
    } else {
        endGame();
    }
}

function getStyle(selector) {
    var i;
    var sheet = document.getElementById("styles").sheet;
    for (i = 0; i < sheet.cssRules.length; i += 1) {
        if (sheet.cssRules[i].type === 1 && sheet.cssRules[i].selectorText === selector) { // STYLE_RULE
            return sheet.cssRules[i].style;
        }
    }
    return null;
}

function flash(target) {
    target.classList.add("flasher");
    target.addEventListener("animationend", function () {
        target.classList.remove("flasher");
    });
}

function checkMiss(e) {
    if (e.target.id === "wack") {
        score(-1);
    }
}

function buildBoard() {
    g.ground = document.createElement("div");
    g.ground.id = "ground";
    g.board.appendChild(g.ground);

    g.block = document.createElement("div");
    g.block.classList.add("block");
    g.board.insertBefore(g.block, g.ground);
}

function startGame() {
    g.start.removeEventListener("click", startGame);
    g.start.disabled = true;
    g.lastTick = Date.now();
    g.score = 0;
    g.time = 0;

    buildBoard();
    nextMole();
    tick();
    g.wack.addEventListener("click", checkMiss);
}

function endGame() {
    g.running = false;
    g.wack.removeEventListener("click", checkMiss);
    g.start.addEventListener("click", startGame);

    while (g.board.hasChildren) {
        g.board.removeChild(g.board.firstChild);
    }
    g.start.disabled = false;
}


g.start.addEventListener("click", startGame);