const htmlBody = document.getElementById("htmlBody");
const DarkThemeIcon = document.getElementById("DarkThemeIcon");
const LightThemeIcon = document.getElementById("LightThemeIcon");

var queryString = window.location.search;
console.log(queryString); 

function ToggleTheme()
{
    let theme = htmlBody.getAttribute("data-bs-theme");

    if (theme == "light")
    {
        LightThemeIcon.style.display = "none";
        DarkThemeIcon.style.display = "inline-block";
        htmlBody.setAttribute("data-bs-theme", "dark");
    }
    else
    {
        LightThemeIcon.style.display = "inline-block";
        DarkThemeIcon.style.display = "none";
        htmlBody.setAttribute("data-bs-theme", "light");
    }
}

