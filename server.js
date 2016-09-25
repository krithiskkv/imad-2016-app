var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var ProgLang = {
    title: 'Programming Languages | krithiskkv',
    heading: 'Programming Experience',
    date: 'Sep 25 2016',
    content: `
            <p>
                I have more than 7 years experience as a COBOL/JCL programmer. 
                I have worked in the capacity of a programmer and a Team Lead. 
            </p>
            <p>
                I am OCJP6 certified. 
                I scored 86% in the OCJP6 certification exam dated 30 August 2016.
            </p>
            <p> 
                Currently learning Web and mobile Application development at IMAD
            </p>` 
};   

function createTemplate(Data) {
            var title = data.title;
            var heading = data.heading;
            var date = data.date;
            var content = data.content;
            var htmlTemplate = `<html>
            <head>
                <title>
                    ${title} 
                </title>
                <meta name = "viewport" content = "width=device-width, initial-sccale=1" />
                <link href="/ui/style.css" rel="stylesheet" />
            </head>
            <body>
                <div>
                    <a href="/">Home</a> 
                </div>
            <hr/>
            <h3>
                ${heading}
            </h3>
            <div class="container">
                <div>
                    ${date}
                </div>
                <div>
                    ${content}
                </div>
            </div>
            </body>
            </html>
            `;
            return htmlTemplate;
}


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ProgLang', function (req, res) {
  res.send(createTemplate(ProgLang));
});

app.get('/FavAuthrs', function (req, res) {
  res.send('R.K. Narayan and P.G.Wodehouse are my all time favourtie authors');
});

app.get('/Databases', function (req, res) {
  res.send('Experienced DB2 programmer using SQL in COBOL on Mainframes');
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
