$(function() {  

    $(document).on('hidden.bs.modal', function (event) {
        if ($('.modal:visible').length) {
        $('body').addClass('modal-open');
        }
    });
    var view_to_show = document.getElementById("technology_view").textContent;
    contentType = document.getElementById("technology_contentType").textContent;
    image_name = view_to_show+'_';
    course_name = view_to_show;
    course_description = view_to_show;    
    var runit = 0;     
    searchTopics();
});

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
    datahtml+='<!--<li><a href="#"><span class="icon-pie-chart mr-3"></span>Stats</a></li>-->'+
    '<li><a style="background:white;" href="#pageSubmenu" data-toggle="collapse"  class="dropdown-toggle">Pending</a><ul style="padding-left:10%; background:#fafafa;" class="collapse list-unstyled" id="pageSubmenu"></ul></li>'+
    '<li><a style="background:white;" href="#accepted" data-toggle="collapse"  class="dropdown-toggle">Assigned</a><ul style="padding-left:10%; background:#fafafa;" class="collapse list-unstyled" id="accepted"></ul></li>'+
    '<li><a style="background:white;" href="#completed" data-toggle="collapse"  class="dropdown-toggle">Completed</a><ul style="padding-left:10%; background:#fafafa;" class="collapse list-unstyled" id="completed"></ul></li>'+

    '<li><a onclick="logout()" href="#"><span class="icon-sign-out mr-3"></span>Sign out</a></li>';
  
    document.getElementById("navig_side").innerHTML=datahtml;
    additonalSideMenuDataPopulation();

}

function getCompletedStudentTrainings(){
    $.ajax({
        url         : "/get_completed_student_trainings", // the url where we want to POST
        data        : {"course":"ab"}, // our data object
        dataType    : "json", // what type of data do\ we expect back from the server
        encode      : true
    }).done(function(data) {
            $('#completed').empty();
            var elm = document.getElementById('completed');

         $.each(data, function(index) {
            var li_element = document.createElement('li'); // create the option element
            var aHtml = '<a style="background: white; padding-left:10%;" href="#">'+data[index].date+'<button style="font-size: x-small; border: 1px solid transparent;background-color: #075aa3;  vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="lvlclk1(\''+data[index].course+'_'+ data[index].level+'\')">Syllabus '+data[index].course+' Level     '+ data[index].level+' <i style="vertical-align:middle;" class="fa fa-book" aria-hidden="true"></i></button></a>';
            li_element.innerHTML+=aHtml;
            elm.appendChild(li_element); 
          });

});
}    

function getAcceptedStudentTrainings(){              
    $.ajax({
        url         : "/get_accepted_student_trainings", // the url where we want to POST
        data        : {"course":"ab"}, // our data object
        dataType    : "json", // what type of data do\ we expect back from the server
        encode      : true
    }).done(function(data) {
            $('#accepted').empty();
            var elm = document.getElementById('accepted');
         $.each(data, function(index) {
            var li_element = document.createElement('li'); // create the option element
            var aHtml = '<a style="background: white; padding-left:10%;" href="#">'+data[index].date+'<button style="font-size: x-small; border: 1px solid transparent;background-color:  #075aa3; vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" type="Submit" value="'+ data[index].pk + '" onclick="markCompletion(event, this.value)">Mark Complete <i  style="vertical-align:middle;" class="fas fa-check"></i></button><button style="font-size: x-small; margin-left: .2rem;   border: 1px solid transparent;background-color:  #075aa3;;font-size: x-small;color: white;border-radius: .25rem;"  onclick="window.open('+'\''+data[index].meetingLink+'\''+')">Join  <i  style="vertical-align:middle;"  class="fas fa-video"></i></button> <button style="font-size: x-small; border: 1px solid transparent;background-color:  #075aa3; vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="lvlclk1(\''+data[index].course+'_'+ data[index].level+'\')">Syllabus '+data[index].course+' Level     '+ data[index].level+' <i style="vertical-align:middle;" class="fa fa-book" aria-hidden="true"></i></button></a>';
            li_element.innerHTML+=aHtml;            
            elm.appendChild(li_element); 
          });
});
}   


