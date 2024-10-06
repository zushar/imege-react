# Image React Project - README

## Overview
This project is a full-stack web application built using **React**, **Express**, **MySQL**, and **Tailwind CSS**. The purpose of this project is to manage images of people, displaying their personal information and related photos from different years. Users can navigate through the list of people and delete image paths as needed.

## Project Structure
The project is split into two main parts:
- **Server**: Built using **Express** and **MySQL**, responsible for serving the backend API and managing database operations.
- **Client**: Built using **React** with **Tailwind CSS**, responsible for rendering the user interface and handling interactions with the backend.

### Server Details
- The server is located in the `server` folder.
- It is built using **Node.js** and **Express**.
- **MySQL** is used as the database to store people information and image paths.
- **CORS** is enabled to allow requests from the frontend.

The server has two main endpoints:
1. **GET `/api/people`**: Retrieves paginated data of people including their names, birth and death dates, and image paths.
2. **POST `/api/delete-path`**: Deletes a specific image path from the database.

### Client Details
- The client is located in the `client` folder.
- It is built using **React** with **Tailwind CSS** for styling.
- **Axios** is used for making HTTP requests to the backend API.

The client includes:
- A table that displays the list of people along with their details and images.
- Buttons to delete individual images and navigate through pages of data.

## How to Run the Project
### Prerequisites
- **Node.js** and **npm** installed on your system.
- **MySQL** server running and accessible with the correct credentials.

### Step-by-Step Instructions
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd imege-react
   ```
2. **Install Dependencies**:
   - For the server:
     ```bash
     cd server
     npm install
     ```
   - For the client:
     ```bash
     cd ../client
     npm install
     ```
3. **Set Up MySQL Database**:
   - Create a database named `bazach_hebrew`.
   - Update the credentials in `server/server.js` if necessary.
4. **Run the Server and Client**:
   - From the root directory, run:
     ```bash
     npm install concurrently
     npm start
     ```
   This will start both the server (on `http://localhost:5000`) and the client (on `http://localhost:5173`).

## Features
- **View People Data**: Users can view a paginated list of people with details such as their name, birth date, and death date, along with related images.
- **Delete Image Paths**: Users can delete image paths, removing the images from the database.
- **Pagination**: The client-side provides buttons to navigate through pages of data.

## Technologies Used
- **Frontend**: React, Axios, Tailwind CSS
- **Backend**: Express, MySQL, Node.js
- **Database**: MySQL
- **Development Tools**: Vite for fast frontend development, Concurrently to run client and server simultaneously.

## File Structure
```
imege-react/
├── client/            # React frontend
│   ├── src/
│   │   └── App.js     # Main React component
│   ├── public/
│   └── package.json   # Client dependencies
├── server/            # Express server
│   ├── server.js      # Server code
│   └── package.json   # Server dependencies
└── package.json       # Root level scripts and dependencies
```

## Notes
- **Database Configuration**: Ensure that the database credentials in `server/server.js` match your MySQL configuration.
- **API Proxy**: The client uses a proxy setting in `client/package.json` to redirect API requests to the server, avoiding CORS issues.

## Future Improvements
- **Authentication**: Add user authentication to control access to data.
- **Search Functionality**: Allow users to search for specific people by name.
- **Image Uploading**: Allow users to upload new images rather than only deleting existing ones.

## License
This project is open-source and available under the MIT License.