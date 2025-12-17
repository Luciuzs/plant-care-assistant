import { motion } from 'motion/react';
import { themes, ThemeId } from '../lib/themes';
import { Check, Palette, Bell, Globe, Moon } from 'lucide-react';
import { Switch } from './ui/switch';

interface SettingsProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}

export function Settings({ currentTheme, onThemeChange }: SettingsProps) {
  return (
    <div className="space-y-8 pb-8">
      {/* Theme Section */}
      <section>
        <h3 className="text-[var(--theme-text)] text-lg font-medium mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Išvaizda
        </h3>
        <div className="bg-[var(--theme-inactive-icon)]/20 rounded-3xl p-4 backdrop-blur-sm">
          <div className="grid grid-cols-1 gap-3">
            {(Object.values(themes) as Array<typeof themes[keyof typeof themes]>).map((theme) => {
              const Icon = theme.icon;
              const isActive = currentTheme === theme.id;
              
              return (
                <motion.button
                  key={theme.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onThemeChange(theme.id)}
                  className={`relative p-4 rounded-2xl flex items-center gap-4 transition-all overflow-hidden ${
                    isActive 
                      ? 'bg-[var(--theme-bg)] shadow-md ring-2 ring-[var(--theme-active)]' 
                      : 'bg-[var(--theme-bg)]/50 hover:bg-[var(--theme-bg)]/80'
                  }`}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-inner"
                    style={{ background: theme.preview }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <p className={`font-medium ${isActive ? 'text-[var(--theme-text)]' : 'text-[var(--theme-text)]/70'}`}>
                      {theme.name}
                    </p>
                  </div>

                  {isActive && (
                    <div className="w-6 h-6 rounded-full bg-[var(--theme-active)] flex items-center justify-center">
                      <Check className="w-4 h-4 text-[var(--theme-active-text)]" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Notifications Section */}
      <section>
        <h3 className="text-[var(--theme-text)] text-lg font-medium mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Pranešimai
        </h3>
        <div className="bg-[var(--theme-inactive-icon)]/20 rounded-3xl p-4 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between p-2">
            <div>
              <p className="text-[var(--theme-text)] font-medium">Laistymo priminimai</p>
              <p className="text-[var(--theme-text)]/60 text-sm">Gauti pranešimus kai reikia laistyti</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="h-px bg-[var(--theme-text)]/10" />
          <div className="flex items-center justify-between p-2">
            <div>
              <p className="text-[var(--theme-text)] font-medium">Tręšimo priminimai</p>
              <p className="text-[var(--theme-text)]/60 text-sm">Gauti pranešimus kai reikia tręšti</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </section>

      {/* General Section */}
      <section>
        <h3 className="text-[var(--theme-text)] text-lg font-medium mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Bendra
        </h3>
        <div className="bg-[var(--theme-inactive-icon)]/20 rounded-3xl p-4 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between p-2">
             <div>
              <p className="text-[var(--theme-text)] font-medium">Kalba</p>
              <p className="text-[var(--theme-text)]/60 text-sm">Lietuvių</p>
            </div>
          </div>
        </div>
      </section>

       <div className="text-center pt-8">
        <p className="text-[var(--theme-text)]/40 text-xs">Versija 1.0.0</p>
      </div>
    </div>
  );
}
