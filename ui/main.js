//as soon as the home page is loaded check to see if the user is logged in and build login/logout area accodingly
checkLogin();
loadPersArticles();
loadProfArticles();

function checkLogin() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                buildLogout(this.responseText);
            }
            else {
                buildLogin();
            }
        }
    };
    request.open('GET', 'http://krithiskkv.imad.hasura-app.io/check-login', true);
    request.send(null);
}

function loadPersArticles() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var articles = document.getElementById('Personal');
            if (request.status === 200) {
                var content = '<ul>';
                var articleData = JSON.parse(this.responseText);
                for (var i=0; i< articleData.length; i++) {
                    content += `<li>
                    <a href="/articles/${articleData[i].articlename}">${articleData[i].heading}</a>
                    (${articleData[i].date})</li>`;
                }
                content += "</ul>";
                articles.innerHTML = content;
            } else {
                articles.innerHTML('Oops! Could not load all articles!');
            }
        }
};
    
    request.open('GET', '/get-articles/Personal', true);
    request.send(null);
}

function loadProfArticles() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var articles = document.getElementById('Professional');
            if (request.status === 200) {
                var content = '<ul>';
                var articleData = JSON.parse(this.responseText);
                for (var i=0; i< articleData.length; i++) {
                    content += `<li>
                    <a href="/articles/${articleData[i].articlename}">${articleData[i].heading}</a>
                    (${articleData[i].date})</li>`;
                }
                content += "</ul>";
                articles.innerHTML = content;
            } else {
                articles.innerHTML('Oops! Could not load all articles!');
            }
        }
};
    
    request.open('GET', '/get-articles/Professional', true);
    request.send(null);
}

//build login/registration form
function buildLogin() {
    var loginarea = document.getElementById('Login/Logout');
    loginarea.innerHTML = `<input type=text id = username placeholder=username /> <input type=password id = password placeholder = password /> Existing user? <button id=Login>Login</button> New user? <button id=Register>Register</button>`;
    var button2 = document.getElementById('Login');
    button2.onclick = function () {
        var request = new XMLHttpRequest();
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        if (username > ' ' && password > ' ') {
            request.onreadystatechange = function() {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status === 200) {
                        alert('Login successful');
                        buildLogout(username);
                    }
                    else if (request.status === 403) {
                            alert('Username/password does not exist');
                            document.getElementById('username').value = '';
                            document.getElementById('password').value = '';
                    }
                    else if (request.status === 500) {
                        alert('An error occured');
                        document.getElementById('username').value = '';
                        document.getElementById('password').value = '';
                    }
                }
            };
            request.open('POST', 'http://krithiskkv.imad.hasura-app.io/login', true);
            request.setRequestHeader('Content-Type','application/json');
            request.send(JSON.stringify({username : username, password: password}));
        }
        else {
            alert('Username/password cannot be blank');
        }
    };

    var button3 = document.getElementById('Register');
    button3.onclick = function () {
        var request = new XMLHttpRequest();
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        if (username > ' ' && password > ' ') {
            request.onreadystatechange = function() {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status === 200) {
                        alert('User ' + username + ' created successfully. You can now login.');
                    }
                    else if (request.status === 500) {
                        alert('An error occured');
                        document.getElementById('username').value = '';
                        document.getElementById('password').value = '';
                    }
                }
            };
            request.open('POST', 'http://krithiskkv.imad.hasura-app.io/create-user', true);
            request.setRequestHeader('Content-Type','application/json');
            request.send(JSON.stringify({username : username, password: password}));
        }
        else {
            alert('Username/password cannot be blank');
        }
    };
}

//build logout form
function buildLogout(username) {
    var loginarea = document.getElementById('Login/Logout');
    loginarea.innerHTML = `<h3>Welcome </h3> <i>${username}</i> 
                            <a href="/logout">Logout</a>`;
    //var displayname = document.getElementById('name');
    //displayname.innerHTML = username;
}




