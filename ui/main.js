// console.log('Loaded!');

// var element = document.getElementById('main-text');
// element.innerHTML = "New Value";

//var img = document.getElementById('prof');
//var marginLeft = 0;

//function moveRight() {
//    marginLeft = marginLeft + 1;
//    img.style.marginLeft = marginLeft + 'px';
//}

//img.onclick = function() {
//    var interval = setInterval(moveRight, 50);
//};
var initrequest = new XMLHttpRequest();
request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
            var initcounter = request.responseText;
            var initspan = document.getElementById('count');
            initspan.innerHTML = initcounter.toString();
        }
    }
};
switch ((document.getElementById('heading').innerHTML).trim()) {
        case "Home Page":
              request.open('GET', 'http://krithiskkv.imad.hasura-app.io/initcounter1', true);
              break;
        case "My Favourite Authors":
              request.open('GET', 'http://krithiskkv.imad.hasura-app.io/initcounter2', true);
              break;
        case "Programming Experience":
              request.open('GET', 'http://krithiskkv.imad.hasura-app.io/initcounter3', true);
              break;
        case "Databases known":
              request.open('GET', 'http://krithiskkv.imad.hasura-app.io/initcounter4', true);
              break;
              
    }
    
    request.send(null);


var button = document.getElementById('counter');
button.onclick = function () {
//    console.log((document.getElementById('heading').innerHTML).trim());
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                var counter = request.responseText;
                var span = document.getElementById('count');
                span.innerHTML = initcounter.toString();
            }
        }
    };
    switch ((document.getElementById('heading').innerHTML).trim()) {
        case "Home Page":
              request.open('GET', 'http://krithiskkv.imad.hasura-app.io/counter1', true);
              break;
        case "My Favourite Authors":
              request.open('GET', 'http://krithiskkv.imad.hasura-app.io/counter2', true);
              break;
        case "Programming Experience":
              request.open('GET', 'http://krithiskkv.imad.hasura-app.io/counter3', true);
              break;
        case "Databases known":
              request.open('GET', 'http://krithiskkv.imad.hasura-app.io/counter4', true);
              break;
              
    }
    
    request.send(null);
};


var submit = document.getElementById('submit_btn');
submit.onclick = function() {
    // console.log(articleName);
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
              //var names = ['names1', 'names2', 'names3'];
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
    
    var nameInput = document.getElementById('name');
    var name = nameInput.value;

    switch ((document.getElementById('heading').innerHTML).trim()) {
        case "Home Page":
              request.open('GET', 'http://krithiskkv.imad.hasura-app.io/submit-name1?name=' + name, true);
              break;
        case "My Favourite Authors":
              request.open('GET', 'http://krithiskkv.imad.hasura-app.io/submit-name2?name=' + name, true);
              break;
        case "Programming Experience":
              request.open('GET', 'http://krithiskkv.imad.hasura-app.io/submit-name3?name=' + name, true);
              break;
        case "Databases known":
              request.open('GET', 'http://krithiskkv.imad.hasura-app.io/submit-name4?name=' + name, true);
              break;
              
    }
    
    request.send(null);

};



