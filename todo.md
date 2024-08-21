# Tasks

- [x] Add the initial models
- [x] Add the initial auth module
  - [ ] Confirm user email
  - [ ] Save user sessions
- [x] Add modules courses, units & lessons
- [x] Add OpenApi setup
- [x] Add OpenApi initial details for auth endpoints
- [x] Add OpenApi requests & bodies for courses, units & lessons
- [x] Add lessons-contents module and its initial api
- [x] Add OpenApi schemas for lessons-contents
- [x] Add Forums to the db
- [x] Add OpenApi details for lessons-contents
- [x] Add media module
- [x] Add FileValidationInterceptor that validates and writes the files to the local disk
- [x] Add OpenApi to the media controller
- [x] Add Role based authentication
- [x] Add util method `useTransaction` & logger to `PrismaService`
- [x] Add module courses-enrollments
- [x] Add OpenApi to courses-enrollments
- [x] Add quizzes module
- [x] Add OpenApi to quizzes module
- [x] Add questions module
- [x] Add OpenApi to questions module

- [ ] Improve the authorization for the quizzes module

  - [ ] Refine role-based permissions for quizzes.
  - [ ] Implement specific access controls for quiz creation and editing.
  - [ ] Test and validate authorization rules for quizzes.

- [ ] Improve the authorization for the quiz-questions module

  - [ ] Secure quiz-question endpoints with appropriate roles.
  - [ ] Test and validate authorization rules for quiz questions.

- [ ] Add email module

  - [ ] Create the email module structure.
  - [ ] Set up email configuration (e.g., SMTP settings).
  - [ ] Implement a service method to send emails.
  - [ ] Add methods to handle email templates.
  - [ ] Test email sending functionality.

- [ ] Add websockets

  - [ ] Set up WebSocket gateway in NestJS.
  - [ ] Implement real-time messaging for quizzes or lessons.
  - [ ] Test WebSocket connections and event handling.

- [x] Add quiz-submissions module
- [x] Add OpenApi to quiz-submissions module

- [ ] Improve the authorization for quiz-submissions

  - [ ] Secure quiz-submission endpoints with appropriate roles.
  - [ ] Test and validate authorization rules for quiz submissions.

- [ ] Add functionality to evaluate quiz-submissions

  - [ ] Implement logic to evaluate quiz submissions.
  - [ ] Add score calculation based on correct answers.
  - [ ] Test quiz evaluation functionality.

- [ ] Improve the media upload functionality

  - [x] Support basic upload for `"PROFILE_PICTURE" | "PROFILE_BANNER" | "COURSE_BANNER" | "COURSE_MATERIAL" | "UNIT_BANNER" | "UNIT_MATERIAL" | "LESSON_BANNER" | "LESSON_MATERIAL"`
  - [x] Automate updating the refrence to the media on media upload complete
  - [ ] Improve authorizaion for adding the media files

- [ ] Send the material
  - [ ] Send the material of the courses
  - [ ] Send the material of the units
  - [ ] Send the material of the lessons

- [x] Track updating `grades`

  - [x] Update grades for the lessons based on the quizzes
  - [x] Update grades for the units based on the quizzes/lessons
  - [x] Update grades for the courses based on the quizzes/lessons/units

- [ ] Track updating `grades` for the progress of the students

  - [ ] Update the submissions `grades` based on the answers grades
  - [ ] Update the enrollment `grades` based on the submissions

# New Tasks

- [ ] Add notifications module

  - [ ] Create the notifications module structure.
  - [ ] Implement service methods to send notifications (e.g., email, in-app).
  - [ ] Add support for different notification types (e.g., quiz reminders, course updates).
  - [ ] Test notification delivery and handling.

- [ ] Add user profiles

  - [x] Create user profile model and module.
  - [x] Implement user profile editing (e.g., bio, profile picture).
  - [ ] Validate the url of the media files uploaded
  - [x] Add OpenApi for user profile endpoints.
  - [ ] Test user profile features.

- [ ] Add discussion forums

  - [ ] Create forums module for discussions related to courses.
  - [ ] Implement endpoints for creating and managing forum threads.
  - [ ] Add real-time updates using WebSockets for forum discussions.
  - [ ] Add OpenApi for forums endpoints.
  - [ ] Test forum functionality.

- [ ] Add course progress tracking

  - [ ] Implement course progress tracking for users.
  - [ ] Display progress in the user dashboard.
  - [ ] Add OpenApi for progress tracking.
  - [ ] Test progress tracking and ensure it works correctly across modules.

- [ ] Add admin dashboard

  - [ ] Implement an admin dashboard for managing courses, users, and content.
  - [ ] Add statistics and reports on user activity and course performance.
  - [ ] Secure the admin dashboard with proper authorization.
  - [ ] Test admin functionality.

- [ ] Add payment integration

  - [ ] Set up payment processing (e.g., Stripe, PayPal) for course enrollments.
  - [ ] Implement service methods to handle transactions.
  - [ ] Add OpenApi for payment-related endpoints.
  - [ ] Test payment integration and ensure secure handling of transactions.

- [ ] Add analytics module

  - [ ] Implement analytics tracking for user engagement and course performance.
  - [ ] Add dashboards to visualize data for both admins and users.
  - [ ] Test analytics tracking and reporting.

- [ ] Add localization support

  - [ ] Implement multi-language support for the platform.
  - [ ] Add language selection options for users.
  - [ ] Test localization across the platform to ensure translations are accurate.

- [ ] Add content recommendations

  - [ ] Implement a recommendation system to suggest courses and content to users based on their activity.
  - [ ] Add endpoints for fetching personalized recommendations.
  - [ ] Test recommendation system for accuracy and relevance.

- [ ] Add mobile app integration
  - [ ] Create an API module for mobile app support.
  - [ ] Ensure all features are accessible and optimized for mobile usage.
  - [ ] Test API responses and performance for mobile app integration.
