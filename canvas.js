

var canvas = document.querySelector('canvas');

// set drawing surface to the size of the screen
canvas.width = 1182;
canvas.height = 506;

// get a reference to the 2d drawing context/ api
// ctx stands for context
var ctx = canvas.getContext('2d');

/*---------------------------------------------------------
CREATING THE SETUP FOR OUR IMAGES
-----------------------------------------------------------*/
// loading image
var image = new Image();

var selectedImage = window.document.listepictures.picture.options[window.document.listepictures.picture.selectedIndex].value;

image.src = selectedImage;

width_original = image.clientWidth;
height_original = image.clientHeight;

//imageWidth = 354;
//imageHeight = 450;

imageWidth = 200;
imageHeight = height_original * imageWidth / width_original

// abs stands für Abstände zwischen den Bildern
abs = new Number(30);

// drawing the image onto the canvas
ctx.drawImage(image, abs, abs, imageWidth, imageHeight);

// drawing a frame for second image
ctx.beginPath();
ctx.moveTo(2*abs + imageWidth, abs);
ctx.lineTo(2*abs + 2*imageWidth, abs);
ctx.lineTo(2*abs + 2*imageWidth, abs + imageHeight);
ctx.lineTo(2*abs + imageWidth, abs + imageHeight);
ctx.lineTo(2*abs + imageWidth, abs);
ctx.strokeStyle = 'rgb(0, 0, 0)';
ctx.stroke();

// drawing the image onto the canvas
ctx.drawImage(image, abs * 3 + 2 * imageWidth, abs, imageWidth, imageHeight);

/*---------------------------------------------------------
EXTRACTING INFORMATION FROM OUR LOADED IMAGE
-----------------------------------------------------------*/
// get image data


image.onload = function() {

    // draw "normal" image to defined place
    ctx.drawImage(image, abs, abs, imageWidth, imageHeight);

    // drawing the image onto the canvas
    ctx.drawImage(image, abs * 3 + 2 * imageWidth, abs, imageWidth, imageHeight);

}


// extracting the darkness of a pixel
function pixel(x, y) {
    var pixel = ctx.getImageData(x, y, 1, 1);
    var pixelData = pixel.data;
    var pixelIntensity = pixelData[0];

    return pixelIntensity;
}


// we need that so that we can make sure we get round numbers as pixels!
function z(point1, point2) {
    if ((point2 - point1) % 2 == 0) {
        var a = 0;
    } else {
        var a = 1;
    }
    return a;
}

// function getRndInteger(min, max) {
//   return Math.floor(Math.random() * (max - min) ) + min;
// }



/*---------------------------------------------------------
THE MAGIC CALCULATION OF WHAT TO DRAW
-----------------------------------------------------------*/

// starting point (just a random one for now. Idea: choose a dark one from image)
startX = new Number(abs + imageWidth/4);
startY = new Number(abs + imageHeight/4);
// startX = getRndInteger(60,350);
// startY = getRndInteger(60,440);

// defining what we want as our "neighborhood" of a pixel
skipNeighbors = new Number(3);
var neighbors = parseInt(window.document.listelength.length.options[window.document.listelength.length.selectedIndex].value);

var color = document.querySelector('#color');


colorcode = color.value;

var thicknessOfLine = window.document.listethickness.thickness.options[window.document.listethickness.thickness.selectedIndex].value;




function drawLine(){

    for (var i = 0; i < 5; i++) {


        // höchste intensity wird für[] jeden Durchgang (jede neue Linie) wieder auf 1000000 gesetzt
        highestIntensity = 1000000;

        // wir nehmen vorerst die aktuellen Koordinaten, damit zu Not auf dem gleichen Punkt stehen bleiben (falls das Bild unter allen möglichen Linien ganz weiß ist)
        xHighestInt = new Number(startX);
        yHighestInt = new Number(startY);

        // "Stift ansetzen"
        ctx.beginPath();
        ctx.moveTo(startX + imageWidth + abs, startY);

        // wir gehen durch alle möglichen Punkte in der Nachbarschaft
        for (var i = startX - neighbors; i < startX + neighbors; i += 5) {
            for (var j = startY - neighbors; j < startY + neighbors; j += 5) {
                // to avoid staying at the same point or drawing very short lines and to make sure that we only look at pixels in our image:
                if (((i < startX - skipNeighbors || i > startX + skipNeighbors) && (j < startY - skipNeighbors || j > startY + skipNeighbors)) && ((i >= abs) && (i <= abs + imageWidth) && (j >= abs) && (j <= abs + imageHeight)) && i != lastX && j != lastY) {
                    // compute intensity of line connecting starting point and point[x,y]

                    // x and y values for start and endling point of line
                    var p1x = startX;
                    var p1y = startY;
                    var p5x = i;
                    var p5y = j;

                    // calculating point in the middle (p3x, p3y)
                    var p3x = p1x + (p5x - p1x + z(p1x, p5x))/2;
                    var p3y = p1y + (p5y - p1y + z(p1y, p5y))/2;

                    // calculating point (p2x, p2y)
                    var p2x = p1x + (p3x - p1x + z(p1x, p3x))/2;
                    var p2y = p1y + (p3y - p1y + z(p1y, p3y))/2;

                    // calculating point (p4x, p4y)
                    var p4x = p3x + (p5x - p3x + z(p3x, p5x))/2;
                    var p4y = p3y + (p5y - p3y + z(p3y, p5y))/2;


                    // some points on the line and their darkness
                    var intensity = pixel(p1x, p1y) + pixel(p2x, p2y) + pixel(p3x, p3y) + pixel(p4x, p4y) + pixel(p5x, p5y);


                    // compare computed intensity to current highest intesity. If number is smaller (= darker), take it as new highest intensity. also take the i and j values as xHighestInt and yHighestInt!!
                    if (intensity < highestIntensity) {
                        highestIntensity = intensity;
                        xHighestInt = i;
                        yHighestInt = j;
                    }

                }

            }
        }
        // draw the line between starting point and calculated point
        ctx.lineTo(xHighestInt + imageWidth + abs, yHighestInt);
        ctx.strokeStyle = colorcode;
        ctx.lineWidth = thicknessOfLine;
        ctx.stroke();
        // draw same line in white on original image
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(xHighestInt, yHighestInt);
        ctx.strokeStyle = 'rgb(255, 255, 255)';
        ctx.lineWidth = thicknessOfLine * 3;
        ctx.stroke();

        // remember where we came from, so that we don't go back the same line
        var lastX = startX;
        var lastY = startY;

        // overwrite variable x and y with x and y coordinates of calculated point --> new starting point
        startX = xHighestInt;
        startY = yHighestInt;

    }
}

var lines = 0;
var repeater;

var anzahl = document.querySelector('#anzahl').value;
console.log(anzahl);

function animate() {

    drawLine();
    lines++;
    if (lines > anzahl) {
        cancelAnimationFrame(repeater);
    } else {
        repeater = requestAnimationFrame(animate);
    }

}

animate();
