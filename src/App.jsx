import React, { useState, useEffect } from 'react';
import SideBar from './components/SideBar/SideBar';
import GuestHome from './components/GuestHome/GuestHome';
import ProgramDetailModal from './components/ProgramDetailModal/ProgramDetailModal';
import JadwalCreationPage from './components/JadwalCreation/JadwalCreation';
import JadwalBuilder from './components/JadwalBuilder/JadwalBuilder';
import ProgramDetail from './components/ProgramDetail/ProgramDetail';
import Vault from './components/Vault/Vault';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Profile from './components/Profile/Profile';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import AdminLogin from './components/AdminLogin/AdminLogin';
import './styles/tokens.css';
import './styles/base.css';
import './styles/auth.css';
import './styles/colorPalette.css';


// Dummy data for demonstration - updated to match built-in program structure
const dummyPrograms = [
  {
    id: '1',
    title: 'Morning Cardio Blast',
    author: 'John Doe',
    rating: 4.5,
    summary: 'Start your day with high-energy cardio workouts designed to boost metabolism and improve cardiovascular health.',
    shortLabel: 'Cardio',
    durationHint: '3-5 days/wk',
    description: 'Start your day with high-energy cardio workouts designed to boost metabolism and improve cardiovascular health.',
    tags: ['Cardio', 'Morning', 'Metabolism']
  },
  {
    id: '2',
    title: 'Upper-Lower Split',
    author: 'Jane Smith',
    rating: 4.8,
    summary: 'Build muscle and strength with this comprehensive program focusing on proper form and progressive overload.',
    shortLabel: 'Upper / Lower',
    durationHint: '4 days/wk',
    description: 'Build muscle and strength with this comprehensive program focusing on proper form and progressive overload.',
    tags: ['Strength', 'Simple', 'Repeatable']
  },
  {
    id: '3',
    title: 'Yoga Flow for Flexibility',
    author: 'Sarah Johnson',
    rating: 4.2,
    summary: 'Improve flexibility and reduce stress with gentle yoga flows suitable for all levels.',
    shortLabel: 'Flexibility',
    durationHint: '3-4 days/wk',
    description: 'Improve flexibility and reduce stress with gentle yoga flows suitable for all levels.',
    tags: ['Yoga', 'Flexibility', 'Recovery']
  },
  {
    id: '4',
    title: 'HIIT Power Sessions',
    author: 'Mike Wilson',
    rating: 4.7,
    summary: 'High-intensity interval training to maximize calorie burn and improve endurance in short sessions.',
    shortLabel: 'HIIT',
    durationHint: '3-4 days/wk',
    description: 'High-intensity interval training to maximize calorie burn and improve endurance in short sessions.',
    tags: ['HIIT', 'Conditioning', 'Fat Loss']
  },
  {
    id: '5',
    title: 'Full Body',
    author: 'Emily Davis',
    rating: 4.6,
    summary: 'Perfect for beginners, this program introduces fundamental exercises and proper technique.',
    shortLabel: 'Total body',
    durationHint: '2-4 days/wk',
    description: 'Perfect for beginners, this program introduces fundamental exercises and proper technique.',
    tags: ['General Fitness', 'Beginner']
  },
  {
    id: '6',
    title: '5x5 Strength Program',
    author: 'Chris Brown',
    rating: 4.9,
    summary: 'Take your strength to the next level with advanced powerlifting techniques and programming.',
    shortLabel: 'Strength core',
    durationHint: '3 days/wk',
    description: 'Take your strength to the next level with advanced powerlifting techniques and programming.',
    tags: ['Powerlifting', 'Compound', 'Progressive']
  },
  {
    id: '7',
    title: 'Pilates Core Strength',
    author: 'Lisa Anderson',
    rating: 4.4,
    summary: 'Develop core strength and stability through controlled Pilates movements and breathing.',
    shortLabel: 'Core',
    durationHint: '3-5 days/wk',
    description: 'Develop core strength and stability through controlled Pilates movements and breathing.',
    tags: ['Pilates', 'Core', 'Stability']
  },
  {
    id: '8',
    title: 'Boxing Fundamentals',
    author: 'Tom Martinez',
    rating: 4.7,
    summary: 'Learn boxing basics including footwork, punches, and defensive techniques.',
    shortLabel: 'Boxing',
    durationHint: '3-4 days/wk',
    description: 'Learn boxing basics including footwork, punches, and defensive techniques.',
    tags: ['Boxing', 'Skills', 'Conditioning']
  },
  {
    id: '9',
    title: 'Dance Cardio Party',
    author: 'Maria Garcia',
    rating: 4.3,
    summary: 'Fun and energetic dance-based cardio workouts that make exercise enjoyable.',
    shortLabel: 'Dance',
    durationHint: '3-5 days/wk',
    description: 'Fun and energetic dance-based cardio workouts that make exercise enjoyable.',
    tags: ['Cardio', 'Fun', 'Dance']
  },
  {
    id: '10',
    title: 'Recovery & Stretching',
    author: 'David Lee',
    rating: 4.5,
    summary: 'Gentle recovery sessions focusing on stretching, mobility, and relaxation.',
    shortLabel: 'Recovery',
    durationHint: 'Daily',
    description: 'Gentle recovery sessions focusing on stretching, mobility, and relaxation.',
    tags: ['Mobility', 'Recovery', 'Flexibility']
  },
  {
    id: '11',
    title: 'CrossFit WOD',
    author: 'Alex Taylor',
    rating: 4.8,
    summary: 'Daily CrossFit workouts of the day for experienced athletes seeking variety.',
    shortLabel: 'CrossFit',
    durationHint: '5-6 days/wk',
    description: 'Daily CrossFit workouts of the day for experienced athletes seeking variety.',
    tags: ['CrossFit', 'Variety', 'Advanced']
  },
  {
    id: '12',
    title: 'Swimming Technique',
    author: 'Rachel Green',
    rating: 4.6,
    summary: 'Improve swimming efficiency with technique-focused drills and workouts.',
    shortLabel: 'Swimming',
    durationHint: '3-4 days/wk',
    description: 'Improve swimming efficiency with technique-focused drills and workouts.',
    tags: ['Swimming', 'Technique', 'Cardio']
  }
];

