import { Leaf, Moon, Sun } from 'lucide-react';

export const themes = {
  green: {
    id: 'green',
    name: 'Žalioji tema',
    icon: Leaf,
    colors: {
      bg: '#809671',
      primary: '#436850',
      accent: '#E5D2B8',
      text: '#FBFADA',
      subtext: '#E5D2B8',
      active: '#D2AB80',
      activeText: '#725C3A',
      inactiveIcon: '#B3B792',
      darkText: '#12372A',
    },
    preview: 'linear-gradient(135deg, #809671 0%, #436850 100%)'
  },
  blue: {
    id: 'blue',
    name: 'Mėlynoji tema',
    icon: Moon,
    colors: {
      bg: '#5B7C99',
      primary: '#3D5A80',
      accent: '#C8D5E0',
      text: '#E8F1F5',
      subtext: '#C8D5E0',
      active: '#94A3B8', // Muted blue-grey for active state
      activeText: '#1e293b',
      inactiveIcon: '#94A3B8',
      darkText: '#1e293b',
    },
    preview: 'linear-gradient(135deg, #5B7C99 0%, #3D5A80 100%)'
  },
  warm: {
    id: 'warm',
    name: 'Šiltoji tema',
    icon: Sun,
    colors: {
      bg: '#C48B5C',
      primary: '#A0522D',
      accent: '#F5DEB3',
      text: '#FFF8E7',
      subtext: '#F5DEB3',
      active: '#DEB887',
      activeText: '#4A2511',
      inactiveIcon: '#E6CCB2',
      darkText: '#4A2511',
    },
    preview: 'linear-gradient(135deg, #C48B5C 0%, #A0522D 100%)'
  }
} as const;

export type ThemeId = keyof typeof themes;
