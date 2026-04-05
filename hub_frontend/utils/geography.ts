export interface IndiaGeography {
  [zone: string]: {
    [state: string]: string[];
  };
}

export const INDIA_GEOGRAPHY: IndiaGeography = {
  "North": {
    "Delhi": ["New Delhi", "North Delhi", "South Delhi"],
    "Haryana": ["Gurugram", "Faridabad", "Panipat"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar"],
    "Uttar Pradesh": ["Noida", "Kanpur", "Ghaziabad", "Lucknow"]
  },
  "South": {
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruppur"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Belagavi"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
    "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode"]
  },
  "West": {
    "Maharashtra": ["Mumbai", "Pune", "Nashik", "Nagpur"],
    "Gujarat": ["Ahmedabad", "Surat", "Rajkot", "Vadodara"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Bhilwara", "Udaipur"]
  },
  "East": {
    "West Bengal": ["Kolkata", "Howrah", "Durgapur"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad"]
  },
  "Central": {
    "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur"]
  },
  "North East": {
    "Assam": ["Guwahati", "Dibrugarh", "Silchar"],
    "Meghalaya": ["Shillong"],
    "Sikkim": ["Gangtok"]
  }
};

export const getAllZones = () => Object.keys(INDIA_GEOGRAPHY);

export const getStatesForZone = (zone: string) => {
  if (!zone || !INDIA_GEOGRAPHY[zone]) return [];
  return Object.keys(INDIA_GEOGRAPHY[zone]);
};

export const getCitiesForState = (zone: string, state: string) => {
  if (!zone || !state || !INDIA_GEOGRAPHY[zone] || !INDIA_GEOGRAPHY[zone][state]) return [];
  return INDIA_GEOGRAPHY[zone][state];
};
