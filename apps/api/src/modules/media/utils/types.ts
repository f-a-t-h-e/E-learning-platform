export interface GetPathForQuiz {
  (data: { quizId: number; courseId: number }): string[];
  (data: { quizId: number; courseId: number; unitId: number }): string[];
  (data: {
    quizId: number;
    courseId: number;
    unitId: number;
    lessonId: number;
  }): string[];
}
export interface GetPathForQuizSubmission {
  (data: { userId: number; quizId: number; courseId: number }): string[];
  (data: {
    userId: number;
    quizId: number;
    courseId: number;
    unitId: number;
  }): string[];
  (data: {
    userId: number;
    quizId: number;
    courseId: number;
    unitId: number;
    lessonId: number;
  }): string[];
}
