$(document).ready(function () {
    
    var runit = 0;     
    refineSearchView("zzz");
    document.getElementById("course-search").focus();

    $("#course-search").autocomplete({  
        source: "/autocomplete",
        dataType: 'json',
        select: function( event , ui ) {
        gotoTechnology(ui.item.value);        
        runit = 1;
           }
});

$("#course-search").on('keyup', function (event) {
        if(runit === 0){
            if (event.keyCode === 13) {                                     
                $("#course-search").blur();            
                refineSearchView(event.target.value);    
            }
        }  
                
         runit = 0;   
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

function refineSearchView(pg){
    var elm = document.getElementById("searchData");
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
                html_message +='<div onclick="gotoTechnology(\''+data[index].description+'\')" style="padding: 0 !important;" class="w-100pc md-w-33pc p-10"><a href="#" class="block no-underline p-5 br-8 hover-bg-indigo-lightest-10 hover-scale-up-1 ease-300"><video class="w-100pc" poster="static/image/images/poster.jpg"  playsinline id="frameclk" controls style="pointer-events: none;" preload="none" controlsList="nofullscreen nodownload"  height="100%" width="100%"><source src="'+parseVideoLink(data[index].videoLink)+'" type="video/mp4"></video><p style=" font-size: medium !important; color: #629DD1 !important;" class="fw-600 white fs-m3 mt-3">'+data[index].description+'</p><div style="color: white; background-color: #629DD1; font-size: small; padding: 1.2%; border-radius: .5 em;">'+data[index].contentType+'</div><div class="indigo fs-s3 italic after-arrow-right my-4">More Info..</div></a></div>';          
            });
          
    elm.innerHTML=html_message;
        });
        return false;       
}



function gotoTechnology(pg){
        $.ajax({
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
        event.preventDefault();
}


function parseVideoLink(linkVid){        
    var tmpStr  = linkVid.match("/d/(.*)/preview");
    var newStr = 'https://drive.google.com/uc?export=download&id='+tmpStr[1];
    return newStr;
}


