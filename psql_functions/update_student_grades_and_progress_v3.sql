CREATE OR REPLACE FUNCTION update_student_grades_and_progress(quiz_id INT)
RETURNS VOID AS $$
DECLARE
    total_grade INT;
    previous_grade INT;
    grade_difference INT;
BEGIN
    -- Update QuizAnswer grades and total grade in QuizSubmission in a single query
    WITH graded_answers AS (
        SELECT 
            qa."quizAnswerId",
            CASE 
                WHEN qq."correctAnswer" = CAST(qa."chosenOptionId" AS TEXT) 
                THEN qq."fullGrade"
                ELSE COALESCE((
                    SELECT qo.grade
                    FROM "QuizQuestionOption" qo
                    WHERE qo."quizeQuestionOptionId" = qa."chosenOptionId"
                      AND qo."questionId" = qq."quizQuestionId"
                ), 0)
            END AS grade,
            qa."submissionId"
        FROM "QuizAnswer" qa
        JOIN "QuizQuestion" qq ON qa."questionId" = qq."quizQuestionId"
        WHERE qq."quizId" = quiz_id
    ),
    updated_submissions AS (
        UPDATE "QuizAnswer" qa
        SET grade = graded_answers.grade
        FROM graded_answers
        WHERE qa."quizAnswerId" = graded_answers."quizAnswerId"
        RETURNING qa."submissionId", graded_answers.grade
    ),
    final_grades AS (
        SELECT 
            us."submissionId",
            SUM(us.grade) AS total_grade,
            COALESCE(qs.grade, 0) AS previous_grade
        FROM updated_submissions us
        LEFT JOIN "QuizSubmission" qs ON us."submissionId" = qs."quizSubmissionId"
        GROUP BY us."submissionId", qs.grade
    )
    UPDATE "QuizSubmission" qs
    SET grade = fg.total_grade
    FROM final_grades fg
    WHERE qs."quizSubmissionId" = fg."submissionId";
    
    -- Update CourseProgress based on the difference
    UPDATE "CourseProgress" cp
    SET progress = cp.progress + fg.total_grade - fg.previous_grade
    FROM final_grades fg
    WHERE cp."courseId" = (
        SELECT "courseId"
        FROM "QuizSubmission"
        WHERE "quizSubmissionId" = fg."submissionId"
    )
    AND cp."studentId" = (
        SELECT "studentId"
        FROM "QuizSubmission"
        WHERE "quizSubmissionId" = fg."submissionId"
    );
END;
$$ LANGUAGE plpgsql;
