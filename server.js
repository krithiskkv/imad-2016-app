var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
    user:'krithiskkv',
    database: 'krithiskkv',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var pool = new Pool(config);

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'RandomSecret',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }
}));

//fuction to create individual pages by injecting data specific to the pages into a template

function createTemplate (data) {

    var title = data.title;
    var heading = data.heading;
    var date = data.date;
    var content = data.content;
    var count = 0;
    var bgimage = data.bgimage;
    var cmntcnt = data.cmntcnt;
    var authorname = data.authorname;
    
    var htmlTemplate = `<html>
        <head>
            <title>
                ${title} 
            </title>
            <meta name = "viewport" content = "width=device-width, initial-scale=1" />
            <link href="/ui/style.css" rel="stylesheet" />
        </head>
        <body>
            <h3 id="top">Krithika's BlogApp</h3>
            <div id="header"> 
                    <div id="articles">
                        <ul id="nav-bar">
                            <li class="dropdown"> 
                                <a href="/" >Home</a>  
                            </li>
                            <li class="dropdown"> 
                                <a href="#" class="dropbtn">Personal Interests</a>  
                                <div id="PersList" class="dropdown-content"></div>
                            </li>
                            <li class="dropdown"> 
                                <a href="#" class="dropbtn">Professional Interests</a>  
                                <div id ="ProfList" class="dropdown-content"></div>
                            </li>
                            <li id="post_btn" class="dropdown"> 
                            </li>
                            <li class="dropdown" id="login"> 
                                <a href="#" class="dropbtn" id="loginbtn">            </a>  
                                <div id ="loginarea" class="dropdown-content"></div>
                            </li>
                        </ul>           
                    </div>                
            </div>
            <img src=${bgimage} style=width:1250px;height:300px></img>
            <div class="container">
                <h3 id="heading" class="center">
                    ${heading}
                </h3>
            
                <div>
                    <pre> by ${authorname} ${date.toDateString()} </pre>
                </div>
                
                </br>
                
                <div>
                    <hr/>
                    <a href="https://twitter.com/intent/tweet?screen_name=krithiskkv" class="twitter-mention-button" data-text=" " data-show-count="false">Tweet</a><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
                    <a target="_blank" href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=krithiskkv@gmail.com&body=Hi Krithika"><img src="/ui/Gmail.png" width="30" height="30" alt="Mail to krithiskkv@gmail.com" style="vertical-align:middle;" border="0"></a>
                    <a target="_blank" href="https://in.linkedin.com/pub/krithika-subramanian/131/a95/821" style="text-decoration:none;"><span style="font: 80% Arial,sans-serif; color:#0783B6;"><img src="/ui/linkedin.png" width="30" height="30" alt="View Krithika Subramanian's LinkedIn profile" style="vertical-align:middle;" border="0">&nbsp;</span></a>
                    <a target="_blank" href="https://github.com/krithiskkv" style="text-decoration:none;"><span style="font: 80% Arial,sans-serif; color:#0783B6;"><img src="/ui/github.png" width="30" height="30" alt="View Krithika Subramanian's Github repo" style="vertical-align:middle;" border="0">&nbsp;</span></a>
                    <hr/>
                    <input id="counter" type="image" src="/ui/like.png" alt="Submit" width="50" height="20">
                    <span id="count">   </span> Likes
                    <input id="counter" type="image" src="/ui/comments.png" width="30" height="20">
                    <a id="cmntlink" href="#comments"> ${cmntcnt} comments </a>
                </div>
                <div>
                    ${content}
                </div>
                <div id="comments">  
                    <hr/>
                    <a href="#top"> Go To Top </a>
                    <br>
                    <h3> Comments </h3>
                    <div id="cmntInput"></div>
                    <ul id="commlist" style="width:750; height:250; overflow:auto"> </ul>
                </div>
                <script type="text/javascript" src="/ui/main.js"> </script>
                <script type="text/javascript" src="/ui/articles.js"> </script>
            </div>
        </body>
        </html>
        `;
        return htmlTemplate;
}

