request.open('POST', 'http://krithiskkv.imad.hasura-app.io/submit-cmnt/' + articleName, true);
                    request.setRequestHeader('Content-Type','application/json');
                    request.send(JSON.stringify({comment : comment, username : username}));
                    document.getElementById('comment').value="";
