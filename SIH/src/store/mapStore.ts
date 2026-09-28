import { create } from 'zustand';
import type { GISLayerState } from '../types';

export type BaseLayerType = 'vector' | 'satellite' | 'terrain';

interface MapState {
  activeBaseLayer: BaseLayerType;
  layers: GISLayerState;
  selectedHabitationId: string | null;
  selectedSiteId: string | null;
  mapCenter: [number, number];
  zoomLevel: number;
  setActiveBaseLayer: (layer: BaseLayerType) => void;
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
  candidateSites: true
};

export const useMapStore = create<MapState>((set) => ({
  activeBaseLayer: 'vector',
  layers: defaultLayers,
  selectedHabitationId: null,
  selectedSiteId: null,
  mapCenter: [18.5204, 73.8567],
  zoomLevel: 9,
  setActiveBaseLayer: (layer) => set({ activeBaseLayer: layer }),
  toggleLayer: (layerKey) =>
    set((state) => ({
      layers: {
        ...state.layers,
        [layerKey]: !state.layers[layerKey]
      }
    })),
  setSelectedHabitationId: (id) => set({ selectedHabitationId: id }),
  setSelectedSiteId: (id) => set({ selectedSiteId: id }),
  setMapCenter: (coords, zoom = 11) => set({ mapCenter: coords, zoomLevel: zoom }),
  resetMap: () =>
    set({
      activeBaseLayer: 'vector',
      layers: defaultLayers,
      selectedHabitationId: null,
      selectedSiteId: null,
      mapCenter: [18.5204, 73.8567],
      zoomLevel: 9
    })
}));
