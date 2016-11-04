var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
    user:'krithiskkv',
    database: 'krithiskkv',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));

//fuction to create individual pages by injecting data specific to the pages into a template

function createTemplate (data) {

            var title = data.title;
            var heading = data.heading;
            var date = data.date;
            var content = data.content;
            var count = 0;
            
            var htmlTemplate = `<html>
            <head>
                <title>
                    ${title} 
                </title>
                <meta name = "viewport" content = "width=device-width, initial-scale=1" />
                <link href="/ui/style.css" rel="stylesheet" />
            </head>
            <body>
                <div>
                    <a href="/">Home</a> 
                </div>
                <hr/>
                <div class="container">
                    <h3 id="heading">
                        ${heading}
                    </h3>
                
                    <div>
                        ${date.toDateString()}
                    </div>
                    <div>
                        ${content}
                    </div>
                    <div class="footer">  
                        <input id="counter" type="image" src="/ui/like.png" alt="Submit" width="50" height="20">
                        <span id="count">   </span> Likes
                        <br/>
                        <div> Write a comment... </div>
                        <textarea rows="2" cols="50" class="scrollabletextbox" id="name" name="comments" > </textarea>
                        <br/>
                        <input type="submit" id="submit_btn" value="Submit"> </input>
                        <ul id="namelist"> </ul>
                    </div>
                    <script type="text/javascript" src="/ui/main.js">
                    </script>
                </div>
            </body>
            </html>
            `;
            return htmlTemplate;
}


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/prof.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'prof.png'));
});

app.get('/ui/like.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'like.png'));
});


app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/background.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'background.jpg'));
});

//obtain the initial like count of an article from the article table

function initcounter(name, req, res) {
pool.query("SELECT likecount FROM article WHERE articlename = $1" , [name], function(err,result) {
        if (err) {
           res.status(500).send(err.toString()); }
        else {
             if (result.rows.length === 0) {
                res.status(404).send('Article not found'); }
             else {
                 switch(name) {
                    case 'HomePage' :
                        counter1 = result.rows[0].likecount;
                        break;
                    case 'FavAuthrs' :
                        counter2 = result.rows[0].likecount;
                        break;
                    case 'ProgLang' :
                        counter3 = result.rows[0].likecount;
                        break;
                    case 'Databases' :
                        counter4 = result.rows[0].likecount;
                        break;
                    }
                 res.send(result.rows[0].likecount.toString()); }
              }
     });
}


//update article table with the incremented like counter

function updatecounter(pgname, counter, req, res) {
 pool.query("UPDATE article SET likecount = $2 WHERE articlename = $1", [pgname, counter], function(err,result) {
        if (err) {
           res.status(500).send(err.toString()); }
        else {
             res.send(counter.toString()); }
        });
}

//obtain comments for an article from comment table and send it as response

function getcomment(pgname, req, res) {
    console.log('obtaining comments from db');
    pool.query("SELECT comment FROM article AS a, comment AS b WHERE articlename = $1 AND article_id = id ORDER BY b.date ASC, b.time ASC", [pgname], function(err, result) {
        if (err) {
            res.status(500).send(err.toString()); }
        else { 
            if (result.rows.length === 0) {
                res.status(404).send('Article not found'); }
            else {
                for (var i=0; i<result.rows.length(); i++) {
                    names1.push(result.rows[i].comment); }
                console.log(names1);
                res.send(JSON.stringify(names1)); }        
        }
    });
} 


//insert the new comment into the comment table and send updated comment list to the page
function updtcomment(pgname, comment, commentlist, req, res) {
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

    pool.query("SELECT id FROM article WHERE articlename = $1" , [pgname], function(err,result) {
        if (err) {
           res.status(500).send(err.toString()); }
        else {
             if (result.rows.length === 0) {
                res.status(404).send('Article not found'); }
             else {
                    var articleid = result.rows[0].id;
                    datestring = formatdate.toString();
                    timestring = time.toString();
                    pool.query("INSERT INTO comment (article_id, comment, date, time) VALUES ($1, $2, $3, $4)", [articleid, comment, datestring, timestring], function(err,result) 
                    {
                        if (err) { 
                            res.status(500).send(err.toString());  }
                        else { 
                            res.send(JSON.stringify(commentlist));
                        }
                    });
                    }
              }
     });
}

// /initcounter* obtains the current Likes counter for a page and /counter* increments the Likes counter by 1

var counter1 = 0;
app.get('/initcounter1', function(req, res) {
    initcounter('HomePage', req, res);
});
app.get('/counter1', function(req, res) {
    counter1 = counter1 + 1;
    updatecounter('HomePage', counter1, req, res);
});

var counter2 = 0;
app.get('/initcounter2', function(req, res) {
    initcounter('FavAuthrs', req, res);
});
app.get('/counter2', function(req, res) {
    counter2 = counter2 + 1;
    updatecounter('FavAuthrs', counter2, req, res);
});

var counter3 = 0;
app.get('/initcounter3', function(req, res) {
    initcounter('ProgLang', req, res);
});
app.get('/counter3', function(req, res) {
    counter3 = counter3 + 1;
    updatecounter('ProgLang', counter3, req, res);
});

var counter4 = 0;
app.get('/initcounter4', function(req, res) {
    initcounter('Databases', req, res);
});
app.get('/counter4', function(req, res) {
    counter4 = counter4 + 1;
    updatecounter('Databases', counter4, req, res);
});

// /init-name* obtains the current list of comments for a page from the comment table
// /submit-name* adds the new comment into the comment list and comment table

var names1 = [];
app.get('/init-name1', function(req, res) {
    getcomment('HomePage', req, res);
});
app.get('/submit-name1', function(req, res) {
    var name1 = req.query.name;
    names1.push(name1);
    updtcomment('HomePage', name1, names1, req, res);
});

var names2 = [];
app.get('/init-name2', function(req, res) {
    res.send(JSON.stringify(names2));
});
app.get('/submit-name2', function(req, res) {
    var name2 = req.query.name;
    names2.push(name2);
    res.send(JSON.stringify(names2));
});

var names3 = [];
app.get('/init-name3', function(req, res) {
    res.send(JSON.stringify(names3));
});
app.get('/submit-name3', function(req, res) {
    var name3 = req.query.name;
    names3.push(name3);
    res.send(JSON.stringify(names3));
});

var names4 = [];
app.get('/init-name4', function(req, res) {
    res.send(JSON.stringify(names4));
});
app.get('/submit-name4', function(req, res) {
    var name4 = req.query.name;
    names4.push(name4);
    res.send(JSON.stringify(names4));
});

//select data needed to build the page requested from the database and render it using the createTemplate function
app.get('/:articleName', function (req, res) {
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
