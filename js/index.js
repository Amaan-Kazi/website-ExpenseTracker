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
    console.log(data)
}
