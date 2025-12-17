import { useState } from 'react';
import { Plant, PlantType, LightLevel, HumidityLevel } from '../types';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { identifyPlant, analyzeImageForPlant } from '../utils/plantIdentification';
import { toast } from 'sonner@2.0.3';

interface AddPlantFormProps {
  onAdd: (plant: Omit<Plant, 'id' | 'history'>) => void;
  onCancel: () => void;
}

export function AddPlantForm({ onAdd, onCancel }: AddPlantFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Plant>>({
    name: '',
    species: '',
    type: 'tropical',
    location: 'indoor',
    lightNeeds: 'bright',
    humidityNeeds: 'medium',
    wateringFrequency: 7,
    fertilizingFrequency: 30,
    repottingFrequency: 2,
    tempRange: '18-24°C',
    acquisitionDate: new Date().toISOString().split('T')[0],
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
        
        // Auto-identification
        try {
          setIsAnalyzing(true);
          toast.info("Identifikuojamas augalas...", { duration: 2000 });
          
          const identifiedPlant = await identifyPlant(result);
          
          setFormData(prev => ({
            ...prev,
            species: identifiedPlant.species,
            name: identifiedPlant.name, // Suggest name but allow user to change
            wateringFrequency: identifiedPlant.wateringFrequency,
            fertilizingFrequency: identifiedPlant.fertilizingFrequency,
            notes: identifiedPlant.careNotes,
          }));
          
          toast.success(`Atpažinta: ${identifiedPlant.name}`);
        } catch (error) {
          console.error("Failed to identify plant:", error);
          toast.error("Nepavyko atpažinti augalo");
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData as Omit<Plant, 'id' | 'history'>);
  };

  return (
    <div className="pb-8">
      <h2 className="text-[#E5E0D8] text-3xl mb-8 mt-2">Naujas Augalas</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="flex justify-center mb-8">
          <div className="relative w-40 h-40">
            <div className={`w-full h-full rounded-3xl overflow-hidden bg-[#B3B792] flex items-center justify-center border-4 border-[#D2AB80] ${isAnalyzing ? 'animate-pulse' : ''}`}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-12 h-12 text-[#725C3A] opacity-50" />
              )}
            </div>
            
            {isAnalyzing && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-3xl backdrop-blur-sm">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
               </div>
            )}
            
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              id="plant-image"
            />
            <label 
                htmlFor="plant-image"
                className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#D2AB80] rounded-full flex items-center justify-center text-[#725C3A] shadow-lg cursor-pointer"
            >
                <Upload className="w-6 h-6" />
            </label>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-[#E5D2B8] mb-2 text-sm">Pavadinimas</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Mano Monstera"
              className="w-full px-4 py-3 bg-[#B3B792] text-[#725C3A] border border-[#D2AB80] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D2AB80] focus:border-transparent placeholder:text-[#725C3A] placeholder:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[#E5D2B8] mb-2 text-sm">Rūšis (nebūtina)</label>
            <input
              type="text"
              value={formData.species}
              onChange={e => setFormData({ ...formData, species: e.target.value })}
              placeholder="Monstera Deliciosa"
              className="w-full px-4 py-3 bg-[#B3B792] text-[#725C3A] border border-[#D2AB80] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D2AB80] focus:border-transparent placeholder:text-[#725C3A] placeholder:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#E5D2B8] mb-2 text-sm">Tipas</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as PlantType })}
                className="w-full px-4 py-3 bg-[#B3B792] text-[#725C3A] border border-[#D2AB80] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D2AB80] appearance-none"
              >
                <option value="tropical">Tropinis</option>
                <option value="succulent">Sukulentas</option>
                <option value="flowering">Žydintis</option>
                <option value="fern">Papartis</option>
                <option value="tree">Medis</option>
                <option value="other">Kita</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[#E5D2B8] mb-2 text-sm">Vieta</label>
              <select
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value as 'indoor' | 'outdoor' })}
                className="w-full px-4 py-3 bg-[#B3B792] text-[#725C3A] border border-[#D2AB80] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D2AB80] appearance-none"
              >
                <option value="indoor">Viduje</option>
                <option value="outdoor">Lauke</option>
              </select>
            </div>
          </div>
        </div>

        {/* Care Schedule */}
        <div className="space-y-4 pt-4 border-t border-[#E5E0D8]/20">
            <h3 className="text-[#E5E0D8] text-lg font-medium">Priežiūros grafikas</h3>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[#E5D2B8] mb-2 text-sm">Laistymas (dienos)</label>
                    <input
                        type="number"
                        required
                        min="1"
                        value={formData.wateringFrequency}
                        onChange={e => setFormData({ ...formData, wateringFrequency: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-[#B3B792] text-[#725C3A] border border-[#D2AB80] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D2AB80]"
                    />
                </div>
                <div>
                    <label className="block text-[#E5D2B8] mb-2 text-sm">Tręšimas (dienos)</label>
                    <input
                        type="number"
                        required
                        min="1"
                        value={formData.fertilizingFrequency}
                        onChange={e => setFormData({ ...formData, fertilizingFrequency: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-[#B3B792] text-[#725C3A] border border-[#D2AB80] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D2AB80]"
                    />
                </div>
            </div>
        </div>
        
        {/* Buttons */}
        <div className="flex gap-4 pt-4">
            <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-4 bg-[#B3B792] text-[#725C3A] rounded-2xl font-medium hover:bg-opacity-90 transition-colors"
            >
                Atšaukti
            </button>
            <button
                type="submit"
                className="flex-1 py-4 bg-[#D2AB80] text-[#725C3A] rounded-2xl font-bold hover:bg-opacity-90 transition-colors shadow-lg"
            >
                Pridėti
            </button>
        </div>
      </form>
    </div>
  );
}
