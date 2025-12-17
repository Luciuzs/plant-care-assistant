import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Camera, Edit2, Save, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar?: string;
  bio?: string;
}

export function Profile() {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UserProfile>(profile);

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
      setEditData(parsed);
    }
  }, []);

  const handleSave = () => {
    setProfile(editData);
    localStorage.setItem('userProfile', JSON.stringify(editData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profile);
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setEditData({ ...editData, avatar: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const stats = [
    { label: 'Augalai', value: localStorage.getItem('plants') ? JSON.parse(localStorage.getItem('plants')!).length : 0 },
    { label: 'Polaistyti', value: 0 },
    { label: 'Užduotys', value: 0 },
  ];

  return (
    <div className="min-h-screen pb-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <h2 className="text-[#E5E0D8] text-3xl">Profilis</h2>
        {!isEditing ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsEditing(true)}
            className="w-10 h-10 rounded-full bg-[#B3B792] flex items-center justify-center text-[#725C3A]"
          >
            <Edit2 className="w-5 h-5" />
          </motion.button>
        ) : (
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleCancel}
              className="w-10 h-10 rounded-full bg-[#B3B792] flex items-center justify-center text-[#725C3A]"
            >
              <X className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSave}
              className="w-10 h-10 rounded-full bg-[#D2AB80] flex items-center justify-center text-[#725C3A]"
            >
              <Save className="w-5 h-5" />
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Avatar Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-[#B3B792] overflow-hidden flex items-center justify-center">
            {(isEditing ? editData.avatar : profile.avatar) ? (
              <img
                src={isEditing ? editData.avatar : profile.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-[#725C3A]" />
            )}
          </div>
          {isEditing && (
            <>
              <input
                type="file"
                id="avatarInput"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <label
                htmlFor="avatarInput"
                className="absolute bottom-0 right-0 w-10 h-10 bg-[#D2AB80] rounded-full flex items-center justify-center cursor-pointer shadow-lg"
              >
                <Camera className="w-5 h-5 text-[#725C3A]" />
              </label>
            </>
          )}
        </div>
        <motion.h3 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[#E5E0D8] text-xl mt-4"
        >
          {profile.name || 'Jūsų Vardas'}
        </motion.h3>
        {profile.bio && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-[#E5D2B8] text-sm mt-2 text-center max-w-xs"
          >
            {profile.bio}
          </motion.p>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 + index * 0.05 }}
            className="bg-[#B3B792] rounded-2xl p-4 text-center"
          >
            <p className="text-[#725C3A] text-2xl mb-1 text-[24px]">{stat.value}</p>
            <p className="text-[#725C3A] opacity-70 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Profile Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        {isEditing ? (
          <>
            {/* Edit Mode */}
            <div>
              <label className="block text-[#E5D2B8] mb-2 text-sm">Vardas</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                placeholder="Įveskite vardą"
                className="w-full px-4 py-3 bg-[#B3B792] text-[#725C3A] border border-[#D2AB80] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D2AB80] focus:border-transparent placeholder:text-[#725C3A] placeholder:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[#E5D2B8] mb-2 text-sm">El. paštas</label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                placeholder="jusu@pastas.lt"
                className="w-full px-4 py-3 bg-[#B3B792] text-[#725C3A] border border-[#D2AB80] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D2AB80] focus:border-transparent placeholder:text-[#725C3A] placeholder:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[#E5D2B8] mb-2 text-sm">Telefonas</label>
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                placeholder="+370 600 00000"
                className="w-full px-4 py-3 bg-[#B3B792] text-[#725C3A] border border-[#D2AB80] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D2AB80] focus:border-transparent placeholder:text-[#725C3A] placeholder:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[#E5D2B8] mb-2 text-sm">Vieta</label>
              <input
                type="text"
                value={editData.location}
                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                placeholder="Vilnius, Lietuva"
                className="w-full px-4 py-3 bg-[#B3B792] text-[#725C3A] border border-[#D2AB80] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D2AB80] focus:border-transparent placeholder:text-[#725C3A] placeholder:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[#E5D2B8] mb-2 text-sm">Aprašymas</label>
              <textarea
                value={editData.bio || ''}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                placeholder="Papasakokite apie save..."
                rows={4}
                className="w-full px-4 py-3 bg-[#B3B792] text-[#725C3A] border border-[#D2AB80] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D2AB80] focus:border-transparent resize-none placeholder:text-[#725C3A] placeholder:opacity-50"
              />
            </div>
          </>
        ) : (
          <>
            {/* View Mode */}
            {profile.email && (
              <div className="bg-[#B3B792] rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D2AB80] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#725C3A]" />
                </div>
                <div className="flex-1">
                  <p className="text-[#725C3A] opacity-70 text-sm mb-1">El. paštas</p>
                  <p className="text-[#725C3A]">{profile.email}</p>
                </div>
              </div>
            )}

            {profile.phone && (
              <div className="bg-[#B3B792] rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D2AB80] flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#725C3A]" />
                </div>
                <div className="flex-1">
                  <p className="text-[#725C3A] opacity-70 text-sm mb-1">Telefonas</p>
                  <p className="text-[#725C3A]">{profile.phone}</p>
                </div>
              </div>
            )}

            {profile.location && (
              <div className="bg-[#B3B792] rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D2AB80] flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#725C3A]" />
                </div>
                <div className="flex-1">
                  <p className="text-[#725C3A] opacity-70 text-sm mb-1">Vieta</p>
                  <p className="text-[#725C3A]">{profile.location}</p>
                </div>
              </div>
            )}

            {!profile.email && !profile.phone && !profile.location && (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-[#B3B792] mx-auto mb-4" />
                <p className="text-[#E5D2B8] mb-4">Dar nepridėjote profilio informacijos</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-[#D2AB80] text-[#725C3A] rounded-full shadow-lg"
                >
                  Redaguoti profilį
                </motion.button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
