# AlterEgo Chain

A contemplative application where users interact with AI-generated clones of themselves to explore identity, introspection, and alternative timelines.

## Features

### 🎭 Identity Seed Creation
- Users describe themselves in 2-4 sentences
- This serves as the foundation for generating their virtual clone
- Clean, distraction-free interface focused on self-reflection

### 💬 Conversational Interface
- Chat-like experience with AI-generated clones
- Reflective and introspective dialogue
- Multiple timeline versions of the user's identity

### 🌌 Timeline Branching
- **Future Self**: Explore potential futures and aspirations
- **Parallel Universe**: Discover alternative life paths and choices
- **Past Self**: Connect with younger versions and share wisdom

### 🎨 Emotional Design
- Dark, warm color scheme for contemplative atmosphere
- Clean typography and smooth animations
- Responsive design for all devices

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd alterego-chain
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Create Your Clone**: Write a brief self-description (2-4 sentences) about who you are at this moment
2. **Start a Conversation**: Your clone will respond with an initial message based on your description
3. **Explore Timelines**: Use the branching buttons to create alternative versions of yourself
4. **Switch Between Clones**: Navigate between different timeline versions using the clone tabs

## Technology Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **CSS3** - Custom styling with gradients and animations
- **Inter Font** - Clean, readable typography

## Project Structure

```
src/
├── components/
│   ├── IdentitySeed.jsx      # Initial seed input component
│   ├── ChatWindow.jsx        # Chat interface component
│   └── BranchingButtons.jsx  # Timeline navigation component
├── App.jsx                   # Main application component
├── App.css                   # Application styles
└── main.jsx                  # Application entry point
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Key Features

- **State Management**: Uses React hooks for local state management
- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: Semantic HTML and keyboard navigation
- **Performance**: Optimized rendering and smooth animations

## Future Enhancements

- Integration with AI APIs for more sophisticated clone responses
- Blockchain integration for decentralized identity management
- Advanced timeline visualization
- User authentication and conversation history
- Export conversations and insights

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by concepts of digital identity and self-reflection
- Built with modern web technologies for optimal user experience
- Designed for contemplative and introspective interactions
