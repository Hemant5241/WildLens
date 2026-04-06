export interface AnalysisResult {
  commonName: string;
  scientificName: string;
  alternateNames: string[];
  category: string;
  isDangerous: boolean;
  dangerLevel: 'Critical' | 'High' | 'Medium' | 'Low' | 'None';
  venomousStatus: 'VENOMOUS' | 'NON-VENOMOUS' | 'MILDLY VENOMOUS' | 'N/A';
  confidence: number;
  habitat: string;
  behavior: string;
  dangerProfile: {
    threatType: string;
    threatLevel: string;
    actionRequired: string;
  };
  firstAid: {
    whatToDo: string[];
    whatNotToDo: string[];
  };
  conservationStatus: {
    iucnStatus: string;
    populationTrend: string;
    keyThreats: string[];
  };
  funFacts: string[];
  dietInfo: string;
  lifespanInfo: string;
  sizeInfo: string;
}

export interface ScanHistoryItem {
  id: string;
  imageData: string;
  result: AnalysisResult;
  timestamp: number;
}

export type AppPage = 'home' | 'analysis' | 'results' | 'history';
