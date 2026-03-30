# 🎯 FocusFlow

A modern, beautiful focus timer application designed to help you track and optimize your productivity sessions.

Built with **React**, **Vite**, **Tailwind CSS**, and **Recharts** for a smooth, performant experience.

---

## ✨ Features

- **⏱️ Focus Timer** - Start focused work sessions with customizable durations
- **📊 Session Analytics** - Visualize your focus patterns with interactive charts
- **📋 Session History** - Keep track of all your completed sessions
- **🎨 Dark Theme** - Eye-friendly dark interface for extended focus sessions
- **⚡ Lightning Fast** - Built with Vite for instant HMR and blazing fast load times

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd focus-timer

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

---

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── FocusChart.jsx   # Chart visualization
│   ├── SessionComplete.jsx # Completion modal
│   ├── SessionHistory.jsx  # History view
│   └── TimerPanel.jsx   # Main timer interface
├── hooks/               # Custom React hooks
│   ├── useHistory.js    # Session history management
│   └── useTimer.js      # Timer logic
├── utils.js             # Utility functions
├── App.jsx              # Main app component
├── main.jsx             # Application entry point
└── index.css            # Base styles
```

---

## 🎨 Tech Stack

- **React 19** - UI library
- **Vite 8** - Build tool & dev server
- **Tailwind CSS 3** - Utility-first CSS framework
- **Recharts 3** - Chart library
- **Lucide React** - Icon library
- **ESLint 9** - Code linting

---

## 🔧 Configuration

- **Vite** - `vite.config.js`
- **Tailwind** - `tailwind.config.js`
- **PostCSS** - `postcss.config.js`
- **ESLint** - `eslint.config.js`

---

## 📝 License

This project is open source and available under the MIT License.

---

## 💡 Tips for Productivity

1. **Use shorter sessions** - Start with 25-minute focus blocks (Pomodoro technique)
2. **Review your charts** - Track patterns in your productivity over time
3. **Consistent logging** - Keep logging sessions to build an accurate history
4. **Eliminate distractions** - Use this timer to dedicate uninterrupted focus time

---

**Happy focusing! 🚀**
