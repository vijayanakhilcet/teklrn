$(function () {
   $("#course-search").autocomplete({  
      source: "/autocomplete",
      dataType: 'json',
      select: function( event , ui ) {
          window.stop();
          searchView('United States', 'en', -1, ui.item.value);
          runit = 1;
          return false;
         }
  }) 
  .data("ui-autocomplete")._renderItem = function(ul, item) {
      return $( "<li style='margin-top:0px; max-width: 100%'><hr style='background-color:white;'>" )
  .data( "ui-autocomplete-item", item )
  .append( "<!--<img style='margin-right: 40px; width:25px; height:25px;' src='/static/image/images/" + item.name +"_icon.png'/>--><i style=\"color:darkgrey\" class=\"fa fa-search\" aria-hidden=\"true\"></i> "+ item.description)
  .appendTo( ul );
  };
  
  $("#course-search").on('keyup', function (event) {
  window.stop();
  if(runit === 0){
      if (event.keyCode === 13) {                                     
          $("#course-search").blur(); 
          searchView('United States', 'en', -1, event.target.value);
  
      }
  }  
          
   runit = 0;   
  });
   // document.getElementById("ulNews").innerHTML=localStorage.getItem("varValue")
   // getLatestNews();      
    $(document).on('hidden.bs.modal', function (event) {
       if ($('.modal:visible').length) {
          $('body').addClass('modal-open');
       }
    });
  
    var view_to_show = null;
    lvl_to_show = null; 
    lvl_to_show = document.getElementById("lvl_view").textContent; 
 
    if (document.getElementById("technology_view")) {
       view_to_show = document.getElementById("technology_view").textContent;
    }
    contentType = null;
    if (document.getElementById("technology_contentType")) {
       contentType = document.getElementById("technology_contentType").textContent
    }
    image_name = view_to_show + '_';
    course_name = view_to_show;
    course_description = view_to_show;
    Code = document.getElementById("Code").textContent
    var runit = 0;
    img_content = document.getElementById("img").textContent;
    if (img_content == ''){
      elm1.style.visibility = 'hidden';
    }
    document.getElementById('img-ins').src=img_content.replaceAll('-----','&');
    document.getElementById('title-ins').innerHTML=course_name;
    document.getElementById('para-ins').innerHTML=document.getElementById("pElement").textContent;
   getNewsContent();
 
 
 });
 
 function getNewsContent(){
   imageExists = 0
   $.ajax({
      url: "/newsContent", 
      data: {
         "heading": course_name
      },
      dataType: "json", 
      encode: true
   })
   // using the done promise callback
   .done(function (data) {
      $.each(data, function (index) {
         document.getElementById("para-ins").innerHTML = data[index].para
        });
        
   })
   .always(function(data) {
      if (!document.getElementById("para-ins").innerHTML.toLowerCase().includes('<hr>'.toLocaleLowerCase())){
      $.ajax({
         url: "/newsContentAdditional", // the url where we want to POST
         data: {
            "heading": course_name
         }, // our data object
         dataType: "json", // what type of data do\ we expect back from the server
         encode: true
      })
      // using the done promise callback
      .done(function (data) {
         $.each(data, function (index) {
            document.getElementById("para-ins-additional").innerHTML =  document.getElementById("para-ins-additional").innerHTML+ data[index].para
           });
           
      })
      }
          
   });
   
   $.ajax({
      url: "/getRelatedNews",
      data: {
      "titles": course_name
      },
      dataType: 'json',
      encode: true
  })
  .done(function (data) {
    var test_html_message=""    
    li_el = "";
    i=0    
    $.each(data, function (index) {
       if (i == 0){
         if(data[index].img){
         imageExists=0
       }
       else{
         imageExists=1
       }
      }
       i=i+1;
       if (imageExists == 0){
         test_html_message +='<div style="position:relative;" onclick="gotoTechnology1(\''+data[index].newtitle+'\',\''+data[index].newtitle+'\',\''+'RelatedTest2Nws'+i+'---'+data[index].newtitle+'\')" ><img onerror="this.src=\'/static/image/test/certificate.jpg\'"   id="RelatedTest2Nws'+i+'---'+data[index].newtitle+'" style="border-radius:8px;float: left;width: 200px; height:95px;object-fit: cover;" src="'+data[index].img+'" /><p  style="background: black;padding-left:2%;font-size:xx-small;position:absolute; color:white;font-weight:600;bottom: 2px; text-transform: uppercase;border-bottom: 1mm ridge #1c8ccd;z-index:31222; width:100%; text-overflow: clip; overflow: hidden; ">'+data[index].newtitle+'</p></div>';
         li_el += '<li><span class="tree_label"><div onclick="gotoTechnology1(\''+data[index].newtitle+'\',\''+data[index].newtitle+'\',\''+'RelatedNws'+i+'---'+data[index].newtitle+'\')" class="col-md-6"><p style="pointer-events: none; object-fit: cover;"><img style="border-radius: 11px;width: 100%; height: 250px; pointer-events: none; object-fit: cover;" id="RelatedNws'+i+'---'+data[index].newtitle+'" onerror="this.src=\'/static/image/test/certificate.jpg\'" src="'+data[index].img+'" width="100%" height="30px" alt="Image" class="img-fluid"></p><div class="d-flex post-entry"><div class="post-content"><div style="text-transform: capitalize;font-weight: 450 !important; font-family: \'Poppins\', sans-serif; font-size: 13px !important;  color:black !important"><a style="padding-left: 0px !important;background: none; font-weight: 450px;">'+data[index].newtitle+'</a><img src="/static/image/images/read_b.png" style="width: 20%;float: right;"></div><hr><p style="font-size:13px;display: block; text-overflow: ellipsis;  word-wrap: break-word;  overflow: hidden;  max-height: 3.6em;  line-height: 1.8em;"> </p><div class="post-meta"> </div><div class="post-meta"></div></h4></div></div></div></span></li>';
      
       }
       else{
         test_html_message +='<div style="position:relative;" onclick="gotoTechnology1(\''+data[index].newtitle+'\',\''+data[index].newtitle+'\',\''+'RelatedTest2Nws'+i+'---'+data[index].newtitle+'\')" ><img onerror="this.src=\'/static/image/test/certificate.jpg\'"   id="RelatedTest2Nws'+i+'---'+data[index].newtitle+'" style="border-radius:8px;float: left;width: 200px; height:95px;object-fit: cover;" src="'+data[index].newtitle+'" /><p  style="background: black;padding-left:2%;font-size:xx-small;position:absolute; color:white;font-weight:600;bottom: 2px; text-transform: uppercase;border-bottom: 1mm ridge #1c8ccd;z-index:31222; width:100%; text-overflow: clip; overflow: hidden; ">'+data[index].newtitle+'</p></div>';
         li_el += '<li><span class="tree_label"><div onclick="gotoTechnology1(\''+data[index].newtitle+'\',\''+data[index].newtitle+'\',\''+'RelatedNws'+i+'---'+data[index].newtitle+'\')" class="col-md-6"><p style="pointer-events: none; object-fit: cover;"><img style="border-radius: 11px;width: 100%; height: 250px; pointer-events: none; object-fit: cover;" id="RelatedNws'+i+'---'+data[index].newtitle+'" onerror="this.src=\'/static/image/test/certificate.jpg\'" src="/static/image/test/certificate.jpg" width="100%" height="30px" alt="Image" class="img-fluid"></p><div class="d-flex post-entry"><div class="post-content"><div style="text-transform: capitalize;font-weight: 450 !important; font-family: \'Poppins\', sans-serif; font-size: 13px !important;  color:black !important"><a style="padding-left: 0px !important;background: none; font-weight: 450px;">'+data[index].newtitle+'</a><img src="/static/image/images/read_b.png" style="width: 20%;float: right;"></div><hr><p style="font-size:13px;display: block; text-overflow: ellipsis;  word-wrap: break-word;  overflow: hidden;  max-height: 3.6em;  line-height: 1.8em;"> </p><div class="post-meta"> </div><div class="post-meta"></div></h4></div></div></div></span></li>';
       }
       
    
      }); 

      document.getElementById("tree").innerHTML = li_el;
      
      document.getElementById("mgc2").innerHTML = test_html_message;
     
 })
 .complete(function(data) {
   
   if (imageExists==0){
      // populateStaticNews("zzz");
      refineSearchView1("zzz", 'en', -1);
   }
   else{
        var datas = document.querySelectorAll('[id^="'+'RelatedNws'+'"]');
        data = ''
        datas.forEach((userItem) => {
            data=userItem.id;
            $.ajax({
                url: "/searchtopicsnewnewsForImgRelated", // the url where we want to POST
                data: {
                "strVal": data.split('---')[1],
                "titles": data,
                "lang":'en',
                "UrlTitle": course_name
                },
                dataType: 'json',
                encode: true
            })
            .done(function (data) {
             $.each(data, function (index) {
               to_insert= data[index].src;
               var elm = document.getElementById(data[index].title);
               elm.src = to_insert;
               var elm = document.getElementById(data[index].title.replace('RelatedNws', 'RelatedTest2Nws'));
               elm.src = to_insert;
               var elm = document.getElementById(data[index].title.replace('RelatedNws', 'RelatedTestNws'));
               elm.src = to_insert;
               });
               
                  })
                 
               
          });
                  // populateStaticNews("zzz");
                  refineSearchView1("zzz", 'en', -1);
         }
       });
       
                document.getElementById("scan_clicker").click();

event.preventDefault();
 }

 function populateStaticNews(pg){
   var elm = document.getElementById("initial");
   var html_message ="";
   $.ajax({
       url         : "/getNewsMatchingTheSearchRandom", // the url where we want to POST
       data        : {"search_string":pg, "type":"Financial"}, // our data object
       dataType    : 'json', // what type of data do we expect back from the server
       encode      : true
   })
       // using the done promise callback
       .done(function(data) {
           elm.innerHTML="";  
           $.each(data, function(index) { 
               html_message +='<div   style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a style="padding: 0% !important;" class="block no-underline p-5 br-8 ease-300"><div style="font-size: x-small; padding-left: 70% !important;color: white; background-color: #4976c8; padding: 1.2%; border-radius: .5 em; font-weight: bold;">'+'<h onclick="clickh(\''+data[index].imageLink+'\',\''+data[index].description+'\')"  data-toggle="modal" data-target="#exampleModalCenter" style="text-decoration: underline;">TMAIL </h><i class="fa fa-envelope" aria-hidden="true" style="color:lightyellow; margin-left:1%"></i>  <h style="text-decoration: underline;margin-left:8%;">TMS</h> <i class="fas fa-comment-alt" style="color:lightyellow; margin-left:1%;"></i>'+'  '+'</div><div onclick="gotoTechnology2(\''+data[index].name+'\',\''+data[index].name+'\',\''+data[index].imageLink+'\')" ><img class="w-100pc" playsinline="" id="frameclk'+index+'" style="pointer-events: none; width: 150px; height: 400px; object-fit: cover;"  src="'+data[index].imageLink+'"/></div><p style="padding-left:10px !important;padding-right:10px !important;font-weight: 450 !important; font-size: small !important; color: black !important;" class="fw-400 white fs-m3 mt-3">'+data[index].name+'</p><div class="indigo fs-s3 italic after-arrow-right my-4" style="padding-left: 13px !important;"><h onclick="clickh(\''+data[index].imageLink+'\',\''+data[index].description+'\')"  data-toggle="modal" data-target="#exampleModalCenter" style="text-decoration: underline;">TMAIL </h>  <img width="25" height="20" style="margin-left: 15px; margin-right: 15px;" src="/static/image/images/29.jpg"> <h onclick="clickh(\''+data[index].imageLink+'\',\''+data[index].description+'\')"  data-toggle="modal" data-target="#exampleModalCenter" style="text-decoration: underline;">TMS </h>   <img width="25" height="20" style="margin-left: 15px; margin-right: 15px;" src="/static/image/images/39.jpg"><h onclick="gotoTechnology2(\''+data[index].name+'\',\''+data[index].name+'\',\''+data[index].imageLink+'\')"    data-toggle="modal" data-target="#exampleModalCenter" style="text-decoration: underline;">SCAN</h>   <img width="25" height="20" style="margin-left: 15px; margin-right: 15px;" src="/static/image/images/hie1.jpg"></div></a></div>';          
           });
         
   elm.innerHTML=html_message;
       });
       return false;       



}

