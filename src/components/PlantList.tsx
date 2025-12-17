import { Plant } from '../types';
import { PlantCard } from './PlantCard';
import { motion } from 'motion/react';

interface PlantListProps {
  plants: Plant[];
  onWater: (id: string) => void;
  onFertilize: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Plant>) => void;
  onDelete: (id: string) => void;
  onSelect: (plant: Plant) => void;
}

export function PlantList({ plants, onSelect }: PlantListProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {plants.map((plant, index) => (
        <motion.div
          key={plant.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <PlantCard plant={plant} onSelect={onSelect} />
        </motion.div>
      ))}
    </div>
  );
}
