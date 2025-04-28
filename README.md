# Sticky Board

A simple, elegant, and intuitive sticky notes web application built with React and TypeScript. Create, move, and edit virtual sticky notes on a digital board.

![Sticky Board Preview](https://via.placeholder.com/800x400?text=Sticky+Board+Preview)

## Features

- **Draggable Sticky Notes**: Click and drag to position notes anywhere on the board
- **Real-time Editing**: Type directly into notes to update their content
- **Persistent Storage**: All notes are automatically saved to localStorage
- **Dark/Light Mode**: Toggle between themes with a single click
- **Responsive Design**: Works on desktop and mobile devices
- **Intuitive UI**: Simple and clean user interface

## Technologies Used

- React
- TypeScript
- Vite
- PicoCSS
- Bootstrap Icons
- localStorage for data persistence

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/geraldtodd/sticky-board.git
   cd sticky-board
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Usage

- **Add a Note**: Click the + button in the upper left corner
- **Edit a Note**: Click on a note and start typing
- **Move a Note**: Click and drag a note to reposition it
- **Delete a Note**: Click the X in the upper right corner of a note
- **Toggle Theme**: Click the sun/moon icon in the upper right corner

## Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Gerald Todd** - [gtodd.dev](https://gtodd.dev)

## Acknowledgments

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [PicoCSS](https://picocss.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
