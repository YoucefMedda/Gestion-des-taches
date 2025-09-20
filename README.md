# Task Manager

## Description

This project is a web-based Task Manager application that allows users to manage tasks, projects, and users. It features a clean interface with navigation for different sections of the application.

## Features

*   Task Management: Create, view, update, and delete tasks.
*   Project Management: Organize tasks within projects.
*   User Management: Manage user accounts and roles.
*   Responsive Design: Adapts to different screen sizes.
*   Interactive Header: Includes navigation, notifications, and user profile dropdowns.

## Technologies Used

*   Frontend: HTML, CSS, JavaScript
*   Backend: Node.js (implied by `server.js` and `package.json`)
*   Database: SQL (implied by `database.sql` and `gestion_projets.db`)

## Project Setup

To set up this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [repository URL]
    cd task-manager
    ```

2.  **Install dependencies:**
    This project uses Node.js for the backend. Navigate to the project directory in your terminal and run:
    ```bash
    npm install
    ```

3.  **Database Setup:**
    The project uses a SQL database. You may need to set up the database using the provided SQL file or ensure the `gestion_projets.db` file is accessible. The exact steps for database setup might depend on your specific SQL environment.

4.  **Start the server:**
    Once dependencies are installed and the database is set up, start the backend server:
    ```bash
    node server.js
    ```

## Running the Application

After starting the server, you can access the application in your web browser. Typically, it will be available at:
```
http://localhost:3000
```

Open your browser and navigate to the URL above to view and interact with the Task Manager application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue.
