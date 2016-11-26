var submit = document.getElementById('subarticle_btn');
submit.onclick = function() {
    var request = new XMLHttpRequest();
    var heading   = document.getElementById("artheading").value.trim();
    var title     = document.getElementById("arttitle").value.trim();
    var shortname = document.getElementById("artshortname").value.trim();
    var category  = document.getElementById("artcategory").value.trim();
    var content   = document.getElementById("artcontent").value.trim();
    var imglink   = document.getElementById("artimglink").value.trim();
    
    if (heading.length === 0 || title.length === 0 || shortname.length === 0 || category.length === 0 || content.length === 0) {
        alert('*Required fields cannot be blank'); }
    else {
        
        /*heading = heading.trim();
        title   = title.trim();
        shortname = shortname.trim();
        category = category.trim();
        content = content.trim();
        imglink = imglink.trim();*/
        
        var articleData = {'heading': heading, 'title': title, 'shortname': shortname, 'category': category, 'content': content, 'imglink': imglink}; 
        
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                alert('Article data recorded successfully, will be posted after approval');
                document.getElementById('artheading').value    = '';
                document.getElementById('arttitle').value      = '';
                document.getElementById('artshortname').value  = '';
                document.getElementById('artcategory').value   = '';
                document.getElementById('artimglink').value    = '';
                document.getElementById('artcontent').value    = '';
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