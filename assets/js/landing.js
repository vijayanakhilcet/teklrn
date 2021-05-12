var image_name;
var course_name;
var course_level;
var mail_id_login;

$(function() {    

    $(document).on('hidden.bs.modal', function (event) {
        if ($('.modal:visible').length) {
          $('body').addClass('modal-open');
        }
      });

        var view_to_show = document.getElementById("technology_view_student").textContent;
        var desc_to_show = document.getElementById("description_view_student").textContent;
        course_name = view_to_show;    
        image_name = course_name+"_";  
        course_description = desc_to_show;     
        var runit = 0;     
        openMainView(course_description);
        getPendingStudentTrainings();
        getAcceptedStudentTrainings();
        getCompletedStudentTrainings();

        $("#myFormemail").click(function(event) {
                var mail_id = $('input[name=email]').val();
                mail_id_login=mail_id;
                // process the form
                $.ajax({
                    url         : "/checkuser", // the url where we want to POST
                    data        : {"email":mail_id}, // our data object
                    dataType    : "html", // what type of data do\ we expect back from the server
                    encode      : true
                }).done(function(data) {
                        document.open("text/html", "load")
                        document.write(data);
                        document.close();
                  });        
                // stop the form from submitting the normal way and refreshing the page
                event.preventDefault();
            });

            
            $("#book_course1").click(function(event) {
                // process the form
                $.ajax({
                    url         : "/book_course_form", // the url where we want to POST
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
            });

            $("#book_course").click(function(event) {

                if(course_name==null || course_level==null){
                  //  alert('Enter a course in the search box and select a level review the syllabus of the level before you proceed with booking');
              }else{
                booklogin();
              }
            });

           
            $("#book_course_login").click(function(event) {

                if(course_name==null || course_level==null){
                    //Alert will be shown
                }else{
                bookcrse();
              }
            });

            
            $("#user_profile").click(function() {
                $.ajax({
                    url         : "/userProfile", // the url where we want to POST
                    data        : {"email":'login'}, // our data object
                    dataType    : "html", // what type of data do\ we expect back from the server
                    encode      : true
                })
                    .done(function(data) {
                        document.open("text/html", "load")
                        document.write(data);
                        document.close();
              }); event.preventDefault();
              });
              


            $("#login_l").click(function(event) {
                // process the form
                $.ajax({
                    url         : "/loginForm", // the url where we want to POST
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
            });

            $("#login_t").click(function(event) {
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
                    });
        
                // stop the form from submitting the normal way and refreshing the page
                event.preventDefault();
            });

            $("#course-search").on('keyup', function (event) {
                if(runit === 0){
                    if (event.keyCode === 13) {                    
                        $("#course-search").blur();
                        technologiesOnSearchBar(event.target.value);
                    }
                }  
                        
                 runit = 0;   
            });   

            $("#course-search").autocomplete({
                source: "/autocomplete",
                dataType: 'json',
                select: function( event , ui ) {
                    additionalInfoOnTechnology();
                    $('#homeSubmenu').empty();
                    var elm = document.getElementById('homeSubmenu');
                   
                df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
                course_name = ui.item.name;
                image_name = course_name+'_';
                course_description = ui.item.value;
                setTechnology(ui.item.levels);
                setAssociatedTechnology();   
                resetSearchTopic();
                searchtopics();
                setMostSoughtTechnologies();
                runit = 1;
                course_level = null;
                for (var i = 1; i <= ui.item.levels; i++) { 
                    var li_element = document.createElement('li'); // create the option element
                    var aHtml = '<a style="text-transform:uppercase" href="#"><b>'+course_name+'</b> Level '+i+ ' '+'<br>'+
                    '<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;font-size: x-small;color: white;border-radius: .25rem;" onclick="lvlclk('+i+')"'+ '>Syllabus '+'<i style="vertical-align:middle;" class="fa fa-book" aria-hidden="true"></i></button>'+
                    ' <button style="font-size: x-small; border: 1px solid transparent;background-color: #7db2e0;font-size: x-small;color: white;border-radius: .25rem;" onclick="bookcrseNew(\''+course_name+'\', '+i+')"'+ '>Book Trainer'+'<i  style="vertical-align:middle;" class="fas fa-chalkboard-teacher"></i></button></a>';
                    li_element.innerHTML+=aHtml;
                    elm.appendChild(li_element); 
                }
                pdfjsLib.getDocument("./static/image/"+image_name+"1.pdf").promise.then(doc =>{
                console.log("This file has "+doc._pdfInfo.numPages + " pages");
      
                doc.getPage(1).then(page =>{
                var myCanvas = document.getElementById("my_canvas");
                var context =  myCanvas.getContext("2d");
        
                var viewport = page.getViewport({scale:3});
                myCanvas.width = viewport.width;
                myCanvas.height = viewport.height;
                page.render({
                canvasContext:context,
                viewport:viewport
            });
        });
      });
   
        }
});

           // onLoadAComplete();

         
         

            $("#teacherFormemail").submit(function(event) {

                // get the form data
                // there are many ways to get this data using jQuery (you can use the class or id also)
                var mail_id = $('input[name=teacheremail]').val();
                mail_id_login=mail_id;
        
                // process the form
                $.ajax({
                    url         : "/checkteacher", // the url where we want to POST
                    data        : {"email":mail_id}, // our data object
                    dataType    : "json", // what type of data do\ we expect back from the server
                    encode      : true
                })
                    // using the done promise callback
                    .done(function(data) {
                        closeteacherFormemail();        
                        // log data to the c    sole so we can see
                        if(ans1 = (Object.keys(data).length === 0) ){
                            openTeacherFormRegister();
                        }else{
                            openTeacherFormLogin();
                        }
                        
        
                        // here we will handle errors and validation messages
                    });
        
                // stop the form from submitting the normal way and refreshing the page
                event.preventDefault();
            });


            $("#myFormlogin").submit(function(event) {

                // get the form data
                // there are many ways to get this data using jQuery (you can use the class or id also)
                var mail_id = $('input[name=email_name]').val();
                var pwd = $('input[name=psw]').val();
                var image_name = 
        
                // process the form
                $.ajax({
                    url         : "/login_student", // the url where we want to POST
                    type        : 'post',
                    data        : {"course": course_name, "level": course_level, "email":mail_id, "pwd":pwd, "csrfmiddlewaretoken" : getCookie('csrftoken')}, // our data object
                    dataType    : "html", // what type of data do\ we expect back from the server
                    encode      : true
                })
                    // using the done promise callback
                   .done(function(data) {
                    closeFormLogin(); 
                    document.open("text/html", "load")
                    document.write(data);
                    document.close();
                        // here we will handle errors and validation messages
                    });
                   
                // stop the form from submitting the normal way and refreshing the page
                event.preventDefault();

            });

            $("#teacherFormLogin").submit(function(event) {

                // get the form data
                // there are many ways to get this data using jQuery (you can use the class or id also)
                var mail_id = $('input[id=teacher-email-id]').val();
                var pwd = $('input[name=teacher-psw]').val();
        
                // process the form
                $.ajax({
                    url         : "/login_teacher", // the url where we want to POST
                    type        : 'post',
                    data        : {"email":mail_id, "pwd":pwd, "csrfmiddlewaretoken" : getCookie('csrftoken')}, // our data object
                    dataType    : "html", // what type of data do\ we expect back from the server
                    encode      : true
                })
                    // using the done promise callback
                   .done(function(data) {
                    closeTeacherFormLogin(); 
                    document.open("text/html", "load")
                    document.write(data);
                    document.close();
                        // here we will handle errors and validation messages
                    });
                   
                // stop the form from submitting the normal way and refreshing the page
                event.preventDefault();

            });

            $("#myFormRegister").submit(function(event) {

                // get the form data
                // there are many ways to get this data using jQuery (you can use the class or id also)
                var mail_id = $('input[id=register-email]').val();
                var name = $('input[name=name-register]').val();
                var pwd = $('input[name=psw-register]').val();
                var e = document.getElementById('timezone-offset');
                var tz_n = e.options[e.selectedIndex].text;
        
                // process the form
                $.ajax({
                    url         : "/register_student", // the url where we want to POST
                    type        : 'post',
                    data        : {"course": course_name, "level": course_level, "email":mail_id, "name": name, "pwd":pwd, "tz_info":tz_n , "csrfmiddlewaretoken" : getCookie('csrftoken'), "course_description":course_description}, // our data object
                    dataType    : "html", // what type of data do\ we expect back from the server
                    encode      : true
                })
                    // using the done promise callback
                    .done(function(data) {
                        closeFormLogin(); 
                        document.open("text/html", "load")
                        document.write(data);
                        document.close();
                            // here we will handle errors and validation messages
                        });
        
                // stop the form from submitting the normal way and refreshing the page
                event.preventDefault();
            });


            $("#logout").click(function() {
                $.ajax({
                    url         : "/logout", // the url where we want to POST
                    data        : {"email":'hi'}, // our data object
                    dataType    : "html", // what type of data do\ we expect back from the server
                    encode      : true
                })
                    .done(function(data) {
                        document.open("text/html", "load")
                        document.write(data);
                        document.close();
        });
        
                // stop the form from submitting the normal way and refreshing the page
                event.preventDefault();
              });   
        


        $("#teacherFormRegister").submit(function(event) {

            // get the form data
            // there are many ways to get this data using jQuery (you can use the class or id also)
            var mail_id = $('input[id=teacher-email-register]').val();
            var name = $('input[name=teacher-name-register]').val();
            var pwd = $('input[name=teacher-psw-register]').val();
            var course_name = $('input[name=teacher-course-register]').val();
            var meeting_link= $('input[name=teacher-meeting-link]').val();
            var e = document.getElementById('timezone-offset-teacher');
            var tz_n = e.options[e.selectedIndex].text;
    
            // process the form
            $.ajax({
                url         : "/register_teacher", // the url where we want to POST
                type        : 'post',
                data        : {"course": course_name, "email":mail_id, "name": name, "pwd":pwd, "meetingLink": meeting_link, "tz_info": tz_n,  "csrfmiddlewaretoken" : getCookie('csrftoken'), "course_description":course_description}, // our data object
                dataType    : "html", // what type of data do\ we expect back from the server
                encode      : true
            })
                // using the done promise callback
                .done(function(data) {
                    closeTeacherFormRegister(); 
                    document.open("text/html", "load")
                    document.write(data);
                    document.close();
                        // here we will handle errors and validation messages
                    });
    
            // stop the form from submitting the normal way and refreshing the page
            event.preventDefault();
        });
    
    });

    function setView(crse) {
        //alert(crse+lvl);
        $.ajax({
            url         : "/setview", // the url where we want to POST
            data        : {"course_name":crse}, // our data object
            dataType    : "json", // what type of data do\ we expect back from the server
            encode      : true
        })
          
           
    
                event.preventDefault();
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
            var aHtml = '<a href="#">'+data[index].date+'<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;  vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="lvlclk1(\''+data[index].course+'_'+ data[index].level+'\')">Syllabus '+data[index].course+' Level     '+ data[index].level+' <i style="vertical-align:middle;" class="fa fa-book" aria-hidden="true"></i></button></a>';
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
            var aHtml = '<a href="#">'+data[index].date+'<button style="font-size: x-small; border: 1px solid transparent;background-color:  #7db2e0; vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" type="Submit" value="'+ data[index].pk + '" onclick="markCompletion(event, this.value)">Mark Complete <i  style="vertical-align:middle;" class="fas fa-check"></i></button><button style="font-size: x-small; margin-left: .2rem;   border: 1px solid transparent;background-color: #98bcdc;font-size: x-small;color: white;border-radius: .25rem;"  onclick="window.open('+'\''+data[index].meetingLink+'\''+')">Join  <i  style="vertical-align:middle;"  class="fas fa-video"></i></button> <button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;  vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="lvlclk1(\''+data[index].course+'_'+ data[index].level+'\')">Syllabus '+data[index].course+' Level     '+ data[index].level+' <i style="vertical-align:middle;" class="fa fa-book" aria-hidden="true"></i></button></a>';
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
            var aHtml = '<a href="#">'+data[index].date+'<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;  vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="lvlclk1(\''+data[index].course+'_'+ data[index].level+'\')">Syllabus '+data[index].course+' Level     '+ data[index].level+' <i style="vertical-align:middle;" class="fa fa-book" aria-hidden="true"></i></button></a>';
            li_element.innerHTML+=aHtml;
            elm.appendChild(li_element); 
          });

});

}

    
function technologiesOnSearchBar(pg){ 
    html_message = '';
    $.ajax({
        url         : "/getTechnologiesMatchingTheSearch", // the url where we want to POST
        data        : {"search_string":pg}, // our data object
        dataType    : 'json', // what type of data do we expect back from the server
        encode      : true
    })
        // using the done promise callback
        .done(function(data) {
            $.each(data, function(index) {
                html_message += '<h4 style="background-color: #629DD1; color: white;" href=""><div style="padding:2%; margin-left: 1%;"><b style="color: #f5eded;">  <a style="text-transform:uppercase">'+data[index].description+'</a></b><br><button style="vertical-align: middle;font-size: x-small; border: 1px solid transparent;  background-color: #155d9c; color:#ecf0f3;   font-size: x-small;  border-radius: .25rem;" onclick="openMainViewFromSearchResults(\''+data[index].description+'\')">Open <i class="fas fa-folder"></i></button></div></h4>';
               
            });
            $.createModalForSearch({
                message: html_message,
                closeButton:true,
                scrollable:false
                });   
        });
    event.preventDefault();
        
      //  var iframe = '<canvas id="my_canvas" style="width : 100%; max-height: 70%;"></canvas><script>pdfjsLib.getDocument("./static/image/'+image_name+pg+'.pdf").promise.then(doc =>{console.log("This file has "+doc._pdfInfo.numPages + " pages");  doc.getPage(1).then(page =>{ var myCanvas = document.getElementById("my_canvas");var context =  myCanvas.getContext("2d");var viewport = page.getViewport({scale:1.5}); myCanvas.width = viewport.width; myCanvas.height = viewport.height;  page.render({ canvasContext:context, viewport:viewport  });   }); }); </script>'
       
        return false;        
     }
    

     
