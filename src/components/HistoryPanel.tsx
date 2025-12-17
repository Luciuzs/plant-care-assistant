import { Plant } from '../types';
import { motion } from 'motion/react';
import { Droplet, Sprout, Calendar, History as HistoryIcon } from 'lucide-react';
import { format } from 'date-fns';
import { lt } from 'date-fns/locale';

interface HistoryPanelProps {
  plants: Plant[];
}

export function HistoryPanel({ plants }: HistoryPanelProps) {
  // Aggregate all history items
  const allHistory = plants.flatMap(plant => 
    (plant.history || []).map(item => ({
      ...item,
      plantName: plant.name,
      plantImage: plant.image
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="pb-8">
      {allHistory.length === 0 ? (
         <div className="text-center py-20">
             <div className="w-20 h-20 bg-[#B3B792] rounded-full flex items-center justify-center mx-auto mb-6">
                 <HistoryIcon className="w-10 h-10 text-[#725C3A]" />
             </div>
             <p className="text-[#E5D2B8] text-lg">Istorija tuščia</p>
             <p className="text-[#E5D2B8] opacity-60 text-sm mt-2">Atlikti darbai atsiras čia</p>
         </div>
      ) : (
        <div className="relative border-l-2 border-[#B3B792] ml-6 space-y-8">
            {allHistory.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative pl-8"
                >
                    {/* Timeline dot */}
                    <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 border-[#B3B792] ${
                        item.action === 'water' ? 'bg-blue-400' :
                        item.action === 'fertilize' ? 'bg-amber-400' : 'bg-green-400'
                    }`}></div>

                    <div className="bg-[#B3B792] rounded-2xl p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-[#725C3A] text-lg">{item.plantName}</h4>
                            <span className="text-xs text-[#725C3A] opacity-60 font-mono">
                                {format(new Date(item.date), 'HH:mm')}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                             {item.action === 'water' && (
                                 <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-600 px-2 py-1 rounded-md text-xs font-bold uppercase">
                                     <Droplet className="w-3 h-3" /> Palaistytas
                                 </span>
                             )}
                             {item.action === 'fertilize' && (
                                 <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-600 px-2 py-1 rounded-md text-xs font-bold uppercase">
                                     <Sprout className="w-3 h-3" /> Patręštas
                                 </span>
                             )}
                             {item.action === 'repot' && (
                                 <span className="inline-flex items-center gap-1 bg-green-100 text-green-600 px-2 py-1 rounded-md text-xs font-bold uppercase">
                                     <Calendar className="w-3 h-3" /> Persodintas
                                 </span>
                             )}
                        </div>
                        
                        <p className="text-[#725C3A] text-xs opacity-70">
                            {format(new Date(item.date), 'MMMM d, yyyy', { locale: lt })}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
      )}
    </div>
  );
}
