# To-Do-API
API RESTful to manage to-do list
# Project Setup and Run Instructions

## Running with npm

1. Install dependencies:
   ```sh
   npm install
   ```
2. Update `.env` file with the following Redis configuration:
   ```env
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```
3. Start the application:
   ```sh
   npm run start
   ```

## Running with Docker

1. Update `.env` file:
   - **Database:** Do not use a local database.
   - **Redis Configuration:**
     ```env
     REDIS_HOST=redis
     REDIS_PORT=6379
     ```
2. Start the application using Docker Compose:
   ```sh
   docker-compose up -d
   ```

## Running Redis in Docker

- **First time setup:** Open Docker Desktop and run the following command in the terminal:
  ```sh
  docker run --name redis-server -d -p 6379:6379 redis
  ```
- **Subsequent runs:** Just open Docker Desktop and run:
  ```sh
  docker start redis-server
  ```

For more details, please contact: **duongngocthaibao@gmail.com**

