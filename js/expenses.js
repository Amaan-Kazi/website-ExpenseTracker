const htmlBody = document.getElementById("htmlBody");
const DarkThemeIcon = document.getElementById("DarkThemeIcon");
const LightThemeIcon = document.getElementById("LightThemeIcon");

var userInfo = JSON.parse(localStorage.getItem("userInfo"));

if (userInfo != null) {
    let response = await fetch(`https://amaankazi-expensetracker.onrender.com/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: userInfo.email,
            password: userInfo.inputPassword
        })
    });
    let responseData = await response.json();

    if (responseData.status == "SUCCESSFUL")
    {
        userInfo.userName = responseData.userName;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        toast("Login", "Successful", `You have succesfully logged in as<br><span style = "color: #3987fd;">${responseData.userName} [${login.emailId.value}]</span>`);
    }
    else if (responseData.status == "SERVER ERROR")
    {
        toast("Login", "ERROR", "SERVER ERROR");
        window.location.href = "./login.html";
    }
    else
    {
        toast("Login", "ERROR", responseData.error);
        window.location.href = "./login.html";
    }
}
else
{
    window.location.href = "./login.html";
}

function ToggleTheme()
{
    let theme = htmlBody.getAttribute("data-bs-theme");

    if (theme == "light")
    {
        LightThemeIcon.style.display = "none";
        DarkThemeIcon.style.display = "inline-block";
        htmlBody.setAttribute("data-bs-theme", "dark");
        localStorage.setItem("theme", "dark");
    }
    else
    {
        LightThemeIcon.style.display = "inline-block";
        DarkThemeIcon.style.display = "none";
        htmlBody.setAttribute("data-bs-theme", "light");
        localStorage.setItem("theme", "light");
    }
}
