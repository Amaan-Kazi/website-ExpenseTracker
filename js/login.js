const register = document.getElementById("RegisterForm");

const inputPassword = document.getElementById("inputPassword");
const inputConfirmPassword = document.getElementById("inputConfirmPassword");

const passwordConfirmHelpBlock = document.getElementById("passwordConfirmHelpBlock");

const passwordRule1 = document.getElementById("PasswordRule1");
const passwordRule2 = document.getElementById("PasswordRule2");
const passwordRule3 = document.getElementById("PasswordRule3");

const inputPasswordShow = document.getElementById("inputPasswordShow");
const inputPasswordHide = document.getElementById("inputPasswordHide");
const inputConfirmPasswordShow = document.getElementById("inputConfirmPasswordShow");
const inputConfirmPasswordHide = document.getElementById("inputConfirmPasswordHide");

var emailId;
var userName;
var password;

function TogglePassword()
{
    // toggle the type attribute
    const type = inputPassword.getAttribute("type") === "password" ? "text" : "password";
    inputPassword.setAttribute("type", type);

    // toggle eye icon
    if (inputPasswordHide.style.display == "none")
    {
        inputPasswordShow.style.display = "none";
        inputPasswordHide.style.display = "inline-block";
    }
    else
    {
        inputPasswordShow.style.display = "inline-block";
        inputPasswordHide.style.display = "none";
    }
}
