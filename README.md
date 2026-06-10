<div align="center">
  <br />
    <img src="https://i.postimg.cc/xnTr6TCb/ResumeAI.png" alt="Project Banner">
  <br />
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=393D72" alt="nextjs" />
    <img src="https://img.shields.io/badge/-MongoDB-black?style=for-the-badge&logoColor=white&logo=mongodb&color=1FAD58" alt="mongodb" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=3FBFF8" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-NextAuth-black?style=for-the-badge&logoColor=white&logo=auth0&color=7C3AFF" alt="nextauth" />
    <img src="https://img.shields.io/badge/-Typescript-black?style=for-the-badge&logoColor=white&logo=typescript&color=387CC8" alt="typescript" />
  </div>

  <h2 align="center">ResumeAI</h2>

  <div align="center">
     <b>ResumeAI</b> is designed to make resume creation effortless. With the help of AI, users can generate, update, and customize their resumes, ensuring they stand out to potential employers. The application is secure, user-friendly, and highly customizable.
  </div>
  <br />
  <a href="https://resume-ai-app.vercel.app/"><strong>➥ Visit ResumeAI App</strong></a>
</div>

## <a name="features">✨ Features</a>

- **AI-Powered Resume Generation:** Generate a professional resume using AI.

- **Multiple Templates:** Choose from a growing collection of professionally designed templates (Classic, Modern, Elegant, Minimal, Sidebar, and more) with preset theme colors or a custom color picker.

- **User Authentication:** Secure login and registration with NextAuth (Google OAuth + email/password), with brute-force rate limiting.

- **Real-Time Preview:** See live updates as you fill out the resume form, plus per-resume template thumbnails on the dashboard.

- **Easy Customization:** Edit sections like experience, education, skills, and more.

- **Save and Share:** Save your resume and share a private link; resumes are private by default with an opt-in public toggle.

- **PDF Export:** Download an ATS-friendly, vector PDF via native print.

- **Responsiveness:** Ensures the application adapts seamlessly to various screen sizes and devices.

## <a name="tech-stack">⚙️ Tech Stack</a>

- **Frontend:** Next.js 14

- **Authentication:** NextAuth (Auth.js v5)

- **AI Integration:** Gemini API

- **Styling:** TailwindCSS

- **Backend:** Node.js

- **Database:** MongoDB

## <a name="quick-start">🚀 Quick Start</a>

Follow these steps to set up the project locally on your machine.

### Prerequisites

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

### Cloning the Repository

```bash
git clone https://github.com/Mahmud0808/ResumeAI.git
cd ResumeAI
```

### Installation

Install the project dependencies using npm:

```bash
npm install
```

### Set Up Environment Variables

Create a new file named `.env.local` in the root of your project and add the following content:

```env
# Generate with: npx auth secret
AUTH_SECRET=

# Google Cloud Console -> Credentials -> OAuth client
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

MONGODB_URL=

GEMINI_API_KEY=

BASE_URL=localhost:3000
```

Replace the placeholder values with your actual credentials. You can obtain these by signing up at [Google Cloud Console](https://console.cloud.google.com/) (OAuth), [MongoDB](https://mongodb.com/) and [Google AI Studio](https://aistudio.google.com/app/apikey). See [docs/AUTH_SETUP.md](docs/AUTH_SETUP.md) for the full auth setup.

### Running the Project

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

### Running Tests

```bash
npm test
```

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

- Fork the repository.
- Create your feature branch (`git checkout -b feature/AmazingFeature`).
- Commit your changes (`git commit -m 'Add some AmazingFeature'`).
- Push to the branch (`git push origin feature/AmazingFeature`).
- Open a pull request.

## 📢 Notice

Authentication has been migrated from Clerk to NextAuth, removing the previous
500-user cap — registrations are no longer limited. You can use the live app, or
fork the repository, set up the environment variables, and run it locally.

## 📬 Contact

Wanna reach out to me? DM me at 👇

Email: mahmudul15-13791@diu.edu.bd
