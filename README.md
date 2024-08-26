## Description

An E-Learning platform API

## Installation

```bash
$ yarn install
```
or
```bash
$ bun i
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Documentation

### Important columns

#### IDs 

- Each table has its Id as `{table-name}Id`

- Entities that have more than one table for the same entity (e.g user) have the same `Id` name

#### `order`

- This field will need to be sequential through the whole content
- For `Course`
    - For `units` they will have their order sequential with the quizzes that have `unitId = null`
    - For `lessons` they will have their order sequential with the quizzes that have `lessonId = null` but have `unitId != null`
    - For `quizzes` the order will be sequential with the other quizzes in the same level:
        - [ ] @todo add order with other content like paragraphs and/or media.
        - If `lessonId != null` they should be sequential with eachother only.
        - If `lessonId = null` but `unitId != null` they will be ordered with the lessons that are in the same unit.
        - If `unitId = null` they will be ordered with the units that are in the same course.

#### `createdAt`

- This field is for tracking when each row was first inserted

#### `updatedAt`

- This field is for tracking when each row was last updated

#### `endsAt`

- This field means that the row/entity has an expiry/end date
- If this field is absent, it means that the row doesn't have an expiry/end date

## Support

## Stay in touch

- Author - [Fathy Osama](https://ubuntu-svelte.pages.dev/)
- Website - []()
- LinkedIn - [fathy-osama](https://www.linkedin.com/in/fathy-osama/)

<!-- ## License

Nest is [MIT licensed](LICENSE). -->
