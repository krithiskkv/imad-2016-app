var submit = document.getElementById('subarticle_btn');
submit.onclick = function() {
    var heading   = document.getElementById('heading').value.trim();
    var title     = document.getElementById('title').value.trim();
    var shortname = document.getElementById('shortname').value.trim();
    var category  = document.getElementById('category').value.trim();
    var content   = document.getElementById('content').value.trim();
    
    if (heading === '' || title === '' || shortname === '' || category === '' || content === '') {
        alert('*Required fields cannot be blank'); }
    else {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                var commentsData = JSON.parse(this.responseText);
                var list = '';
                for (var i=0;i<commentsData.length;i++) {
                  list += '<li>' + escapeHTML(commentsData[i].comment) + '</li>' + '<small>' + '-- ' + escapeHTML(commentsData[i].user_name) + ' ' + commentsData[i].date.split('T')[0] + '</small>';
                }
                var ul = document.getElementById('commlist');
                ul.innerHTML = list;
                var cmntlink = document.getElementById('cmntlink');
                var cmntstring = commentsData[0].cmntcnt + ' comments';
                cmntlink.innerHTML = cmntstring;
                }
            } 
        };
        request.open('POST', 'http://krithiskkv.imad.hasura-app.io/submit-cmnt/' + articleName, true);
        request.setRequestHeader('Content-Type','application/json');
        request.send(JSON.stringify({comment : comment, username : username}));
        document.getElementById('comment').value="";
    }  
};