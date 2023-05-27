import { evaluate } from "mathjs";

const lineWidth = 1, step = 20, scaling = 12.5;
const offsetX = 480.5, offsetY = 360.5;
const coordinates = {
    X: offsetX - 12,
    Y: offsetY + 15
},
    graphOffset = {
        X: -20.5,
        Y: -140.5
    };

var canvas = document.getElementById("canvas1");  //This is a Javascript Canvas Element
var canvas2 = document.getElementById("canvas2");
var canvas3 = document.getElementById("canvas3");
var canvas4 = document.getElementById("canvas4");
var ctx = canvas.getContext("2d");  //This is a Canvas Rendering Context
var ctx2 = canvas2.getContext("2d");
var graph = canvas3.getContext("2d");
var graph2 = canvas4.getContext("2d");

const LEFT = 0.5 - scaling * (Math.ceil(canvas.width / step) * step),
    limits = 8.33,  //Very very important
    TOP = 0.5 - scaling * (Math.ceil(canvas.height / step) * step),
    right = 0.5 + scaling * canvas.width,
    bottom = 0.5 + scaling * canvas.height,
    n = 300, xMin = 0 - limits, xMax = limits, yMin = 0 - limits, yMax = limits;

var expr = "", expr2 = "",
    scope = { x: 0 }, scope2 = { x: 0 },
    graphColor = "navy", graphColor2 = "red";

function draw() {
    ctx.clearRect(LEFT, TOP, right - LEFT, bottom - TOP);
    ctx.beginPath();
    for (var x = LEFT; x < right; x += step) {
        if (x == offsetX) {
            ctx.closePath();
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = "#888";
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x, TOP);
            ctx.lineTo(x, bottom);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 1.5 * lineWidth;
            ctx.closePath();
            ctx.stroke();

            ctx.beginPath();
        }
        else {
            ctx.moveTo(x, TOP);
            ctx.lineTo(x, bottom);
        }
    }
    for (var y = TOP; y < bottom; y += step) {
        if (y == offsetY) {
            ctx.closePath();
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = "#888";
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(LEFT, y);
            ctx.lineTo(right, y);
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 1.5 * lineWidth;
            ctx.closePath();
            ctx.stroke();

            ctx.beginPath();
        }
        else {
            ctx.moveTo(LEFT, y);
            ctx.lineTo(right, y);
        }
    }
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "#888";
    ctx.stroke();

    ctx2.font = "15px Arial";
    ctx2.clearRect(LEFT, TOP, right - LEFT, bottom - TOP);
    ctx2.fillText("0", coordinates.X, coordinates.Y);
    for (x = 0; x <= 12000; x += 60) {
        if (x !== 0) {
            ctx2.fillText((x / 60).toFixed(0).toString(), coordinates.X + x, coordinates.Y);
            ctx2.fillText(((x / 60) * (-1)).toFixed(0).toString(), coordinates.X - x, coordinates.Y);
        }
    }
    for (y = 0; y <= 12000; y += 60) {
        if (y !== 0) {
            ctx2.fillText(((y / 60) * (-1)).toFixed(0).toString(), coordinates.X + 15, coordinates.Y + y - step);
            ctx2.fillText((y / 60).toFixed(0).toString(), coordinates.X + 20, coordinates.Y - y);
        }
    }
}

// Mouse event handling
let start;
const getPos = (e) => ({
    x: e.clientX - canvas.offsetLeft,
    y: e.clientY - canvas.offsetTop
});

const reset = () => {
    start = null;
    // reset translation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx2.setTransform(1, 0, 0, 1, 0, 0);
    graph.setTransform(1, 0, 0, 1, 0, 0);
    graph2.setTransform(1, 0, 0, 1, 0, 0);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height); draw();
}

function drawGraph() {
    var i, xPixel, yPixel, percentX, percentY, mathX, mathY;
    graph.clearRect(LEFT, TOP, right - LEFT, bottom - TOP);
    graph.beginPath();
    for (i = 3 * (1 - n); i < 3 * n; i++) {
        percentX = i / (n - 1);
        mathX = percentX * (xMax - xMin) + xMin;

        mathY = calculate(mathX);

        percentY = (yMax - mathY) / (yMax - yMin);
        xPixel = (percentX * canvas3.width);
        yPixel = (percentY * canvas3.height);
        graph.lineTo(xPixel, yPixel);
    }
    graph.strokeStyle = graphColor;
    graph.lineWidth = lineWidth;
    graph.stroke();
}

