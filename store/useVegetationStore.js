import { create } from "zustand"

export const useVegetationStore = create((set) => ({

	specimens: [],
  addSpecimen: (newSpecimenData) => {
    set(state => ({
      specimens: [...state.specimens, newSpecimenData],
    }))
  },
  deleteSpecimen: (specimenId) => {
    set((state) => ({
			specimens: state.specimens.filter((specimen) => specimen.id !== specimenId),
		}))
  }
	
}))