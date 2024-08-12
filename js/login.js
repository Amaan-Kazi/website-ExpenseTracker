const login = document.getElementById("LoginForm");

const inputPassword = document.getElementById("inputPassword");
const inputPasswordShow = document.getElementById("inputPasswordShow");
const inputPasswordHide = document.getElementById("inputPasswordHide");

var liveToast = new bootstrap.Toast(document.getElementById("liveToast"));

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

async function Login()
{
    let response = await fetch(`https://amaankazi-expensetracker.onrender.com/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: login.emailId.value,
            password: login.inputPassword.value
        })
    });
    let responseData = await response.json();

    if (responseData.status == "SUCCESSFUL")
    {
        userInfo = {
            email: login.emailId.value,
            userName: responseData.userName,
            password: login.inputPassword.value
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        toast("Login", "Successful", `You have succesfully logged in as<br><span style = "color: #3987fd;">${responseData.userName} [${login.emailId.value}]</span><br>Redirecting in 3 seconds`);
        setTimeout(() => {
            window.location.href = "./expenses.html";
        }, 3000);
    }
    else if (responseData.status == "SERVER ERROR")
    {
        toast("Login", "ERROR", "SERVER ERROR");
    }
    else
    {
        toast("Login", "ERROR", responseData.error);
    }
}