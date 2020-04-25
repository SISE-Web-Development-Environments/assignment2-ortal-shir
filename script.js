

//-------------------------------------Start switch page-----------------------
function ShowContent(content) {
    document.getElementById("Welcome").style.display = 'none'
    document.getElementById("Registration").style.display = 'none';
   // document.getElementById("Presskey").style.display = 'none'
    document.getElementById(content).style.display = 'block';
}
//-------------------------------------End switch page--------------------


//-------------------------------------Start registering-----------------------------------
$.validator.addMethod('checkpassword', function (inputtxt) {
    var passw=  /^[0-9a-zA-Z]+$/;
    //(?=.*[0-9])(?=.*[a-zA-Z])
    if(inputtxt.match(passw)) 
    { 
        return true;
    }
    return false;
}, 'The password must contain only letters and numbers');

$.validator.addMethod('checkname', function (inputtxt) {
    var name=  /^[a-zA-Z]+$/;
    if(inputtxt.match(name)) 
    { 
        return true;
    }
     return false; 
}, 'The name must contain only letters');


$(function() {
    // Wait for the DOM to be ready
    $().ready(function() {
        $("form[id='registration']").validate({
            rules: {
                username:  "required",
                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true,
                    minlength: 6,
                    checkpassword: true
                },
                cpassword: {
                    required: true,
                    equalTo: "#password",
                    minlength: 6,
                    checkpassword: true
                   
                },
                firstname: {
                    checkname: true,
                    required: true
                },
                lastname: {
                    checkname: true,
                    required: true
                }
               
            },
            // Specify validation error messages
            messages: {
                username: "Please enter your user name",
                password: {
                    required: "Please provide a password",
                    minlength: "Your password must be at least 6 characters long",
                    checkpassword: "The password must contain at least one letter and one digit"
                },
                cpassword: {
                    required: "Please provide a password",
                    minlength: "Your password must be at least 6 characters long",
                    equalTo: "   The passwords do not match",
                    checkpassword: "The password must contain at least one letter and one digit"
                },
                firstname: {
                    checkname: "    The name must contain only letters",
                    required : "Please enter your firstname"
                },
                lastname: {
                    checkname: "    The name must contain only letters",
                    required : "Please enter your firstname"
                },
                email: {
                    required: "Please enter email address",
                    email: "Please enter a valid email address"
                }
              
            },
            submitHandler: function(form) {
                form.submit();
            }
           
        });
    });
});


//-------------------------------------End registering---------------------------------------

function Submit(){
    let userData = {
        password:  document.getElementById("password").value,
        firstname: document.getElementById("firstname").value,
        lastname: document.getElementById("lastname").value,
        email: document.getElementById("email").value,
        day:  document.getElementById("day").value,
        month:  document.getElementById("month").value,
        Year:  document.getElementById("month").value
    };
    localStorage.setItem(document.getElementById("username").value,JSON.stringify(userData));
}

