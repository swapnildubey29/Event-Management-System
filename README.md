<div align="center">
  <h1>Event Management System Backend</h1>
</div>

---

## Overview

This project serves as an Event Management System backend developed as an assignment for GyanGrove. It enables users to find events based on latitude, longitude, and date values, with support for pagination. The data is parsed from a CSV file into MongoDB, and event details are displayed in JSON format.

## Tech Stack and Database

### Backend
- **Node.js**: Utilized for its non-blocking, event-driven architecture.
- **Express.js**: Empowered with its simplicity for routing and handling HTTP requests.
- **MongoDB**: Leveraged for its flexibility and scalability, integrated with Node.js using Mongoose.

### Frontend
- **HTML, CSS, JavaScript**: Standard web technologies for user interface and interactivity.
- **Fetch API**: Employed for asynchronous HTTP requests from the client-side to the backend.

## Design Decisions

### Backend API Design
- **RESTful Principles**: Followed to provide a clear and predictable interface for interaction.

### Pagination
- Implemented to efficiently handle large datasets, improving performance and user experience.

## Database Schema

### Event Schema
- Designed to store event-related information such as event name, city, date, time, latitude, and longitude, facilitating efficient querying.

## Challenges and Solutions

- **Handling Asynchronous Operations**: Utilized async/await syntax for synchronous-like handling. Promises and error handling techniques employed for effective task management.
- **Data Pagination**: Implemented pagination using skip() and limit() methods in MongoDB queries to retrieve specific subsets of data.

## Setting Up and Running the Project

### Prerequisites
- Node.js installed on your machine
- MongoDB installed and running locally

### Getting Started
1. Clone the repository: `git clone https://github.com/swapnildubey29/Event-Management-System`
2. Navigate to the project directory.
3. Install dependencies: `npm install`
4. Start the server: `npm run dev`
5. Open your web browser and visit `localhost:8000` to view the results.


---

<div align="center">
  Made with by [Swapnil Dubey]

</div>

</div>
