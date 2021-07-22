var getSelectedTab = (tab) => {
  var tabId = tab.id;
  var sendMessage = (messageObj) => chrome.tabs.sendMessage(tabId, messageObj);
  document.getElementById('start').addEventListener('click', () => {
    var name = document.getElementById("name");
    var studentID = document.getElementById("studentID");
    studentname=name.value;
    sendMessage({ action: 'START' , name: name.value, studentID: studentID.value});
  });
  document.getElementById('end').addEventListener('click', () => {
    sendMessage({ action: 'END'});
    window.close();
  });
  document.getElementById('end_rest').addEventListener('click', () => {
    sendMessage({ action: 'END'});
    window.close();
  });
  document.getElementById('exit').addEventListener('click', () => {
    sendMessage({ action: 'END' });
    window.close();
  });
  document.getElementById('reload').addEventListener('click', () => {
    chrome.runtime.reload();
  });
}
chrome.tabs.getSelected(null, getSelectedTab);


chrome.runtime.onMessage.addListener(  
  function(request, sender, sendResponse) {   
    if (request.msg === "sendtoPOPUP") {
      document.getElementById('loading').style.display='none';
      switch(request.data.isClassing){
        case 0:
          document.getElementById('loading').style.display='block';
          document.getElementById('is_classing').style.display='none';
          document.getElementById('not_classing').style.display='none';
          document.getElementById('not_start').style.display='none';
          document.getElementById('rest_time').style.display='none';
          break;
        case 1:
          //上課中
          document.getElementById('not_classing').style.display='none';
          document.getElementById('is_classing').style.display='block';
          document.getElementById('rest_time').style.display='none';
          document.getElementById('not_start').style.display='none';
          break;
        case 2:
          //開始上課
          document.getElementById('is_classing').style.display='none';
          document.getElementById('not_classing').style.display='block';
          document.getElementById('rest_time').style.display='none';
          document.getElementById('not_start').style.display='none';
          break;
        case 3:
          //未開始
          document.getElementById('is_classing').style.display='none';
          document.getElementById('not_classing').style.display='none';
          document.getElementById('rest_time').style.display='none';
          document.getElementById('not_start').style.display='block';
          break;
        case 4:
          //下課
          document.getElementById('is_classing').style.display='none';
          document.getElementById('not_classing').style.display='none';
          document.getElementById('not_start').style.display='none';
          document.getElementById('rest_time').style.display='block';
          break;
      }
    } 
});
