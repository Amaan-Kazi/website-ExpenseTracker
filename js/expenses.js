const htmlBody = document.getElementById("htmlBody");
const DarkThemeIcon = document.getElementById("DarkThemeIcon");
const LightThemeIcon = document.getElementById("LightThemeIcon");

var liveToast = new bootstrap.Toast(document.getElementById("liveToast"));

const toastHeader = document.getElementById("ToastHeader");
const toastBody = document.getElementById("ToastBody");
const toastDetail = document.getElementById("ToastDetail");

const mainContent = document.getElementById("MainContent");

var userInfo = JSON.parse(localStorage.getItem("userInfo"));

function toast(header, detail, body)
{
    toastHeader.textContent = header;
    toastBody.innerHTML = body;
    toastDetail.textContent = detail;
    liveToast.show();
}

async function Authenticate()
{
    if (userInfo != null)
    {
        let response = await fetch(`https://amaankazi-expensetracker.onrender.com/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: userInfo.email,
                password: userInfo.password
            })
        });
        let responseData = await response.json();

        if (responseData.status == "SUCCESSFUL")
        {
            userInfo.userName = responseData.userName;
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            document.getElementById("AccountDropdown").innerText = responseData.userName;

            toast("Expenses", "Successful Authentication", `Succesfully logged in as<br><span style = "color: #3987fd;">${responseData.userName} [${userInfo.email}]</span>`);
        }
        else
        {
            window.location.href = "./login.html";
        }
    }
    else
    {
        window.location.href = "./login.html";
    }
}

async function getTables()
{
    let response = await fetch(`https://amaankazi-expensetracker.onrender.com/${userInfo.email}/get-tables`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: userInfo.password
        })
    });
    let responseData = await response.json();

    console.log(responseData);

    for (let i = 0; i < responseData.response.length; i++)
    {
        let membersList = "<ul>";

        for (let j = 0; j < responseData.response[i].sheetusers.length; j++)
        {
            membersList += `<li>${responseData.response[i].sheetusers[j]}</li>`;
        }
        membersList += "</ul>";

        mainContent.innerHTML += `
            <div class="card sheets" style="width: 30rem;">
                <div class="card-body">
                    <h5 class="card-title text-info fs-1">${responseData.response[i].sheetname}</h5>
                    <p class="card-text fs-3" style="margin: 0;">
                        Members:
                        ${membersList}
                    </p>
                    <div class="btn-group" style="width: 100%;">
                        <button type="button" class="btn btn-primary" style="width: 90%;">Dashboard</button>
                        <button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                            <span class="visually-hidden">Toggle Dropdown</span>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">Actions</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><button class="dropdown-item text-danger" onclick="DeleteSheet()">Delete</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        `
    }

    // Add message to display when user has no tables
}

function LogOut()
{
    localStorage.removeItem("userInfo");
    window.location.href = "./login.html";
}

function DeleteSheet()
{
    console.log("Deleting Sheet");
}

Authenticate();
getTables();

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
