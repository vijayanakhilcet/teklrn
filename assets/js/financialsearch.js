$(document).ready(function () {
    var runit = 0;  
    populateStaticNews("zzz");
    populateCountry();   
    
   // document.getElementById("course-search").focus();
    $("#course-search").autocomplete({  
        source: "/autocomplete",
        dataType: 'json',
        select: function( event , ui ) {
        window.stop();
        searchView('United States', 'en', -1, ui.item.value);
        // gotoTechnology(ui.item.value);        
        runit = 1;
        return false;
           }
}) 
.data("ui-autocomplete")._renderItem = function(ul, item) {
    return $( "<li style='margin-top:25px'>" )
    .data( "ui-autocomplete-item", item )
    .append( "<!--<img style='margin-right: 40px; width:25px; height:25px;' src='/static/image/images/" + item.name +"_icon.png'/>-->"+ item.description)
    .appendTo( ul );
  };

$("#course-search").on('keyup', function (event) {
    window.stop();
        if(runit === 0){
            if (event.keyCode === 13) {                                     
                $("#course-search").blur(); 
                //refineSearchView(event.target.value);    
                // gotoTechnology(event.target.value);
                searchView('United States', 'en', -1, event.target.value);

            }
        }  
                
         runit = 0;   
});

$("#countryCode").on('change', function (event) {
    window.stop();
    window.scrollTo({ top: 0, behavior: "auto" });
    getLanguage(event.target.value);
    refineSearchView(event.target.value, document.getElementById("lang").value, -1);

});

$("#lang").on('change', function (event) {
    window.stop();
    window.scrollTo({ top: 0, behavior: "auto" });
    refineSearchWithLangView(document.getElementById("countryCode").value, event.target.value, -1);

});

    // toggle mobile menu
    $('[data-toggle="toggle-nav"]').on('click', function () {
        $(this).closest('nav').find($(this).attr('data-target')).toggleClass('hidden');
        return false;
    });

    // feather icons
    feather.replace();

    // smooth scroll
    var scroll = new SmoothScroll('a[href*="#"]');

    // tiny slider
    $('#slider-1').slick({
        infinite: true,
        prevArrow: $('.prev'),
        nextArrow: $('.next'),
    });

    $('#slider-2').slick({
        dots: true,
        arrows: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        centerMode: true,
        customPaging: function (slider, i) {
            return '<div class="bg-white br-round w-1 h-1 opacity-50 mt-5" id=' + i + '> </div>'
        },
        responsive: [{
            breakpoint: 768,
            settings: {
                slidesToShow: 1
            }
        }, ]
    });
});



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
                html_message +='<div onclick="gotoTechnology2(\''+data[index].name+'\',\''+data[index].name+'\',\''+data[index].imageLink+'\')"  style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a style="padding: 0% !important;" class="block no-underline p-5 br-8 hover-bg-indigo-lightest-10 hover-scale-up-1 ease-300"><div style="padding-left: 2% !important; color: white; background-color: #4976c8; font-size: small; padding: 1.2%; border-radius: .5 em;">'+data[index].contentType+'</div><img class="w-100pc" playsinline="" id="frameclk'+index+'" style="pointer-events: none; width: 150px; height: 400px; object-fit: cover;"  src="'+data[index].imageLink+'"><p style="padding-left:10px !important;padding-right:10px !important;font-weight: 450 !important; font-size: small !important; color: black !important;" class="fw-400 white fs-m3 mt-3">'+data[index].name+'</p><div class="indigo fs-s3 italic after-arrow-right my-4">Read..</div></a></div>';          
            });
          
    elm.innerHTML=html_message;
        });
        return false;       
}
function refineSearchWithLangView(pg, lang, idx){
    if(idx==-1){
        var datas = document.querySelectorAll('div[id^="searchD"]');
        datas.forEach((userItem) => {
            if (userItem.id != "searchD"){
            var elem = document.getElementById(userItem.id); 
            elem.remove();
        }
        });
    }
   
    stringVal = "searchD"
    if (idx >=0){
        stringVal =stringVal + idx
    }
    else{window.scrollTo({ top: 0, behavior: "auto" });}
    var elm = document.getElementById(stringVal);
    var html_message ="";
    $.ajax({
        url         : "/getTechnologiesMatchingTheSearchWithLangNew", // the url where we want to POST
        data        : {"search_string":pg, "lang":lang, "idx":idx}, // our data object
        dataType    : 'json', // what type of data do we expect back from the server
        encode      : true
    })
        // using the done promise callback
        .done(function(data) {
            elm.innerHTML="";  
            i=-1
            $.each(data, function(index) {
                i=i+1
                count = data[index].count;
              //  html_message +='<div onclick="gotoTechnology(\''+data[index].description+'\')" style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a href="#" class="block no-underline p-5 br-8 hover-bg-indigo-lightest-10 hover-scale-up-1 ease-300"><video class="w-100pc" poster="static/image/images/poster.jpg"  playsinline id="frameclk" controls style="pointer-events: none;" preload="none" controlsList="nofullscreen nodownload"  height="100%" width="100%"> type="video/mp4"></video><p style=" font-size: medium !important; color: black !important;" class="fw-600 white fs-m3 mt-3">'+data[index].description+'</p><div style="color: white; background-color: #4976c8; font-size: small; padding: 1.2%; border-radius: .5 em;">'+data[index].contentType+'</div><div class="indigo fs-s3 italic after-arrow-right my-4">More Info..</div></a></div>';          
                //  html_message +='<div onclick="gotoTechnology(\''+data[index].description+'\')" style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a href="#" class="block no-underline p-5 br-8 hover-bg-indigo-lightest-10 hover-scale-up-1 ease-300"><img class="w-100pc" playsinline="" id="frameclk" style="pointer-events: none;" height="100%" width="100%" src="/static/image/images/poster_video.jpg"><p style=" font-size: medium !important; color: black !important;" class="fw-600 white fs-m3 mt-3">'+'<img style="float: right;padding-bottom:10px;width:35px; height: 35px;object-fit: cover;" src="/static/image/images/'+data[index].technology+'_icon.png">'+data[index].description+'</p><div style="color: white; background-color: #4976c8; font-size: small; padding: 1.2%; border-radius: .5 em;">'+data[index].contentType+'</div><div class="indigo fs-s3 italic after-arrow-right my-4">More Info..</div></a></div>';          
                html_message +='<div  onclick="gotoTechnology1(\''+data[index].description+'\',\''+data[index].technology+'\',\''+stringVal+'-img-'+i+data[index].description+'\')" style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a style="padding: 0% !important;" class="block no-underline p-5 br-8 hover-bg-indigo-lightest-10 hover-scale-up-1 ease-300"><div style="padding-left: 2% !important; color: white; background-color: #4976c8; font-size: small; padding: 1.2%; border-radius: .5 em;">'+data[index].contentType+'</div><img class="w-100pc" playsinline="" id= "'+stringVal+'-img-'+i+data[index].description+'"  onerror="this.src=\'/static/image/test/certificate.jpg\'" style="visibility:hidden;pointer-events: none; width: 150px; height: 400px; object-fit: cover;" ><p style="padding-left:10px !important; text-transform: capitalize; padding-right:10px !important; font-weight: 450 !important; font-size: small !important; color: black !important;" class="fw-400 white fs-m3 mt-3">'+data[index].description+'</p><div class="indigo fs-s3 italic after-arrow-right my-4" style="padding-left: 13px !important;">Read..</div></a></div>';          

            });
          
    elm.innerHTML=html_message;
    newDiv = document.createElement("div");
    newDiv.setAttribute("id", "searchD"+(idx+1));
    newDiv.setAttribute("class", "flex flex-wrap");
    elm.after(newDiv);
        })
        .complete(function(data) {
            var datas = document.querySelectorAll('[id^="'+stringVal+'-img-"]');
            Code = $("#countryCode option:selected").val().split("---")[0];
            data = ''
            datas.forEach((userItem) => {
                data=userItem.id+'---';
                $.ajax({
                    url: "/searchtopicsnewnewsForImg", // the url where we want to POST
                    data: {
                    "titles": data,
                    "lang":Code,
                    "strVal": stringVal
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
            if (count != 9999){
                refineSearchView(pg, lang, idx+1);
            }
        });
         
        return false;       
}

function searchView(pg, lang, idx, srch){
    if(idx==-1){
    var datas = document.querySelectorAll('div[id^="searchD"]');
    datas.forEach((userItem) => {
        if (userItem.id != "searchD"){
        var elem = document.getElementById(userItem.id); 
        elem.remove();
    }
    });
}    
    
    stringVal = "searchD"
    if (idx >=0){
        stringVal =stringVal + idx
    }
    else{window.scrollTo({ top: 0, behavior: "auto" });}
    var elm = document.getElementById(stringVal);
    var html_message ="";
    count = 0
    $.ajax({
        url         : "/getMatchingTheSearchNew", // the url where we want to POST
        data        : {"search_string":pg, "lang":lang, "idx":idx, "srch":srch}, // our data object
        dataType    : 'json', // what type of data do we expect back from the server
        encode      : true
    })
        // using the done promise callback
        .done(function(data) {
            elm.innerHTML="";  
            i=-1
            $.each(data, function(index) {
                i=i+1
                count = data[index].count;
                html_message +='<div  onclick="gotoTechnology1(\''+data[index].description+'\',\''+data[index].technology+'\',\''+stringVal+'-img-'+i+data[index].description+'\')" style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a style="padding: 0% !important;" class="block no-underline p-5 br-8 hover-bg-indigo-lightest-10 hover-scale-up-1 ease-300"><div style="padding-left: 2% !important; color: white; background-color: #4976c8; font-size: small; padding: 1.2%; border-radius: .5 em;">'+data[index].contentType+'</div><img class="w-100pc" playsinline="" id= "'+stringVal+'-img-'+i+data[index].description+'"  onerror="this.src=\'/static/image/test/certificate.jpg\'" style="visibility:hidden;pointer-events: none; width: 150px; height: 400px; object-fit: cover;" ><p style="padding-left:10px !important; padding-right:10px !important;font-weight: 450 !important; text-transform: capitalize;font-size: small !important; color: black !important;" class="fw-400 white fs-m3 mt-3">'+data[index].description+'</p><div class="indigo fs-s3 italic after-arrow-right my-4" style="padding-left: 13px !important;">Read..</div></a></div>';          

            });
          
    elm.innerHTML=html_message
    newDiv = document.createElement("div");
    newDiv.setAttribute("id", "searchD"+(idx+1));
    newDiv.setAttribute("class", "flex flex-wrap");
    elm.after(newDiv);
        })
        .complete(function(data) {
            var datas = document.querySelectorAll('[id^="'+stringVal+'-img-"]');
            Code = $("#countryCode option:selected").val().split("---")[0];
            data = ''
            datas.forEach((userItem) => {
                data=userItem.id+'---';
                $.ajax({
                    url: "/searchtopicsnewnewsForImg", // the url where we want to POST
                    data: {
                    "titles": data,
                    "lang":Code,
                    "strVal": stringVal
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
            if (count != 9999){
                searchView(pg, lang, idx+1, srch);
            }
        });
         
        return false;       
}

function refineSearchView(pg, lang, idx){
    if(idx==-1){
    var datas = document.querySelectorAll('div[id^="searchD"]');
    datas.forEach((userItem) => {
        if (userItem.id != "searchD"){
        var elem = document.getElementById(userItem.id); 
        elem.remove();
    }
    });
}    
    
    stringVal = "searchD"
    if (idx >=0){
        stringVal =stringVal + idx
    }
    else{window.scrollTo({ top: 0, behavior: "auto" });}
    var elm = document.getElementById(stringVal);
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
                i=i+1
                count = data[index].count;
                
              //  html_message +='<div onclick="gotoTechnology(\''+data[index].description+'\')" style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a href="#" class="block no-underline p-5 br-8 hover-bg-indigo-lightest-10 hover-scale-up-1 ease-300"><video class="w-100pc" poster="static/image/images/poster.jpg"  playsinline id="frameclk" controls style="pointer-events: none;" preload="none" controlsList="nofullscreen nodownload"  height="100%" width="100%"> type="video/mp4"></video><p style=" font-size: medium !important; color: black !important;" class="fw-600 white fs-m3 mt-3">'+data[index].description+'</p><div style="color: white; background-color: #4976c8; font-size: small; padding: 1.2%; border-radius: .5 em;">'+data[index].contentType+'</div><div class="indigo fs-s3 italic after-arrow-right my-4">More Info..</div></a></div>';          
                //  html_message +='<div onclick="gotoTechnology(\''+data[index].description+'\')" style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a href="#" class="block no-underline p-5 br-8 hover-bg-indigo-lightest-10 hover-scale-up-1 ease-300"><img class="w-100pc" playsinline="" id="frameclk" style="pointer-events: none;" height="100%" width="100%" src="/static/image/images/poster_video.jpg"><p style=" font-size: medium !important; color: black !important;" class="fw-600 white fs-m3 mt-3">'+'<img style="float: right;padding-bottom:10px;width:35px; height: 35px;object-fit: cover;" src="/static/image/images/'+data[index].technology+'_icon.png">'+data[index].description+'</p><div style="color: white; background-color: #4976c8; font-size: small; padding: 1.2%; border-radius: .5 em;">'+data[index].contentType+'</div><div class="indigo fs-s3 italic after-arrow-right my-4">More Info..</div></a></div>';          
                html_message +='<div  onclick="gotoTechnology1(\''+data[index].description+'\',\''+data[index].technology+'\',\''+stringVal+'-img-'+i+data[index].description+'\')" style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a style="padding: 0% !important;" class="block no-underline p-5 br-8 hover-bg-indigo-lightest-10 hover-scale-up-1 ease-300"><div style="padding-left: 2% !important; color: white; background-color: #4976c8; font-size: small; padding: 1.2%; border-radius: .5 em;">'+data[index].contentType+'</div><img class="w-100pc" playsinline="" id= "'+stringVal+'-img-'+i+data[index].description+'"  onerror="this.src=\'/static/image/test/certificate.jpg\'" style="visibility:hidden;pointer-events: none; width: 150px; height: 400px; object-fit: cover;" ><p style="padding-left:10px !important; padding-right:10px !important;font-weight: 450 !important; text-transform: capitalize;font-size: small !important; color: black !important;" class="fw-400 white fs-m3 mt-3">'+data[index].description+'</p><div class="indigo fs-s3 italic after-arrow-right my-4" style="padding-left: 13px !important;">Read..</div></a></div>';          

            });
          
    elm.innerHTML=html_message
    newDiv = document.createElement("div");
    newDiv.setAttribute("id", "searchD"+(idx+1));
    newDiv.setAttribute("class", "flex flex-wrap");
    elm.after(newDiv);
        })
        .complete(function(data) {
            var datas = document.querySelectorAll('[id^="'+stringVal+'-img-"]');
            Code = $("#countryCode option:selected").val().split("---")[0];
            data = ''
            datas.forEach((userItem) => {
                data=userItem.id+'---';
                $.ajax({
                    url: "/searchtopicsnewnewsForImg", // the url where we want to POST
                    data: {
                    "titles": data,
                    "lang":Code,
                    "strVal": stringVal
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
                    document.getElementById("initial").remove();

                    });
        
                });
            });
            if (count != 9999){
                refineSearchView(pg, lang, idx+1);
            }
        });
         
        return false;       
}

function getLanguage(pg){
    var elm = document.getElementById("lang");
    var html_message ="";
    $.ajax({
        url         : "/getLanguages", // the url where we want to POST
        data        : {"country":pg}, // our data object
        dataType    : 'json', // what type of data do we expect back from the server
        encode      : true
    })
        // using the done promise callback
        .done(function(data) {
            elm.innerHTML="";  
            $.each(data, function(index) {
              //  html_message +='<div onclick="gotoTechnology(\''+data[index].description+'\')" style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a href="#" class="block no-underline p-5 br-8 hover-bg-indigo-lightest-10 hover-scale-up-1 ease-300"><video class="w-100pc" poster="static/image/images/poster.jpg"  playsinline id="frameclk" controls style="pointer-events: none;" preload="none" controlsList="nofullscreen nodownload"  height="100%" width="100%"> type="video/mp4"></video><p style=" font-size: medium !important; color: black !important;" class="fw-600 white fs-m3 mt-3">'+data[index].description+'</p><div style="color: white; background-color: #4976c8; font-size: small; padding: 1.2%; border-radius: .5 em;">'+data[index].contentType+'</div><div class="indigo fs-s3 italic after-arrow-right my-4">More Info..</div></a></div>';          
                //  html_message +='<div onclick="gotoTechnology(\''+data[index].description+'\')" style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a href="#" class="block no-underline p-5 br-8 hover-bg-indigo-lightest-10 hover-scale-up-1 ease-300"><img class="w-100pc" playsinline="" id="frameclk" style="pointer-events: none;" height="100%" width="100%" src="/static/image/images/poster_video.jpg"><p style=" font-size: medium !important; color: black !important;" class="fw-600 white fs-m3 mt-3">'+'<img style="float: right;padding-bottom:10px;width:35px; height: 35px;object-fit: cover;" src="/static/image/images/'+data[index].technology+'_icon.png">'+data[index].description+'</p><div style="color: white; background-color: #4976c8; font-size: small; padding: 1.2%; border-radius: .5 em;">'+data[index].contentType+'</div><div class="indigo fs-s3 italic after-arrow-right my-4">More Info..</div></a></div>';          
                if (index == 1)
                    html_message +='<option selected value="'+data[index].name+'">'+data[index].name+'</option>';         
                else
                    html_message +='<option value="'+data[index].name+'">'+data[index].name+'</option>';          

            });
          
    elm.innerHTML=html_message;
        });
        return true;       
}

function populateCountry(pg){
    var default_c = "";
        if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(showPosition, function(error) {
            var elm = document.getElementById("countryCode");
    var html_message ="";
    $.ajax({
        url         : "/getCountries", // the url where we want to POST
        data        : {"search_string":pg, "def_C":""}, // our data object
        dataType    : 'json', // what type of data do we expect back from the server
        encode      : true
    })
        // using the done promise callback
        .done(function(data) {
            elm.innerHTML="";  
            $.each(data, function(index) {
              //  html_message +='<div onclick="gotoTechnology(\''+data[index].description+'\')" style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a href="#" class="block no-underline p-5 br-8 hover-bg-indigo-lightest-10 hover-scale-up-1 ease-300"><video class="w-100pc" poster="static/image/images/poster.jpg"  playsinline id="frameclk" controls style="pointer-events: none;" preload="none" controlsList="nofullscreen nodownload"  height="100%" width="100%"> type="video/mp4"></video><p style=" font-size: medium !important; color: black !important;" class="fw-600 white fs-m3 mt-3">'+data[index].description+'</p><div style="color: white; background-color: #4976c8; font-size: small; padding: 1.2%; border-radius: .5 em;">'+data[index].contentType+'</div><div class="indigo fs-s3 italic after-arrow-right my-4">More Info..</div></a></div>';          
                //  html_message +='<div onclick="gotoTechnology(\''+data[index].description+'\')" style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a href="#" class="block no-underline p-5 br-8 hover-bg-indigo-lightest-10 hover-scale-up-1 ease-300"><img class="w-100pc" playsinline="" id="frameclk" style="pointer-events: none;" height="100%" width="100%" src="/static/image/images/poster_video.jpg"><p style=" font-size: medium !important; color: black !important;" class="fw-600 white fs-m3 mt-3">'+'<img style="float: right;padding-bottom:10px;width:35px; height: 35px;object-fit: cover;" src="/static/image/images/'+data[index].technology+'_icon.png">'+data[index].description+'</p><div style="color: white; background-color: #4976c8; font-size: small; padding: 1.2%; border-radius: .5 em;">'+data[index].contentType+'</div><div class="indigo fs-s3 italic after-arrow-right my-4">More Info..</div></a></div>';          
                if (data[index].default_c=='1'){
                default_c = data[index].name
                    html_message +='<option selected value="'+data[index].name+'">'+data[index].name+'</option>';         
                }else
                    html_message +='<option value="'+data[index].name+'">'+data[index].name+'</option>';          

            });
          
    elm.innerHTML=html_message;
        })
        .complete(function(data) {
            getLanguage(default_c);
            refineSearchView(document.getElementById("countryCode").value, document.getElementById("lang").value, -1); 
            })
        return true;    
        });
        } else {
            var elm = document.getElementById("countryCode");
            var html_message ="";
            $.ajax({
                url         : "/getCountries", // the url where we want to POST
                data        : {"search_string":pg, "def_C":""}, // our data object
                dataType    : 'json', // what type of data do we expect back from the server
                encode      : true
            })
                // using the done promise callback
                .done(function(data) {
                    elm.innerHTML="";  
                    $.each(data, function(index) {
                      //  html_message +='<div onclick="gotoTechnology(\''+data[index].description+'\')" style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a href="#" class="block no-underline p-5 br-8 hover-bg-indigo-lightest-10 hover-scale-up-1 ease-300"><video class="w-100pc" poster="static/image/images/poster.jpg"  playsinline id="frameclk" controls style="pointer-events: none;" preload="none" controlsList="nofullscreen nodownload"  height="100%" width="100%"> type="video/mp4"></video><p style=" font-size: medium !important; color: black !important;" class="fw-600 white fs-m3 mt-3">'+data[index].description+'</p><div style="color: white; background-color: #4976c8; font-size: small; padding: 1.2%; border-radius: .5 em;">'+data[index].contentType+'</div><div class="indigo fs-s3 italic after-arrow-right my-4">More Info..</div></a></div>';          
                        //  html_message +='<div onclick="gotoTechnology(\''+data[index].description+'\')" style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a href="#" class="block no-underline p-5 br-8 hover-bg-indigo-lightest-10 hover-scale-up-1 ease-300"><img class="w-100pc" playsinline="" id="frameclk" style="pointer-events: none;" height="100%" width="100%" src="/static/image/images/poster_video.jpg"><p style=" font-size: medium !important; color: black !important;" class="fw-600 white fs-m3 mt-3">'+'<img style="float: right;padding-bottom:10px;width:35px; height: 35px;object-fit: cover;" src="/static/image/images/'+data[index].technology+'_icon.png">'+data[index].description+'</p><div style="color: white; background-color: #4976c8; font-size: small; padding: 1.2%; border-radius: .5 em;">'+data[index].contentType+'</div><div class="indigo fs-s3 italic after-arrow-right my-4">More Info..</div></a></div>';          
                        if (data[index].default_c=='1'){
                        default_c = data[index].name
                            html_message +='<option selected value="'+data[index].name+'">'+data[index].name+'</option>';         
                        }else
                            html_message +='<option value="'+data[index].name+'">'+data[index].name+'</option>';          
        
                    });
                  
            elm.innerHTML=html_message;
                })
                .complete(function(data) {
                    getLanguage(default_c);
                    refineSearchView(document.getElementById("countryCode").value, document.getElementById("lang").value, -1); 
                    })
                
                return true;   
            

      }
        
      
      
      function showPosition(position) { 
        var elm = document.getElementById("countryCode");
    var html_message ="";
    $.ajax({
        url         : "/getCountries", // the url where we want to POST
        data        : {"search_string":pg, "def_C":position.coords.latitude + "," + position.coords.longitude}, // our data object
        dataType    : 'json', // what type of data do we expect back from the server
        encode      : true
    })
        // using the done promise callback
        .done(function(data) {
            elm.innerHTML="";  
            $.each(data, function(index) {
              //  html_message +='<div onclick="gotoTechnology(\''+data[index].description+'\')" style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a href="#" class="block no-underline p-5 br-8 hover-bg-indigo-lightest-10 hover-scale-up-1 ease-300"><video class="w-100pc" poster="static/image/images/poster.jpg"  playsinline id="frameclk" controls style="pointer-events: none;" preload="none" controlsList="nofullscreen nodownload"  height="100%" width="100%"> type="video/mp4"></video><p style=" font-size: medium !important; color: black !important;" class="fw-600 white fs-m3 mt-3">'+data[index].description+'</p><div style="color: white; background-color: #4976c8; font-size: small; padding: 1.2%; border-radius: .5 em;">'+data[index].contentType+'</div><div class="indigo fs-s3 italic after-arrow-right my-4">More Info..</div></a></div>';          
                //  html_message +='<div onclick="gotoTechnology(\''+data[index].description+'\')" style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a href="#" class="block no-underline p-5 br-8 hover-bg-indigo-lightest-10 hover-scale-up-1 ease-300"><img class="w-100pc" playsinline="" id="frameclk" style="pointer-events: none;" height="100%" width="100%" src="/static/image/images/poster_video.jpg"><p style=" font-size: medium !important; color: black !important;" class="fw-600 white fs-m3 mt-3">'+'<img style="float: right;padding-bottom:10px;width:35px; height: 35px;object-fit: cover;" src="/static/image/images/'+data[index].technology+'_icon.png">'+data[index].description+'</p><div style="color: white; background-color: #4976c8; font-size: small; padding: 1.2%; border-radius: .5 em;">'+data[index].contentType+'</div><div class="indigo fs-s3 italic after-arrow-right my-4">More Info..</div></a></div>';          
                if (data[index].default_c=='1')
                    html_message +='<option selected value="'+data[index].name+'">'+data[index].name+'</option>';         
                else
                    html_message +='<option value="'+data[index].name+'">'+data[index].name+'</option>';          

            });
          
    elm.innerHTML=html_message;
        })
        .complete(function(data) {
        refineSearchView(document.getElementById("countryCode").value, document.getElementById("lang").value, -1); 
        })
        return true;   

      }
   
    }   


function gotoTechnology1(pg, url, img){   
    window.stop();
    window.open(window.location.origin+"/news/technology?technology="+pg+"&Code="+$("#countryCode option:selected").val()+"&url="+url+"&image="+document.getElementById(img).src, "_self");
   
}

function gotoTechnology2(pg, url, img){   
    window.stop();
    window.open(window.location.origin+"/news/technology?technology="+pg+"&Code="+$("#countryCode option:selected").val()+"&direct=Financial", "_self");
    
}

function gotoTechnology(pg){   
    window.stop();
    window.open(window.location.origin+"/news/technology?technology="+pg+"&Code="+$("#countryCode option:selected").val(), "_self");
    /*    $.ajax({
            url         : "hi", // the url where we want to POST
            data        : {"technology":pg}, // our data object
            dataType    : "html", // what type of data do\ we expect back from the server
            encode      : true
        }) .done(function(data) {
                                document.open("text/html", "load")
                                document.write(data);
                                document.close();
                                    // here we will handle errors and validation messages
                                });
        event.preventDefault();*/
}

function gotoTechnologyVideo(pg){
    window.open(window.location.origin+"/technologies/technology?technology="+pg, "_self");
    /*    $.ajax({
            url         : "hi", // the url where we want to POST
            data        : {"technology":pg}, // our data object
            dataType    : "html", // what type of data do\ we expect back from the server
            encode      : true
        }) .done(function(data) {
                                document.open("text/html", "load")
                                document.write(data);
                                document.close();
                                    // here we will handle errors and validation messages
                                });
        event.preventDefault();*/
}




function parseVideoLink(linkVid){        
    var tmpStr  = linkVid.match("/d/(.*)/preview");
    var newStr = 'https://drive.google.com/uc?export=download&id='+tmpStr[1];
    return newStr;
}


