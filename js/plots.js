//Global variables
var oneTime = false;

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
   registerEventsP2();
   registerEventsP3();
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
    var thresholdDist, thresholdAngle, pointRadius, axisNameDist, unitNameDist, axisNameAngle, unitNameAngle, title;
    var sumDist = 0;
    var sumAngle = 0;


    title = processInput("#plot1-title",'Distance / Angle');
    thresholdDist = processInput("#plot1-thresholdDist", 5);
    thresholdAngle = processInput("#plot1-thresholdAngle",50);
    pointRadius = processInput("#plot1-radius",5);
    axisNameDist = processInput("#plot1-axisNameDist","Distance");
    unitNameDist = processInput("#plot1-unitNameDist","Å");
    axisNameAngle = processInput("#plot1-axisNameAngle","Angle");
    unitNameAngle = processInput("#plot1-unitNameAngle","º");

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
    var myChart1 = Highcharts.chart('d3-plot-dist-ang', {
         chart: {
            type: 'scatter',
            zoomType: 'xy',
            animation: true  
        },
        title: {
            text: title
        },
        xAxis: {
            title: {
                enabled: true,
                text: axisNameDist + " (" + unitNameDist + ")"
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true,
            max: thresholdDist
        },
        yAxis: {
            title: {
                text: axisNameAngle + " (" + unitNameAngle + ")"
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
                    headerFormat: 'Item: ',
                    pointFormat: '{point.x} '+unitNameDist+', {point.y} '+ unitNameAngle
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

function registerEventsP2(){
    //Register buttons
    $('#plot2-fd1').click(function(){
        $('#input-plot2-fd1').click();
    });
     $('#plot2-fd2').click(function(){
        $('#input-plot2-fd2').click();
    });
    $('#plot2-fa').click(function(){
        $('#input-plot2-fa').click();
    });
    $('#plot2-gp').click(function(){
        if(p2.distFile1.length > 1 && p2.distFile2.length > 1 && p2.angleFile.length > 1){
            generatePlot2();
        }
    });

    //input files
    $('#input-plot2-fd1').change(function(e){
        var file = e.target.files[0];
        readFileAndParseMatrix(file,function(matrix){
            p2.distFile1 = parseTextAsMatrix(matrix)
        })
    });
    $('#input-plot2-fd2').change(function(e){
        var file = e.target.files[0];
        readFileAndParseMatrix(file,function(matrix){
            p2.distFile2 = parseTextAsMatrix(matrix)
        })
    });
    $('#input-plot2-fa').change(function(e){
        var file = e.target.files[0];
        readFileAndParseMatrix(file,function(matrix){
            p2.angleFile = parseTextAsMatrix(matrix)
        })
    });
}

function generatePlot2  (){
    //https://www.highcharts.com/docs/getting-started/your-first-chart
    //Parse elements
    var dataset = [{
        name: 'Points',
        color: 'rgba(223, 83, 83, .5)',
        data: []
    }];
    var thresholdDist, thresholdAngle, pointRadius, axisNameDist, unitNameDist, axisNameAngle, unitNameAngle, title;
    var sumDist = 0;
    var sumAngle = 0;
    var maxXAxis = 0;

    title = processInput("#plot2-title",'Sum of Distances / Angle');
    thresholdDist = processInput("#plot2-thresholdDist",10);
    thresholdAngle = processInput("#plot2-thresholdAngle",50);
    pointRadius = processInput("#plot2-radius",5);
    axisNameDist = processInput("#plot2-axisNameDist","Distance");
    unitNameDist = processInput("#plot2-unitNameDist","Å");
    axisNameAngle = processInput("#plot2-axisNameAngle","Angle");
    unitNameAngle = processInput("#plot2-unitNameAngle","º");

    for(var i = 0; i < p2.distFile1.length; i++){
        var sumDistTemp = p2.distFile1[i][1] + p2.distFile2[i][1];
        if(p2.distFile1[i][1] <= thresholdDist && p2.distFile2[i][1] <= thresholdDist && p2.angleFile[i][1] <= thresholdAngle){
            if(maxXAxis < sumDistTemp){
                maxXAxis = sumDistTemp;
            }
            dataset[0].data.push([sumDistTemp,p2.angleFile[i][1]])
            sumDist = sumDist + sumDistTemp;
            sumAngle = sumAngle + p2.angleFile[i][1];
        }   
    }

    var count = dataset[0].data.length;
    var meanDist = sumDist / count;
    var meanAngle = sumAngle / count; 

    //Create chart
    var myChart2 = Highcharts.chart('d3-plot-distsum-ang', {
         chart: {
            type: 'scatter',
            zoomType: 'xy',
            animation: true  
        },
        title: {
            text: title
        },
        xAxis: {
            title: {
                enabled: true,
                text: axisNameDist + " (" + unitNameDist + ")"
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true,
            max: maxXAxis
        },
        yAxis: {
            title: {
                text: axisNameAngle + " (" + unitNameAngle + ")"
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
                tooltip: { //http://jsfiddle.net/TkMjZ/214/
                    headerFormat: 'Molecule: ',
                    pointFormat: '{point.x} '+unitNameDist+', {point.y} '+ unitNameAngle
                }
            }
         },
        series: dataset
    });

    //Results:
    $("#plot2-count").text("Count: " + count);
    $("#plot2-meanDist").text("Mean Distance: " + meanDist.toFixed(4));
    $("#plot2-meanAngle").text("Mean Angle: " + meanAngle.toFixed(4));
}

//Plot3

function registerEventsP3(){
    //Register buttons
    $('#plot3-fd1').click(function(){
        $('#input-plot3-fd1').click();
    });
     $('#plot3-fd2').click(function(){
        $('#input-plot3-fd2').click();
    });
    $('#plot3-fa').click(function(){
        $('#input-plot3-fa').click();
    });
    $('#plot3-gp').click(function(){
        if(p3.distFile1.length > 1 && p3.distFile2.length > 1 && p3.angleFile.length > 1){
            generatePlot3();
        }
    });

    //input files
    $('#input-plot3-fd1').change(function(e){
        var file = e.target.files[0];
        readFileAndParseMatrix(file,function(matrix){
            p3.distFile1 = parseTextAsMatrix(matrix)
        })
    });
    $('#input-plot3-fd2').change(function(e){
        var file = e.target.files[0];
        readFileAndParseMatrix(file,function(matrix){
            p3.distFile2 = parseTextAsMatrix(matrix)
        })
    });
    $('#input-plot3-fa').change(function(e){
        var file = e.target.files[0];
        readFileAndParseMatrix(file,function(matrix){
            p3.angleFile = parseTextAsMatrix(matrix)
        })
    });
}

function generatePlot3  (){
    //https://www.highcharts.com/docs/getting-started/your-first-chart
    //Parse elements
    var dataset = [{
        name: 'Points',
        colorByPoint: true,
        data: []
    }];
    var thresholdDist, thresholdAngle, pointRadius, axisNameDist, unitNameDist, axisNameAngle, unitNameAngle, title;
    var sumDist = 0;
    var sumAngle = 0;
    var maxXAxis = 0;

    title = processInput("#plot3-title",'Distances / Angle');
    thresholdDist = processInput("#plot3-thresholdDist",10);
    thresholdAngle = processInput("#plot3-thresholdAngle",30);
    pointRadius = processInput("#plot3-radius",5);
    axisNameDist = processInput("#plot3-axisNameDist","Distance");
    unitNameDist = processInput("#plot3-unitNameDist","Å");
    axisNameAngle = processInput("#plot3-axisNameAngle","Angle");
    unitNameAngle = processInput("#plot3-unitNameAngle","º");

    for(var i = 0; i < p3.distFile1.length; i++){
        var sumDistTemp = p3.distFile1[i][1] + p3.distFile2[i][1];
        if(p3.distFile1[i][1] <= thresholdDist && p3.distFile2[i][1] <= thresholdDist && p3.angleFile[i][1] <= thresholdAngle){
            dataset[0].data.push([p3.distFile1[i][1],p3.angleFile[i][1],p3.distFile2[i][1]])
            sumDist = sumDist + sumDistTemp;
            sumAngle = sumAngle + p3.angleFile[i][1];
        }   
    }

    var count = dataset[0].data.length;
    var meanDist = sumDist / count;
    var meanAngle = sumAngle / count; 

    if(!oneTime){
        // Give the points a 3D feel by adding a radial gradient
        Highcharts.getOptions().colors = $.map(Highcharts.getOptions().colors, function (color) {
            return {
                radialGradient: {
                    cx: 0.4,
                    cy: 0.3,
                    r: 0.5
                },
                stops: [
                    [0, color],
                    [1, Highcharts.Color(color).brighten(-0.2).get('rgb')]
                ]
            };
        });
        oneTime = true;
    }

    //Create chart
    var myChart3 = new Highcharts.Chart({
         chart: {
            animation: true,
            renderTo: 'd3-plot-dist-dist-ang',
            margin: 100,
            type: 'scatter',
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 30,
                depth: 250,
                viewDistance: 5,
                fitToPlot: false,
                frame: {
                    bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
                    back: { size: 1, color: 'rgba(0,0,0,0.04)' },
                    side: { size: 1, color: 'rgba(0,0,0,0.06)' }
                }
            }  
        },
        title: {
            text: title
        },
        subtitle: {
            text: 'Click and drag the plot area to rotate in space'
        },
        plotOptions: {
            scatter: {
                animation: true,
                width: thresholdDist,
                height: thresholdAngle,
                depth: thresholdDist
            }
        },
        xAxis: {
            title: {
                enabled: true,
                text: axisNameDist + " (" + unitNameDist + ")"
            },
            min: 0,
            max: thresholdDist
        },
        yAxis: {
            title: {
                text: axisNameAngle + " (" + unitNameAngle + ")"
            },
            min: 0,
            max: thresholdAngle
        },
        zAxis: {
            title: {
               text: axisNameDist + " (" + unitNameDist + ")"
            },
            min: 0,
            max: thresholdDist,
        },
         plotOptions: {
            scatter: {
                animation: true,
                marker: {
                    radius: pointRadius
                }
            }
         },
        series: dataset
    });

    //Results:
    $("#plot3-count").text("Count: " + count);
    $("#plot3-meanDist").text("Mean Distance: " + meanDist.toFixed(4));
    $("#plot3-meanAngle").text("Mean Angle: " + meanAngle.toFixed(4));

    // Add mouse events for rotation
    $(myChart3.container).on('mousedown.hc touchstart.hc', function (eStart) {
        eStart = myChart3.pointer.normalize(eStart);

        var posX = eStart.pageX,
            posY = eStart.pageY,
            alpha = myChart3.options.chart.options3d.alpha,
            beta = myChart3.options.chart.options3d.beta,
            newAlpha,
            newBeta,
            sensitivity = 5; // lower is more sensitive

        $(document).on({
            'mousemove.hc touchdrag.hc': function (e) {
                // Run beta
                newBeta = beta + (posX - e.pageX) / sensitivity;
                myChart3.options.chart.options3d.beta = newBeta;

                // Run alpha
                newAlpha = alpha + (e.pageY - posY) / sensitivity;
                myChart3.options.chart.options3d.alpha = newAlpha;

                myChart3.redraw(false);
            },
            'mouseup touchend': function () {
                $(document).off('.hc');
            }
        });
    });
}

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

function processInput(domId, defaultText){
    var item;
    if($(domId).val().trim().length === 0){
        item = defaultText;
    }else{
        item = $(domId).val();
    }
    return item;
}

