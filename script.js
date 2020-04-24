

//-------------------------------------Start switch page
function ShowContent(content) {
    document.getElementById("Welcome").style.display = 'none'
    document.getElementById("Registration").style.display = 'none';
    document.getElementById(content).style.display = 'block';
}
//-------------------------------------End switch page



//------------------------------Start - Script to switch between pages when registering 
function progressbar() {
    var current_fs, next_fx,previous_fs; //fieldset
    var left, opacity,scale;
    $("#next").click(function(){
        current_fs = $(this).parent();
        next_fx=$(this).parent().next();

        $("#progressbar li").eq($("#registration fieldset").index(next_fx)).addClass("active");
        next_fx.show();
        current_fs.animate({opacity:0 },{
            step:function(now,mx){
                scale=1-(1-now)*0.2;
                left= (now*50)+"%";
                opacity= 1-now;
                current_fs.css({'transform':'scale('+scale+')'});
                next_fx.css({'left':left,'opacity':opacity});
                },
                duration: 100,
                complete:function(){
                    current_fs.hide();
                },
                easing:'easeInOutBack'
        });

    });
    $("#previous").click(function(){
       current_fs=$(this).parent();
       previous_fs = $(this).parent().prev();
        
        //de-activate current step on progressbar
        $("#progressbar li").eq($("#registration fieldset").index(current_fs)).removeClass("active");
        
        //show the previous fieldset
        previous_fs.show(); 
        //hide the current fieldset with style
        current_fs.animate({opacity: 0}, {
            step: function(now, mx) {
                //as the opacity of current_fs reduces to 0 - stored in "now"
                //1. scale previous_fs from 80% to 100%
                scale = 0.8 + (1 - now) * 0.2;
                //2. take current_fs to the right(50%) - from 0%
                left = ((1-now) * 50)+"%";
                //3. increase opacity of previous_fs to 1 as it moves in
                opacity = 1 - now;
                current_fs.css({'left': left});
                previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
            }, 
            duration: 100, 
            complete: function(){
                current_fs.hide();
                animating = false;
            }, 
            //this comes from the custom easing plugin
            easing: 'easeInOutBack'
        });
    });
}

//-----------------------------End Script to switch between pages when registering

//-------------------------------------Start registering
$(function() {
    // Wait for the DOM to be ready
    $().ready(function() {
        $("form[id='registration']").validate({
            rules: {
                username:  "required",
                firstname: "required",
                lastname: "required",
                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true,
                    minlength: 6,
                    range:[A-Za-z0-9]
                },
                cpassword: {
                    required: true,
                    minlength: 6,
                    equalTo: "#password"
                }
               
            },
            // Specify validation error messages
            messages: {
                username: "Please enter your user name",
                password: {
                    required: "Please provide a password",
                    minlength: "Your password must be at least 6 characters long"
                },
                cpassword: {
                    required: "Please provide a password",
                    minlength: "Your password must be at least 6 characters long",
                    equalTo: "The passwords do not match"
                },
                firstname: "Please enter your firstname",
                lastname: "Please enter your lastname",
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
//-------------------------------------End registering
