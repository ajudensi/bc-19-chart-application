//require('bootstrap');
//require('papaparser');



var colors = ["#CD5C5C","#F08080","#FA8072", "#E9967A","#FFA07A", "#5785C2",
        "#5792C2","#579DC2","#57B2C2", "#FFDAB9", "#E6E6FA","#5fcf80",
        "9E2605", "#337ab7","#265a88","#4CAFB5","#075265", "#42b4d6"];





function DataProperties(data){
  //private properties
  var maxvar = 5;
  var varCount = data.length;
  
  if(varCount > 5){
    return 'You have exceeded the maximum number of variables allowed for chart';
  } else {
    var data = data.join();
    return true;
  }


}

function PieChart(){



}

function Histogram(context, canvas, data, chartHeight, markDataIncrementsIn){
  context.lineWidth = "1.0";
  var startY = 490;
  var barWidth = (canvas.width/data.length) - 5;
  var startX = 50;

  drawLine(context, startX, startY, startX, 30); 
  drawLine(context, startX, startY, 570, startY);     
  
  var maxValue = 0;
  for (var i=0; i < data.length; i++) {
     var values = data[i];
    //var name = values[0];
    var height = parseInt((Math.max(values)));
    
    if (parseInt(height) > parseInt(maxValue)) maxValue = height;
  
    context.fillStyle = colors[i];
    drawRectangle(context,startX,(chartHeight - height),barWidth,height,true);
  
    // Add the column title to the x-axis
    context.textAlign = "left";
    context.fillStyle = "#333";
    context.fillText(values, startX + 4, chartHeight + 10, 200);

    startX += barWidth;
  }
  // Add some data markers to the y-axis
  var numMarkers = Math.ceil(maxValue / markDataIncrementsIn);
  context.textAlign = "right";
  var markerValue = 0;
  for (var i=0; i < numMarkers; i++) {    
    context.fillText(markerValue, (50 - 5), (chartHeight - markerValue), 50);
    markerValue += markDataIncrementsIn;
  }
}

