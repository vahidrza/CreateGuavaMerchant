const callProcedureBtn = document.getElementById("callProcedureBtn");

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

  for (let index = 0; index < 7; index++) {
    requestBody.data[index] = elements[index].value;
  }

  requestBody.dbConfig.connectString = (() => {
    if (connectString === "test") return "10.10.90.41:1521/SVDB";
    else if (connectString === "pre") return "10.10.34.143:1521/EPG";
    else if (connectString === "prod") return "10.10.50.72:1521/EPG";
  })();
  console.log(requestBody);

  fetch("/call-procedure", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ requestBody }),
  })
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      alert(result);
    })
    .catch((error) => {
      console.error(error);
      alert("Error occured during calling Procedure.");
    });
});
