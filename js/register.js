const register = document.getElementById("RegisterForm");

const inputPassword = document.getElementById("inputPassword");
const inputConfirmPassword = document.getElementById("inputConfirmPassword");
const inputEmailId = document.getElementById("emailId");
const inputUserName = document.getElementById("userName");

const passwordConfirmHelpBlock = document.getElementById("passwordConfirmHelpBlock");
const userNameHelpBlock = document.getElementById("userNameHelpBlock");

const passwordRule1 = document.getElementById("PasswordRule1");
const passwordRule2 = document.getElementById("PasswordRule2");
const passwordRule3 = document.getElementById("PasswordRule3");

const inputPasswordShow = document.getElementById("inputPasswordShow");
const inputPasswordHide = document.getElementById("inputPasswordHide");
const inputConfirmPasswordShow = document.getElementById("inputConfirmPasswordShow");
const inputConfirmPasswordHide = document.getElementById("inputConfirmPasswordHide");

var registerModal = new bootstrap.Modal(document.getElementById("RegisterModal"));
var liveToast = new bootstrap.Toast(document.getElementById("liveToast"));

const toastHeader = document.getElementById("ToastHeader");
const toastBody = document.getElementById("ToastBody");
const toastDetail = document.getElementById("ToastDetail");

function toast(header, detail, body)
{
    toastHeader.textContent = header;
    toastBody.innerHTML = body;
    toastDetail.textContent = detail;
    liveToast.show();
}

function ValidateUserName()
{
    if (/[^a-zA-Z0-9 ]/.test(register.userName.value) == true)
    {
        userNameHelpBlock.textContent = "User Name can only contain Letters and Numbers";
    }
    else
    {
        userNameHelpBlock.textContent = "";
    }
}

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
        passwordConfirmHelpBlock.innerText = "";
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

function ToggleConfirmPassword()
{
    // toggle the type attribute
    const type = inputConfirmPassword.getAttribute("type") === "password" ? "text" : "password";
    inputConfirmPassword.setAttribute("type", type);

    // toggle eye icon
    if (inputConfirmPasswordHide.style.display == "none")
    {
        inputConfirmPasswordShow.style.display = "none";
        inputConfirmPasswordHide.style.display = "inline-block";
    }
    else
    {
        inputConfirmPasswordShow.style.display = "inline-block";
        inputConfirmPasswordHide.style.display = "none";
    }
}

function Register()
{
    let currentPassword = register.inputPassword.value;
    let userName = register.userName.value;

    let validPassword = true;
    let errors = '<ul style = "margin-bottom: 0px">';
    let noErrors = true;

    // Email should contain @
    if (!(register.emailId.value.includes("@")))
    {
        noErrors = false;
        errors += "<li>Invalid email, it should contain '@'</li>";
    }

    if (/[^a-zA-Z0-9 ]/.test(userName) == true)
    {
        noErrors = false;
        errors += "<li>User Name can only contain Letters and Numbers</li>";
    }

    if (!((currentPassword.length >= 8) && (currentPassword.length <= 20)))
    {
        noErrors = false;
        errors += "<li>Password must contain 8-20 characters</li>";
        validPassword = false;
    }

    if (!((/[a-z]/.test(currentPassword) == true) && (/[A-Z]/.test(currentPassword) == true)))
    {
        noErrors = false;
        errors+= "<li>Password must contain an Uppercase and a Lowercase letter</li>";
        validPassword = false;
    }

    if (!((/[0-9]/.test(currentPassword) == true) || (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(currentPassword) == true)))
    {
        noErrors = false;
        errors += "<li>Password must contain a number or a special character</li>";
        validPassword = false;
    }

    if (validPassword == true)
    {
        if (register.inputConfirmPassword.value != currentPassword)
        {
            noErrors = false;
            errors += "<li>Passwords do not match</li>";
        }
    }

    errors += "</ul>";
    
    if (noErrors == true)
    {
        registerModal.show();
    }
    else
    {
        toast("Register", "ERROR", errors);
    }
}
