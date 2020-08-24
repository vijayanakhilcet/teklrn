
        $(function() {

            $("#course-search").autocomplete({  
                source: "/autocomplete",
                dataType: 'json',
                select: function( event , ui ) {
                    $('#homeSubmenu').empty();
                    var elm = document.getElementById('homeSubmenu');
                   
        df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
        course_name = ui.item.value;
        image_name = ui.item.value+'_';
        course_level = null;
    for (var i = 1; i <= ui.item.levels; i++) { // loop, i like 42.
        var li_element = document.createElement('li'); // create the option element
        var a_element = document.createElement('a');       
        a_element.id=i;
        a_element.setAttribute("onclick", "levelClick(this)");
        a_element.appendChild(document.createTextNode("Level " + i));
        li_element.appendChild(a_element);
        elm.appendChild(li_element); 
    }
   
        }
            });

});

function levelClick(event) {

    document.getElementById("course-pdf").src = "/static/image/"+image_name+event.id+".pdf";
    course_level = event.id;
   
    }


function login_l(event) {

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



function backtolanding(event){

    $.ajax({
        url         : "/back_to_landing_page", // the url where we want to POST
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

function backtolandingmain(event){

    $.ajax({
        url         : "/hi", // the url where we want to POST
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

function backtolandingmainT(event){

    $.ajax({
        url         : "/hi", // the url where we want to POST
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


function resetPassword(event){

    $.ajax({
        url         : "/reset_password", // the url where we want to POST
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

function resetPasswordT(event){

    $.ajax({
        url         : "/reset_password_t", // the url where we want to POST
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

function traineeResetPassword(event){   

                // get the form data
                // there are many ways to get this data using jQuery (you can use the class or id also)
                var mail_id = $('input[name=email]').val();
                var pwd = $('input[name=pass]').val();
                var image_name = 
        
                // process the form
                $.ajax({
                    url         : "/reset_student_password", // the url where we want to POST
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

function trainerResetPassword(event){   

                // get the form data
                // there are many ways to get this data using jQuery (you can use the class or id also)
                var mail_id = $('input[name=email]').val();
                var pwd = $('input[name=pass]').val();
                var image_name = 
        
                // process the form
                $.ajax({
                    url         : "/reset_trainer_password", // the url where we want to POST
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

function bookCrseClick(event) {

    if(course_name==null || course_level==null){
        //Alert will be shown 
    }else{
        
    bookcrse();
  }
}

function bookcrse(){
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
        data        : {"course":course, "level":level, "datetimeval": datetimeval}, // our data object
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

function traineeRegister(event){   
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
        data        : {"course": "Java", "level": "1", "email":mail_id, "name": name, "pwd":pwd, "tz_info":tz_n}, // our data object
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

function trainerRegister(event){   
    // get the form data
    // there are many ways to get this data using jQuery (you can use the class or id also)
    var mail_id = $('input[id=register-email-t]').val();
    var name = $('input[name=name-register-t]').val();
    var pwd = $('input[name=psw-register-t]').val();
    var course_name = $('input[name=course-register-t]').val();
    var meeting_link= $('input[name=meeting-link-register-t]').val();
    var e = document.getElementById('timezone-offset-t');
    var tz_n = e.options[e.selectedIndex].text;

    // process the form
    $.ajax({
        url         : "/register_teacher", // the url where we want to POST
        type        : 'post',
        data        : {"course": course_name, "email":mail_id, "name": name, "pwd":pwd, "meetingLink": meeting_link, "tz_info": tz_n}, // our data object
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