export type PlantType = 'succulent' | 'tropical' | 'flowering' | 'fern' | 'tree' | 'other';
export type LightLevel = 'low' | 'medium' | 'bright' | 'direct';
export type HumidityLevel = 'low' | 'medium' | 'high';

export interface CareHistoryItem {
  id: string;
  date: string;
  action: 'water' | 'fertilize' | 'repot';
  note?: string;
}

export interface Plant {
  id: string;
  name: string;
  species: string;
  type: PlantType;
  image?: string;
  acquisitionDate: string;
  
  // Care Schedule
  wateringFrequency: number; // days
  fertilizingFrequency: number; // days
  repottingFrequency: number; // years (default 1-2)
  
  // Environment Needs
  location: 'indoor' | 'outdoor';
  lightNeeds: LightLevel;
  humidityNeeds: HumidityLevel;
  tempRange: string; // e.g., "18-24°C"
  
  // State
  lastWatered?: string;
  lastFertilized?: string;
  lastRepotted?: string;
  
  nextWatering?: string;
  nextFertilizing?: string;
  nextRepotting?: string;
  
  notes?: string;
  history: CareHistoryItem[];
}

export type CareAction = 'water' | 'fertilize' | 'repot';

export interface Reminder {
  plantId: string;
  plantName: string;
  action: CareAction;
  dueDate: string;
  overdue: boolean;
  daysUntil: number;
}
