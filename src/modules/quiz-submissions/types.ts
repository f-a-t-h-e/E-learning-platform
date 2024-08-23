export type TQuizSubmissionTokenPayloud = {
  quizId: number;
  studentId: number;
  questions: {
    [k: number]: 0 | 1;
  };
  quizSubmissionId: number;
  increaseAttempts: boolean;
};
