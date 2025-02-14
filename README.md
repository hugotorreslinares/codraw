CoDraw is a real-time collaborative drawing application built with Vue.js and Socket.IO. Multiple users can draw together on the same canvas in real-time.

## Features

- Real-time collaborative drawing
- Multiple brush shapes (Circle, Square, Star, Triangle)
- Adjustable brush size
- Color picker
- Download canvas as PNG
- Responsive design
- Touch screen support
- User name identification

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
bash
git clone <repository-url>
cd codraw

2. Install dependencies for both client and server:

bash
Install client dependencies
npm install
Install server dependencies
cd server
npm install

## Running the Application

1. Start the server:
bash
From the server directory
node server.js

2. In a new terminal, start the client:

bash
From the project root directory
npm run dev

3. Open your browser and navigate to:
http://localhost:5173

## Usage

1. Enter your name when prompted
2. Select a brush shape from the options (Circle, Square, Star, Triangle)
3. Adjust the brush size using the slider
4. Choose a color using the color picker
5. Start drawing on the canvas
6. Use the download button to save your artwork

## Technologies Used

- Vue.js 3
- Socket.IO
- Tailwind CSS
- Express.js
- HTML Canvas API

## Project Structure
codraw/
├── src/
│ ├── components/
│ │ ├── DrawingCanvas.vue
│ │ ├── NavBar.vue
│ │ └── UserNamePrompt.vue
│ ├── App.vue
│ └── main.js
├── server/
│ └── server.js
└── package.json


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details