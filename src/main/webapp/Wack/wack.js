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
"use strict";

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
    showText("score","Score: " + g.score);
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
    box.removeEventListener("transitionend", timeout, true);
    box.addEventListener("transitionend", function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        box.parentNode.removeChild(box);
        if (g.running) {
            nextMole();
        }
    }, true);
    
}

function timeout(e) {
    e.preventDefault();
    e.stopPropagation();
    
    var box = e.target;
    
    tidy(box);
    
    box.classList.remove("popup");
    box.classList.add("popdown");

    box.style.height = 0;
}

function boxClick(e) {
    var box = e.target;

    tidy(box);      
    
    doRotate(document.getElementById("grid"));
    
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
    box.addEventListener("transitionend", timeout, true);
    
    cell.appendChild(box);
}

function nextMole() {
    var row = getRandomInt();
    var col = getRandomInt();

    var cell = document.getElementById("cell-" + row + "-" + col);
    
    showBox(cell);
}

function tick() {
    var sleep, left;
    var now = Date.now();
    var diff = (now - g.lastTick);
    g.lastTick = now;

    g.time += diff;
    
    left = 30 - (Math.floor(g.time / 1000) );
    
    showText("time", left + " second" + (left !== 1 ? 's' : ''));
    
    sleep = 1000 - (g.time % 1000);
    
    if (g.time < 30000) {
        setTimeout(tick, sleep);
    } else {
        g.running = false;
    }
}

function getStyle(selector) {
    var i;
    var sheet = document.getElementById("styles").sheet;
    for (i = 0; i < sheet.cssRules.length; i+= 1) {
        if (sheet.cssRules[i].type === 1 && sheet.cssRules[i].selectorText === selector) { // STYLE_RULE
            return sheet.cssRules[i].style;
        }
    }
    return null;
}

function changeSpeed(time) {
    var style = getStyle(".popup");
    var oldTime = style.getPropertyValue("transition-duration");
    
    style.setProperty("transition-duration", time);
    setTimeout(function () { 
        style.setProperty("transition-duration", oldTime);
    }, 2000);   
}

function doRotate(target) {
    target.classList.add("rotate");
    
    target.addEventListener("transitionend", doneRotate, true);
    setTimeout(function () {
        var style = getStyle(".rotate");
        style.setProperty("transform", "rotate(360deg)");        
    }, 10);
    
}

function doneRotate(e) {
    if (e.target.classList.contains("rotate")) {
        e.target.removeEventListener("transitionend", doneRotate, true);       
        var style = getStyle(".rotate");
        style.setProperty("transform", "rotate(0deg)");
        e.target.classList.remove("rotate");
    }
}

function listStyles() {
    var ss = document.getElementById("styles").sheet;
    var i, j, style, name, rule;
    for (i = 0; i < ss.cssRules.length; i+= 1) {
        if (ss.cssRules[i].type === 1 ) { // STYLE_RULE
            name = ss.cssRules[i].selectorText;
            style = ss.cssRules[i].style;
            
            console.log("Got a block called " + name);
            for (j = 0; j < style.length ; j+= 1) {                
                console.log(j + ": " + style[j]);
            }            
        }
    }
}

function init() {
    drawGrid();
    g.lastTick = Date.now();   
//    listStyles();
    nextMole();
    tick();
}

document.addEventListener("DOMContentLoaded", init);