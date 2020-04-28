
$(document).ready(function() {
	registerP();
});

//-------------------------------------Start switch page-----------------------
function exitWelcomePage(content){
    document.getElementById("navbar").style.display = 'block';
    ShowContent(content);
}

function enterWelcomePage(){
    document.getElementById("navbar").style.display = 'none';
    ShowContent("Welcome");
}

function ShowContent(content) {
    document.getElementById("Welcome").style.display = 'none'
    document.getElementById("Registration").style.display = 'none';
    document.getElementById("login_form").style.display = 'none';
    //document.getElementById("About").style.display = 'none';
    document.getElementById("Setting").style.display = 'none';
    document.getElementById("Game").style.display = 'none';
    document.getElementById(content).style.display = 'contents';
    if(content == 'Game'){
        Start();
    }else{
        window.clearInterval(interval);	
        audio.pause();	
    }
    

}


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

$.validator.addMethod('checkUserName', function (inputtxt) {
    for(let i=0 ; i< localStorage.length; i++){
        if(localStorage.key(i) == inputtxt){
            return false;
        }
    }
    return true;
}, 'Username already exists. Please select another username');

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
                username: {
                    required: true,
                    checkUserName: true
                },
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
                },
                birthday: "required"
               
            },
            // Specify validation error messages
            messages: {
                username:{
                    required: "Please enter your user name",
                    checkUserName: "Username already exists on site Please select another name"
                },
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
                },
                birthday : "Please provide a birthday"
              
            },
            highlight: function(element) {
                $(element).css('background', 'rgb(207, 106, 106)');
            },
            unhighlight: function(element) {
                $(element).css('background', 'white');
            },          
            submitHandler: function(form) {
                form.Submit();
            }           
        });
    });
});



function Submit(){
    if( $('#registration').valid()){
        window.alert("Your registration has been successful");
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

}


// -----------------------------------------------------login----------------------------------------------------------//
function login(){
	let password_input = document.getElementById("password_input").value;
	let user_input = localStorage.getItem(document.getElementById("username_input").value);
	let correct_user_password;
	if(user_input != null){
		correct_user_password = JSON.parse(user_input)['password'];
	}
	if(password_input != correct_user_password || user_input == null){
		window.alert("wrong username or password");
	}
	else{
        addGameToMenu();
        ShowContent('Setting');
	}
} 

function addGameToMenu() {
    $('#navbar_btns').append('<li class=\'menu\'> <a class="navbar_a" href=\'#Game\' onclick="ShowContent(\'Game\');">Game</a></li>');
    //TODO <li class="menu"> <input type="image" src="./resource/photo/about_navbar.png" alt="About" onclick="ShowContent('About')"> </li>
    // <li class="menu"> <a class="navbar_a" href="#Setting" onclick="ShowContent('Setting')">Settings</a></li>
}


function registerP(){
	let pData = {
        password:  "p",
        firstname: "p",
        lastname: "p",
        email: "p@gmail.com",
        date:  ""
    };
    localStorage.setItem("p",JSON.stringify(pData));
}

