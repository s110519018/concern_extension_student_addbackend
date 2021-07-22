var url = new URL(window.location.href);
var classroomDataID=url.searchParams.get('classroomDataID');
var studentID=url.searchParams.get('studentID');
var timeSpacing=url.searchParams.get('timeSpacing');
var personalchart;
var studentName;
console.log("classroomDataID: "+ classroomDataID);
console.log("studentID: " + studentID);
console.log("timeSpacing: " + timeSpacing);

var slider = document.getElementById("rangeInput");

try {
  slider.oninput = function() {
  var valPercent = (slider.valueAsNumber  - parseInt(slider.min)) / 
                      (parseInt(slider.max) - parseInt(slider.min));
    var style = 'background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop('+ valPercent+', #29907f), color-stop('+ valPercent+', #e3e3e4));';
    slider.style = style;
  }
  //按下去之後
  slider.addEventListener('change', function(){
    timeSpacing=slider.value*60;
    $('#loading').css('display', 'block');
    $('#download').css('display', 'none');
    personalchart.destroy();
    callstudentchartAPI();
  });
  
  // classroomDataID= "60e27b1e29b4000015939452";
  //     studentID= "110934002";
  if(classroomDataID!="undefined"&&studentID!="undefined"){
    //一開始先產生圖表
    callstudentchartAPI();
  }
  else{
    $('.container').css('display', 'none');
    $('#error').text('未有課程資訊');
    $('#error').css('display', 'block');
  }
} 
catch (error) {
  console.log(error);
  $('.container').css('display', 'none');
  $('#error').css('display', 'block');
}

function callstudentchartAPI(){
  $.ajax({
    type:"POST",
    contentType: 'application/json',
    dataType: "json",
    url: "https://concern-backend-202106.herokuapp.com/api/student/getPersonConcernDiagram",
    data: JSON.stringify({
      "classroomDataID":classroomDataID,
      "studentID": studentID,
      "timeSpacing": timeSpacing
    }),
    success: function (msg) {
        console.log(msg);
        studentName=msg.studentName;
        $('#attendTimePercentage').text(msg.attendTimePercentage);
        $('#concernPercentage').text(msg.concernPercentage);
        $('#aveConcern').text(msg.aveConcern);
        if(parseFloat(msg.aveConcern)>0.8 || parseFloat(msg.aveConcern)==0.8){
          $('#levelConcern').css('background-color', '#00CC66');
          $('#levelConcern').css('color', '#FEFFFE');
          $('#levelConcern').text("專心");
        }
        else if(parseFloat(msg.aveConcern)>0.5&&parseFloat(msg.aveConcern)<0.8){
          $('#levelConcern').css('background-color', '#ffff00');
          $('#levelConcern').css('color', '#666');
          $('#levelConcern').text("普通");
        }
        else if(parseFloat(msg.aveConcern)<0.5 || parseFloat(msg.aveConcern)==0.5){
          $('#levelConcern').css('background-color', '#FE5F55');
          $('#levelConcern').css('color', '#FEFFFE');
          $('#levelConcern').text("不專心");
        }
        // console.log(parseFloat(msg.aveConcern));
        $('#bestLasted').text(msg.bestLasted);
        drawChart(msg);
    },
    error: function(error){
      console.log(error);
      $('.container').css('display', 'none');
      $('#error').css('display', 'block');
    }
  });
}

function drawChart(results) {
    if(results==undefined){
        return
    }
    var json_data=results;
    var times = [];
    var concerns = [];
    var concernValues;
    for (var i = 0; i < json_data.timeLineArray.length; i++) {
        times.push(json_data.timeLineArray[i]);
        concernValues=null;
        if(json_data.concernDegreeArray[i]>0.8 || json_data.concernDegreeArray[i]==0.8)
          concernValues=1;
        else if (json_data.concernDegreeArray[i]<0.8&&json_data.concernDegreeArray[i]>0.5)
          concernValues=0.5;
        else if ((json_data.concernDegreeArray[i]<0.5 || json_data.concernDegreeArray[i]==0.5) &&json_data.concernDegreeArray[i]!=null)
          concernValues=0;
        concerns.push(concernValues);
    }
    $('#sayhello').text("你好， "+studentName+" 同學！");
    const data = {
      labels: times,
      datasets: [{
        label: studentName,
        backgroundColor: '#82A098',
        borderColor: '#82A098',
        data: concerns,
        fill: false,
        tension: 0.1
      }]
    };
    const config = {
      type: 'line',
      data,
      options: {
        scales: {
          x:{
            title: {
              display: true,
              text: '時間',
              font: {
                size: 18
              },
              color: '#82A098',
            }  
          },
          y: {
            title: {
              display: true,
              text: '專注度',
              font: {
                size: 18
              },
              color: '#82A098',
            },
            ticks: {
              callback: function(value) {
                if(value==1)
                  return '專心' ;
                else if (value==0.5)
                  return '普通' ;
                else if (value==0)
                  return '不專心' ;
              }
            },
            beginAtZero: true
          }
        },
        plugins: {
          title: {
              display: true,
              text: studentName+"的專注度變化歷程圖",
              align:'start',
              font: {
                size: 18,
              }
          },
          legend: {
            display: false,
            align: 'center',
            position: 'top',
            labels:{
              padding: 10
            }
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                  if(tooltipItem.parsed.y==1)
                  return '專心' ;
                else if (tooltipItem.parsed.y==0.5)
                  return '普通' ;
                else if (tooltipItem.parsed.y==0)
                  return '不專心' ;
              },
            }
          }
        },
        bezierCurve : false,
        animation: {
          onComplete: done
        }
      },
      plugins: [
        {
          id: 'custom_canvas_background_color',
          beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
          }
        } 
      ],
    };
    //繪製圖表
    personalchart = new Chart(
      document.getElementById("LineChart_values_personal").getContext("2d"),
      config
    ); 
    $('#loading').css('display', 'none');
    $('.slidecontainer').css('display', 'block');
    
}

function done(){
  html2canvas(document.querySelector(".img_container"),{
    scrollY: -window.pageYOffset,
    // x:window.pageXOffset,
    // y:window.pageYOffset,
    useCORS: true,
  }).then(function (canvas) {
    var imgUri = canvas.toDataURL("image/jpeg");
    $('#download').css('display', 'block');
    var a = document.getElementById("download");
    a.href = imgUri;
    a.download = studentName+"的專注度統計"; 
  });
}