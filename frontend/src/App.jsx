import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import SideBar from './components/SideBar/SideBar';
import GuestHome from './components/GuestHome/GuestHome';
import AllPrograms from './components/AllPrograms/AllPrograms';
import ProgramDetailModal from './components/ProgramDetailModal/ProgramDetailModal';
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


// Backend URL configuration
// Set VITE_API_BASE_URL in frontend/.env file
// For local development: VITE_API_BASE_URL=http://localhost:8000
// For production: VITE_API_BASE_URL=https://your-api-domain.com
// Normalize URL to remove trailing slashes to prevent double slashes
const API_BASE_URL_RAW = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').trim();
const API_BASE_URL = API_BASE_URL_RAW.replace(/\/+$/, '');

// Helper function to construct API URLs properly, preventing double slashes
const buildApiUrl = (path) => {
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Ensure base URL doesn't have trailing slash and path doesn't have leading slash
  return `${API_BASE_URL}/${cleanPath}`;
};

// Category Icons - matches backend seed categories
const CategoryIcon = ({ name }) => {
  const icons = {
    'Strength': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9V2h12v7"></path>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <path d="M6 14h12"></path>
      </svg>
    ),
    'Hypertrophy': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 6v6l4 2"></path>
      </svg>
    ),
    'Conditioning': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
      </svg>
    ),
    'Mobility': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      </svg>
    ),
    'Powerlifting': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2"></rect>
        <path d="M9 9h6v6H9z"></path>
        <line x1="9" y1="12" x2="15" y2="12"></line>
        <line x1="12" y1="9" x2="12" y2="15"></line>
      </svg>
    ),
    'Powerbuilding': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 6h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1"></path>
        <path d="M7 6H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"></path>
        <line x1="12" y1="6" x2="12" y2="18"></line>
        <line x1="7" y1="12" x2="17" y2="12"></line>
      </svg>
    ),
    'Bodybuilding': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
      </svg>
    ),
    'Calisthenics': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="5" r="3"></circle>
        <path d="M12 8v8"></path>
        <path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>
        <path d="M12 16v3"></path>
        <path d="M8 19h8"></path>
      </svg>
    ),
    'General Fitness': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="2" x2="12" y2="22"></line>
        <line x1="2" y1="12" x2="22" y2="12"></line>
      </svg>
    ),
    'Fat Loss': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
      </svg>
    ),
    'Minimal Equipment': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <path d="M21 15l-5-5L5 21"></path>
      </svg>
    ),
    'Busy Schedule': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    )
  };
  return icons[name] || icons['General Fitness'];
};

