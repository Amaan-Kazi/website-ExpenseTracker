const register = document.getElementById("RegisterForm");
const passwordRule1 = document.getElementById("PasswordRule1");
const passwordRule2 = document.getElementById("PasswordRule2");
const passwordRule3 = document.getElementById("PasswordRule3");

var emailId;
var userName;
var password;

function ValidatePassword()
{
    let currentPassword = register.inputPassword.value;

    if ((currentPassword.length >= 8) && (currentPassword.length <= 20))
    {
        passwordRule1.style.color = "rgb(56, 243, 56)";
    }
    else
    {
        passwordRule1.style.color = "rgb(189, 55, 55)";
    }

    if ((/[a-z]/.test(currentPassword) == true) && (/[A-Z]/.test(currentPassword) == true))
    {
        passwordRule2.style.color = "rgb(56, 243, 56)";
    }
    else
    {
        passwordRule2.style.color = "rgb(189, 55, 55)";
    }

    if ((/[0-9]/.test(currentPassword) == true) || (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(currentPassword) == true))
    {
        passwordRule3.style.color = "rgb(56, 243, 56)";
    }
    else
    {
        passwordRule3.style.color = "rgb(189, 55, 55)";
    }
}

register.addEventListener("submit", function (event) {
    event.preventDefault();
    emailId = register.emailId.value;
    userName = register.userName.value;
    
    if (register.inputPassword.value == register.inputConfirmPassword.value)
    {
        password = register.inputPassword.value;
    }
    else
    {
        console.log("Passwords do not match");
    }

    console.log(emailId);
    console.log(userName);
    console.log(password);
});