function refineSearchView1(pg, lang, idx){
   doesDBDATAExists = false
   if(idx==-1){
   var datas = document.querySelectorAll('div[id^="searchD"]');
   datas.forEach((userItem) => {
       if (userItem.id != "searchD"){
       var elem = document.getElementById(userItem.id); 
       elem.remove();
   }
   });
}   
   if(idx==-1){
       elm1 = document.getElementById("ulNews");    
       html_message_1="";
       $.ajax({
           url         : "/getLatestNews", // the url where we want to POST
           data        : {"search_string":pg, "lang":lang, "idx":idx}, // our data object
           dataType    : 'json', // what type of data do we expect back from the server
           encode      : true
       })
           // using the done promise callback
           .done(function(data) {
               elm1.innerHTML="";  
               i=-1
               $.each(data, function(index) {
                   i=i+1
                   html_message_1 +='<li><a href="#">'+data[index].description+'</a></li>';
                   
               });
               localStorage.setItem("varValue", html_message_1);
       elm1.innerHTML=html_message_1
           })

   }
   
   stringVal = "searchD"
   if (idx >=0){
       stringVal =stringVal + idx
   }
   else{window.scrollTo({ top: 0, behavior: "auto" });}
   var elm = document.getElementById(stringVal);
   var mrqelem = document.getElementById('marq');
   var html_message_marq="";
   var html_message ="";
   count = 0
   $.ajax({
       url         : "/getFianncialMatchingTheSearchNew", // the url where we want to POST
       data        : {"search_string":pg, "lang":lang, "idx":idx}, // our data object
       dataType    : 'json', // what type of data do we expect back from the server
       encode      : true
   })
       // using the done promise callback
       .done(function(data) {
           elm.innerHTML="";  
           i=-1
           $.each(data, function(index) {
            if(i==-1){
               if (data[index].contentType){
                  doesDBDATAExists =  true
               }
                  
            }
               i=i+1
               count = data[index].count;
               
             //  html_message +='<div onclick="gotoTechnology(\''+data[index].description+'\')" style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a href="#" class="block no-underline p-5 br-8 hover-bg-indigo-lightest-10 hover-scale-up-1 ease-300"><video class="w-100pc" poster="static/image/images/poster.jpg"  playsinline id="frameclk" controls style="pointer-events: none;" preload="none" controlsList="nofullscreen nodownload"  height="100%" width="100%"> type="video/mp4"></video><p style=" font-size: medium !important; color: black !important;" class="fw-600 white fs-m3 mt-3">'+data[index].description+'</p><div style="color: white; background-color: #4976c8; font-size: small; padding: 1.2%; border-radius: .5 em;">'+data[index].contentType+'</div><div class="indigo fs-s3 italic after-arrow-right my-4">More Info..</div></a></div>';          
               //  html_message +='<div onclick="gotoTechnology(\''+data[index].description+'\')" style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a href="#" class="block no-underline p-5 br-8 hover-bg-indigo-lightest-10 hover-scale-up-1 ease-300"><img class="w-100pc" playsinline="" id="frameclk" style="pointer-events: none;" height="100%" width="100%" src="/static/image/images/poster_video.jpg"><p style=" font-size: medium !important; color: black !important;" class="fw-600 white fs-m3 mt-3">'+'<img style="float: right;padding-bottom:10px;width:35px; height: 35px;object-fit: cover;" src="/static/image/images/'+data[index].technology+'_icon.png">'+data[index].description+'</p><div style="color: white; background-color: #4976c8; font-size: small; padding: 1.2%; border-radius: .5 em;">'+data[index].contentType+'</div><div class="indigo fs-s3 italic after-arrow-right my-4">More Info..</div></a></div>';          
              if(doesDBDATAExists){
               html_message +='<div  style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a style="padding: 0% !important;" class="block no-underline p-5 br-8 ease-300"><div style="font-size: x-small; padding-left: 70% !important;color: white; background-color: #4976c8; padding: 1.2%; border-radius: .5 em; font-weight: bold;">'+'<h onclick="clickh(\''+stringVal+'-img-'+i+data[index].description+'\',\''+data[index].description+'\')"  data-toggle="modal" data-target="#exampleModalCenter" style="text-decoration: underline;">TMAIL </h><i class="fa fa-envelope" aria-hidden="true" style="color:lightyellow; margin-left:1%"></i>  <h style="text-decoration: underline;margin-left:8%;">TMS</h> <i class="fas fa-comment-alt" style="color:lightyellow; margin-left:1%;"></i>'+'  '+'</div><div onclick="gotoTechnology1(\''+data[index].description+'\',\''+data[index].technology+'\',\''+stringVal+'-img-'+i+data[index].description+'\')"  ><img class="w-100pc" playsinline="" id= "'+stringVal+'-img-'+i+data[index].description+'"  onerror="this.src=\'/static/image/test/certificate.jpg\'" src="'+data[index].imgLink+'" style="pointer-events: all; width: 150px; height: 400px; object-fit: cover;" /></div><p style="padding-left:10px !important; padding-right:10px !important;font-weight: 450 !important; text-transform: capitalize;font-size: small !important; color: black !important;" class="fw-400 white fs-m3 mt-3">'+data[index].description+'</p><div class="indigo fs-s3 italic after-arrow-right my-4" style="padding-left: 13px !important;"><h onclick="clickh(\''+stringVal+'-img-'+i+data[index].description+'\',\''+data[index].description+'\')"  data-toggle="modal" data-target="#exampleModalCenter" style="text-decoration: underline;">TMAIL </h>  <img width="25" height="20" style="margin-left: 15px; margin-right: 15px;" src="/static/image/images/29.jpg"> <h onclick="clickh(\''+stringVal+'-img-'+i+data[index].description+'\',\''+data[index].description+'\')"  data-toggle="modal" data-target="#exampleModalCenter" style="text-decoration: underline;">TMS </h>   <img width="25" height="20" style="margin-left: 15px; margin-right: 15px;" src="/static/image/images/39.jpg"><h onclick="gotoTechnology1(\''+data[index].description+'\',\''+data[index].technology+'\',\''+stringVal+'-img-'+i+data[index].description+'\')" data-toggle="modal" data-target="#exampleModalCenter" style="text-decoration: underline;">SCAN</h>   <img width="25" height="20" style="margin-left: 15px; margin-right: 15px;" src="/static/image/images/hie1.jpg"></div></a></div>';          
               html_message_marq +='<a onclick="searchView(\''+data[index].description+'\',\''+data[index].description+'\',\''+data[index].description+'\',\''+data[index].description+'\')"  style="pointer-events: all !important;color:white !important;"><img onerror="this.src=\'/static/image/test/certificate.jpg\'"  src="'+data[index].imgLink+'" style="border-radius:8px;vertical-align: middle;padding-left:5px !important; padding-right: 5px !important; width: 140px !important; height: 30px !important; object-fit: cover !important;" id="'+'marq'+data[index].description+'"/>'+data[index].description+'     </a>'
              }
              else{
               html_message +='<div  style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a style="padding: 0% !important;" class="block no-underline p-5 br-8 ease-300"><div style="font-size: x-small; padding-left: 70% !important;color: white; background-color: #4976c8; padding: 1.2%; border-radius: .5 em; font-weight: bold;">'+'<h onclick="clickh(\''+stringVal+'-img-'+i+data[index].description+'\',\''+data[index].description+'\')"  data-toggle="modal" data-target="#exampleModalCenter" style="text-decoration: underline;">TMAIL </h><i class="fa fa-envelope" aria-hidden="true" style="color:lightyellow; margin-left:1%"></i>  <h style="text-decoration: underline;margin-left:8%;">TMS</h> <i class="fas fa-comment-alt" style="color:lightyellow; margin-left:1%;"></i>'+'  '+'</div><div onclick="gotoTechnology1(\''+data[index].description+'\',\''+data[index].technology+'\',\''+stringVal+'-img-'+i+data[index].description+'\')"  ><img class="w-100pc" playsinline="" id= "'+stringVal+'-img-'+i+data[index].description+'"  onerror="this.src=\'/static/image/test/certificate.jpg\'" src="'+data[index].imgLink+'" style="pointer-events: all; width: 150px; height: 400px; object-fit: cover;" /></div><p style="padding-left:10px !important; padding-right:10px !important;font-weight: 450 !important; text-transform: capitalize;font-size: small !important; color: black !important;" class="fw-400 white fs-m3 mt-3">'+data[index].description+'</p><div class="indigo fs-s3 italic after-arrow-right my-4" style="padding-left: 13px !important;"><h onclick="clickh(\''+stringVal+'-img-'+i+data[index].description+'\',\''+data[index].description+'\')"  data-toggle="modal" data-target="#exampleModalCenter" style="text-decoration: underline;">TMAIL </h>  <img width="25" height="20" style="margin-left: 15px; margin-right: 15px;" src="/static/image/images/29.jpg"> <h onclick="clickh(\''+stringVal+'-img-'+i+data[index].description+'\',\''+data[index].description+'\')"  data-toggle="modal" data-target="#exampleModalCenter" style="text-decoration: underline;">TMS </h>   <img width="25" height="20" style="margin-left: 15px; margin-right: 15px;" src="/static/image/images/39.jpg"><h onclick="gotoTechnology1(\''+data[index].description+'\',\''+data[index].technology+'\',\''+stringVal+'-img-'+i+data[index].description+'\')" data-toggle="modal" data-target="#exampleModalCenter" style="text-decoration: underline;">SCAN</h>   <img width="25" height="20" style="margin-left: 15px; margin-right: 15px;" src="/static/image/images/hie1.jpg"></div></a></div>';          
               html_message_marq +='<a onclick="searchView(\''+data[index].description+'\',\''+data[index].description+'\',\''+data[index].description+'\',\''+data[index].description+'\')"  style="pointer-events: all !important;color:white !important;"><img onerror="this.src=\'/static/image/test/certificate.jpg\'"  src="" style="border-radius:8px;vertical-align: middle;visibility:hidden !important;padding-left:5px !important; padding-right: 5px !important; width: 140px !important; height: 30px !important; object-fit: cover !important;" id="'+'marq'+data[index].description+'"/>'+data[index].description+'     </a>'
            
              }
            });
         
   elm.innerHTML+=html_message
   newDiv = document.createElement("div");
   newDiv.setAttribute("id", "searchD"+(idx+1));
   newDiv.setAttribute("class", "flex flex-wrap");
   elm.after(newDiv);
   mrqelem.innerHTML+=html_message_marq
   
       })
       .complete(function(data) {
         if(!doesDBDATAExists){
           var datas = document.querySelectorAll('[id^="'+stringVal+'-img-"]');
           // Code = $("#countryCode option:selected").val().split("---")[0];
           data = ''
           datas.forEach((userItem) => {
               data=userItem.id+'---';
               $.ajax({
                   url: "/searchtopicsnewnewsForImg", // the url where we want to POST
                   data: {
                   "titles": data,
                   "lang":"Code",
                   "strVal": stringVal
                   },
                   dataType: 'json',
                   encode: true
               })
               // using the done promise callback
               .done(function (data) {
                  try{
                   $.each(data, function (index) {
                   var elm = document.getElementById(data[index].title);
                   elm.src = data[index].src;
                   elm.style.visibility = "visible";
                   var elm_mrq = document.getElementById('marq'+data[index].title.replace('searchD-img-','').replace(/^[0-9]+/g, ''));
                   elm_mrq.src=data[index].src;
                   elm_mrq.style.visibility = "visible";                     
                   document.getElementById("initial").remove();

                   });
                  }
                  catch(err) {
                     
                   }
               });
           });
           if (count != 9999){
           }
         }
       });
      
       return false;       
}

