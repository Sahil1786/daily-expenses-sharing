
# Daily Expenses Sharing Application

## Setup Instructions

1. Clone the repository:
   ```sh
   git clone[ <repository-url>](https://github.com/Sahil1786/daily-expenses-sharing/edit/main)
   cd daily-expenses-sharing
## Install dependencies:
       npm install i 
   ## Set up environment variables:
 Create a .env file with the following content:
PORT=3000
MONGODB_URI=mongodb://localhost:27017/daily-expenses

## Run the application:
npm start







## API Endpoints

### User Endpoints
- `POST /users`: Create a new user.
- `GET /users/:id`: Retrieve user details by ID.

### Expense Endpoints
- `POST /expenses`: Add a new expense.
- `GET /expenses/user/:userId`: Retrieve individual user expenses.
- `GET /expenses/overall`: Retrieve overall expenses for all users.
- `GET /expenses/download`: Download the balance sheet as a CSV file.

### Validation
- Ensure valid email formats.
- Non-empty names and valid mobile numbers.
- Ensure percentages add up to 100% in the percentage split method.

## Additional Features
- Authentication and authorization (bonus).
- Error handling.
- Performance optimization.
- Unit and integration tests.