const dummyCategories = [
  { id: '1', label: 'Cardio' },
  { id: '2', label: 'Muscle Training' },
  { id: '3', label: 'Boxing' },
  { id: '4', label: 'Yoga' },
  { id: '5', label: 'Pilates' },
  { id: '6', label: 'HIIT' },
  { id: '7', label: 'Strength' },
  { id: '8', label: 'Flexibility' }
];

// Vault items - matching titles with popular programs
const dummyVaultItems = [
  { 
    id: '1', 
    title: 'Morning Cardio Blast', 
    author: 'John Doe',
    rating: 4.5,
    summary: 'Start your day with high-energy cardio workouts designed to boost metabolism and improve cardiovascular health.',
    shortLabel: 'Cardio',
    durationHint: '3-5 days/wk',
    description: 'Start your day with high-energy cardio workouts designed to boost metabolism and improve cardiovascular health.',
    tags: ['Cardio', 'Morning', 'Metabolism']
  },
  { 
    id: '2', 
    title: 'Strength Training Basics', 
    author: 'Jane Smith',
    rating: 4.8,
    summary: 'Build muscle and strength with this comprehensive program focusing on proper form and progressive overload.',
    shortLabel: 'Upper / Lower',
    durationHint: '4 days/wk',
    description: 'Build muscle and strength with this comprehensive program focusing on proper form and progressive overload.',
    tags: ['Strength', 'Simple', 'Repeatable']
  }
];

