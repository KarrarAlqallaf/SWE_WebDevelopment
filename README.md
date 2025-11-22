# JadwalGYM - Workout Program Platform

A fully interactive React-based front-end prototype for a comprehensive workout program management platform. JadwalGYM allows users to browse, create, customize, and manage fitness schedules with an intuitive interface supporting both light and dark themes.

The Figma design refrence: https://www.figma.com/design/kcLsyUcdHoMwOS8iJ0dojI/SWE-web-project?node-id=0-1&t=cJ6LcyIkq8STwc7w-1

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Components](#components)
- [Styling System](#styling-system)
- [Development](#development)
- [Team Members](#team-members)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Project Overview

JadwalGYM is a fitness application front-end prototype developed as part of Milestone 4. The application provides a complete user interface for managing workout programs, creating custom schedules (Jadwal), and organizing fitness routines. The platform features a modern design system with theme support, responsive layouts, and fully interactive components.

### Key Capabilities

- **Program Discovery**: Browse and search through a library of workout programs
- **Schedule Creation**: Build custom workout schedules using built-in templates or from scratch
- **Program Management**: Save favorite programs to a personal vault
- **User Authentication**: Secure login and registration system
- **Admin Dashboard**: Administrative interface for content management
- **Theme Support**: Seamless switching between light and dark modes

## ✨ Features

### User Features

- **Guest Home Page**: Landing page with popular programs and category browsing
- **Program Browsing**: Search and filter programs by categories (Cardio, Strength, Yoga, HIIT, etc.)
- **Program Details**: Detailed view of workout programs with ratings and descriptions
- **Jadwal Builder**: Interactive interface for creating and customizing workout schedules
- **Jadwal Creation**: Select from pre-built program templates or create custom schedules
- **Personal Vault**: Save and manage favorite programs
- **User Profile**: Account management and preferences
- **Rating System**: Star-based rating for programs

### Admin Features

- **Admin Dashboard**: Content management interface
- **Admin Authentication**: Secure admin login system

### Design Features

- **Responsive Design**: Fully responsive layouts for desktop and mobile devices
- **Theme Switching**: Light and dark mode with persistent theme selection
- **Interactive Components**: Fully functional buttons, forms, modals, and navigation
- **Design System**: Consistent styling using CSS variables and design tokens

## 🛠️ Tech Stack

### Core Technologies

- **React** 18.2.0 - UI library
- **Vite** 5.0.0 - Build tool and development server
- **JavaScript (ES6+)** - Programming language

### Styling

- **CSS3** with CSS Variables - Custom design system
- **Bootstrap 5** (via CDN) - Utility classes and grid system

### Development Tools

- **@vitejs/plugin-react** - Vite plugin for React support
- **Node.js** - Runtime environment

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 16+ (Node 18+ recommended)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
- **npm** (comes with Node.js) or **yarn**/ **pnpm**
  - Verify installation: `npm --version`
- **Git** (for version control)
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/KarrarAlqallaf/SWE_WebDevelopment.git

# Navigate to the project directory
cd SWE_WebDevelopment
```

### Step 2: Install Dependencies

```bash
# Install all required dependencies
npm install
```

This will install:
- React and React DOM
- Vite and Vite React plugin
- All other project dependencies

### Step 3: Start the Development Server

```bash
# Start the Vite development server
npm run dev
```

The application will be available at `http://localhost:5173/` (or the next available port).

### Step 4: Open in Browser

Open your web browser and navigate to the URL shown in the terminal (typically `http://localhost:5173/`).

## 💻 Usage

### Development Mode

```bash
# Start development server with hot reload
npm run dev
```

The development server includes:
- Hot Module Replacement (HMR) for instant updates
- Fast refresh for React components
- Error overlay for debugging

### Production Build

```bash
# Build the application for production
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 📁 Project Structure

```
SWE_WebDevelopment/
├── .gitignore                 # Git ignore rules
├── index.html                 # HTML entry point
├── package.json               # Project dependencies and scripts
├── package-lock.json          # Dependency lock file
├── vite.config.js             # Vite configuration
├── README.md                  # Project documentation
│
├── node_modules/              # Dependencies (generated, not committed)
│
└── src/                       # Source code directory
    ├── main.jsx               # React application entry point
    ├── App.jsx                # Main application component (routing & state)
    │
    ├── components/            # React components
    │   ├── AdminDashboard/    # Admin dashboard interface
    │   │   ├── AdminDashboard.jsx
    │   │   └── AdminDashboard.css
    │   │
    │   ├── AdminLogin/        # Admin authentication
    │   │   ├── AdminLogin.jsx
    │   │   └── AdminLogin.css
    │   │
    │   ├── ExerciseCreation/  # Exercise creation interface
    │   │   ├── ExerciseCreation.jsx
    │   │   └── ExerciseCreation.css
    │   │
    │   ├── ExerciseSelection/ # Exercise selection component
    │   │   ├── ExerciseSelection.jsx
    │   │   └── ExerciseSelection.css
    │   │
    │   ├── GuestHome/         # Landing page with program browsing
    │   │   ├── GuestHome.jsx
    │   │   ├── GuestHome.css
    │   │   ├── CategoriesSection.jsx
    │   │   ├── CategoriesSection.css
    │   │   ├── CategoryTile.jsx
    │   │   ├── CategoryTile.css
    │   │   ├── PopularProgramsSection.jsx
    │   │   ├── PopularProgramsSection.css
    │   │   ├── ProgramCard.jsx
    │   │   ├── ProgramCard.css
    │   │   ├── SearchRow.jsx
    │   │   └── SearchRow.css
    │   │
    │   ├── JadwalBuilder/     # Workout schedule builder
    │   │   ├── JadwalBuilder.jsx
    │   │   └── JadwalBuilder.css
    │   │
    │   ├── JadwalCreation/    # Schedule creation interface
    │   │   ├── JadwalCreation.jsx
    │   │   └── JadwalCreation.css
    │   │
    │   ├── Login/             # User login component
    │   │   ├── Login.jsx
    │   │   └── Login.css
    │   │
    │   ├── MuscleSelection/   # Muscle group selection
    │   │   ├── MuscleSelection.jsx
    │   │   └── MuscleSelection.css
    │   │
    │   ├── Profile/           # User profile management
    │   │   ├── Profile.jsx
    │   │   └── Profile.css
    │   │
    │   ├── ProgramDetail/     # Detailed program view
    │   │   ├── ProgramDetail.jsx
    │   │   └── ProgramDetail.css
    │   │
    │   ├── ProgramDetailModal/ # Program detail modal popup
    │   │   ├── ProgramDetailModal.jsx
    │   │   └── ProgramDetailModal.css
    │   │
    │   ├── Rating/            # Star rating component
    │   │   ├── Rating.jsx
    │   │   └── Rating.css
    │   │
    │   ├── SideBar/           # Main navigation sidebar
    │   │   ├── SideBar.jsx
    │   │   ├── SideBar.css
    │   │   └── SideBar.md
    │   │
    │   ├── SignUp/            # User registration
    │   │   ├── SignUp.jsx
    │   │   └── SignUp.css
    │   │
    │   └── Vault/             # Saved programs vault
    │       ├── Vault.jsx
    │       └── Vault.css
    │
    └── styles/                # Global styles and design tokens
        ├── base.css           # Base styles and utilities
        ├── tokens.css         # Design tokens (spacing, radius, transitions)
        ├── colorPalette.css   # Color system (light/dark themes)
        ├── auth.css           # Authentication-specific styles
        └── tempStyle.css      # Temporary styles
```

## 🧩 Components

### Core Application Components

#### `App.jsx`
Main application component that manages:
- Application routing and navigation
- Global state management
- Theme switching (light/dark mode)
- User authentication state
- Program data and selections

#### `SideBar`
Navigation sidebar component featuring:
- Main navigation menu
- Vault access and saved programs
- User account links
- Theme toggle functionality

#### `GuestHome`
Landing page component with:
- Popular programs section
- Category browsing
- Search functionality
- Program cards display

### Program Management Components

#### `ProgramDetail`
Full-page view displaying:
- Complete program information
- Exercise lists and details
- Schedule structure
- Edit and save functionality

#### `ProgramDetailModal`
Modal popup for quick program preview:
- Program summary
- Rating display
- Quick actions
- Navigation to full detail page

#### `JadwalCreation`
Interface for creating new schedules:
- Built-in program templates selection
- Custom schedule creation option
- Category-based filtering

#### `JadwalBuilder`
Interactive builder for customizing schedules:
- Exercise selection and arrangement
- Set and rep configuration
- Day-based organization
- Save to vault functionality

### User Management Components

#### `Login`
User authentication interface:
- Email/password login
- Navigation to signup
- Admin login access

#### `SignUp`
User registration form:
- Account creation
- Form validation
- Navigation to login

#### `Profile`
User account management:
- Profile information
- Preferences settings
- Account actions

#### `AdminLogin` & `AdminDashboard`
Administrative interface:
- Secure admin authentication
- Content management dashboard
- Platform administration tools

### Supporting Components

- **Vault**: Personal collection of saved programs
- **Rating**: Star-based rating display and input
- **ExerciseCreation**: Create custom exercises
- **ExerciseSelection**: Select exercises for programs
- **MuscleSelection**: Choose target muscle groups

## 🎨 Styling System

### Design Tokens (`tokens.css`)

The application uses CSS variables for consistent styling:

- **Spacing Scale**: `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`, `--spacing-xl`
- **Border Radius**: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-2xl`
- **Transitions**: `--transition-fast`, `--transition-base`, `--transition-slow`

### Color Palette (`colorPalette.css`)

Comprehensive color system supporting light and dark themes:

#### Theme Implementation
- Themes are controlled via `[data-theme]` attribute on the HTML element
- Default theme: `dark`
- Theme preference is persisted in `localStorage`

#### Color Tokens
- **Background Colors**: `--color-bg`, `--color-surface`, `--color-surface-alt`, `--color-elevated`
- **Text Colors**: `--color-text`, `--color-text-muted`, `--color-heading`
- **Semantic Colors**: `--color-primary`, `--color-secondary`, `--color-success`, `--color-warning`, `--color-danger`
- **Button Variants**: `--color-button-solid-bg`, `--color-button-outline-bg`, etc.
- **UI Elements**: `--color-card-border`, `--color-divider`, `--color-focus-ring`

### Theme Switching

The application supports seamless theme switching:

```javascript
// Theme is toggled via handleThemeToggle in App.jsx
// Theme preference is saved to localStorage
// All components automatically adapt to the selected theme
```

### Responsive Design

- Mobile-first approach
- Bootstrap 5 grid system for layout
- Custom CSS for component-specific responsive behavior
- Touch-friendly interactive elements

## 🏋️ Built-in Programs

The application includes pre-built workout program templates:

1. **Push-Pull-Legs (PPL)** - 3-day rotation, 4-6 days/week
2. **Upper-Lower Split** - 4 days/week
3. **Full Body** - 2-4 days/week
4. **Bro Split** - Classic 5-day bodybuilding split
5. **5x5 Strength Program** - 3 days/week
6. **Powerbuilding Program** - 4-5 days/week
7. **Calisthenics Program** - 3-5 days/week

## 🔧 Development

### Git Workflow

#### Basic Git Commands

```bash
# Check current branch
git branch --show-current

# Switch to a branch
git checkout branch-name

# Create and switch to new branch
git checkout -b feature/new-feature

# Stage files
git add file-name.jsx
# Or stage all changes
git add .

# Commit changes
git commit -m "feat: description of changes"

# Push to remote
git push origin branch-name

# Pull latest changes
git pull origin branch-name
```

#### Branch Strategy

- **main/master**: Production-ready code
- **karrarBranch**: Active development branch
- **feature branches**: Feature-specific development

### Development Best Practices

1. **Component Organization**: Each component has its own folder with `.jsx` and `.css` files
2. **Styling**: Use design tokens from `tokens.css` and `colorPalette.css`
3. **State Management**: Centralized in `App.jsx` with React hooks
4. **Code Style**: Follow React best practices and component composition

### Environment Setup

No environment variables are required for the front-end prototype. All configuration is handled through:
- `vite.config.js` for build configuration
- CSS variables for theming
- Component props for data flow

## 👥 Team Members

<!-- Update this section with your actual team member information -->

**Team Members:**
- [Team Member 1 Name] - Role/Responsibilities
- [Team Member 2 Name] - Role/Responsibilities
- [Team Member 3 Name] - Role/Responsibilities

**Contributions:**
- All team members contribute through individual GitHub accounts
- Contributions are tracked via GitHub's contribution graph
- Each member works on separate branches before merging

## 🤝 Contributing

### Contribution Guidelines

1. **Create a Branch**: Always create a feature branch for your work
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**: Implement your feature or fix

3. **Commit Changes**: Write clear, descriptive commit messages
   ```bash
   git commit -m "feat: add new feature description"
   ```

4. **Push to Remote**: Push your branch to GitHub
   ```bash
   git push -u origin feature/your-feature-name
   ```

5. **Create Pull Request**: Open a PR for review before merging to main branch

### Commit Message Convention

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests

## 🐛 Troubleshooting

### Common Issues

#### `npm ERR! enoent package.json`
**Solution**: Ensure you're in the project root directory (`SWE_WebDevelopment/`)

#### Dev server shows wrong content
**Solution**: 
- Check current branch: `git branch --show-current`
- Switch to desired branch: `git checkout branch-name`
- Restart dev server: `npm run dev`

#### Styles not updating
**Solution**:
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Restart the dev server
- Verify CSS files are imported in `App.jsx`

#### Theme not persisting
**Solution**:
- Check browser localStorage permissions
- Verify `colorPalette.css` is imported in `App.jsx`
- Check browser console for errors

#### Port already in use
**Solution**:
- Vite will automatically use the next available port
- Or specify a port: `npm run dev -- --port 3000`

#### Module not found errors
**Solution**:
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

## 📝 Notes

- This is a **front-end prototype** - no backend integration is implemented
- Data is currently managed through dummy data in `App.jsx`
- The application uses React state management for all interactions
- Theme switching is fully functional and persists across sessions
- All components are fully interactive and responsive

## 📄 License

This project does not currently include a license file. Add an appropriate license if you plan to make it public.

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [Git Documentation](https://git-scm.com/doc)

---

**Project Status**: Active Development  
**Last Updated**: 2025  
**Version**: 0.1.0

---

For questions or issues, please open an issue on the GitHub repository or contact the development team.
