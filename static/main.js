async function changeText() {
  const serverUrl = "http://127.0.0.1:3000/api";
  let text = document.getElementById("txt_input").value;
  if (text.length > 0) {
    console.log(text);
    //const faqs = openai.readFAQ("/static/faq.txt");
    //console.log(faqs);
    let resultArea = document.getElementById("txtarea_resp");
    resultArea.append("你:\n" + text + "\n");
    document.getElementById("txt_input").value = "";

    fetch(serverUrl + "/getResponseVector", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: text
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data["answer"]);
        var answer = String(data["answer"]).replace("A: ", "");
        resultArea.append("客戶服務助理:\n", answer + "\n");
        resultArea.scrollTop = resultArea.scrollHeight;
    })
      .catch((error) => {
        alert("Error: " + error);
      });
  }
}

function regEvent() {
  var input = document.getElementById("txt_input");

  // Execute a function when the user presses a key on the keyboard
  input.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("btn_input").click();
      //input.value = "";
    }
  });
}
