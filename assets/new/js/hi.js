$(function() {  
        
    $(document).on('hidden.bs.modal', function (event) {
        if ($('.modal:visible').length) {
        $('body').addClass('modal-open');
        }
    });
    var view_to_show = null;
    lvl_to_show = null;

    lvl_to_show = document.getElementById("lvl_view").textContent;
    
    
    if(document.getElementById("technology_view")){
    view_to_show = document.getElementById("technology_view").textContent;
    }
    contentType = null;
    if( document.getElementById("technology_contentType")){
    contentType = document.getElementById("technology_contentType").textContent
    }
    image_name = view_to_show+'_';
    course_name = view_to_show;
    course_description = view_to_show; 
    var runit = 0;     
    searchTopics();
    refineSearchView("zzz");
});


function checkTrainerExists(event){

    var mail_id = $('input[name=email]').val();
                mail_id_login=mail_id;
        
                // process the form
                $.ajax({
                    url         : "/checkTrainer", // the url where we want to POST
                    data        : {"email":mail_id}, // our data object
                    dataType    : "html", // what type of data do\ we expect back from the server
                    encode      : true
                })
                
                    // using the done promise callback
                    .done(function(data) {
                        document.open("text/html", "load")
                        document.write(data);
                        document.close();
        });

        event.preventDefault();
}


