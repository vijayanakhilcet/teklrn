var image_name;
var course_name;
var course_level;

$(function() {
  image_name = 'Java_';
        course_name = 'Java';   
        var runit = 0;     
        openMainView(course_name);
   /*     document.getElementById('tech_field').innerHTML = '<div style="margin-left: 1%;">Technology - '+course_name+'</div>';
        document.getElementById('level_field').innerHTML = '<div style="margin-left: 1%;">Total Levels - 21</div>';        
        setAssociatedTechnology();
        setdefaultLevels();
        setMostSoughtTechnologies();
        searchtopics();*/
  
  $.ajax({
    url         : "/get_pending_course_assignments", // the url where we want to POST
    data        : {"course":"ab"}, // our data object
    dataType    : "json", // what type of data do\ we expect back from the server
    encode      : true
})
    // using the done promise callback
    .done(function(data) {
      $('#trainerbookCrse').empty();
                  var elm = document.getElementById('trainerbookCrse');
                 elm.innerHTML="";

     $.each(data, function(index) {
        var li_element = document.createElement('li'); // create the option element
        var aHtml = '<a style="text-transform:uppercase" href="#"><b>'+data[index].date+' '+
 '<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;font-size: x-small;color: white;border-radius: .25rem;" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="lvlclk1(\''+data[index].course+'_'+ data[index].level+'\')">Syllabus '+data[index].course+' Level     '+ data[index].level+ ' <i style="vertical-align:middle;" class="fa fa-book" aria-hidden="true"></i></button>'+
' <button style="font-size: x-small; border: 1px solid transparent;background-color: #7db2e0;font-size: x-small;color: white;border-radius: .25rem;" type="Submit" value="'+ data[index].pk + '" onclick="bookThis(event, '+data[index].pk+')">Book '+'<i  style="vertical-align:middle;" class="fas fa-chalkboard-teacher"></i></button></a>';
       
        //  var aHtml = '<div font-size: xx-small;><br><label><input type="radio" name="sel3" id="courseSelect" value="' + data[index].course+'_'+ data[index].level+'"'+' onchange="thisisSelected(event, this.value)" '+'>'+data[index].course+' '+'-'+data[index].level+ ' on : '+data[index].date+' </label> <button style="font-size: xx-small; float: right; color: #39739d; background-color: #e1ecf4;  border-color: #7aa7c7;"  type="Submit" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="thisisSelected(event, this.value)">Syllabus</button></div>'+'<br>';
     /*   var aHtml = '<a href="#">'+data[index].date+ ' ' +
        ' <button style="font-size: x-small;    border: 1px solid transparent;  background-color: #fafafa;font-size: x-small;color: #17a2b8; border-radius: .25rem;" type="Submit" value="'+ data[index].pk + '" onclick="bookThis(event, '+data[index].pk+')">Book</button><button style="font-size: x-small; border: 1px solid transparent;background-color: slategrey;font-size: x-small;color: white;border-radius: .25rem;" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="lvlclk1(\''+data[index].course+'_'+ data[index].level+'\')">View syllabus '+data[index].course+' Level     '+ data[index].level+'</button></a>';
      */
        //  var node = document.createTextNode(data[index].course+' '+'level '+data[index].level+ ' date '+data[index].date);
         //  var ele = document.createElement('div');
         li_element.innerHTML+=aHtml;
        //  ele.appendChild(node);
         // elm.appendChild(ele);
          
         elm.appendChild(li_element); 
      });

}); 

$.ajax({
  url         : "/get_pending_trainings", // the url where we want to POST
  data        : {"course":"ab"}, // our data object
  dataType    : "json", // what type of data do\ we expect back from the server
  encode      : true
})
  // using the done promise callback
  .done(function(data) {
    $('#trainerSched').empty();
                var elm = document.getElementById('trainerSched');
               elm.innerHTML="";

   $.each(data, function(index) {
      var li_element = document.createElement('li'); // create the option element
     
      //  var aHtml = '<div font-size: xx-small;><br><label><input type="radio" name="sel3" id="courseSelect" value="' + data[index].course+'_'+ data[index].level+'"'+' onchange="thisisSelected(event, this.value)" '+'>'+data[index].course+' '+'-'+data[index].level+ ' on : '+data[index].date+' </label> <button style="font-size: xx-small; float: right; color: #39739d; background-color: #e1ecf4;  border-color: #7aa7c7;"  type="Submit" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="thisisSelected(event, this.value)">Syllabus</button></div>'+'<br>';
      
      var aHtml = '<a style="text-transform:uppercase" href="#"><b>'+data[index].date+' '+
      '<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;font-size: x-small;color: white;border-radius: .25rem;" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="lvlclk1(\''+data[index].course+'_'+ data[index].level+'\')">Syllabus '+data[index].course+' Level     '+ data[index].level+ ' <i style="vertical-align:middle;" class="fa fa-book" aria-hidden="true"></i></button>'+
     ' <button style="font-size: x-small; border: 1px solid transparent;background-color: #7db2e0;font-size: x-small;color: white;border-radius: .25rem;" onclick="window.open('+'\''+data[index].meetingLink+'\''+')">Join '+'<i  style="vertical-align:middle;"  class="fas fa-video"></i></button></a>';
          

      '<button style="font-size: x-small; border: 1px solid transparent;background-color: #fafafa;font-size: x-small;color: #17a2b8;border-radius: .25rem;" onclick="window.open('+'\''+data[index].meetingLink+'\''+')">Join</button><button style="font-size: x-small; border: 1px solid transparent;background-color: slategrey;font-size: x-small;color: white;border-radius: .25rem;" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="lvlclk1(\''+data[index].course+'_'+ data[index].level+'\')">View syllabus '+data[index].course+' Level     '+ data[index].level+'</button></a>';
    
      //  var node = document.createTextNode(data[index].course+' '+'level '+data[index].level+ ' date '+data[index].date);
       //  var ele = document.createElement('div');
       li_element.innerHTML+=aHtml;
      //  ele.appendChild(node);
       // elm.appendChild(ele);
        
       elm.appendChild(li_element); 
    });

}); 

$.ajax({
  url         : "/get_given_trainings", // the url where we want to POST
  data        : {"course":"ab"}, // our data object
  dataType    : "json", // what type of data do\ we expect back from the server
  encode      : true
})
  // using the done promise callback
  .done(function(data) {
    $('#trainerCompl').empty();
                var elm = document.getElementById('trainerCompl');
               elm.innerHTML="";

   $.each(data, function(index) {
      var li_element = document.createElement('li'); // create the option element
     
      //  var aHtml = '<div font-size: xx-small;><br><label><input type="radio" name="sel3" id="courseSelect" value="' + data[index].course+'_'+ data[index].level+'"'+' onchange="thisisSelected(event, this.value)" '+'>'+data[index].course+' '+'-'+data[index].level+ ' on : '+data[index].date+' </label> <button style="font-size: xx-small; float: right; color: #39739d; background-color: #e1ecf4;  border-color: #7aa7c7;"  type="Submit" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="thisisSelected(event, this.value)">Syllabus</button></div>'+'<br>';
      var aHtml = '<a style="text-transform:uppercase" href="#"><b>'+data[index].date+' '+
      '<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;font-size: x-small;color: white;border-radius: .25rem;" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="lvlclk1(\''+data[index].course+'_'+ data[index].level+'\')">Syllabus '+data[index].course+' Level     '+ data[index].level+ ' <i style="vertical-align:middle;" class="fa fa-book" aria-hidden="true"></i></button>';
       
     /* var aHtml = '<a href="#">'+data[index].date+
      '<button style="font-size: x-small; border: 1px solid transparent;background-color: slategrey;font-size: x-small;color: white;border-radius: .25rem;" value="'+ data[index].course+'_'+ data[index].level+'"'+ ' onclick="lvlclk1(\''+data[index].course+'_'+ data[index].level+'\')">View syllabus '+data[index].course+' Level     '+ data[index].level+'</button></a>';
    */
      //  var node = document.createTextNode(data[index].course+' '+'level '+data[index].level+ ' date '+data[index].date);
       //  var ele = document.createElement('div');
       li_element.innerHTML+=aHtml;
      //  ele.appendChild(node);
       // elm.appendChild(ele);
        
       elm.appendChild(li_element); 
    });

}); 


/*
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
}*/


$("#booking-close").click(function() {
  document.getElementById("bookCourse").style.display = "none";
});

$("#four").click(function(event) {
    // get the form data
    // there are many ways to get this data using jQuery (you can use the class or id also)

    // process the form
    $.ajax({
        url         : "/get_given_trainings", // the url where we want to POST
        data        : {"course":"ab"}, // our data object
        dataType    : "json", // what type of data do\ we expect back from the server
        encode      : true
    })
        // using the done promise callback
        .done(function(data) {
         var elm = document.getElementById('pfour');
         elm.innerHTML="";
       /*  while (elm.hasChildNodes()) {
             elm.removeChild(elm.firstChild);
          }*/

         $.each(data, function(index) {
            var radioHtml = '<div font-size: xx-small;><br><label><input type="radio" id="allGivent" name="allGiventx" value="' + data[index].pk + '"'+' onchange=thisisSelected('+'"'+data[index].course+'_'+data[index].level+'"'+') '+'>'+data[index].course+' '+'-'+data[index].level+ ' on : '+data[index].date+' </label> <button style="font-size: xx-small; float: right; color: #39739d; background-color: #e1ecf4;  border-color: #7aa7c7;" type="Submit" value="'+ data[index].course+'_'+data[index].level +'" onclick="thisisSelected1(event, this.value)">Syllabus</button></div>'+'<br>';
       
          //  var node = document.createTextNode(data[index].course+' '+'level '+data[index].level+ ' date '+data[index].date);
           //  var ele = document.createElement('div');
             elm.innerHTML+=radioHtml;
          //  ele.appendChild(node);
           // elm.appendChild(ele);           
         
          });

}); event.preventDefault();
setTimeout(afterDelayFour, 500);

});



$("#three").click(function(event) {
    // get the form data
    // there are many ways to get this data using jQuery (you can use the class or id also)

    // process the form
    $.ajax({
        url         : "/get_inprogress_trainings", // the url where we want to POST
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
            var radioHtml = '<input type="radio" id=allInPorgress value="' + data[index].pk + '"'+' onchange=thisisSelected('+'"'+data[index].course+'_'+data[index].level+'"'+') '+'>Course: '+data[index].course+' '+'Level: '+data[index].level+ ' Date: '+data[index].date+'   <button style="float:right; background-color:lightseagreen; color:floralwhite;" type="Submit">Book</button>'+'<br>'+'<br>';
       
          //  var node = document.createTextNode(data[index].course+' '+'level '+data[index].level+ ' date '+data[index].date);
           //  var ele = document.createElement('div');
             elm.innerHTML+=radioHtml;
          //  ele.appendChild(node);
           // elm.appendChild(ele);
          });

}); event.preventDefault();
setTimeout(afterDelayThree, 500);
});

