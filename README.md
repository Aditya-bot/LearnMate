# LearnMate – AI-Powered Personalized Quiz Generator

LearnMate is a web-based application that utilizes large language models (LLMs) to convert academic PDFs into structured multiple-choice quizzes. The platform is designed to promote active learning by enabling users to assess their comprehension in real time with automated feedback.

## Features

- Upload and parse academic PDFs
- Automatically generate 10 multiple-choice questions using AI
- Interactive quiz interface with selectable answer options
- Real-time feedback indicating correct and incorrect responses
- Score summary displayed upon quiz submission
- Clean, responsive user interface with a focus on readability

## Use Case

LearnMate serves as an intelligent self-assessment tool for:

- Students revising course material
- Educators generating quizzes from lecture notes
- Self-learners validating topic understanding
- Education platforms integrating interactive content

## Technology Stack

| Component     | Technology                          |
|---------------|-------------------------------------|
| Frontend      | HTML, CSS, JavaScript               |
| AI Model      | Groq API (LLaMA 3 - 8B)             |
| PDF Parsing   | Mozilla pdf.js                      |
| Deployment    | Vercel                              |

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/learnmate-app.git
   cd learnmate-app
