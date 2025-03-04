# Ai Chat Assistent

## Features

- **Google OAuth Authentication** : Users can log in using their Google account.
- **Guest User Mode** : Users can use the application without logging in.
- **Chat History Management** : Users can view and manage their chat history.
- **AI Model Selection** : Users can select different AI models for generating responses.
- **ChatGPT Integration** : The application uses the ChatGPT API to generate responses based on user input.

## React + Vite

### Installation

1. **Create a new Vite project**:

   Open your terminal and run the following command to create a new Vite project:

   ```bash
   npm create vite@latest
   ```

2. **Navigate to the project directory**:
   ```
   cd your-project-name
   ```
3. **Install dependencies**:

### Running the Application

1. **Start the development server**:

   ```
   npm run dev
   ```

   - This will start the Vite development server. Open your browser and navigate to http://localhost:5173 to see your application running.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Installation

### Prerequisites

- Ensure you have [Node.js](https://nodejs.org/) installed on your machine. You can download it from [here](https://nodejs.org/).

### Steps

1. **Initialize a new Node.js project**

   Open your terminal and run the following command to create a new Node.js project:

   ```bash
   npm init -y
   ```

- This will create a package.json file in your project directory.

2. Install Express.js

   - Run the following command to install Express.js:

   ```
   npm install express
   ```

3. Create a basic Express server

   - Create a new file named server.js and add the following code to set up a basic Express server:

```
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
res.send('Hello World!');
});

app.listen(port, () => {
console.log(`Server is running at http://localhost:${port}`);
});
```
