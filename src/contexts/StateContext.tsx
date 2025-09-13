import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface StateInfo {
  id: string;
  name: string;
  capital: string;
  description: string;
  heroImage: string;
  highlights: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const statesInfo: Record<string, StateInfo> = {
  jharkhand: {
    id: 'jharkhand',
    name: 'Jharkhand',
    capital: 'Ranchi',
    description: 'The land of forests, known for its rich tribal culture and mineral wealth',
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    highlights: [
      'Netarhat Hill Station - Queen of Chotanagpur',
      'Dalma Wildlife Sanctuary - Elephant sanctuary',
      'Deoghar Temple Complex - Sacred Jyotirlinga',
      'Tribal villages with authentic homestays',
      'Traditional Dokra metal craft'
    ],
    colors: {
      primary: 'hsl(142, 69%, 35%)',
      secondary: 'hsl(25, 95%, 55%)',
      accent: 'hsl(200, 85%, 60%)'
    }
  },
  assam: {
    id: 'assam',
    name: 'Assam',
    capital: 'Guwahati',
    description: 'Land of tea gardens, wildlife, and rich cultural heritage',
    heroImage: 'https://images.unsplash.com/photo-1580371806876-e5ad86a68e0c?w=1920&q=80',
    highlights: [
      'Kaziranga National Park - One-horned rhinoceros',
      'Tea gardens of Jorhat and Dibrugarh',
      'Muga silk weaving traditions',
      'Kamakhya Temple - Shakti Peetha',
      'River island Majuli - Cultural center'
    ],
    colors: {
      primary: 'hsl(120, 60%, 30%)',
      secondary: 'hsl(35, 100%, 50%)',
      accent: 'hsl(180, 85%, 50%)'
    }
  },
  odisha: {
    id: 'odisha',
    name: 'Odisha',
    capital: 'Bhubaneswar',
    description: 'Land of temples, classical dance, and rich cultural heritage',
    heroImage: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&q=80',
    highlights: [
      'Konark Sun Temple - UNESCO World Heritage Site',
      'Puri Jagannath Temple - Char Dham pilgrimage',
      'Classical Odissi dance traditions',
      'Pattachitra painting art form',
      'Chilika Lake - Largest coastal lagoon'
    ],
    colors: {
      primary: 'hsl(280, 65%, 50%)',
      secondary: 'hsl(45, 100%, 55%)',
      accent: 'hsl(210, 85%, 55%)'
    }
  },
  bangalore: {
    id: 'bangalore',
    name: 'Bangalore',
    capital: 'Bangalore',
    description: 'Silicon Valley of India with perfect climate and modern culture',
    heroImage: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1920&q=80',
    highlights: [
      'Nandi Hills - Sunrise point and ancient temple',
      'Lalbagh Botanical Garden - Century-old gardens',
      'Bangalore Palace - Tudor-style architecture',
      'Craft breweries and rooftop cafes',
      'IT hub with modern startup culture'
    ],
    colors: {
      primary: 'hsl(220, 70%, 50%)',
      secondary: 'hsl(340, 75%, 55%)',
      accent: 'hsl(120, 60%, 50%)'
    }
  },
  mumbai: {
    id: 'mumbai',
    name: 'Mumbai',
    capital: 'Mumbai',
    description: 'City of dreams, Bollywood, and bustling street life',
    heroImage: 'https://images.unsplash.com/photo-1567613049458-2d9b0b8dde89?w=1920&q=80',
    highlights: [
      'Gateway of India - Iconic colonial monument',
      'Marine Drive - Queen\'s Necklace at night',
      'Bollywood film studios and tours',
      'Street food of Mohammed Ali Road',
      'Elephanta Caves - Ancient rock sculptures'
    ],
    colors: {
      primary: 'hsl(200, 80%, 45%)',
      secondary: 'hsl(25, 95%, 60%)',
      accent: 'hsl(290, 70%, 55%)'
    }
  }
};

interface StateContextType {
  selectedState: string;
  setSelectedState: (stateId: string) => void;
  currentStateInfo: StateInfo;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useStateContext must be used within a StateProvider');
  }
  return context;
};

interface StateProviderProps {
  children: ReactNode;
}

export const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
  const [selectedState, setSelectedState] = useState<string>('jharkhand');

  const currentStateInfo = statesInfo[selectedState] || statesInfo.jharkhand;

  return (
    <StateContext.Provider 
      value={{ 
        selectedState, 
        setSelectedState, 
        currentStateInfo 
      }}
    >
      {children}
    </StateContext.Provider>
  );
};