function openMainViewFromSearchResults(val){
    openMainView(val);    
    setTimeout(() => {  document.getElementById("closeModal").click(); }, 200); 
}

    function search(ele) {
        if(event.key === 'Enter') {
            $.ajax({               
                url          : "/searchtopics", // the url where we want to POST
                data         : {"course_name":course_name, "keyword_data": ele.value},
                dataType     : 'json',
                encode       : true
            })
                // using the done promise callback
                 .done(function(data) {   
                    var elm = document.getElementById('searchtopics');
                    elm.innerHTML="";
                    var aHtml ="";
                    $.each(data, function(index) {
                        aHtml += '<h4  style="background-color: #629DD1; color: white;" href="">'+'<div style="padding:2%; margin-left: 1%;"><a style="float:left; margin-right:1%; color: #e1d7df;">LEVEL '+(index+1)+' </a><div id='+data[index].level+'description>'+data[index].value+ '</div>' +
                         '<button style="font-size: small; border: 1px solid transparent;background-color: #98bcdc;  vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" onclick="lvlclk('+data[index].level+')"'+ '> Syllabus <i style="vertical-align:middle;" class="fa fa-book" aria-hidden="true"></i>'+'</button>'+
                        ' <button style="font-size: small; border: 1px solid transparent;background-color: #7db2e0; vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" onclick="login_l(event, \''+course_name+'\', '+data[index].level+')"'+ '><a style="background-color:white; color:#4a82b3; padding-left:1px; padding-right:1px; margin-right: 2px;" >$13</a> Book Trainer'+' <i  style="vertical-align:middle;" class="fas fa-chalkboard-teacher"></i></button>';
                       
                        if(data[index].videoFree==true)
                        {
                            
                            aHtml+=' <button id='+data[index].level+' style="font-size: small; border: 1px solid transparent;background-color: #4a82b3; vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" onclick="videoClk1(event, \''+course_name+'\', '+data[index].level+', \''+data[index].value+'\', \''+data[index].videolink+'\', \''+data.length+'\' )"'+ '>FREE Video <i style="vertical-align: middle;" class="fas fa-play-circle"></i>'+'</button>';
                          
                            // aHtml+='<a style="margin-left: 1%; padding-left:1%; padding-right:1%; font-size: x-small; background: slategray; vertical-align: middle;">Free Video</a>';
                                }
                        else{
                            aHtml+=' <button id='+data[index].level+' style="font-size: small; border: 1px solid transparent;background-color: #4a82b3; vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" onclick="videoClk(event, \''+course_name+'\', '+data[index].level+')"'+ '> Video <i style="vertical-align: middle;" class="fas fa-play-circle"></i>'+'</button>';
                         
                            } var l;
                            aHtml+='<a style="padding-right: 1%"></a><br>';
                            for (l = 0; l < 5; l++) {
                                if(l<data[index].rating){
                                    aHtml+='<span style="font-size:45%;vertical-align: middle;" class="fa fa-star checked"></span>';
                                }
                                else{
                                    aHtml+='<span style="color:grey; font-size:45%;vertical-align: middle;" class="fa fa-star checked"></span>';
                            
                                }
                                aHtml+='<a style="padding-right: .4%"></a>';
                            }
                            aHtml+='<a style="padding-right: 1%"></a>';
                            aHtml+='<a style="vertical-align: middle;font-size: small">('+data[index].rating+'/5) '+data[index].reviewCount+' Ratings</a>';
                            aHtml+='</div></h4>';
                         
                     
                    });
                    elm.innerHTML=aHtml;    
        });
            // stop the form from submitting the normal way and refreshing the page
            event.preventDefault();
          
        }
    }

    function searchtopics() {
            $.ajax({               
                url          : "/searchtopics", // the url where we want to POST
                data         : {"course_name":course_name, "keyword_data": "Teklrn"},
                dataType     : 'json',
                encode       : true
            })
                // using the done promise callback
                 .done(function(data) {   
                    var elm = document.getElementById('searchtopics');
                    elm.innerHTML="";
                    var aHtml ="";
                    $.each(data, function(index) {
                        aHtml += '<h4  style="background-color: #629DD1; color: white;" href="">'+'<div style="padding:2%;margin-left: 1%;"><a style="float:left; margin-right:1%;color: #e1d7df;">LEVEL '+(index+1)+' </a><div id='+data[index].level+'description>'+data[index].value+ '</div>' +
                        '<button style="font-size: small; border: 1px solid transparent;background-color: #98bcdc;  vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" onclick="lvlclk('+data[index].level+')"'+ '>Syllabus <i style="vertical-align:middle;" class="fa fa-book" aria-hidden="true"></i>'+'</button>'+
                        ' <button style="font-size: small; border: 1px solid transparent;background-color: #7db2e0; vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" onclick="login_l(event, \''+course_name+'\', '+data[index].level+')"'+ '><a style="background-color:white; color:#4a82b3; padding-left:1px; padding-right:1px; margin-right: 2px;" >$13</a> Book Trainer'+'<i style="vertical-align:middle;" class="fas fa-chalkboard-teacher"></i></button>';
                        if(data[index].videoFree==true)
                        {
                            
                            aHtml+=' <button id='+data[index].level+' style="font-size: small; border: 1px solid transparent;background-color: #4a82b3; vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" onclick="videoClk1(event, \''+course_name+'\', '+data[index].level+', \''+data[index].value+'\', \''+data[index].videolink+'\', \''+data.length+'\' )"'+ '>FREE Video <i style="vertical-align: middle;" class="fas fa-play-circle"></i>'+'</button>';
                          
                        }
                        else{
                            aHtml+=' <button id='+data[index].level+' style="font-size: small; border: 1px solid transparent;background-color: #4a82b3; vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" onclick="videoClk(event, \''+course_name+'\', '+data[index].level+')"'+ '><a style="background-color:white; color:#4a82b3; padding-left:1px; padding-right:1px; margin-right: 2px;" >$3</a> Video <i style="vertical-align: middle;" class="fas fa-play-circle"></i>'+'</button>';
                            
                        }
                        var l;
                        aHtml+='<a style="padding-right: 1%"></a><br>';
                        for (l = 0; l < 5; l++) {
                            if(l<data[index].rating){
                                aHtml+='<span style="font-size:45%;vertical-align: middle;" class="fa fa-star checked"></span>';
                            }
                            else{
                                aHtml+='<span style="color:grey; font-size:45%;vertical-align: middle;" class="fa fa-star checked"></span>';
                            
                            }
                            aHtml+='<a style="padding-right: .4%"></a>';
                        }
                        aHtml+='<a style="padding-right: 1%"></a>';
                        aHtml+='<a style="vertical-align: middle;font-size: small"> ('+data[index].rating+'/5) '+data[index].reviewCount+' Ratings</a>';
                        aHtml+='</div></h4>';
                     
                    });
                    elm.innerHTML=aHtml;   
                    clk(); 
        });
            // stop the form from submitting the normal way and refreshing the page
            event.preventDefault();
          
        
    }

    function hi(event, crse, lvl){
    
        document.getElementById('closex').click();
        document.getElementById(lvl).click();
    }

    
    function setMostSoughtTechnologies(){
        $.ajax({
            url         : "/get_most_sought", // the url where we want to POST
            data        : {"course":course_name}, // our data object
            dataType    : "json", // what type of data do\ we expect back from the server
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {
                
                
                          var elm = document.getElementById('most_t');
                         elm.innerHTML="";
                         var aHtml ="";
        
             $.each(data, function(index) {
    
              aHtml += '<h4  style="background-color: #629DD1; color: white;" href="">'+'<div style="padding:2%; margin-left: 1%;"><b style="color: #f5eded;">  <a style="text-transform:uppercase">'+data[index].description+'</a></b><br><button style="vertical-align: middle;font-size: x-small; border: 1px solid transparent;  background-color: #155d9c; color:#ecf0f3;   font-size: x-small;  border-radius: .25rem;" onclick="openMainView( \''+data[index].description+'\')">View <i class="fas fa-folder"></i></button></div></h4>';
                       
              });
              elm.innerHTML=aHtml; 
            });
    }
    
    function clk(){
        if(document.getElementById('1').innerText.includes("FREE")){
        document.getElementById('1').click();
        }
    }
    

    function setdefaultLevels(){
        $("#course-search").val("Tensorflow");
        $('#homeSubmenu').empty();
        var elm = document.getElementById('homeSubmenu');
        df = document.createDocumentFragment();
        for (var i = 1; i <= 21; i++) { 
           var li_element = document.createElement('li'); // create the option element
           var aHtml = '<a style="text-transform:uppercase" href="#"><b>'+course_name+'</b> Level '+i+ ' '+'<br>'+
           '<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;font-size: x-small;color: white;border-radius: .25rem;" onclick="lvlclk('+i+')"'+ '>Syllabus '+'<i style="vertical-align:middle;" class="fa fa-book" aria-hidden="true"></i></button>'+
          ' <button style="font-size: x-small; border: 1px solid transparent;background-color: #7db2e0;font-size: x-small;color: white;border-radius: .25rem;" onclick="login_l(event, \'Tensorflow\', '+i+')"'+ '>Book Trainer'+'<i  style="vertical-align:middle;" class="fas fa-chalkboard-teacher"></i></button></a>';
              li_element.innerHTML+=aHtml;
                   
                 elm.appendChild(li_element); 
                 
    }
    }
    
        function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

(function(a){a.createModalForDesignationsCertification=function(b){defaults={title:"",message:"Your Message Goes Here!",closeButton:false,scrollable:true};var b=a.extend({},defaults,b);var c=(b.scrollable===true)?'style="max-height: 100%;overflow-y: auto;"':"";html='<div class="modal fade" id="myModal">';html+='<div class="modal-dialog">';html+='<div class="modal-content">';html+='<div style="border-bottom:none" class="modal-header">';html+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';if(b.title.length>0){html+='<h4 class="modal-title">'+b.title+"</h4>"}html+='</div><div><div><h4 style="margin-left: 4%;margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: \'Antietam\';font-size: x-large;"><img src="static/image/images/2.png" style="padding-right:1%;width: 10%;height:90%;" alt="TEKLRN" width="35" height="25"> TEKLRN </h4></div><div style="margin-left: 4%;"><h4 style="margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: inherit;">TECHNOLOGY CERTIFICATION COURSES </h4></div></div>';html+='<div class="modal-body" '+c+">";html+=b.message;html+="</div>";html+='<div style="border-top:none" class="modal-footer">';if(b.closeButton===true){html+='<button id="closeModal" type="button" style="background-color: white; color: #629DD1" class="btn btn-primary" data-dismiss="modal">Close</button>'}html+="</div>";html+="</div>";html+="</div>";html+="</div>";a("body").prepend(html);a("#myModal").modal().on("hidden.bs.modal",function(){a(this).remove()})}})(jQuery);

(function(a){a.createModalForDesignations=function(b){defaults={title:"",message:"Your Message Goes Here!",closeButton:false,scrollable:true};var b=a.extend({},defaults,b);var c=(b.scrollable===true)?'style="max-height: 100%;overflow-y: auto;"':"";html='<div class="modal fade" id="myModal">';html+='<div class="modal-dialog">';html+='<div class="modal-content">';html+='<div style="border-bottom:none" class="modal-header">';html+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';if(b.title.length>0){html+='<h4 class="modal-title">'+b.title+"</h4>"}html+='</div><div><div><h4 style="margin-left: 4%;margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: \'Antietam\';font-size: x-large;"><img src="static/image/images/2.png" style="padding-right:1%;width: 10%;height:90%;" alt="TEKLRN" width="35" height="25"> TEKLRN </h4></div><div style="margin-left: 4%;"><h4 style="margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: inherit;">SUPPORTED SOFTWARE / IT / TECHNOLOGY DESIGNATIONS </h4></div></div>';html+='<div class="modal-body" '+c+">";html+=b.message;html+="</div>";html+='<div style="border-top:none" class="modal-footer">';if(b.closeButton===true){html+='<button id="closeModal" type="button" style="background-color: white; color: #629DD1" class="btn btn-primary" data-dismiss="modal">Close</button>'}html+="</div>";html+="</div>";html+="</div>";html+="</div>";a("body").prepend(html);a("#myModal").modal().on("hidden.bs.modal",function(){a(this).remove()})}})(jQuery);

(function(a){a.createModalForSearch=function(b){defaults={title:"",message:"Your Message Goes Here!",closeButton:false,scrollable:true};var b=a.extend({},defaults,b);var c=(b.scrollable===true)?'style="max-height: 100%;overflow-y: auto;"':"";html='<div class="modal fade" id="myModal">';html+='<div class="modal-dialog">';html+='<div class="modal-content">';html+='<div style="border-bottom:none" class="modal-header">';html+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';if(b.title.length>0){html+='<h4 class="modal-title">'+b.title+"</h4>"}html+='</div><div><div><h4 style="margin-left: 4%;margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: \'Antietam\';font-size: x-large;"><img src="static/image/images/2.png" style="padding-right:1%;width: 10%;height:90%;" alt="TEKLRN" width="35" height="25"> TEKLRN </h4></div><div style="margin-left: 4%;"><h4 style="margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: inherit;">SEARCH RESULTS: </h4></div></div>';html+='<div class="modal-body" '+c+">";html+=b.message;html+="</div>";html+='<div style="border-top:none" class="modal-footer">';if(b.closeButton===true){html+='<button id="closeModal" type="button" style="background-color: white; color: #629DD1" class="btn btn-primary" data-dismiss="modal">Close</button>'}html+="</div>";html+="</div>";html+="</div>";html+="</div>";a("body").prepend(html);a("#myModal").modal().on("hidden.bs.modal",function(){a(this).remove()})}})(jQuery);

(function(a){a.createModal=function(b){defaults={title:"",message:"Your Message Goes Here!",closeButton:false,scrollable:true};var b=a.extend({},defaults,b);var c=(b.scrollable===true)?'style="max-height: 100%;overflow-y: auto;"':"";html='<div class="modal fade" id="myModal">';html+='<div class="modal-dialog">';html+='<div class="modal-content">';html+='<div style="border-bottom:none" class="modal-header">';html+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';if(b.title.length>0){html+='<h4 class="modal-title">'+b.title+"</h4>"}html+='</div><h4 style="margin-left: 4%;margin-bottom: 4%;  text-align: left;color: inherit;font-size:inherit;font-family: \'Antietam\';font-size: x-large;"><img src="static/image/images/2.png" style="padding-right:1%;width: 10%;height:90%;" alt="TEKLRN" width="35" height="25"> TEKLRN </h4><div style="margin-left: 4%; margin-right: 4%"><h4 style="margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: inherit;">TECHNOLOGY PROFICIENCY CERTIFICATION<br><br><a style="font-weight:bolder">'+ course_name.toUpperCase() +' PROFESSIONAL TECHNOLOGY DEVELOPER LEVEL '+b.current_level+'</a></h4></div>';html+='<div class="modal-body" '+c+">";html+=b.message;html+="</div>";html+='<div style="border-top:none" class="modal-footer">';if(b.closeButton===true){html+='<button type="button" style="background-color: white; color: #629DD1" class="btn btn-primary" data-dismiss="modal">Close</button>'}html+="</div>";html+="</div>";html+="</div>";html+="</div>";a("body").prepend(html);a("#myModal").modal().on("hidden.bs.modal",function(){a(this).remove()})}})(jQuery);

(function(a){a.createModalVid=function(b){defaults={title:"",message:"Your Message Goes Here!",closeButton:false,scrollable:true};var b=a.extend({},defaults,b);var c=(b.scrollable===true)?'style="max-height: 100%;overflow-y: auto;"':"";html='<div class="modal fade" id="myModal">';html+='<div style="height:100%;" class="modal-dialog">';html+='<div style="height:100%; width:100%" class="modal-content">';html+='<div style="border-bottom:none" class="modal-header">';html+='<button id="closex" type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';if(b.title.length>0){html+='<h4 class="modal-title">'+b.title+"</h4>"}html+='</div><div><div><h4 style="margin-left: 4%;margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: \'Antietam\';font-size: x-large;"><img src="static/image/images/2.png" style="padding-right:1%;width: 10%;height:90%;" alt="TEKLRN" width="35" height="25"> TEKLRN </h4></div><div style="margin-left: 4%; margin-right: 4%;"><h4 style="margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: inherit;">TECHNOLOGY PROFICIENCY CERTIFICATION<br><br><a style="font-weight:bolder">'+ course_name.toUpperCase() +' PROFESSIONAL TECHNOLOGY DEVELOPER </a> </h4></div></div>';html+='<div style="text-transform:uppercase; padding-left:0.1rem; padding-right:0.1rem; padding:0rem; class="modal-body" '+c+">";html+=b.message;html+="</div>";html+='<a style="margin-left: 4%; margin-right: 4%; margin-bottom: 4%; margin-top: 4%;"><b style="text-transform: uppercase; margin-right:1%;"><img src="static/image/images/'+course_name+'_icon.png" style="margin-right: 2%;width: 5%;height: 40%;" alt="TEKLRN" width="35" height="25">'+b.technology_information+' </b>'+b.technology_description+'</a> '; html+="</div>";
for (var i = 1; i <= b.total_levels; i++) { 
    if(i!=b.current_level)
    
    html+='<div style="margin: 0%; margin-top: 0%;margin-bottom: 0%;" class="modal-dialog"><div onclick="hi(event, \''+course_name+'\', '+i+')"  style="height:100%; width:100%" class="modal-content"><a href="javascript:void(0);" style="margin-left: 4%; margin-right: 4%; margin-bottom: 4%; margin-top: 4%;"><b style="text-transform: uppercase; margin-right:1%;"><img src="static/image/images/'+course_name+'_icon.png" style="margin-right: 2%;width: 5%;height: 40%;" alt="TEKLRN" width="35" height="25"> '+course_name+' Level '+ i +' </b>'+ document.getElementById(i+'description').innerText+'</a> </div></div>';
}   
    html+="</div>";html+="</div>";a("body").prepend(html);a("#myModal").modal().on("hidden.bs.modal",function(){a(this).remove()})}})(jQuery);

/*
* Here is how you use it
*/

function resetSearchTopic(){
    $("#search-topics").val("");    
    $('#searchtopics').empty();
}

function openCertificationsForThisDesignation(val){
    openTechnologyList(val);   
    document.getElementById("closeModal").click();
    
}

function openTechnologyList(val){ 
    html_message = '';
    $.ajax({
        url         : "/getTechnologiesForDesignations", // the url where we want to POST
        data        : {"search_string":val}, // our data object
        dataType    : 'json', // what type of data do we expect back from the server
        encode      : true
    })
        // using the done promise callback
        .done(function(data) {
            $.each(data, function(index) {
                html_message += '<h4 style="background-color: #629DD1; color: white;" href=""><div style="padding:2%; margin-left: 1%;"><b style="color: #f5eded;">  <a style="text-transform:uppercase"> '+data[index].technology+'</a></b><br><button style="vertical-align: middle;font-size: x-small; border: 1px solid transparent;  background-color: #155d9c; color:#ecf0f3;   font-size: x-small;  border-radius: .25rem;" onclick="openMainViewFromSearchResults(\''+data[index].description+'\')">Open <i class="fas fa-folder"></i></button></div></h4>';
               
            });
            $.createModalForDesignationsCertification({
                message: html_message,
                closeButton:true,
                scrollable:false
                });   
        });
    event.preventDefault();
        
      //  var iframe = '<canvas id="my_canvas" style="width : 100%; max-height: 70%;"></canvas><script>pdfjsLib.getDocument("./static/image/'+image_name+pg+'.pdf").promise.then(doc =>{console.log("This file has "+doc._pdfInfo.numPages + " pages");  doc.getPage(1).then(page =>{ var myCanvas = document.getElementById("my_canvas");var context =  myCanvas.getContext("2d");var viewport = page.getViewport({scale:1.5}); myCanvas.width = viewport.width; myCanvas.height = viewport.height;  page.render({ canvasContext:context, viewport:viewport  });   }); }); </script>'
       
        return false;        
     }


function designationsClick(){ 
    html_message = '';
    $.ajax({
        url         : "/getSupportedDesignations", // the url where we want to POST
        data        : {"search_string":course_name}, // our data object
        dataType    : 'json', // what type of data do we expect back from the server
        encode      : true
    })
        // using the done promise callback
        .done(function(data) {
            $.each(data, function(index) {
                html_message += '<h4 style="background-color: #629DD1; color: white;" href=""><div style="padding:2%; margin-left: 1%;"><b style="color: #f5eded;">  <a style="text-transform:uppercase"><i class="fa fa-briefcase" aria-hidden="true"></i> '+data[index].designation+'</a></b><br><button style="vertical-align: middle;font-size: x-small; border: 1px solid transparent;  background-color: #155d9c; color:#ecf0f3;   font-size: x-small;  border-radius: .25rem;" onclick="openCertificationsForThisDesignation(\''+data[index].designation+'\')">Technology Certifications <i class="fa fa-graduation-cap" aria-hidden="true"></i></button></div></h4>';
               
            });
            $.createModalForDesignations({
                message: html_message,
                closeButton:true,
                scrollable:false
                });   
        });
    event.preventDefault();
        
      //  var iframe = '<canvas id="my_canvas" style="width : 100%; max-height: 70%;"></canvas><script>pdfjsLib.getDocument("./static/image/'+image_name+pg+'.pdf").promise.then(doc =>{console.log("This file has "+doc._pdfInfo.numPages + " pages");  doc.getPage(1).then(page =>{ var myCanvas = document.getElementById("my_canvas");var context =  myCanvas.getContext("2d");var viewport = page.getViewport({scale:1.5}); myCanvas.width = viewport.width; myCanvas.height = viewport.height;  page.render({ canvasContext:context, viewport:viewport  });   }); }); </script>'
       
        return false;        
     }


function lvlclk(pg){ 
       // var iframe = '<canvas id="my_canvas" style="width : 100%; max-height: 70%;"></canvas><script>pdfjsLib.getDocument("./static/image/'+image_name+pg+'.pdf").promise.then(doc =>{console.log("This file has "+doc._pdfInfo.numPages + " pages");  doc.getPage(1).then(page =>{ var myCanvas = document.getElementById("my_canvas");var context =  myCanvas.getContext("2d");var viewport = page.getViewport({scale:1.5}); myCanvas.width = viewport.width; myCanvas.height = viewport.height;  page.render({ canvasContext:context, viewport:viewport  });   }); }); </script>'
       var iframe = '<canvas id="my_canvas" style="width : 100%; max-height: 70%;"></canvas><script>pdfjsLib.getDocument("./static/image/'+image_name+pg+'.pdf").promise.then(doc =>{console.log("This file has "+doc._pdfInfo.numPages + " pages");  doc.getPage(1).then(page =>{ var myCanvas = document.getElementById("my_canvas");var context =  myCanvas.getContext("2d");var viewport = page.getViewport({scale:1.5}); myCanvas.width = viewport.width; myCanvas.height = viewport.height;  page.render({ canvasContext:context, viewport:viewport  });   }); }); </script>'
        $.createModal({
        current_level:  pg,
        message: iframe,
        closeButton:true,
        scrollable:false
        });
        return false;        
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

        function onLoadAComplete(){

          
           $("#course-search").val('JavaScript'); 
            $("#course-search").autocomplete("search", "JavaScript");
            $('#course-search').autocomplete({autoFocus:true});
            

               
        }
function levelClick(event) {

// document.getElementById("course-pdf").src = "/static/image/"+image_name+event.id+".pdf";
 pdfjsLib.getDocument("./static/image/"+image_name+event.id+".pdf").promise.then(doc =>{
    console.log("This file has "+doc._pdfInfo.numPages + " pages");
  
    doc.getPage(1).then(page =>{
        var myCanvas = document.getElementById("my_canvas");
        var context =  myCanvas.getContext("2d");
  
        var viewport = page.getViewport({scale:3});
        myCanvas.width = viewport.width;
        myCanvas.height = viewport.height;
        page.render({
            canvasContext:context,
            viewport:viewport
        });
    });
  });

 course_level = event.id;

 }

 function openMainView(val){
   $("#course-search").val(val);
  // $("#course-search").data('ui-autocomplete')._trigger('select', 'autocompleteselect', {item:{value:val}});
  
  $.ajax({
     url         : "/autocomplete", // the url where we want to POST
     data        : {"term":val}, // our data object
     dataType    : "json", // what type of data do\ we expect back from the server
     encode      : true
 })
     // using the done promise callback
     .done(function(data) {
         
         
        
        
 df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
 course_name = data[0].name;
 image_name = course_name+'_';
 course_level = null; 
 course_description = data[0].description
 additionalInfoOnTechnology();
 setMostSoughtTechnologies();
 setAssociatedTechnology(); 
 resetSearchTopic();
 searchtopics();

   $.each(data, function(index) {
     $('#homeSubmenu').empty();
     var elm = document.getElementById('homeSubmenu');
     for (var i = 1; i <= data[0].levels; i++) { 
         console.log (data[index].levels);
 var li_element = document.createElement('li'); // create the option element
 var aHtml = '<a style="text-transform:uppercase" href="#"><b>'+course_name+'</b> Level '+i+ ' '+'<br>'+
 '<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;font-size: x-small;color: white;border-radius: .25rem;" onclick="lvlclk('+i+')"'+ '>Syllabus '+'<i style="vertical-align:middle;" class="fa fa-book" aria-hidden="true"></i></button>'+
' <button style="font-size: x-small; border: 1px solid transparent;background-color: #7db2e0;font-size: x-small;color: white;border-radius: .25rem;" onclick="login_l(event, \''+course_name+'\', '+i+')"'+ '>Book Trainer'+'<i  style="vertical-align:middle;" class="fas fa-chalkboard-teacher"></i></button></a>';
li_element.innerHTML+=aHtml;
          
        elm.appendChild(li_element); 
        setTechnology(data[0].levels);
        window.scrollTo({ top: 0, behavior: 'smooth' });
     }
     });
 });
   
 }
 

 function setAssociatedTechnology(){
    $.ajax({
        url         : "/get_associated", // the url where we want to POST
        data        : {"course":course_name}, // our data object
        dataType    : "json", // what type of data do\ we expect back from the server
        encode      : true
    })
        // using the done promise callback
        .done(function(data) {
            
            
                      var elm = document.getElementById('associated_t');
                     elm.innerHTML="";
                     var aHtml ="";
    
         $.each(data, function(index) {

            aHtml += '<h4  style="background-color: #629DD1; color: white;" href="">'+'<div style="padding:2%; margin-left: 1%;"><b style="color: #f5eded;">  <a style="text-transform:uppercase">'+data[index].description+'</a></b><br> <button style="vertical-align: middle;font-size: x-small; border: 1px solid transparent;  background-color: #155d9c; color:#ecf0f3;   font-size: x-small;  border-radius: .25rem;" onclick="openMainView( \''+data[index].description+'\')">View <i class="fas fa-folder"></i></button></div></h4>';
                     
          });
          elm.innerHTML=aHtml; 
        });
}

function additionalInfoOnTechnology(){
     
    $('#moreinfoviewID').empty();
    var moreinfoviewelement = document.getElementById('moreinfoviewID');
    var versionLiElement = document.createElement('li');
    var aElementHtmlVersion = '<a style="text-transform:uppercase" href="#"><b>version </b> History <br>'+
    '<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;font-size: x-small;color: white;border-radius: .25rem;" onclick="version_history()"'+ '>View '+'<i style="vertical-align:middle;" class="fa fa-arrow-circle-right" aria-hidden="true"></i></button></a>';
    versionLiElement.innerHTML+=aElementHtmlVersion;
    moreinfoviewelement.appendChild(versionLiElement); 

    var industryLiElement = document.createElement('li');
    var aElementHtmlIndustry = '<a style="text-transform:uppercase" href="#"><b>Industry </b> Acceptance <br>'+
    '<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;font-size: x-small;color: white;border-radius: .25rem;" onclick="industry_acceptance()"'+ '>View '+'<i style="vertical-align:middle;" class="fas fa-industry"></i></button></a>';
    industryLiElement.innerHTML+=aElementHtmlIndustry;
    moreinfoviewelement.appendChild(industryLiElement); 

    var trendsLiElement = document.createElement('li');
    var aElementHtmlTrends = '<a style="text-transform:uppercase" href="#"><b>Development </b> Trends <br>'+
    '<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;font-size: x-small;color: white;border-radius: .25rem;" onclick="dev_trends()"'+ '>View '+'<i style="vertical-align:middle;" class="fas fa-chart-line"></i></button></a>';
    trendsLiElement.innerHTML+=aElementHtmlTrends;
    moreinfoviewelement.appendChild(trendsLiElement); 

    var linkedLiElement = document.createElement('li');
    var aElementHtmlLinked = '<a style="text-transform:uppercase" href="#"><b>Linked </b> Technologies <br>'+
    '<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;font-size: x-small;color: white;border-radius: .25rem;" onclick="associated_tech()"'+ '>View '+'<i style="vertical-align:middle;" class="fas fa-link"></i></button></a>';
    linkedLiElement.innerHTML+=aElementHtmlLinked;
    moreinfoviewelement.appendChild(linkedLiElement); 
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

function parseVideoLink(linkVid){        
    var tmpStr  = linkVid.match("/d/(.*)/preview");
    var newStr = 'https://drive.google.com/uc?export=download&id='+tmpStr[1];
    return newStr;
}

function videoClk1(event, crse, lvl, description, videolink, levels_total){ 
        var iframe = '<video poster="static/image/images/poster.jpg" autoplay playsinline id="frameclk" controls height="100%" width="100%"><source src="'+parseVideoLink(videolink)+'" type="video/mp4"></video><div style="width: 80px; height: 80px; position: absolute; opacity: 0; right: 0px; top: 0px;">&nbsp;</div>';
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


 

 function bookingSyllabus(event, val) {
     
  var page = "/static/image/"+val+".pdf";
  //document.getElementById("course-pdf").src = page;
  pdfjsLib.getDocument("./static/image/"+val+".pdf").promise.then(doc =>{
    console.log("This file has "+doc._pdfInfo.numPages + " pages");
  
    doc.getPage(1).then(page =>{
        var myCanvas = document.getElementById("my_canvas");
        var context =  myCanvas.getContext("2d");
  
        var viewport = page.getViewport({scale:3});
        myCanvas.width = viewport.width;
        myCanvas.height = viewport.height;
        page.render({
            canvasContext:context,
            viewport:viewport
        });
    });
  });

  event.preventDefault();
   
    } 

 function closeteacherFormemail() {
    document.getElementById("temailPopup").style.display = "none";
  }

  function openteacherFormemail() {
    document.getElementById("temailPopup").style.display = "block";
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

  function onAcceptEv(val)
  {     

    $.ajax({
      url         : "/markCompletion", // the url where we want to POST
      data        : {"pk":val}, // our data object
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

  function bookcrseNew(crse, leveChekced){
    $.ajax({
        url         : "/bookingForm", // the url where we want to POST
        data        : {"course": crse, "level": leveChekced, "course_description": course_description}, // our data object
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
 
  function bookcrse(){
    $.ajax({
        url         : "/bookingForm", // the url where we want to POST
        data        : {"course": course_name, "level": course_level}, // our data object
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


  function booklogin(){
                $.ajax({
                    url         : "/loginForm", // the url where we want to POST
                    data        : {"email":'login', "course": course_name, "level": course_level}, // our data object
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

 function openForm() {
    if(course_name==null || course_level==null){
        document.getElementById("alertPopup").style.display = "block";
    }else{
     
    document.getElementById("emailPopup").style.display = "block";
    }
  }

  function openStudentForm() {
        
    document.getElementById("emailPopup").style.display = "block";
    
  }

  function alertbx(){
    Modal.alert('Hello World!');
  }


  function closePopup() {
    document.getElementById("alertPopup").style.display = "none";
  }
  
  function closeForm() {
    document.getElementById("emailPopup").style.display = "none";
  }

  function openFormLogin() {
    document.getElementById("loginPopup").style.display = "block";
    $("#email-id").val(mail_id_login);

  }
  
  function closeFormLogin() {
    document.getElementById("loginPopup").style.display = "none";
  }

  function openTeacherFormLogin() {
    document.getElementById("tloginPopup").style.display = "block";
    $("#teacher-email-id").val(mail_id_login);

  }

  function setTechnology(level_val){
    document.getElementById('tec_name').text = course_description;    
    document.getElementById('tec_name1').text = course_description;
    document.getElementById('tot_levls').text = level_val;

}
  
  function closeTeacherFormLogin() {
    document.getElementById("tloginPopup").style.display = "none";
  }

  

  function openFormRegister() {
    document.getElementById("registerPopup").style.display = "block";
    $("#register-email").val(mail_id_login);

  }
  
  function closeFormRegister() {
    document.getElementById("registerPopup").style.display = "none";
  }

  function openTeacherFormRegister() {
    document.getElementById("tRegisterPopup").style.display = "block";
    $("#teacher-email-register").val(mail_id_login);

  }

  function closeTeacherFormRegister() {
    document.getElementById("tRegisterPopup").style.display = "none";
  }



  