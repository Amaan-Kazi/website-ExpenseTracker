const register = document.getElementById("RegisterForm");
const htmlBody = document.getElementById("htmlBody");

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

const modalEmail = document.getElementById("modalEmail");

const toastHeader = document.getElementById("ToastHeader");
const toastBody = document.getElementById("ToastBody");
const toastDetail = document.getElementById("ToastDetail");

var userInfo = {};

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

async function Register()
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

    if (userName.replace(/\s/g, "").length < 4)
    {
        noErrors = false;
        errors += "<li>User Name must have atleast 4 characters</li>";
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
        let response = await fetch(`https://amaankazi-expensetracker.onrender.com/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: register.emailId.value,
                userName: userName,
                password: currentPassword
            })
        });
        let responseData = await response.json();

        if (responseData.status == "SUCCESSFUL")
        {
            modalEmail.textContent = register.emailId.value;

            userInfo = {
                email: register.emailId.value,
                userName: userName,
                password: currentPassword
            }

            registerModal.show();
        }
        else if (responseData.status == "USER INPUT ERROR")
        {
            toast("Register", "ERRORS", responseData.errors);
        }
        else
        {
            toast("Register", "ERROR", responseData.error);
        }
    }
    else
    {
        toast("Register", "ERROR", errors);
    }
}

async function RegisterCode()
{
    let response = await fetch(`https://amaankazi-expensetracker.onrender.com/registerCode`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: register.emailId.value,
            code: document.getElementById("verificationCode").value
        })
    });
    let responseData = await response.json();
    
    if (responseData.status == "SUCCESSFUL")
    {
        registerModal.hide();

        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        toast("Register", "Successful", "The account has been succesfully registered<br>Redirecting in 3 seconds");

        setTimeout(() => {
            window.location.href = "./expenses.html";
        }, 3000);
    }
    else
    {
        registerModal.hide();
        toast("Register", responseData.status, responseData.error);
    }
}
