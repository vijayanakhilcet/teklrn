function doLaunch(event) {
        $.ajax({
            url         : "hi", // the url where we want to POST
            data        : {"email":"hELLO"}, // our data object
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
        