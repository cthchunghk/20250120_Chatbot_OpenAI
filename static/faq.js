const serverUrl = "http://127.0.0.1:3000/api";

let textBoxCount = 0; // To keep track of the number of text boxes
const textBoxes = []; // Array to hold the values of the text boxes

function addFAQTextbox(question, answer) {
  // document.getElementById('add-button').addEventListener('click', function() {
  // Create a new text box
  const newQuestionTextBox = document.createElement("input");
  newQuestionTextBox.type = "text";
  newQuestionTextBox.id = `question-${textBoxCount}`;
  newQuestionTextBox.size = 50;
  newQuestionTextBox.value = question;
  newQuestionTextBox.placeholder = "Your Question Here...";
  document.getElementById("txt_div").appendChild(newQuestionTextBox);
  //newQuestionTextBox.placeholder = `Text Box ${textBoxCount + 1}`;

  const br1 = document.createElement("br");
  br1.id = `br1-${textBoxCount}`;
  document.getElementById("txt_div").appendChild(br1);

  const newAnswerTextBox = document.createElement("textarea");
  newAnswerTextBox.type = "text";
  newAnswerTextBox.id = `answer-${textBoxCount}`;
  newAnswerTextBox.cols = 50;
  newAnswerTextBox.style = "height: 150px;";
  newAnswerTextBox.value = answer;
  newAnswerTextBox.placeholder = "Your Answer Here...";
  // Append the new text box to the form
  document.getElementById("txt_div").appendChild(newAnswerTextBox);

  const br2 = document.createElement("br");
  br2.id = `br2-${textBoxCount}`;
  document.getElementById("txt_div").appendChild(br2);

  const btnRemove = document.createElement("input");
  btnRemove.type = "button";
  btnRemove.value = "Remove";
  btnRemove.id = `btnRemove-${textBoxCount}`;
  btnRemove.setAttribute("onclick", `removeFAQ(${textBoxCount})`);
  document.getElementById("txt_div").appendChild(btnRemove);

  const hr = document.createElement("hr");
  hr.style = "width: 80%";
  hr.id = `hr-${textBoxCount}`;
  document.getElementById("txt_div").appendChild(hr);

  textBoxCount++;
}

function removeFAQ(id) {
  const question = document.getElementById(`question-${id}`);
  const answer = document.getElementById(`answer-${id}`);
  const btnRemove = document.getElementById(`btnRemove-${id}`);
  const hr = document.getElementById(`hr-${id}`);
  const br1 = document.getElementById(`br1-${id}`);
  const br2 = document.getElementById(`br2-${id}`);

  question.hidden = true;
  answer.hidden = true;
  btnRemove.hidden = true;
  hr.hidden = true;
  br1.hidden = true;
  br2.hidden = true;
}

function updateFAQs() {
  textBoxes.length = 0;

  // Get the values from the text boxes and store them in the array
  for (let i = 0; i < textBoxCount; i++) {
    const currentQuestion = document.getElementById(`question-${i}`);
    const currentAnswer = document.getElementById(`answer-${i}`);
    if (
      currentQuestion.value &&
      currentAnswer.value &&
      !currentQuestion.hidden &&
      !currentAnswer.hidden
    ) {
      textBoxes.push({
        question: currentQuestion.value,
        answer: currentAnswer.value,
      });
    }
  }

  // Log to the console for demonstration purposes
  console.log("Submitted Values:", textBoxes);

  fetch(serverUrl + "/updatefaqs", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: textBoxes,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      console.log(response);
      return response.json();
    })
    .then(() =>
      fetch(serverUrl + "/createEmbedding", {
        method: "POST",
      })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          console.log(response);
          return response.json();
        }).then((data) =>{
          console.log(data);
        })
        .catch((error) => {
          alert("Error: " + error);
        })
    )
    .then((data) => {
      alert("Update Successful!");
      location.reload();
    })
    .catch((error) => {
      alert("Error: " + error);
    });
}

async function loadFaqs() {
  fetch(serverUrl + "/getFAQs", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      //console.log(response);
      return response.json();
    })
    .then((data) => {
      // Do it to page.
      for (var i = 0; i < data.length; i++) {
        //console.log(data[i]['question']);
        addFAQTextbox(data[i]["question"], data[i]["answer"]);
      }
    })
    .catch((error) => {
      alert("Error: " + error);
    });
}
