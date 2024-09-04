import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

interface ApiGetOptions {
  typeName: 'course' | 'unit' | 'lesson'; // Entity type (e.g., CourseEntity, UnitEntity, LessonEntity)
  idParamName?: string; // Name of the ID parameter (e.g., 'id', 'unitId', 'lessonId')
  description: string; // Custom description for the operation
  summary?: string; // Custom description for the operation
}

export function ApiGetOneForCourse(options: ApiGetOptions) {
  const {
    typeName,
    idParamName = 'id',
    description,
    summary = `Get a specific ${typeName.toLowerCase()}`,
  } = options;

  const arr = [
    ApiQuery({
      name: 'get-lessons-media',
      description: `Include media within lessons in the response.`,
      type: Boolean,
      required: false,
    }),
    ApiQuery({
      name: 'get-lessons-quizzes',
      description: `Include quizzes within lessons in the response.`,
      type: Boolean,
      required: false,
    }),
    // 3
    ApiQuery({
      name: 'get-lessons',
      description: `Include lessons within units in the response.`,
      type: Boolean,
      required: false,
    }),
    ApiQuery({
      name: 'get-units-media',
      description: `Include media within units in the response.`,
      type: Boolean,
      required: false,
    }),
    ApiQuery({
      name: 'get-units-quizzes',
      description: `Include quizzes within units in the response.`,
      type: Boolean,
      required: false,
    }),
    // 3
    ApiQuery({
      name: 'get-units',
      description: `Include units in the response.`,
      type: Boolean,
      required: false,
    }),
    ApiQuery({
      name: 'get-course-media',
      description: `Include course media in the response.`,
      type: Boolean,
      required: false,
    }),
    ApiQuery({
      name: 'get-course-quizzes',
      description: `Include quizzes associated with the course in the response.`,
      type: Boolean,
      required: false,
    }),
  ];
  if (typeName !== 'course') {
    arr.pop();
    arr.pop();
    arr.pop();
  }
  if (typeName !== 'unit') {
    arr.pop();
    arr.pop();
    arr.pop();
  }

  return applyDecorators(
    ApiOperation({
      summary: summary,
      description,
    }),
    ApiParam({
      name: idParamName,
      description: `The ID of the ${typeName.toLowerCase()} to retrieve.`,
      type: Number,
      required: true,
      example: 7,
    }),
    ...arr,
  );
}
