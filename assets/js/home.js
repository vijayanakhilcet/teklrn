$( document ).ready(
function to_login() {
var tech = window.location.search.substring(1);
const urlParams = new URLSearchParams(tech);
var technologyFromSearchString = 'Tensorflow';
var dlevel = 1
if(urlParams.get('technology')){
var technologyFromSearchString = urlParams.get('technology');
}
if(urlParams.get('level')){
    var dlevel = urlParams.get('level');
    }
var page = "hi";
if(tech){

    
if(tech == 'redirecttologinT'){
    page = "/login_teacher_authorize"

}
else if(tech == 'UploadComplete'){
    page = "/upload_complete"
}

else if(tech == 'redirecttologin'){
    page = "/login"
}
else if(tech == 'redirecttologinTA'){
    page = "/loginTA"
}
else if(tech == 'redirecttologinA'){
    page = "/loginA"
}
                // get the form data
                // there are many ways to get this data using jQuery (you can use the class or id also)
                
        
                // process the form
                $.ajax({
                    url         : page, // the url where we want to POST
                    data        : {"technology":technologyFromSearchString, "level":dlevel}, // our data object
                    dataType    : "html", // what type of data do\ we expect back from the server
                    encode      : true
                })
                    // using the done promise callback
                    .done(function(data) {
                        document.open("text/html", "load")
                        document.write(data);
                        document.close();
        
                        // here we will handle errors and validation messages
                    });
        
                
            }
            
           
            
}

);


function getAllTechnologies(){
    var elm1 = ""
    var elm = document.getElementById("course_lst");
    var html_message ="";
    $.ajax({
        url         : "/getTechnologiesMatchingTheSearch", // the url where we want to POST
        data        : {"search_string":"zzz"}, // our data object
        dataType    : 'json', // what type of data do we expect back from the server
        encode      : true
    })
        // using the done promise callback
        .done(function(data) {
            elm.innerHTML="";  
            $.each(data, function(index) {
                 if(index % 2 == 0) {
                 html_message +='<div class="row"><div class="6u"><section class="special"><a href="technologies/technology?technology='+data[index].description+'" class="image fit"><img  src="/static/image/images/poster_video.jpg" alt=""></a><h3>'+data[index].technology+'</h3><p>'+data[index].description+'</p><ul class="actions"><li><a href="/technologies/technology?technology='+data[index].description+'" class="button alt">Learn More</a></li></ul></section></div>';
                 }
                 else{
                    html_message +='<div class="6u"><section class="special"><a href="technologies/technology?technology='+data[index].description+'" class="image fit"><img src="/static/image/images/poster_video.jpg" alt=""></a><h3>'+data[index].technology+'</h3><p>'+data[index].description+'</p><ul class="actions"><li><a href="/technologies/technology?technology='+data[index].description+'" class="button alt">Learn More</a></li></ul></section></div></div>';
  
                 }
                });
          
    elm.innerHTML=html_message;
        });
        event.preventDefault();      
}


function getAllNews(){
    var elm = document.getElementById("trending_lst");
    var html_message ="";
    var mrqelem = document.getElementById('marq');    
    title_temp = ""
    var html_message_marq="";
    $.ajax({
        url         : "/getNewsMatchingTheSearch", // the url where we want to POST
        data        : {"search_string":"zzz"}, // our data object
        dataType    : 'json', // what type of data do we expect back from the server
        encode      : true
    })
        // using the done promise callback
        .done(function(data) {
            elm.innerHTML="";  
            $.each(data, function(index) {
                title_temp = data[index].name;
                 if(index % 2 == 0) {
                    
                 html_message +='<div class="row"><div class="6u"><section class="special"><a style="pointer-events: all;"  onclick="gotoTechnology1(\''+data[index].name+'\',\''+data[index].name+'\',\''+'RelatedTest2Nws'+index+'---'+data[index].name+'\')"  class="image fit"><img style="pointer-events: all;  height: 300px; object-fit: cover;" id="RelatedTest2Nws'+index+'---'+title_temp+'"  src="'+data[index].imageLink+'" alt=""></a><h3>'+''+'</h3><p>'+data[index].name+'</p><ul class="actions"><li><a style-"pointer-events: all" onclick="gotoTechnology1(\''+data[index].name+'\',\''+data[index].name+'\',\''+'RelatedTest2Nws'+index+'---'+data[index].name+'\')"  class="button alt">Read More</a></li></ul></section></div>';
                 }
                 else{

                    html_message +='<div class="6u"><section class="special"><a style="pointer-events: all;"  onclick="gotoTechnology1(\''+data[index].name+'\',\''+data[index].name+'\',\''+'RelatedTest2Nws'+index+'---'+data[index].name+'\')" class="image fit"><img style="pointer-events: all; height: 300px; object-fit: cover;" id="RelatedTest2Nws'+index+'---'+title_temp+'" src="'+data[index].imageLink+'" alt=""></a><h3>'+''+'</h3><p>'+data[index].name+'</p><ul class="actions"><li><a style-"pointer-events: all" onclick="gotoTechnology1(\''+data[index].name+'\',\''+data[index].name+'\',\''+'RelatedTest2Nws'+index+'---'+data[index].name+'\')"  class="button alt">Read More</a></li></ul></section></div></div>';
  
                 }
                 html_message_marq +='<img onerror="this.src=\'/static/image/test/certificate.jpg\'"  src="'+data[index].imageLink+'" style="vertical-align: middle !important;padding-left:5px; padding-right: 5px; width: 100px; height: 40px; object-fit: cover;" id="'+'marq'+data[index].name+'"/>'+'<span style="vertical-align: middle !important;">'+data[index].name+'</span>';


                });
          
    elm.innerHTML=html_message;
    mrqelem.innerHTML += html_message_marq;

        });getAllTechnologies();
        event.preventDefault();      
}




