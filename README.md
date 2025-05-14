# NIIT Student Management System

A web-based application for managing student information, course enrollment, and attendance tracking at NIIT.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript, Bootstrap 5
- **Backend/Database:** Supabase (open-source Firebase alternative)
- **Deployment:** Vercel (1-click deploy)

## Features

### Core Features
- Student Registration (Name, Email, Program, Course, Phone)
- Course Management (Add/view available courses, Assign students to courses)
- Attendance Tracking (Daily student check-in)
- Admin Dashboard (basic view)

### Bonus Features (Optional)
- Quiz upload/download area
- Google login integration
- Email notification on attendance

## Project Setup

### Prerequisites
- Node.js and npm installed
- Supabase account
- Vercel account (for deployment)

### Local Development
1. Clone this repository
2. Open `index.html` in your browser for frontend development
3. Set up Supabase:
   - Create a new Supabase project
   - Copy your Supabase URL and anon key to the `.env` file
   - Run the database setup scripts in the `database` folder

### Deployment
1. Connect your repository to Vercel
2. Configure environment variables for Supabase
3. Deploy with one click

## Project Structure
```
/
├── public/              # Static assets
├── src/
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript files
│   └── index.html       # Main HTML file
├── database/            # Database setup scripts
└── README.md            # Project documentation
```

## License
This project is licensed under the MIT License - see the LICENSE file for details.
