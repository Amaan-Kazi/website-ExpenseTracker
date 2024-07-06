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

SQLDetails.addEventListener("submit", function (event)
{
    event.preventDefault()

    data = SQLDetails.Data.value
    console.log(data)
})

function Retrieve()
{
    fetch("https://expensetracker-amaankazi.onrender.com:3000/amaankazi1793@gmail.com", {
        method: "POST",
        body: JSON.stringify({ task: "exampleTask" })
    })
}
