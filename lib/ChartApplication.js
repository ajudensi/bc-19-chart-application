//require('bootstrap');
//require('papaparser');

var colors = ["#CD5C5C", "#F08080", "#FA8072", "#E9967A", "#FFA07A", "#5785C2",
  "#5792C2", "#579DC2", "#57B2C2", "#FFDAB9", "#E6E6FA", "#5fcf80",
  "9E2605", "#337ab7", "#265a88", "#4CAFB5", "#075265", "#42b4d6"
];

document.getElementById("data-report").style.display = 'none';

function GraphDisplay(e) {
  e.preventDefault();

  var dataErrors;

  var canvas = document.getElementById('ch-app-big-canvas');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  //trim values to remove whitespaces from both ends
  this.data = document.getElementById('inputedData').value.trim();

  //remove non numeric values and replace with space
  this.data = this.data.replace(/[^0-9.]/g, " ");

  //splits string to create array
  this.data = this.data.split(/[\D]+/);

  //remove all spaces/empty elements from array
  this.data = this.data.filter(v=>v!='');

  //This may never run. But for safety
  if(typeof this.data == "symbol" || typeof this.data == " "){
    dataErrors = "You must enter a set of Numbers to plot. ChartApp only accepts numbers";
    writeErrors(dataErrors);
    return false;
  }

  //If we only have empty object or values.
  //We only plot graphs with two or more values.
  if(this.data.length < 2){
    dataErrors = "You should enter more than one value to plot";
    writeErrors(dataErrors);
    return false;
  }

  //If values contain negatives or zero
  if(this.data < 1){
    dataErrors = "Your data contains one or more negative values";
    writeErrors(dataErrors);
    return false;
  }
  
  //Use data points as labels
  this.labels = this.data;

  var total = this.data.reduce((a, b) => parseInt(a) + parseInt(b), 0);

  //reset datareporting to empty
  document.getElementById("dataErrors").innerHTML = '';

  //Get selected graph
  var graphType = document.getElementsByName("graphRadio");

  for (var i = 0; i < graphType.length; i++) {
    if (graphType[i].checked) {
      var graph = graphType[i].value;
    }
  }

  //Dynamically calculate bar width according to length of data points
  var barWidth = canvas.length / this.data.length;



  if (ctx) {
    if (canvas && ctx) {
      if (graph == 'histogram') {
        Histogram(ctx, canvas, this.data, (canvas.height - 10), 10);
      }
      if (graph == 'bars') {
        BarChart(ctx, canvas, this.data, (canvas.height - 10), 10);
      }
      if (graph == 'lines') {
        LineChart(ctx, canvas, this.data, 50, (canvas.height - 10), 10);
      }
      if(graph == 'lineTwo'){
        LineGraphTwo(ctx, canvas, this.data, 50, (canvas.height - 10), 10)
      }
      if (graph == 'pie') {
        if (total !== 360) {
          dataErrors = "Your data can not be used to plot Pie Chart. It's sum is not equal to 360. <br>" +
                            "The sum of your inputed data is " + total;
          writeErrors(dataErrors);
          return false;
        } else {
          PieChart(canvas, ctx);
        }
      }
    }
  } else {
    dataErrors = "Your browser does not support HTML5 Canvas. Go get a modern brower";
    writeErrors(dataErrors);
    return false;
  }
}



function Histogram(context, canvas, data, chartHeight, markDataIncrementsIn) {

  var startY = 490;
  var barWidth = (canvas.width / data.length) - 5;
  var startX = 50;

  drawLine(context, startX, startY, startX, 30);
  drawLine(context, startX, startY, 570, startY);

  var maxValue = 0;
  for (var i = 0; i < data.length; i++) {
    
    var values = data[i];
    var height = parseInt((Math.max(values)));

    if (parseInt(height) > parseInt(maxValue)) maxValue = height;

    context.fillStyle = colors[i];
    drawRectangle(context, startX, (chartHeight - height), barWidth, height, true);

    // Add the column title to the x-axis
    context.textAlign = "left";
    context.fillStyle = "#333";
    context.fillText(values, startX + 4, chartHeight + 10, 200);

    startX += barWidth;
  }
  
  var numMarkers = Math.ceil(maxValue / markDataIncrementsIn);
  
  context.textAlign = "right";
  
  var markerValue = 0;
  
  for (var i = 0; i < numMarkers; i++) {
    context.fillText(markerValue, (50 - 5), (chartHeight - markerValue), 50);
    markerValue += markDataIncrementsIn;
  }
}


function BarChart(context, canvas, data, chartHeight, markDataIncrementsIn) {
  context.lineWidth = "1.0";
  var startY = 490;
  var barWidth = (canvas.width / data.length) - 10;
  var startX = 50;

  drawLine(context, startX, startY, startX, 30);
  drawLine(context, startX, startY, 570, startY);

  var maxValue = 0;
  for (var i = 0; i < data.length; i++) {
    var values = data[i];

    var height = parseInt((Math.max(values)));

    if (parseInt(height) > parseInt(maxValue)) maxValue = height;

    // Write the data to the chart
    context.fillStyle = colors[i];
    drawRectangle(context, startX, (chartHeight - height), barWidth, height, true);

    // Add the column title to the x-axis
    context.textAlign = "left";
    context.fillStyle = "#333";
    context.fillText(values, startX + 4, chartHeight + 10, 200);

    startX += barWidth + 5;

  }
  // Add some data markers to the y-axis
  var numMarkers = Math.ceil(maxValue / markDataIncrementsIn);
  context.textAlign = "right";

  context.fillStyle = "#000";
  var markerValue = 0;
  for (var i = 0; i < numMarkers; i++) {
    context.fillText(markerValue, (50 - 5), (chartHeight - markerValue), 50);
    markerValue += markDataIncrementsIn;
  }

}

