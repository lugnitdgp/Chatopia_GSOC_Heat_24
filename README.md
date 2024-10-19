# 📱 Chatopia - WhatsApp Web Clone

## Project Overview

Chatopia is a full-featured WhatsApp Web clone built using modern and efficient technologies. It offers real-time communication, group interactions, file sharing, and several other features, making it a powerful messaging platform.

This project leverages the following technologies:

- ⚡ **Next.js** – A scalable and efficient frontend framework for delivering fast user experiences.
- 🟢 **Node.js + Express** – A reliable backend stack for handling requests and ensuring smooth server-side operations.
- 🌐 **Socket.io** – Enables real-time WebSocket communication for seamless, instant messaging.

## ✨ Key Features

- 💬 **Seamless Messaging** – Real-time communication powered by WebSocket technology for fast and reliable messaging.
- 📁 **File Sharing** – Share files, images, and media with ease within chats.
- 👥 **Group & Community Creation** – Create and manage group chats or communities for collaborative conversations.
- 🏷️ **User Tagging** – Mention users directly in group conversations to get their attention.
- 🔄 **Message Forwarding** – Forward messages across chats effortlessly.
- 😄 **Emoji/GIF Support** – Express yourself with emojis and GIFs in your messages.
- 🛡️ **Secure Authentication** – OAuth-based login with Google and GitHub for secure user access.
- 🖼️ **Status Updates** – Post and view status updates from other users in the social tab.
- 🎨 **Profile Customization** – Personalize your profile with editable details.
- 🔧 **Privacy Settings** – Take control of your privacy by setting preferences for who can see your data and activities.
- 🔔 **Self-Notifications** – Receive notifications for your own actions.
- 🔉 **Notification Sound** – Get sound alerts when new messages arrive, ensuring you never miss an update.

## Tech Stack

- **Frontend**: Next.js
- **Backend**: Node.js, Express.js
- **Real-Time Communication**: Socket.io
- **Database**: PostgreSQL

## 🛠️ Installation & Setup

Follow these steps to get the project running locally:

1. **Create OAuth Keys**:
    - Set up OAuth secret keys for Google and GitHub.

2. **Set Up PostgreSQL Database**:
    - Ensure a PostgreSQL database is available and configured.

3. **Clone the Repository**:
    ```bash
    git clone <your-repository-url>
    ```

4. **Navigate to the Project Directory**:
    ```bash
    cd ./chatopia
    ```

5. **Install Dependencies**:
    ```bash
    npm install
    ```

6. **Set Environment Variables**:
    - Add an `.env` file in the `/chatopia` directory, following the structure outlined in `.env.example`.

7. **Run the Development Server**:
    ```bash
    npm run server
    ```

## 🚀 Future Enhancements

- **Voice & Video Calls** – Enable voice and video communication for users.
- **Dark Mode** – Add a dark theme option for users who prefer it.
- **Advanced Search** – Improve search functionality for finding messages, files, and users.

## 🤝 Contributing

Contributions are welcome! If you have suggestions or ideas, feel free to fork the repository, open an issue, or submit a pull request.

### 🤝How to make Contribution

We welcome contributions from developers of all skill levels! Whether you're fixing a bug, adding new features, or improving documentation, your help is appreciated. 

To contribute:

1. ⭐ Star the repository to show your support.
2. 📝 Create an issue outlining how you'd like to contribute to the project.
3. 🍴 Fork the repository to make your own copy:
   ```sh
   # Click on the "Fork" button at the top right of the repository page
4. 💻 Implement your changes in the forked repository by creating a new branch for your feature or fix:
   ```
   git checkout -b feature-or-fix-name
   ```
5. Make your changes and commit them using Conventional Commits:
   ```
   git commit -m "feat: describe your changes"
   ```
6. 🔄 Push your branch:
   ```
   git push origin feature-or-fix-name
   ```
7. Open a pull request and describe the changes you made, mentioning the issue number you're addressing.
8. ⏳ Wait for review and feedback from the maintainers.

