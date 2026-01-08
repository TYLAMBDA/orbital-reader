import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Library, Settings, Search, User, Home } from 'lucide-react';
import Orb from './components/Orb';
import OrbitMenu from './components/OrbitMenu';
import LibraryView from './views/LibraryView';
import ReaderView from './views/ReaderView';
import SettingsView from './views/SettingsView';
import { DockPosition, MenuItem, Book, Language } from './types';

const App: React.FC = () => {
  // App State
  const [dockPosition, setDockPosition] = useState<DockPosition>('center');
  const [preferredDock, setPreferredDock] = useState<DockPosition>('left');
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  
  // New Feature State
  const [autoHide, setAutoHide] = useState(false);
  const [edgeNav, setEdgeNav] = useState(false); // Now "Omni-Wake"
  const [language, setLanguage] = useState<Language>('en');

  // Effect to enforce dependency: Edge Nav requires Auto Hide
  useEffect(() => {
    if (!autoHide && edgeNav) {
        setEdgeNav(false);
    }
  }, [autoHide, edgeNav]);

  // Debounced Hover Logic for seamless transition between Sensor and Orb
  const [isInteracting, setIsInteracting] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInteractionStart = () => {
    if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
    }
    setIsInteracting(true);
  };

  const handleInteractionEnd = () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = setTimeout(() => {
          setIsInteracting(false);
      }, 300); // 300ms grace period to move from sensor to orb
  };

  // Translations for Menu Items
  const menuTranslations: Record<Language, Record<string, string>> = {
      en: { library: 'Library', reader: 'Continue', search: 'Explore', profile: 'Profile', settings: 'Settings' },
      zh: { library: '书库', reader: '继续阅读', search: '探索', profile: '个人中心', settings: '设置' }
  };

  const getMenuItems = (lang: Language): MenuItem[] => [
    { id: 'library', label: menuTranslations[lang].library, icon: Library, targetDock: 'left', color: '#3b82f6' },
    { id: 'reader', label: menuTranslations[lang].reader, icon: BookOpen, targetDock: 'top', color: '#10b981' },
    { id: 'search', label: menuTranslations[lang].search, icon: Search, targetDock: 'left', color: '#f59e0b' },
    { id: 'profile', label: menuTranslations[lang].profile, icon: User, targetDock: 'top', color: '#8b5cf6' },
    { id: 'settings', label: menuTranslations[lang].settings, icon: Settings, targetDock: 'left', color: '#64748b' },
  ];

  const handleOrbClick = () => {
    setDockPosition('center');
    setActiveItemId(null);
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (activeItemId === item.id) return;
    
    // Only enforce preferred dock if Omni-Wake (edgeNav) is NOT active.
    // If Omni-Wake is active, we keep the dock at its current location (where the user interacted).
    if (!edgeNav) {
        setDockPosition(preferredDock);
    }
    
    setActiveItemId(item.id);
  };

  const handleBookSelect = (book: Book) => {
      setCurrentBook(book);
      setDockPosition(preferredDock);
      setActiveItemId('reader');
  };

  const handleDockPreferenceChange = (newDock: DockPosition) => {
      setPreferredDock(newDock);
      if (dockPosition !== 'center') {
          setDockPosition(newDock);
          
          // Trigger temporary visibility if auto-hide is on
          // This ensures the user sees the orb animate to the new position
          if (autoHide) {
              handleInteractionStart();
              if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = setTimeout(() => {
                  setIsInteracting(false);
              }, 1000); // Keep visible for 1s to show the transition
          }
      }
  };

  // Handler for Omni-Wake Toggle
  // Enforces requirement: "When turning off Omni-Wake, nav bar defaults to left"
  const handleEdgeNavToggle = (isEnabled: boolean) => {
    setEdgeNav(isEnabled);
    if (!isEnabled) {
        setPreferredDock('left');
        // If we are currently docked (not in center), snap to left immediately
        if (dockPosition !== 'center') {
            setDockPosition('left');
        }
    }
  };

  // Logic to determine if Orb is visible
  // Visible if: Center mode OR AutoHide is Off OR User is interacting (hovering sensor or orb)
  const isOrbVisible = dockPosition === 'center' || !autoHide || isInteracting;

  // Edge Sensor Handlers
  const handleEdgeEnter = (edge: DockPosition) => {
      if (dockPosition === 'center') return; 

      // If Edge Nav is on, we switch position.
      if (edgeNav) {
          setDockPosition(edge);
      }
      
      // If auto-hide is on (which matches EdgeNav logic), reveal logic:
      if (autoHide) {
         if (edgeNav || edge === dockPosition) {
             handleInteractionStart();
         }
      }
  };

  const currentMenuItems = getMenuItems(language);

  // SHARED KEY LOGIC (Updated):
  // Whenever the dock position changes (unless it's 'center'), we want to treat it as a new "instance".
  // This forces the component to unmount and remount.
  // When it remounts, Orb.tsx uses `initial="${position}_hidden"` which places it off-screen.
  // Then it animates to `visible`. 
  // This creates the "Slide in from border" effect for ALL dock changes, not just Omni-Wake.
  const sharedGroupKey = dockPosition === 'center' ? 'center' : `dock-group-${dockPosition}`;

  return (
    <div className="relative w-screen h-screen bg-slate-950 overflow-hidden flex items-center justify-center">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#020617_100%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      {/* Edge Sensors - Z-Index 40 (Below visible Orb, but accessible when Orb is hidden/retracted) */}
      {dockPosition !== 'center' && (
          <>
            <div className="absolute top-0 left-0 w-full h-8 z-40 bg-transparent" onMouseEnter={() => handleEdgeEnter('top')} onMouseLeave={handleInteractionEnd} />
            <div className="absolute bottom-0 left-0 w-full h-8 z-40 bg-transparent" onMouseEnter={() => handleEdgeEnter('bottom')} onMouseLeave={handleInteractionEnd} />
            <div className="absolute top-0 left-0 h-full w-8 z-40 bg-transparent" onMouseEnter={() => handleEdgeEnter('left')} onMouseLeave={handleInteractionEnd} />
            <div className="absolute top-0 right-0 h-full w-8 z-40 bg-transparent" onMouseEnter={() => handleEdgeEnter('right')} onMouseLeave={handleInteractionEnd} />
          </>
      )}

      {/* Main Content Area */}
      <AnimatePresence>
        {activeItemId === 'library' && (
          <div className="absolute inset-0 z-0">
             <LibraryView onSelectBook={handleBookSelect} dockPosition={dockPosition} language={language} />
          </div>
        )}
        {activeItemId === 'reader' && (
            <div className="absolute inset-0 z-0">
                <ReaderView dockPosition={dockPosition} language={language} book={currentBook} />
            </div>
        )}
        {activeItemId === 'settings' && (
            <div className="absolute inset-0 z-0">
                <SettingsView 
                    preferredDock={preferredDock} 
                    onDockChange={handleDockPreferenceChange}
                    currentDockPosition={dockPosition}
                    autoHide={autoHide}
                    onAutoHideChange={setAutoHide}
                    edgeNav={edgeNav}
                    onEdgeNavChange={handleEdgeNavToggle} // Updated handler
                    language={language}
                    onLanguageChange={setLanguage}
                />
            </div>
        )}
        {(activeItemId === 'search' || activeItemId === 'profile') && (
             <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 flex items-center justify-center text-slate-500 pl-40">
                <div className="text-center">
                    <Search size={64} className="mx-auto mb-4 opacity-50"/>
                    <h2 className="text-2xl">{activeItemId === 'search' ? menuTranslations[language].search : menuTranslations[language].profile}</h2>
                </div>
             </motion.div>
        )}
      </AnimatePresence>

      {/* The Central Orb - Z-Index 50 (Above sensors when visible) */}
      <Orb 
        key={`orb-${sharedGroupKey}`} // Forces remount on dock change to trigger slide-in
        position={dockPosition} 
        isHidden={!isOrbVisible}
        onClick={handleOrbClick} 
        onHoverStart={handleInteractionStart}
        onHoverEnd={handleInteractionEnd}
      />

      {/* Orbiting Menu Items - Z-Index 60 */}
      <OrbitMenu 
        key={`menu-${sharedGroupKey}`} // Forces remount on dock change to trigger slide-in
        items={currentMenuItems} 
        currentDock={dockPosition}
        activeItemId={activeItemId}
        isHidden={!isOrbVisible}
        onItemClick={handleMenuItemClick}
        onHoverStart={handleInteractionStart}
        onHoverEnd={handleInteractionEnd}
      />

    </div>
  );
};

export default App;