$("#two").click(function(event) {
    // get the form data
    // there are many ways to get this data using jQuery (you can use the class or id also)

    // process the form
    $.ajax({
        url         : "/get_pending_trainings", // the url where we want to POST
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
            var radioHtml = '<div font-size: xx-small;><br><label><input type="radio" id="allGivenex" name="allGivenex1" value="' + data[index].pk + '"'+' onchange=thisisSelected('+'"'+data[index].course+'_'+data[index].level+'"'+') '+'>'+data[index].course+' '+'-'+data[index].level+ ' on : '+data[index].date+' </label> <button style="font-size: xx-small; float: right; color: #39739d; background-color: #e1ecf4;  border-color: #7aa7c7;" type="Submit" value="'+ data[index].course+'_'+data[index].level +'" onclick="thisisSelected1(event, this.value)">Syllabus</button> <a style="color:blue; " href="'+data[index].meetingLink+'" target="_blank">Join</a></div>'+'<br>';       
          //  var node = document.createTextNode(data[index].course+' '+'level '+data[index].level+ ' date '+data[index].date);
           //  var ele = document.createElement('div');
             elm.innerHTML+=radioHtml;
          //  ele.appendChild(node);
           // elm.appendChild(ele);
          });

}); event.preventDefault();
setTimeout(afterDelayTwo, 500);
});

