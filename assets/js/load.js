var image_name;
var course_name;
var course_level;
var mail_id_login;
        $(function() {


            var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}

var u = document.getElementById("touse").innerHTML;
if (u &&  u=="true") {
    openFormLogin();
    document.getElementById("hiddenTxt").style.display="block";
    
} else {
   
}

var uTeacher = document.getElementById("touseTeacher").innerHTML;
if (uTeacher &&  uTeacher=="true") {
    openTeacherFormLogin();
    document.getElementById("hiddenTxtTeacher").style.display="block";
    
} else {
   
}

            $("#course-search").autocomplete({
                source: "/autocomplete",
                dataType: 'json',
                select: function( event , ui ) {
                    $('#level-select').empty();
                    var btn =  document.getElementById('req_btn');// get the select
                    btn.style.display = "inline";
                    var elm = document.getElementById('level-select');// get the select
                    elm.style.display = "block";
                    var elm1 = document.getElementById('course-pdf');// get the select
                    elm1.style.display = "block";
        df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
        course_name = ui.item.value;
        image_name = ui.item.value+'_';
    for (var i = 1; i <= ui.item.levels; i++) { // loop, i like 42.
        var option = document.createElement('option'); // create the option element
        option.className="option-style";
        option.value = i; // set the value property
        option.appendChild(document.createTextNode("Level " + i)); // set the textContent in a safe way.
        df.appendChild(option); // append the option to the document fragment
    }
    elm.appendChild(df); 
        }
            });

           // onLoadAComplete();

            $("#myFormemail").submit(function(event) {

                // get the form data
                // there are many ways to get this data using jQuery (you can use the class or id also)
                var mail_id = $('input[name=email]').val();
                mail_id_login=mail_id;
        
                // process the form
                $.ajax({
                    url         : "/checkuser", // the url where we want to POST
                    data        : {"email":mail_id}, // our data object
                    dataType    : "json", // what type of data do\ we expect back from the server
                    encode      : true
                })
                    // using the done promise callback
                    .done(function(data) {
                        closeForm();        
                        // log data to the console so we can see
                        if(ans1 = (Object.keys(data).length === 0) ){
                            openFormRegister();
                        }else{
                            openFormLogin();
                        }
                        
        
                        // here we will handle errors and validation messages
                    });
        
                // stop the form from submitting the normal way and refreshing the page
                event.preventDefault();
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
                        document.open("text/html", "load")
                        document.write(data);
                        document.close();
                            // here we will handle errors and validation messages
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

        function onLoadAComplete(){

          
           $("#course-search").val('JavaScript'); 
            $("#course-search").autocomplete("search", "JavaScript");
            $('#course-search').autocomplete({autoFocus:true});
            

               
        }
function levelChange(selectObj) { 
 // get the index of the selected option 
 var idx = selectObj.selectedIndex; 
 // get the value of the selected option 
 var which = selectObj.options[idx].value; 
 
 course_level = which;
 // use the selected option value to retrieve the list of items from the countryLists array 
 //var im="{% static "+"\'"+image_name+which+".jpg"+"\'";
 //im+=" %}";
 //im='"'+im+'"';
 //alert(image_name);
 document.getElementById("course-pdf").src = "/static/image/"+image_name+which+".pdf";

 } 

 function closeteacherFormemail() {
    document.getElementById("temailPopup").style.display = "none";
  }

  function openteacherFormemail() {
    document.getElementById("temailPopup").style.display = "block";
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



  