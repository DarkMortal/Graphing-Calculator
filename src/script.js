let canvas;
const SIZE = 650;
let xOffset, yOffset;
let a = 20, N = 5, unit = N * a;
let enabled1 = false, enabled2 = false;

let i_min_1 = 0, i_max_1 = 0, isMark1 = false;
let i_min_2 = 0, i_max_2 = 0, isMark2 = false;

let MIN_N = 2, MAX_N = 5;

function updatePointer() {
    document.getElementById('x').innerText = ((mouseX + xOffset) / (unit)).toFixed(2);
    document.getElementById('y').innerText = ((mouseY + yOffset) / (-unit)).toFixed(2);
}

function setup() {
    xOffset = yOffset = -3 * unit;

    canvas = createCanvas(SIZE, SIZE);
    canvas.parent("canvas");
    canvas.mouseMoved(updatePointer);

    let eqns = document.querySelectorAll('.eqn');
    console.log(eqns[1].children[1], eqns[1].children[2])
    eqns[1].children[0].onclick = () => enabled1 = false;
    eqns[1].children[1].onclick = () => enabled1 = true;
    eqns[5].children[0].onclick = () => enabled2 = false;
    eqns[5].children[1].onclick = () => enabled2 = true;

    eqns[3].children[0].onclick = () => {
        i_min_1 = eqns[2].children[0].value;
        i_max_1 = eqns[2].children[1].value;
        if(i_min_1 === '' || i_max_1 === ''){
            alert("Enter a valid range of values");
            isMark1 = false;
            return;
        }
        else if(parseFloat(i_min_1) > parseFloat(i_max_1)){
            alert("Lower limit can't be greater than upper limit");
            isMark1 = false;
            return;
        }
        isMark1 = true;
    };
    eqns[3].children[1].onclick = () => isMark1 = false;
    eqns[7].children[0].onclick = () => {
        i_min_2 = eqns[6].children[0].value;
        i_max_2 = eqns[6].children[1].value;
        if(i_min_2 === '' || i_max_2 === ''){
            alert("Enter a valid range of values");
            isMark2 = false;
            return;
        }
        else if(parseFloat(i_min_2) > parseFloat(i_max_2)){
            alert("Lower limit can't be greater than upper limit");
            isMark2 = false;
            return;
        }
        isMark2 = true;
    };
    eqns[7].children[1].onclick = () => isMark2 = false;
}

let f1 = x => math.evaluate(document.getElementById("eq1").value, { x: x })
let f2 = x => math.evaluate(document.getElementById("eq2").value, { x: x })

function draw() {
    clear();
    background(255);
    let pY1 = null;
    let pY2 = null;
    for (let i = 0; i < SIZE; i++) {
        let t = xOffset + i;
        let p = yOffset + i;
        if (t % a == 0) {
            if (t == 0) {
                stroke(0, 0, 0);
                strokeWeight(2);
                line(i, 0, i, SIZE);
                let j = 0, k = 1;
                while (j < SIZE) {
                    if ((j + yOffset) % unit == 0) {
                        noStroke();
                        if ((j + yOffset) / (-unit) != 0) text((j + yOffset) / (-unit), t - xOffset + 5, j + 5);
                        k = unit;
                    }
                    j += k;
                }
            }
            else {
                stroke(0);
                strokeWeight(0.5);
                line(i, 0, i, SIZE);
            }
        }
        if (p % a == 0) {
            if (p == 0) {
                stroke(0, 0, 0);
                strokeWeight(2);
                line(0, i, SIZE, i);
                let j = 0, k = 1;
                while (j < SIZE) {
                    if ((j + xOffset) % unit == 0) {
                        noStroke();
                        text((j + xOffset) / unit, j + 5, p - yOffset + 12);
                        k = unit;
                    }
                    j += k;
                }
            }
            else {
                stroke(0);
                strokeWeight(0.5);
                line(0, i, SIZE, i);
            }
        }
        if (enabled1) {
            try {
                let x_temp = t / unit;
                let y = -unit * f1(x_temp) - yOffset;
                if (i > 0) {
                    strokeWeight(2);
                    stroke(document.getElementById("col1").value);
                    line(i - 1, pY1, i, y);

                    if(isMark1 && x_temp <= i_max_1 && x_temp >= i_min_1){
                        strokeWeight(0.7);
                        stroke(document.getElementById("mark_col1").value);
                        line(i, -yOffset, i, y);
                    }
                }
                pY1 = y;
            } catch {
                enabled1 = false;
            }
        }
        if (enabled2) {
            try {
                let x_temp = t / unit;
                let y = -unit * f2(x_temp) - yOffset;
                if (i > 0) {
                    strokeWeight(2);
                    stroke(document.getElementById("col2").value);
                    line(i - 1, pY2, i, y);

                    if(isMark2 && x_temp <= i_max_2 && x_temp >= i_min_2){
                        strokeWeight(0.7);
                        stroke(document.getElementById("mark_col2").value);
                        line(i, -yOffset, i, y);
                    }
                }
                pY2 = y;
            } catch {
                enabled2 = false;
            }
        }
    }
}

function zoomIn(){
    if (N < MAX_N) {
      N++;
      unit = N * a;
      // updatePointer();
    }
}

function zoomOut(){
  if (N > MIN_N) {
    N--;
    unit = N * a;
    // updatePointer();
  }
}

const isTouchDevice = () => (
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0)
);

const isNotOutOfBounds = (x,y) => (
    (x >= 0) &&
    (x <= width) &&
    (y >= 0) &&
    (y <= height)
);

function mouseDragged() {
    if (!isTouchDevice() && isNotOutOfBounds(mouseX, mouseY)) {
        xOffset += (pmouseX - mouseX);
        yOffset += (pmouseY - mouseY);
    }
}

/*window.onkeydown = (evt) => {
    if (evt.keyCode == RIGHT_ARROW ||
        evt.keyCode == LEFT_ARROW ||
        evt.keyCode == UP_ARROW ||
        evt.keyCode == DOWN_ARROW) {
        evt.preventDefault();
        switch (evt.keyCode) {
            case RIGHT_ARROW: xOffset -= 5; break;
            case LEFT_ARROW: xOffset += 5; break;
            case DOWN_ARROW: yOffset -= 5; break;
            case UP_ARROW: yOffset += 5; break;
        } updatePointer();
    }
}

// for mobile devices (can be ignored)

if(isTouchDevice()){
  Hammer(document.getElementById('canvas')).on('panright',() => xOffset -= 5);
  Hammer(document.getElementById('canvas')).on('panleft',() => xOffset += 5);
  Hammer(document.getElementById('canvas')).on('panup',() => yOffset += 5);
  Hammer(document.getElementById('canvas')).on('pandown',() => yOffset -= 5);
}*/

/*Hammer(document.getElementById('canvas')).on('pinchin',()=> {alert('pinchin')
  if (N > MIN_N) {
    N--;
    unit = N * a;
    //updatePointer();
  }
});
Hammer(document.getElementById('canvas')).on('pinchout',()=> {
  if (N < MAX_N) {
    N++;
    unit = N * a;
    //updatePointer();
  }
});*/