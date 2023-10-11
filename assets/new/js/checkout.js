$(function() {      
    checkout();
    
});


function checkout(event){
                // process the form
                $.ajax({
                    url         : "/checkout", // the url where we want to POST
                    data        : {"email":'email'}, // our data object
                    dataType    : "json", // what type of data do\ we expect back from the server
                    encode      : true
                })
                
                    // using the done promise callback
                    .done(function(data) {
                        document.getElementById("checkout_list").innerHTML=''
                        htmlData = ''
                        
                        $.each(data, function(index) {

                            htmlData+='<div class="wrap-input100 checkbox"><input style="margin-left: 12px;" checked type="checkbox" id="'+data[index].display+'" name="'+data[index].display+'" value="Bike"><label style="margin-left: 12px;font-size: initial;" for="'+data[index].display+'">'+data[index].display+'</label><img src="'+data[index].imageUrl+'" alt="TEKLRN" width="100%" height="200"><div><div style="float: left; margin-top:10px;"><button style="background: black; border-radius: 5px;height: 15px;"  type="button" id="email_"  class="login100-form-btn"><a style="font-size: x-small;">Edit<a></button></div><div style="float: left; margin-left: 3px; margin-top:10px;"><button style="background: #3a69bb; border-radius: 5px;height: 15px;"  type="button" id="email_e" onclick="removeAdd(\''+data[index].display+'\')"   class="login100-form-btn"><a style="font-size: x-small;">Remove<a> </button></div></div></div>'
                        
                        });
                        document.getElementById("checkout_list").innerHTML=htmlData;
        });

        event.preventDefault();
        return false
}

function removeAdd(Ad){
    // process the form
    $.ajax({
        url         : "/checkout_removeAdd", // the url where we want to POST
        data        : {"ad_number":Ad.replace('Advertisement ', '')}, // our data object
        dataType    : "json", // what type of data do\ we expect back from the server
        encode      : true
    })
    
        // using the done promise callback
        .done(function(data) {
            document.getElementById("checkout_list").innerHTML=''
            htmlData = ''
            
            i=0

            $.each(data, function(index) {
            if(data[index].display=='NONE'){
                window.open(window.location.origin+"/add_advertisements", "_self")
            }

            htmlData+='<div class="wrap-input100 checkbox"><input  style="margin-left: 12px;" checked type="checkbox" id="'+data[index].display+'" name="'+data[index].display+'" value="Bike"><label style="margin-left: 12px;font-size: initial;" for="'+data[index].display+'">'+data[index].display+'</label><img src="'+data[index].imageUrl+'" alt="TEKLRN" width="100%" height="200"><div><div style="float: left; margin-top:10px;"><button style="background: black; border-radius: 5px;height: 15px;"  type="button" id="email_"  class="login100-form-btn"><a style="font-size: x-small;">Edit<a></button></div><div style="float: left; margin-left: 3px; margin-top:10px"><button style="background: #3a69bb; border-radius: 5px;height: 15px;"  type="button" id="email_e" onclick="removeAdd(\''+data[index].display+'\')"   class="login100-form-btn"><a style="font-size: x-small;">Remove<a> </button></div></div></div>'
            i=i+1
            });
            document.getElementById("checkout_list").innerHTML=htmlData;
            document.getElementById("items").value = i
            document.getElementById("amount").value = 13.0*i

});

event.preventDefault();
return false
}

function addAds(event){
    window.open(window.location.origin+"/add_advertisements", "_self");
  
}

function paymentPage(event) {
    $.ajax({
        url         : "/proceed_to_pay", // the url where we want to POST
        type        : 'post',
        data        : {"course":'Ternsorflow', "level":'1', "datetimeval": '1' , "zone":'1', "csrfmiddlewaretoken" : getCookie('csrftoken')}, // our data object
        dataType    : "html", // what type of data do\ we expect back from the server
        encode      : true
    })
        // using the done promise callback
       .done(function(data) {
        // closeBookingForm(); 
        document.open("text/html", "load")
        document.write(data);
        document.close();
            // here we will handle errors and validation messages
        });
       
    // stop the form from submitting the normal way and refreshing the page
    event.preventDefault();

}