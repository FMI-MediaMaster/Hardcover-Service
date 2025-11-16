# Hardcover Service

This is the backend microservice for Hardcover.  
The service runs on port <code>8104</code> by default.

## 🌐 Endpoints

| Method | Endpoint                         | Description                                           |
| ------ | -------------------------------- | ----------------------------------------------------- |
| GET    | /options?name=\<NAME\>           | Get a list of book options matching the given name    |
| GET    | /info?id=\<ID\>                  | Get detailed information about a book by ID           |

