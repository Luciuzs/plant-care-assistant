import { Plant } from '../types';
import { Droplet, Calendar, Sprout, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PlantCardProps {
  plant: Plant;
  onSelect: (plant: Plant) => void;
}

export function PlantCard({ plant, onSelect }: PlantCardProps) {
  // Calculate days until next watering
  const daysUntilWatering = plant.nextWatering 
    ? Math.ceil((new Date(plant.nextWatering).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  // Determine status color
  const getStatusColor = () => {
    if (daysUntilWatering <= 0) return 'bg-red-500';
    if (daysUntilWatering <= 2) return 'bg-amber-500';
    return 'bg-[#725C3A]'; // Replaced green-500 with theme color
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(plant)}
      className="bg-[#B3B792] rounded-3xl p-3 shadow-sm cursor-pointer relative overflow-hidden h-[200px] flex flex-col"
    >
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        {daysUntilWatering <= 0 && (
          <div className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Droplet className="w-3 h-3 fill-current" />
            <span>Laistyti!</span>
          </div>
        )}
      </div>

      <div className="h-[120px] mb-3 rounded-2xl overflow-hidden bg-[#D2AB80] relative">
        {plant.image ? (
          <ImageWithFallback 
            src={plant.image} 
            alt={plant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Sprout className="w-12 h-12 text-[#725C3A] opacity-50" />
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-[#725C3A] truncate text-base leading-tight mb-0.5">{plant.name}</h3>
          <p className="text-xs text-[#725C3A] opacity-70 truncate">{plant.species}</p>
        </div>
        
        <div className="flex items-center gap-1 mt-2 text-[#725C3A] opacity-80 text-xs">
          <Droplet className="w-3 h-3" />
          <span>
            {daysUntilWatering <= 0 
              ? 'Šiandien' 
              : `${daysUntilWatering}d.`}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
