# Chat App with Rooms

This is a simple real-time chat application built with Node.js, Express, Socket.io, and JWT-based authentication. The app allows users to register, log in, and join rooms where they can send messages in real-time.

## Features

- User authentication using JWT (JSON Web Token).
- Real-time chat with Socket.io.
- Users can join rooms and send messages.
- User messages are displayed on the right side (own messages) and on the left side (others' messages).

## Installation

1. Clone this repository to your local machine:

    ```bash
    git clone https://github.com/your-username/chat-app.git
    cd chat-app
    ```

2. Install the necessary dependencies:

    ```bash
    npm install
    ```

3. Start the server:

    ```bash
    npm start
    ```

4. The app will be running at `http://localhost:3000`.

## Usage

1. **Register**: Click the "Register" button, enter a username and password, and submit.
2. **Login**: After registration, log in with the username and password you created.
3. **Join a Room**: Enter the room name in the "Room" input field and click "Join Room."
4. **Send Messages**: Type your message in the input field and click "Send" to broadcast it to the room.
5. **Message Display**: Your messages will appear on the right, and others' messages will appear on the left.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to fork the repository, submit issues, and open pull requests if you would like to contribute to the project.

## Acknowledgements

- Socket.io for real-time web socket communication.
- Express.js for the backend API.
- JWT (JSON Web Tokens) for user authentication.