function getPendingStudentTrainings(){
    $.ajax({
        url         : "/get_pending_student_trainings", // the url where we want to POST
        data        : {"course":"ab"}, // our data object
        dataType    : "json", // what type of data do\ we expect back from the server
        encode      : true
    })
        // using the done promise callback
        .done(function(data) {
            $('#pageSubmenu').empty();
            var elm = document.getElementById('pageSubmenu');

         $.each(data, function(index) {
            var li_element = document.createElement('li'); 
            var aHtml = '<a style="background: white; padding-left:10%;" href="#">'+data[index].date+'<button style="font-size: x-small; border: 1px solid transparent;background-color: #075aa3;  vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="lvlclk1(\''+data[index].course+'_'+ data[index].level+'\')">Syllabus '+data[index].course+' Level     '+ data[index].level+' <i style="vertical-align:middle;" class="fa fa-book" aria-hidden="true"></i></button></a>';
            li_element.innerHTML+=aHtml;
            elm.appendChild(li_element); 
          });

});

}



function additonalSideMenuDataPopulation(){
    getPendingStudentTrainings();
    getAcceptedStudentTrainings();
    getCompletedStudentTrainings();
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
                a1Html += '<button style="font-size: small; border: 1px solid transparent;background-color: #378fdd;  vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" onclick="lvlclk('+data[index].level+')"'+ '>Syllabus <i style="vertical-align:middle;" class="fa fa-book" aria-hidden="true"></i>'+'</button>'+
                ' <button style="font-size: small; border: 1px solid transparent;background-color: #0c78d5; vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" onclick="login_l(event, \''+course_name+'\', '+data[index].level+')"'+ '><a style="background-color:white; color:#0c78d5; padding-left:1px; padding-right:1px; margin-right: 2px;" >$13</a> Book Trainer'+'<i style="vertical-align:middle;" class="fas fa-chalkboard-teacher"></i></button>';
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
                
            aHtml += '<div class="col-md-6"><div class="d-flex post-entry"><div class="custom-thumbnail"><img  src="static/image/images/poster.jpg" alt="Image" class="img-fluid"></div><div class="post-content"><p   style="font-weight: 600 !important; font-family: \'Poppins\', sans-serif; font-size: medium !important;  color:#629DD1 !important;"> <b style="color:#919497;">LEVEL '+(index+1)+'</b> '+' '+'<div style="font-weight: 600 !important; font-family: \'Poppins\', sans-serif; font-size: medium !important;  color:#629DD1 !important" id='+data[index].level+'description>'+data[index].value+'</div></p><div class="post-meta">'+a1Html+'</div><div class="post-meta"><span>'+ a2Html+'</span></div></div></div></div>';     
                
        
            });
            elm.innerHTML=aHtml;
            clk(); 
                         
});
    // stop the form from submitting the normal way and refreshing the page
  //  event.preventDefault();
  

}


