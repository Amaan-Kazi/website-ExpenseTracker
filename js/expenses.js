const date = new Date();

const htmlBody = document.getElementById("htmlBody");
const DarkThemeIcon = document.getElementById("DarkThemeIcon");
const LightThemeIcon = document.getElementById("LightThemeIcon");

var liveToast = new bootstrap.Toast(document.getElementById("liveToast"));

const toastHeader = document.getElementById("ToastHeader");
const toastBody = document.getElementById("ToastBody");
const toastDetail = document.getElementById("ToastDetail");

const sheetsView = document.getElementById("SheetsView");
const transactionsView = document.getElementById("TransactionsView");
const spinner = document.getElementById("spinner");

var userInfo = JSON.parse(localStorage.getItem("userInfo"));

const selectedYear = document.getElementById("Year");
const selectedMonth = document.getElementById("Month");

var sheets = [];
var url = [];

function toast(header, detail, body)
{
    toastHeader.textContent = header;
    toastBody.innerHTML = body;
    toastDetail.textContent = detail;
    liveToast.show();
}

function loading(isLoading)
{
    if (isLoading)
    {
        spinner.style.display = "inline-block";
    }
    else
    {
        spinner.style.display = "none";
    }
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

    return "Function Ran";
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

    loading(false);

    sheetsView.innerHTML = "";
    for (let i = 0; i < responseData.response.length; i++)
    {
        sheets[i] = responseData.response[i].sheetid;
        console.log(sheets[i]);
        console.log(responseData.response[i].sheetid);
        let membersList = "<ul>";

        for (let j = 0; j < responseData.response[i].sheetusers.length; j++)
        {
            membersList += `<li>${responseData.response[i].sheetusers[j]}</li>`;
        }
        membersList += "</ul>";

        sheetsView.innerHTML += `
            <div class="card" style="width: 30rem;" data-id = "${responseData.response[i].sheetid}">
                <div class="card-body">
                    <h5 class="card-title text-info fs-1">${responseData.response[i].sheetname}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">${responseData.response[i].sheetid}</h6>
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
                            <li><button class="dropdown-item text-danger" onclick="DeleteSheet('${responseData.response[i].sheetid}')">Delete</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    if (responseData.response.length == 0)
    {
        sheetsView.innerHTML += `
            <div class="" style="width: 350px; height: 10%; position: absolute; top: 0px; left: 0px; bottom: 0px; right: 0px; margin: auto; z-index: 0;" role="status">
                <h3>You do not have any sheets<br>Start by creating new<br>Or join others</h3>
            </div>
        `;
    }

    return "Function Ran";
}

function LogOut()
{
    localStorage.removeItem("userInfo");
    window.location.href = "./login.html";
}

async function New()
{
    let response = await fetch(`https://amaankazi-expensetracker.onrender.com/${userInfo.email}/create-table`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: userInfo.password,
            tableName: "test"
        })
    });
    let responseData = await response.json();
    console.log(responseData);
    getTables();
}

async function DeleteSheet(sheetId)
{
    console.log("Deleting sheet id: " + sheetId);
}

async function GetTransactions()
{
    console.log("Year: " + selectedYear.options[selectedYear.selectedIndex].text);
    console.log("Month: " + selectedMonth.options[selectedMonth.selectedIndex].text);
}

await Authenticate();
await getTables();

url = window.location.search.slice(1).split("/");
console.log(url);

if ((url[0] != null) && (url[0] != ""))
{
    if (sheets.includes(url[0]))
    {
        console.log("Sheet found");
        // get transactions for that sheet
        // show transactions view, hide sheets view
        transactionsView.hidden = false;
    }
    else
    {
        console.log("Sheet not found");
        sheetsView.hidden = false;
    }
}
else
{
    console.log("Sheet not provided");
    sheetsView.hidden = false;
}

console.log(date);

selectedYear.value = date.getFullYear() % 2020; // due to the way year options are currently indexed
selectedMonth.value = date.getMonth();

function ChangeYM(change)
{
    let currentYear = selectedYear.selectedIndex;
    let currentMonth = selectedMonth.selectedIndex + change;

    if (currentMonth >= 12)
    {
        currentMonth = 0;
        currentYear++;
    }
    else if (currentMonth <= -1)
    {
        currentMonth = 11;
        currentYear--;
    }

    if (currentYear >= 10)
    {
        currentYear = 0;
    }
    else if (currentYear <= -1)
    {
        currentYear = 9;
    }

    selectedMonth.value = currentMonth;
    selectedYear.value = currentYear;
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