const builtInPrograms = [
  {
    id: 'ppl',
    shortLabel: '3-day rotation',
    durationHint: '4-6 days/wk',
    title: 'Push-Pull-Legs (PPL)',
    description: 'A beginner-friendly split with clear upper-body focus days that is easy to customize.',
    tags: ['Strength', 'Hypertrophy', 'Split']
  },
  {
    id: 'upper-lower',
    shortLabel: 'Upper / Lower',
    durationHint: '4 days/wk',
    title: 'Upper-Lower Split',
    description: 'Simple two-day rotation that can flex between strength blocks or hypertrophy pumps.',
    tags: ['Strength', 'Simple', 'Repeatable']
  },
  {
    id: 'full-body',
    shortLabel: 'Total body',
    durationHint: '2-4 days/wk',
    title: 'Full Body',
    description: 'Ideal for beginners, busy people, or anyone who wants every muscle touched each session.',
    tags: ['General Fitness', 'Beginner']
  },
  {
    id: 'bro-split',
    shortLabel: 'Classic 5-day',
    durationHint: '5 days/wk',
    title: 'Bro Split (Chest / Back / Legs / Shoulders / Arms)',
    description: 'Bodybuilding staple with a familiar flow—perfect if you love dialing in one area per day.',
    tags: ['Bodybuilding', 'Volume']
  },
  {
    id: 'strong-5x5',
    shortLabel: 'Strength core',
    durationHint: '3 days/wk',
    title: '5x5 Strength Program',
    description: 'Iconic compound-lift template that lets you chase progressive overload with minimal fluff.',
    tags: ['Powerlifting', 'Compound', 'Progressive']
  },
  {
    id: 'powerbuilding',
    shortLabel: 'Hybrid',
    durationHint: '4-5 days/wk',
    title: 'Powerbuilding Program',
    description: 'Modern mix of heavy barbell work plus accessory hypertrophy for intermediate lifters.',
    tags: ['Strength', 'Hypertrophy', 'Hybrid']
  },
  {
    id: 'calisthenics',
    shortLabel: 'Bodyweight',
    durationHint: '3-5 days/wk',
    title: 'Calisthenics Program',
    description: 'Familiar bodyweight progressions that keep equipment light but skills high.',
    tags: ['Calisthenics', 'Skills', 'Minimal Gear']
  }
];

const creationCategories = [
  { id: 'strength', label: 'Strength' },
  { id: 'hypertrophy', label: 'Hypertrophy' },
  { id: 'conditioning', label: 'Conditioning' },
  { id: 'mobility', label: 'Mobility' },
  { id: 'powerlifting', label: 'Powerlifting' },
  { id: 'powerbuilding', label: 'Powerbuilding' },
  { id: 'bodybuilding', label: 'Bodybuilding' },
  { id: 'calisthenics', label: 'Calisthenics' },
  { id: 'general-fitness', label: 'General Fitness' },
  { id: 'fat-loss', label: 'Fat Loss' },
  { id: 'equipment-light', label: 'Minimal Equipment' },
  { id: 'busy-schedule', label: 'Busy Schedule' }
];

// Category Icons (simple SVG placeholders)
const CategoryIcon = ({ name }) => {
  const icons = {
    'Cardio': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
      </svg>
    ),
    'Muscle Training': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 6h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1"></path>
        <path d="M7 6H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"></path>
        <line x1="12" y1="6" x2="12" y2="18"></line>
        <line x1="7" y1="12" x2="17" y2="12"></line>
      </svg>
    ),
    'Boxing': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2"></rect>
        <line x1="9" y1="3" x2="9" y2="21"></line>
        <line x1="15" y1="3" x2="15" y2="21"></line>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="3" y1="15" x2="21" y2="15"></line>
      </svg>
    ),
    'Yoga': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="2" x2="12" y2="22"></line>
        <line x1="2" y1="12" x2="22" y2="12"></line>
      </svg>
    ),
    'Pilates': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
      </svg>
    ),
    'HIIT': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
      </svg>
    ),
    'Strength': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9V2h12v7"></path>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <path d="M6 14h12"></path>
      </svg>
    ),
    'Flexibility': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      </svg>
    )
  };
  return icons[name] || icons['Cardio'];
};

