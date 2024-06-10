import { useEffect, useState} from 'react'
import { useSQLiteContext } from 'expo-sqlite'
import { useStore } from 'zustand'

import { useVegetationStore } from '../store/useVegetationStore'

const useDB = () => {
	const [loading, setLoading] = useState(false)

	const db = useSQLiteContext()

	const { addSpecimen, deleteSpecimen } = useStore(useVegetationStore)

	const initDB = async () => {
		await db.execAsync(`
			CREATE TABLE IF NOT EXISTS Specimens (
				id TEXT PRIMARY KEY,
				classification TEXT,
				height REAL
			)
			CREATE TABLE IF NOT EXISTS Specimens_Detail (
				id_specimen TEXT PRIMARY KEY REFERENCES Specimens(id),
				trunk_diameter REAL,
				cup_diameter REAL
			)
		`)
	}
		
	const createSpecimen = async (specimen) => {
		const {id, classification, height, trunk_diameter, cup_diameter} = specimen

		const insertSpecimenStmt = await db.prepareAsync(
			'INSERT INTO Specimens (id, classification, height) VALUES ($id, $classification, $height)'
		)

		const insertSpecimenDetailStmt = await db.prepareAsync(
			'INSERT INTO Specimens_Detail (id_specimen, trunk_diameter, cup_diameter) VALUES ($id_specimen, $trunk_diameter, $cup_diameter)'
		)

		try {
			await insertSpecimenStmt.executeAsync({$id: id, $classification: classification, $height: height})

			if(trunk_diameter || cup_diameter) {
				try{
					await insertSpecimenDetailStmt.executeAsync({$id_specimen: id, $trunk_diameter: trunk_diameter, $cup_diameter: cup_diameter})
				} finally {
					await insertSpecimenDetailStmt.finalizeAsync()
				}
			}

			addSpecimen(specimen)

		} catch (error) {
			if (error.message.includes('database is locked')) {
        console.error("Database locked")
      } else {
        throw error 
      }
		}
		finally {
			await insertSpecimenStmt.finalizeAsync()
		}
	}

	const getAllSpecimens = async () => {
		const getSpecimensStmt = await db.prepareAsync(
			'SELECT * FROM Specimens s LEFT JOIN Specimens_Detail sd ON s.id = sd.id_specimen'
		)

		try {
			setLoading(true) 
	
			const result = await getSpecimensStmt.executeAsync()
			const allRows = await result.getAllAsync()
	
			for(specimen of allRows) {
				addSpecimen(specimen)
			}
	
			setLoading(false) 
		} catch (error) {
			console.error('Error fetching specimens:', error) 
		} finally {
			await getSpecimensStmt.finalizeAsync() 
		}
	}

	const getSpecimenById = async (specimenId) => {
		const getByIdStmt = await db.prepareAsync(
			'SELECT * FROM Specimens s LEFT JOIN Specimens_Detail sd ON s.id = sd.id_specimen WHERE s.id = $specimenId'
		)
	
		try {
			const result = await getByIdStmt.executeAsync({ $specimenId: specimenId })
			const specimenRow = await result.getFirstAsync()
	
			if (!specimenRow) {
				console.warn(`Specimen with ID ${specimenId} not found`)
				return null
			}
	
			const specimenData = {
				classification: specimenRow.classification,
				height: specimenRow.height,
				trunk_diameter: specimenRow.trunk_diameter || null,
				cup_diameter: specimenRow.cup_diameter || null,
				}
	
			return specimenData
		} catch (error) {
			console.error('Error getting specimen by ID:', error)
			return null
		} finally {
			await getByIdStmt.finalizeAsync()
		}
	}

	const updateSpecimenClassification = async (specimenId, newClassification) => {
		const updateStmt = await db.prepareAsync(
			'UPDATE Specimens SET classification = $newClassification WHERE id = $specimenId'
		)
	
		try {
			await updateStmt.executeAsync({ $specimenId: specimenId, $newClassification: newClassification })
		} catch (error) {
			console.error('Error updating specimen classification:', error)
		} finally {
			await updateStmt.finalizeAsync()
		}
	}

	const updateSpecimenHeight = async (specimenId, newHeight) => {
		const updateStmt = await db.prepareAsync(
			'UPDATE Specimens SET height = $newHeight WHERE id = $specimenId'
		)
	
		try {
			await updateStmt.executeAsync({ $specimenId: specimenId, $newHeight: newHeight })
		} catch (error) {
			console.error('Error updating specimen height:', error)
		} finally {
			await updateStmt.finalizeAsync()
		}
	}

	const updateSpecimenTrunkDiameter = async (specimenId, newTrunkDiameter) => {
		if (!newTrunkDiameter) return // No update if new value is null/undefined
	
		const updateStmt = await db.prepareAsync(
			'UPDATE Specimens_Detail SET trunk_diameter = $newTrunkDiameter WHERE id_specimen = $specimenId'
		)
	
		try {
			await updateStmt.executeAsync({ $specimenId: specimenId, $newTrunkDiameter: newTrunkDiameter })
		} catch (error) {
			console.error('Error updating specimen trunk diameter:', error)
		} finally {
			await updateStmt.finalizeAsync()
		}
	}

	const updateSpecimenCupDiameter = async (specimenId, newCupDiameter) => {
		if (!newCupDiameter) return // No update if new value is null/undefined
	
		const updateStmt = await db.prepareAsync(
			'UPDATE Specimens_Detail SET cup_diameter = $newCupDiameter WHERE id_specimen = $specimenId'
		)
	
		try {
			await updateStmt.executeAsync({ $specimenId: specimenId, $newCupDiameter: newCupDiameter })
		} catch (error) {
			console.error('Error updating specimen cup diameter:', error)
		} finally {
			await updateStmt.finalizeAsync()
		}
	}

	const deleteSpecimenById = async (specimenId) => {
		const deleteStmt = await db.prepareAsync(
			'DELETE FROM Specimens WHERE id = $specimenId'
		)
	
		try {
			await deleteStmt.executeAsync({ $specimenId: specimenId })
			deleteSpecimen(specimenId)
			console.log(`Specimen with ID ${specimenId} deleted successfully`)
		} catch (error) {
			console.error('Error deleting specimen:', error)
		} finally {
			await deleteStmt.finalizeAsync()
		}
	}

	useEffect(() => {
		initDB()
	}, [])
	
	return {
		createSpecimen,
		getAllSpecimens,
		getSpecimenById,
		updateSpecimenClassification,
		updateSpecimenHeight,
		updateSpecimenTrunkDiameter,
		updateSpecimenCupDiameter,
		deleteSpecimenById,
		loading
	}
}

export default useDB