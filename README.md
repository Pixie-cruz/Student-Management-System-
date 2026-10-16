# Student Management System

A simple, modern school administration website built with **HTML, CSS and JavaScript**. It has a blue-and-white design, works on phones and computers, and needs no server or paid service.

## Project description
The Student Management System helps a school office keep track of students, courses, attendance and examination results in one place. It comes with sample data so every page can be tried straight away. All changes are saved in the browser (localStorage).

## Objectives
- Show how a multi-page website can be built with HTML, CSS and JavaScript only.
- Let users add, edit, search and delete student and course records.
- Record daily attendance and examination results with automatic grading.
- Give a clear overview of performance through a dashboard and reports.
- Provide a clean, responsive blue-and-white interface that is easy to use.

## Features
- **Dashboard (index.html):** totals, overall attendance, average mark, recent students, students per course, top results.
- **Student Records (students.html):** add, edit, delete, search and filter by status.
- **Courses (courses.html):** add, search and delete courses; shows enrolled students.
- **Attendance (attendance.html):** pick a date and course, mark Present / Late / Absent, or mark everyone present.
- **Examination Results (results.html):** record marks (0-100) with automatic grades A-F, search and delete.
- **Reports (reports.html):** grade distribution, course averages, attendance per student, download CSV files, print the report.
- Sidebar navigation linking all six pages, with a mobile menu.
- "Reset sample data" button to restore the original records.

## Project structure
```
student-management-system/
├── index.html
├── students.html
├── courses.html
├── attendance.html
├── results.html
├── reports.html
├── style.css
├── script.js
└── README.md
```

## How to run the website
1. Download or clone this repository.
2. Open the folder and double-click **index.html** (it opens in your browser).
3. Use the menu on the left to move between the six pages.

## How to view it online (GitHub Pages)
1. Open the repository on GitHub, then **Settings > Pages**.
2. Under **Branch**, choose **main** and **/ (root)**, then click **Save**.
3. After 1-2 minutes, open `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

## Technologies
HTML5, CSS3 (responsive layout), JavaScript (ES6) and browser localStorage.
