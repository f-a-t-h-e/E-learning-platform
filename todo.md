# Tasks

- [x] Add the initial models
- [x] Add the initial auth module
  - [x] Confirm user email
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

- [x] Improve the authorization for the quizzes module

  - [x] Improve the `create` endpoint

    - [x] Add service method for fetching the needed data for creation validation
    - [x] Add service method to validate the fetched data
    - [x] Test the flow with swagger

  - [x] Improve the `update` endpoint

    - [x] Add service method for fetching the needed data for updating validation
    - [x] Add service method to validate the fetched data
    - [x] Test the flow with swagger

  - [x] Improve getting many quizzes

    - [x] Add filtering
    - [x] Add pagination
    - [x] Authorize accessing data

  - [x] Improve getting one quiz

    - [x] Add filtering
    - [x] Add pagination
    - [x] Authorize accessing data

- [ ] Decrement the grade from connected records (lesson,unit,course) On quiz deletion
- [ ] Improve the authorization for the quiz-questions module

  - [ ] Secure quiz-question endpoints with appropriate roles.
  - [ ] Test and validate authorization rules for quiz questions.

- [x] Add email module

  - [x] Create the email module structure.
  - [x] Set up email configuration (e.g., SMTP settings).
  - [x] Implement a service method to send emails.
  - [x] Add methods to handle email templates.
  - [ ] Test email sending functionality.

- [ ] Add websockets

  - [ ] Set up WebSocket gateway in NestJS.
  - [ ] Implement real-time messaging for quizzes or lessons.
  - [ ] Test WebSocket connections and event handling.

- [x] Add quiz-submissions module
- [x] Add OpenApi to quiz-submissions module

- [ ] Improve the authorization for quiz-submissions

  - [x] Secure quiz-submission endpoints with appropriate roles.
  - [x] Authorize the IDs of the answers for the questions
  - [x] Handle Course submission
  - [ ] Test and validate authorization rules for quiz submissions.

- [x] Add functionality to evaluate quiz-submissions

  - [x] Implement logic to evaluate quiz submissions.
  - [x] Add score calculation based on correct answers.
  - [x] Test quiz evaluation functionality.

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

  - [x] Update the submissions `grades` based on the answers grades
  - [x] Update the courseProgres of the student based on the answers & submissions
  - [ ] Update the enrollment `grades` based on the submissions

- [ ] Improve GET requests for fetching data
  - [ ] Add `TPagination` type
  - [ ] Add function that extracts `TPagination` input into the orm structure
  - [ ] Add filtering
  - [ ] Add columns selection

- [ ] Don't return the results of the transactions (PrismaService.useTransacion) directly (when using it in the services then the controllers don't return the result to the user)

- [x] Implement password reset
 - [x] Reset password using old password
 - [x] Reset password using otp
# New Tasks

- [x] Use microservices
- [x] Create asnalytics microservice
- [x] Task Scheduling for the microservices events

- [ ] Add a repository for the ORM

- [x] Use "queues" for auto-reviewing quizzes

- [ ] Validate the order of the quizQuestions, lessons & units on marking as available

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

- [ ] Add analytics microservice

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
