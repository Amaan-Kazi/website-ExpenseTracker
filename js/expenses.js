const date = new Date();

const htmlBody = document.getElementById("htmlBody");
const DarkThemeIcon = document.getElementById("DarkThemeIcon");
const LightThemeIcon = document.getElementById("LightThemeIcon");

const sheetsView = document.getElementById("SheetsView");
const transactionsView = document.getElementById("TransactionsView");
const spinner = document.getElementById("spinner");

const selectedYear = document.getElementById("Year");
const selectedMonth = document.getElementById("Month");

const newTransactionForm = document.getElementById("NewTransactionForm");
const updateTransactionForm = document.getElementById("UpdateTransactionForm");

window.addEventListener('popstate', function(event) {
    // The popstate event is fired each time when the current history entry changes.
    window.location.reload();
}, false);

var newSheetModal = new bootstrap.Modal(document.getElementById("NewSheetModal"));
var newTransactionModal = new bootstrap.Modal(document.getElementById("NewTransactionModal"));
var updateTransactionModal = new bootstrap.Modal(document.getElementById("UpdateTransactionModal"));
var transactionDetailsModal = new bootstrap.Modal(document.getElementById("TransactionDetailsModal"));
var liveToast = new bootstrap.Toast(document.getElementById("liveToast"));

let transactionDetailsDate          = document.getElementById("TransactionDetailsDate");
let transactionDetailsTransactionID = document.getElementById("TransactionDetailsTransactionID");
let transactionDetailsTransaction   = document.getElementById("TransactionDetailsTransaction");
let transactionDetailsCategory      = document.getElementById("TransactionDetailsCategory");
let transactionDetailsMode          = document.getElementById("TransactionDetailsMode");
let transactionDetailsDescription   = document.getElementById("TransactionDetailsDescription");
let transactionDetailsAmount        = document.getElementById("TransactionDetailsAmount");
let transactionDetailsComments      = document.getElementById("TransactionDetailsComments");
let transactionDetailsAuthor        = document.getElementById("TransactionDetailsAuthor");
let transactionDetailsTimestamp     = document.getElementById("TransactionDetailsTimestamp");

let updateTransactionButton = document.getElementById("updateTransactionButton");
let deleteTransactionButton = document.getElementById("deleteTransactionButton");

var userInfo = JSON.parse(localStorage.getItem("userInfo"));
var currentView = "Sheets";
var currentSheet;
var sheets = [];
var url = [];

var transactionsDataTable = new DataTable('#TransactionsTable', {
    responsive: {
        details: {
            type: "none"
        }
    },
    rowReorder: true,
    colReorder: true,
    autoWidth: true,
    scrollX: true,

    layout: {
        topStart: {
            buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5']
        },
        bottomStart: {
            info: true,
            pageLength: {
                menu: [10, 25, 50, 100]
            }
        }
    },

    columns: [
        {title: "Transaction ID", responsivePriority: 7, visible: false},
        {title: "Date", responsivePriority: 3},
        {title: "Transaction", responsivePriority: 1},
        {title: "Category", responsivePriority: 4},
        {title: "Description", responsivePriority: 6},
        {title: "Mode", responsivePriority: 5},
        {title: "Amount", responsivePriority: 2},
        {title: "Comments", responsivePriority: 7, visible: false},
        {title: "Timestamp", responsivePriority: 7, visible: false},
        {title: "Author", responsivePriority: 7, visible: false},
    ],

    colReorder: {
        order: [0, 1, 2, 3, 5, 4, 6, 7, 9, 8]
    },
});

$('#TransactionsTable tbody').on('click', 'tr', function () {
    var selectedData = transactionsDataTable.row(this).data();

    transactionDetailsDate.innerText          = selectedData[1];
    transactionDetailsTransactionID.innerText = selectedData[0];
    transactionDetailsTransaction.innerText   = selectedData[2];
    transactionDetailsCategory.innerText      = selectedData[3];
    transactionDetailsMode.innerText          = selectedData[5];
    transactionDetailsDescription.innerText   = selectedData[4];
    transactionDetailsAmount.innerText        = selectedData[6];
    transactionDetailsComments.innerText      = selectedData[7];
    transactionDetailsAuthor.innerText        = selectedData[9];
    transactionDetailsTimestamp.innerText     = selectedData[8];

    updateTransactionButton.setAttribute("data-transactionId", selectedData[0]);
    deleteTransactionButton.setAttribute("data-transactionId", selectedData[0]);
    transactionDetailsModal.show();
});

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
        document.getElementById("MonthYear").hidden = true;
        document.getElementById("NewButton").setAttribute("data-new", "Sheet");
        window.history.pushState({"Title": "Expense Tracker Sheets"}, "", `./expenses.html`);

        // await GetSheets();
        await transactionsDataTable.clear().draw();
        transactionsDataTable.columns.adjust().responsive.recalc();
    }
    else
    {
        window.location.href = "./index.html";
    }
}

