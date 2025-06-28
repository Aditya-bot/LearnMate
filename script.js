let pdfText = "";

document.getElementById("pdf-upload").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file || file.type !== "application/pdf") {
    document.getElementById("status").innerText = "Please upload a valid PDF file.";
    return;
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdfjsLib = window['pdfjs-dist/build/pdf'];
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

  try {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + "\n";
    }
    pdfText = text;
    document.getElementById("status").innerHTML = "PDF loaded. Ready to generate quiz.";
  } catch (err) {
    console.error("PDF Parsing Error:", err);
    document.getElementById("status").innerText = "Failed to read PDF.";
  }
});

async function generateQuiz() {
  if (!pdfText.trim()) {
    alert("Please upload a PDF first.");
    return;
  }

  const prompt = `
Generate exactly 10 multiple-choice questions based on the following text. Each question should have four answer options (A, B, C, D) and clearly mention the correct answer at the end of each question using this exact format:

Q: Your question?
A) Option A
B) Option B
C) Option C
D) Option D
Answer: X

TEXT:
${pdfText.slice(0, 2500)}
`.trim();

  document.getElementById("quiz-output").innerHTML = "Generating quiz...";
  document.getElementById("submit-quiz").style.display = "none";

  try {
    const res = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "Could not generate quiz.";
    renderQuiz(reply);
  } catch (err) {
    console.error("API Error:", err);
    document.getElementById("quiz-output").innerText = "Failed to generate quiz.";
  }
}

function renderQuiz(text) {
  const lines = text.trim().split("\n");
  const container = document.getElementById("quiz-output");
  container.innerHTML = "";
  let currentQuestion = null;
  let answerKey = "";
  let questionIndex = 0;

  lines.forEach((line) => {
    if (line.startsWith("Q")) {
      if (currentQuestion) container.appendChild(currentQuestion);
      currentQuestion = document.createElement("div");
      currentQuestion.className = "question-block";
      questionIndex++;

      const qText = document.createElement("p");
      qText.innerHTML = `<strong>${line}</strong>`;
      currentQuestion.appendChild(qText);
    } else if (line.match(/^[A-D]\)/)) {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `question-${questionIndex}`;
      input.value = line[0];
      label.appendChild(input);
      label.innerHTML += " " + line.slice(3);
      currentQuestion.appendChild(label);
    } else if (line.startsWith("Answer:")) {
      answerKey = line.split("Answer:")[1].trim();
      const result = document.createElement("div");
      result.className = "result";
      result.style.display = "none";
      result.dataset.correct = answerKey;
      currentQuestion.appendChild(result);
    }
  });

  if (currentQuestion) container.appendChild(currentQuestion);

  const submitBtn = document.getElementById("submit-quiz");
  submitBtn.style.display = "block";

  submitBtn.onclick = () => {
    const questions = document.querySelectorAll(".question-block");
    let total = questions.length;
    let correct = 0;

    questions.forEach(q => {
      const selected = q.querySelector("input[type='radio']:checked");
      const result = q.querySelector(".result");
      const correctAns = result.dataset.correct;

      result.style.display = "block";
      result.classList.remove("correct", "incorrect", "unanswered");

      if (!selected) {
        result.classList.add("unanswered");
        result.innerText = "Not answered.";
      } else if (selected.value === correctAns) {
        result.classList.add("correct");
        result.innerText = "Correct!";
        correct++;
      } else {
        result.classList.add("incorrect");
        result.innerText = `Wrong. Correct answer: ${correctAns}`;
      }
    });

    alert(`You scored ${correct} out of ${total}`);
  };
}