function drawGraph2() {
    var i, xPixel, yPixel, percentX, percentY, mathX, mathY;
    graph2.clearRect(LEFT, TOP, right - LEFT, bottom - TOP);
    graph2.beginPath();
    console.log("Hello", graph2)
    for (i = 3 * (1 - n); i < 3 * n; i++) {
        percentX = i / (n - 1);
        mathX = percentX * (xMax - xMin) + xMin;

        mathY = calculate2(mathX);

        percentY = (yMax - mathY) / (yMax - yMin);
        xPixel = (percentX * canvas3.width);
        yPixel = (percentY * canvas3.height);
        graph2.lineTo(xPixel, yPixel);
    }
    graph2.strokeStyle = graphColor2;
    graph2.lineWidth = lineWidth;
    graph2.stroke();
}

/* Code to disable scrolling
canvas2.addEventListener("mousedown", e => {
    reset();
    start = getPos(e)
});

canvas2.addEventListener("mouseup", reset);
canvas2.addEventListener("mouseleave", reset);

canvas2.addEventListener("mousemove", e => {
    if (!start) return;     // Only move the grid when we registered a mousedown event
    let pos = getPos(e);    // Move coordinate system in the same way as the cursor
    ctx.translate(pos.x - start.x, pos.y - start.y);
    ctx2.translate(pos.x - start.x, pos.y - start.y);
    draw(); start = pos;
});*/

canvas2.addEventListener("mousedown", e => {
    start = getPos(e)
});
canvas2.addEventListener("mouseup", () => {
    start = null;
});
canvas2.addEventListener("mouseleave", () => {
    start = null;
});

canvas2.addEventListener("mousemove", e => {
    if (!start) return;
    let pos = getPos(e);
    ctx.translate(pos.x - start.x, pos.y - start.y);
    ctx2.translate(pos.x - start.x, pos.y - start.y);
    graph.translate(pos.x - start.x, pos.y - start.y);
    graph2.translate(pos.x - start.x, pos.y - start.y); draw();
    if (expr !== "") drawGraph();
    if (expr2 !== "") drawGraph2();
    start = pos;
});

function calculate(p) {
    scope.x = p;
    return evaluate(expr, scope);
}

function calculate2(p) {
    scope2.x = p;
    return evaluate(expr2, scope2);
}

function DRAW() {
    CLEAR();
    expr = document.getElementById("expression").value;
    graphColor = document.getElementById("color").value; drawGraph();
}

function CLEAR() {
    expr = ""; reset();
    graph.translate(graphOffset.X, graphOffset.Y);
    graph2.translate(graphOffset.X, graphOffset.Y);
    graph.clearRect(LEFT, TOP, right - LEFT, bottom - TOP);
    graph2.clearRect(LEFT, TOP, right - LEFT, bottom - TOP);
    if (expr2) drawGraph2();
}

function DRAW2() {
    CLEAR2();
    expr2 = document.getElementById("expression2").value;
    graphColor2 = document.getElementById("color2").value; drawGraph2();
}

function CLEAR2() {
    expr2 = ""; reset();
    graph.translate(graphOffset.X, graphOffset.Y);
    graph2.translate(graphOffset.X, graphOffset.Y);
    graph.clearRect(LEFT, TOP, right - LEFT, bottom - TOP);
    graph2.clearRect(LEFT, TOP, right - LEFT, bottom - TOP);
    if (expr) drawGraph();
}

window.onload = () => {
    draw();
    graph.translate(graphOffset.X, graphOffset.Y);
    graph2.translate(graphOffset.X, graphOffset.Y);
}

document.getElementById("dr1").onclick = DRAW;
document.getElementById("dr2").onclick = DRAW2;
document.getElementById("clr1").onclick = CLEAR;
document.getElementById("clr2").onclick = CLEAR2;