function hash(input, salt) {
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt,  hashed.toString('hex')].join('$');
}


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

//page for posting new article 
app.get('/post-article', function (req, res) {
    res.sendFile(path.join(__dirname,'ui', 'postarticle.html'));
});


app.get('/hash/:input', function(req, res) {
    var hashedString = hash(req.params.input, 'random-string' );
    res.send(hashedString); 
});

app.post('/create-user', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password, salt);
    pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function(err, result) {
        if (err) {
           res.status(500).send(err.toString()); }
        else {
             res.send('User successfully created' + username); }
        });
});

app.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    
    pool.query('SELECT * FROM "user" WHERE username = $1', [username], function(err, result) {
        if (err) {
           res.status(500).send(err.toString()); }
        else {
            if (result.rows.length === 0) {
                res.status(403).send('Username/passsword is invalid!');
            }
            else {
                var dbString = result.rows[0].password;
                var salt = dbString.split('$')[2];
                var hashedPwd = hash(password, salt);
                
                if (hashedPwd === dbString)
                   { req.session.auth = {userId: result.rows[0].id};
                     res.send(result.rows[0].username); }
                else
                    { res.status(403).send('Username/passsword is invalid!');}
            }    
        }
    });
});

app.get('/check-login', function(req, res) {
   if (req.session && req.session.auth && req.session.auth.userId ) {
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err,result) {
           if (err) {
               res.status(500).send('An error occured');
           }
           else {
               res.send(result.rows[0].username);
           }
       });
   }
   else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/logout', function(req,res) {
    delete req.session.auth;
    //res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
    res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/prof.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'prof.png'));
});

app.get('/ui/like.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'like.png'));
});


app.get('/ui/Gmail.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'Gmail.png'));
});

app.get('/ui/linkedin.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'linkedin.png'));
});

app.get('/ui/github.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'github.png'));
});

app.get('/ui/comments.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'comments.png'));
});

app.get('/ui/office.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'office.jpg'));
});


app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/post.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'post.js'));
});

app.get('/ui/articles.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'articles.js'));
});

app.get('/ui/background.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'background.png'));
});


app.get('/ui/office.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'office.jpg'));
});

app.get('/ui/books1.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'books1.jpg'));
});

app.get('/ui/mf.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'mf.png'));
});

app.get('/ui/dining1.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'dining1.jpg'));
});

app.get('/ui/ocjp6.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'ocjp6.png'));
});

app.get('/ui/defaultimg.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'defaultimg.png'));
});

app.get('/ui/submit.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'submit.png'));
});

app.get('/ui/resort.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'resort.png'));
});

app.get('/ui/imad.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'imad.png'));
});

// /initcounter/articleName obtains the current Likes counter for an article 

var counter = 0;
app.get('/initcounter/:articleName', function(req, res) {
    pool.query("SELECT likecount FROM article WHERE articlename = $1" , [req.params.articleName], function(err,result) {
        if (err) {
           res.status(500).send(err.toString()); }
        else {
             if (result.rows.length === 0) {
                res.status(404).send('Article not found'); }
             else {
                  counter = result.rows[0].likecount;
                  res.send(result.rows[0].likecount.toString()); }
              }
     });
});

// /counter increments the Likes counter for an article by 1
app.get('/counter/:articleName', function(req, res) {
    counter = counter + 1;
    pool.query("UPDATE article SET likecount = $2 WHERE articlename = $1", [req.params.articleName, counter], function(err,result) {
        if (err) {
           res.status(500).send(err.toString()); }
        else {
             res.send(counter.toString()); }
        });
});

// /initcmnt obtains the current list of comments for a page from the comment table

