export type TQuizSubmissionTokenPayloud = {
  quizId: number;
  studentId: number;
  questions: {
    [k: number]: 0 | 1;
  };
  quizSubmissionId: number;
  increaseAttempts: boolean;
};

export type TFindAllSelectType = 'custom' | 'student' | 'instructor';
