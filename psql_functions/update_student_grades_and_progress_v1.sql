CREATE OR REPLACE FUNCTION update_student_grades_and_progress(quiz_id INT)
RETURNS VOID AS $$
DECLARE
    submission RECORD;
    total_grade INT;
    previous_grade INT;
    grade_difference INT;

    -- Variables to store quiz question details
    quiz_question RECORD;
    correct_option_id INT;
    option_grade INT;
    
    -- Cursor to iterate over all submissions
    submission_cursor CURSOR FOR
        SELECT * FROM "QuizSubmission" WHERE "quizId" = quiz_id;
    
    -- Temporary table to store quiz question details
    CREATE TEMP TABLE IF NOT EXISTS quiz_question_details AS
    SELECT qq."quizQuestionId", qq."correctAnswer", qo."quizeQuestionOptionId", qo.grade
    FROM "QuizQuestion" qq
    JOIN "QuizQuestionOption" qo ON qq."quizQuestionId" = qo."questionId"
    WHERE qq."quizId" = quiz_id;
BEGIN
    -- Iterate through each submission
    OPEN submission_cursor;
    LOOP
        FETCH submission_cursor INTO submission;
        EXIT WHEN NOT FOUND;
        
        total_grade := 0;
        
        -- Iterate through each answer in the submission
        FOR quiz_question IN 
            SELECT * FROM quiz_question_details qqd
            JOIN "QuizAnswer" qa ON qqd."quizQuestionId" = qa."questionId"
            WHERE qa."submissionId" = submission."quizSubmissionId"
        LOOP
            -- Determine if the student's answer is correct and assign grade
            IF quiz_question."correctAnswer" = CAST(quiz_question."chosenOptionId" AS TEXT) THEN
                option_grade := quiz_question.grade;
            ELSE
                option_grade := 0;
            END IF;
            
            -- Update the grade for the answer
            UPDATE "QuizAnswer"
            SET grade = option_grade
            WHERE "quizAnswerId" = quiz_question."quizAnswerId";
            
            -- Add the option's grade to the total grade for the submission
            total_grade := total_grade + option_grade;
        END LOOP;
        
        -- Get the previous grade
        previous_grade := COALESCE(submission.grade, 0);
        
        -- Update the quiz submission with the new total grade
        UPDATE "QuizSubmission"
        SET grade = total_grade
        WHERE "quizSubmissionId" = submission."quizSubmissionId";
        
        -- Calculate the difference in grades
        grade_difference := total_grade - previous_grade;
        
        -- If there's a difference, update the course progress
        IF grade_difference != 0 THEN
            UPDATE "CourseProgress"
            SET progress = progress + grade_difference
            WHERE "courseId" = submission."courseId"
            AND "studentId" = submission."studentId";
        END IF;
    END LOOP;
    CLOSE submission_cursor;
    
    -- Drop the temporary table
    DROP TABLE IF EXISTS quiz_question_details;
END;
$$ LANGUAGE plpgsql;