(function(a){a.createModalForDesignationsCertification=function(b){defaults={title:"",message:"Your Message Goes Here!",closeButton:false,scrollable:true};var b=a.extend({},defaults,b);var c=(b.scrollable===true)?'style="max-height: 100%;overflow-y: auto;"':"";html='<div class="modal fade" id="myModal">';html+='<div class="modal-dialog">';html+='<div class="modal-content">';html+='<div style="border-bottom:none" class="modal-header">';html+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';if(b.title.length>0){html+='<h4 class="modal-title">'+b.title+"</h4>"}html+='</div><div><div><h4 style="margin-left: 4%;margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: \'Antietam\';"><img src="static/image/images/2.png" style="padding-right:1%;" alt="TEKLRN" width="25" height="20"> TEKLRN </h4></div><div style="margin-left: 4%;"><h4 style="margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: inherit;">TECHNOLOGY CERTIFICATION COURSES </h4></div></div>';html+='<div class="modal-body" '+c+">";html+=b.message;html+="</div>";html+='<div style="border-top:none" class="modal-footer">';if(b.closeButton===true){html+='<button id="closeModal" type="button" style="background-color: white; color: #629DD1" class="btn btn-primary" data-dismiss="modal">Close</button>'}html+="</div>";html+="</div>";html+="</div>";html+="</div>";a("body").prepend(html);a("#myModal").modal().on("hidden.bs.modal",function(){a(this).remove()})}})(jQuery);

(function(a){a.createModalForDesignations=function(b){defaults={title:"",message:"Your Message Goes Here!",closeButton:false,scrollable:true};var b=a.extend({},defaults,b);var c=(b.scrollable===true)?'style="max-height: 100%;overflow-y: auto;"':"";html='<div class="modal fade" id="myModal">';html+='<div class="modal-dialog">';html+='<div class="modal-content">';html+='<div style="border-bottom:none" class="modal-header">';html+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';if(b.title.length>0){html+='<h4 class="modal-title">'+b.title+"</h4>"}html+='</div><div><div><h4 style="margin-left: 4%;margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: \'Antietam\';"><img src="static/image/images/2.png" style="padding-right:1%;" alt="TEKLRN" width="25" height="20"> TEKLRN </h4></div><div style="margin-left: 4%;"><h4 style="margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: inherit;">SUPPORTED SOFTWARE / IT / TECHNOLOGY DESIGNATIONS </h4></div></div>';html+='<div class="modal-body" '+c+">";html+=b.message;html+="</div>";html+='<div style="border-top:none" class="modal-footer">';if(b.closeButton===true){html+='<button id="closeModal" type="button" style="background-color: white; color: #629DD1" class="btn btn-primary" data-dismiss="modal">Close</button>'}html+="</div>";html+="</div>";html+="</div>";html+="</div>";a("body").prepend(html);a("#myModal").modal().on("hidden.bs.modal",function(){a(this).remove()})}})(jQuery);

(function(a){a.createModalForSearch=function(b){defaults={title:"",message:"Your Message Goes Here!",closeButton:false,scrollable:true};var b=a.extend({},defaults,b);var c=(b.scrollable===true)?'style="max-height: 100%;overflow-y: auto;"':"";html='<div class="modal fade" id="myModal">';html+='<div class="modal-dialog">';html+='<div class="modal-content">';html+='<div style="border-bottom:none" class="modal-header">';html+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';if(b.title.length>0){html+='<h4 class="modal-title">'+b.title+"</h4>"}html+='</div><div><div><h4 style="margin-left: 8%;margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: \'Antietam\';"><img src="static/image/images/2.png" style="padding-right:1%;" alt="TEKLRN" width="35" height="25"> TEKLRN </h4></div><div style="margin-left: 4%;"><h4 style="margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: inherit;">SEARCH RESULTS: </h4></div></div>';html+='<div class="modal-body" '+c+">";html+=b.message;html+="</div>";html+='<div style="border-top:none" class="modal-footer">';if(b.closeButton===true){html+='<button id="closeModal" type="button" style="background-color: white; color: #629DD1" class="btn btn-primary" data-dismiss="modal">Close</button>'}html+="</div>";html+="</div>";html+="</div>";html+="</div>";a("body").prepend(html);a("#myModal").modal().on("hidden.bs.modal",function(){a(this).remove()})}})(jQuery);

(function(a){a.createModal=function(b){defaults={title:"",message:"Your Message Goes Here!",closeButton:false,scrollable:true};var b=a.extend({},defaults,b);var c=(b.scrollable===true)?'style="max-height: 100%;overflow-y: auto;"':"";html='<div class="modal fade" id="myModal">';html+='<div class="modal-dialog">';html+='<div class="modal-content">';html+='<div style="border-bottom:none" class="modal-header">';html+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';if(b.title.length>0){html+='<h4 class="modal-title">'+b.title+"</h4>"}html+='</div><h4 style="margin-left: 8%;margin-bottom: 4%;  text-align: left;color: inherit;font-size:inherit;font-family: \'Antietam\';"><img src="static/image/images/2.png" style="padding-right:1%;" alt="TEKLRN" width="25" height="20"> TEKLRN </h4><div style="margin-left: 4%; margin-right: 4%"><!--<h4 style="margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: inherit;">TECHNOLOGY PROFICIENCY CERTIFICATION  <a style="font-weight:bolder">'+ course_name.toUpperCase() +' PROFESSIONAL TECHNOLOGY DEVELOPER LEVEL '+b.current_level+'</a></h4>--></div>';html+='<div class="modal-body" '+c+">";html+=b.message;html+="</div>";html+='<div style="border-top:none" class="modal-footer">';if(b.closeButton===true){html+='<button type="button" style="background-color: white; color: #629DD1" class="btn btn-primary" data-dismiss="modal">Close</button>'}html+="</div>";html+="</div>";html+="</div>";html+="</div>";a("body").prepend(html);a("#myModal").modal().on("hidden.bs.modal",function(){a(this).remove()})}})(jQuery);

(function(a){a.createModalVid=function(b){defaults={title:"",message:"Your Message Goes Here!",closeButton:false,scrollable:true};var b=a.extend({},defaults,b);var c=(b.scrollable===true)?'style="max-height: 100%;overflow-y: auto;"':"";html='<div class="modal fade" id="myModal">';html+='<div class="modal-dialog">';html+='<div style="height:100%; width:100%" class="modal-content">';html+='<div style="border-bottom:none" class="modal-header">';html+='<button id="closex" type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';if(b.title.length>0){html+='<h4 class="modal-title">'+b.title+"</h4>"}html+='</div><div><div><h4 style="margin-left: 8%;margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: \'Antietam\';"><img src="static/image/images/2.png" style="padding-right:1%;" alt="TEKLRN" width="25" height="20"> TEKLRN </h4></div><div style="margin-left: 4%; margin-right: 4%;"><!--<h4 style="margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: inherit;">TECHNOLOGY PROFICIENCY CERTIFICATION <a style="font-weight:bolder">'+ course_name.toUpperCase() +' PROFESSIONAL TECHNOLOGY DEVELOPER</a> </h4>--></div></div>';html+='<div style="text-transform:uppercase; padding-left:0.1rem; padding-right:0.1rem; padding:0rem; class="modal-body" '+c+">";html+=b.message;html+="</div>";html+='<a style="margin-left: 4%; margin-right: 4%; margin-bottom: 4%; margin-top: 4%;"><b style="text-transform: uppercase; margin-right:1%;"><img src="static/image/images/'+course_name+'_icon.png" style="margin-right: 2%;width: 5%;height: 40%;" alt="TEKLRN" width="35" height="25">'+b.technology_information+' </b>'+b.technology_description+'</a> '; html+="</div>";
for (var i = 1; i <= b.total_levels; i++) { 
    if(i!=b.current_level)
    
    html+='<div style="margin: 0%; margin-top: 0%;margin-bottom: 0%;" class="modal-dialog"><div onclick="hi(event, \''+course_name+'\', '+i+')"  style="height:100%; width:100%" class="modal-content"><a href="javascript:void(0);" style="margin-left: 4%; margin-right: 4%; margin-bottom: 4%; margin-top: 4%;"><b style="text-transform: uppercase; margin-right:1%;"><img src="static/image/images/'+course_name+'_icon.png" style="margin-right: 2%;width: 5%;height: 40%;" alt="TEKLRN" width="35" height="25"> '+course_name+' Level '+ i +' </b>'+ document.getElementById(i+'description').innerText+'</a> </div></div>';
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
    if(document.getElementById('1').innerText.includes("FREE")){
    document.getElementById('1').click();
    }
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

function logout() {
    $.ajax({
        url         : "/logout", // the url where we want to POST
        data        : {"email":'hi'}, // our data object
        dataType    : "html", // what type of data do\ we expect back from the server
        encode      : true
    })
        .done(function(data) {
            document.open("text/html", "load");
            document.write(data);
            document.close();
});

    // stop the form from submitting the normal way and refreshing the page
    event.preventDefault();
  }  



  function lvlclk1(crse){ 
    var iframe = '<canvas id="my_canvas" style="width : 100%; max-height: 70%;"></canvas><script>pdfjsLib.getDocument("./static/image/'+crse+'.pdf").promise.then(doc =>{console.log("This file has "+doc._pdfInfo.numPages + " pages");  doc.getPage(1).then(page =>{ var myCanvas = document.getElementById("my_canvas");var context =  myCanvas.getContext("2d");var viewport = page.getViewport({scale:1.5}); myCanvas.width = viewport.width; myCanvas.height = viewport.height;  page.render({ canvasContext:context, viewport:viewport  });   }); }); </script>'
    $.createModal({
    message: iframe,
    closeButton:true,
    scrollable:false
    });
    return false;        
 }


 function markCompletion(event, val){

    
    new Attention.Confirm({title: 'Mark Complete',
    content: 'Kindly mark it as complete if the course has been completed by the trainer',
    buttonCancel: false, // custom button text
    buttonConfirm: false,
    
    onCancel(component) {
    },
    onConfirm(component) {
      onAcceptEv(val);
     }
    
  });
    }
  
