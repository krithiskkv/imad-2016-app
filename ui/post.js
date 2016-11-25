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
                alert('Article data recorded successfully, will be posted after approval');
                document.getElementById('heading').value    = '';
                document.getElementById('title').value      = '';
                document.getElementById('shortname').value  = '';
                document.getElementById('category').value   = '';
                document.getElementById('content').value    = '';
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