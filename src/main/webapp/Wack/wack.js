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
        grid.addEventListener("click", boxClick);
        grid.appendChild(row);
    }        
    
    parent.appendChild(grid);
}

function timeout(e) {
    var box = e.target;
    hideBox(box);    
}

function showBox(cell) {    
    cell.addEventListener("click", boxClick);
    cell.addEventListener("animationend", timeout);
    
    var box = document.createElement("div");
    
    box.classList.add("cell");
    box.classList.add("pop");
    box.classList.add("popup");
    
    cell.appendChild(box);  
}

function hideBox(box) {
    box.removeEventListener("click", boxClick);
    box.removeEventListener("animationend", timeout);
    box.classList.add("popdown");
    box.addEventListener("animationend", function () { box.parentNode.removeChild(box); });
}

function boxClick(e) {    
    
    var box = e.target;    
    hideBox(box);
}

function runGame() {    
    var row = getRandomInt();
    var col = getRandomInt();
    
    var cell = document.getElementById("cell-" + row + "-" + col);
    
    showBox(cell);
    setTimeout(runGame, 2500);
}

function init() {
    drawGrid();
    runGame();
}

document.addEventListener("DOMContentLoaded", init);