import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useSearchParams, useParams } from 'react-router-dom';
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


// Backend URL / port configuration
// Define in frontend/.env, e.g.:
// VITE_BACKEND_PORT=7000
// or VITE_API_BASE_URL=http://localhost:7000
const BACKEND_PORT = 8000;
const API_BASE_URL = `http://localhost:${BACKEND_PORT}`;

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
  navigate
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
        const fetchedProgram = await onFetchProgram(id);
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
  }, [id, programs, vaultItems, onFetchProgram]);

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

  // If program has programInfo, show detail view
  if (program.programInfo && Array.isArray(program.programInfo.days) && program.programInfo.days.length > 0) {
    return (
      <ProgramDetail
        programData={program.programInfo}
        scheduleName={program.title}
        isEditable={false}
        programId={program.id}
        onModify={() => {
          // Navigate to builder if user wants to modify
          navigate('/');
        }}
        onSave={onSaveToVault}
        onRatingSubmit={onRatingSubmit}
      />
    );
  }

  // If program doesn't have programInfo, show modal-like view or redirect
  return (
    <div className="container py-5">
      <div className="alert alert-info">
        <h3>{program.title}</h3>
        <p>By {program.author}</p>
        <p>{program.summary || program.description || 'No description available.'}</p>
        <p className="text-muted">This program doesn't have workout details yet.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Go to Home
        </button>
      </div>
    </div>
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

  // Helper function to fetch current user from token
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.user) {
          // Fetch full user data including savedPrograms
          const userRes = await fetch(`${API_BASE_URL}/getUsers`);
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
        fetch(`${API_BASE_URL}/getPrograms`, { headers }),
        fetch(`${API_BASE_URL}/getUsers`),
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
          const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
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
          fetch(`${API_BASE_URL}/getPrograms`), // No auth headers - only public programs
          fetch(`${API_BASE_URL}/getCategories`),
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
    
    // Close program detail view when navigating
    setIsProgramDetailOpen(false);
    setProgramDetailView(null);
    
    // Use React Router navigation
    if (key === 'home') {
      navigate('/');
      setCurrentPage('home');
    } else {
      // For other pages, navigate to home and set the page state
      // (since account, create, vault are shown within the home route)
      navigate('/');
      setCurrentPage(key);
    }
  };

  // Function to fetch a single program by ID from backend
  const fetchProgramById = async (programId) => {
    try {
      const headers = getFetchHeaders();
      const response = await fetch(`${API_BASE_URL}/programs/${programId}`, { headers });
      
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

  const handleOpenProgram = (id) => {
    console.log('Open program:', id);
    // Navigate to shareable program link
    navigate(`/program/${id}`);
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

    // If we found a program with an ID, navigate to shareable link
    if (program && program.id) {
      navigate(`/program/${program.id}`);
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
      // Find the program to get its current rating data
      const program = programs.find(p => p.id === programId) || vaultItems.find(p => p.id === programId);
      
      if (!program) {
        throw new Error('Program not found');
      }

      // Calculate new average rating
      const currentRating = program.rating || 0;
      const currentCount = program.ratingCount || 0;
      const totalRating = currentRating * currentCount + ratingValue;
      const newCount = currentCount + 1;
      const newRating = totalRating / newCount;

      // Update rating on backend
      const response = await fetch(`${API_BASE_URL}/programs/${programId}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: newRating,
          ratingCount: newCount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      // Update local state
      const updatedPrograms = programs.map(p => 
        p.id === programId 
          ? { ...p, rating: newRating, ratingCount: newCount }
          : p
      );
      setPrograms(updatedPrograms);

      // Update vault items if this program is in vault
      const updatedVaultItems = vaultItems.map(p =>
        p.id === programId
          ? { ...p, rating: newRating, ratingCount: newCount }
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

  const handleSaveToVault = async (schedule) => {
    console.log('Saving to vault:', schedule);

    try {
      if (currentUser?._id && schedule?.programId) {
        // 1. Await the fetch and store the response
        const response = await fetch(`${API_BASE_URL}/api/users/${currentUser._id}/saved-programs`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            programId: schedule.programId,
            status: 'active',
          }),
        });

        // 2. CHECK THE RESPONSE STATUS
        if (!response.ok) {
          // If status is 4xx or 5xx, throw an error to go to the catch block
          const errorData = await response.json(); // Attempt to read error message from body
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        // 3. ONLY run success alert if response.ok is true
        alert(`Schedule "${schedule.name}" saved to vault!`);
        
        // 4. Refresh vault items to show the newly saved program
        await refreshVaultItems();
      }
    } catch (err) {
      console.error(err);
      // Use the error message from the response if available
      alert(`Failed to save schedule. Please try again. Error: ${err.message}`);
    }
  };

  // Function to fetch user data and vault (called only after login)
  const fetchUserDataAndVault = async (userId) => {
    try {
      const userRes = await fetch(`${API_BASE_URL}/getUsers`);
      if (userRes.ok) {
        const userData = await userRes.json();
        const fullUser = userData.find(u => String(u._id) === String(userId));
        if (fullUser) {
          setCurrentUser(fullUser);
          // Fetch programs with auth headers to get user's private programs
          const headers = getFetchHeaders();
          const programRes = await fetch(`${API_BASE_URL}/getPrograms`, { headers });
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
          await fetch(`${API_BASE_URL}/api/auth/logout`, {
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

  const builtInPrograms = programs.filter((p) => p.type === 'system');
  const creationCategories = categories;

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
                      popularPrograms={programs}
                      categories={categoriesWithIcons}
                      onSearch={handleSearch}
                      onOpenProgram={handleOpenProgram}
                      onCategoryClick={handleCategoryClick}
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
                        initialCategories={creationCategories}
                        initialScheduleName={
                          currentProgramId 
                            ? (programs.find(p => p.id === currentProgramId)?.title || 
                               vaultItems.find(p => p.id === currentProgramId)?.title || 
                               '')
                            : ''
                        }
                        onSave={async (schedule) => {
                          console.log('Saving schedule to vault:', schedule);
                          try {
                            const programRes = await fetch(`${API_BASE_URL}/programs`, {
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
                                `${API_BASE_URL}/api/users/${currentUser._id}/saved-programs`,
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
                          setCurrentPage('jadwal-builder');
                        }}
                        onSave={handleSaveToVault}
                        onRatingSubmit={handleRatingSubmit}
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