function BarChart(context, canvas, data, chartHeight, markDataIncrementsIn){
  context.lineWidth = "1.0";
  var startY = 490;
  var barWidth = (canvas.width/data.length) - 10;
  var startX = 50;

  drawLine(context, startX, startY, startX, 30); 
  drawLine(context, startX, startY, 570, startY);     
  
  var maxValue = 0;
  for (var i=0; i < data.length; i++) {
    var values = data[i];
    
    var height = parseInt((Math.max(values)));
    
    if (parseInt(height) > parseInt(maxValue)) maxValue = height;
  
    // Write the data to the chart
    context.fillStyle = colors[i];
    drawRectangle(context,startX ,(chartHeight - height), barWidth, height,true);
  
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
  for (var i=0; i < numMarkers; i++) {    
    context.fillText(markerValue, (50 - 5), (chartHeight - markerValue), 50);
    markerValue += markDataIncrementsIn;
  }
  
}

function LineChart(context, canvas, data, startX, chartHeight, markDataIncrementsIn){
  context.lineWidth = "1.0";
  var startY = 490;

  var sd = canvas.width / data.length;
  
  var currX = 70;  
  
  drawLine(context, startX, startY, startX, 30); 
  drawLine(context, startX, startY, 570, startY);     
  context.lineWidth = "0.0";
  var maxValue = 0;
  data = data.sort(function(a, b){return a-b});
  
  for (var i=0; i < data.length; i++) {    
    var height = parseInt((Math.max(data[i])));

   (Math.min(data[0]) < 15 ? height = height + 50 : height = height);

      

    if (parseInt(height) > parseInt(maxValue)) maxValue = height;
      
    context.beginPath();

    context.moveTo(currX, canvas.width - height);    

    context.lineTo(currX, 488);
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.strokeStyle = colors[i];
    context.stroke();

  
  
    // Add the column title to the x-axis
    context.textAlign = "left";
    context.fillStyle = "#333";
    context.fillText(height, currX - 10, chartHeight + 10, 200);
    context.fillText(data[i], currX - 10, chartHeight - 10, 200);

      currX += sd - 3;    
  }
  // Add some data markers to the y-axis
  var numMarkers = Math.ceil(maxValue / markDataIncrementsIn);
  context.textAlign = "right";
  context.fillStyle = "#000";
  var markerValue = 0;
  for (var i=0; i < numMarkers; i++) {    
    context.fillText(markerValue, (50 - 5), (chartHeight - markerValue), 50);
    markerValue += markDataIncrementsIn;
  }
  
}





function GraphDisplay(e){
  e.preventDefault();
   var canvas = document.getElementById('ch-app-big-canvas');
   var ctx = canvas.getContext('2d');
   ctx.clearRect(0,0,canvas.width, canvas.height)
  
  this.data = document.getElementById('inputedData').value;

  this.data = this.data.split(' ');

  

  this.labels = this.data;
  
  var  graphType= document.getElementsByName("graphRadio");

   for(var i = 0; i < graphType.length; i++){
    if(graphType[i].checked){
      var graph = graphType[i].value;
    }
   }
  var barWidth = canvas.length / this.data.length;


  if(ctx){
    //if(DataProperties()){
      if (canvas && ctx) {
        if(graph == 'histogram'){
          Histogram(ctx, canvas, this.data, (canvas.height - 10), 10);
        }
        if(graph == 'bars'){
          BarChart(ctx, canvas, this.data, (canvas.height - 10), 10);
        }
        if(graph == 'lines'){
          LineChart(ctx, canvas, this.data, 50, (canvas.height - 10), 10);
        }
        if(graph == 'pie'){
          drawSegment(canvas, ctx);
        }
      }
    //}
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


function drawSegment(canvas, context) {
    var data = document.getElementById('inputedData').value;

    data = data.split(' ');
    var labels = data;
    data = data.sort(function(a, b){return b-a});

    total = data.reduce((a, b) => parseInt(a) + parseInt(b), 0);
  

    var centerX = Math.floor(canvas.width / 2);
    var centerY = Math.floor(canvas.height / 2);
    radius = Math.floor(canvas.width / 2);

    var startingAngle = degreesToRadians(sumTo(data, i));

    var arcSize = degreesToRadians(data[i]);
    
    var endingAngle = startingAngle + arcSize;

    
  for (var i = 0; i < data.length; i++) {
    context.fillStyle = colors[i];

    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, radius, 
                startingAngle, startingAngle+Math.PI*2*(data[i])/total, false);
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

   startingAngle += Math.PI*2*(data[i]/total);
  }
  
   
}



function degreesToRadians(degrees) {
    return (degrees * Math.PI)/180;
}
function sumTo(a, i) {
    var sum = 0;

    for (var j = 0; j < i; j++) {
      sum += a[j];
    }
    return sum;
}



function drawSegmentLabel(canvas, context, i) {
   context.save();

    var data = document.getElementById('inputedData').value;

    data = data.split(' ');

    data = data.sort(function(a, b){return b-a});

    total = data.reduce((a, b) => parseInt(a) + parseInt(b), 0);

    var labels =  data;


   var x = Math.floor(canvas.width / 2);
   var y = Math.floor(canvas.height / 2);
   var angle = degreesToRadians(sumTo(data, i));

   context.translate(x, y);
   context.rotate(angle  -Math.PI*2*(data[i]));
   var dx = Math.floor(canvas.width * 0.5) - 10;
   var dy = Math.floor(canvas.height * 0.05);

   context.textAlign = "right";
   var fontSize = Math.floor(canvas.height / 30);
   context.font = fontSize + "pt Heveltica";
   context.fillStyle = "#333";
   context.fillText(labels[i], dx, dy);

   context.restore();
   
 
}

document.getElementById("plotInputedtData").addEventListener("click", GraphDisplay);