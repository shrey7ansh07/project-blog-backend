## BLOGEZZY - Full Stack Dynamic Blogging Platform

## Description

This backend project is designed to manage a blogging platform BLOGEZZY. It includes the following functionalities:

- **User Authentication**: Manages user registration, login, and ensures secure access. This is achieved using bcryptjs for password hashing and jsonwebtoken for generating authentication tokens.

- **Profile Management**: Allows users to update their profile information and change their password. This includes uploading and updating profile images.

- **Blog Authorization**: Controls access and permissions related to blog posts. This includes creating, reading, updating, and deleting blog posts. Users can also read blogs posted by other users.

- **Follow Authorization**: Manages the functionality of following and unfollowing users. This allows users to keep track of their favorite bloggers.

_The project is structured with schemas, custom middlewares, utility classes and controllers._

## Tech Stack and Libraries

This project uses the following technologies and libraries:

- **Node.js**: The backend is built with Node.js, a JavaScript runtime built on Chrome's V8 JavaScript engine. The entire backend
  works on Node.js.

- **Express.js**: Used to create the server and manage routes. Express is a minimal and flexible Node.js web application framework.

- **MongoDB**: This project uses MongoDB for database management. MongoDB is a cross-platform document-oriented database program that is source-available. The project incorporates various MongoDB operators and functions within the controllers. Separate collections are maintained for users, blogs, and follow documents. MongoDB's _aggregate pipelines_ are utilized to retrieve interconnected data efficiently.

- **Mongoose**: An **Object Data Modeling (ODM)** library for MongoDB and Node.js. It manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.

- **Cloudinary**: Used for image upload and storage. Cloudinary is a cloud-based service that provides an end-to-end image and video management solution.

- **Multer**: Multer is a middleware used for handling **`multipart/form-data`**, which is primarily used for uploading files. In the context of image uploading, Multer accesses the request, extracts any file present, and prepares it for upload to Cloudinary. Additionally, Multer assists in temporarily storing files on the server during the upload process, providing a backup mechanism for user files.

- **bcryptjs**: Used for hashing and comparing passwords for user authentication.

- **jsonwebtoken**: This library is used for generating JSON Web Tokens (JWTs) for user authentication. It facilitates the creation of both _refresh and access tokens_, and aids in the encoding and decoding of these tokens for ongoing authentication processes.

_This project uses several external packages to enhance functionality and improve development. These include:_

- **cookie-parser**: This middleware parses cookies attached to the client request object. It's instrumental in preventing the storage of cookies in local storage and ensures that the request always carries the necessary cookies.

- **cors**: This library is used to enable **CORS (Cross-Origin Resource Sharing)** with various options. It helps manage CORS errors that occur when a request is made from a different origin. By using cors, not all origins or URLs are authorized to make requests. Only those that are _whitelisted or proxied are allowed_. In this project, I've utilized proxying on the frontend to manage requests.

- **dotenv**: This library is used to load environment variables from a `.env` file. It's particularly useful when a process is running on the server and needs to manage important credentials securely.

- **nodemon** (devDependency): Used in development to automatically restart the server when file changes are detected.

## SuccessApiResponse and ErrorExtended classes

This project utilizes the SuccessApiResponse and ErrorExtended classes to structure responses and handle errors effectively:

- **SuccessApiResponse Class**: This class is used to structure successful API responses consistently. It ensures that all successful responses follow the same format, making it easier for clients to handle the data.

- **ErrorExtended Class**: This class extends the native JavaScript Error class and is used to handle errors throughout the application. It provides a consistent structure for error messages and can be extended to handle different types of errors as needed.

_These classes improve the maintainability of the code and provide a consistent experience for the API users._

## Asynchronous Handlers

This project makes use of asynchronous handlers to manage API requests and middleware. These handlers allow the application to perform non-blocking operations, improving the overall performance and user experience.

- **Async API Requests**: Asynchronous handlers are used to manage API requests. This allows the server to handle multiple requests concurrently, without blocking the execution of subsequent code while waiting for a response.

- **Async Middleware**: Asynchronous middleware functions are used to handle tasks such as authentication, error handling, and data validation. These functions are executed before the request handler and can perform operations asynchronously, improving the efficiency of the application.

_These asynchronous handlers are crucial for maintaining a responsive and efficient server._

Please note: This project is not currently open for contributions.

## License

This project is licensed under the MIT License.

## Contact

For any questions or discussions about the project, please contact me at <shreyguptaji007@gmail.com>.