function refineSearchView22(pg){
   var elm = document.getElementById("mgc2");
   
   var html_message ="";
   $.ajax({
       url         : "/getNewsMatchingTheSearchFiltered", // the url where we want to POST
       data        : {"search_string":pg}, // our data object
       dataType    : 'json', // what type of data do we expect back from the server
       encode      : true
   })
       // using the done promise callback
       .done(function(data) {
           elm.innerHTML="";  
           $.each(data, function(index) {
               html_message +='<div style="position:relative;" onclick="gotoTechnology1(\''+data[index].name+'\''+',\''+data[index].name+'\''+',\''+'mgc'+index+'---'+data[index].name+'\''+')" ><img onerror="this.src=\'/static/image/test/certificate.jpg\'"   id="mgc'+index+'---'+data[index].name+'" style="border-radius:8px;float: left;width: 250px; height:95px;object-fit: cover;" src="'+data[index].imageLink+'" /><p style="padding-left:2%;font-size:small;position:absolute; color:white;font-weight:600;bottom: 2px; text-transform: uppercase;border-bottom: 1mm ridge #1c8ccd;z-index:31222; width:100%; text-overflow: clip; overflow: hidden; ">'+data[index].name+'</p></div>'
           });
         
   
   
       });
      
       
}
function isNumber(n) {
   return !isNaN(parseFloat(n)) && isFinite(n);
 }
 
 function clickh(d, t){
          
   document.getElementById('comment').src=document.getElementById('img').innerHTML;
   document.getElementById('desc').innerHTML =document.getElementById('technology_view').innerHTML;

}