function LineChart(context, canvas, data, startX, chartHeight, markDataIncrementsIn) {
  context.lineWidth = "1.0";
  var startY = 490;

  var fluidWidth = canvas.width / data.length;

  var currX = 70;

  drawLine(context, startX, startY, startX, 30);
  drawLine(context, startX, startY, 570, startY);
  context.lineWidth = "0.0";
  var maxValue = 0;
  data = data.sort(function(a, b) {
    return a - b
  });

  for (var i = 0; i < data.length; i++) {
    var height = parseInt((Math.max(data[i])));

    (Math.min(data[0]) < 15 ? height = height + 50 : height = height);



    if (parseInt(height) > parseInt(maxValue)) maxValue = height;

    context.beginPath();

    context.moveTo(currX, canvas.width - height);

    context.lineTo(currX, 488);
    context.lineWidth = 1;
    context.lineCap = 'round';
    context.strokeStyle = colors[i];
    context.stroke();



    // Add the column title to the x-axis
    context.textAlign = "left";
    context.fillStyle = "#333";
    context.fillText(height, currX - 10, chartHeight + 10, 200);
    //context.fillText(data[i], currX - 10, chartHeight - 10, 200); standardized scores. Note yet implemented

    currX += fluidWidth - 3;
  }
  // Add some data markers to the y-axis
  var numMarkers = Math.ceil(maxValue / markDataIncrementsIn);
  context.textAlign = "right";
  context.fillStyle = "#000";
  var markerValue = 0;
  for (var i = 0; i < numMarkers; i++) {
    context.fillText(markerValue, (50 - 5), (chartHeight - markerValue), 50);
    markerValue += markDataIncrementsIn;
  }

}





function drawLine(contextO, startx, starty, endx, endy) {
  contextO.beginPath();
  contextO.moveTo(startx, starty);
  contextO.lineTo(endx, endy);
  contextO.closePath();
  contextO.stroke();
}


function drawRectangle(contextO, x, y, w, h, fill) {
  contextO.beginPath();
  contextO.rect(x, y, w, h);
  contextO.closePath();
  contextO.stroke();
  if (fill) contextO.fill();
}


function PieChart(canvas, context) {
  var data = document.getElementById('inputedData').value;

  data = data.split(' ');
  var labels = data;
  data = data.sort(function(a, b) {
    return b - a
  });

  total = data.reduce((a, b) => parseInt(a) + parseInt(b), 0);


  var centerX = Math.floor(canvas.width / 2);
  var centerY = Math.floor(canvas.height / 2);
  radius = Math.floor(canvas.width / 2);

  var startingAngle = degreesToRadians(sumTo(data, i));

  // var arcSize = degreesToRadians(data[i]);

  // var endingAngle = startingAngle + arcSize;


  for (var i = 0; i < data.length; i++) {
    context.fillStyle = colors[i];

    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, radius,
      startingAngle, startingAngle + Math.PI * 2 * (data[i]) / total, false);
    context.lineTo(centerX, centerY);

    context.fill();
    context.closePath();

    context.save();
    context.translate(centerX, centerY);
    context.rotate(startingAngle);
    var dx = Math.floor(canvas.width * 0.5) - 10;
    var dy = Math.floor(canvas.height * 0.05);

    context.textAlign = "right";
    var fontSize = Math.floor(canvas.height / 30);
    context.font = fontSize + "pt Heveltica";
    context.fillStyle = "#333";
    context.fillText(labels[i], dx, dy);
    context.restore();

    startingAngle += Math.PI * 2 * (data[i] / total);
  }


}



function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function sumTo(a, i) {
  var sum = 0;

  for (var j = 0; j < i; j++) {
    sum += a[j];
  }
  return sum;
}

function writeErrors(error){
  document.getElementById("data-report").style.display = 'block';
  document.getElementById("dataErrors").innerHTML = error;
}


function LineGraphTwo(context, canvas, data, startX, chartHeight, markDataIncrementsIn) {
  
  var startY = 490;

  var fluidWidth = canvas.width / data.length;

  var currX = 70;

  drawLine(context, startX, startY, startX, 30);
  drawLine(context, startX, startY, 570, startY);
  context.lineWidth = "0.0";
  var maxValue = 0;
  data = data.sort(function(a, b) {
    return a - b
  });

  for (var i = 0; i < data.length; i++) {
    var height = parseInt((Math.max(data[i])));    



    if (parseInt(height) > parseInt(maxValue)) maxValue = height;

    context.beginPath();

    context.moveTo(currX, canvas.height - height - 5);
    
    context.lineTo(currX + fluidWidth, canvas.height - parseInt(data[i+1]) - 5);

    context.lineWidth = 3;
    context.strokeStyle = colors[i];
    context.stroke();
    context.closePath();
    

    context.beginPath();
    context.arc(currX,canvas.height - height - 5,2,0,2*Math.PI);
    context.stroke();
    context.closePath();

    // Add the column title to the x-axis
    context.textAlign = "left";
    context.fillStyle = "#333";
    context.fillText(height, currX - 10, chartHeight + 10, 200);
    //context.fillText(data[i], currX - 10, chartHeight - 10, 200); //show standardized scores

    currX += fluidWidth - 3;
  }
  // Add some data markers to the y-axis
  var numMarkers = Math.ceil(maxValue / markDataIncrementsIn);
  context.textAlign = "right";
  context.fillStyle = "#000";
  var markerValue = 0;
  for (var i = 0; i < numMarkers; i++) {
    context.fillText(markerValue, (50 - 5), (chartHeight - markerValue), 50);
    markerValue += markDataIncrementsIn;
  }

}

document.getElementById("plotInputedtData").addEventListener("click", GraphDisplay);