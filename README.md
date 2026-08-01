# Gym Management System

A comprehensive gym management system for tracking members, subscriptions, visits, and staff administration.

## Features

- **Member Management**: Add, edit, and delete gym members with detailed profiles
- **Membership Plans**: Create and manage subscription plans with flexible pricing options
- **Single Purchase Tracking**: Handle daily/single session purchases with configurable pricing
- **Visit Tracking**: Monitor member attendance and visit history
- **Staff Management**: Admin panel for managing gym staff and their roles
- **Authentication**: Secure login system with JWT-based authentication
- **Dashboard**: Overview of daily statistics and member activity

## Tech Stack

### Frontend
- React
- Vite
- Axios
- React Router
- Lucide Icons

### Backend
- Java Spring Boot
- PostgreSQL Database
- Spring Security
- JWT Authentication
- Hibernate/JPA

## Project Structure

```
gym-management-system/
├── admin-page/          # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service layer
│   │   └── styles/      # CSS stylesheets
│   └── package.json
└── backend/             # Spring Boot backend
    ├── src/
    │   ├── main/
    │   │   ├── java/    # Java source code
    │   │   └── resources/ # Configuration files
    └── pom.xml
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Java (v17 or higher)
- PostgreSQL database
- Maven

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Configure database connection in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/gymdb
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. Run the application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the admin-page directory:
```bash
cd admin-page
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Members
- `GET /api/members` - Get all members
- `GET /api/members/{id}` - Get member by ID
- `POST /api/members` - Create new member
- `PUT /api/members/{id}` - Update member
- `DELETE /api/members/{id}` - Delete member

### Membership Plans
- `GET /api/subscription-plans` - Get all plans
- `POST /api/subscription-plans` - Create plan
- `PUT /api/subscription-plans/{id}` - Update plan
- `DELETE /api/subscription-plans/{id}` - Delete plan

### Visit Tracking
- `GET /api/visit-tracking/member/{memberId}` - Get member visits
- `POST /api/visit-tracking` - Record visit
- `DELETE /api/visit-tracking/{id}` - Delete visit

## Default Configuration

- Default single purchase price: 50,000
- JWT expiration: 24 hours
- Server port: 8080

## License

This project is licensed under the MIT License.
