var image_name;
var course_name;
var course_level;

$(function() {


    /*        var coll = document.getElementsByClassName("collapsible");
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
*/

$("#one").click(function(event) {
    // get the form data
    // there are many ways to get this data using jQuery (you can use the class or id also)

    // process the form
    $.ajax({
        url         : "/get_completed_student_trainings", // the url where we want to POST
        data        : {"course":"ab"}, // our data object
        dataType    : "json", // what type of data do\ we expect back from the server
        encode      : true
    })
        // using the done promise callback
        .done(function(data) {
         var elm = document.getElementById('pone');
         elm.innerHTML="";
       /*  while (elm.hasChildNodes()) {
             elm.removeChild(elm.firstChild);
          }*/

         $.each(data, function(index) {
             var radioHtml = '<div font-size: xx-small;><br><label><input type="radio" name="sel1" id="courseDone" value="' + data[index].course+'_'+ data[index].level+'"'+' onchange="thisisSelected(event, this.value)" '+'>'+data[index].course+' '+'-'+data[index].level+ ' on : '+data[index].date+' </label> <button style="font-size: xx-small; float: right; color: #39739d; background-color: #e1ecf4;  border-color: #7aa7c7;" type="Submit" value="'+ data[index].course+'_'+data[index].level +'" onclick="thisisSelected(event, this.value)">Syllabus</button></div>'+'<br>';
            //  var node = document.createTextNode(data[index].course+' '+'level '+data[index].level+ ' date '+data[index].date);
           //  var ele = document.createElement('div');
             elm.innerHTML+=radioHtml;
          //  ele.appendChild(node);
           // elm.appendChild(ele);
          });

}); event.preventDefault();
setTimeout(afterDelayOne, 500);
});

$("#two").click(function(event) {
    // get the form data
    // there are many ways to get this data using jQuery (you can use the class or id also)

    // process the form
    $.ajax({
        url         : "/get_inprogress_student_trainings", // the url where we want to POST
        data        : {"course":"ab"}, // our data object
        dataType    : "json", // what type of data do\ we expect back from the server
        encode      : true
    })
        // using the done promise callback
        .done(function(data) {
         var elm = document.getElementById('ptwo');
         elm.innerHTML="";
       /*  while (elm.hasChildNodes()) {
             elm.removeChild(elm.firstChild);
          }*/

         $.each(data, function(index) {
            var radioHtml = '<input type="radio" id=courseSelect value="' + data[index].course+'_'+ data[index].level+ '"'+' onchange="thisisSelected(event,this.value)" '+'>Course: '+data[index].course+' '+'Level: '+data[index].level+ ' Date: '+data[index].date+' <button style="font-size: xx-small; float: right; color: #39739d; background-color: #e1ecf4;  border-color: #7aa7c7;"  type="Submit">Book</button>'+'<br>'+'<br>';
       
          //  var node = document.createTextNode(data[index].course+' '+'level '+data[index].level+ ' date '+data[index].date);
           //  var ele = document.createElement('div');
             elm.innerHTML+=radioHtml;
          //  ele.appendChild(node);
           // elm.appendChild(ele);
          });

}); event.preventDefault();
setTimeout(afterDelayTwo, 500);
});

$("#three").click(function(event) {
    // get the form data
    // there are many ways to get this data using jQuery (you can use the class or id also)

    // process the form
    $.ajax({
        url         : "/get_pending_student_trainings", // the url where we want to POST
        data        : {"course":"ab"}, // our data object
        dataType    : "json", // what type of data do\ we expect back from the server
        encode      : true
    })
        // using the done promise callback
        .done(function(data) {
         var elm = document.getElementById('pthree');
         elm.innerHTML="";
       /*  while (elm.hasChildNodes()) {
             elm.removeChild(elm.firstChild);
          }*/

         $.each(data, function(index) {
             var radioHtml = '<div font-size: xx-small;><br><label><input type="radio" name="sel3" id="courseSelect" value="' + data[index].course+'_'+ data[index].level+'"'+' onchange="thisisSelected(event, this.value)" '+'>'+data[index].course+' '+'-'+data[index].level+ ' on : '+data[index].date+' </label> <button style="font-size: xx-small; float: right; color: #39739d; background-color: #e1ecf4;  border-color: #7aa7c7;"  type="Submit" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="thisisSelected(event, this.value)">Syllabus</button></div>'+'<br>';
       
          //  var node = document.createTextNode(data[index].course+' '+'level '+data[index].level+ ' date '+data[index].date);
           //  var ele = document.createElement('div');
             elm.innerHTML+=radioHtml;
          //  ele.appendChild(node);
           // elm.appendChild(ele);
          });

}); event.preventDefault();
setTimeout(afterDelayThree, 500);
});

$("#four").click(function(event) {
    // get the form data
    // there are many ways to get this data using jQuery (you can use the class or id also)

    // process the form
    $.ajax({
        url         : "/get_accepted_student_trainings", // the url where we want to POST
        data        : {"course":"ab"}, // our data object
        dataType    : "json", // what type of data do\ we expect back from the server
        encode      : true
    })
        // using the done promise callback
        .done(function(data) {
         var elm = document.getElementById('pfour');
         elm.innerHTML="";  

         $.each(data, function(index) {
            var radioHtml = '<div font-size: xx-small;><br><label><input type="radio" name="sel" id="acceptedTrainings" value="' + data[index].course+'_'+data[index].level + '"'+' onchange="thisisSelected(event, this.value)">'+data[index].course+' '+'-'+data[index].level+ ' on : '+data[index].date+' </label> <button style="font-size: xx-small; color: #39739d; background-color: #e1ecf4;  border-color: #7aa7c7;"   type="Submit" value="'+ data[index].pk + '" onclick="myFunction(event, this.value)">Complete</button> <a style="color:blue; " href="'+data[index].meetingLink+'" target="_blank">Join</a></div>'+'<br>';
       
          //  var node = document.createTextNode(data[index].course+' '+'level '+data[index].level+ ' date '+data[index].date);
           //  var ele = document.createElement('div');
             elm.innerHTML+=radioHtml;
          //  ele.appendChild(node);
           // elm.appendChild(ele);
          });

}); event.preventDefault();
setTimeout(afterDelayFour, 500);
});  

openBookingForm();

$("#logout").click(function() {
  sessionStorage.clear();
  window.location.href = '';
});


$("#booking-close").click(function() {
  document.getElementById("bookPopup").style.display = "none";
});

$("#course-search").autocomplete({
                source: "/autocomplete",
                dataType: 'json',
                select: function( event , ui ) {
                    $('#level-select').empty();
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

$("#myFormemail").submit(function(event) {

                // get the form data
                // there are many ways to get this data using jQuery (you can use the class or id also)
                var mail_id = $('input[name=email]').val();
        
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

$("#bookCourse").submit(function(event) {

                // get the form data
                // there are many ways to get this data using jQuery (you can use the class or id also)
                var course = $('input[id=course]').val();
                var level = $('input[id=level]').val();
                var datetimeval = $('input[id=time]').val();
                var sel = document.getElementById('timezone-offset');    
                // process the form
                $.ajax({
                    url         : "/book_course", // the url where we want to POST
                    type        : 'post',
                    data        : {"course":course, "level":level, "datetimeval": datetimeval , "zone":sel.options[sel.selectedIndex].text, "csrfmiddlewaretoken" : getCookie('csrftoken')}, // our data object
                    dataType    : "html", // what type of data do\ we expect back from the server
                    encode      : true
                })
                    // using the done promise callback
                   .done(function(data) {
                    closeBookingForm(); 
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
                var mail_id = $('input[name=email]').val();
                var name = $('input[name=name]').val();
                var pwd = $('input[name=psw]').val();
        
                // process the form
                $.ajax({
                    url         : "/register_student", // the url where we want to POST
                    type        : 'post',
                    data        : {"email":mail_id, "name": name, "pwd":pwd, "csrfmiddlewaretoken" : getCookie('csrftoken')}, // our data object
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


       /*   $("#pfour").submit(function(event) {

              // get the form data
              // there are many ways to get this data using jQuery (you can use the class or id also)
              var pk = $( "input[type=radio][id=acceptedTrainings]:checked" ).val();
            
              // process the form
              $.ajax({
                  url         : "/markCompletion", // the url where we want to POST
                  data        : {"pk":pk}, // our data object
                  dataType    : "json", // what type of data do\ we expect back from the server
                  encode      : true
            
              })
                  // using the done promise callback
                  .done(function(data) {
            
                  //     alert(data);
                  });
            
              // stop the form from submitting the normal way and refreshing the page
              event.preventDefault();
            });*/

         
        
        }); 
      

        function myFunction(event, val){

          if(confirm('Press OK if the Syllabus was completed by the trainer')){

          $.ajax({
            url         : "/markCompletion", // the url where we want to POST
            data        : {"pk":val}, // our data object
            dataType    : "json", // what type of data do\ we expect back from the server
            encode      : true
      
        })
            // using the done promise callback
            .done(function(data) {
      
            //     alert(data);
            });


            
          }else{}
            event.preventDefault();
            setTimeout(afterDelayFour, 10);
        }
       
        function afterDelayOne(){
            
            var t = document.getElementById("one");
            t.classList.toggle("active");
            var content = t.nextElementSibling;
            if (content.style.maxHeight){
              content.style.maxHeight = null;
            } else {
              content.style.maxHeight = content.scrollHeight + "px";
            } 
                    }

                    function afterDelayTwo(){
            
                        var t = document.getElementById("two");
                        t.classList.toggle("active");
                        var content = t.nextElementSibling;
                        if (content.style.maxHeight){
                          content.style.maxHeight = null;
                        } else {
                          content.style.maxHeight = content.scrollHeight + "px";
                        } 
                                }

                                function afterDelayThree(){
            
                                    var t = document.getElementById("three");
                                    t.classList.toggle("active");
                                    var content = t.nextElementSibling;
                                    if (content.style.maxHeight){
                                      content.style.maxHeight = null;
                                    } else {
                                      content.style.maxHeight = content.scrollHeight + "px";
                                    } 
                                            }

                                            function afterDelayFour(){
            
                                                var t = document.getElementById("four");
                                                t.classList.toggle("active");
                                                var content = t.nextElementSibling;
                                                if (content.style.maxHeight){
                                                  content.style.maxHeight = null;
                                                } else {
                                                  content.style.maxHeight = content.scrollHeight + "px";
                                                } 
                                                        }                                       

           

        function openBookingForm() {
          document.getElementById("bookPopup").style.display = "block";
        }

        function closeBookingForm(){
            document.getElementById("bookPopup").style.display = "none";
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

function levelChange(selectObj) { 
 // get the index of the selected option 
 var idx = selectObj.selectedIndex; 
 // get the value of the selected option 
 var which = selectObj.options[idx].value; 
 
 
 course_level = which;
 $("#course").val(course_name);
 $("#level").val(course_level);
 // use the selected option value to retrieve the list of items from the countryLists array 
 //var im="{% static "+"\'"+image_name+which+".jpg"+"\'";
 //im+=" %}";
 //im='"'+im+'"';
 //alert(image_name);
 //document.getElementById("course-pdf").src = "/static/image/"+image_name+which+".pdf";
 var page = "/static/image/"+image_name+which+".pdf";
 document.getElementById("course-pdf").src = page;


 }

 function thisisSelected(event, val){
  var page = "/static/image/"+val+".pdf";
  document.getElementById("course-pdf").src = page;
  event.preventDefault();
 }