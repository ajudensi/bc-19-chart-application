//require('bootstrap');
//require('papaparser');
var data = [10,20,30,40,50,60,70,80];
var labels = data;
var colors = ["#CD5C5C","#F08080","#FA8072", "#E9967A","#FFA07A", "#5785C2",
				"#5792C2","#579DC2","#57B2C2", "#FFDAB9", "#E6E6FA","#5fcf80",
				"9E2605", "#337ab7","#265a88","#4CAFB5","#075265", "#42b4d6"];

var col = [255, 87, 51];



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

function Histogram(context, data, startX, barWidth, chartHeight, markDataIncrementsIn){
	context.lineWidth = "1.0";
  var startY = 490;
  drawLine(context, startX, startY, startX, 30); 
  drawLine(context, startX, startY, 570, startY);     
  context.lineWidth = "0.0";
  var maxValue = 0;
  for (var i=0; i < data.length; i++) {
     var values = data[i];
    //var name = values[0];
    var height = parseInt((Math.max(values)));
    if(height < 350){
    	height = height + 150;
    }
    if (parseInt(height) > parseInt(maxValue)) maxValue = height;
  
    context.fillStyle = colors[i];
    drawRectangle(context,startX + (i * barWidth) + i,(chartHeight - height),barWidth,height,true);
  
    // Add the column title to the x-axis
    context.textAlign = "left";
    context.fillStyle = "#000";
    context.fillText(values, startX + (i * barWidth) + i + 10, chartHeight + 10, 200);   
  }
  // Add some data markers to the y-axis
  var numMarkers = Math.ceil(maxValue / markDataIncrementsIn);
  context.textAlign = "right";
  var markerValue = 0;
  for (var i=0; i < numMarkers; i++) {    
    context.fillText(markerValue, (startX - 5), (chartHeight - markerValue), 50);
    markerValue += markDataIncrementsIn;
  }
}

function BarChart(context, data, startX, barWidth, chartHeight, markDataIncrementsIn){
	context.lineWidth = "1.0";
  var startY = 490;
  drawLine(context, startX, startY, startX, 30); 
  drawLine(context, startX, startY, 570, startY);     
  context.lineWidth = "0.0";
  var maxValue = 0;
  for (var i=0; i < data.length; i++) {
     var values = data[i];
    //var name = values[0];
    var height = parseInt((Math.max(values)));
    if(height < 350){
    	height = height + 150;
    }
    if (parseInt(height) > parseInt(maxValue)) maxValue = height;
  
    // Write the data to the chart
    context.fillStyle = colors[i];
   	drawRectangle(context,startX + (i * barWidth) + i + 30,(chartHeight - height), barWidth, height,true);
  
    // Add the column title to the x-axis
    context.textAlign = "left";
    context.fillStyle = "#333";
    context.fillText(values, startX + (i * barWidth) + i + 40, chartHeight + 10, 200);

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
  
    // Write the data to the chart
    context.beginPath();
    
	context.moveTo(currX, canvas.height - height);
	context.lineTo(currX, 488);
	context.lineWidth = 5;
	context.lineCap = 'round';
	context.lineJoin = 'miter';
	context.strokeStyle = colors[i];
	context.stroke();

	
  
    // Add the column title to the x-axis
    context.textAlign = "left";
    context.fillStyle = "#333";
    context.fillText(height, currX - 10, chartHeight + 10, 200);
    context.fillText(data[i], currX - 10, chartHeight - 10, 200);

    if(data.length > 10){
    	currX += 20;
    } else if(data.length < 9) {
    	currX += 50;
    }
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





function GraphDisplay(data){
	var canvas = document.getElementById('ch-app-big-canvas');
	var ctx = canvas.getContext('2d');

	if(ctx && ctx){
		if(DataProperties(data)){
			var canvas = document.getElementById('ch-app-big-canvas');
			var ctx = canvas.getContext('2d');
			if (canvas && ctx) {
				//Histogram(ctx, data, 50, 50, (canvas.height - 10), 50);
				//BarChart(ctx, data, 50, 30, (canvas.height - 10), 50);
				LineChart(ctx, canvas, data, 50, (canvas.height - 10), 50);
				// for (var i = 0; i < data.length; i++) {
				//     drawSegment(canvas, ctx, i);
				// }


			}
		}
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


function drawSegment(canvas, context, i) {
    context.save();
    var centerX = Math.floor(canvas.width / 2);
    var centerY = Math.floor(canvas.height / 2);
    radius = Math.floor(canvas.width / 2);

    var startingAngle = degreesToRadians(sumTo(data, i));
    var arcSize = degreesToRadians(data[i]);
    var endingAngle = startingAngle + arcSize;

    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, radius, 
                startingAngle, endingAngle, false);
    context.closePath();

 

    context.fillStyle = colors[i];
    context.fill();

    context.restore();

    drawSegmentLabel(canvas, context, i);
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
   var x = Math.floor(canvas.width / 2);
   var y = Math.floor(canvas.height / 2);
   var angle = degreesToRadians(sumTo(data, i));

   context.translate(x, y);
   context.rotate(angle);
   var dx = Math.floor(canvas.width * 0.5) - 10;
   var dy = Math.floor(canvas.height * 0.05);

   context.textAlign = "right";
   var fontSize = Math.floor(canvas.height / 25);
   context.font = fontSize + "pt Helvetica";

   context.fillText(labels[i], dx, dy);

   context.restore();
}
