function App() {
  const [activeKey, setActiveKey] = useState('home');
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isProgramDetailOpen, setIsProgramDetailOpen] = useState(false);
  const [programDetailView, setProgramDetailView] = useState(null); // 'modal' or 'detail'
  const [theme, setTheme] = useState('dark');
  const [selectedBuiltInProgram, setSelectedBuiltInProgram] = useState(null);
  const [currentView, setCurrentView] = useState(null); // 'login', 'signup', 'admin-login', 'admin-dashboard'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize theme from HTML or localStorage
  useEffect(() => {
    const htmlTheme = document.documentElement.getAttribute('data-theme');
    const savedTheme = localStorage.getItem('theme') || htmlTheme || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  
  const handleThemeToggle = () => {
    const themes = ['dark', 'light', 'monokai'];
    const currentIndex = themes.indexOf(theme);
    const newTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleNav = (key) => {
    setActiveKey(key);
    console.log('Navigate to:', key);
    if (key === 'home') {
      setCurrentPage('home');
    } else {
      setCurrentPage(key);
    }
    // Close program detail view when navigating
    setIsProgramDetailOpen(false);
    setProgramDetailView(null);
  };

  const handleOpenProgram = (id) => {
    console.log('Open program:', id);
    
    const program = dummyPrograms.find(p => p.id === id);
    if (program) {
      setSelectedProgram(program);
      setIsProgramDetailOpen(true);
      setProgramDetailView('modal');
    }
  };

  const handleCloseProgramModal = () => {
    setIsProgramDetailOpen(false);
    setSelectedProgram(null);
    setProgramDetailView(null);
  };

  // Map popular programs to built-in program IDs
  const programMapping = {
    '5': 'full-body', // Full Body -> Full Body
    '6': 'strong-5x5', // 5x5 Strength Program -> 5x5 Strength
    '2': 'upper-lower', // Upper-Lower Split -> Upper-Lower Split
    // Add more mappings as needed
  };

  const handleOpenProgramDetail = (id) => {
    console.log('Opening program detail page for:', id);
    setIsProgramDetailOpen(false);
    
    // Check if this program maps to a built-in program
    const builtInId = programMapping[id];
    if (builtInId) {
      const template = getBuiltInProgramTemplate(builtInId);
      if (template) {
        setSelectedBuiltInProgram(template);
        setCurrentPage('program-detail');
        return;
      }
    }
    
    // For other programs, show empty detail page
    setProgramDetailView('detail');
    setCurrentPage('program-detail');
  };

  const handleSearch = (query) => {
    console.log('Search:', query);
  };

  const handleCategoryClick = (id) => {
    console.log('Category clicked:', id);
  };

  const handleRatingSubmit = (value) => {
    console.log('Rating submitted:', value, 'for program:', selectedProgram?.id);
    alert(`Thank you! You rated "${selectedProgram?.title}" ${value} out of 5 stars.`);
    // Close modal after rating
    handleCloseProgramModal();
  };

  const categoriesWithIcons = dummyCategories.map(cat => ({
    ...cat,
    icon: <CategoryIcon name={cat.label} />
  }));

  const getBuiltInProgramTemplate = (programId) => {
    const templates = {
      'ppl': {
        days: [
          {
            id: 1,
            exercises: [
              {
                id: 1,
                name: 'Bench Press',
                muscle: 'Chest',
                unit: 'KG',
                sets: [{ id: 1, weight: '', reps: '' }, { id: 2, weight: '', reps: '' }, { id: 3, weight: '', reps: '' }],
                notes: ''
              },
              {
                id: 2,
                name: 'Overhead Press',
                muscle: 'Shoulders',
                unit: 'KG',
                sets: [{ id: 1, weight: '', reps: '' }, { id: 2, weight: '', reps: '' }, { id: 3, weight: '', reps: '' }],
                notes: ''
              },
              {
                id: 3,
                name: 'Tricep Dips',
                muscle: 'Triceps',
                unit: 'KG',
                sets: [{ id: 1, weight: '', reps: '' }, { id: 2, weight: '', reps: '' }, { id: 3, weight: '', reps: '' }],
                notes: ''
              }
            ]
          },
          {
            id: 2,
            exercises: [
              {
                id: 4,
                name: 'Deadlift',
                muscle: 'Back',
                unit: 'KG',
                sets: [{ id: 1, weight: '', reps: '' }, { id: 2, weight: '', reps: '' }, { id: 3, weight: '', reps: '' }],
                notes: ''
              },
              {
                id: 5,
                name: 'Barbell Row',
                muscle: 'Back',
                unit: 'KG',
                sets: [{ id: 1, weight: '', reps: '' }, { id: 2, weight: '', reps: '' }, { id: 3, weight: '', reps: '' }],
                notes: ''
              },
              {
                id: 6,
                name: 'Barbell Curl',
                muscle: 'Biceps',
                unit: 'KG',
                sets: [{ id: 1, weight: '', reps: '' }, { id: 2, weight: '', reps: '' }, { id: 3, weight: '', reps: '' }],
                notes: ''
              }
            ]
          },
          {
            id: 3,
            exercises: [
              {
                id: 7,
                name: 'Squat',
                muscle: 'Legs',
                unit: 'KG',
                sets: [{ id: 1, weight: '', reps: '' }, { id: 2, weight: '', reps: '' }, { id: 3, weight: '', reps: '' }],
                notes: ''
              },
              {
                id: 8,
                name: 'Leg Press',
                muscle: 'Legs',
                unit: 'KG',
                sets: [{ id: 1, weight: '', reps: '' }, { id: 2, weight: '', reps: '' }, { id: 3, weight: '', reps: '' }],
                notes: ''
              },
              {
                id: 9,
                name: 'Calf Raise',
                muscle: 'Legs',
                unit: 'KG',
                sets: [{ id: 1, weight: '', reps: '' }, { id: 2, weight: '', reps: '' }, { id: 3, weight: '', reps: '' }],
                notes: ''
              }
            ]
          }
        ]
      },
      'upper-lower': {
        days: [
          {
            id: 1,
            exercises: [
              {
                id: 1,
                name: 'Bench Press',
                muscle: 'Chest',
                unit: 'KG',
                sets: [{ id: 1, weight: '', reps: '' }, { id: 2, weight: '', reps: '' }, { id: 3, weight: '', reps: '' }],
                notes: ''
              },
              {
                id: 2,
                name: 'Barbell Row',
                muscle: 'Back',
                unit: 'KG',
                sets: [{ id: 1, weight: '', reps: '' }, { id: 2, weight: '', reps: '' }, { id: 3, weight: '', reps: '' }],
                notes: ''
              },
              {
                id: 3,
                name: 'Overhead Press',
                muscle: 'Shoulders',
                unit: 'KG',
                sets: [{ id: 1, weight: '', reps: '' }, { id: 2, weight: '', reps: '' }, { id: 3, weight: '', reps: '' }],
                notes: ''
              }
            ]
          },
          {
            id: 2,
            exercises: [
              {
                id: 4,
                name: 'Squat',
                muscle: 'Legs',
                unit: 'KG',
                sets: [{ id: 1, weight: '', reps: '' }, { id: 2, weight: '', reps: '' }, { id: 3, weight: '', reps: '' }],
                notes: ''
              },
              {
                id: 5,
                name: 'Romanian Deadlift',
                muscle: 'Legs',
                unit: 'KG',
                sets: [{ id: 1, weight: '', reps: '' }, { id: 2, weight: '', reps: '' }, { id: 3, weight: '', reps: '' }],
                notes: ''
              },
              {
                id: 6,
                name: 'Leg Curl',
                muscle: 'Legs',
                unit: 'KG',
                sets: [{ id: 1, weight: '', reps: '' }, { id: 2, weight: '', reps: '' }, { id: 3, weight: '', reps: '' }],
                notes: ''
              }
            ]
          }
        ]
      },
      'full-body': {
        days: [
          {
            id: 1,
            exercises: [
              {
                id: 1,
                name: 'Squat',
                muscle: 'Legs',
                unit: 'KG',
                sets: [{ id: 1, weight: '', reps: '' }, { id: 2, weight: '', reps: '' }, { id: 3, weight: '', reps: '' }],
                notes: ''
              },
              {
                id: 2,
                name: 'Bench Press',
                muscle: 'Chest',
                unit: 'KG',
                sets: [{ id: 1, weight: '', reps: '' }, { id: 2, weight: '', reps: '' }, { id: 3, weight: '', reps: '' }],
                notes: ''
              },
              {
                id: 3,
                name: 'Barbell Row',
                muscle: 'Back',
                unit: 'KG',
                sets: [{ id: 1, weight: '', reps: '' }, { id: 2, weight: '', reps: '' }, { id: 3, weight: '', reps: '' }],
                notes: ''
              }
            ]
          }
        ]
      }
    };
    return templates[programId] || null;
  };

  const handleSelectBuiltInProgram = (program) => {
    const template = getBuiltInProgramTemplate(program.id);
    if (template) {
      setSelectedBuiltInProgram(template);
      setCurrentPage('program-detail');
    }
  };

  const handleCreateCustomJadwal = (selectedCategoryIds) => {
    console.log('Creating custom Jadwal with categories:', selectedCategoryIds);
    setSelectedBuiltInProgram(null);
    setCurrentPage('jadwal-builder');
  };

  const handleSaveToVault = (schedule) => {
    console.log('Saving to vault:', schedule);
    // In real app, this would update vault items state
    alert(`Schedule "${schedule.name}" saved to vault!`);
  };

  // Check if we're on an auth page (should hide sidebar)
  const isAuthPage = currentView === 'login' || currentView === 'signup' || currentView === 'admin-login' || currentView === 'admin-dashboard';

  return (
    <div className="app" style={{ display: 'flex', minHeight: '100vh' }}>
      {!isAuthPage && (
        <SideBar
          activeKey={activeKey}
          vaultItems={dummyVaultItems}
          defaultVaultOpen={true}
          onNav={handleNav}
          onOpenProgram={handleOpenProgram}
        />
      )}
      <main style={{ flex: 1, padding: '0', width: isAuthPage ? '100%' : 'auto' }}>
        {isAuthPage ? (
          <>
            {currentView === 'login' && (
              <Login
                onBack={() => {
                  setCurrentView(null);
                  setCurrentPage('home');
                }}
                onLogin={(user) => {
                  setIsAuthenticated(true);
                  setCurrentView(null);
                  setCurrentPage('account');
                }}
                onOpenSignUp={() => setCurrentView('signup')}
                onOpenAdminLogin={() => setCurrentView('admin-login')}
              />
            )}
            {currentView === 'signup' && (
              <SignUp
                onBack={() => {
                  setCurrentView(null);
                  setCurrentPage('home');
                }}
                onSignUp={(form) => {
                  setIsAuthenticated(true);
                  setCurrentView(null);
                  setCurrentPage('account');
                }}
                onOpenLogin={() => setCurrentView('login')}
                onOpenAdminLogin={() => setCurrentView('admin-login')}
              />
            )}
            {currentView === 'admin-login' && (
              <AdminLogin
                onBack={() => {
                  setCurrentView(null);
                  setCurrentPage('home');
                }}
                onLogin={(admin) => {
                  setIsAdmin(true);
                  setIsAuthenticated(true);
                  setCurrentView('admin-dashboard');
                }}
                onOpenUserLogin={() => setCurrentView('login')}
              />
            )}
            {currentView === 'admin-dashboard' && (
              <AdminDashboard
                onSignOut={() => {
                  setIsAdmin(false);
                  setIsAuthenticated(false);
                  setCurrentView(null);
                  setCurrentPage('home');
                }}
              />
            )}
          </>
        ) : (
          <>
            {currentPage === 'home' && (
              <GuestHome
                popularPrograms={dummyPrograms}
                categories={categoriesWithIcons}
                onSearch={handleSearch}
                onOpenProgram={handleOpenProgram}
                onCategoryClick={handleCategoryClick}
                onThemeToggle={handleThemeToggle}
                currentTheme={theme}
                onLoginClick={() => setCurrentView('login')}
                onSignUpClick={() => setCurrentView('signup')}
              />
            )}
            {currentPage === 'account' && (
              <Profile />
            )}
            {currentPage === 'create' && (
          <JadwalCreationPage
            programs={builtInPrograms}
            categories={creationCategories}
            onSelectProgram={handleSelectBuiltInProgram}
            onCreateCustom={handleCreateCustomJadwal}
          />
        )}
        {currentPage === 'jadwal-builder' && (
          <JadwalBuilder
            builtInProgram={selectedBuiltInProgram}
            isCustom={!selectedBuiltInProgram}
            onSave={(schedule) => {
              console.log('Saving schedule to vault:', schedule);
              // Add to vault items
              const newVaultItem = {
                id: Date.now().toString(),
                title: schedule.name,
                author: 'You',
                schedule: schedule
              };
              // In real app, this would save to backend/localStorage
              alert(`Schedule "${schedule.name}" saved to vault!`);
            }}
          />
        )}
        {currentPage === 'program-detail' && selectedBuiltInProgram && (
          <ProgramDetail
            programData={selectedBuiltInProgram}
            scheduleName=""
            isEditable={false}
            onModify={() => {
              // Switch to builder mode - keep the same program data
              setCurrentPage('jadwal-builder');
            }}
            onSave={handleSaveToVault}
          />
        )}
            {currentPage === 'vault' && (
              <Vault
                vaultItems={dummyVaultItems}
                onOpenProgram={handleOpenProgram}
              />
            )}
            {currentPage === 'program-detail' && programDetailView === 'detail' && (
              <div className="container py-5">
                <h1>Program Details</h1>
                <p>Program detail interface will go here (programDetails.jsx).</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Program Detail Modal */}
      {isProgramDetailOpen && selectedProgram && (
        <ProgramDetailModal
          program={selectedProgram}
          onClose={handleCloseProgramModal}
          onRatingSubmit={handleRatingSubmit}
          onOpenProgram={handleOpenProgramDetail}
        />
      )}
    </div>
  );
}

export default App;

