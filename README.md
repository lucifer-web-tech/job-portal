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

## How to Run

run `ng build --watch` to build the front modules and then run `nodemon server` or `node server` to run the backend.
now open the browser and go to `http://localhost:4000` to view.
The project uses local MongoDB driver for database transactions.
