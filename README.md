# E-Learning Platform

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Microservices](#microservices)
  - [Analytics Microservice](#analytics-microservice)
  - [Notifications Microservice](#notifications-microservice)
- [Tasks](#tasks)
- [Contributing](#contributing)
- [License](#license)

## Overview

Welcome to the **E-Learning Platform**, a comprehensive solution for online education. Built with scalability and performance in mind, this platform allows users to register, create and enroll in courses, manage course content, participate in quizzes, and much more. The system leverages modern technologies and best practices to deliver a seamless learning experience.

## Features

- **User Authentication & Authorization**

  - Register and login
  - Email verification
  - Password reset
  - Role-based access control

- **Course Management**

  - Create, edit, delete courses
  - Manage units and lessons within courses
  - Enroll students in courses

- **Content Management**

  - Upload and manage media files
  - Create and manage lesson contents

- **Quizzes & Assessments**

  - Create and manage quizzes and quiz questions
  - Submit and evaluate quiz submissions

- **Real-time Features**

  - WebSockets for real-time updates
  - Notifications system

- **Analytics**

  - Track user engagement and course performance
  - Dashboards for admins and users

- **Additional Functionalities**
  - Discussion forums
  - Course progress tracking
  - Admin dashboard
  - Payment integration
  - Localization support
  - Content recommendations
  - Mobile app integration

## Tech Stack

- **Backend Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** Prisma, Drizzle ORM
- **Authentication:** JWT, Passport
- **API Documentation:** Swagger (OpenAPI)
- **Queue Management:** BullMQ
- **Email Services:** Nodemailer
- **Real-time Communication:** WebSockets
- **Other Tools:** Redis, EJS, Helmet, etc.

## Architecture

The platform is built with a modular architecture, leveraging NestJS's powerful module system. It includes two microservices:

1. **Analytics Microservice:** Handles tracking and reporting of user engagement and course performance.
2. **Notifications Microservice:** Manages the delivery of various notifications to users, including emails and in-app messages.

## Getting Started

### Prerequisites

- **Node.js:** v18.x or higher
- **npm:** v8.x or higher
- **PostgreSQL:** v12.x or higher
- **Redis:** v6.x or higher

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/f-a-t-h-e/e-learning-platform.git
cd e-learning-platform
```

2. **Install dependencies:**

   ```bash
   npm i
   ```

3. **Set up the database:**

   Ensure PostgreSQL is running and create a database for the application.

4. **Run Prisma migrations:**

   ```bash
   npx prisma migrate dev --name init
   ```

### Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/e_learning


# JWT
JWT_ACCESS_SECRET='your_jwt_secret'
JWT_ACCESS_LIFE='1h'
JWT_REFRESH_SECRET='your_jwt_refresh_secret'
JWT_REFRESH_LIFE='5d'

# Email
SMTP_SERVICE="Example"
SMTP_TLS="yes"
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
SMTP_DEFAULT_SENDER=your_email@example.com
SMTP_ADMIN_EMAIL=your_email@example.com
# For dev only
MAILDEV_INCOMING_USER=
MAILDEV_INCOMING_PASS=

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Other configurations
PORT=3000
NODE_ENV = 'development' or 'production'
```

### Running the Application

Start the development server:

```bash
npm run start:dev
```

The application will be available at `http://localhost:3000` (or with the port that you used in the .env file).

## API Documentation

Comprehensive API documentation is available via Swagger. Once the application is running, navigate to:

```
http://localhost:3000/api
```
And for json version
```
http://localhost:3000/api-json
```

### Available Endpoints

#### Auth

- **POST** `/auth/register` - Register a new user
- **POST** `/auth/login` - Login
- **GET** `/auth/whoami` - Get your user data
- **POST** `/auth/verify-email` - Verify email address
- **POST** `/auth/forgot-password` - Request password reset link
- **POST** `/auth/forgot-password-reset` - Reset password

#### Courses

- **POST** `/courses` - Create a new course
- **GET** `/courses` - Get courses
- **GET** `/courses/{id}` - Get one course
- **PATCH** `/courses/{id}` - Edit one course
- **DELETE** `/courses/{id}` - Delete one course
- **GET** `/courses/{id}/edit` - Get one course (for the student)
- **PATCH** `/courses/{id}/mark-available` - Mark course as available or calculate it

#### Units

- **POST** `/units` - Create a new unit
- **GET** `/units` - Get units
- **GET** `/units/{id}` - Get one unit
- **PATCH** `/units/{id}` - Edit one unit
- **DELETE** `/units/{id}` - Delete one unit
- **PATCH** `/units/{id}/mark-available` - Mark unit as available or calculate it

#### Lessons

- **POST** `/lessons` - Create a new lesson
- **GET** `/lessons` - Get lessons
- **GET** `/lessons/{id}` - Get one lesson
- **PATCH** `/lessons/{id}` - Edit one lesson
- **DELETE** `/lessons/{id}` - Delete one lesson
- **PATCH** `/lessons/{id}/mark-available` - Mark lesson as available or calculate it

#### Quizzes

- **POST** `/quizzes` - Create a new quiz
- **GET** `/quizzes` - Get many quizzes
- **GET** `/quizzes/{id}` - Get a quiz by ID
- **PATCH** `/quizzes/{id}` - Update a quiz by ID
- **DELETE** `/quizzes/{id}` - Delete a quiz by ID
- **PATCH** `/quizzes/{id}/mark-available` - Mark quiz as available or calculate it

#### Courses Enrollments

- **POST** `/courses-enrollments` - Enroll in a course (Requested by student)
- **GET** `/courses-enrollments` - Find all students in a course
- **PATCH** `/courses-enrollments` - Alter students' enrollments in a course you are a teacher in
- **POST** `/courses-enrollments/many` - Enroll many students in a course

#### Lessons Contents

- **POST** `/lessons-contents` - Create a new lesson' content
- **GET** `/lessons-contents/{id}` - Get one content
- **PATCH** `/lessons-contents/{id}` - Edit one content
- **DELETE** `/lessons-contents/{id}` - Delete one content

#### Quiz Questions

- **GET** `/quiz-questions/{id}` - Get a quiz question by ID

#### Quiz Submissions

- **POST** `/quiz-submissions` - Create a new quiz submission
- **GET** `/quiz-submissions` - Retrieve all quiz submissions
- **PUT** `/quiz-submissions/{id}` - Submit the quiz submission that you have
- **GET** `/quiz-submissions/{id}` - Retrieve a specific quiz submission by ID

#### Media

- **POST** `/media` - Prepare the upload for your file
- **POST** `/media/upload/{purpose}/{id}` - Upload a file for a course
- **GET** `/media/track-upload/{purpose}/{id}` - Get the media details to know your next step
- **PATCH** `/media/complete` - Mark the upload for your file as completed

#### User Profile

- **GET** `/user-profile/{userId}` - Get user profile
- **PUT** `/user-profile/{userId}` - Update user profile

For detailed information on request parameters, request bodies, and responses, refer to the [Swagger Documentation](http://localhost:3000/api).

## Microservices

### Analytics Microservice

The Analytics microservice handles tracking and reporting of user engagement and course performance. It includes features such as:

- **Quiz Submissions Auto Review:** Automatically review quiz submissions both in real-time and in bulk.
- **Analytics Tracking:** Monitor user interactions, course completion rates, and other key metrics.
- **Dashboards:** Provide visual representations of data for administrators and users.

**Current Status:**

- [x] Quiz submissions auto review (in time and bulk review)
- [ ] Implement analytics tracking for user engagement and course performance
- [ ] Add dashboards to visualize data for both admins and users
- [ ] Notify the users about the reviews completion
- [ ] Test analytics tracking and reporting

### Notifications Microservice

The Notifications microservice manages the delivery of various notifications to users, including emails and in-app messages. It supports different types of notifications such as quiz reminders and course updates.

**Current Status:**

- [x] Implement service methods to send notifications (e.g., email, in-app)
- [ ] Create the notifications module structure
- [ ] Add support for different notification types (e.g., quiz reminders, course updates)
- [ ] Test notification delivery and handling

## Tasks

### Completed Tasks

#### Initial Setup and Modules

- Added initial models and authentication module with email confirmation.
- Integrated modules: courses, units, lessons.
- Configured OpenAPI with initial details for auth, courses, units, lessons, and media controllers.
- Implemented role-based authentication and utility methods in `PrismaService`.
- Added email module with configuration and template handling.
- Implemented quiz submission evaluation and password reset functionality.
- Enhanced authorization for quizzes and quiz submissions.
- Improved media upload functionality with support for various media types.
- Tracked updating grades across lessons, units, and courses.
- Implemented queues for auto-reviewing quizzes.
- Improved media module to allow updating media files for different purposes.

### Ongoing and Pending Tasks

#### Initial Setup and Modules

- Save user sessions
- Test email sending functionality
- Validate the order of quiz questions, lessons, & units on marking as available

#### Authorization & Validation

- Improve authorization for quiz-questions module
- Improve authorization for quiz-submissions
- Improve authorization for adding media files

#### Additional Functionalities

- Decrement grades from connected records on quiz deletion
- Track updating grades for student progress
- Enhance GET requests with pagination, filtering, and column selection
- Refactor controllers to avoid returning transaction results directly

#### WebSockets & Microservices

- Set up WebSocket gateway in NestJS
- Implement real-time messaging for quizzes or lessons
- Complete Analytics and Notifications microservices

#### New Features & Enhancements

- Add repository for the ORM
- Implement sending materials for courses, units, and lessons
- Finalize user profile features and validation
- Develop discussion forums with real-time updates
- Implement course progress tracking and admin dashboard
- Integrate payment processing (e.g., Stripe, PayPal)
- Add localization support and content recommendations
- Integrate with mobile applications

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the repository**
2. **Create a new branch**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit your changes**

   ```bash
   git commit -m "Add your message"
   ```

4. **Push to the branch**

   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a Pull Request**

Ensure your code adheres to the project's coding standards and includes appropriate tests.

## License
