import { Plant } from '../types';
import { motion } from 'motion/react';
import { Droplet, Sprout, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { useState } from 'react';
import { format } from 'date-fns';
import { lt } from 'date-fns/locale';

interface RemindersPanelProps {
  plants: Plant[];
  onWater: (id: string) => void;
  onFertilize: (id: string) => void;
}

export function RemindersPanel({ plants, onWater, onFertilize }: RemindersPanelProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Collect all tasks
  const tasks = plants.flatMap(plant => {
    const tasks = [];
    
    if (plant.nextWatering) {
      tasks.push({
        plant,
        type: 'water',
        date: new Date(plant.nextWatering),
        overdue: new Date(plant.nextWatering).getTime() < Date.now()
      });
    }
    
    if (plant.nextFertilizing) {
      tasks.push({
        plant,
        type: 'fertilize',
        date: new Date(plant.nextFertilizing),
        overdue: new Date(plant.nextFertilizing).getTime() < Date.now()
      });
    }
    
    return tasks;
  }).sort((a, b) => a.date.getTime() - b.date.getTime());

  const overdueTasks = tasks.filter(t => t.overdue);
  const upcomingTasks = tasks.filter(t => !t.overdue);

  return (
    <div className="pb-20 space-y-8">
       {/* Calendar View */}
       <div className="bg-[#B3B792] rounded-3xl p-4 shadow-sm">
           <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md mx-auto"
                modifiers={{
                    booked: tasks.map(t => t.date)
                }}
                modifiersStyles={{
                    booked: {
                        fontWeight: 'bold',
                        color: '#725C3A',
                        textDecoration: 'underline'
                    }
                }}
           />
       </div>

      {/* Overdue Section */}
      {overdueTasks.length > 0 && (
        <div>
          <h3 className="text-[#E5D2B8] text-sm uppercase font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            Vėluojama
          </h3>
          <div className="space-y-3">
            {overdueTasks.map((task, idx) => (
              <motion.div
                key={`${task.plant.id}-${task.type}-overdue`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#E5E0D8] rounded-2xl p-4 flex items-center justify-between border-l-4 border-red-400"
              >
                <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center ${task.type === 'water' ? 'bg-blue-100 text-blue-500' : 'bg-amber-100 text-amber-500'}`}>
                       {task.type === 'water' ? <Droplet className="w-5 h-5" /> : <Sprout className="w-5 h-5" />}
                   </div>
                   <div>
                       <p className="font-bold text-[#725C3A]">{task.plant.name}</p>
                       <p className="text-xs text-[#725C3A] opacity-70">
                           {task.type === 'water' ? 'Reikia laistyti' : 'Reikia tręšti'}
                       </p>
                   </div>
                </div>
                <button
                    onClick={() => task.type === 'water' ? onWater(task.plant.id) : onFertilize(task.plant.id)}
                    className="w-10 h-10 rounded-full bg-[#725C3A] text-[#E5E0D8] flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                >
                    <CheckCircle2 className="w-6 h-6" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Section */}
      <div>
        <h3 className="text-[#E5D2B8] text-sm uppercase font-bold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Artimiausi
        </h3>
        <div className="space-y-3">
            {upcomingTasks.length === 0 ? (
                <p className="text-[#E5D2B8] opacity-60 text-center py-4">Nėra suplanuotų darbų</p>
            ) : (
                upcomingTasks.slice(0, 5).map((task, idx) => (
                    <motion.div
                        key={`${task.plant.id}-${task.type}-upcoming`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-[#B3B792] rounded-2xl p-4 flex items-center justify-between opacity-80"
                    >
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#D2AB80] flex items-center justify-center text-[#725C3A]">
                                {task.type === 'water' ? <Droplet className="w-5 h-5" /> : <Sprout className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="font-bold text-[#725C3A]">{task.plant.name}</p>
                                <p className="text-xs text-[#725C3A] opacity-70">
                                    {format(task.date, 'MMM d', { locale: lt })} • {task.type === 'water' ? 'Laistymas' : 'Tręšimas'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))
            )}
        </div>
      </div>
    </div>
  );
}
