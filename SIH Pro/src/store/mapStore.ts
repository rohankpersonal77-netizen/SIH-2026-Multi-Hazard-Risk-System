import { create } from 'zustand';
import type { GISLayerState } from '../types';

export type BaseLayerType = 'vector' | 'satellite' | 'terrain';
export type ForecastHorizon = '6h' | '12h' | '24h';

interface MapState {
  activeBaseLayer: BaseLayerType;
  layers: GISLayerState;
  forecastHorizon: ForecastHorizon;
  selectedHabitationId: string | null;
  selectedSiteId: string | null;
  mapCenter: [number, number];
  zoomLevel: number;
  setActiveBaseLayer: (layer: BaseLayerType) => void;
  setForecastHorizon: (horizon: ForecastHorizon) => void;
  toggleLayer: (layerKey: keyof GISLayerState) => void;
  setSelectedHabitationId: (id: string | null) => void;
  setSelectedSiteId: (id: string | null) => void;
  setMapCenter: (coords: [number, number], zoom?: number) => void;
  resetMap: () => void;
}

const defaultLayers: GISLayerState = {
  multiHazard: true,
  flood: true,
  landslide: true,
  rainfall: false,
  candidateSites: true,
  districtBoundaries: true,
  riverStations: true,
  riverNetwork: true,
  historicalFloods: false
};

export const useMapStore = create<MapState>((set) => ({
  activeBaseLayer: 'vector',
  layers: defaultLayers,
  forecastHorizon: '24h',
  selectedHabitationId: null,
  selectedSiteId: null,
  mapCenter: [19.3, 76.2],
  zoomLevel: 7,
  setActiveBaseLayer: (layer) => set({ activeBaseLayer: layer }),
  setForecastHorizon: (horizon) => set({ forecastHorizon: horizon }),
  toggleLayer: (layerKey) =>
    set((state) => ({
      layers: {
        ...state.layers,
        [layerKey]: !state.layers[layerKey]
      }
    })),
  setSelectedHabitationId: (id) => set({ selectedHabitationId: id }),
  setSelectedSiteId: (id) => set({ selectedSiteId: id }),
  setMapCenter: (coords, zoom = 9) => set({ mapCenter: coords, zoomLevel: zoom }),
  resetMap: () =>
    set({
      activeBaseLayer: 'vector',
      layers: defaultLayers,
      forecastHorizon: '24h',
      selectedHabitationId: null,
      selectedSiteId: null,
      mapCenter: [19.3, 76.2],
      zoomLevel: 7
    })
}));
