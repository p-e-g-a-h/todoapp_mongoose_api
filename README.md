# Todo App mongoose API

### Installation

1. Clone repository:
    ```
    git clone https://github.com/p-e-g-a-h/todoapp_mongoose_api.git
    ```
2. Navigate to project directory:
    ```
    cd todoapp_mongoose_api
    ```
3. Install dependencies:
    ```
    npm install
    ```
4. Configure your MongoDB connection by updating the server/config/config.js file.

5. Start server:
    ```
    npm run dev
    ```

### API Routes

#### Create Todo
* URL: `/api/todos`
* Method: `POST`
* Request Body:
  ```
  {
    "text": "Your todo text here"
  }
  ```
* Response:
  ```
  {
    "_id": "todoId",
    "text": "Your todo text here",
    "completed": false,
    "completedAt": null
  }
  ```
#### Get All Todos
* URL: `/api/todos`
* Method: `GET`
* Response:
  ```
  [
    {
      "_id": "todoId",
      "text": "Todo 1",
      "completed": false,
      "completedAt": null
    },
    {
      "_id": "todoId",
      "text": "Todo 2",
      "completed": false,
      "completedAt": null
    },
    // ...
  ]
  ```
#### Get, Update, or Delete Todo by ID
* URL: `/api/todos/:id`
* Method: `GET`, `PATCH`, `DELETE`
* Request Body (PATCH):
  ```
  {
    "text": "update todo text",
    "completed": true,
  }
  ```
* Response (PATCH):
  ```
  {
    // old todo
    "_id": "todoId",
    "text": "Todo text",
    "completed": false,
    "completedAt": null
  }
  ```
* Response (GET/DELETE):
  ```
  {
    "_id": "todoId",
    "text": "Todo text",
    "completed": false,
    "completedAt": null
  }
  ```


