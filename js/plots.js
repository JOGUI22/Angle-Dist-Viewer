//Global variables
//Plot1
var p1 = {
    angleFile : null,
    distFile : null
}

//Plot2
var p2 = {
    angleFile : null,
    distFile1 : null,
    distFile2 : null
}

//Plot3
var p3 = {
    angleFile : null,
    distFile1 : null,
    distFile2 : null
}

$( document ).ready(function() {

   registerEventsP1();

});

//FUNCTIONS
function registerEventsP1(){
    //Register buttons
    $('#plot1-fd').click(function(){
        $('#input-plot1-fd').click();
    });
    $('#plot1-fa').click(function(){
        $('#input-plot1-fa').click();
    });
    $('#plot1-gp').click(function(){
        generatePlot1();
    });

    //input files
    $('#input-plot1-fd').change(function(e){
        var file = e.target.files[0];
        readFileAndParseAsMatrix(file,function(matrix){
            console.log(matrix);
        })
    });
    $('#input-plot1-fa').change(function(e){

    });
}

function generatePlot1(){
    //https://www.highcharts.com/docs/getting-started/your-first-chart
    var myChart = Highcharts.chart('d3-plot-dist-ang', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Fruit Consumption'
        },
        xAxis: {
            categories: ['Apples', 'Bananas', 'Oranges']
        },
        yAxis: {
            title: {
                text: 'Fruit eaten'
            }
        },
        series: [{
            name: 'Jane',
            data: [1, 0, 4]
        }, {
            name: 'John',
            data: [5, 7, 3]
        }]
    });
}

function readFileAndParseAsMatrix(file, cb){
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

