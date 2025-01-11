# HR-SYSTEM-FRONTEND

## Overview

A React-based frontend for an HR System, developed using TypeScript. It allows HR personnel to manage employee data, track attendance.

## Features

### Authentication
- Secure login for HR employees
- JWT token management
### Employee Management
- View employee list
- Add new employees
- Edit employee details
- Remove employees

### Attendance Tracking
- Mark attendance for employees
- View attendance by different periods (day/week/month/year)
- Export attendance data to Excel

## Project Structure

```
src/
├── components/       
│   ├── Header.tsx
│   ├── Layout.tsx
│   └── Sidebar.tsx
├── context/          
│   └── AuthContext.tsx
├── lib/             
│   └── axios.ts
├── pages/           
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Employees.tsx
│   └── Attendance.tsx
└── types/         
    └── index.ts
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```
