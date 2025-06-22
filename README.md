# Flip Dots Lottie Creator

**Retro Display. Modern Motion.**

A powerful web-based animation tool that lets you create stunning flip dot display animations and export them as industry-standard Lottie JSON files. Perfect for designers, developers, and anyone who loves the nostalgic charm of retro displays combined with modern animation capabilities.

## ✨ Features

### 🎨 **Visual Animation Editor**
- Interactive grid-based editor with customizable dimensions (4x4 to 10x10)
- Click-to-toggle dot states with real-time visual feedback
- Responsive design that works seamlessly on desktop and mobile devices

### 🎬 **Animation Controls**
- **Play/Pause**: Preview your animations in real-time
- **Frame Navigation**: Step through frames with previous/next controls
- **Frame Management**: Add, delete, clear, and reorder frames
- **Timeline Preview**: Visual frame thumbnails with frame numbers

### ⚙️ **Customization Options**
- **Grid Dimensions**: Adjustable from 4x4 up to 10x10 dots
- **Color Palette**: Customize background, active dot, and inactive dot colors
- **Frame Duration**: Control animation speed (100ms to 1000ms per frame)
- **Background Control**: Toggle background inclusion in exports

### 📁 **Export & Import**
- **Lottie Export**: Generate production-ready Lottie JSON files
- **Local Storage**: Automatic saving of your work locally
- **Timestamped Downloads**: Organized file naming with timestamps

### ⌨️ **Keyboard Shortcuts**
- `Space` - Play/Pause animation
- `←/→` - Navigate between frames
- `Ctrl/Cmd + N` - Add new frame
- `Delete/Backspace` - Delete current frame
- `Escape` - Stop animation

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/flipdots-lottie-creator.git
cd flipdots-lottie-creator
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

## 🎯 How to Use

### Creating Your First Animation

1. **Set Up Your Grid**
   - Adjust the grid dimensions in the Properties Panel (right sidebar)
   - Choose your preferred colors for active/inactive dots and background

2. **Design Your Frames**
   - Click on dots in the main grid to toggle them on/off
   - Use the "+" button to add new frames
   - Navigate between frames using the arrow buttons or frame thumbnails

3. **Preview Your Animation**
   - Click the play button to see your animation in action
   - Adjust frame duration for perfect timing
   - Use keyboard shortcuts for efficient workflow

4. **Export Your Work**
   - Click "Download as Lottie" to export your animation
   - The exported JSON file can be used in web applications, mobile apps, and design tools

### Advanced Features

- **Frame Reordering**: Use the left/right chevron buttons to move frames in the timeline
- **Batch Operations**: Clear entire frames or delete multiple frames quickly
- **Responsive Design**: Works perfectly on tablets and mobile devices
- **Auto-Save**: Your work is automatically saved to browser storage

## 🛠️ Built With

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Vite** - Fast build tool and development server
- **Lucide React** - Beautiful icon library

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🎨 Use Cases

- **Web Animations**: Create engaging micro-interactions for websites
- **Mobile Apps**: Add delightful animations to iOS and Android apps
- **Digital Signage**: Design retro-style display animations
- **Presentations**: Create unique visual elements for slides
- **Art Projects**: Explore pixel art and grid-based animations
- **Prototyping**: Quickly mock up display behaviors

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── FlipDotGrid.tsx # Main grid component
│   ├── PlayerControls.tsx # Animation controls
│   └── PropertiesPanel.tsx # Settings panel
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── animationUtils.ts # Animation helpers
│   └── lottieExporter.ts # Lottie export logic
└── App.tsx            # Main application component
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by classic flip dot displays and modern animation tools
- Built with modern web technologies for optimal performance
- Designed with accessibility and user experience in mind

---

**Made with ❤️ for the creative community**

*Transform your retro display ideas into modern animations with Flip Dots Lottie Creator!*