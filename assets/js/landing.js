var image_name;
var course_name;
var course_level;
var mail_id_login;
        $(function() {
            image_name = 'Java_';
        course_name = 'Java';   
        document.getElementById('tech_field').innerHTML = 'Technology : '+course_name;
        document.getElementById('level_field').innerHTML = 'Total Levels : 21';
        setAssociatedTechnology();
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
               /*  while (elm.hasChildNodes()) {
                     elm.removeChild(elm.firstChild);
                  }*/
        
                 $.each(data, function(index) {
                    var li_element = document.createElement('li'); // create the option element
                   
                  //  var aHtml = '<div font-size: xx-small;><br><label><input type="radio" name="sel3" id="courseSelect" value="' + data[index].course+'_'+ data[index].level+'"'+' onchange="thisisSelected(event, this.value)" '+'>'+data[index].course+' '+'-'+data[index].level+ ' on : '+data[index].date+' </label> <button style="font-size: xx-small; float: right; color: #39739d; background-color: #e1ecf4;  border-color: #7aa7c7;"  type="Submit" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="thisisSelected(event, this.value)">Syllabus</button></div>'+'<br>';
                     var aHtml = '<a href="#">'+data[index].date+
                     '<button style="font-size: x-small; border: 1px solid transparent;background-color: slategrey;font-size: x-small;color: white;border-radius: .25rem;" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="lvlclk1(\''+data[index].course+'_'+ data[index].level+'\')">View syllabus '+data[index].course+' Level     '+ data[index].level+'</button></a>';
                   
                  //  var node = document.createTextNode(data[index].course+' '+'level '+data[index].level+ ' date '+data[index].date);
                   //  var ele = document.createElement('div');
                   li_element.innerHTML+=aHtml;
                  //  ele.appendChild(node);
                   // elm.appendChild(ele);
                    
                   elm.appendChild(li_element); 
                  });
        
        });

        $.ajax({
            url         : "/get_accepted_student_trainings", // the url where we want to POST
            data        : {"course":"ab"}, // our data object
            dataType    : "json", // what type of data do\ we expect back from the server
            encode      : true
        })
            // using the done promise callback
            .done(function(data) {
                $('#accepted').empty();
                var elm = document.getElementById('accepted');
           /*  while (elm.hasChildNodes()) {
                 elm.removeChild(elm.firstChild);
              }*/
    
             $.each(data, function(index) {
                var li_element = document.createElement('li'); // create the option element
               
              //  var aHtml = '<div font-size: xx-small;><br><label><input type="radio" name="sel3" id="courseSelect" value="' + data[index].course+'_'+ data[index].level+'"'+' onchange="thisisSelected(event, this.value)" '+'>'+data[index].course+' '+'-'+data[index].level+ ' on : '+data[index].date+' </label> <button style="font-size: xx-small; float: right; color: #39739d; background-color: #e1ecf4;  border-color: #7aa7c7;"  type="Submit" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="thisisSelected(event, this.value)">Syllabus</button></div>'+'<br>';
                 var aHtml = '<a href="#">'+data[index].date+
                 '<button style="font-size: x-small;    border: 1px solid transparent;  background-color: #17a2b8; font-size: x-small;color: white; border-radius: .25rem;" type="Submit" value="'+ data[index].pk + '" onclick="markCompletion(event, this.value)">Mark complete</button><button style="font-size: x-small; margin-left: .2rem;   border: 1px solid transparent;background-color: #17a2b8;font-size: x-small;color: white;border-radius: .25rem;"  onclick="window.open('+'\''+data[index].meetingLink+'\''+')">Join session</button><button style="font-size: x-small; border: 1px solid transparent;background-color: slategrey;font-size: x-small;color: white;border-radius: .25rem;" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="lvlclk1(\''+data[index].course+'_'+ data[index].level+'\')">View syllabus '+data[index].course+' Level     '+ data[index].level+'</button></a>';
               
              //  var node = document.createTextNode(data[index].course+' '+'level '+data[index].level+ ' date '+data[index].date);
               //  var ele = document.createElement('div');
               li_element.innerHTML+=aHtml;
              //  ele.appendChild(node);
               // elm.appendChild(ele);
                
               elm.appendChild(li_element); 
              });
    
    });



    $.ajax({
        url         : "/get_completed_student_trainings", // the url where we want to POST
        data        : {"course":"ab"}, // our data object
        dataType    : "json", // what type of data do\ we expect back from the server
        encode      : true
    })
        // using the done promise callback
        .done(function(data) {
            $('#completed').empty();
            var elm = document.getElementById('completed');
       /*  while (elm.hasChildNodes()) {
             elm.removeChild(elm.firstChild);
          }*/

         $.each(data, function(index) {
            var li_element = document.createElement('li'); // create the option element
           
          //  var aHtml = '<div font-size: xx-small;><br><label><input type="radio" name="sel3" id="courseSelect" value="' + data[index].course+'_'+ data[index].level+'"'+' onchange="thisisSelected(event, this.value)" '+'>'+data[index].course+' '+'-'+data[index].level+ ' on : '+data[index].date+' </label> <button style="font-size: xx-small; float: right; color: #39739d; background-color: #e1ecf4;  border-color: #7aa7c7;"  type="Submit" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="thisisSelected(event, this.value)">Syllabus</button></div>'+'<br>';
             var aHtml = '<a href="#">'+data[index].date+
             '<button style="font-size: x-small; border: 1px solid transparent;background-color: slategrey;font-size: x-small;color: white;border-radius: .25rem;" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="lvlclk1(\''+data[index].course+'_'+ data[index].level+'\')">View syllabus '+data[index].course+' Level     '+ data[index].level+'</button></a>';
           
          //  var node = document.createTextNode(data[index].course+' '+'level '+data[index].level+ ' date '+data[index].date);
           //  var ele = document.createElement('div');
           li_element.innerHTML+=aHtml;
          //  ele.appendChild(node);
           // elm.appendChild(ele);
            
           elm.appendChild(li_element); 
          });

});



            $("#myFormemail").click(function(event) {

                // get the form data
                // there are many ways to get this data using jQuery (you can use the class or id also)
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
        
                // stop the form from submitting the normal way and refreshing the page
                event.preventDefault();
            });

            
            $("#book_course1").click(function(event) {

                // get the form data
                // there are many ways to get this data using jQuery (you can use the class or id also)
                
        
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

                // get the form data
                // there are many ways to get this data using jQuery (you can use the class or id also)
                
        
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
            });

            $("#course-search").autocomplete({
                source: "/autocomplete",
                dataType: 'json',
                select: function( event , ui ) {
                    $('#homeSubmenu').empty();
                    var elm = document.getElementById('homeSubmenu');
                   
        df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
        course_name = ui.item.value;
        image_name = ui.item.value+'_';
        setTechnology(ui.item.levels);
        setAssociatedTechnology();   
        resetSearchTopic();
        course_level = null;
    for (var i = 1; i <= ui.item.levels; i++) { 
        var li_element = document.createElement('li'); // create the option element
                      var aHtml = '<a href="#">Level '+i+ ' '+
                     '<button style="font-size: x-small; border: 1px solid transparent;background-color: slategrey;font-size: x-small;color: white;border-radius: .25rem;" onclick="lvlclk('+i+')"'+ '>View syllabus '+'</button>'+
                    ' <button style="font-size: x-small; border: 1px solid transparent;background-color: #fafafa;font-size: x-small;color: #17a2b8;border-radius: .25rem;" onclick="bookcrseNew(\''+course_name+'\', '+i+')"'+ '>Book '+'</button></a>';
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

           $("#search-topics").autocomplete({  
            source: '/searchtopics',
            dataType: 'json',
            select: function( event , ui ) {
                $('#searchtopics').empty();
                var elm = document.getElementById('searchtopics');
   var li_element = document.createElement('li'); // create the option element
                  var aHtml = '<br>'+
                  '<h4 id="tech_field" style="background-color: #629DD1; color: white;">'+course_name+' Level '+ui.item.level+ '  '+
                      '<button style="font-size: x-small; border: 1px solid transparent;background-color: #fafafa;  vertical-align: middle;font-size: x-small;color: #17a2b8;border-radius: .25rem;" onclick="lvlclk('+ui.item.level+')"'+ '> View syllabus '+'</button>'+
                ' <button style="font-size: x-small; border: 1px solid transparent;background-color: #fafafa; vertical-align: middle;font-size: x-small;color: #17a2b8;border-radius: .25rem;" onclick="login_l(event, \''+course_name+'\', '+ui.item.levels+')"'+ '> Book '+'</button></h4>';
                li_element.innerHTML+=aHtml;
                 
               elm.appendChild(li_element); 
               

    }
        });

         

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
                    data        : {"course": course_name, "level": course_level, "email":mail_id, "name": name, "pwd":pwd, "tz_info":tz_n , "csrfmiddlewaretoken" : getCookie('csrftoken')}, // our data object
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
                data        : {"course": course_name, "email":mail_id, "name": name, "pwd":pwd, "meetingLink": meeting_link, "tz_info": tz_n,  "csrfmiddlewaretoken" : getCookie('csrftoken')}, // our data object
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

        (function(a){a.createModal=function(b){defaults={title:"",message:"Your Message Goes Here!",closeButton:false,scrollable:false};var b=a.extend({},defaults,b);var c=(b.scrollable===true)?'style="max-height: 420px;overflow-y: auto;"':"";html='<div class="modal fade" id="myModal">';html+='<div class="modal-dialog">';html+='<div class="modal-content">';html+='<div class="modal-header">';html+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';if(b.title.length>0){html+='<h4 class="modal-title">'+b.title+"</h4>"}html+="</div>";html+='<div class="modal-body" '+c+">";html+=b.message;html+="</div>";html+='<div class="modal-footer">';if(b.closeButton===true){html+='<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>'}html+="</div>";html+="</div>";html+="</div>";html+="</div>";a("body").prepend(html);a("#myModal").modal().on("hidden.bs.modal",function(){a(this).remove()})}})(jQuery);

/*
* Here is how you use it
*/

function resetSearchTopic(){
    $("#search-topics").val("");    
    $('#searchtopics').empty();
}

function lvlclk(pg){ 
        var iframe = '<canvas id="my_canvas" style="width : 100%; max-height: 70%;"></canvas><script>pdfjsLib.getDocument("./static/image/'+image_name+pg+'.pdf").promise.then(doc =>{console.log("This file has "+doc._pdfInfo.numPages + " pages");  doc.getPage(1).then(page =>{ var myCanvas = document.getElementById("my_canvas");var context =  myCanvas.getContext("2d");var viewport = page.getViewport({scale:1.5}); myCanvas.width = viewport.width; myCanvas.height = viewport.height;  page.render({ canvasContext:context, viewport:viewport  });   }); }); </script>'
        $.createModal({
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
    // $("#course-search").val("Php").trigger("select");
  //  $("#course-search").val('Java');
   // $("#course-search").data("ui-autocomplete").search("Hadoop");
   // $("#course-search").data("ui-autocomplete").menu.element.children().first().click();
   //$("#course-search").data("ui-autocomplete").menu.val("Java");
   //$("#course-search").data("ui-autocomplete").menu.element.children().first().click();
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
 course_name = val;
 image_name = val+'_';
 course_level = null;
 
   $.each(data, function(index) {
     $('#homeSubmenu').empty();
     var elm = document.getElementById('homeSubmenu');
     for (var i = 1; i <= data[0].levels; i++) { 
         console.log (data[index].levels);
 var li_element = document.createElement('li'); // create the option element
           var aHtml = '<a href="#">Level '+i+ ' '+
          '<button style="font-size: x-small; border: 1px solid transparent;background-color: slategrey;font-size: x-small;color: white;border-radius: .25rem;" onclick="lvlclk('+i+')"'+ '>View syllabus '+'</button>'+
         ' <button style="font-size: x-small; border: 1px solid transparent;background-color: #fafafa;font-size: x-small;color: #17a2b8;border-radius: .25rem;" onclick="login_l(event, \''+course_name+'\', '+i+')"'+ '>Book '+'</button></a>';
         li_element.innerHTML+=aHtml;
          
        elm.appendChild(li_element); 
        setTechnology(data[0].levels);
        setAssociatedTechnology();
        resetSearchTopic();
     
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

          aHtml += '<h4  style="background-color: #629DD1; color: white;" href="">'+data[index].name+' <button style="vertical-align: middle;font-size: x-small; border: 1px solid transparent;  background-color: #fafafa; color:#629DD1;   font-size: x-small;  border-radius: .25rem;" onclick="openMainView( \''+data[index].name+'\')">View</button></h4>';
                     
          });
          elm.innerHTML=aHtml; 
        });
}

 function setTechnology(level_val){
    document.getElementById('tech_field').innerHTML = 'Technology : '+course_name;
    document.getElementById('level_field').innerHTML = 'Total Levels : '+level_val;
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
        data        : {"course": crse, "level": leveChekced}, // our data object
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



  