//google Meet執行相關
var camera_utils_script = document.createElement('script');
camera_utils_script.setAttribute('src','https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
camera_utils_script.setAttribute('crossorigin','anonymous');
document.head.appendChild(camera_utils_script);

var control_utils_script = document.createElement('script');
control_utils_script.setAttribute('src','https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js');
control_utils_script.setAttribute('crossorigin','anonymous');
document.head.appendChild(control_utils_script);

var drawing_utils_script = document.createElement('script');
drawing_utils_script.setAttribute('src','https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js');
drawing_utils_script.setAttribute('crossorigin','anonymous');
document.head.appendChild(drawing_utils_script);

var face_mesh_script = document.createElement('script');
face_mesh_script.setAttribute('src','https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js');
face_mesh_script.setAttribute('crossorigin','anonymous');
document.head.appendChild(face_mesh_script);

var axios = document.createElement('script');
axios.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js');
axios.setAttribute('crossorigin','anonymous');
document.head.appendChild(axios);


var jquery = document.createElement('script');
jquery.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js');
jquery.setAttribute('crossorigin','anonymous');
document.head.appendChild(jquery);

var socket = document.createElement('script');
socket.setAttribute('src','https://cdn.socket.io/3.1.3/socket.io.min.js');
socket.setAttribute('integrity','sha384-cPwlPLvBTa3sKAgddT6krw0cJat7egBga3DJepJyrLl4Q9/5WLra3rrnMcyTyOnh');
socket.setAttribute('crossorigin','anonymous');
document.head.appendChild(socket);

var body=document.getElementsByTagName('body')[0];

var alert_html = document.createElement('div');
alert_html.innerHTML=`
<div id="alert" class="alert">
  <img src="https://i.imgur.com/X0GLypw.png" alt="" class="alert_img">
  <p class="alert_p">不專心警示！</p>
  <button id="hide" class="alert_btn">了解</button>
</div>
<audio id="alertAudio" controls loop>
  <source src="https://soundbible.com/mp3/School_Fire_Alarm-Cullen_Card-202875844.mp3" type="audio/ogg">
  <source src="https://soundbible.com/mp3/School_Fire_Alarm-Cullen_Card-202875844.mp3" type="audio/mpeg">
</audio>
<div id="rollcall_div">
    <h2 id="rollcall_title"></h2>
    <button id="attend_btn">簽到</button>
    <button id="rollcall_close_btn">X</button>
    <h2 id="rollcall_content"></h2>
    <h2 id="rollcall_error"></h2>
</div>
<div id="resttime_div">
    下課中
</div>
`;

var alert_css = document.createElement("style");
alert_css.innerHTML =`.alert{ 
  z-index:150; 
  position: fixed; 
  top: 50%;
  left: 50%;
  margin-top:-175px; /*上方邊界*/
  margin-left:-300px; /*左方邊界*/
  width: 600px;
  height: 350px;
  background-color: rgba(243, 43, 16, 0.65);  
  border-radius: 10px;
  transform: scale(0);  
  opacity:0;  
  transform-origin: center center;
  text-align: center;
}
.alert_img{
    margin-top: 10px;
}
.alert_p{
    font-family: Noto Sans TC;
    font-weight: normal;
    font-size: 55px;
    line-height: 29px;
    text-align: center;
    color: #FFFFFF;
    margin-top: 30px;
}
.alert_btn{
    background: #F9D505;
    border-radius: 10px;
    border:0;
    border-radius: 100px;
    font-weight: bold;
    padding: 6px 20px;
    outline: 0;
    cursor: pointer;
    font-size: 25px;
}
.alert_btn:hover{
    background-color: #000;
    color: #A0E557;
}
.show{  
    -webkit-transition: 0.2s;  
    -moz-transition: 0.2s; 
    -ms-transition: 0.2s; 
    -o-transition: 0.2s;  
    transition: 0.2s;  
    opacity:1;  
    transform: scale(1)  !important;
}
.hide{  
    opacity:0;
    transform: scale(0)  !important;
}
#rollcall_div{ 
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  z-index:150; 
  position: fixed; 
  top:50%;
  left: 50%;
  margin-top:-175px; /*上方邊界*/
  margin-left:-300px; /*左方邊界*/
  width: 600px;
  height: 350px;
  background-color: rgba(255, 255, 255, 0.92);  
  border-radius: 10px;
  transform-origin: center center;
  text-align: center;
  font-family: Noto Sans TC;
}
#rollcall_title{
  font-weight: bold;
  color: #000000;
  font-size: 55px;
  margin-top: 30px;
}
#rollcall_content{
  font-weight: normal;
  font-size: 30px;
  color: #747474;
}
#rollcall_error{
  font-weight: normal;
  font-size: 20px;
  color: red;
}
#attend_btn{
  background: #82A098;
  border-radius: 10px;
  border:0;
  border-radius: 100px;
  font-weight: bold;
  padding: 6px 20px;
  outline: 0;
  cursor: pointer;
  color: #FFFFFF;
  font-size: 25px;
}
#attend_btn:active{
  background-color: #fff;
  color: #82A098;
}
#attend_btn:disabled{
  background: #c9dfd9;
  cursor: auto;
}
#rollcall_close_btn{
  position: absolute;
  right:20px;
  top:20px;
  width: 2rem;
  height: 2rem;
  border-radius: 15rem;
  border: none;
  background-color: #f07974;
  color: #fff;
  cursor: pointer;
}

#resttime_div{ 
  z-index:150; 
  position: fixed; 
  top: 0;
  left: 0;
  width: 100px;
  background-color: rgba(255, 255, 255, 0.65);  
  transform-origin: center center;
  text-align: center;
  font-family: Noto Sans TC;
  font-weight: bold;
  color: #000000;
  font-size: 20px;
  line-height:60px;
}

`;
var newCanvas = document.createElement('canvas');
newCanvas.setAttribute("id", "newCanvas");
var insert_script = document.createElement("script");
insert_script.innerHTML =
`   var name_meet;
    var googlemeetname_meet;
    var studentID_meet;
    var isClassing_meet; //老師有沒有開啟教室
    var classroomDataID_meet;
    var indexInList_meet;
    var class_start=false;//課堂有沒有開始
    var rest_time=false;
    var setTimeout_send;
    var setTimeout_showTime;
    var getStudent_data_loop;
    let serverURL = "https://concern-backend-202106.herokuapp.com";
    var rollcallIndex;

    var newCanvas = document.getElementById("newCanvas");
    var context = newCanvas.getContext("2d");
    var video;

    var eyes_criticalRatio = 0.8, mouth_criticalRatio = 1.2;
    var eyes_average = 0, mouth_average = 0;
    var concernValue = 0.5;

    var student_everyone=document.querySelectorAll(".YBp7jf.Sjj3qd");

    window.addEventListener("message",function(me) {  
      switch(me.data.msg){
        case "start_class":
          name_meet=me.data.data.name;
          googlemeetname_meet=me.data.data.GoogleMeetname;
          studentID_meet=me.data.data.studentID;
          isClassing_meet=me.data.data.isClassing_post;
          classroomDataID_meet=me.data.data.classroomDataID;
          indexInList_meet=me.data.data.indexInList;
          window.postMessage({status: 000});
          console.log("上課學生姓名: " +name_meet+"學號: "+studentID_meet+"google meet名稱: "+googlemeetname_meet);
          console.log("教室狀態: "+isClassing_meet+"教室ID: "+classroomDataID_meet+"順序: "+indexInList_meet);
          getStudent_data_loop=setTimeout(getStudent_data,500);  
          document.getElementById("resttime_div").style.display = "none";
          socket_Rollcall();  
          break;
        case "end_class":
          isClassing_meet=me.data.data.isClassing_post;
          console.log("是否上課: " +isClassing_meet);
          hide();
          break;
      }
    });

    function socket_Rollcall(){
      // client 與 server 建立連線
      const socket = io.connect(serverURL, { transports: ["websocket"] });
      //client 進入指定房間
      socket.emit("joinRoom", classroomDataID_meet);

      $(document).ready(() => {
      
        var rollcall_interval;
        var closerollcallwindow;
        var closerollcallwindow_time;
        $("#rollcall_div").hide();
        $("#resttime_div").hide();

        socket.on("rollcallStart", function (data) {
          RollcallStart(data);
        });
    
        $("#rollcall_close_btn").click(function(e){
          e.preventDefault();
          $("#rollcall_div").hide();
        });

        $("#attend_btn").click(function(e){
          e.preventDefault();
          ClickAttendBtn();
        });
    
        RollcallStart = (data) => {
          rollcallIndex=data.rollcallIndex;
          $("#attend_btn").text("簽到");
          $("#rollcall_content").text("");
          $("#rollcall_error").text("");
          $("#rollcall_div").css('display', 'flex');
          $("#rollcall_close_btn").hide();
          $("#attend_btn").removeAttr('disabled');
          $("#rollcall_title").text("第" + (data.rollcallIndex+1) + "次點名");
          //開始倒數
          let timer = data.duration;
          rollcall_interval = setInterval(() => {
              $("#rollcall_content").text(timer);
              timer--;
              if (timer < 0){
                RollcallMiss();
              }
          }, 1000);
        };
    
        ClickAttendBtn = () => {
          // console.log(rollcallIndex);
          $('#attend_btn').attr('disabled', 'disabled');
          $("#attend_btn").text("傳送中...");
          //呼叫點名API
          $.ajax({
            type:"POST",
            contentType: 'application/json',
            dataType: "text",
            url: "https://concern-backend-202106.herokuapp.com/api/student/rollcall",
            data: JSON.stringify({
              "classroomDataID": classroomDataID_meet,
              "studentID": studentID_meet,
              "rollcallIndex": rollcallIndex
            }),
            success: function(data) {
              console.log(data);
              $('#attend_btn').attr('disabled', 'disabled');
              $("#attend_btn").text("簽到完成");
              $("#rollcall_close_btn").show();
              $("#rollcall_content").text("2秒後自動關閉視窗");
              $("#rollcall_error").text("");
              clearInterval(rollcall_interval);
              
              closerollcallwindow_time = 2;
              closerollcallwindow = setInterval(() => {
                //console.log("倒數"+closerollcallwindow_time+"秒關閉視窗");
                closerollcallwindow_time--;
                if (closerollcallwindow_time == 0){
                  $("#rollcall_div").hide();
                  clearInterval(closerollcallwindow);
                }
              }, 1000);

            },
            error: function(XMLHttpRequest){
              console.log(XMLHttpRequest.status+XMLHttpRequest.responseText);
              if(XMLHttpRequest.status==404){
                $("#rollcall_close_btn").show();
                $("#rollcall_error").text("無此教室資訊!"); 
              }
              else if(XMLHttpRequest.status==402){
                $("#rollcall_close_btn").show();
                $("#rollcall_error").text("教室無此學生資料!"); 
              }
              else if(XMLHttpRequest.status==403){
                $("#rollcall_close_btn").show();
                $("#rollcall_error").text("點名尚未開始!"); 
              }
              else if(XMLHttpRequest.status==500){
                //可能網路不好之類的
                $("#attend_btn").removeAttr('disabled');
                $("#attend_btn").text("簽到");
                $("#rollcall_error").text("簽到出現問題，請再試一次或將此畫面截圖回報老師");
              }
              
            }
          });
        };
        RollcallMiss = () => {
          $("#rollcall_close_btn").show();
          $('#attend_btn').attr('disabled', 'disabled');
          $("#rollcall_content").text("錯過簽到");
          clearInterval(rollcall_interval);
        };
      });
    }

    function getStudent_data(){
      clearTimeout(getStudent_data_loop);
      window.postMessage({status: 000});
      newCanvas = document.getElementById("newCanvas");
      context = newCanvas.getContext("2d");

      eyes_criticalRatio = 0.8, mouth_criticalRatio = 1.2;
      eyes_average = 0, mouth_average = 0;
      concernValue = 0.5;

      student_everyone=document.querySelectorAll(".YBp7jf.Sjj3qd");
      student_everyone.forEach(function(student){
          if(student.innerHTML=="你"){
            // console.log("student.parentElement"+student.parentElement.nextElementSibling.nextElementSibling.firstElementChild);
            if(student.parentElement.nextElementSibling.nextElementSibling.firstElementChild==null){
              // console.log("沒開鏡頭拉");
              if(document.querySelector(\'[aria-label="開啟攝影機 (Ctrl + E)"]\')!=null){
                document.querySelector(\'[aria-label="開啟攝影機 (Ctrl + E)"]\').click();
              }
              getStudent_data_loop=setTimeout(getStudent_data,500);
            }
            else{
              video = student.parentElement.nextElementSibling.nextElementSibling.firstElementChild;
              // console.log("video: "+video.getAttribute("data-uid"));
              video.parentElement.parentElement.style.boxSizing = "border-box";
              newCanvas.width = parseInt(video.parentElement.style.width);
              newCanvas.height = parseInt(video.parentElement.style.height);
              newCanvas.style.display="none";
              waitSeconds();
              setTimeout_send=setTimeout(send,100);
            }
          }
      });
    }

    function waitSeconds(){
      const camera = new Camera(video, {
        onFrame: async () => {
            await faceMesh.send({ image: video });
        },
        width: newCanvas.width,
        height: newCanvas.height
      });
      camera.start();
      const faceMesh = new FaceMesh({
        locateFile: (file) => {
            return \`https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/\${file}\`;
        }
      });
      faceMesh.setOptions({
          maxNumFaces: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
      });
      faceMesh.onResults(onResults);
    }

    function onResults(results) {
      context.save();
      context.clearRect(0, 0, newCanvas.width, newCanvas.height);
      context.drawImage(
          results.image, 0, 0, newCanvas.width, newCanvas.height);
      if (results.multiFaceLandmarks) {
          for (const landmarks of results.multiFaceLandmarks) {
              drawConnectors(context, landmarks, FACEMESH_TESSELATION, { color: "#C0C0C070", lineWidth: 1 });
              drawConnectors(context, landmarks, FACEMESH_RIGHT_EYE, { color: "#FF3030" });
              drawConnectors(context, landmarks, FACEMESH_RIGHT_EYEBROW, { color: "#FF3030" });
              drawConnectors(context, landmarks, FACEMESH_LEFT_EYE, { color: "#30FF30" });
              drawConnectors(context, landmarks, FACEMESH_LEFT_EYEBROW, { color: "#30FF30" });
              drawConnectors(context, landmarks, FACEMESH_FACE_OVAL, { color: "#E0E0E0" });
              drawConnectors(context, landmarks, FACEMESH_LIPS, { color: "#E0E0E0" });
          }
      }
      context.restore();
      if (results.multiFaceLandmarks.length > 0) {
          var righteye_ratio = CalcDotsDistance(results, 145, 159) / CalcDotsDistance(results, 33, 133);
          var lefteye_ratio = CalcDotsDistance(results, 374, 386) / CalcDotsDistance(results, 263, 362);
          var mouth_ratio = CalcDotsDistance(results, 13, 14) / CalcDotsDistance(results, 308, 78);
  
          Average_judgify(results, (righteye_ratio + lefteye_ratio) / 2, mouth_ratio);
          valueJudgment((righteye_ratio + lefteye_ratio) / 2, mouth_ratio);
      }
      else {
          // console.log("No Face");
          concernValue =0.0;
          AddBorderandStatus();
      }
    }

    function valueJudgment(value_eye, value_mouth) {
      value_eye = value_eye / eyes_average;
      value_mouth = value_mouth / mouth_average;
  
      valueJudgment2(value_eye, value_mouth);
    }
  
    var timer_eye = 0.0, timer_mouth = 0.0;
    var time_criticalValue = 3000;
    var isTimeCounting_eye = false, isTimeCounting_mouth = false;
    var overTimeLimit_eye = false, overTimeLimit_mouth = false;
    function valueJudgment2(value_eye, value_mouth) {
      if (value_eye >= eyes_criticalRatio) {
          isTimeCounting_eye = false;
          overTimeLimit_eye = false;
      }
      else if (value_eye < eyes_criticalRatio * eyes_average) {
          if (isTimeCounting_eye === false) {
              timer_eye = Date.now() + time_criticalValue;
              isTimeCounting_eye = true;
          }
          else {
              if (Date.now() > timer_eye) {
                  overTimeLimit_eye = true;
              }
          }
          if (overTimeLimit_eye === false) value_eye = eyes_criticalRatio;
      }
      if (value_mouth <= mouth_criticalRatio * mouth_average) {
          isTimeCounting_mouth = false;
          overTimeLimit_mouth = false;
      }
      else if (value_mouth > mouth_criticalRatio) {
          if (isTimeCounting_mouth === false) {
              timer_mouth = Date.now() + time_criticalValue;
              isTimeCounting_mouth = true;
          }
          else {
              if (Date.now() > timer_mouth) {
                  overTimeLimit_mouth = true;
              }
          }
          if (overTimeLimit_mouth === false) value_mouth = mouth_criticalRatio;
      }
      valueAverager(value_eye, value_mouth);
    }
    var calcFreq = 4;
    var valueCounter = 0; var eyes_sum = 0.0, mouth_sum = 0.0;
    function valueAverager(value_eyes, value_mouth) {

        valueCounter += 1;

        eyes_sum += value_eyes;
        mouth_sum += value_mouth;

        if (valueCounter >= calcFreq) {
            var eyes_value = eyes_sum / valueCounter;
            var mouth_value = mouth_sum / valueCounter;
            valueCounter = 0;
            eyes_sum = 0; mouth_sum = 0;

            valueCalculator(eyes_value, mouth_value);
        }
    }

    var weight_eyes = 0.7, weight_mouth = 0.3;
    function valueCalculator(value_eye, value_mouth) {
        concernValue = value_eye * weight_eyes + (2 - value_mouth) * weight_mouth;
        AddBorderandStatus();
    }

    function CalcDotsDistance(results, A, B) {
      var distance = Math.sqrt(Math.pow((results.multiFaceLandmarks[0][A].x - results.multiFaceLandmarks[0][B].x), 2) + Math.pow((results.multiFaceLandmarks[0][A].y - results.multiFaceLandmarks[0][B].y), 2));
      return distance;
    }

    var dataCount = 0;
    var dataMax = 50;
    var eyeDistance_average = 0;

    function Average_judgify(results, eyesValue, mouthValue) {
      if (dataCount < dataMax) {
          eyes_average = eyes_average * (dataCount / (dataCount + 1)) + eyesValue / (dataCount + 1);
          mouth_average = mouth_average * (dataCount / (dataCount + 1)) + mouthValue / (dataCount + 1);

          eyeDistance_average = eyeDistance_average  * (dataCount / (dataCount + 1)) + CalcDotsDistance(results, 243, 463) / (dataCount + 1);
          dataCount += 1;
      }
      else
      {
          var newEyeDistance = CalcDotsDistance(results, 243, 463);
          if(newEyeDistance < 0.85 * eyeDistance_average || newEyeDistance > 1.15 * eyeDistance_average)
          {
              dataCount = 0;
          }
      }
    }
  
    var setTime = 10;
    var t = setTime;
    var showTime_start=false;
    var alertShow=false;
    var alertAudio = document.getElementById("alertAudio");
    function AddBorderandStatus(){
      if(isClassing_meet&&!rest_time&&class_start){
        document.getElementById("resttime_div").style.display = "none";
        var color_str=concernValue;
        // console.log(color_str+video.getAttribute("data-uid"));
        if(color_str !="No Face"){
          if(color_str<0.5 || color_str==0.5){
            video.parentElement.parentElement.style.border="12px solid #FE5F55";
            if(!showTime_start){
              showTime();
            }
          }
          else if(color_str>0.5&&color_str<0.8){
            video.parentElement.parentElement.style.border="8px solid #ffff00";
            t = setTime;
            showTime_start=false;
            clearTimeout(setTimeout_showTime);
            hide();
          }
          else if(color_str>0.8 || color_str==0.8){
            video.parentElement.parentElement.style.border="8px solid #00CC66";
            t = setTime;
            showTime_start=false;
            clearTimeout(setTimeout_showTime);
            hide();
          }
        }
        else{
          video.parentElement.parentElement.style.border="12px solid #FE5F55";
          if(!showTime_start){
              showTime();
          }
        }
      }
      else{
        video.parentElement.parentElement.style.border="8px solid transparent";
        if(rest_time){
          document.getElementById("resttime_div").style.display = "block";
        }
        else{
          document.getElementById("resttime_div").style.display = "none";
        }
      }
    }

    function showTime(){
      if(!alertShow&&isClassing_meet&&!rest_time&&class_start){
        var today=new Date();
        if(concernValue =="No Face"||concernValue <0.5){
          showTime_start=true;
          t -= 1;
          console.log("%c%s", "color: green; background: yellow; font-size: 24px;",t+"  "+today.getSeconds());
          if(t==0)
          {
              console.log("%c%s", "color: green; background: yellow; font-size: 24px;","時間到"+t+"  "+today.getSeconds());
              show();
              t = setTime;
          }
          setTimeout_showTime=setTimeout("showTime()",1000);
        }
      }
    }


    function send(){
      if(isClassing_meet){
        clearTimeout(setTimeout_send);
        
        if(video.style.display=='none'){
          console.log("video被關囉");
          if(video.nextElementSibling!=null){
            if(video.nextElementSibling.style.display!='none'){
              //攝影機打開狀態
              video.nextElementSibling.style.display='none';
              if(document.querySelector(\'[aria-label="關閉攝影機 (Ctrl + E)"]\')!=null){
                document.querySelector(\'[aria-label="關閉攝影機 (Ctrl + E)"]\').click();
              }
              document.querySelector(\'[aria-label="開啟攝影機 (Ctrl + E)"]\').click();
            }
          }
          concernValue=0;
          AddBorderandStatus();
        }

        $.ajax({
          type:"PUT",
          url: "https://concern-backend-202106.herokuapp.com/api/student/upload",
          dataType: "text",
          data: {
            "classroomDataID": classroomDataID_meet,
            "indexInList": indexInList_meet,
            "concernDegree": concernValue,
          },
          success: function(status) {
              if(isClassing_meet){
                console.log(status);
                rest_time=false;
                class_start=true;
                document.getElementById("resttime_div").style.display = "none";
                window.postMessage({status: 201});
                setTimeout_send=setTimeout(send,500);
              }
          },
          error: function(XMLHttpRequest){
            if(isClassing_meet){
              console.log("error"+XMLHttpRequest.status+XMLHttpRequest.responseText);
              video.parentElement.parentElement.style.border="8px solid transparent";
              if(XMLHttpRequest.status === 404){
                isClassing_meet=false;
                rest_time=false;
                class_start=false;
                alert("沒有這間教室喔!");
                document.getElementById("resttime_div").style.display = "none";
              }
              else if(XMLHttpRequest.status === 401){
                //下課
                document.getElementById("resttime_div").style.display = "block";
                rest_time=true;
                class_start=true;
                setTimeout_send=setTimeout(send,1000);
              }
              else if(XMLHttpRequest.status === 400){
                //課程尚未開始
                rest_time=false;
                class_start=false;
                document.getElementById("resttime_div").style.display = "none";
                setTimeout_send=setTimeout(send,1000);
              }
              else if(XMLHttpRequest.status === 403){
                //無此學生，why?
                console.log("無此學生");
                setTimeout_send=setTimeout(send,1000);
                document.getElementById("resttime_div").style.display = "none";
              }
              else{
                rest_time=false;
                class_start=false;
                setTimeout_send=setTimeout(send,5000);
                document.getElementById("resttime_div").style.display = "none";
              }
              window.postMessage({status: XMLHttpRequest.status});
            }
          }
        });
      }
    }
    


    
    document.getElementById("hide").addEventListener("click", hide);
    function show(){
      console.log("%c%s", "color: green; background: yellow; font-size: 24px;","Alert!");
      alertShow=true;
      alertAudio.currentTime=0;
      alertAudio.play(); 
      document.getElementById("alert").classList.add("show");
      document.getElementById("alert").classList.remove("hide");
    }
    function hide(){
      alertAudio.pause();
      alertShow=false;
      showTime_start=false;
      document.getElementById("alert").classList.add("hide");
      document.getElementById("alert").classList.remove("show");
    }`;

//課程實施相關
var classroomDataID;
var studentname;
var studentGoogleMeetname;
var studentid;
var indexInList;
var tooltipClassname;
var callenterclass;
var endclass=false;//如果enterclass還沒success學生就離開教室就用這個讓他不要再進去迴圈跑enterclass了
var memberlist_open=false;//會議成員開過了沒ㄋ
const onMessage = (message) => {
  switch (message.action) {
    case 'START':
      start(message.name,message.studentID);
      break;
    case 'END':
      end();
      break; 
    default:
      break;
  }
}
chrome.runtime.onMessage.addListener(onMessage);
function start(name,studentID){
  if(name == '' || studentID == ''){
    alert("請填入名字和學號");
  }
  else{
    if(document.querySelector('.U26fgb.JRY2Pb.mUbCce.kpROve.GaONte.Qwoy0d.ediA8b.vzpHY.M9Bg4d')==null && document.querySelector('.VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.tWDL4c.jh0Tpd.Gt6sbf.QQrMi.ftJPW')==null){
      //還沒進入會議
      alert("請進入會議後再啟動!");
    }
    else{
      studentname=name;
      studentid=studentID;
      studentGoogleMeetname="";
      endclass=false;
      memberlist_open=false;
      chrome.runtime.sendMessage({isClassing:0});
      // console.log("開始上課按鈕按下");
      callenterclass=setTimeout(enterclass,500);
    }
  }  
}

function enterclass(){
  clearTimeout(callenterclass);
  if(studentGoogleMeetname==""){
    if(document.querySelectorAll(".QMC9Zd").length!=0){
      for (let element of document.querySelectorAll(".QMC9Zd")) {
        if (element.innerHTML === '(你)') {
            studentGoogleMeetname=element.previousSibling.innerHTML;
            console.log("Google meet名字"+studentGoogleMeetname);
        }
      }
    }
    else{
      //顯示會議成員按鈕
      document.querySelector('[aria-label="顯示所有參與者"]').click();
      for (let element of document.querySelectorAll(".QMC9Zd")) {
        // console.log("會議成員"+element.innerHTML);
        if (element.innerHTML === '(你)') {
            studentGoogleMeetname=element.previousSibling.innerHTML;
            console.log("Google meet名字"+studentGoogleMeetname);
        }
      }
    }
    callenterclass=setTimeout(enterclass,500);
  }
  else{
    enterclassropm_api();
  }
}

function enterclassropm_api(){
  if(document.querySelector('[aria-label="顯示所有參與者"]')!=null){
    if(document.querySelector('[aria-label="顯示所有參與者"]').getAttribute("aria-pressed")=="true"&&!memberlist_open){
      document.querySelector('[aria-label="顯示所有參與者"]').click();
      memberlist_open=true;
    }
  }
  chrome.runtime.sendMessage({isClassing:0});
  $.ajax({
    type:"POST",
    contentType: 'application/json',//傳送至伺服端資料型別
    dataType: 'json',//伺服器傳回來的型別
    url: "https://concern-backend-202106.herokuapp.com/api/student/enterClassroom",
    data: JSON.stringify({
      "classroomMeetID": window.location.pathname.substr(1),
      "studentName": studentname,
      "studentGoogleName": studentGoogleMeetname,
      "studentID": studentid
    }),
    //success 201 
    success: function(data) {
        console.log("成功"+data);
        classroomDataID=data.classroomDataID;
        indexInList=data.indexInList;
        body.appendChild(newCanvas);
        body.appendChild(alert_css);
        body.appendChild(alert_html);
        body.appendChild(insert_script);
        if(document.querySelector('.U26fgb.JRY2Pb.mUbCce.kpROve.GaONte.Qwoy0d.ediA8b.vzpHY.M9Bg4d')!=null){
          //舊版介面
          document.querySelector('.U26fgb.JRY2Pb.mUbCce.kpROve.GaONte.Qwoy0d.ediA8b.vzpHY.M9Bg4d').setAttribute('aria-disabled', true);
          document.querySelector('.U26fgb.JRY2Pb.mUbCce.kpROve.GaONte.Qwoy0d.ediA8b.vzpHY.M9Bg4d').setAttribute('data-tooltip', "請透過疫距數得結束課程");
          document.querySelector('.U26fgb.JRY2Pb.mUbCce.kpROve.GaONte.Qwoy0d.ediA8b.vzpHY.M9Bg4d').setAttribute('aria-label', "請透過疫距數得結束課程");
          document.querySelector('.U26fgb.JRY2Pb.mUbCce.kpROve.GaONte.Qwoy0d.ediA8b.vzpHY.M9Bg4d').style.background='#D0D0D0';
        }
        else if (document.querySelector('.VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.tWDL4c.jh0Tpd.Gt6sbf.QQrMi.ftJPW')!=null){
          //新版介面
          document.querySelector('.VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.tWDL4c.jh0Tpd.Gt6sbf.QQrMi.ftJPW').disabled=true;
          tooltipClassname=document.querySelector('[aria-label="退出通話"]').nextElementSibling.className;
          console.log(tooltipClassname);
          if(document.querySelector('[aria-label="退出通話"]').nextElementSibling.classList.contains(tooltipClassname)){
            document.querySelector('[aria-label="退出通話"]').nextElementSibling.classList.remove(tooltipClassname);
          }
          document.querySelector('[aria-label="退出通話"]').nextElementSibling.innerHTML="請透過疫距數得結束課程";
        }
        window.postMessage({msg: "start_class", data:{isClassing_post:true,name:studentname,GoogleMeetname:studentGoogleMeetname,studentID:studentid,classroomDataID:classroomDataID,indexInList:indexInList}});
    },
    error: function(XMLHttpRequest){
      if(!endclass){
        // console.log("error"+XMLHttpRequest.responseText);
        chrome.runtime.sendMessage({isClassing:3});
        callenterclass=setTimeout(enterclass,1000);
      }
      else{
        chrome.runtime.sendMessage({isClassing:2});
      }
    }
  });
}

function end(){
  // console.log("end"+studentname);
  alert_html.remove();
  alert_css.remove();
  if(document.querySelector('.U26fgb.JRY2Pb.mUbCce.kpROve.GaONte.Qwoy0d.ediA8b.vzpHY.M9Bg4d')!=null){
    //舊版介面
    document.querySelector('.U26fgb.JRY2Pb.mUbCce.kpROve.GaONte.Qwoy0d.ediA8b.vzpHY.M9Bg4d').setAttribute('aria-disabled', false);
    document.querySelector('.U26fgb.JRY2Pb.mUbCce.kpROve.GaONte.Qwoy0d.ediA8b.vzpHY.M9Bg4d').click();
  }
  else if (document.querySelector('.VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.tWDL4c.jh0Tpd.Gt6sbf.QQrMi.ftJPW')!=null){
    //新版介面
    document.querySelector('.VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.tWDL4c.jh0Tpd.Gt6sbf.QQrMi.ftJPW').disabled=false;
    document.querySelector('[aria-label="退出通話"]').nextElementSibling.className+=tooltipClassname;
    document.querySelector('.VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.tWDL4c.jh0Tpd.Gt6sbf.QQrMi.ftJPW').click();
  }
  window.postMessage({msg: "end_class", data:{isClassing_post:false}});
  chrome.runtime.sendMessage({isClassing:2});
  chrome.runtime.sendMessage({
    msg: 'createWindow',
    data:{
      classroomDataID: classroomDataID,
      studentID:studentid,
      timeSpacing: 60
    }
  });
  endclass=true;
}


window.addEventListener("message",function(me) {
  // console.log("學生端監聽me.data.status"+me.data.status);
  if(me.data.status==400){
    //未開始
    chrome.runtime.sendMessage({isClassing:3});
  }
  else if(me.data.status==201){
    //上課
    chrome.runtime.sendMessage({isClassing:1});
  }
  else if(me.data.status==401){
    //下課
    chrome.runtime.sendMessage({isClassing:4});
  }
  else if(me.data.status==000||me.data.status==500||me.data.status==403){
    //Loading 500網路太慢會回傳這個的樣子
    //403無此學生 目前還不知道原因所以先讓他loading給他再一次機會post
    chrome.runtime.sendMessage({isClassing:0});
  }
  else{
    //404，沒這間教室?
    chrome.runtime.sendMessage({isClassing:2});
  }
});








