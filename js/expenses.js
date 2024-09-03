const date = new Date();

const htmlBody = document.getElementById("htmlBody");
const DarkThemeIcon = document.getElementById("DarkThemeIcon");
const LightThemeIcon = document.getElementById("LightThemeIcon");

const sheetsView = document.getElementById("SheetsView");
const transactionsView = document.getElementById("TransactionsView");
const spinner = document.getElementById("spinner");

const selectedYear = document.getElementById("Year");
const selectedMonth = document.getElementById("Month");

var newSheetModal = new bootstrap.Modal(document.getElementById("NewSheetModal"));
var newTransactionModal = new bootstrap.Modal(document.getElementById("NewTransactionModal"));
var liveToast = new bootstrap.Toast(document.getElementById("liveToast"));

var userInfo = JSON.parse(localStorage.getItem("userInfo"));
var currentView = "Sheets";
var currentSheet;
var sheets = [];
var url = [];

// TODO //
// Decide between history.replaceState and history.pushState
// Create transaction endpoint
// Make the back/home button have a use by going back to sheets from transactions, and home from sheets
// onclick of any sheet, load its transactions
// use data tables library for transactions

// Utility //
function toast(header, detail, body)
{
    document.getElementById("ToastHeader").textContent = header;
    document.getElementById("ToastBody").innerHTML = body;
    document.getElementById("ToastDetail").textContent = detail;
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

function New()
{
    if (document.getElementById("NewButton").getAttribute("data-new") == "Transaction")
    {
        newTransactionModal.show();
    }
    else
    {
        newSheetModal.show();
    }
}

async function Back()
{
    if (currentView == "Transactions")
    {
        currentView = "Sheets";
        transactionsView.hidden = true;
        sheetsView.hidden = false;
        document.getElementById("NewButton").setAttribute("data-new", "Sheet");
        window.history.pushState({"Title": "Expense Tracker Sheets"}, "", `https://expensetracker.rweb.site/expenses`);

        // await GetSheets();
    }
    else
    {
        window.location.href = "./index.html";
    }
}

async function SelectSheet(selectedSheet)
{
    currentSheet = selectedSheet;
    currentView = "Transactions";

    document.getElementById("MonthYear").hidden = false;
    document.getElementById("NewButton").setAttribute("data-new", "Transaction");

    sheetsView.hidden = true;
    transactionsView.hidden = false;

    window.history.pushState({"Title": "Expense Tracker Transactions"}, "", `https://expensetracker.rweb.site/expenses?${currentSheet}/${selectedYear.options[selectedYear.selectedIndex].text}/${selectedMonth.options[selectedMonth.selectedIndex].text}`);
    await GetTransactions();
}


// Account //
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

    return "Completed";
}

function LogOut()
{
    localStorage.removeItem("userInfo");
    window.location.href = "./login.html";
}


// Tables //
async function GetSheets()
{
    loading(true);

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
        let membersList = "<ul>";

        for (let j = 0; j < responseData.response[i].sheetusers.length; j++)
        {
            membersList += `<li>${responseData.response[i].sheetusers[j]}</li>`;
        }
        membersList += "</ul>";

        sheetsView.innerHTML += `
            <div class="card" style="width: 30rem;" data-id = "${responseData.response[i].sheetid}" onclick = "SelectSheet('${responseData.response[i].sheetid}')">
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

    return "Completed";
}

async function NewSheet()
{
    let response = await fetch(`https://amaankazi-expensetracker.onrender.com/${userInfo.email}/create-table`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: userInfo.password,
            tableName: document.getElementById("newSheetName").value
        })
    });
    let responseData = await response.json();
    newSheetModal.hide();

    if (responseData.status == "SUCCESSFUL")
    {
        toast("Expenses", "SUCCESSFUL", "Created new table");
    }
    else if (responseData.status == "ERROR")
    {
        toast("Expenses", "ERROR", responseData.error);
    }
    else
    {
        toast("Expenses", "SERVER ERROR", "SERVER ERROR");
    }

    GetSheets();
}

async function DeleteSheet(sheetId)
{
    console.log("Deleting sheet id: " + sheetId);
}


// Transactions //
async function GetTransactions()
{
    loading(true);
    // get from server
    // display in data tables

    console.log("Year: " + selectedYear.options[selectedYear.selectedIndex].text);
    console.log("Month: " + selectedMonth.options[selectedMonth.selectedIndex].text);

    loading(false);
}

async function NewTransaction()
{
    console.log("Creating new transaction");
}


async function load()
{
    await Authenticate();
    await GetSheets();

    url = window.location.search.slice(1).split("/");

    if ((url[0] != null) && (url[0] != "") && (sheets.includes(url[0])))
    {
        currentView = "Transactions";
        currentSheet = url[0];

        document.getElementById("MonthYear").hidden = false;
        document.getElementById("NewButton").setAttribute("data-new", "Transaction");

        transactionsView.hidden = false;

        if ((url[1] != null) && (url[1] != ""))
        {
            let urlYear = parseInt(url[1]) % 2020;
            if (isNaN(urlYear) == false)
            {
                if (urlYear > 9)
                {
                    urlYear = 9;
                }
                selectedYear.value = urlYear;
            }
            else
            {
                let yearIndex = date.getFullYear() % 2020; // due to the way year options are currently indexed
                if (yearIndex > 9)
                {
                    yearIndex = 9;
                }

                selectedYear.value = yearIndex;
            }

            if ((url[2] != null) && (url[2] != ""))
            {
                function monthToIndex(month)
                {
                    switch (month.toLowerCase()) {
                        case "january":
                            return 0;
                        case "february":
                            return 1;
                        case "march":
                            return 2;
                        case "april":
                            return 3;
                        case "may":
                            return 4;
                        case "june":
                            return 5;
                        case "july":
                            return 6;
                        case "august":
                            return 7;
                        case "september":
                            return 8;
                        case "october":
                            return 9;
                        case "november":
                            return 10;
                        case "december":
                            return 11;
                        default:
                            return date.getMonth();
                    }
                }

                selectedMonth.value = monthToIndex(url[2]);
            }
            else
            {
                selectedMonth.value = date.getMonth();
            }
        }
        else
        {
            let yearIndex = date.getFullYear() % 2020; // due to the way year options are currently indexed
            if (yearIndex > 9)
            {
                yearIndex = 9;
            }

            selectedYear.value = yearIndex;
            selectedMonth.value = date.getMonth();
        }

        window.history.pushState({"Title": "Expense Tracker Transactions"}, "", `https://expensetracker.rweb.site/expenses?${url[0]}/${selectedYear.options[selectedYear.selectedIndex].text}/${selectedMonth.options[selectedMonth.selectedIndex].text}`);
        await GetTransactions();
    }
    else
    {
        currentView = "Sheets";
        sheetsView.hidden = false;

        let yearIndex = date.getFullYear() % 2020; // due to the way year options are currently indexed
        if (yearIndex > 9) 
        {
            yearIndex = 9;
        }

        selectedYear.value = yearIndex;
        selectedMonth.value = date.getMonth();
        document.getElementById("NewButton").setAttribute("data-new", "Sheet");
        window.history.pushState({"Title": "Expense Tracker Sheets"}, "", `https://expensetracker.rweb.site/expenses`);
    }
}

console.log(date);
load();

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

    window.history.pushState({"Title": "Expense Tracker Transactions"}, "", `https://expensetracker.rweb.site/expenses?${url[0]}/${selectedYear.options[selectedYear.selectedIndex].text}/${selectedMonth.options[selectedMonth.selectedIndex].text}`);
    GetTransactions();
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