function submitted(event){
window.stop();
$.ajax({
url         : "/tmail", // the url where we want to POST
data        : {"img":document.getElementById('comment').src, 'title': document.getElementById('desc').innerHTML, 'to':document.getElementById('tmailto').value}, // our data object
dataType    : 'json', // what type of data do we expect back from the server
encode      : true
})
// using the done promise callback
.done(function(data) {
   $.each(data, function(index) {});
   
});
event.preventDefault();
document.getElementById('closex').click();
return true; 
}
 
 
 function setFontSize(el) {
     var fontSize = el.val();
     
     if ( isNumber(fontSize) && fontSize >= 0.5 ) {
       $('body').css({ fontSize: fontSize + 'em' });
     } else if ( fontSize ) {
       el.val('1');
       $('body').css({ fontSize: '1em' });  
     }
 }
 
 $(function() {
   
   $('#fontSize')
     .bind('change', function(){ setFontSize($(this)); })
     .bind('keyup', function(e){
       if (e.keyCode == 27) {
         $(this).val('1');
         $('body').css({ fontSize: '1em' });  
       } else {
         setFontSize($(this));
       }
     });
   
   $(window)
     .bind('keyup', function(e){
       if (e.keyCode == 27) {
         $('#fontSize').val('1');
         $('body').css({ fontSize: '1em' });  
       }
     });
   
 });

 function getLatestNews(){
   elm1 = document.getElementById("ulNews");    
        html_message_1="";
        $.ajax({
            url         : "/getLatestNews", // the url where we want to POST
            data        : {"search_string":'pg', "lang":'en', "idx":'1'}, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
            encode      : true
        })
            .done(function(data) {
                elm1.innerHTML="";  
                i=-1
                $.each(data, function(index) {
                    i=i+1
                    html_message_1 +='<li><a href="#">'+data[index].description+'</a></li>';
                    
                });
                localStorage.setItem("varValue", html_message_1);
        elm1.innerHTML=html_message_1
            })
 }

 
 
 function checkTrainerExists(event) {
 
    var mail_id = $('input[name=email]').val();
    mail_id_login = mail_id;
 
    // process the form
    $.ajax({
          url: "/checkTrainer", // the url where we want to POST
          data: {
             "email": mail_id
          }, // our data object
          dataType: "html", // what type of data do\ we expect back from the server
          encode: true
       })
 
       // using the done promise callback
       .done(function (data) {
          document.open("text/html", "load")
          document.write(data);
          document.close();
       });
 
    event.preventDefault();
 }
 
 
 function trainerLogin(event) {
 
    // get the form data
    // there are many ways to get this data using jQuery (you can use the class or id also)
    var mail_id = $('input[name=email]').val();
    var pwd = $('input[name=pass]').val();
    var image_name =
 
       // process the form
       $.ajax({
          url: "/login_teacher", // the url where we want to POST
          type: 'post',
          data: {
             "email": mail_id,
             "pwd": pwd
          }, // our data object
          dataType: "html", // what type of data do\ we expect back from the server
          encode: true
       })
       // using the done promise callback
       .done(function (data) {
          document.open("text/html", "load")
          document.write(data);
          document.close();
          // here we will handle errors and validation messages
       });
 
    // stop the form from submitting the normal way and refreshing the page
    event.preventDefault();
 }
 
 
 ``
 
 function traineeLogin(event) {
 
    // get the form data
    // there are many ways to get this data using jQuery (you can use the class or id also)
    var mail_id = $('input[name=email]').val();
    var pwd = $('input[name=pass]').val();
    var image_name =
 
       // process the form
       $.ajax({
          url: "/login_student", // the url where we want to POST
          type: 'post',
          data: {
             "email": mail_id,
             "pwd": pwd
          }, // our data object
          dataType: "html", // what type of data do\ we expect back from the server
          encode: true
       })
       // using the done promise callback
       .done(function (data) {
          document.open("text/html", "load")
          document.write(data);
          document.close();
          // here we will handle errors and validation messages
       });
 
    // stop the form from submitting the normal way and refreshing the page
    event.preventDefault();
 }
 
 function doLaunch(event) {
    window.open(window.location.origin + "/technologies", "_self");
 }
 function clickFun(link){
   window.open(window.location.origin + "/"+link, "_self");
 }
 
 function gotoTechnology1(pg, url, img){   
   window.stop();
   window.open(window.location.origin+"/news/technology?technology="+pg+"&Code="+$("#countryCode option:selected").val()+"&url="+url+"&image="+document.getElementById(img).src.replaceAll('&', '-----'), "_self");
  
}
 
 function doLaunchTerm(event) {
    $.ajax({
       url: "terms", // the url where we want to POST
       data: {
          "email": "hELLO"
       }, // our data object
       dataType: "html", // what type of data do\ we expect back from the server
       encode: true
    }).done(function (data) {
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
          url: "/book_course", // the url where we want to POST
          type: 'post',
          data: {
             "course": course,
             "level": level,
             "datetimeval": datetimeval,
             "course_description": course_description
          }, // our data object
          dataType: "html", // what type of data do\ we expect back from the server
          encode: true
       })
       // using the done promise callback
       .done(function (data) {
          document.open("text/html", "load")
          document.write(data);
          document.close();
          // here we will handle errors and validation messages
       });
 
    // stop the form from submitting the normal way and refreshing the page
    event.preventDefault();
 
 }
 
 
 function backtolandinglogin(event) {
 
    $.ajax({
          url: "/back_to_landing_login_page", // the url where we want to POST
          data: {
             "email": "email"
          }, // our data object
          dataType: "html", // what type of data do\ we expect back from the server
          encode: true
       })
 
       // using the done promise callback
       .done(function (data) {
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
          url: "/book_video", // the url where we want to POST
          type: 'post',
          data: {
             "course": course,
             "level": level,
             "course_description": course_description
          }, // our data object
          dataType: "html", // what type of data do\ we expect back from the server
          encode: true
       })
       // using the done promise callback
       .done(function (data) {
          document.open("text/html", "load")
          document.write(data);
          document.close();
          // here we will handle errors and validation messages
       });
 
    // stop the form from submitting the normal way and refreshing the page
    event.preventDefault();
 
 }
 
 
 function backtolandingmainT(event) {
 
    if (typeof course_name == "undefined")
       course_name = 'Tensorflow';
 
    $.ajax({
          url: "/hi", // the url where we want to POST
          data: {
             "technology": course_name
          }, // our data object
          dataType: "html", // what type of data do\ we expect back from the server
          encode: true
       })
 
       // using the done promise callback
       .done(function (data) {
          document.open("text/html", "load")
          document.write(data);
          document.close();
       });
 
    event.preventDefault();
 }
 
 
 function parseVideoLink(linkVid) {
    var tmpStr = linkVid.match("/d/(.*)/preview");
    var newStr = 'https://drive.google.com/uc?export=download&id=' + tmpStr[1];
    return newStr;
 }
 
 
 function videoClk1(event, crse, lvl, description, videolink, levels_total) {
    var iframe = '<video poster="/static/image/images/poster.jpg" autoplay playsinline id="frameclk" controls  controlsList="nodownload"  height="100%" width="100%"><source src="' + videolink + '" type="video/mp4"></video>';
    $.createModalVid({
       message: iframe,
       closeButton: true,
       scrollable: false,
       technology_information: crse + ' Level ' + lvl,
       technology_description: description,
       total_levels: levels_total,
       current_level: lvl
    });
    return false;
 }
 
 
 function sideMenu() {
    document.getElementById("navig_side").innerHTML = ' ';
    datahtml = '';
    if (contentType === 'Tech') {
       datahtml = '<li><a style="background:white;" href="#details" data-toggle="collapse"  class="dropdown-toggle">Tech Details</a><ul style="padding-left:10%; background:#fafafa;" class="collapse list-unstyled" id="details"><li><a style="background: white; padding-left:10%;" onclick="version_history()" href="#"><span class="icon-home mr-3"></span>Version History</a></li>' +
          '<li><a style="background: white; padding-left:10%;" onclick="industry_acceptance()" href="#"><span class="icon-search2 mr-3"></span>Industry Acceptance</a></li>' +
          '<li><a style="background: white; padding-left:10%;" onclick="dev_trends()" href="#"><span class="icon-notifications mr-3"></span>Development Trends</a></li>' +
          '<li><a style="background: white; padding-left:10%;" onclick="associated_tech()" href="#"><span class="icon-location-arrow mr-3"></span>Linked Technologies</a></li></ul><li>';
 
    }
    datahtml += '<!--<li><a href="#"><span class="icon-pie-chart mr-3"></span>Stats</a></li>-->';
    document.getElementById("navig_side").innerHTML = datahtml;
 
 }
 
 function checkTraineeExists(event) {
 
    var mail_id = $('input[name=email]').val();
    mail_id_login = mail_id;
 
    // process the form
    $.ajax({
          url: "/checkuser", // the url where we want to POST
          data: {
             "email": mail_id
          }, // our data object
          dataType: "html", // what type of data do\ we expect back from the server
          encode: true
       })
 
       // using the done promise callback
       .done(function (data) {
          document.open("text/html", "load")
          document.write(data);
          document.close();
       });
 
    event.preventDefault();
 }
 
 function backtolandingmain(event) {
 
    if (typeof course_name == "undefined") {
       course_name = 'Tensorflow';
       course_description = course_name;
    }
 
    $.ajax({
          url: "/hi", // the url where we want to POST
          data: {
             "technology": course_description
          }, // our data object
          dataType: "html", // what type of data do\ we expect back from the server
          encode: true
       })
 
       // using the done promise callback
       .done(function (data) {
          document.open("text/html", "load")
          document.write(data);
          document.close();
       });
 
    event.preventDefault();
 }
 
 function searchTopicsNews(){
   $.ajax({
         url: "/searchtopicsnewnews", // the url where we want to POST
         data: {
            "course_name": course_name,
            "keyword_data": "Teklrn",
            "lang":Code   

         },
         dataType: 'json',
         encode: true
      })
      // using the done promise callback
      .done(function (data) {
         sideMenu();
         document.getElementById('img-ins').src=document.getElementById("img").textContent;
         document.getElementById('title-ins').innerHTML=course_name;
         document.getElementById('para-ins').innerHTML=document.getElementById("pElement").textContent;

         })
       .complete(function(data) {
         $.ajax({
            url: "/searchtopicsnewnews", // the url where we want to POST
            data: {
               "course_name": course_name,
               "keyword_data": "Teklrn",
               "lang":Code   
   
            },
            dataType: 'json',
            encode: true
         })
         // using the done promise callback
         .done(function (data) {
            sideMenu();
            var elm = document.getElementById('rowdata');
            elm.innerHTML = "";
            var aHtml = "";
            var a1Html = "";
            var a2Html = "";
            var a1Html = "";
            $.each(data, function (index) {
               a1Html = " ";
               a2Html = " ";
               a2Html += '</div></h4>';
   
               //aHtml += '<div class="col-md-6"><div class="d-flex post-entry"><div class="custom-thumbnail"><img style="padding-left:30%;" src="/static/image/images/' + course_name + '_icon.png" width="55px" height="30px" alt="Image" class="img-fluid"></div><div onclick="lvlclk(\'' + data[index].link + '\', \'' + data[index].title + '\', \'' + course_description + '\')"  class="post-content"><div style="text-transform: capitalize;font-weight: 300 !important; font-family: \'Poppins\', sans-serif; font-size: 16px !important;  color:black !important"><b style=" background: #1c8ccd; color: white; font-size: small; padding: 1.5%; margin-right: 2%; ">NEWS ' + (index + 1) + ' </b>' + data[index].title + '<img onclick="lvlclk(\'' + data[index].link + '\', \'' + data[index].title + '\', \'' + course_description + '\')" src="/static/image/images/read_b.png" style="width: 30%;float: right;"></div><hr><p style="font-size:13px;display: block; text-overflow: ellipsis;  word-wrap: break-word;  overflow: hidden;  max-height: 3.6em;  line-height: 1.8em;">' + data[index].description + '</p><div class="post-meta">' + a1Html + '</div><div class="post-meta"><span>' + a2Html + '</span></div></div></div></div>';
               aHtml += '<div class="col-md-6" onclick="lvlclk(\'' + data[index].link + '\', \'' + data[index].title + '\', \'' + course_description + '\', \''+data[index].imgLink + '\')"><p style="pointer-events: none; object-fit: cover;"><img style="visibility:hidden;" onerror="this.src=\'/static/image/test/certificate.jpg\'"  id= "img-'+data[index].title+'" style="pointer-events: none; object-fit: cover;"  width="100%" height="30px" alt="Image" class="img-fluid"></p><div class="d-flex post-entry"><div class="post-content"><div style="text-transform: capitalize;font-weight: 300 !important; font-family: \'Poppins\', sans-serif; font-size: 16px !important;  color:black !important"><b style=" background: #1c8ccd; color: white; font-size: small; padding-left:2% !important; padding-right:2% !important; padding: .3%; margin-right: 2%; ">NEWS '+(index+1)+' </b>'+data[index].title+'<img src="/static/image/images/read_b.png" style="width: 20%;float: right;"></div><hr><p style="font-size:13px;display: block; text-overflow: ellipsis;  word-wrap: break-word;  overflow: hidden;  max-height: 3.6em;  line-height: 1.8em;">'+data[index].description+'</p><div class="post-meta">'+a1Html+'</div><div class="post-meta"><span>'+ a2Html+'</span></div></div></div></div>';     
   
              }); 
            elm.innerHTML = aHtml;
            
   
         })
          .complete(function(data) {
              //refineSearchView("zzz");
           var dates = document.querySelectorAll('[id^="img-"]');
           Code = document.getElementById("Code").textContent;
           data = ''
           dates.forEach((userItem) => {
           data=userItem.id+'---';
                  $.ajax({
                      url: "/searchtopicsnewnewsForImg", // the url where we want to POST
                      data: {
                      "titles": data,
                      "lang":Code
                      },
                      dataType: 'json',
                      encode: true
                  })
                  // using the done promise callback
                  .done(function (data) {
             $.each(data, function (index) {
               var elm = document.getElementById(data[index].title);
               elm.src = data[index].src;
               elm.style.visibility = "visible";
               });
          
                  });
              });
          });    
          
       });      
}
 
 (function (a) {
    a.createModalForDesignationsCertification = function (b) {
       defaults = {
          title: "",
          message: "Your Message Goes Here!",
          closeButton: false,
          scrollable: true
       };
       var b = a.extend({}, defaults, b);
       var c = (b.scrollable === true) ? 'style="max-height: 100%;overflow-y: auto;"' : "";
       html = '<div class="modal fade" id="myModal">';
       html += '<div class="modal-dialog">';
       html += '<div class="modal-content">';
       html += '<div style="border-bottom:none" class="modal-header">';
       html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
       if (b.title.length > 0) {
          html += '<h4 class="modal-title">' + b.title + "</h4>"
       }
       html += '</div><div><div><h4 style="margin-left: 4%;margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: \'Antietam\';"><img src="/static/image/images/2.png" style="padding-right:1%;" alt="TEKLRN" width="30" height="45"> TEKLRN </h4></div><div style="margin-left: 4%;"><h4 style="margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: inherit;">TECHNOLOGY CERTIFICATION COURSES </h4></div></div>';
       html += '<div class="modal-body" ' + c + ">";
       html += b.message;
       html += "</div>";
       html += '<div style="border-top:none" class="modal-footer">';
       if (b.closeButton === true) {
          html += '<button id="closeModal" type="button" style="background-color: white; color: #629DD1" class="btn btn-primary" data-dismiss="modal">Close</button>'
       }
       html += "</div>";
       html += "</div>";
       html += "</div>";
       html += "</div>";
       a("body").prepend(html);
       a("#myModal").modal().on("hidden.bs.modal", function () {
          a(this).remove()
       })
    }
 })(jQuery);
 
 (function (a) {
    a.createModalForDesignations = function (b) {
       defaults = {
          title: "",
          message: "Your Message Goes Here!",
          closeButton: false,
          scrollable: true
       };
       var b = a.extend({}, defaults, b);
       var c = (b.scrollable === true) ? 'style="max-height: 100%;overflow-y: auto;"' : "";
       html = '<div class="modal fade" id="myModal">';
       html += '<div class="modal-dialog">';
       html += '<div class="modal-content">';
       html += '<div style="border-bottom:none" class="modal-header">';
       html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
       if (b.title.length > 0) {
          html += '<h4 class="modal-title">' + b.title + "</h4>"
       }
       html += '</div><div><div><h4 style="margin-left: 4%;margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: \'Antietam\';"><img src="/static/image/images/2.png" style="padding-right:1%;" alt="TEKLRN" width="30" height="45"> TEKLRN </h4></div><div style="margin-left: 4%;"><h4 style="margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: inherit;">SUPPORTED SOFTWARE / IT / TECHNOLOGY DESIGNATIONS </h4></div></div>';
       html += '<div class="modal-body" ' + c + ">";
       html += b.message;
       html += "</div>";
       html += '<div style="border-top:none" class="modal-footer">';
       if (b.closeButton === true) {
          html += '<button id="closeModal" type="button" style="background-color: white; color: #629DD1" class="btn btn-primary" data-dismiss="modal">Close</button>'
       }
       html += "</div>";
       html += "</div>";
       html += "</div>";
       html += "</div>";
       a("body").prepend(html);
       a("#myModal").modal().on("hidden.bs.modal", function () {
          a(this).remove()
       })
    }
 })(jQuery);
 
 (function (a) {
    a.createModalForSearch = function (b) {
       defaults = {
          title: "",
          message: "Your Message Goes Here!",
          closeButton: false,
          scrollable: true
       };
       var b = a.extend({}, defaults, b);
       var c = (b.scrollable === true) ? 'style="max-height: 100%;overflow-y: auto;"' : "";
       html = '<div class="modal fade" id="myModal">';
       html += '<div class="modal-dialog">';
       html += '<div class="modal-content">';
       html += '<div style="border-bottom:none" class="modal-header">';
       html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
       if (b.title.length > 0) {
          html += '<h4 class="modal-title">' + b.title + "</h4>"
       }
       html += '</div><div><div><h4 style="margin-left: 8%;margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: \'Antietam\';"><img src="/static/image/images/2.png" style="padding-right:1%;" alt="TEKLRN" width="30" height="45"> TEKLRN </h4></div><div style="margin-left: 4%;"><h4 style="margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: inherit;">SEARCH RESULTS: </h4></div></div>';
       html += '<div class="modal-body" ' + c + ">";
       html += b.message;
       html += "</div>";
       html += '<div style="border-top:none" class="modal-footer">';
       if (b.closeButton === true) {
          html += '<button id="closeModal" type="button" style="background-color: white; color: #629DD1" class="btn btn-primary" data-dismiss="modal">Close</button>'
       }
       html += "</div>";
       html += "</div>";
       html += "</div>";
       html += "</div>";
       a("body").prepend(html);
       a("#myModal").modal().on("hidden.bs.modal", function () {
          a(this).remove()
       })
    }
 })(jQuery);
 
 (function (a) {
    a.createModal = function (b) {
       defaults = {
          title: "",
          message: "Your Message Goes Here!",
          closeButton: false,
          scrollable: true
       };
       var b = a.extend({}, defaults, b);
       var c = (b.scrollable === true) ? 'style="max-height: 100%;overflow-y: auto;"' : "";
       html = '<div class="modal fade"  style="padding-left:0%; padding-right:0%" id="myModal">';
       html += '<div class="modal-dialog">';
       html += '<div class="modal-content">';
       html += '<div style="border-bottom:none" class="modal-header">';
       html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
       if (b.title.length > 0) {
          html += '<h4 class="modal-title">' + b.title + "</h4>"
       }
       html += '</div><h4 style="margin-left: 8%;margin-bottom: 4%;  text-align: left;color: inherit;font-size:inherit;font-family: \'Antietam\';"><img src="/static/image/images/banner3.jpg" style="padding-right:1%;" alt="TEKLRN" width="200" height="70"></h4><div style="margin-left: 4%; margin-right: 4%"><!--<h4 style="margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: inherit;">TECHNOLOGY PROFICIENCY CERTIFICATION  <a style="font-weight:bolder">' + course_name.toUpperCase() + ' PROFESSIONAL TECHNOLOGY DEVELOPER LEVEL ' + b.current_level + '</a></h4>--></div>';
       html += '<div class="modal-body" ' + c + ">";
       html += b.message;
       html += "</div>";
       html += '<div style="border-top:none" class="modal-footer">';
       if (b.closeButton === true) {
          html += '<button type="button" style="background-color: white; color: #629DD1" class="btn btn-primary" data-dismiss="modal">Close</button>'
       }
       html += "</div>";
       html += "</div>";
       html += "</div>";
       html += "</div>";
       a("body").prepend(html);
       a("#myModal").modal().on("hidden.bs.modal", function () {
          a(this).remove()
       })
    }
 })(jQuery);
 
 (function (a) {
    a.createModalVid = function (b) {
       defaults = {
          title: "",
          message: "Your Message Goes Here!",
          closeButton: false,
          scrollable: true
       };
       var b = a.extend({}, defaults, b);
       var c = (b.scrollable === true) ? 'style="max-height: 100%;overflow-y: auto;"' : "";
       html = '<div class="modal fade"  style="padding-top: 0px !important;padding-left:0%; padding-right:0%" id="myModal">';
       html += '<div style="margin-top: 0%;" class="modal-dialog">';
       html += '<div style="top:0; position:sticky; z-index: 1055; height:100%; width:100%; border-width: 0px; " class="modal-content">';
       html += '<div style="border-bottom:none;display: none;" class="modal-header">';
       html += '<button id="closex" type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
       if (b.title.length > 0) {
          html += '<h4 class="modal-title">' + b.title + "</h4>"
       }
       html += '</div><div><button style="padding:15px;" id="closex" type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><div><h4 style="margin-left: 8%;margin-bottom: 0%;text-align: left;color: inherit;font-size:inherit;font-family: \'Antietam\';"><img src="/static/image/images/banner3.jpg" style="padding-top: 15px;padding-right:1%;" alt="TEKLRN" width="200" height="70"><img src="/static/image/images/lg_b.png" style="width: 12%;float: right;padding-top: 29px;"margin-right: 10%;"" alt="TEKLRN"></h4></div><div style="margin-left: 4%; margin-right: 4%;"><!--<h4 style="margin-bottom: 4%;text-align: left;color: inherit;font-size:inherit;font-family: inherit;">TECHNOLOGY PROFICIENCY CERTIFICATION <a style="font-weight:bolder">' + course_name.toUpperCase() + ' PROFESSIONAL TECHNOLOGY DEVELOPER</a> </h4>--></div></div>';
       html += '<div style="text-transform:uppercase; padding-left:0.1rem; padding-right:0.1rem; padding:0rem; class="modal-body" ' + c + ">";
       html += b.message;
       html += "</div>";
       html += '<a style="margin-left: 4%; margin-right: 4%; margin-bottom: 4%; margin-top: 4%;"><b style="text-transform: uppercase; margin-right:1%;"><img src="/static/image/images/' + course_name + '_icon.png" style="margin-right: 2%;width: 5%;height: 40%;" alt="TEKLRN" width="35" height="25">' + b.technology_information + ' </b>' + b.technology_description + '</a> ';
       html += "</div>";
       for (var i = 1; i <= b.total_levels; i++) {
          if (i != b.current_level)
 
             html += '<div style="margin: 0%; margin-top: 0%;margin-bottom: 0%;" class="modal-dialog"><div onclick="hi(event, \'' + course_name + '\', ' + i + ')"  style="height:100%; width:100%" class="modal-content"><a href="javascript:void(0);" style="margin-left: 4%; margin-right: 4%; margin-bottom: 4%; margin-top: 4%;"><b style="text-transform: uppercase; margin-right:1%;"><img src="/static/image/images/' + course_name + '_icon.png" style="margin-right: 2%;width: 5%;height: 40%;" alt="TEKLRN" width="35" height="25"> ' + course_name + ' Level ' + i + ' </b>' + document.getElementById(i + 'description').innerText + '<img src="/static/image/images/play_b2.png" style="float: right;margin-right: 2%;width: 8%;height: 40%;" alt="TEKLRN" width="35" height="25"></a> </div></div>';
       }
       html += "</div>";
       html += "</div>";
       a("body").prepend(html);
       a("#myModal").modal().on("hidden.bs.modal", function () {
          a(this).remove()
       })
    }
 })(jQuery);
 
 
 function hi(event, crse, lvl) {
 
    document.getElementById('closex').click();
    document.getElementById(lvl).click();
 }
 
 
 function videoClk(event, crse, lvl) {
    $.ajax({
          url: "/loginFormForVideoAccess", // the url where we want to POST
          data: {
             "from": "home_book_login",
             "course_name": crse,
             "course_level": lvl,
             "action": "video",
             "course_description": course_description
          }, // our data object
          dataType: "html", // what type of data do\ we expect back from the server
          encode: true
       })
       // using the done promise callback
       .done(function (data) {
          document.open("text/html", "load")
          document.write(data);
          document.close();
 
          // here we will handle errors and validation messages
       });
 
    // stop the form from submitting the normal way and refreshing the page
    event.preventDefault();
 }
 
 
 function refineSearchView(pg) {
    var elm = document.getElementById("mgc");
    var html_message = "";
    $.ajax({
          url: "/getTechnologiesMatchingTheSearchFiltered", // the url where we want to POST
          data: {
             "search_string": pg
          }, // our data object
          dataType: 'json', // what type of data do we expect back from the server
          encode: true
       })
       // using the done promise callback
       .done(function (data) {
          elm.innerHTML = "";
          $.each(data, function (index) {
             html_message += '<div onclick="gotoTechnology(\'' + data[index].description + '\')" ><img style="float: left;width: 200px; height: 75px;object-fit: cover;" src="/static/image/images/' + data[index].technology + '_icon.png" /></div>'
          });
 
          elm.innerHTML = html_message;
       });
    elm.style.visibility = 'visible';
    event.preventDefault();
 }
 
 function backToNews() {
    window.open(window.location.origin + "/news", "_self");
 }
 
 function gotoTechnology(pg) {
 
    window.open(window.location.origin + "/news/technology?technology=" + pg, "_self");
   
 }
 
 
 function hi() {
    $.ajax({
          url: "/", // the url where we want to POST
          data: {
             "from": "home_book_login",
             "course_name": crse,
             "course_level": lvl,
             "action": "video",
             "course_description": course_description
          }, // our data object
          dataType: "html", // what type of data do\ we expect back from the server
          encode: true
       })
       // using the done promise callback
       .done(function (data) {
          document.open("text/html", "load")
          document.write(data);
          document.close();
 
          // here we will handle errors and validation messages
       });
 
    // stop the form from submitting the normal way and refreshing the page
    event.preventDefault();
 }
 
 
 function lvlclk(url, heading, technology, imgLink) {
   
    window.open(window.location.origin + "/news/technology/read?url=" + url + '&heading=' + heading + '&technology=' + technology + '&imgLink='+document.getElementById('img-'+heading).src, "_self");
 }
 
 function clk() {
 
    document.getElementById(lvl_to_show).click();
 
  
 
 }
 
 
 function login_l(event, crse, lvl) {
    $.ajax({
          url: "/loginForm", // the url where we want to POST
          data: {
             "from": "home_book_login",
             "course_name": crse,
             "course_level": lvl,
             "course_description": course_description
          }, // our data object
          dataType: "html", // what type of data do\ we expect back from the server
          encode: true
       })
       // using the done promise callback
       .done(function (data) {
          document.open("text/html", "load")
          document.write(data);
          document.close();
 
          // here we will handle errors and validation messages
       });
 
    // stop the form from submitting the normal way and refreshing the page
    event.preventDefault();
 }
 
 
 function associated_tech() {
    var iframe = '<canvas id="my_canvas" style="width : 100%; max-height: 70%;"></canvas><script>pdfjsLib.getDocument("./static/image/' + image_name + 'Associated.pdf").promise.then(doc =>{console.log("This file has "+doc._pdfInfo.numPages + " pages");  doc.getPage(1).then(page =>{ var myCanvas = document.getElementById("my_canvas");var context =  myCanvas.getContext("2d");var viewport = page.getViewport({scale:1.5}); myCanvas.width = viewport.width; myCanvas.height = viewport.height;  page.render({ canvasContext:context, viewport:viewport  });   }); }); </script>'
    $.createModal({
       message: iframe,
       closeButton: true,
       scrollable: false
    });
    return false;
 }

 function searchView(pg, lang, idx, srch){
   window.stop()
   var img;
   $.ajax({
      url: "/searchtopicsnewnewsForImgRelated", // the url where we want to POST
      data: {
      "strVal": srch,
      "titles": srch,
      "lang":'en'
      
      },
      dataType: 'json',
      encode: true
  })
  .done(function (data) {
   window.open(window.location.origin+"/news/technology?technology="+srch+"&Code="+$("#countryCode option:selected").val()+"&url="+data[0].src+"&image="+data[0].src, "_self");
                 });

 }
 
 function version_history() {
    var iframe = '<canvas id="my_canvas" style="width : 100%; max-height: 70%;"></canvas><script>pdfjsLib.getDocument("./static/image/' + image_name + 'Version.pdf").promise.then(doc =>{console.log("This file has "+doc._pdfInfo.numPages + " pages");  doc.getPage(1).then(page =>{ var myCanvas = document.getElementById("my_canvas");var context =  myCanvas.getContext("2d");var viewport = page.getViewport({scale:1.5}); myCanvas.width = viewport.width; myCanvas.height = viewport.height;  page.render({ canvasContext:context, viewport:viewport  });   }); }); </script>'
    $.createModal({
       message: iframe,
       closeButton: true,
       scrollable: false
    });
    return false;
 }
 
 function dev_trends() {
    var iframe = '<canvas id="my_canvas" style="width : 100%; max-height: 70%;"></canvas><script>pdfjsLib.getDocument("./static/image/' + image_name + 'Dev.pdf").promise.then(doc =>{console.log("This file has "+doc._pdfInfo.numPages + " pages");  doc.getPage(1).then(page =>{ var myCanvas = document.getElementById("my_canvas");var context =  myCanvas.getContext("2d");var viewport = page.getViewport({scale:1.5}); myCanvas.width = viewport.width; myCanvas.height = viewport.height;  page.render({ canvasContext:context, viewport:viewport  });   }); }); </script>'
    $.createModal({
       message: iframe,
       closeButton: true,
       scrollable: false
    });
    return false;
 }
 
 function industry_acceptance() {
    var iframe = '<canvas id="my_canvas" style="width : 100%; max-height: 70%;"></canvas><script>pdfjsLib.getDocument("./static/image/' + image_name + 'Industry.pdf").promise.then(doc =>{console.log("This file has "+doc._pdfInfo.numPages + " pages");  doc.getPage(1).then(page =>{ var myCanvas = document.getElementById("my_canvas");var context =  myCanvas.getContext("2d");var viewport = page.getViewport({scale:1.5}); myCanvas.width = viewport.width; myCanvas.height = viewport.height;  page.render({ canvasContext:context, viewport:viewport  });   }); }); </script>'
    $.createModal({
       message: iframe,
       closeButton: true,
       scrollable: false
    });
    return false;
 }
 
 function hi(event, crse, lvl) {
 
    document.getElementById('closex').click();
    document.getElementById(lvl).click();
 }