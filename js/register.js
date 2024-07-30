const register = document.getElementById("RegisterForm");

const inputPassword = document.getElementById("inputPassword");
const inputConfirmPassword = document.getElementById("inputConfirmPassword");

const passwordConfirmHelpBlock = document.getElementById("passwordConfirmHelpBlock");

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

function MatchPasswords()
{
    if ((register.inputPassword.value == register.inputConfirmPassword.value) && (register.inputPassword.value != null))
    {
        console.log(register.inputPassword.value.length);
        passwordConfirmHelpBlock.innerText = "";
        //passwordConfirmHelpBlock.style.color = "rgb(56, 243, 56)";
        //passwordConfirmHelpBlock.innerText = "Passwords Match";
    }
    else if ((register.inputPassword.value != null) && (register.inputPassword.value != null))
    {
        passwordConfirmHelpBlock.style.color = "rgb(189, 55, 55)";
        passwordConfirmHelpBlock.innerText = "Passwords do not match";
    }
}

function TogglePassword()
{
    // toggle the type attribute
    const type = inputPassword.getAttribute("type") === "password" ? "text" : "password";
    inputPassword.setAttribute("type", type);

    // toggle eye icon
}

function ToggleConfirmPassword()
{
    // toggle the type attribute
    const type = inputConfirmPassword.getAttribute("type") === "password" ? "text" : "password";
    inputConfirmPassword.setAttribute("type", type);

    // toggle eye icon
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
