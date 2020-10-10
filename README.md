# Jobs

The web application consists of two components(or two pages).
1. View component
2. upload component

## Upload Component

for uploading files(accepts only excel files with extensions .xls, .xlsx, .csv) multer (node package) has been used.
after uploading file to the server. A basic validation has applied. Based on that only valid rows will be saved to database.

the file can be rejected if it has at least one error specified below
  1. upload request does not have a file.
  2. file does not contains required fields

A row can be rejected if it has at least one error specified below
  1. email is not specified.
  2. email is already specified in the above rows.
  3. email is invalid
  4. email is already present in the database.
  5. username is not specified.
  6. address is not specified.
  7. city is not specified.
  8. state is not specified.
  9. country is not specified.
  10. experience is not specified.
  11. salary is not specified.
  12. experience is not number.
  13. salary is not number.

After saving the valid rows to the database, An array with status of each row will be sent as response to the client with short error codes with respect to the errors given above.

## View Component

The applications from the database will be shown in a UI table with pagination of 10 applications per page

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