// Component to handle program detail page from shareable link
function ProgramPageWrapper({ 
  programs, 
  vaultItems, 
  onFetchProgram, 
  onRatingSubmit, 
  onSaveToVault,
  currentUser,
  isAuthenticated,
  navigate,
  onDeleteFromVault
}) {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProgram = async () => {
      setLoading(true);
      setError(null);

      try {
        // First, try to find program in current programs list or vault
        let foundProgram = programs.find(p => p.id === id);
        if (!foundProgram) {
          foundProgram = vaultItems.find(p => p.id === id);
        }

        if (foundProgram) {
          setProgram(foundProgram);
          setLoading(false);
          return;
        }

        // If not found, fetch from backend
        // For unauthenticated users or shared links, use public endpoint
        // For authenticated users, use the provided fetch function
        let fetchedProgram;
        if (isAuthenticated && onFetchProgram) {
          // Use authenticated fetch if user is logged in
          fetchedProgram = await onFetchProgram(id);
        } else {
          // Use public endpoint for unauthenticated users (shared links)
          const response = await fetch(buildApiUrl(`programs/${id}`));
          
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('Program not found');
            } else if (response.status === 403) {
              throw new Error('Access denied. This program is private.');
            }
            throw new Error('Failed to fetch program');
          }

          const programData = await response.json();
          
          // Map to UI shape
          fetchedProgram = {
            id: programData._id,
            title: programData.title,
            author: programData.authorName || 'System',
            rating: typeof programData.rating === 'number' ? programData.rating : 0,
            ratingCount: typeof programData.ratingCount === 'number' ? programData.ratingCount : 0,
            summary: programData.summary || programData.description || '',
            shortLabel: programData.shortLabel || '',
            durationHint: programData.durationHint || '',
            description: programData.description || '',
            tags: programData.tags || [],
            type: programData.type,
            programInfo: programData.programInfo,
          };
        }
        
        setProgram(fetchedProgram);
      } catch (err) {
        console.error('Failed to load program:', err);
        setError(err.message || 'Failed to load program');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProgram();
    }
  }, [id, programs, vaultItems, onFetchProgram, isAuthenticated]);

  if (loading) {
    return (
      <div className="container py-5">
        <p>Loading program...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h3>Error</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          <h3>Program Not Found</h3>
          <p>The program you're looking for doesn't exist.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Check if program is in vault
  const isFromVault = vaultItems.some(v => v.id === program.id);
  
  // If program has programInfo (even if empty), show detail view
  // If no programInfo, create empty structure so user can add exercises
  const programInfo = program.programInfo || { days: [] };
  
  // If no days exist, create a default day so user can add exercises
  if (!Array.isArray(programInfo.days) || programInfo.days.length === 0) {
    programInfo.days = [{ id: 1, exercises: [] }];
  }
  
  return (
    <ProgramDetail
      programData={programInfo}
      scheduleName={program.title}
      isEditable={false}
      programId={program.id}
      onModify={() => {
        // Navigate to builder with program data for modification
        if (onModifyProgram) {
          onModifyProgram(programInfo, program.id, program.title);
        } else {
          navigate('/');
        }
      }}
      onSave={onSaveToVault}
      onRatingSubmit={onRatingSubmit}
      isFromVault={isFromVault}
      onDelete={onDeleteFromVault}
    />
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeKey, setActiveKey] = useState('home');
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isProgramDetailOpen, setIsProgramDetailOpen] = useState(false);
  const [programDetailView, setProgramDetailView] = useState(null); // 'modal' or 'detail'
  const [theme, setTheme] = useState('dark');
  const [selectedBuiltInProgram, setSelectedBuiltInProgram] = useState(null);
  const [currentProgramId, setCurrentProgramId] = useState(null); // Track which program is currently being viewed
  const [currentView, setCurrentView] = useState(null); // 'login', 'signup', 'admin-login', 'admin-dashboard'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vaultItems, setVaultItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [programInfos, setProgramInfos] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize theme from HTML or localStorage
  useEffect(() => {
    const htmlTheme = document.documentElement.getAttribute('data-theme');
    const savedTheme = localStorage.getItem('theme') || htmlTheme || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Handle route changes to update currentPage state
  useEffect(() => {
    if (location.pathname === '/all-programs') {
      setCurrentPage('all-programs');
      setActiveKey('all-programs');
    } else if (location.pathname === '/' || location.pathname === '') {
      // Only reset to home if currentPage is not already set to account or vault
      // This allows navigation to account/vault from other pages without resetting
      if (currentPage !== 'account' && currentPage !== 'vault' && currentPage !== 'jadwal-builder') {
        setCurrentPage('home');
        setActiveKey('home');
      }
    }
  }, [location.pathname]);

  // Helper function to fetch current user from token
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(buildApiUrl('api/auth/me'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.user) {
          // Fetch full user data including savedPrograms
          const userRes = await fetch(buildApiUrl('getUsers'));
          if (userRes.ok) {
            const userData = await userRes.json();
            const fullUser = userData.find(u => String(u._id) === String(data.data.user.id));
            return fullUser || null;
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch current user:', err);
    }
    return null;
  };

  // Helper function to build vault items from user and program data
  const buildVaultItems = (userData, programData) => {
    if (!userData || !Array.isArray(userData.savedPrograms)) {
      return [];
    }

    const programsById = new Map(
      (programData || []).map((p) => [String(p._id), p])
    );

    return userData.savedPrograms
      .map((sp) => {
        const prog = programsById.get(String(sp.programId));
        if (!prog) return null;
        return {
          id: String(sp.programId), // ✅ Use actual program ID, not savedProgram subdoc ID
          title: prog.title,
          author: prog.authorName || userData.username,
          rating: typeof prog.rating === 'number' ? prog.rating : 0,
          ratingCount: typeof prog.ratingCount === 'number' ? prog.ratingCount : 0,
          summary: prog.summary || prog.description || '',
          shortLabel: prog.shortLabel || '',
          durationHint: prog.durationHint || '',
          description: prog.description || '',
          tags: prog.tags || [],
          type: prog.type,
          programInfo: prog.programInfo, // ✅ Include programInfo for routing logic
        };
      })
      .filter(Boolean);
  };

  // Helper function to get fetch headers with optional auth token
  const getFetchHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // Function to refresh vault items after saving
  const refreshVaultItems = async () => {
    if (!currentUser?._id) return;

    try {
      const headers = getFetchHeaders();
      const [programRes, userRes] = await Promise.all([
        fetch(buildApiUrl('getPrograms'), { headers }),
        fetch(buildApiUrl('getUsers')),
      ]);

      if (programRes.ok && userRes.ok) {
        const [programData, userData] = await Promise.all([
          programRes.json(),
          userRes.json(),
        ]);

        // Update programs state
        setPrograms(
          (programData || []).map((p) => ({
            id: p._id,
            title: p.title,
            author: p.authorName || 'System',
            rating: typeof p.rating === 'number' ? p.rating : 0,
            ratingCount: typeof p.ratingCount === 'number' ? p.ratingCount : 0, // ✅ Add ratingCount
            summary: p.summary || p.description || '',
            shortLabel: p.shortLabel || '',
            durationHint: p.durationHint || '',
            description: p.description || '',
            tags: p.tags || [],
            type: p.type,
            programInfo: p.programInfo,
          }))
        );

        // Find current user and refresh vault
        const updatedUser = (userData || []).find(u => String(u._id) === String(currentUser._id));
        if (updatedUser) {
          setCurrentUser(updatedUser);
          const newVaultItems = buildVaultItems(updatedUser, programData);
          setVaultItems(newVaultItems);
        }
      }
    } catch (err) {
      console.error('Failed to refresh vault items:', err);
    }
  };

  // Check if user is already authenticated on mount (for page refresh)
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(buildApiUrl('api/auth/me'), {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data?.user) {
              const user = data.data.user;
              setIsAuthenticated(true);
              // Check if user is admin
              if (user.role === 'admin') {
                setIsAdmin(true);
              } else {
                // Regular user: fetch their data and vault
                await fetchUserDataAndVault(user.id);
              }
            }
          }
        } catch (err) {
          console.error('Failed to check auth:', err);
        }
      }
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch data from backend APIs - ONLY public programs and categories
  // Do NOT fetch user data or vault until after login
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only fetch public programs and categories - no user data
        const [programRes, categoryRes] = await Promise.all([
          fetch(buildApiUrl('getPrograms')), // No auth headers - only public programs
          fetch(buildApiUrl('getCategories')),
        ]);

        if (!programRes.ok || !categoryRes.ok) {
          throw new Error('Failed to load data from server');
        }

        const [programData, categoryData] = await Promise.all([
          programRes.json(),
          categoryRes.json(),
        ]);

        // Map programs to UI shape
        setPrograms(
          (programData || []).map((p) => ({
            id: p._id,
            title: p.title,
            author: p.authorName || 'System',
            rating: typeof p.rating === 'number' ? p.rating : 0,
            ratingCount: typeof p.ratingCount === 'number' ? p.ratingCount : 0,
            summary: p.summary || p.description || '',
            shortLabel: p.shortLabel || '',
            durationHint: p.durationHint || '',
            description: p.description || '',
            tags: p.tags || [],
            type: p.type,
            programInfo: p.programInfo,
          }))
        );

        // Map categories to UI shape
        setCategories(
          (categoryData || []).map((c) => ({
            id: c._id,
            label: c.label,
            slug: c.slug,
            type: c.type,
          }))
        );

        // Do NOT fetch user data or vault here - only after login
        // Only clear if not authenticated (will be set by checkAuth if token exists)
        if (!isAuthenticated) {
          setCurrentUser(null);
          setVaultItems([]);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleNav = (key) => {
    setActiveKey(key);
    console.log('Navigate to:', key);
    if (key === 'home') {
      setCurrentPage('home');
    } else if (key === 'all-programs') {
      navigate('/all-programs');
      setCurrentPage('all-programs');
    } else if (key === 'create') {
      // Go directly to jadwal-builder for creating custom programs
      navigate('/');
      setSelectedBuiltInProgram(null);
      setCurrentProgramId(null);
      setCurrentPage('jadwal-builder');
    } else {
      setCurrentPage(key);
    }
    // Close program detail view when navigating
    setIsProgramDetailOpen(false);
    setProgramDetailView(null);
  };

  const handleOpenProgram = (id) => {
    console.log('Open program:', id);

    // Reset state so switching programs always works
    setIsProgramDetailOpen(false);
    setSelectedProgram(null);
    setSelectedBuiltInProgram(null);
    setProgramDetailView(null);
    setCurrentProgramId(null);

    // Check both programs array and vaultItems for the program
    let program = programs.find(p => p.id === id);
    
    // If not found in programs, check vaultItems (for vault clicks)
    if (!program) {
      program = vaultItems.find(p => p.id === id);
    }

    if (program) {
      // Navigate to program detail page context so switching works even outside the vault page
      setCurrentPage('program-detail');

      // If program has programInfo (even empty), go to detail view
      if (program.programInfo) {
        setSelectedBuiltInProgram(program.programInfo);
        setCurrentProgramId(program.id); // Track which program we're viewing
        setProgramDetailView('detail');
        return;
      }

      // Otherwise, show modal first (e.g., programs without programInfo yet)
      setSelectedProgram(program);
      setIsProgramDetailOpen(true);
      setProgramDetailView('modal');
    }
  };

  // Function to fetch a single program by ID from backend
  const fetchProgramById = async (programId) => {
    try {
      const headers = getFetchHeaders();
      const response = await fetch(buildApiUrl(`programs/${programId}`), { headers });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Program not found');
        } else if (response.status === 403) {
          throw new Error('Access denied. This program is private.');
        }
        throw new Error('Failed to fetch program');
      }

      const programData = await response.json();
      
      // Map to UI shape
      return {
        id: programData._id,
        title: programData.title,
        author: programData.authorName || 'System',
        rating: typeof programData.rating === 'number' ? programData.rating : 0,
        ratingCount: typeof programData.ratingCount === 'number' ? programData.ratingCount : 0,
        summary: programData.summary || programData.description || '',
        shortLabel: programData.shortLabel || '',
        durationHint: programData.durationHint || '',
        description: programData.description || '',
        tags: programData.tags || [],
        type: programData.type,
        programInfo: programData.programInfo,
      };
    } catch (err) {
      console.error('Failed to fetch program:', err);
      throw err;
    }
  };

  const handleCloseProgramModal = () => {
    setIsProgramDetailOpen(false);
    setSelectedProgram(null);
    setProgramDetailView(null);
    setCurrentProgramId(null);
  };

  const handleOpenProgramDetail = (programKey) => {
    console.log('Opening program detail page for:', programKey);
    setIsProgramDetailOpen(false);

    // programKey can be either a program ID (string) or title/shortLabel
    // First try to find by ID
    let program = programs.find(p => p.id === programKey);
    
    // If not found, try to find by title or shortLabel
    if (!program) {
      program = programs.find(p => p.title === programKey || p.shortLabel === programKey);
    }

    // If still not found, check vaultItems
    if (!program) {
      program = vaultItems.find(p => p.id === programKey || p.title === programKey);
    }

    if (program && program.programInfo && Array.isArray(program.programInfo.days)) {
      // Program has programInfo with days - route to detail page
      setSelectedBuiltInProgram(program.programInfo);
      setCurrentProgramId(program.id); // Track which program we're viewing
      setCurrentPage('program-detail');
      return;
    }

    // For programs without programInfo or with empty days, go to builder
    if (program) {
      // If it's a system program, try to get template
      const template = getBuiltInProgramTemplate(program.title);
      if (template) {
        setSelectedBuiltInProgram(template);
        setCurrentProgramId(program.id); // Track which program we're viewing
        setCurrentPage('program-detail');
        return;
      }
      
      // Otherwise, go to builder with empty program (for community programs without programInfo)
      setSelectedBuiltInProgram(null);
      setCurrentPage('jadwal-builder');
      return;
    }

    // If program not found at all, go to builder to create new
    setSelectedBuiltInProgram(null);
    setCurrentPage('jadwal-builder');
  };

  const handleSearch = (query) => {
    console.log('Search:', query);
  };

  const handleCategoryClick = (id) => {
    console.log('Category clicked:', id);
  };

  const handleRatingSubmit = async (programId, ratingValue) => {
    console.log('Rating submitted:', ratingValue, 'for program:', programId);
    
    try {
      // Find the program to get its title for the alert
      const program = programs.find(p => p.id === programId) || vaultItems.find(p => p.id === programId);
      
      if (!program) {
        throw new Error('Program not found');
      }

      // Get auth token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to rate programs');
      }

      // Send rating to backend (backend will handle calculation)
      const response = await fetch(buildApiUrl(`programs/${programId}/rating`), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: ratingValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      // Get updated program data from backend
      const updatedProgram = await response.json();

      // Update local state with backend response
      const updatedPrograms = programs.map(p => 
        p.id === programId 
          ? { 
              ...p, 
              rating: typeof updatedProgram.rating === 'number' ? updatedProgram.rating : 0,
              ratingCount: typeof updatedProgram.ratingCount === 'number' ? updatedProgram.ratingCount : 0
            }
          : p
      );
      setPrograms(updatedPrograms);

      // Update vault items if this program is in vault
      const updatedVaultItems = vaultItems.map(p =>
        p.id === programId
          ? { 
              ...p, 
              rating: typeof updatedProgram.rating === 'number' ? updatedProgram.rating : 0,
              ratingCount: typeof updatedProgram.ratingCount === 'number' ? updatedProgram.ratingCount : 0
            }
          : p
      );
      setVaultItems(updatedVaultItems);

      alert(`Thank you! You rated "${program.title}" ${ratingValue} out of 5 stars.`);
    } catch (err) {
      console.error('Failed to submit rating:', err);
      alert(`Failed to submit rating. Please try again. Error: ${err.message}`);
    }
  };

  const categoriesWithIcons = categories.map(cat => ({
    ...cat,
    icon: <CategoryIcon name={cat.label} />
  }));

  const getBuiltInProgramTemplate = (programKey) => {
    if (!programKey || !Array.isArray(programs)) return null;
    const match = programs.find((p) => p.title === programKey || p.shortLabel === programKey);
    if (match && match.programInfo && Array.isArray(match.programInfo.days)) {
      return match.programInfo;
    }
    return null;
  };

  const handleSelectBuiltInProgram = (program) => {
    const template = getBuiltInProgramTemplate(program.title);
    if (template) {
      setSelectedBuiltInProgram(template);
      setCurrentProgramId(program.id); // Track which program we're viewing
      setCurrentPage('program-detail');
    }
  };

  const handleCreateCustomJadwal = (selectedCategoryIds) => {
    console.log('Creating custom Jadwal with categories:', selectedCategoryIds);
    setSelectedBuiltInProgram(null);
    setCurrentPage('jadwal-builder');
  };

  const handleModifyProgram = (programData, programId, programTitle) => {
    // Set the program data to be loaded in JadwalBuilder
    setSelectedBuiltInProgram(programData);
    setCurrentProgramId(programId);
    navigate('/');
    setCurrentPage('jadwal-builder');
  };

  const handleSaveToVault = async (schedule) => {
    console.log('Saving to vault:', schedule);

    try {
      if (!currentUser?._id) {
        throw new Error('You must be logged in to save programs');
      }

      let programIdToSave = schedule?.programId;

      // If the program was modified, create a new copy with the modifications
      if (schedule?.isModified && schedule?.days) {
        // Fetch the original program to get its metadata
        const originalProgram = programs.find(p => p.id === schedule.programId) || 
                                vaultItems.find(p => p.id === schedule.programId);
        
        if (!originalProgram) {
          throw new Error('Original program not found');
        }

        // Create a new program with the modified data
        const programRes = await fetch(buildApiUrl('programs'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: schedule.name || originalProgram.title,
            shortLabel: originalProgram.shortLabel || '',
            summary: originalProgram.summary || '',
            description: originalProgram.description || '',
            tags: originalProgram.tags || [],
            durationHint: originalProgram.durationHint || '',
            type: 'community', // Modified programs are always community type
            isPublic: false, // Modified programs are private by default
            authorId: currentUser._id,
            authorName: currentUser.username || 'Guest',
            programInfo: { days: schedule.days || [] },
          }),
        });

        if (!programRes.ok) {
          const errorData = await programRes.json().catch(() => ({}));
          throw new Error(errorData.message || errorData.error || 'Failed to create modified program');
        }

        const createdProgram = await programRes.json();
        programIdToSave = createdProgram._id;
        console.log('Created modified program copy:', programIdToSave);
      }

      // Save the program (original or modified copy) to vault
      if (programIdToSave) {
        const response = await fetch(buildApiUrl(`api/users/${currentUser._id}/saved-programs`), {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            programId: programIdToSave,
            status: 'active',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        alert(`Schedule "${schedule.name}" saved to vault!`);
        await refreshVaultItems();
      } else {
        throw new Error('No program ID to save');
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to save schedule. Please try again. Error: ${err.message}`);
    }
  };

  const handleDeleteFromVault = async (programId) => {
    if (!currentUser?._id || !programId) {
      return;
    }

    try {
      // Find the savedProgram entry for this program
      const userRes = await fetch(buildApiUrl('getUsers'));
      if (!userRes.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userRes.json();
      const fullUser = userData.find(u => String(u._id) === String(currentUser._id));
      
      if (!fullUser || !Array.isArray(fullUser.savedPrograms)) {
        throw new Error('User data not found');
      }

      const savedProgram = fullUser.savedPrograms.find(
        sp => String(sp.programId) === String(programId)
      );

      if (!savedProgram) {
        alert('Program not found in your vault');
        return;
      }

      // Delete the saved program entry
      const deleteRes = await fetch(
        buildApiUrl(`api/users/${currentUser._id}/saved-programs/${savedProgram._id}`),
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!deleteRes.ok) {
        const errorData = await deleteRes.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete program from vault');
      }

      alert('Program deleted from vault successfully!');
      
      // Refresh vault items and navigate to vault page
      await refreshVaultItems();
      navigate('/');
      setCurrentPage('vault');
    } catch (err) {
      console.error('Failed to delete program from vault:', err);
      alert(`Failed to delete program. Please try again. Error: ${err.message}`);
    }
  };

  // Function to fetch user data and vault (called only after login)
  const fetchUserDataAndVault = async (userId) => {
    try {
      const userRes = await fetch(buildApiUrl('getUsers'));
      if (userRes.ok) {
        const userData = await userRes.json();
        const fullUser = userData.find(u => String(u._id) === String(userId));
        if (fullUser) {
          setCurrentUser(fullUser);
          // Fetch programs with auth headers to get user's private programs
          const headers = getFetchHeaders();
          const programRes = await fetch(buildApiUrl('getPrograms'), { headers });
          if (programRes.ok) {
            const programData = await programRes.json();
            const vaultItemsData = buildVaultItems(fullUser, programData);
            setVaultItems(vaultItemsData);
            // Update programs state with all programs (public + user's private)
            setPrograms(
              (programData || []).map((p) => ({
                id: p._id,
                title: p.title,
                author: p.authorName || 'System',
                rating: typeof p.rating === 'number' ? p.rating : 0,
                summary: p.summary || p.description || '',
                shortLabel: p.shortLabel || '',
                durationHint: p.durationHint || '',
                description: p.description || '',
                tags: p.tags || [],
                type: p.type,
                programInfo: p.programInfo,
              }))
            );
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  // Handle login/signup success - check if admin and redirect accordingly
  const handleAuthSuccess = async (user, token, isAdminLogin = false) => {
    setIsAuthenticated(true);
    
    // Check if user is admin
    const userRole = user.role || (isAdminLogin ? 'admin' : 'user');
    const isUserAdmin = userRole === 'admin';
    
    if (isUserAdmin) {
      // Admin users go to admin dashboard
      setIsAdmin(true);
      navigate('/adminDashboard');
    } else {
      // Regular users: fetch their data and vault, then go to home
      await fetchUserDataAndVault(user.id);
      navigate('/');
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      // Optionally call backend logout endpoint
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await fetch(buildApiUrl('api/auth/logout'), {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } catch (err) {
          // Ignore errors from logout endpoint - logout should succeed even if backend call fails
          console.log('Logout endpoint call failed (non-critical):', err);
        }
      }
    } catch (err) {
      console.log('Logout error (non-critical):', err);
    } finally {
      // Always clear local state regardless of backend response
      // Clear authentication token
      localStorage.removeItem('token');
      
      // Reset authentication state
      setIsAuthenticated(false);
      setIsAdmin(false);
      setCurrentUser(null);
      setVaultItems([]);
      
      // Navigate to home page
      navigate('/');
      setCurrentView(null);
    }
  };

  // Check if we're on an auth page (should hide sidebar)
  const isAuthPage = location.pathname === '/registration' || location.pathname === '/adminDashboard';

  // Filter popular programs: only show programs with rating >= 4.5
  const popularPrograms = programs.filter((p) => (p.rating || 0) >= 4.5);
  const builtInPrograms = programs.filter((p) => p.type === 'system');
  const creationCategories = categories;

  const handleViewAllPrograms = () => {
    navigate('/all-programs');
    setCurrentPage('all-programs');
  };

  return (
    <div className="app" style={{ display: 'flex', minHeight: '100vh' }}>
      {!isAuthPage && (
        <SideBar
          activeKey={activeKey}
          vaultItems={vaultItems}
          defaultVaultOpen={true}
          onNav={handleNav}
          onOpenProgram={handleOpenProgram}
        />
      )}
      <main style={{ flex: 1, padding: '0', width: isAuthPage ? '100%' : 'auto' }}>
        {loading && (
          <div className="container py-5">
            <p>Loading programs...</p>
          </div>
        )}
        {error && !loading && (
          <div className="container py-5">
            <p>{error}</p>
          </div>
        )}
        {!loading && !error && (
          <Routes>
            {/* Home page route - shows all public programs */}
            <Route 
              path="/" 
              element={
                <>
                  {currentPage === 'home' && (
                    <GuestHome
                      popularPrograms={popularPrograms}
                      builtInPrograms={builtInPrograms}
                      onSearch={handleSearch}
                      onOpenProgram={handleOpenProgram}
                      onThemeToggle={handleThemeToggle}
                      currentTheme={theme}
                      onLoginClick={() => navigate('/registration?mode=login')}
                      onSignUpClick={() => navigate('/registration?mode=signup')}
                      isAuthenticated={isAuthenticated}
                      currentUser={currentUser}
                      onSignOut={handleLogout}
                      onViewAllPrograms={handleViewAllPrograms}
                    />
                  )}
                  {currentPage === 'all-programs' && (
                    <AllPrograms
                      programs={programs}
                      onOpenProgram={handleOpenProgram}
                      onThemeToggle={handleThemeToggle}
                      currentTheme={theme}
                      onLoginClick={() => navigate('/registration?mode=login')}
                      onSignUpClick={() => navigate('/registration?mode=signup')}
                      isAuthenticated={isAuthenticated}
                      currentUser={currentUser}
                      onSignOut={handleLogout}
                    />
                  )}
                    {currentPage === 'account' && (
                      <Profile 
                        currentUser={currentUser} 
                        onUpdateUser={(updatedUser) => {
                          setCurrentUser(updatedUser);
                          refreshVaultItems();
                        }}
                      />
                    )}
                    {currentPage === 'jadwal-builder' && (
                      <JadwalBuilder
                        builtInProgram={selectedBuiltInProgram}
                        isCustom={!selectedBuiltInProgram}
                        initialCategories={creationCategories}
                        initialScheduleName={
                          currentProgramId
                            ? (programs.find(p => p.id === currentProgramId)?.title || 
                               vaultItems.find(p => p.id === currentProgramId)?.title || 
                               '')
                            : (selectedBuiltInProgram?.title || '')
                        }
                        onSave={async (schedule) => {
                          console.log('Saving schedule to vault:', schedule);
                          try {
                            const programRes = await fetch(buildApiUrl('programs'), {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                title: schedule.name,
                                shortLabel: schedule.shortLabel || '',
                                summary: schedule.summary || '',
                                description: schedule.description || '',
                                tags: schedule.tags || [],
                                durationHint: schedule.durationHint || '',
                                type: 'community',
                                isPublic: schedule.isPublic !== undefined ? schedule.isPublic : true,
                                authorId: currentUser?._id || null,
                                authorName: currentUser?.username || 'Guest',
                                programInfo: { days: schedule.days || [] },
                              }),
                            });
                            if (!programRes.ok) {
                              const errorData = await programRes.json().catch(() => ({}));
                              throw new Error(errorData.message || errorData.error || 'Failed to create program');
                            }
                            const createdProgram = await programRes.json();
                            if (currentUser?._id) {
                              const savedRes = await fetch(
                                buildApiUrl(`api/users/${currentUser._id}/saved-programs`),
                                {
                                  method: 'POST',
                                  headers: { 
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                                  },
                                  body: JSON.stringify({
                                    programId: createdProgram._id,
                                    status: 'active',
                                  }),
                                }
                              );
                              if (!savedRes.ok) {
                                throw new Error('Failed to add program to user vault');
                              }
                            }
                            alert(`Schedule "${schedule.name}" saved to vault!`);
                            await refreshVaultItems();
                          } catch (err) {
                            console.error(err);
                            alert('Failed to save schedule. Please try again.');
                          }
                        }}
                      />
                    )}
                    {currentPage === 'program-detail' && selectedBuiltInProgram && (
                      <ProgramDetail
                        programData={selectedBuiltInProgram}
                        scheduleName={
                          currentProgramId 
                            ? (programs.find(p => p.id === currentProgramId)?.title || 
                               vaultItems.find(p => p.id === currentProgramId)?.title || 
                               '')
                            : ''
                        }
                        isEditable={false}
                        programId={currentProgramId}
                        onModify={() => {
                          // Get the program data from programs or vaultItems
                          const programToModify = programs.find(p => p.id === currentProgramId) || 
                                                   vaultItems.find(p => p.id === currentProgramId);
                          if (programToModify && programToModify.programInfo) {
                            handleModifyProgram(programToModify.programInfo, currentProgramId, programToModify.title);
                          } else {
                            // Use selectedBuiltInProgram as fallback
                            handleModifyProgram(selectedBuiltInProgram, currentProgramId, 
                              programs.find(p => p.id === currentProgramId)?.title || 
                              vaultItems.find(p => p.id === currentProgramId)?.title || '');
                          }
                        }}
                        onSave={handleSaveToVault}
                        onRatingSubmit={handleRatingSubmit}
                        isFromVault={vaultItems.some(v => v.id === currentProgramId)}
                        onDelete={handleDeleteFromVault}
                      />
                    )}
                    {currentPage === 'vault' && (
                      <Vault
                        vaultItems={vaultItems}
                        onOpenProgram={handleOpenProgram}
                      />
                    )}
                  </>
                } 
              />
              
              {/* Registration page route - handles Login, SignUp, and AdminLogin */}
              <Route 
                path="/registration" 
                element={
                  (() => {
                    const mode = searchParams.get('mode') || 'signup';
                    
                    if (mode === 'login') {
                      return (
                        <Login
                          onBack={() => navigate('/')}
                          onLogin={async (user, token) => {
                            await handleAuthSuccess(user, token, false);
                          }}
                          onOpenSignUp={() => {
                            setSearchParams({ mode: 'signup' });
                          }}
                          onOpenAdminLogin={() => {
                            setSearchParams({ mode: 'admin' });
                          }}
                        />
                      );
                    } else if (mode === 'admin') {
                      return (
                        <AdminLogin
                          onBack={() => navigate('/')}
                          onLogin={async (admin, token) => {
                            await handleAuthSuccess(admin, token, true);
                          }}
                          onOpenUserLogin={() => {
                            setSearchParams({ mode: 'login' });
                          }}
                        />
                      );
                    } else {
                      // Default to signup
                      return (
                        <SignUp
                          onBack={() => navigate('/')}
                          onSignUp={async (user, token) => {
                            await handleAuthSuccess(user, token, false);
                          }}
                          onOpenLogin={() => {
                            setSearchParams({ mode: 'login' });
                          }}
                          onOpenAdminLogin={() => {
                            setSearchParams({ mode: 'admin' });
                          }}
                        />
                      );
                    }
                  })()
                } 
              />
              
              {/* Program detail route - shareable link */}
              <Route 
                path="/program/:id" 
                element={
                  <ProgramPageWrapper
                    programs={programs}
                    vaultItems={vaultItems}
                    onFetchProgram={fetchProgramById}
                    onRatingSubmit={handleRatingSubmit}
                    onSaveToVault={handleSaveToVault}
                    currentUser={currentUser}
                    isAuthenticated={isAuthenticated}
                    navigate={navigate}
                    onDeleteFromVault={handleDeleteFromVault}
                    onModifyProgram={handleModifyProgram}
                  />
                } 
              />
              
              {/* All Programs route */}
              <Route 
                path="/all-programs" 
                element={
                  <AllPrograms
                    programs={programs}
                    onOpenProgram={handleOpenProgram}
                    onThemeToggle={handleThemeToggle}
                    currentTheme={theme}
                    onLoginClick={() => navigate('/registration?mode=login')}
                    onSignUpClick={() => navigate('/registration?mode=signup')}
                    isAuthenticated={isAuthenticated}
                    currentUser={currentUser}
                    onSignOut={handleLogout}
                  />
                } 
              />
              
              {/* Admin Dashboard route */}
              <Route 
                path="/adminDashboard" 
                element={
                  isAdmin && isAuthenticated ? (
                    <AdminDashboard
                      onSignOut={() => {
                        setIsAdmin(false);
                        setIsAuthenticated(false);
                        setCurrentUser(null);
                        setVaultItems([]);
                        localStorage.removeItem('token');
                        navigate('/');
                      }}
                    />
                  ) : (
                    <AdminLogin
                      onBack={() => navigate('/')}
                      onLogin={async (admin, token) => {
                        await handleAuthSuccess(admin, token, true);
                      }}
                      onOpenUserLogin={() => navigate('/registration?mode=login')}
                    />
                  )
                } 
              />
            </Routes>
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

