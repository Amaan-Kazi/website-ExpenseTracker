const TableDetails = document.getElementById("TableDetails")
const SQLDetails = document.getElementById("SQLDetails")

var data

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

    let response = await fetch("https://expensetracker-amaankazi.onrender.com/status")
    console.log(JSON.parse(response.text().PromiseResult))

    data = SQLDetails.Data.value
})

async function Retrieve()
{
    let response = await fetch("https://expensetracker-amaankazi.onrender.com/amaankazi1793@gmail.com", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: "test123", task: "exampleTask" })
    })

    console.log(JSON.parse(response.text()))
}
