// request the server for the current value of Likes counter and render the response 
var initrequest = new XMLHttpRequest();
initrequest.onreadystatechange = function() {
    if (initrequest.readyState === XMLHttpRequest.DONE) {
        if (initrequest.status === 200) {
            var initcounter = initrequest.responseText;
            var initspan = document.getElementById('count');
            initspan.innerHTML = initcounter.toString();
        }
    }
};
switch ((document.getElementById('heading').innerHTML).trim()) {
        case "Home Page":
              initrequest.open('GET', 'http://krithiskkv.imad.hasura-app.io/initcounter1', true);
              break;
        case "My favorite Authors":
              initrequest.open('GET', 'http://krithiskkv.imad.hasura-app.io/initcounter2', true);
              break;
        case "Programming Experience":
              initrequest.open('GET', 'http://krithiskkv.imad.hasura-app.io/initcounter3', true);
              break;
        case "Databases Known":
              initrequest.open('GET', 'http://krithiskkv.imad.hasura-app.io/initcounter4', true);
              break;
              
    }
    
initrequest.send(null);

// request server for the current comment list and render the comments
var initcommrequest = new XMLHttpRequest();
initcommrequest.onreadystatechange = function () {
    if (initcommrequest.readyState === XMLHttpRequest.DONE) {
    if (initcommrequest.status === 200) {
        var names = initcommrequest.responseText;
        names = JSON.parse(names);
        var list = '';
        for (var i=0;i<names.length;i++) {
          list += '<li>' + names[i] + '</li>';
        }
        var ul = document.getElementById('namelist');
        ul.innerHTML = list;
        }
    }
};
    
switch ((document.getElementById('heading').innerHTML).trim()) {
    case "Home Page":
      initcommrequest.open('GET', 'http://krithiskkv.imad.hasura-app.io/init-name1', true);
      break;
    case "My favorite Authors":
      initcommrequest.open('GET', 'http://krithiskkv.imad.hasura-app.io/init-name2', true);
      break;
    case "Programming Experience":
      initcommrequest.open('GET', 'http://krithiskkv.imad.hasura-app.io/init-name3', true);
      break;
    case "Databases Known":
      initcommrequest.open('GET', 'http://krithiskkv.imad.hasura-app.io/init-name4', true);
      break;
      
}
initcommrequest.send(null);


//on clicking Like button request server to increment Like counter and render the new Like counter
var button1 = document.getElementById('counter');
button1.onclick = function () {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                var counter = request.responseText;
                var span = document.getElementById('count');
                span.innerHTML = counter.toString();
            }
        }
    };
    switch ((document.getElementById('heading').innerHTML).trim()) {
        case "Home Page":
              request.open('GET', 'http://krithiskkv.imad.hasura-app.io/counter1', true);
              break;
        case "My favorite Authors":
              request.open('GET', 'http://krithiskkv.imad.hasura-app.io/counter2', true);
              break;
        case "Programming Experience":
              request.open('GET', 'http://krithiskkv.imad.hasura-app.io/counter3', true);
              break;
        case "Databases Known":
              request.open('GET', 'http://krithiskkv.imad.hasura-app.io/counter4', true);
              break;
              
    }
    
    request.send(null);
};

//add the entered comment in the comment box and display the updated comments list on clicking Submit button
var submit = document.getElementById('submit_btn');
submit.onclick = function() {
    var nameInput = document.getElementById('name');
    var name = nameInput.value;
    if (name > " ") {
        var request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                var names = request.responseText;
                names = JSON.parse(names);
                var list = '';
                for (var i=0;i<names.length;i++) {
                  list += '<li>' + names[i] + '</li>';
                }
                var ul = document.getElementById('namelist');
                ul.innerHTML = list;
                }
            }
        };
    
        document.getElementById('name').value="";
        switch ((document.getElementById('heading').innerHTML).trim()) {
            case "Home Page":
              request.open('GET', 'http://krithiskkv.imad.hasura-app.io/submit-name1?name=' + name, true);
              break;
            case "My favorite Authors":
              request.open('GET', 'http://krithiskkv.imad.hasura-app.io/submit-name2?name=' + name, true);
              break;
            case "Programming Experience":
              request.open('GET', 'http://krithiskkv.imad.hasura-app.io/submit-name3?name=' + name, true);
              break;
            case "Databases Known":
              request.open('GET', 'http://krithiskkv.imad.hasura-app.io/submit-name4?name=' + name, true);
              break;
              
        }
    request.send(null);
    }
};

var button2 = document.getElementById('Login');
button2.onclick = function () {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                var counter = request.responseText;
                var span = document.getElementById('count');
                span.innerHTML = counter.toString();
            }
        }
    };
    
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    request.open('POST', 'http://krithiskkv.imad.hasura-app.io/login', true);
    request.send(JSON.stringify({username : username, password: password}));
};

