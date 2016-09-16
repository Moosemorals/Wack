/*
 * The MIT License
 *
 * Copyright 2016 osric.
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


var g = {
    score : 0,
    time : 0,
    lastTick : 0,
    running : true
};

function showText(id, text) {
    var s = document.getElementById(id);
    
    while (s.hasChildNodes()) {
        s.removeChild(s.firstChild);
    }
    
    s.appendChild(document.createTextNode(text));    
}

function score() {
    g.score += 1;
    showText("score", g.score);
}

function getRandomInt() {
  return Math.floor(Math.random() * 4);
}

function drawGrid() {
    var i, j, row, cell;
    var grid = document.getElementById("grid");
    var parent = grid.parentNode;

    parent.removeChild(grid);


    for (i = 0; i < 4; i += 1) {
        row = document.createElement("div");
        row.classList.add("row");
        for (j = 0; j < 4; j += 1) {
            cell = document.createElement("div");
            cell.id = "cell-" + i +"-" + j;
            cell.classList.add("cell");
            row.appendChild(cell);
        }        
        grid.appendChild(row);
    }

    parent.appendChild(grid);
}

function tidy(box) {
    box.removeEventListener("click", boxClick);
    box.removeEventListener("transitionend", timeout);
    box.addEventListener("transitionend", function () {
        box.parentNode.removeChild(box);
        if (g.running) {
            nextMole();
        }
    });
    
}

function timeout(e) {
    var box = e.target;
    
    tidy(box);
    
    box.classList.remove("popup");
    box.classList.add("popdown");

    box.style.height = 0;
}

function boxClick(e) {
    var box = e.target;

    tidy(box);
    
    box.style.height = box.scrollHeight + "px";

    box.classList.remove("popup");
    box.classList.add("popout");
    
    box.style.background = "#fff";
    score();
}

function showBox(cell) {
    var box = document.createElement("div");

    box.classList.add("pop");
    box.classList.add("popup");
    box.style.height = "0px";
    
    setTimeout(function () {
        box.style.height = "50px";
        box.style.background = "#ffcc66";
    }, 25);

    box.addEventListener("click", boxClick);
    box.addEventListener("transitionend", timeout);
    
    cell.appendChild(box);
}

function nextMole() {
    var row = getRandomInt();
    var col = getRandomInt();

    var cell = document.getElementById("cell-" + row + "-" + col);

    showBox(cell);
}

function tick() {
    var sleep;
    var now = Date.now();
    var diff = (now - g.lastTick);
    g.lastTick = now;

    g.time += diff;
    
    showText("time", 30 - (Math.floor(g.time / 1000) ));
    
    sleep = 1000 - (g.time % 1000);
    
    if (g.time < 30000) {
        setTimeout(tick, sleep);
    } else {
        g.running = false;
    }
}

function init() {
    drawGrid();
    g.lastTick = Date.now();
    nextMole();
    tick();
}

document.addEventListener("DOMContentLoaded", init);