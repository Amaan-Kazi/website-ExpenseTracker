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
    console.log(response)

    data = SQLDetails.Data.value
    console.log(data)
})

async function Retrieve()
{
    let response = await fetch("https://expensetracker-amaankazi.onrender.com/amaankazi1793", {
        method: "POST",
        body: JSON.stringify({ task: "exampleTask" })
    })

    console.logo(response)
}
