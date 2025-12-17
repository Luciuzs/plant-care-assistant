// Mock plant identification service
// In production, this would call a real API like Plant.id, Google Cloud Vision, or similar

export interface IdentifiedPlant {
  name: string;
  species: string;
  commonNames: string[];
  wateringFrequency: number;
  fertilizingFrequency: number;
  repottingMonth?: number;
  careNotes: string;
  confidence: number;
}

const plantDatabase: IdentifiedPlant[] = [
  {
    name: 'Monstera',
    species: 'Monstera deliciosa',
    commonNames: ['Swiss Cheese Plant', 'Split-leaf Philodendron'],
    wateringFrequency: 7,
    fertilizingFrequency: 30,
    repottingMonth: 4,
    careNotes: 'Mėgsta šviesą, bet ne tiesioginę saulę. Laistyti, kai viršutinis dirvos sluoksnis išdžiūsta. Vasarą dažniau laistyti nei žiemą.',
    confidence: 0.95,
  },
  {
    name: 'Sukulentas',
    species: 'Echeveria elegans',
    commonNames: ['Mexican Snowball', 'White Mexican Rose'],
    wateringFrequency: 14,
    fertilizingFrequency: 60,
    repottingMonth: 3,
    careNotes: 'Reikia daug saulės šviesos. Laistyti retai, tik kai dirva visiškai išdžiūsta. Bijo per didelio drėgnumo.',
    confidence: 0.92,
  },
  {
    name: 'Fikusas',
    species: 'Ficus elastica',
    commonNames: ['Rubber Plant', 'Rubber Tree'],
    wateringFrequency: 7,
    fertilizingFrequency: 30,
    repottingMonth: 5,
    careNotes: 'Mėgsta šviesią vietą. Laistyti, kai viršutinis dirvos sluoksnis išdžiūsta. Lapus galima nušluostyti drėgna kempine.',
    confidence: 0.89,
  },
  {
    name: 'Aloė',
    species: 'Aloe vera',
    commonNames: ['Medicinal Aloe', 'Burn Plant'],
    wateringFrequency: 14,
    fertilizingFrequency: 90,
    repottingMonth: 3,
    careNotes: 'Sukulentas, kuriam reikia daug šviesos ir nedaug vandens. Laistyti retai, tik kai dirva visiškai išdžiūsta.',
    confidence: 0.94,
  },
  {
    name: 'Papartis',
    species: 'Nephrolepis exaltata',
    commonNames: ['Boston Fern', 'Sword Fern'],
    wateringFrequency: 3,
    fertilizingFrequency: 30,
    repottingMonth: 4,
    careNotes: 'Mėgsta drėgmę ir pusšešėlį. Laistyti dažnai, dirva turi būti nuolat drėgna. Purkšti lapus.',
    confidence: 0.88,
  },
  {
    name: 'Sansevieria',
    species: 'Sansevieria trifasciata',
    commonNames: ['Snake Plant', 'Mother-in-Law\'s Tongue'],
    wateringFrequency: 14,
    fertilizingFrequency: 60,
    repottingMonth: 5,
    careNotes: 'Labai atsparus augalas. Gali augti tiek šviesoje, tiek pusšešėlyje. Laistyti retai.',
    confidence: 0.91,
  },
  {
    name: 'Pothosas',
    species: 'Epipremnum aureum',
    commonNames: ['Golden Pothos', 'Devil\'s Ivy'],
    wateringFrequency: 7,
    fertilizingFrequency: 30,
    repottingMonth: 4,
    careNotes: 'Lengvai prižiūrimas augalas. Mėgsta vidutinę šviesą. Laistyti, kai viršutinis dirvos sluoksnis išdžiūsta.',
    confidence: 0.93,
  },
  {
    name: 'Kaktusas',
    species: 'Cactaceae',
    commonNames: ['Cactus'],
    wateringFrequency: 21,
    fertilizingFrequency: 90,
    repottingMonth: 3,
    careNotes: 'Reikia daug saulės šviesos. Laistyti labai retai, dirva turi būti sausa tarp laistymų.',
    confidence: 0.87,
  },
];

// Simulate API delay and plant identification
export async function identifyPlant(imageData: string): Promise<IdentifiedPlant> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // In production, you would:
  // 1. Send imageData to Plant.id API or similar
  // 2. Get back the plant identification
  // 3. Return the results
  
  // Example API call structure (commented out):
  /*
  const response = await fetch('https://api.plant.id/v2/identify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': 'YOUR_API_KEY_HERE'
    },
    body: JSON.stringify({
      images: [imageData.split(',')[1]], // base64 without prefix
      modifiers: ['crops_fast', 'similar_images'],
      plant_details: ['common_names', 'watering', 'propagation_methods']
    })
  });
  const data = await response.json();
  */

  // For demo, return a random plant from our database
  const randomPlant = plantDatabase[Math.floor(Math.random() * plantDatabase.length)];
  
  return randomPlant;
}

// Helper function to analyze image colors (mock)
export function analyzeImageForPlant(imageData: string): string {
  // In a real scenario, this could do basic color analysis
  // to improve the random selection
  return 'analysis-result';
}
