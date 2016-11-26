var submit = document.getElementById('subarticle_btn');
submit.onclick = function() {
    var heading   = document.getElementById('heading').value;
    var title     = document.getElementById('title').value;
    var shortname = document.getElementById('shortname').value;
    var category  = document.getElementById('category').value;
    var content   = document.getElementById('content').value;
    var imglink   = document.getElementById('imglink').value;
    
    if (heading.trim().length === 0 || title.trim().length === 0 || shortname.trim().length === 0 || category.trim().length === 0 || content.trim().length === 0) {
        alert('*Required fields cannot be blank'); }
    else {
        
        heading = heading.trim();
        title   = title.trim();
        shortname = shortname.trim();
        category = category.trim();
        content = content.trim();
        imglink = imglink.trim();
        
        var articleData = {'heading': heading, 'title': title, 'shortname': shortname, 'category': category, 'content': content, 'imglink': imglink}; 
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                alert('Article data recorded successfully, will be posted after approval');
                document.getElementById('heading').value    = '';
                document.getElementById('title').value      = '';
                document.getElementById('shortname').value  = '';
                document.getElementById('category').value   = '';
                document.getElementById('imglink').value    = '';
                }
            }
            else if (request.status === 500) {
                alert('Sorry, something went wrong. Try again');
            }
        };
        request.open('POST', 'http://krithiskkv.imad.hasura-app.io/submit-article', true);
        request.setRequestHeader('Content-Type','application/json');
        request.send(JSON.stringify(articleData));
        
    }  
};