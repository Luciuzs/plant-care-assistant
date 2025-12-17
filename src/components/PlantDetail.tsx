import { Plant } from '../types';
import { Droplet, Sprout, Wind, Sun, Thermometer, Trash2, Edit2, Calendar as CalendarIcon, Save, X, Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PlantDetailProps {
  plant: Plant;
  onClose: () => void;
  onWater: (id: string) => void;
  onFertilize: (id: string) => void;
  onRepot: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Plant>) => void;
  onDelete: (id: string) => void;
}

export function PlantDetail({ plant, onClose, onWater, onFertilize, onRepot, onUpdate, onDelete }: PlantDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Plant>(plant);

  const daysUntilWatering = plant.nextWatering 
    ? Math.ceil((new Date(plant.nextWatering).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;
  
  const daysUntilFertilizing = plant.nextFertilizing
    ? Math.ceil((new Date(plant.nextFertilizing).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  const handleSave = () => {
    onUpdate(plant.id, editData);
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({ ...editData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pb-8">
      {/* Image Header */}
      <div className="relative h-72 rounded-b-[40px] overflow-hidden shadow-lg mx-[-1px]">
        {isEditing ? (
           <div className="w-full h-full bg-[#B3B792] relative group cursor-pointer">
             {editData.image ? (
               <img src={editData.image} alt={editData.name} className="w-full h-full object-cover opacity-80" />
             ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <Sprout className="w-20 h-20 text-[#725C3A] opacity-50" />
                </div>
             )}
             <label htmlFor="edit-image" className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-12 h-12 text-white" />
             </label>
             <input type="file" id="edit-image" className="hidden" accept="image/*" onChange={handleImageChange} />
           </div>
        ) : (
            plant.image ? (
            <ImageWithFallback 
                src={plant.image} 
                alt={plant.name}
                className="w-full h-full object-cover"
            />
            ) : (
            <div className="w-full h-full bg-[#B3B792] flex items-center justify-center">
                <Sprout className="w-24 h-24 text-[#725C3A] opacity-50" />
            </div>
            )
        )}
        
        {/* Actions Overlay */}
        <div className="absolute top-4 right-6 flex gap-2">
            {isEditing ? (
                <>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsEditing(false)}
                        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur text-red-500 flex items-center justify-center shadow-lg"
                    >
                        <X className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSave}
                        className="w-10 h-10 rounded-full bg-[#D2AB80] text-[#725C3A] flex items-center justify-center shadow-lg"
                    >
                        <Save className="w-5 h-5" />
                    </motion.button>
                </>
            ) : (
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsEditing(true)}
                    className="w-10 h-10 rounded-full bg-white/30 backdrop-blur text-white flex items-center justify-center"
                >
                    <Edit2 className="w-5 h-5" />
                </motion.button>
            )}
        </div>
      </div>

      <div className="px-6 -mt-8 relative z-10">
        <div className="bg-[#E5E0D8] rounded-3xl p-6 shadow-sm mb-6">
          {isEditing ? (
             <div className="space-y-4">
                 <div>
                    <label className="text-xs uppercase text-[#725C3A] opacity-70 font-bold mb-1 block">Pavadinimas</label>
                    <input 
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className="w-full bg-[#F2F2F7] rounded-lg px-3 py-2 text-[#725C3A] font-bold"
                    />
                 </div>
                 <div>
                    <label className="text-xs uppercase text-[#725C3A] opacity-70 font-bold mb-1 block">Rūšis</label>
                    <input 
                        value={editData.species}
                        onChange={(e) => setEditData({...editData, species: e.target.value})}
                        className="w-full bg-[#F2F2F7] rounded-lg px-3 py-2 text-[#725C3A]"
                    />
                 </div>
             </div>
          ) : (
             <>
                <h1 className="text-3xl font-bold text-[#725C3A] mb-1">{plant.name}</h1>
                <p className="text-[#725C3A] opacity-70 text-lg italic">{plant.species}</p>
             </>
          )}

          <div className="grid grid-cols-2 gap-4 mt-6">
             {/* Watering Status */}
             <div className="bg-[#F2F2F7] rounded-2xl p-4 flex flex-col items-center text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${daysUntilWatering <= 0 ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'}`}>
                    <Droplet className="w-5 h-5 fill-current" />
                </div>
                <span className="text-[#725C3A] opacity-60 text-xs uppercase font-bold">Laistyti</span>
                <span className={`text-lg font-bold ${daysUntilWatering <= 0 ? 'text-red-500' : 'text-[#725C3A]'}`}>
                    {daysUntilWatering <= 0 ? 'Šiandien!' : `Už ${daysUntilWatering}d.`}
                </span>
             </div>

             {/* Fertilizing Status */}
             <div className="bg-[#F2F2F7] rounded-2xl p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
                    <Sprout className="w-5 h-5" />
                </div>
                <span className="text-[#725C3A] opacity-60 text-xs uppercase font-bold">Tręšti</span>
                <span className="text-lg font-bold text-[#725C3A]">
                    {daysUntilFertilizing <= 0 ? 'Šiandien!' : `Už ${daysUntilFertilizing}d.`}
                </span>
             </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h3 className="text-[#E5E0D8] text-lg font-medium mb-4 ml-1">Veiksmai</h3>
        <div className="grid grid-cols-3 gap-3 mb-8">
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onWater(plant.id)}
                className="bg-[#5C8D75] text-[#E5E0D8] py-4 rounded-2xl flex flex-col items-center gap-2 shadow-lg active:bg-[#4A725E]"
            >
                <Droplet className="w-6 h-6" />
                <span className="text-xs font-medium">Palaistyti</span>
            </motion.button>
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onFertilize(plant.id)}
                className="bg-[#B3B792] text-[#725C3A] py-4 rounded-2xl flex flex-col items-center gap-2 shadow-lg active:bg-[#A3A782]"
            >
                <Sprout className="w-6 h-6" />
                <span className="text-xs font-medium">Patręšti</span>
            </motion.button>
             <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onRepot(plant.id)}
                className="bg-[#D2AB80] text-[#725C3A] py-4 rounded-2xl flex flex-col items-center gap-2 shadow-lg active:bg-[#C29B70]"
            >
                <CalendarIcon className="w-6 h-6" />
                <span className="text-xs font-medium">Persodinti</span>
            </motion.button>
        </div>

        {/* Requirements */}
        <h3 className="text-[#E5E0D8] text-lg font-medium mb-4 ml-1">Priežiūra</h3>
        <div className="space-y-3 mb-8">
            <div className="bg-[#E5E0D8]/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 border border-[#E5E0D8]/20">
                <div className="w-10 h-10 rounded-full bg-[#E5E0D8]/20 flex items-center justify-center text-[#E5E0D8]">
                    <Sun className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[#E5E0D8] opacity-70 text-xs uppercase font-bold">Šviesa</p>
                    {isEditing ? (
                        <select 
                            value={editData.lightNeeds}
                            onChange={(e) => setEditData({...editData, lightNeeds: e.target.value as any})}
                            className="bg-transparent text-[#E5E0D8] font-medium w-full outline-none border-b border-[#E5E0D8]/30"
                        >
                            <option value="low" className="text-black">Pavėsis</option>
                            <option value="medium" className="text-black">Pusšešėlis</option>
                            <option value="bright" className="text-black">Šviesa</option>
                            <option value="direct" className="text-black">Tiesioginė saulė</option>
                        </select>
                    ) : (
                        <p className="text-[#E5E0D8] font-medium">
                            {plant.lightNeeds === 'low' ? 'Pavėsis' :
                             plant.lightNeeds === 'medium' ? 'Pusšešėlis' :
                             plant.lightNeeds === 'bright' ? 'Išsklaidyta šviesa' : 'Tiesioginė saulė'}
                        </p>
                    )}
                </div>
            </div>

            <div className="bg-[#E5E0D8]/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 border border-[#E5E0D8]/20">
                <div className="w-10 h-10 rounded-full bg-[#E5E0D8]/20 flex items-center justify-center text-[#E5E0D8]">
                    <Thermometer className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[#E5E0D8] opacity-70 text-xs uppercase font-bold">Temperatūra</p>
                    {isEditing ? (
                         <input 
                            value={editData.tempRange}
                            onChange={(e) => setEditData({...editData, tempRange: e.target.value})}
                            className="bg-transparent text-[#E5E0D8] font-medium w-full outline-none border-b border-[#E5E0D8]/30"
                        />
                    ) : (
                        <p className="text-[#E5E0D8] font-medium">{plant.tempRange}</p>
                    )}
                </div>
            </div>

            <div className="bg-[#E5E0D8]/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 border border-[#E5E0D8]/20">
                <div className="w-10 h-10 rounded-full bg-[#E5E0D8]/20 flex items-center justify-center text-[#E5E0D8]">
                    <Wind className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[#E5E0D8] opacity-70 text-xs uppercase font-bold">Drėgmė</p>
                     {isEditing ? (
                        <select 
                            value={editData.humidityNeeds}
                            onChange={(e) => setEditData({...editData, humidityNeeds: e.target.value as any})}
                            className="bg-transparent text-[#E5E0D8] font-medium w-full outline-none border-b border-[#E5E0D8]/30"
                        >
                            <option value="low" className="text-black">Žema</option>
                            <option value="medium" className="text-black">Vidutinė</option>
                            <option value="high" className="text-black">Aukšta</option>
                        </select>
                    ) : (
                        <p className="text-[#E5E0D8] font-medium">
                            {plant.humidityNeeds === 'low' ? 'Žema' :
                             plant.humidityNeeds === 'medium' ? 'Vidutinė' : 'Aukšta'}
                        </p>
                    )}
                </div>
            </div>
        </div>

        {/* Notes */}
        <h3 className="text-[#E5E0D8] text-lg font-medium mb-4 ml-1">Užrašai</h3>
        <div className="bg-[#E5E0D8]/10 backdrop-blur-md rounded-2xl p-6 border border-[#E5E0D8]/20 mb-8">
            {isEditing ? (
                <textarea 
                    value={editData.notes || ''}
                    onChange={(e) => setEditData({...editData, notes: e.target.value})}
                    placeholder="Pastabos apie augalą..."
                    className="w-full bg-transparent text-[#E5E0D8] outline-none min-h-[100px]"
                />
            ) : (
                <p className="text-[#E5E0D8] opacity-80 leading-relaxed">
                    {plant.notes || 'Nėra pastabų.'}
                </p>
            )}
        </div>

        {/* Delete Button */}
        {isEditing && (
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(plant.id)}
                className="w-full py-4 rounded-2xl bg-red-500/20 text-red-300 font-medium flex items-center justify-center gap-2 border border-red-500/30 mb-8"
            >
                <Trash2 className="w-5 h-5" />
                Ištrinti augalą
            </motion.button>
        )}
      </div>
    </div>
  );
}
