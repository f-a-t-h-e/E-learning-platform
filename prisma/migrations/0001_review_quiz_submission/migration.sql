-- CREATE OR REPLACE FUNCTION  review_quiz_submission(quiz_submission_id "QuizSubmission"."quizSubmissionId"%TYPE)
CREATE OR REPLACE FUNCTION  review_quiz_submission(quiz_submission_id INT)
RETURNS SMALLINT[] AS $$
DECLARE
    -- submission "QuizSubmission"%ROWTYPE;
    submission RECORD;
    total_grade SMALLINT;
    previous_grade SMALLINT;
    grade_difference SMALLINT;

    -- Array to store quiz question details
    quiz_question_details quiz_question_details_type[];

    -- Record to fetch question details
    quiz_question quiz_question_details_type;

    quiz_answer RECORD;            -- For looping over quiz answers

    -- Variables for grading
    option_grade SMALLINT;
    chosen_option_grade SMALLINT;
BEGIN
	SELECT * INTO submission
	FROM "QuizSubmission"
	WHERE "QuizSubmission"."quizSubmissionId" = quiz_submission_id;

    FOR quiz_question IN
        SELECT qq."quizQuestionId" AS id, qq."correctAnswer" AS correct_answer, qq."fullGrade" AS full_grade, 
               array_agg(qo."quizeQuestionOptionId") AS options, 
               array_agg(qo.grade) AS grades
        FROM "QuizQuestion" qq
        JOIN "QuizQuestionOption" qo ON qq."quizQuestionId" = qo."questionId"
        WHERE qq."quizId" = submission."quizId"
        GROUP BY qq."quizQuestionId", qq."correctAnswer", qq."fullGrade"
    LOOP
        quiz_question_details := array_append(quiz_question_details, quiz_question);
    END LOOP;
	
        total_grade := 0;

        -- Iterate through each answer in the submission
        FOR quiz_answer IN
            SELECT * FROM "QuizAnswer" WHERE "submissionId" = submission."quizSubmissionId"
        LOOP
            -- Find the corresponding quiz question details from the array
            FOR i IN 1..array_length(quiz_question_details, 1) LOOP
                IF quiz_question_details[i].id = quiz_answer."questionId" THEN
                    -- Determine if the student's answer is correct and assign grade
                    IF quiz_question_details[i].correct_answer = CAST(quiz_answer."chosenOptionId" AS TEXT) THEN
                        option_grade := quiz_question_details[i].full_grade;
                    ELSE
                        -- Find the grade of the chosen option if incorrect
                        option_grade := 0;
                        <<find_grade>>
                        FOR j IN 1..array_length(quiz_question_details[i].options, 1) LOOP
                            IF quiz_question_details[i].options[j] = quiz_answer."chosenOptionId" THEN
                                option_grade := quiz_question_details[i].grades[j];
                                EXIT find_grade;
                            END IF;
                        END LOOP;
                    END IF;

                    -- Update the grade for the answer
                    UPDATE "QuizAnswer"
                    SET grade = option_grade
                    WHERE "quizAnswerId" = quiz_answer."quizAnswerId";

                    -- Add the option's grade to the total grade for the submission
                    total_grade := total_grade + option_grade;
                    EXIT;
                END IF;
            END LOOP;
        END LOOP;

        -- Get the previous grade
        previous_grade := COALESCE(submission.grade, 0);

        -- Update the quiz submission with the new total grade
        UPDATE "QuizSubmission"
        SET grade = total_grade, "reviewedAt" = NOW()
        WHERE "quizSubmissionId" = submission."quizSubmissionId";

        -- Calculate the difference in grades
        grade_difference := total_grade - previous_grade;

        -- If there's a difference, update the course progress
        IF grade_difference != 0 THEN
            UPDATE "CourseProgress"
            SET progress = progress + grade_difference
            WHERE "courseId" = submission."courseId"
            AND "studentId" = submission."studentId";
        RETURN ARRAY[1, total_grade];
        END IF;
        RETURN ARRAY[0, total_grade];
END;
$$ LANGUAGE plpgsql;
