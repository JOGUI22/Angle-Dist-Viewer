//Global variables
//Plot1
var p1 = {
    distFile : null,
    angleFile : null
}

//Plot2
var p2 = {
    distFile1 : null,
    distFile2 : null,
    angleFile : null
}

//Plot3
var p3 = {
    distFile1 : null,
    distFile2 : null,
    angleFile : null
}

$( document ).ready(function() {

   registerEventsP1();

});

//FUNCTIONS

//Plot1
function registerEventsP1(){
    //Register buttons
    $('#plot1-fd').click(function(){
        $('#input-plot1-fd').click();
    });
    $('#plot1-fa').click(function(){
        $('#input-plot1-fa').click();
    });
    $('#plot1-gp').click(function(){
        if(p1.distFile.length > 1 && p1.angleFile.length > 1){
            generatePlot1();
        }
    });

    //input files
    $('#input-plot1-fd').change(function(e){
        var file = e.target.files[0];
        readFileAndParseMatrix(file,function(matrix){
            p1.distFile = parseTextAsMatrix(matrix)
        })
    });
    $('#input-plot1-fa').change(function(e){
        var file = e.target.files[0];
        readFileAndParseMatrix(file,function(matrix){
            p1.angleFile = parseTextAsMatrix(matrix)
        })
    });
}

function generatePlot1(){
    //https://www.highcharts.com/docs/getting-started/your-first-chart
    //Parse elements
    var dataset = [{
        name: 'Points',
        color: 'rgba(223, 83, 83, .5)',
        data: []
    }];
    var thresholdDist, thresholdAngle, pointRadius;
    var sumDist = 0;
    var sumAngle = 0;
    if($("#plot1-thresholdDist").val().trim().length === 0){
        thresholdDist = 5;
    }else{
        thresholdDist = $("#plot1-thresholdDist").val();
    }

    if($("#plot1-thresholdAngle").val().trim().length === 0){
        thresholdAngle = 30;
    }else{
        thresholdAngle = $("#plot1-thresholdAngle").val();
    }

    if($("#plot1-radius").val().trim().length === 0){
        pointRadius = 5;
    }else{
        pointRadius = $("#plot1-radius").val();
    }

    for(var i = 0; i < p1.distFile.length; i++){
        if(p1.distFile[i][1] <= thresholdDist && p1.angleFile[i][1] <= thresholdAngle){
            dataset[0].data.push([p1.distFile[i][1],p1.angleFile[i][1]])
            sumDist = sumDist + p1.distFile[i][1];
            sumAngle = sumAngle + p1.angleFile[i][1];
        }   
    }

    var count = dataset[0].data.length;
    var meanDist = sumDist / count;
    var meanAngle = sumAngle / count; 
    

    //Create chart
    var myChart = Highcharts.chart('d3-plot-dist-ang', {
         chart: {
            type: 'scatter',
            zoomType: 'xy',
            animation: true  
        },
        title: {
            text: 'Distance / Angle'
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'Distance (mm)'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true,
            max: thresholdDist
        },
        yAxis: {
            title: {
                text: 'Angle (º)'
            },
            max: thresholdAngle
        },
         plotOptions: {
            scatter: {
                animation: true,
                marker: {
                    radius: pointRadius,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: 'Molecule: ',
                    pointFormat: '{point.x} mm, {point.y} º'
                }
            }
         },
        series: dataset
    });

    //Results:
    $("#plot1-count").text("Count: " + count);
    $("#plot1-meanDist").text("Mean Distance: " + meanDist.toFixed(4));
    $("#plot1-meanAngle").text("Mean Angle: " + meanAngle.toFixed(4));
}

//Plot2

//Plot3

//-- Utils

function readFileAndParseMatrix(file, cb){
    if(!file){
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;
        cb(contents);
    };
    reader.readAsText(file);
}

//Pre: String composed of lines of 2 words: frame value \n frame value \n frame value...
//Post: [[frame,value],[frame,value],...]
function parseTextAsMatrix(text){
    var result = [];
    var splitNewLines = text.split(/\n/);
    
    for(var i = 0; i < splitNewLines.length; i++){
        if(i != 0){ //we dont want the header, first line
            var pair = splitNewLines[i];
            pair = pair.replace(/\s\s+/g, ' ').trim().split(' ');
            result.push([parseFloat(pair[0]),parseFloat(pair[1])]);
        }
    }
    return result;
}