$("#logout").click(function() {
  $.ajax({
      url         : "/logout_t", // the url where we want to POST
      data        : {"email":'hi'}, // our data object
      dataType    : "html", // what type of data do\ we expect back from the server
      encode      : true
  })
      .done(function(data) {
          document.open("text/html", "load")
          document.write(data);
          document.close();
}); event.preventDefault();
});

$("#user_profile_t").click(function() {
  $.ajax({
      url         : "/userProfileT", // the url where we want to POST
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

$("#course-search").on('keyup', function (event) {
  if(runit === 0){
      if (event.keyCode === 13) {                    
          $("#course-search").blur();
          technologiesOnSearchBar(event.target.value);
      }
  }  
          
   runit = 0;   
});   


$("#one").click(function(event) {
    // get the form data
    // there are many ways to get this data using jQuery (you can use the class or id also)

    // process the form
    $.ajax({
        url         : "/get_pending_course_assignments", // the url where we want to POST
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
            var radioHtml = '<div font-size: xx-small;><br><label><input type="radio" id="allGiven" name="allGiven1" value="' + data[index].pk + '"'+' onchange=thisisSelected('+'"'+data[index].course+'_'+data[index].level+'"'+') '+'>'+data[index].course+' '+'-'+data[index].level+ ' on : '+data[index].date+' </label> <button onclick="bookThis(event, '+data[index].pk+')"'+ ' style="font-size: xx-small; float: right; color: #39739d; background-color: #e1ecf4;  border-color: #7aa7c7;" type="Submit" value="'+ data[index].course+'_'+data[index].level +'">Book</button></div><br>';
       
          //  var node = document.createTextNode(data[index].course+' '+'level '+data[index].level+ ' date '+data[index].date);
           //  var ele = document.createElement('div');
             elm.innerHTML+=radioHtml;
          //  ele.appendChild(node);
           // elm.appendChild(ele);
          });

}); event.preventDefault(); 
setTimeout(afterDelayOne, 500);
});

$("#course-search").autocomplete({
  source: "/autocomplete",
  dataType: 'json',
  select: function( event , ui ) {
      additionalInfoOnTechnology();
      $('#homeSubmenu').empty();
      var elm = document.getElementById('homeSubmenu');
     
df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
course_name = ui.item.value;
image_name = ui.item.value+'_';
course_level = null;
setTechnology(ui.item.levels);
setAssociatedTechnology();   
resetSearchTopic();
searchtopics();
setView(course_name);
setMostSoughtTechnologies();
runit = 1;
for (var i = 1; i <= ui.item.levels; i++) { // loop, i like 42.
/*var li_element = document.createElement('li'); // create the option element
var a_element = document.createElement('a');       
a_element.id=i;
a_element.setAttribute("onclick", "levelClick(this)");
a_element.appendChild(document.createTextNode("Level " + i));
li_element.appendChild(a_element);
elm.appendChild(li_element); */
var li_element = document.createElement('li'); // create the option element
var aHtml = '<a style="text-transform:uppercase" href="#"><b>'+course_name+'</b> Level '+i+ ' '+ '<br>'+
                    '<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;font-size: x-small;color: white;border-radius: .25rem;" onclick="lvlclk('+i+')"'+ '>Syllabus '+'<i style="vertical-align:middle;" class="fa fa-book" aria-hidden="true"></i></button> ' +
                    '<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;font-size: x-small;color: white;border-radius: .25rem;" onclick="lvlclk('+i+')"'+ '>Upload Video '+'<i style="vertical-align:middle;" class="fas fa-upload" aria-hidden="true"></i></button>'
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
        
                // process the form
                $.ajax({
                    url         : "/book_course", // the url where we want to POST
                    type        : 'post',
                    data        : {"course":course, "level":level, "datetimeval": datetimeval ,"csrfmiddlewaretoken" : getCookie('csrftoken')}, // our data object
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
        
        });
        

        function setdefaultLevels(){
          $("#course-search").val("Java");
          $('#homeSubmenu').empty();
          var elm = document.getElementById('homeSubmenu');
          df = document.createDocumentFragment();
          for (var i = 1; i <= 21; i++) { 
             var li_element = document.createElement('li'); // create the option element
             var aHtml = '<a style="text-transform:uppercase" href="#"><b>'+course_name+'</b> Level '+i+ ' '+ '<br>'+
                    '<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;font-size: x-small;color: white;border-radius: .25rem;" onclick="lvlclk('+i+')"'+ '>Syllabus '+'<i style="vertical-align:middle;" class="fa fa-book" aria-hidden="true"></i></button> '+
                    '<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;font-size: x-small;color: white;border-radius: .25rem;" onclick="lvlclk('+i+')"'+ '>Upload Video '+'<i style="vertical-align:middle;" class="fas fa-upload" aria-hidden="true"></i></button>'
                    li_element.innerHTML+=aHtml;
                     
                   elm.appendChild(li_element); 
                   
      }
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
              aHtml += '<h4  style="background-color: #629DD1; color: white;" href="">'+'<div style="padding:2%; margin-left: 1%;"><b style="color: #f5eded;">  <a style="text-transform:uppercase">'+data[index].name+'</a></b><br><button style="vertical-align: middle;font-size: x-small; border: 1px solid transparent;  background-color: #155d9c; color:#ecf0f3;   font-size: x-small;  border-radius: .25rem;" onclick="openMainView( \''+data[index].name+'\')">View <i class="fas fa-folder"></i></button></div></h4>';
                             
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
                html_message += '<h4 style="background-color: #629DD1; color: white;" href=""><div style="padding:2%; margin-left: 1%;"><b style="color: #f5eded;">  <a style="text-transform:uppercase">'+data[index].technology+'</a></b><br><button style="vertical-align: middle;font-size: x-small; border: 1px solid transparent;  background-color: #155d9c; color:#ecf0f3;   font-size: x-small;  border-radius: .25rem;" onclick="openMainViewFromSearchResults(\''+data[index].technology+'\')">Open <i class="fas fa-folder"></i></button></div></h4>';
               
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
    document.getElementById("closeModal").click();
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
                      aHtml += '<h4  style="background-color: #629DD1; color: white;" href="">'+'<div style="padding:2%; margin-left: 1%;">'+data[index].value+ '<br>'+
                      '<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;  vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" onclick="lvlclk('+data[index].level+')"'+ '> Syllabus <i style="vertical-align:middle;" class="fa fa-book" aria-hidden="true"></i>'+'</button> '+
                      '<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;  vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" onclick="lvlclk('+data[index].level+')"'+ '> Upload Video <i style="vertical-align:middle;" class="fas fa-upload" aria-hidden="true"></i>'+'</button>' +
                      
                      '</div>'+ '</h4>';
               
                           
                     
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
                    aHtml += '<h4  style="background-color: #629DD1; color: white;" href="">'+'<div style="padding:2%; margin-left: 1%;">'+data[index].value+ '<br>'+
                    '<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;  vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" onclick="lvlclk('+data[index].level+')"'+ '> Syllabus <i style="vertical-align:middle;" class="fa fa-book" aria-hidden="true"></i>'+'</button> ' +
                    '<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;  vertical-align: middle;font-size: x-small;color: white;border-radius: .25rem;" onclick="lvlclk('+data[index].level+')"'+ '> Upload Video <i style="vertical-align:middle;" class="fas fa-upload" aria-hidden="true"></i>'+'</button>'
                    
                    +'</div>'+'</h4>';
             
                   
                  });
                  elm.innerHTML=aHtml;    
                  clk();
      });
          // stop the form from submitting the normal way and refreshing the page
          event.preventDefault();
        
      
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

(function(a){a.createModalForSearch=function(b){defaults={title:"",message:"Your Message Goes Here!",closeButton:false,scrollable:true};var b=a.extend({},defaults,b);var c=(b.scrollable===true)?'style="max-height: 100%;overflow-y: auto;"':"";html='<div class="modal fade" id="myModal">';html+='<div class="modal-dialog">';html+='<div class="modal-content">';html+='<div style="border-bottom:none" class="modal-header">';html+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';if(b.title.length>0){html+='<h4 class="modal-title">'+b.title+"</h4>"}html+='</div><div><div><h4 style="margin-left: 4%;margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: \'Antietam\';font-size: x-large;"><img src="static/image/images/2.png" style="padding-right:1%;width: 10%;height:90%;" alt="TEKLRN" width="35" height="25"> TEKLRN </h4></div><div style="margin-left: 4%;"><h4 style="margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: inherit;">SEARCH RESULTS: </h4></div></div>';html+='<div class="modal-body" '+c+">";html+=b.message;html+="</div>";html+='<div style="border-top:none" class="modal-footer">';if(b.closeButton===true){html+='<button id="closeModal" type="button" style="background-color: white; color: #629DD1" class="btn btn-primary" data-dismiss="modal">Close</button>'}html+="</div>";html+="</div>";html+="</div>";html+="</div>";a("body").prepend(html);a("#myModal").modal().on("hidden.bs.modal",function(){a(this).remove()})}})(jQuery);

(function(a){a.createModal=function(b){defaults={title:"",message:"Your Message Goes Here!",closeButton:false,scrollable:true};var b=a.extend({},defaults,b);var c=(b.scrollable===true)?'style="max-height: 100%;overflow-y: auto;"':"";html='<div class="modal fade" id="myModal">';html+='<div class="modal-dialog">';html+='<div class="modal-content">';html+='<div style="border-bottom:none" class="modal-header">';html+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';if(b.title.length>0){html+='<h4 class="modal-title">'+b.title+"</h4>"}html+='</div><h4 style="text-align: center;color: inherit; font-size:inherit;font-family: inherit;"><img src="static/image/images/2.png" style="padding-right:1%; width:5%; height:90%" alt="TEKLRN" width="35" height="25">    Teklrn Inc.</h4>';html+='<div class="modal-body" '+c+">";html+=b.message;html+="</div>";html+='<div style="border-top:none" class="modal-footer">';if(b.closeButton===true){html+='<button type="button" style="background-color: white; color: #629DD1" class="btn btn-primary" data-dismiss="modal">Close</button>'}html+="</div>";html+="</div>";html+="</div>";html+="</div>";a("body").prepend(html);a("#myModal").modal().on("hidden.bs.modal",function(){a(this).remove()})}})(jQuery);

(function(a){a.createModalVid=function(b){defaults={title:"",message:"Your Message Goes Here!",closeButton:false,scrollable:true};var b=a.extend({},defaults,b);var c=(b.scrollable===true)?'style="max-height: 100%;overflow-y: auto;"':"";html='<div class="modal fade" id="myModal">';html+='<div style="height:100%;" class="modal-dialog">';html+='<div style="height:100%; width:100%" class="modal-content">';html+='<div style="border-bottom:none" class="modal-header">';html+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';if(b.title.length>0){html+='<h4 class="modal-title">'+b.title+"</h4>"}html+='</div><h4 style="text-align: center;color: inherit; font-size:inherit;font-family: inherit;"><img src="static/image/images/2.png" style="padding-right:1%; width:5%; height:90%" alt="TEKLRN" width="35" height="25">    Teklrn Inc.</h4>';html+='<div style="padding-left:0.1rem; padding-right:0.1rem;" class="modal-body" '+c+">";html+=b.message;html+="</div>";html+='<div style="border-top:none" class="modal-footer">';if(b.closeButton===true){html+='<button style="background-color: white; color: #629DD1" type="button" class="btn btn-primary" data-dismiss="modal">Close</button>'}html+="</div>";html+="</div>";html+="</div>";html+="</div>";a("body").prepend(html);a("#myModal").modal().on("hidden.bs.modal",function(){a(this).remove()})}})(jQuery);

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


       function openMainView(val){
           $("#course-search").val(val);
       
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
     additionalInfoOnTechnology();
     setView(course_name);        
     setTechnology(data[0].levels);      
     resetSearchTopic();  
     searchtopics();    
     setAssociatedTechnology();
     setMostSoughtTechnologies();
     
       $.each(data, function(index) {
         $('#homeSubmenu').empty();
         var elm = document.getElementById('homeSubmenu');
         for (var i = 1; i <= data[0].levels; i++) { 
             console.log (data[index].levels);
     var li_element = document.createElement('li'); // create the option element
     var aHtml = '<a style="text-transform:uppercase" href="#"><b>'+course_name+'</b> Level '+i+ ' '+ '<br>'+
                    '<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;font-size: x-small;color: white;border-radius: .25rem;" onclick="lvlclk('+i+')"'+ '>Syllabus '+'<i style="vertical-align:middle;" class="fa fa-book" aria-hidden="true"></i></button> '+
                    '<button style="font-size: x-small; border: 1px solid transparent;background-color: #98bcdc;font-size: x-small;color: white;border-radius: .25rem;" onclick="lvlclk('+i+')"'+ '>Upload Video '+'<i style="vertical-align:middle;" class="fas fa-upload" aria-hidden="true"></i></button> '
                    li_element.innerHTML+=aHtml;
              
            elm.appendChild(li_element); 
         }
         });
     });
     window.scrollTo({ top: 0, behavior: 'smooth' });
     }
     
     function clk(){
      document.getElementById('1').click();
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

              aHtml += '<h4  style="background-color: #629DD1; color: white;" href="">'+'<div style="padding:2%; margin-left: 1%;"><b style="color: #f5eded;">  <a style="text-transform:uppercase">'+data[index].name+'</a></b><br> <button style="vertical-align: middle;font-size: x-small; border: 1px solid transparent;  background-color: #155d9c; color:#ecf0f3;   font-size: x-small;  border-radius: .25rem;" onclick="openMainView( \''+data[index].name+'\')">View <i class="fas fa-folder"></i></button></div></h4>';
             });
              elm.innerHTML=aHtml; 
            });
    }

    
  
  
    
       function setTechnology(level_val){
        document.getElementById('tec_name').text = course_name;
        document.getElementById('tot_levls').text = level_val;
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

                    function lvlclk1(crse){ 
                      var iframe = '<canvas id="my_canvas" style="width : 100%; max-height: 70%;"></canvas><script>pdfjsLib.getDocument("./static/image/'+crse+'.pdf").promise.then(doc =>{console.log("This file has "+doc._pdfInfo.numPages + " pages");  doc.getPage(1).then(page =>{ var myCanvas = document.getElementById("my_canvas");var context =  myCanvas.getContext("2d");var viewport = page.getViewport({scale:1.5}); myCanvas.width = viewport.width; myCanvas.height = viewport.height;  page.render({ canvasContext:context, viewport:viewport  });   }); }); </script>'
                      $.createModal({
                      message: iframe,
                      closeButton:true,
                      scrollable:false
                      });
                      return false;        
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

function levelClick(event) {
 //  document.getElementById("course-pdf").src = "/static/image/"+image_name+event.id+".pdf";
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

function pendingSelected(val){

            var page = "/static/image/"+val+".pdf";
            var elm1 = document.getElementById('course-pdf');
            elm1.style.display = "block";
            elm1.src = page;
        }
        
function thisisSelected(val){

    var page = "/static/image/"+val+".pdf";
    var elm1 = document.getElementById('course-pdf');
    elm1.style.display = "block";
    elm1.src = page;
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



        function thisisSelected1(event, val){
            var page = "/static/image/"+val+".pdf";
            document.getElementById("course-pdf").src = page;
            event.preventDefault();
           }

function bookThis(event, val){
  new Attention.Confirm({title: 'Confirm Booking',
  content: 'Kindly review the syllabus before booking',
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
  var pk = val;
  // process the form
  $.ajax({
      url         : "/teacherbooking", // the url where we want to POST
      data        : {"pk":pk}, // our data object
      dataType    : "html", // what type of data do\ we expect back from the server
      encode      : true

  })
      // using the done promise callback
      .done(function(data) {

        document.open("text/html", "load")
        document.write(data);
        document.close();
      });
      setTimeout(afterDelayOne, 10);
      
//event.preventDefault(); 
}



            // stop the form from submitting the normal way and refreshing the page
         
        
  