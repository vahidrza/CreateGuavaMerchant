const callProcedureBtn = document.getElementById("callProcedureBtn");

//Adding function for Submit button Click event
callProcedureBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const user = document.getElementById("userName").value;
  const password = document.getElementById("password").value;
  const connectString = document.getElementById("db-select").value;
  let elements = document.getElementsByClassName("formItem");

  let requestBody = {
    dbConfig: { user: user, password: password, connectString: "" },
    data: [],
  };

  //Inserting form Data to Request Body
  for (let index = 0; index < 7; index++) {
    requestBody.data[index] = elements[index].value;
  }

  //Inserting DB data to Request Body
  requestBody.dbConfig.connectString = (() => {
    if (connectString === "test") return "10.10.90.41:1521/SVDB";
    else if (connectString === "pre") return "10.10.34.143:1521/EPG";
    else if (connectString === "prod") return "10.10.50.72:1521/EPG";
  })();

  //Sending Request to Backend
  fetch("/call-procedure", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ requestBody }),
  })
    .then((response) => response.text())
    .then((result) => {
      alert(result);
      
      //Cleaning Inputs' values
      if (result === "Procedure successfully called.")
        [0, 1, 2, 3, 5, 6].forEach((index) => {
          elements[index].value = "";
        });
    })
    .catch((error) => {
      alert("Error occured during calling Procedure.");
    });
});
