const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");

const app = express();

// when the page hosted on to the local host css and image is not applied                                    
// it is because we're using bootstrap which fetches all the data
// from a remote location
// so inorder to fetch the data from the local position we've to 
// use a static function.
app.listen(process.env.PORT || 3000 , function()
{
    console.log("PORT STARTED IN 3000");
});

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));


app.get("/" , function(req ,res)
{
    res.sendFile(__dirname + "/signup.html");
});

app.post("/" , function(req , res)
{
    const firstName = req.body.Firstname;
    const lastName = req.body.Lastname;
    const email = req.body.email ;

    console.log(firstName + " " + lastName + " " + email ) ;

    // creating a json data to be posted onto the page

    const data =
    {
        members : 
        [
            {
                "email_address" : email ,
                "status" : "subscribed" ,
                "merge_fields" :
                {
                    "LNAME" : lastName ,
                    "FNAME" : firstName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    // making a api call to dump the data into the mailchimp using https request

    const url = "https://us14.api.mailchimp.com/3.0/lists/b9e867465a" ;

    const options = 
    {
        method : "POST" , 
        auth : "Ram:19ef36b1716c44739e35a5c78fa465ec-us14"
    };

    const Request = https.request( url , options , function(response)
    {

        if( response.statusCode == 200 )
        {
            // res.send("<h1>Successfully subscribed</h1>");
            res.sendFile(__dirname + "/success.html")
        }
        else
        {
            // res.send("<h1>FAILED</h1>");
            res.sendFile(__dirname + "/failure.html")
        }

        if (response.error) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            console.log(response.error.data);
            console.log(response.error.status);
            console.log(response.error.headers);
        }

        // console.log("------------------------------------------------------------------------The error code is ------------------------------------------------------------------------ " , error.response);

        // if( error.response == 'ERROR_CONTACT_EXISTS')
        // {
        //     res.sendFile(__dirname + "/exist.html");
        // }
        response.on("error" , function(err)
        {
          console.log(err);
        });

        console.log("response : " , response.statusCode) ;
        
        response.on("data" , function(data)
        {
            console.log(JSON.parse(data));
        });

    });

    Request.write(jsonData);
    Request.end();

});

app.post("/failure" , function(req ,res)
{
    res.redirect("/");
})
    
app.post("/success" , function(req, res)
{
    res.redirect("/");
})
    /*
        Errors
        ECONNRESET - not listening to the errors in https request.
        401 ERROR - spaces in the auth section
        400 ERROR - wrong mail chimp data fields
        data not defined - used the declared variable out of the scope of the parantheses
        wrong code --> review the particular videos again
        
        what to do with existing contact ?
    */


// api key : 8397075dfd2a3bf897f9192f5d02ec88-us14
// 8397075dfd2a3bf897f9192f5d02ec88-us14
// audience id : b9e867465a | b9e867465a
// 8397075dfd2a3bf897f9192f5d02ec88-us14
// 19ef36b1716c44739e35a5c78fa465ec-us14