// $(document).ready(function() {

//     $('#use_default_card').change(function() {
//         var x = document.getElementById("buy-form");
//         var y = document.getElementById("frm-auto-pay-display");
//         if( ! this.checked) {
//             x.children[2].click();
//             x.click();
//         }
          
//     });
// });

function makePayment(event){
    var deflt = document.getElementById("use_default_card");
    var x = document.getElementById("buy-form");
    var y = document.getElementById("frm-auto-pay-display");
        if(typeof(deflt) == 'undefined' ||  deflt == null || ! deflt.checked) {
            x.children[2].click();
            x.click();
        }
        else{
            $.ajax({
        url         : "charge/", // the url where we want to POST
        type        : 'post',
        data        : {"stripeToken": '', 'auto_pay':'0'}, 
        dataType    : "html", // what type of data do\ we expect back from the server
        encode      : true
    })
    .done(function(data) {
        document.open("text/html", "load")
        document.write(data);
        document.close();
            // here we will handle errors and validation messages
        });

        }
}

function checkoutAndPay() {
    $.ajax({
        url         : "charge/", // the url where we want to POST
        type        : 'post',
        data        : {"stripeToken": document.forms[0].stripeToken.value}, 
        dataType    : "html", // what type of data do\ we expect back from the server
        encode      : true
    })
    .done(function(data) {
        document.open("text/html", "load")
        document.write(data);
        document.close();
            // here we will handle errors and validation messages
        });
       
       
    // stop the form from submitting the normal way and refreshing the page
    //event.preventDefault();
}

function addAds(event){
    window.open(window.location.origin+"/add_advertisements", "_self");
  
}

function checkoutVideo() {
    $.ajax({
        url         : "chargevideo/", // the url where we want to POST
        type        : 'post',
        data        : {"stripeToken": document.forms[0].stripeToken.value}, 
        dataType    : "html", // what type of data do\ we expect back from the server
        encode      : true
    })
    .done(function(data) {
        document.open("text/html", "load")
        document.write(data);
        document.close();
            // here we will handle errors and validation messages
        });
       
       
    // stop the form from submitting the normal way and refreshing the page
    //event.preventDefault();
}