const callProcedureBtn = document.getElementById("callProcedureBtn");

callProcedureBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let data = [];
  let elements = document.getElementsByClassName("formItem");

  for (let index = 0; index < 7; index++) {
    data[index] = elements[index].value;
  }

  fetch("/call-procedure", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
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