function doLaunch(event, section_data) {
        $.ajax({
            url         : section_data, // the url where we want to POST
            data        : {"technology":"Tensorflow"}, // our data object
            dataType    : "html", // what type of data do\ we expect back from the server
            encode      : true
        }) .done(function(data) {
                                document.open("text/html", "load")
                                document.write(data);
                                document.close();
                                    // here we will handle errors and validation messages
                                });
        event.preventDefault();
}

 
function gotoTechnology1(pg, url, img){   
    window.stop();
    window.open(window.location.origin+"/news/technology?technology="+pg+"&Code="+$("#countryCode option:selected").val()+"&url="+url+"&image="+document.getElementById(img).src.replaceAll('&', '-----'), "_self");
   
 }

function doLaunchCareer(event) {
        $.ajax({
            url         : "careers", // the url where we want to POST
            data        : {"email":"hELLO"}, // our data object
            dataType    : "html", // what type of data do\ we expect back from the server
            encode      : true
        }) .done(function(data) {
                                document.open("text/html", "load")
                                document.write(data);
                                document.close();
                                    // here we will handle errors and validation messages
                                });
        event.preventDefault();
}
function doLaunchTeach(event) {
        $.ajax({
            url         : "teach", // the url where we want to POST
            data        : {"email":"hELLO"}, // our data object
            dataType    : "html", // what type of data do\ we expect back from the server
            encode      : true
        }) .done(function(data) {
                                document.open("text/html", "load")
                                document.write(data);
                                document.close();
                                    // here we will handle errors and validation messages
                                });
        event.preventDefault();
}
function doLaunchPress(event) {
        $.ajax({
            url         : "press", // the url where we want to POST
            data        : {"email":"hELLO"}, // our data object
            dataType    : "html", // what type of data do\ we expect back from the server
            encode      : true
        }) .done(function(data) {
                                document.open("text/html", "load")
                                document.write(data);
                                document.close();
                                    // here we will handle errors and validation messages
                                });
        event.preventDefault();
}
function doLaunchBusiness(event) {
        $.ajax({
            url         : "business", // the url where we want to POST
            data        : {"email":"hELLO"}, // our data object
            dataType    : "html", // what type of data do\ we expect back from the server
            encode      : true
        }) .done(function(data) {
                                document.open("text/html", "load")
                                document.write(data);
                                document.close();
                                    // here we will handle errors and validation messages
                                });
        event.preventDefault();
}
function doLaunchHelp(event) {
        $.ajax({
            url         : "help", // the url where we want to POST
            data        : {"email":"hELLO"}, // our data object
            dataType    : "html", // what type of data do\ we expect back from the server
            encode      : true
        }) .done(function(data) {
                                document.open("text/html", "load")
                                document.write(data);
                                document.close();
                                    // here we will handle errors and validation messages
                                });
        event.preventDefault();
}
function doLaunchTerm(event) {
        $.ajax({
            url         : "terms", // the url where we want to POST
            data        : {"email":"hELLO"}, // our data object
            dataType    : "html", // what type of data do\ we expect back from the server
            encode      : true
        }) .done(function(data) {
                                document.open("text/html", "load")
                                document.write(data);
                                document.close();
                                    // here we will handle errors and validation messages
                                });
        event.preventDefault();
}
function doLaunchRefund(event) {
        $.ajax({
            url         : "refund", // the url where we want to POST
            data        : {"email":"hELLO"}, // our data object
            dataType    : "html", // what type of data do\ we expect back from the server
            encode      : true
        }) .done(function(data) {
                                document.open("text/html", "load")
                                document.write(data);
                                document.close();
                                    // here we will handle errors and validation messages
                                });
        event.preventDefault();
}

function login_l(event, crse, lvl) {
    //alert(crse+lvl);
    $.ajax({
        url         : "/loginForm", // the url where we want to POST
        data        : {"from": "home_book_login", "course_name":crse, "course_level": lvl}, // our data object
        dataType    : "html", // what type of data do\ we expect back from the server
        encode      : true
    })
        // using the done promise callback
        .done(function(data) {
            document.open("text/html", "load")
            document.write(data);
            document.close();

            // here we will handle errors and validation messages
        });

    // stop the form from submitting the normal way and refreshing the page
    event.preventDefault();
}


function login_t(event) {

    // get the form data
    // there are many ways to get this data using jQuery (you can use the class or id also)
    

    // process the form
    $.ajax({
        url         : "/loginFormT", // the url where we want to POST
        data        : {"email":'login'}, // our data object
        dataType    : "html", // what type of data do\ we expect back from the server
        encode      : true
    })
        // using the done promise callback
        .done(function(data) {
            document.open("text/html", "load")
            document.write(data);
            document.close();

            // here we will handle errors and validation messages
        });

    // stop the form from submitting the normal way and refreshing the page
    event.preventDefault();
}

function doLaunchPrivacy(event) {
        $.ajax({
            url         : "privacy", // the url where we want to POST
            data        : {"email":"hELLO"}, // our data object
            dataType    : "html", // what type of data do\ we expect back from the server
            encode      : true
        }) .done(function(data) {
                                document.open("text/html", "load")
                                document.write(data);
                                document.close();
                                    // here we will handle errors and validation messages
                                });
        event.preventDefault();
}


        