Hotel Reservation System

Design a system to search, book, and manage hotel rooms.
Add room categorization (e.g., Standard, Deluxe, Suite).
Allow users to make and cancel reservations.
Implement payment simulation and booking details view.
Use OOP + database/File I/O for storing bookings and availability.

🧩 Overview
This project was developed as part of the CodeAlpha Java Development Internship, focusing on web-based hotel management using Java Servlets, JSP, and database integration. The system enables users to browse available rooms, make reservations, simulate payments, and manage bookings efficiently through a dynamic web interface.

📌 Features
Room Search and Categorization: Browse rooms by type (Standard, Deluxe, Suite).

Booking System: Reserve rooms with customer details and stay duration.

Cancellation Functionality: Cancel existing reservations from the management page.

Payment Simulation: Mimics payment confirmation for each booking.

Booking Details View: Displays reservation summaries and customer information.

Database Integration: Stores room availability and booking records using JDBC.

🛠️ Tech Stack & Concepts
Language: Java (JDK 8+)

Framework: Servlets + JSP

Database: MySQL

Concepts: OOP, JDBC, File I/O, MVC architecture

Tools: Apache Tomcat, IntelliJ IDEA

📁 Project Structure
Code
HotelReservationSystem/
├── src/
│   ├── model/
│   │   ├── Room.java
│   │   ├── Reservation.java
│   │   └── Customer.java
│   ├── servlet/
│   │   ├── BookingServlet.java
│   │   ├── CancelServlet.java
│   │   └── DatabaseConnection.java
└── web/
    ├── Home.jsp
    ├── Booking.jsp
    ├── Manage.jsp
    └── Confirmation.jsp
🚀 Getting Started
Install JDK 8 or higher and Apache Tomcat.

Set up a MySQL database with tables for rooms and reservations.

Deploy the project on Tomcat and access it via browser.

🎥 Demo
Placeholder for a future demo link or screenshots.

📄 License & Credits
Developed by Hannah Bella Atay during the CodeAlpha Java Development Internship.
Designed to demonstrate Java web development, OOP, and database integration.