function Dashboard(id)
{
    window.location.href = "./dashboard.html?" + id;
}

async function SelectSheet(selectedSheet)
{
    currentSheet = selectedSheet;
    currentView = "Transactions";

    document.getElementById("MonthYear").hidden = false;
    document.getElementById("NewButton").setAttribute("data-new", "Transaction");

    sheetsView.hidden = true;
    transactionsView.hidden = false;

    window.history.pushState({"Title": "Expense Tracker Transactions"}, "", `./expenses.html?${currentSheet}/${selectedYear.options[selectedYear.selectedIndex].text}/${selectedMonth.options[selectedMonth.selectedIndex].text}`);
    await GetTransactions();
    transactionsDataTable.columns.adjust().responsive.recalc();
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
            <div class="card shadow" style="width: 30rem;" data-id = "${responseData.response[i].sheetid}">
                <div class="card-body">
                    <h5 class="card-title text-info fs-1">${responseData.response[i].sheetname}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">${responseData.response[i].sheetid}</h6>
                    <p class="card-text fs-3" style="margin: 0;">
                        Members:
                        ${membersList}
                    </p>
                    <button type="button" class="btn btn-primary mb-3" style="width: 100%;" onclick = "SelectSheet('${responseData.response[i].sheetid}')">Transactions</button>
                    <button type="button" class="btn btn-primary" style="width: 100%;" onclick = "Dashboard('${responseData.response[i].sheetid}')">Dashboard</button>
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

    let response = await fetch(`https://amaankazi-expensetracker.onrender.com/${userInfo.email}/${currentSheet}/get-transactions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: userInfo.password,
            year: selectedYear.options[selectedYear.selectedIndex].text,
            month: parseInt(selectedMonth.options[selectedMonth.selectedIndex].value) + 1
        })
    });
    let responseData = await response.json();

    if (responseData.status == "SUCCESSFUL")
    {
        console.log(responseData);
        transactionsDataTable.clear().draw();

        // Convert objects to arrays
        for (let i = 0; i < responseData.response.length; i++)
        {
            responseData.response[i] = Object.values(responseData.response[i]);
        }

        await transactionsDataTable.rows.add(responseData.response).draw();
        transactionsDataTable.columns.adjust().responsive.recalc();
        loading(false);
    }
    else if (responseData.status == "ERROR")
    {
        toast("Expenses", "ERROR", responseData.error);
    }
    else
    {
        toast("Expenses", "SERVER ERROR", "SERVER ERROR");
    }
}

function UpdateTransaction()
{
    transactionDetailsModal.hide();
    updateTransactionForm.updatedTransactionId.value = updateTransactionButton.getAttribute("data-transactionId");

    let tDate = transactionDetailsDate.innerText.split("-");
    console.log(tDate);
    console.log(transactionDetailsCategory.innerText)

    updateTransactionForm.updatedTransactionDate.value = tDate[2];
    updateTransactionForm.updatedTransactionName.value = transactionDetailsTransaction.innerText;

    for (let i = 0; i < updateTransactionForm.updatedTransactionCategory.options.length; i++) {
        if (updateTransactionForm.updatedTransactionCategory.options[i].text === transactionDetailsCategory.innerText) {
            updateTransactionForm.updatedTransactionCategory.selectedIndex = i;
            break;
        }
    }

    updateTransactionForm.updatedTransactionDescription.value = transactionDetailsDescription.innerText;

    for (let i = 0; i < updateTransactionForm.updatedTransactionMode.options.length; i++) {
        if (updateTransactionForm.updatedTransactionMode.options[i].text === transactionDetailsMode.innerText) {
            updateTransactionForm.updatedTransactionMode.selectedIndex = i;
            break;
        }
    }

    updateTransactionForm.updatedTransactionAmount.value = transactionDetailsAmount.innerText;
    updateTransactionForm.updatedTransactionComment.value = transactionDetailsComments.innerText;

    updateTransactionModal.show();
}

newTransactionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let response = await fetch(`https://amaankazi-expensetracker.onrender.com/${userInfo.email}/${currentSheet}/create-transaction`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password:        userInfo.password,
            transactionDate: `${selectedYear.options[selectedYear.selectedIndex].text}-${parseInt(selectedMonth.options[selectedMonth.selectedIndex].value) + 1}-${newTransactionForm.newTransactionDate.value}`,
            transaction:     newTransactionForm.newTransactionName.value,
            category:        newTransactionForm.newTransactionCategory.options[newTransactionForm.newTransactionCategory.selectedIndex].text,
            description:     newTransactionForm.newTransactionDescription.value,
            paymentMode:     newTransactionForm.newTransactionMode.options[newTransactionForm.newTransactionMode.selectedIndex].text,
            amount:          newTransactionForm.newTransactionAmount.value,
            comments:        newTransactionForm.newTransactionComment.value
        })
    });
    let responseData = await response.json();
    newTransactionModal.hide();

    if (responseData.status == "SUCCESSFUL")
    {
        toast("Expenses", "SUCCESSFUL", "Created Transaction");
    }
    else if (responseData.status == "ERROR")
    {
        toast("Expenses", "ERROR", responseData.error);
    }
    else
    {
        toast("Expenses", "SERVER ERROR", "SERVER ERROR");
    }

    GetTransactions();
});

updateTransactionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let response = await fetch(`https://amaankazi-expensetracker.onrender.com/${userInfo.email}/${currentSheet}/update-transaction`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password:        userInfo.password,
            transactionId:   updateTransactionForm.updatedTransactionId.value,
            transactionDate: `${selectedYear.options[selectedYear.selectedIndex].text}-${parseInt(selectedMonth.options[selectedMonth.selectedIndex].value) + 1}-${updateTransactionForm.updatedTransactionDate.value}`,
            transaction:     updateTransactionForm.updatedTransactionName.value,
            category:        updateTransactionForm.updatedTransactionCategory.options[updateTransactionForm.updatedTransactionCategory.selectedIndex].text,
            description:     updateTransactionForm.updatedTransactionDescription.value,
            paymentMode:     updateTransactionForm.updatedTransactionMode.options[updateTransactionForm.updatedTransactionMode.selectedIndex].text,
            amount:          updateTransactionForm.updatedTransactionAmount.value,
            comments:        updateTransactionForm.updatedTransactionComment.value
        })
    });
    let responseData = await response.json();
    updateTransactionModal.hide();

    if (responseData.status == "SUCCESSFUL")
    {
        toast("Expenses", "SUCCESSFUL", "Updated Transaction");
    }
    else if (responseData.status == "ERROR")
    {
        toast("Expenses", "ERROR", responseData.error);
    }
    else
    {
        toast("Expenses", "SERVER ERROR", "SERVER ERROR");
    }

    GetTransactions();
});

async function DeleteTransaction()
{
    let response = await fetch(`https://amaankazi-expensetracker.onrender.com/${userInfo.email}/${currentSheet}/delete-transaction`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: userInfo.password,
            sheetId: currentSheet,
            transactionId: deleteTransactionButton.getAttribute("data-transactionId")
        })
    });
    let responseData = await response.json();
    transactionDetailsModal.hide();

    if (responseData.status == "SUCCESSFUL")
    {
        toast("Expenses", "SUCCESSFUL", "Deleted Transaction");
    }
    else if (responseData.status == "ERROR")
    {
        toast("Expenses", "ERROR", responseData.error);
    }
    else
    {
        toast("Expenses", "SERVER ERROR", "SERVER ERROR");
    }

    GetTransactions();
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

        window.history.pushState({"Title": "Expense Tracker Transactions"}, "", `./expenses.html?${url[0]}/${selectedYear.options[selectedYear.selectedIndex].text}/${selectedMonth.options[selectedMonth.selectedIndex].text}`);
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
        window.history.pushState({"Title": "Expense Tracker Sheets"}, "", `./expenses.html`);
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

    window.history.pushState({"Title": "Expense Tracker Transactions"}, "", `./expenses.html?${currentSheet}/${selectedYear.options[selectedYear.selectedIndex].text}/${selectedMonth.options[selectedMonth.selectedIndex].text}`);
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
