const AccountDetails = document.getElementById("AccountDetails")
const TableDetails = document.getElementById("TableDetails")
const TransactionDetails = document.getElementById("TransactionDetails")

AccountDetails.addEventListener("submit", function (event) {event.preventDefault()})
TableDetails.addEventListener("submit", function (event) {event.preventDefault()})
TransactionDetails.addEventListener("submit", function (event) {event.preventDefault()})

var email
var password

async function GetStatus()
{
    let response = await fetch("https://expensetracker-amaankazi.onrender.com/status")
    let responseData = await response.json()
    console.log(responseData)
}

async function SubmitAccountDetails()
{
    email = AccountDetails.Email.value
    password = AccountDetails.Password.value
}

async function Register()
{}

async function Login()
{}

async function GetTables()
{
    let response = await fetch(`https://expensetracker-amaankazi.onrender.com/${email}/get-tables`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: password
        })
    })
    let responseData = await response.json()
    console.log(responseData)
}

async function CreateTable()
{
    let response = await fetch(`https://expensetracker-amaankazi.onrender.com/${email}/create-table`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: password,
            tableName: TableDetails.TableName.value
        })
    })
    let responseData = await response.json()
    console.log(responseData)
}

async function DeleteTable()
{
    let response = await fetch(`https://expensetracker-amaankazi.onrender.com/${email}/delete-table`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: password,
            tableName: TableDetails.TableName.value
        })
    })
    let responseData = await response.json()
    console.log(responseData)
}

async function GetTransactions()
{}

async function CreateTransaction()
{
    let response = await fetch(`https://expensetracker-amaankazi.onrender.com/${email}/create-transaction`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: password,
            tableName: TransactionDetails.TableName.value,
            //transactionName: TransactionDetails.TransactionName.value,
            //transactionAmount: TransactionDetails.TransactionAmount.value
        })
    })
}

async function DeleteTransaction()
{}

/*
TableDetails.addEventListener("submit", function (event)
{
    event.preventDefault()

    email = TableDetails.email.value
    tableName = TableDetails.tableName.value

    console.log(email + "_" + tableName)
})

SQLDetails.addEventListener("submit", async function (event)
{
    event.preventDefault()
    data = SQLDetails.Data.value
    
    let response = await fetch("https://expensetracker-amaankazi.onrender.com/amaankazi1793@gmail.com/create-table", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: "test123",
            tableName: data
        })
    })
    let responseData = await response.json()
    console.log(responseData)
})

async function Retrieve()
{
    let response = await fetch("https://expensetracker-amaankazi.onrender.com/status")
    let responseData = await response.json()
    console.log(responseData)
    /*
    let response = await fetch("https://expensetracker-amaankazi.onrender.com/amaankazi1793@gmail.com", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: "test123", task: "exampleTask" })
    })
    let responseData = await response.json()
    console.log(responseData)
    */
/*
}
*/
