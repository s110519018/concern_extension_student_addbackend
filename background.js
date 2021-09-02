// var rules ="["+
//         "["+
//             '"https://meet.google.com/", '+
//             "["+
//                 '["script-src", "script-src https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/ https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/ https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/ https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/ https://script.google.com/ https://script.googleusercontent.com/a/macros/grad.ntue.edu.tw/ https://concern-backendserver.herokuapp.com/api/student/"]'+
//             "]"+
//         "]"+
// "]"


function dropCommentsAndWhitespace(s) {
    var r = "";
    var lines = s.match(/[^\r\n]+/g) || [];
    lines.forEach(function(line) {
        if (line.match(/^\s*#/) !== null ||
            line.match(/^\s*$/) !== null) {
            return;
        }
        r += line + "\n";
    });
    return r;
}

function parseRules(config) {
    config = dropCommentsAndWhitespace(config);
    if (config === "") {
        return [];
    }
    try {
        return JSON.parse(config);
    } catch (_) {
        return null;
    }
}

function validateRules(rules) {
    if (!Array.isArray(rules)) {
        return null;
    }
    var fail = false;
    rules.forEach(function(rule) {
        if (rule.length !== 2 ||
            typeof rule[0] !== "string" ||
            !Array.isArray(rule[1])) {
            fail = true;
            return null;
        }
        rule[1].forEach(function(subrule) {
            if (subrule.length !== 2 ||
                typeof subrule[0] !== "string" ||
                typeof subrule[1] !== "string") {
                fail = true;
                return null;
            }
        });
        if (fail) {
            return null;
        }
    });
    if (fail) {
        return null;
    }
    return rules;
}

function regexpifyRules(newRules) {
    if (newRules === null) {
        return null;
    }
    return newRules.map(function(rule) {
        return [
            new RegExp(rule[0]),
            rule[1].map(function(subrule) {
                return [
                    new RegExp(subrule[0]),
                    subrule[1]
                ];
            })
        ];
    });
}

function processConfig(config) {
    if (typeof config !== "string") {
        config = "";
    }
    return regexpifyRules(validateRules(parseRules(config)));
}


function requestProcessor(details) {
    var rules = processConfig("["+
        "["+
            '"https://meet.google.com/", '+
            "["+
                '["script-src", "script-src https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/ https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/ https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/ https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/ https://script.google.com/ https://script.googleusercontent.com/a/macros/grad.ntue.edu.tw/ https://concern-backendserver.herokuapp.com/api/student/"]'+
            "]"+
        "]"+
    "]");
    console.log(rules);
    for (var i = 0, iLen = rules.length; i !== iLen; ++i) {
        if (!rules[i][0].test(details.url)) {
            continue;
        }
        var subrules = rules[i][1];
        var headers = details.responseHeaders;
        for (var j = 0, jLen = headers.length; j !== jLen; ++j) {
            var header = headers[j];
            var name = header.name.toLowerCase();
            if (name !== "content-security-policy" &&
                name !== "content-security-policy-report-only" &&
                name !== "x-webkit-csp") {
                continue;
            }
            for (var k = 0, kLen = subrules.length; k !== kLen; ++k) {
                header.value = header.value.replace(subrules[k][0],
                                                    subrules[k][1]);
            }
        }
        return {responseHeaders: headers};
    }
}

chrome.webRequest.onHeadersReceived.addListener(requestProcessor, {
    urls: ["*://*/*"],
    types: ["main_frame", "sub_frame"]
}, ["blocking", "responseHeaders"]);




var isClassing=2;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.msg === "createWindow") {
        chrome.windows.create({
        url: "chart.html?classroomDataID=" + request.data.classroomDataID+"&studentID="+request.data.studentID+"&timeSpacing="+request.data.timeSpacing,
        type: "popup",
        width: 1000,
        height: 800,
        }, function (newWindow) {
            console.log(newWindow);
        });
        console.log(request.data.classroomDataID+request.data.studentID+request.data.timeSpacing);
    }
    else{
        console.log(request.isClassing);
        isClassing=request.isClassing;
    }
});

window.setInterval(function(){
    chrome.runtime.sendMessage({
        msg: "sendtoPOPUP", 
        data: {
            isClassing: isClassing,
        }
    }); 
}, 500);