import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlantList } from './components/PlantList';
import { AddPlantForm } from './components/AddPlantForm';
import { RemindersPanel } from './components/RemindersPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { PlantDetail } from './components/PlantDetail';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { Plant, CareHistoryItem } from './types';
import { Sprout, Plus, Bell, Menu, Search, ChevronLeft, Home, History, User, Settings as SettingsIcon } from 'lucide-react';
import { Toaster, toast } from 'sonner@2.0.3';
import { themes, ThemeId } from './lib/themes';

export default function App() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'plants' | 'reminders' | 'history' | 'profile' | 'settings'>('plants');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'indoor' | 'outdoor'>('all');
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('green');

  const theme = themes[currentTheme];

  useEffect(() => {
    const savedPlants = localStorage.getItem('plants');
    if (savedPlants) {
      setPlants(JSON.parse(savedPlants));
    }
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && (savedTheme === 'green' || savedTheme === 'blue' || savedTheme === 'warm')) {
      setCurrentTheme(savedTheme as ThemeId);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('plants', JSON.stringify(plants));
  }, [plants]);

  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  // Check for reminders on load (simulate push notifications)
  useEffect(() => {
    const now = new Date();
    const needsWater = plants.filter(p => {
        if (!p.nextWatering) return false;
        return new Date(p.nextWatering).getTime() <= now.getTime();
    });

    if (needsWater.length > 0) {
        toast.info(`Laikas pasirūpinti augalais!`, {
            description: `${needsWater.length} augalams reikia vandens.`,
            duration: 5000,
        });
    }
  }, [plants.length]); 

  const addPlant = (plant: Omit<Plant, 'id' | 'history'>) => {
    const newPlant: Plant = {
      ...plant,
      id: Date.now().toString(),
      history: [], 
      lastWatered: new Date().toISOString(),
      lastFertilized: new Date().toISOString(),
      nextWatering: new Date(Date.now() + plant.wateringFrequency * 24 * 60 * 60 * 1000).toISOString(),
      nextFertilizing: new Date(Date.now() + plant.fertilizingFrequency * 24 * 60 * 60 * 1000).toISOString(),
    };
    setPlants([...plants, newPlant]);
    setShowAddForm(false);
    toast.success('Augalas sėkmingai pridėtas!');
  };

  const updatePlant = (id: string, updates: Partial<Plant>) => {
    setPlants(plants.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePlant = (id: string) => {
    setPlants(plants.filter(p => p.id !== id));
    toast.error('Augalas ištrintas');
  };

  const addToHistory = (plantId: string, action: 'water' | 'fertilize' | 'repot') => {
     setPlants(prev => prev.map(p => {
        if (p.id !== plantId) return p;
        const newHistoryItem: CareHistoryItem = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            action
        };
        return {
            ...p,
            history: [...(p.history || []), newHistoryItem]
        };
     }));
  };

  const waterPlant = (id: string) => {
    const plant = plants.find(p => p.id === id);
    if (plant) {
      updatePlant(id, {
        lastWatered: new Date().toISOString(),
        nextWatering: new Date(Date.now() + plant.wateringFrequency * 24 * 60 * 60 * 1000).toISOString(),
      });
      addToHistory(id, 'water');
      toast.success('Augalas palaistytas!');
    }
  };

  const fertilizePlant = (id: string) => {
    const plant = plants.find(p => p.id === id);
    if (plant) {
      updatePlant(id, {
        lastFertilized: new Date().toISOString(),
        nextFertilizing: new Date(Date.now() + plant.fertilizingFrequency * 24 * 60 * 60 * 1000).toISOString(),
      });
      addToHistory(id, 'fertilize');
      toast.success('Augalas patręštas!');
    }
  };

  const repotPlant = (id: string) => {
      const plant = plants.find(p => p.id === id);
      if (plant) {
          updatePlant(id, {
              lastRepotted: new Date().toISOString(),
          });
          addToHistory(id, 'repot');
          toast.success('Augalas persodintas!');
      }
  };

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plant.species?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || 
                           (categoryFilter === 'indoor' && plant.location === 'indoor') ||
                           (categoryFilter === 'outdoor' && plant.location === 'outdoor');
    return matchesSearch && matchesCategory;
  });

  return (
    <div 
      className="min-h-screen bg-[#F2F2F7] flex items-center justify-center p-4 sm:p-8 font-sans"
      style={{
        '--theme-bg': theme.colors.bg,
        '--theme-primary': theme.colors.primary,
        '--theme-accent': theme.colors.accent,
        '--theme-text': theme.colors.text,
        '--theme-subtext': theme.colors.subtext,
        '--theme-active': theme.colors.active,
        '--theme-active-text': theme.colors.activeText,
        '--theme-inactive-icon': theme.colors.inactiveIcon,
        '--theme-dark-text': theme.colors.darkText,
      } as React.CSSProperties}
    >
      <Toaster position="top-center" />
      <div className="w-full max-w-[360px] h-[780px] bg-[var(--theme-bg)] relative shadow-[0_0_60px_-15px_rgba(0,0,0,0.3)] rounded-[45px] overflow-hidden transition-colors duration-500">
        <AnimatePresence mode="wait">
          {selectedPlant ? (
            <motion.div
              key="plant-detail"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute inset-0 bg-[var(--theme-bg)] z-50 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
            >
              {/* Header */}
              <div className="bg-[var(--theme-bg)] px-6 py-4 sticky top-0 z-10">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPlant(null)}
                  className="flex items-center gap-2 text-[var(--theme-accent)]"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Atgal</span>
                </motion.button>
              </div>
              <PlantDetail
                plant={plants.find(p => p.id === selectedPlant.id) || selectedPlant} // Ensure we have latest data
                onClose={() => setSelectedPlant(null)}
                onWater={waterPlant}
                onFertilize={fertilizePlant}
                onRepot={repotPlant}
                onUpdate={updatePlant}
                onDelete={(id) => {
                  deletePlant(id);
                  setSelectedPlant(null);
                }}
              />
            </motion.div>
          ) : showAddForm ? (
            <motion.div
              key="add-form"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute inset-0 bg-[var(--theme-bg)] z-50 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
            >
              {/* Header */}
              <div className="bg-[var(--theme-bg)] px-6 py-4 sticky top-0 z-10">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddForm(false)}
                  className="flex items-center gap-2 text-[var(--theme-accent)]"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Atgal</span>
                </motion.button>
              </div>
              <div className="px-6">
                <AddPlantForm
                  onAdd={addPlant}
                  onCancel={() => setShowAddForm(false)}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="main-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full relative"
            >
              {/* Scrollable Content */}
              <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] pb-32">
                {/* Header */}
                {activeTab === 'plants' && (
                  <div className="bg-[var(--theme-bg)] px-6 pt-6 pb-4">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <motion.p 
                          className="text-[var(--theme-accent)] text-sm mb-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          Sveiki!
                        </motion.p>
                        <motion.h1 
                          className="text-[var(--theme-text)] text-2xl"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          Mano Augalai
                        </motion.h1>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setActiveTab('reminders')}
                        className="w-12 h-12 rounded-2xl bg-[var(--theme-primary)] flex items-center justify-center text-[var(--theme-accent)] relative"
                      >
                        <Bell className="w-5 h-5" />
                        {plants.some(p => {
                          const wateringDays = p.nextWatering ? Math.ceil((new Date(p.nextWatering).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
                          return wateringDays !== null && wateringDays <= 0;
                        }) && (
                          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                      </motion.button>
                    </div>

                    {/* Search Bar */}
                    <div className="flex gap-3 mb-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 bg-[var(--theme-primary)] rounded-2xl px-5 py-3 flex items-center gap-3"
                      >
                        <Search className="w-5 h-5 text-[var(--theme-accent)]" />
                        <input
                          type="text"
                          placeholder="Ieškoti..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-transparent text-[var(--theme-text)] placeholder:text-[var(--theme-accent)] outline-none flex-1"
                        />
                      </motion.div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="w-12 h-12 rounded-2xl bg-[var(--theme-primary)] flex items-center justify-center text-[var(--theme-accent)]"
                      >
                        <ChevronLeft className="w-5 h-5 rotate-180" />
                      </motion.button>
                    </div>

                    {/* Category Filters */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex gap-6 mb-2"
                    >
                      {[
                        { id: 'all', label: 'Visi' },
                        { id: 'indoor', label: 'Viduje' },
                        { id: 'outdoor', label: 'Lauke' },
                      ].map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setCategoryFilter(category.id as any)}
                          className="relative pb-2"
                        >
                          <span className={`transition-colors ${
                            categoryFilter === category.id
                              ? 'text-[var(--theme-text)]'
                              : 'text-[var(--theme-accent)]'
                          }`}>
                            {category.label}
                          </span>
                          {categoryFilter === category.id && (
                            <motion.div
                              layoutId="categoryIndicator"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--theme-text)]"
                              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  </div>
                )}

                {/* Content Area */}
                <div className="px-6 py-6 bg-[var(--theme-bg)] min-h-full">
                  <AnimatePresence mode="wait">
                    {activeTab === 'plants' ? (
                      <motion.div
                        key="plants-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {showAddForm ? (
                          <AddPlantForm
                            onAdd={addPlant}
                            onCancel={() => setShowAddForm(false)}
                          />
                        ) : (
                          <>
                            {/* Section Title */}
                            <motion.h2
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-[var(--theme-text)] text-3xl mb-6"
                            >
                              Visi Augalai
                            </motion.h2>

                            {filteredPlants.length === 0 ? (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-24"
                              >
                                <motion.div
                                  animate={{ 
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1]
                                  }}
                                  transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 1
                                  }}
                                >
                                  <Sprout className="w-20 h-20 text-[var(--theme-primary)] mx-auto mb-4" />
                                </motion.div>
                                <p className="text-[var(--theme-accent)] mb-6">
                                  {searchQuery || categoryFilter !== 'all' 
                                    ? 'Nerasta augalų' 
                                    : 'Dar neturite pridėtų augalų'}
                                </p>
                                {!searchQuery && categoryFilter === 'all' && (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowAddForm(true)}
                                    className="px-8 py-3 bg-[var(--theme-accent)] text-[var(--theme-dark-text)] rounded-full shadow-lg"
                                  >
                                    Pridėti augalą
                                  </motion.button>
                                )}
                              </motion.div>
                            ) : (
                              <PlantList
                                plants={filteredPlants}
                                onWater={waterPlant}
                                onFertilize={fertilizePlant}
                                onUpdate={updatePlant}
                                onDelete={deletePlant}
                                onSelect={setSelectedPlant}
                              />
                            )}
                          </>
                        )}
                      </motion.div>
                    ) : activeTab === 'reminders' ? (
                      <motion.div
                        key="reminders-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-[var(--theme-text)] text-3xl">Priminimai</h2>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab('plants')}
                            className="text-[var(--theme-accent)]"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </motion.button>
                        </div>
                        <RemindersPanel plants={plants} onWater={waterPlant} onFertilize={fertilizePlant} />
                      </motion.div>
                    ) : activeTab === 'history' ? (
                      <motion.div
                        key="history-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-[var(--theme-text)] text-3xl">Istorija</h2>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab('plants')}
                            className="text-[var(--theme-accent)]"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </motion.button>
                        </div>
                        <HistoryPanel plants={plants} />
                      </motion.div>
                    ) : activeTab === 'settings' ? (
                      <motion.div
                        key="settings-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-[var(--theme-text)] text-3xl">Nustatymai</h2>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab('plants')}
                            className="text-[var(--theme-accent)]"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </motion.button>
                        </div>
                        <Settings currentTheme={currentTheme} onThemeChange={(t) => setCurrentTheme(t as ThemeId)} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="profile-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Profile />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Floating Add Button */}
              <AnimatePresence>
                {!showAddForm && activeTab === 'plants' && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={() => setShowAddForm(true)}
                    className="absolute bottom-28 right-8 w-14 h-14 bg-[var(--theme-accent)] rounded-full flex items-center justify-center shadow-xl z-40 hover:scale-110 active:scale-90 transition-transform"
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  >
                    <Plus className="w-6 h-6 text-[var(--theme-dark-text)]" />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation */}
        {!selectedPlant && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 z-50"
          >
            <div className="w-full px-6 pb-6">
              {/* Floating Center Home Button - Above nav */}
              <div className="relative h-8 mb-[-20px]">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('plants');
                    setShowAddForm(false);
                  }}
                  className={`absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 active:scale-90 z-50 ${
                    activeTab === 'plants' && !showAddForm 
                      ? 'bg-[var(--theme-active)] text-[var(--theme-active-text)]' 
                      : 'bg-[var(--theme-bg)] text-[var(--theme-accent)]'
                  }`}
                >
                  <Home className="w-7 h-7" />
                </button>
              </div>

              {/* Navigation Background */}
              <div className="relative bg-[var(--theme-primary)] rounded-full shadow-2xl px-8 py-4">
                <div className="flex items-center justify-between">
                  {/* Left Icons */}
                  <div className="flex items-center gap-8">
                    <button
                      type="button"
                      onClick={() => setActiveTab('settings')}
                      className={`transition-all hover:scale-110 active:scale-90 ${
                        activeTab === 'settings' ? 'text-[var(--theme-active)]' : 'text-[var(--theme-inactive-icon)]'
                      }`}
                    >
                      <SettingsIcon className="w-6 h-6" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setActiveTab('history')}
                      className={`transition-all hover:scale-110 active:scale-90 ${
                        activeTab === 'history' ? 'text-[var(--theme-active)]' : 'text-[var(--theme-inactive-icon)]'
                      }`}
                    >
                      <History className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Spacer for center button */}
                  <div className="w-14"></div>

                  {/* Right Icons */}
                  <div className="flex items-center gap-8">
                    <button
                      type="button"
                      onClick={() => setActiveTab('reminders')}
                      className={`transition-all hover:scale-110 active:scale-90 relative ${
                        activeTab === 'reminders' ? 'text-[var(--theme-active)]' : 'text-[var(--theme-inactive-icon)]'
                      }`}
                    >
                      <Bell className="w-6 h-6" />
                      {plants.some(p => {
                        const wateringDays = p.nextWatering ? Math.ceil((new Date(p.nextWatering).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
                        return wateringDays !== null && wateringDays <= 0;
                      }) && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('profile');
                        setShowAddForm(false);
                      }}
                      className={`transition-all hover:scale-110 active:scale-90 ${
                        activeTab === 'profile' ? 'text-[var(--theme-active)]' : 'text-[var(--theme-inactive-icon)]'
                      }`}
                    >
                      <User className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