var commentsData = [];
app.get('/initcmnt/:articleName', function(req, res) {
    commentsData = [];
    pool.query("SELECT b.comment, b.user_name, b.date, a.cmntcnt FROM article AS a, comment AS b WHERE articlename = $1 AND article_id = id ORDER BY b.date DESC, b.time DESC", [req.params.articleName], function(err, result) {
        if (err) {
            res.status(500).send(err.toString()); }
        else { 
            if (result.rows.length === 0) {
                res.status(404).send('Article not found'); }
            else {
                var cmntlist = [];
                for (var i=0; i < result.rows.length; i++) {
                    commentsData.push(result.rows[i]); 
                }
                res.send(JSON.stringify(commentsData));
            }        
        }
    });
});

// /submit-cmnt adds the new comment into the comment list and comment table

var date = new Date();
var yyyy = date.getFullYear().toString();
var mm = (date.getMonth()+1).toString();
var dd  = date.getDate().toString();

var mmChars = mm.split('');
var ddChars = dd.split('');

var formatdate= yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);

var time = (("0" + date.getHours()).slice(-2)   + ":" + 
            ("0" + date.getMinutes()).slice(-2) + ":" + 
            ("0" + date.getSeconds()).slice(-2));
var datestring = formatdate.toString();
var timestring = time.toString();

app.post('/submit-cmnt/:articleName', function(req, res) {
    var comment = req.body.comment; 
    var username = req.body.username;
    
    var updtcmntcnt = 0;
    
    pool.query("SELECT id , cmntcnt FROM article WHERE articlename = $1" , [req.params.articleName], function(err,result) {
        if (err) {
           res.status(500).send(err.toString()); }
        else {
            if (result.rows.length === 0) {
                res.status(404).send('Article not found'); }
            else {
                var articleid = result.rows[0].id;
                updtcmntcnt   = result.rows[0].cmntcnt + 1;
                pool.query("UPDATE article SET cmntcnt = $2 WHERE id = $1" , [articleid, updtcmntcnt], function(err,result) {
                    if (err) {
                       res.status(500).send(err.toString()); }
                    else {
                            pool.query("INSERT INTO comment (article_id, comment, date, time, user_name) VALUES ($1, $2, $3, $4, $5)", [articleid, comment, datestring, timestring, username], function(err,result) {
                                if (err) { 
                                    res.status(500).send(err.toString());  }
                                else { 
                                    var commentData = {'comment' : comment, 'user_name': username, 'date': datestring, 'cmntcnt': updtcmntcnt};
                                    commentsData.unshift(commentData);
                                    res.send(JSON.stringify(commentsData)); }
                            });
                    }
                });
            } 
        }
    });
});

//get the list of all articles in a particular category
app.get('/get-articles/:category', function (req, res) {
      pool.query("SELECT * FROM article WHERE category=$1 AND aprv_ind IS TRUE ORDER BY date DESC", [req.params.category], function(err,result) {
        if (err) {
           res.status(500).send(err.toString());
        } else {
             if (result.rows.length === 0) {
                res.status(404).send('Article category not found');
            } else {
                    res.send(JSON.stringify(result.rows));
            }
        }
     }); 
});

//insert new article data into database
app.post('/submit-article', function (req, res) {
    if (req.body.imglink.trim() === '') {req.body.imglink = '/ui/defaultimg.png';}  
    pool.query("INSERT INTO article (title, content, author_id, authorname, category, articlename, heading, date, bgimage) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [req.body.title, req.body.content, req.session.auth.userId, req.body.authorname, req.body.category, req.body.shortname, req.body.heading, datestring, req.body.imglink], function(err,result) {
            if (err) {
               res.status(500).send(err.toString());
            } else 
            {
                res.send('Article data recorded successfully and will be posted after approval');
            }
    }); 
});

//select data needed to build the page requested from the database and render it using the createTemplate function
app.get('/articles/:articleName', function (req, res) {
      pool.query("SELECT * FROM article WHERE articlename=$1", [req.params.articleName], function(err,result) {
        if (err) {
           res.status(500).send(err.toString());
        } else {
             if (result.rows.length === 0) {
                res.status(404).send('Article not found');
            } else {
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
     }); 
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});