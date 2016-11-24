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
            var articles = document.getElementById('PersList');
            if (request.status === 200) {
                //var content = '<ul>';
                var content = '';
                var articleData = JSON.parse(this.responseText);
                for (var i=0; i< articleData.length; i++) {
                //    content += `<li>
                    content += `<a href="/articles/${articleData[i].articlename}">${articleData[i].articlename}</a>`
                //    (${articleData[i].date.split('T')[0]})`;
                }
                //content += "</ul>";
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
            var articles = document.getElementById('ProfList');
            if (request.status === 200) {
                //var content = '<ul>';
                var content = '';
                var articleData = JSON.parse(this.responseText);
                for (var i=0; i< articleData.length; i++) {
                //    content += `<li>
                content += `<a href="/articles/${articleData[i].articlename}">${articleData[i].articlename}</a>`
                //    (${articleData[i].date.split('T')[0]})`;
                }
                //content += "</ul>";
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
    var loginbtn = document.getElementById('loginbtn');
    loginbtn.innerHTML = 'Login/Sign-up';
    var loginarea = document.getElementById('loginarea');
    loginarea.innerHTML = `<input type=text id = username placeholder=username /> 
                            <br/> 
                            <input type=password id = password placeholder = password /> 
                            <br/>
                            <small>Signed-up?</small>  <button id=Login>Sign-in</button>  
                            <br/>
                            <small>New user?</small> <button id=Register>Sign-up</button>`;
    var button2 = document.getElementById('Login');
    button2.onclick = function () {
        var request = new XMLHttpRequest();
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        if (username.trim().length > 0 && password.trim().length > 0) {
            request.onreadystatechange = function() {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status === 200) {
                        alert('Login successful');
                        location.reload();
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
        if (username.trim().length > 0 && password.trim().length > 0) {
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

function escapeHTML (text)
{
    var $text = document.createTextNode(text);
    var $div = document.createElement('div');
    $div.appendChild($text);
    return $div.innerHTML;
}

function buildLogout(username) { 
    var loginbtn = document.getElementById('loginbtn');
    loginbtn.innerHTML = 'Hi, ' + escapeHTML(username) + '<small>▼</small>';
    var loginarea = document.getElementById('loginarea');
    loginarea.innerHTML = '<a href="/logout" onclick="window.location.reload(true)">Logout</a>';
}




