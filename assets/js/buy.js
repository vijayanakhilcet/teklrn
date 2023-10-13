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