function trainerLogin(event){   

    // get the form data
    // there are many ways to get this data using jQuery (you can use the class or id also)
    var mail_id = $('input[name=email]').val();
    var pwd = $('input[name=pass]').val();
    var image_name = 

    // process the form
    $.ajax({
        url         : "/login_teacher", // the url where we want to POST
        type        : 'post',
        data        : {"email":mail_id, "pwd":pwd}, // our data object
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


``
function traineeLogin(event){   

                // get the form data
                // there are many ways to get this data using jQuery (you can use the class or id also)
                var mail_id = $('input[name=email]').val();
                var pwd = $('input[name=pass]').val();
                var image_name = 
        
                // process the form
                $.ajax({
                    url         : "/login_student", // the url where we want to POST
                    type        : 'post',
                    data        : {"email":mail_id, "pwd":pwd}, // our data object
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


function bookc(event) {

    // get the form data
    // there are many ways to get this data using jQuery (you can use the class or id also)
    var course = $('input[name=course-name]').val();
    var level = $('input[name=level-name]').val();
    var datetimeval = $('input[id=time]').val();
    var sel = document.getElementById('timezone-offset');    
    // process the form
    $.ajax({
        url         : "/book_course", // the url where we want to POST
        type        : 'post',
        data        : {"course":course, "level":level, "datetimeval": datetimeval, "course_description":course_description}, // our data object
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


function backtolandinglogin(event){

    $.ajax({
        url         : "/back_to_landing_login_page", // the url where we want to POST
        data        : {"email":"email"}, // our data object
        dataType    : "html", // what type of data do\ we expect back from the server
        encode      : true
    })
    
        // using the done promise callback
        .done(function(data) {
            document.open("text/html", "load")
            document.write(data);
            document.close();
});

event.preventDefault();
}


function bookV(event) {

    // get the form data
    // there are many ways to get this data using jQuery (you can use the class or id also)
    var course = $('input[name=course-name]').val();
    var level = $('input[name=level-name]').val();

    $.ajax({
        url         : "/book_video", // the url where we want to POST
        type        : 'post',
        data        : {"course":course, "level":level, "course_description":course_description}, // our data object
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


function backtolandingmainT(event){

    if( typeof course_name == "undefined")
        course_name = 'Tensorflow';

    $.ajax({
        url         : "/hi", // the url where we want to POST
        data        : {"technology":course_name}, // our data object
        dataType    : "html", // what type of data do\ we expect back from the server
        encode      : true
    })
    
        // using the done promise callback
        .done(function(data) {
            document.open("text/html", "load")
            document.write(data);
            document.close();
});

event.preventDefault();
}





function parseVideoLink(linkVid){        
    var tmpStr  = linkVid.match("/d/(.*)/preview");
    var newStr = 'https://drive.google.com/uc?export=download&id='+tmpStr[1];
    return newStr;
}



function videoClk1(event, crse, lvl, description, videolink, levels_total){ 
    //var iframe = '<iframe id="frameclk"  src="'+videolink+'" width="100%"  height="100%" allow=autoplay frameborder="0" allowfullscreen="allowfullscreen"></iframe><div style="width: 80px; height: 80px; position: absolute; opacity: 0; right: 0px; top: 0px;">&nbsp;</div>';
    var iframe = '<video poster="static/image/images/poster.jpg" autoplay playsinline id="frameclk" controls controlsList="nodownload"  height="100%" width="100%"><source src="'+parseVideoLink(videolink)+'" type="video/mp4"></video>';
    $.createModalVid({
      message: iframe,
      closeButton:true,
      scrollable:false,
      technology_information: crse+' Level '+lvl,
      technology_description: description,
      total_levels: levels_total,
      current_level: lvl
      });       
      return false;    
   }


function sideMenu(){
    document.getElementById("navig_side").innerHTML=' ';
    datahtml='';
    if(contentType==='Tech'){
        datahtml='<li><a style="background:white;" href="#details" data-toggle="collapse"  class="dropdown-toggle">Tech Details</a><ul style="padding-left:10%; background:#fafafa;" class="collapse list-unstyled" id="details"><li><a style="background: white; padding-left:10%;" onclick="version_history()" href="#"><span class="icon-home mr-3"></span>Version History</a></li>'+
        '<li><a style="background: white; padding-left:10%;" onclick="industry_acceptance()" href="#"><span class="icon-search2 mr-3"></span>Industry Acceptance</a></li>'+
        '<li><a style="background: white; padding-left:10%;" onclick="dev_trends()" href="#"><span class="icon-notifications mr-3"></span>Development Trends</a></li>'+
        '<li><a style="background: white; padding-left:10%;" onclick="associated_tech()" href="#"><span class="icon-location-arrow mr-3"></span>Linked Technologies</a></li></ul><li>';
     
    }
    datahtml+='<!--<li><a href="#"><span class="icon-pie-chart mr-3"></span>Stats</a></li>-->'; 
    document.getElementById("navig_side").innerHTML=datahtml;

}

function checkTraineeExists(event){

    var mail_id = $('input[name=email]').val();
                mail_id_login=mail_id;
        
                // process the form
                $.ajax({
                    url         : "/checkuser", // the url where we want to POST
                    data        : {"email":mail_id}, // our data object
                    dataType    : "html", // what type of data do\ we expect back from the server
                    encode      : true
                })
                
                    // using the done promise callback
                    .done(function(data) {
                        document.open("text/html", "load")
                        document.write(data);
                        document.close();
        });

        event.preventDefault();
}

function backtolandingmain(event){
    
    if( typeof course_name == "undefined"){
        course_name = 'Tensorflow';
        course_description = course_name;
}

    $.ajax({
        url         : "/hi", // the url where we want to POST
        data        : {"technology":course_description}, // our data object
        dataType    : "html", // what type of data do\ we expect back from the server
        encode      : true
    })
    
        // using the done promise callback
        .done(function(data) {
            document.open("text/html", "load")
            document.write(data);
            document.close();
});

event.preventDefault();
}

function searchTopics() {
    $.ajax({               
        url          : "/searchtopicsnew", // the url where we want to POST
        data         : {"course_name":course_name, "keyword_data": "Teklrn"},
        dataType     : 'json',
        encode       : true
    })
        // using the done promise callback
         .done(function(data) { 
            sideMenu();
            var elm = document.getElementById('rowdata');
            elm.innerHTML="";
            var aHtml ="";
            var a1Html = "";
            var a2Html ="";
            var a1Html = "";
            $.each(data, function(index) {
                a1Html = " ";
                a2Html = " ";
                a1Html += '<button style="font-size: small; border: 1px solid transparent;background-color: #0665b8;  vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" onclick="lvlclk('+data[index].level+')"'+ '>Syllabus <i style="vertical-align:middle;" class="fa fa-book" aria-hidden="true"></i>'+'</button>'+
                ' <button style="font-size: small; border: 1px solid transparent;background-color: #0665b8; vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" onclick="login_l(event, \''+course_name+'\', '+data[index].level+')"'+ '><a style="background-color:white; color:#0c78d5; padding-left:1px; padding-right:1px; margin-right: 2px;" >$13</a> Book Trainer'+'<i style="vertical-align:middle;" class="fas fa-chalkboard-teacher"></i></button>';
            if(data[index].videoFree==true)
                {
                    
                    a1Html+=' <button id='+data[index].level+' style="font-size: small; border: 1px solid transparent;background-color: #0665b8; vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" onclick="videoClk1(event, \''+course_name+'\', '+data[index].level+', \''+data[index].value+'\', \''+data[index].videolink+'\', \''+data.length+'\')"'+ '>FREE Video <i style="vertical-align: middle;" class="fas fa-play-circle"></i>'+'</button>';
                }
            else{
                    a1Html+=' <button id='+data[index].level+'  style="font-size: small; border: 1px solid transparent;background-color: #0665b8; vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" onclick="videoClk(event, \''+course_name+'\', '+data[index].level+')"'+ '><a style="background-color:white; color:#4a82b3; padding-left:1px; padding-right:1px; margin-right: 2px;" >$3</a> Video <i style="vertical-align: middle;" class="fas fa-play-circle"></i>'+'</button>';
                  
                }   

                var l;
                a2Html+='<a style="padding-right: 1%"></a><br>';
                for (l = 0; l < 5; l++) {
                    if(l<data[index].rating){
                    a2Html+='<span style="color: #378fdd; font-size:70%;vertical-align: middle;" class="fa fa-star checked"></span>';
                    }
                    else{
                        a2Html+='<span style="color:lightgrey; font-size:70%;vertical-align: middle;" class="fa fa-star checked"></span>';
                     
                    }
                    a2Html+='<a style="padding-right: .4%"></a>';
                }
                a2Html+='<a style="padding-right: 1%"></a>';
                a2Html+='<a style="color:#629DD1 !important; vertical-align: middle;font-size: small"> ('+data[index].rating+'/5) '+data[index].reviewCount+' Ratings</a>';
                a2Html+='</div></h4>';
                
            aHtml += '<div class="col-md-6"><div class="d-flex post-entry"><div class="custom-thumbnail"><img style="padding-left:30%;" src="static/image/images/'+course_name+'_icon.png" width="55px" height="30px" alt="Image" class="img-fluid"></div><div class="post-content"><p   style="font-weight: 600 !important; font-family: \'Poppins\', sans-serif; font-size: medium !important;  color:#629DD1 !important;"> <b style="color:#919497;">LEVEL '+(index+1)+'</b> '+' '+'<div style="font-weight: 600 !important; font-family: \'Poppins\', sans-serif; font-size: medium !important;  color:black !important" id='+data[index].level+'description>'+data[index].value+'</div></p><div class="post-meta">'+a1Html+'</div><div class="post-meta"><span>'+ a2Html+'</span></div></div></div></div>';     
                
        
            });
            elm.innerHTML=aHtml;
            clk(); 
                         
});
    // stop the form from submitting the normal way and refreshing the page
  //  event.preventDefault();
  

}


(function(a){a.createModalForDesignationsCertification=function(b){defaults={title:"",message:"Your Message Goes Here!",closeButton:false,scrollable:true};var b=a.extend({},defaults,b);var c=(b.scrollable===true)?'style="max-height: 100%;overflow-y: auto;"':"";html='<div class="modal fade" id="myModal">';html+='<div class="modal-dialog">';html+='<div class="modal-content">';html+='<div style="border-bottom:none" class="modal-header">';html+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';if(b.title.length>0){html+='<h4 class="modal-title">'+b.title+"</h4>"}html+='</div><div><div><h4 style="margin-left: 4%;margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: \'Antietam\';"><img src="static/image/images/2.png" style="padding-right:1%;" alt="TEKLRN" width="30" height="45"> TEKLRN </h4></div><div style="margin-left: 4%;"><h4 style="margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: inherit;">TECHNOLOGY CERTIFICATION COURSES </h4></div></div>';html+='<div class="modal-body" '+c+">";html+=b.message;html+="</div>";html+='<div style="border-top:none" class="modal-footer">';if(b.closeButton===true){html+='<button id="closeModal" type="button" style="background-color: white; color: #629DD1" class="btn btn-primary" data-dismiss="modal">Close</button>'}html+="</div>";html+="</div>";html+="</div>";html+="</div>";a("body").prepend(html);a("#myModal").modal().on("hidden.bs.modal",function(){a(this).remove()})}})(jQuery);

(function(a){a.createModalForDesignations=function(b){defaults={title:"",message:"Your Message Goes Here!",closeButton:false,scrollable:true};var b=a.extend({},defaults,b);var c=(b.scrollable===true)?'style="max-height: 100%;overflow-y: auto;"':"";html='<div class="modal fade" id="myModal">';html+='<div class="modal-dialog">';html+='<div class="modal-content">';html+='<div style="border-bottom:none" class="modal-header">';html+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';if(b.title.length>0){html+='<h4 class="modal-title">'+b.title+"</h4>"}html+='</div><div><div><h4 style="margin-left: 4%;margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: \'Antietam\';"><img src="static/image/images/2.png" style="padding-right:1%;" alt="TEKLRN" width="30" height="45"> TEKLRN </h4></div><div style="margin-left: 4%;"><h4 style="margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: inherit;">SUPPORTED SOFTWARE / IT / TECHNOLOGY DESIGNATIONS </h4></div></div>';html+='<div class="modal-body" '+c+">";html+=b.message;html+="</div>";html+='<div style="border-top:none" class="modal-footer">';if(b.closeButton===true){html+='<button id="closeModal" type="button" style="background-color: white; color: #629DD1" class="btn btn-primary" data-dismiss="modal">Close</button>'}html+="</div>";html+="</div>";html+="</div>";html+="</div>";a("body").prepend(html);a("#myModal").modal().on("hidden.bs.modal",function(){a(this).remove()})}})(jQuery);

(function(a){a.createModalForSearch=function(b){defaults={title:"",message:"Your Message Goes Here!",closeButton:false,scrollable:true};var b=a.extend({},defaults,b);var c=(b.scrollable===true)?'style="max-height: 100%;overflow-y: auto;"':"";html='<div class="modal fade" id="myModal">';html+='<div class="modal-dialog">';html+='<div class="modal-content">';html+='<div style="border-bottom:none" class="modal-header">';html+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';if(b.title.length>0){html+='<h4 class="modal-title">'+b.title+"</h4>"}html+='</div><div><div><h4 style="margin-left: 8%;margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: \'Antietam\';"><img src="static/image/images/2.png" style="padding-right:1%;" alt="TEKLRN" width="30" height="45"> TEKLRN </h4></div><div style="margin-left: 4%;"><h4 style="margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: inherit;">SEARCH RESULTS: </h4></div></div>';html+='<div class="modal-body" '+c+">";html+=b.message;html+="</div>";html+='<div style="border-top:none" class="modal-footer">';if(b.closeButton===true){html+='<button id="closeModal" type="button" style="background-color: white; color: #629DD1" class="btn btn-primary" data-dismiss="modal">Close</button>'}html+="</div>";html+="</div>";html+="</div>";html+="</div>";a("body").prepend(html);a("#myModal").modal().on("hidden.bs.modal",function(){a(this).remove()})}})(jQuery);

(function(a){a.createModal=function(b){defaults={title:"",message:"Your Message Goes Here!",closeButton:false,scrollable:true};var b=a.extend({},defaults,b);var c=(b.scrollable===true)?'style="max-height: 100%;overflow-y: auto;"':"";html='<div class="modal fade"  style="padding-left:0%; padding-right:0%" id="myModal">';html+='<div class="modal-dialog">';html+='<div class="modal-content">';html+='<div style="border-bottom:none" class="modal-header">';html+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';if(b.title.length>0){html+='<h4 class="modal-title">'+b.title+"</h4>"}html+='</div><h4 style="margin-left: 8%;margin-bottom: 4%;  text-align: left;color: inherit;font-size:inherit;font-family: \'Antietam\';"><img src="static/image/images/banner3.jpg" style="padding-right:1%;" alt="TEKLRN" width="200" height="70"></h4><div style="margin-left: 4%; margin-right: 4%"><!--<h4 style="margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: inherit;">TECHNOLOGY PROFICIENCY CERTIFICATION  <a style="font-weight:bolder">'+ course_name.toUpperCase() +' PROFESSIONAL TECHNOLOGY DEVELOPER LEVEL '+b.current_level+'</a></h4>--></div>';html+='<div class="modal-body" '+c+">";html+=b.message;html+="</div>";html+='<div style="border-top:none" class="modal-footer">';if(b.closeButton===true){html+='<button type="button" style="background-color: white; color: #629DD1" class="btn btn-primary" data-dismiss="modal">Close</button>'}html+="</div>";html+="</div>";html+="</div>";html+="</div>";a("body").prepend(html);a("#myModal").modal().on("hidden.bs.modal",function(){a(this).remove()})}})(jQuery);

(function(a){a.createModalVid=function(b){defaults={title:"",message:"Your Message Goes Here!",closeButton:false,scrollable:true};var b=a.extend({},defaults,b);var c=(b.scrollable===true)?'style="max-height: 100%;overflow-y: auto;"':"";html='<div class="modal fade"  style="padding-top: 0px !important;padding-left:0%; padding-right:0%" id="myModal">';html+='<div style="margin-top: 0%;" class="modal-dialog">';html+='<div style="top:0; position:sticky; z-index: 1055; height:100%; width:100%; border-width: 0px; " class="modal-content">';html+='<div style="border-bottom:none;display: none;" class="modal-header">';html+='<button id="closex" type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';if(b.title.length>0){html+='<h4 class="modal-title">'+b.title+"</h4>"}html+='</div><div><button style="padding:15px;" id="closex" type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><div><h4 style="margin-left: 8%;margin-bottom: 0%;text-align: left;color: inherit;font-size:inherit;font-family: \'Antietam\';"><img src="static/image/images/banner3.jpg" style="padding-top: 15px;padding-right:1%;" alt="TEKLRN" width="200" height="70"></h4></div><div style="margin-left: 4%; margin-right: 4%;"><!--<h4 style="margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: inherit;">TECHNOLOGY PROFICIENCY CERTIFICATION <a style="font-weight:bolder">'+ course_name.toUpperCase() +' PROFESSIONAL TECHNOLOGY DEVELOPER</a> </h4>--></div></div>';html+='<div style="text-transform:uppercase; padding-left:0.1rem; padding-right:0.1rem; padding:0rem; class="modal-body" '+c+">";html+=b.message;html+="</div>";html+='<a style="margin-left: 4%; margin-right: 4%; margin-bottom: 4%; margin-top: 4%;"><b style="text-transform: uppercase; margin-right:1%;"><img src="static/image/images/'+course_name+'_icon.png" style="margin-right: 2%;width: 5%;height: 40%;" alt="TEKLRN" width="35" height="25">'+b.technology_information+' </b>'+b.technology_description+'</a> '; html+="</div>";
for (var i = 1; i <= b.total_levels; i++) { 
    if(i!=b.current_level)
    
    html+='<div style="margin: 0%; margin-top: 0%;margin-bottom: 0%;" class="modal-dialog"><div onclick="hi(event, \''+course_name+'\', '+i+')"  style="height:100%; width:100%" class="modal-content"><a href="javascript:void(0);" style="margin-left: 4%; margin-right: 4%; margin-bottom: 4%; margin-top: 4%;"><b style="text-transform: uppercase; margin-right:1%;"><img src="static/image/images/'+course_name+'_icon.png" style="margin-right: 2%;width: 5%;height: 40%;" alt="TEKLRN" width="35" height="25"> '+course_name+' Level '+ i +' </b>'+ document.getElementById(i+'description').innerText+'<img src="static/image/images/play_b.png" style="float: right;margin-right: 2%;width: 5%;height: 40%;" alt="TEKLRN" width="35" height="25"></a> </div></div>';
}   
    html+="</div>";html+="</div>";a("body").prepend(html);a("#myModal").modal().on("hidden.bs.modal",function(){a(this).remove()})}})(jQuery);

 
    function hi(event, crse, lvl){
    
        document.getElementById('closex').click();
        document.getElementById(lvl).click();
    }


    function videoClk(event, crse, lvl) {
        //alert(crse+lvl);
        $.ajax({
            url         : "/loginFormForVideoAccess", // the url where we want to POST
            data        : {"from": "home_book_login", "course_name":crse, "course_level": lvl, "action":"video", "course_description":course_description}, // our data object
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


    function refineSearchView(pg){
        var elm = document.getElementById("mgc");
        var html_message ="";
        $.ajax({
            url         : "/getTechnologiesMatchingTheSearch", // the url where we want to POST
            data        : {"search_string":pg}, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {
                elm.innerHTML="";  
                $.each(data, function(index) {
                      html_message +='<div onclick="gotoTechnology(\''+data[index].description+'\')" ><img style="float: left;width: 200px; height: 135px;object-fit: cover;" src="static/image/images/'+data[index].technology+'_icon.png" /></div>'
                    });
              
        elm.innerHTML=html_message;
            });
            event.preventDefault();      
    }


    function gotoTechnology(pg){

        window.open(window.location.origin+"?technology="+pg, "_self");
        /*
        $.ajax({
            url         : "hi", // the url where we want to POST
            data        : {"technology":pg}, // our data object
            dataType    : "html", // what type of data do\ we expect back from the server
            encode      : true,
        }) .done(function(data) {
                                document.open("text/html", "load")
                                document.write(data);
                                document.close();
                                    // here we will handle errors and validation messages
                                    });
                                    event.preventDefault();*/
}

    
    

    function hi() {
        //alert(crse+lvl);
        $.ajax({
            url         : "/", // the url where we want to POST
            data        : {"from": "home_book_login", "course_name":crse, "course_level": lvl, "action":"video", "course_description":course_description}, // our data object
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
    

function lvlclk(pg){ 
    var iframe = '<canvas id="my_canvas" style="width : 100%; max-height: 70%;"></canvas><script>pdfjsLib.getDocument("./static/image/'+image_name+pg+'.pdf").promise.then(doc =>{console.log("This file has "+doc._pdfInfo.numPages + " pages");  doc.getPage(1).then(page =>{ var myCanvas = document.getElementById("my_canvas");var context =  myCanvas.getContext("2d");var viewport = page.getViewport({scale:1.5}); myCanvas.width = viewport.width; myCanvas.height = viewport.height;  page.render({ canvasContext:context, viewport:viewport  });   }); }); </script>'
    $.createModal({
    message: iframe,
    current_level: pg,
    closeButton:true,
    scrollable:false
    });
    return false;        
 }

 function clk(){ 
    
    document.getElementById(lvl_to_show).click();

    /*if(document.getElementById('1').innerText.includes("FREE")){
    document.getElementById('1').click();
    }*/
    
}


function login_l(event, crse, lvl) {
    $.ajax({
        url         : "/loginForm", // the url where we want to POST
        data        : {"from": "home_book_login", "course_name":crse, "course_level": lvl, "course_description":course_description}, // our data object
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


function associated_tech(){ 
    var iframe = '<canvas id="my_canvas" style="width : 100%; max-height: 70%;"></canvas><script>pdfjsLib.getDocument("./static/image/'+image_name+'Associated.pdf").promise.then(doc =>{console.log("This file has "+doc._pdfInfo.numPages + " pages");  doc.getPage(1).then(page =>{ var myCanvas = document.getElementById("my_canvas");var context =  myCanvas.getContext("2d");var viewport = page.getViewport({scale:1.5}); myCanvas.width = viewport.width; myCanvas.height = viewport.height;  page.render({ canvasContext:context, viewport:viewport  });   }); }); </script>'
    $.createModal({
    message: iframe,
    closeButton:true,
    scrollable:false
    });
    return false;   
 }

 function version_history(){ 
    var iframe = '<canvas id="my_canvas" style="width : 100%; max-height: 70%;"></canvas><script>pdfjsLib.getDocument("./static/image/'+image_name+'Version.pdf").promise.then(doc =>{console.log("This file has "+doc._pdfInfo.numPages + " pages");  doc.getPage(1).then(page =>{ var myCanvas = document.getElementById("my_canvas");var context =  myCanvas.getContext("2d");var viewport = page.getViewport({scale:1.5}); myCanvas.width = viewport.width; myCanvas.height = viewport.height;  page.render({ canvasContext:context, viewport:viewport  });   }); }); </script>'
     $.createModal({
    message: iframe,
    closeButton:true,
    scrollable:false
    });
    return false;   
 }
 function dev_trends(){ 
    var iframe = '<canvas id="my_canvas" style="width : 100%; max-height: 70%;"></canvas><script>pdfjsLib.getDocument("./static/image/'+image_name+'Dev.pdf").promise.then(doc =>{console.log("This file has "+doc._pdfInfo.numPages + " pages");  doc.getPage(1).then(page =>{ var myCanvas = document.getElementById("my_canvas");var context =  myCanvas.getContext("2d");var viewport = page.getViewport({scale:1.5}); myCanvas.width = viewport.width; myCanvas.height = viewport.height;  page.render({ canvasContext:context, viewport:viewport  });   }); }); </script>'
     $.createModal({
    message: iframe,
    closeButton:true,
    scrollable:false
    });
    return false;   
 }
 function industry_acceptance(){ 
    var iframe = '<canvas id="my_canvas" style="width : 100%; max-height: 70%;"></canvas><script>pdfjsLib.getDocument("./static/image/'+image_name+'Industry.pdf").promise.then(doc =>{console.log("This file has "+doc._pdfInfo.numPages + " pages");  doc.getPage(1).then(page =>{ var myCanvas = document.getElementById("my_canvas");var context =  myCanvas.getContext("2d");var viewport = page.getViewport({scale:1.5}); myCanvas.width = viewport.width; myCanvas.height = viewport.height;  page.render({ canvasContext:context, viewport:viewport  });   }); }); </script>'
     $.createModal({
    message: iframe,
    closeButton:true,
    scrollable:false
    });
    return false;   
 }

function hi(event, crse, lvl){
    
    document.getElementById('closex').click();
    document.getElementById(lvl).click();
}

  