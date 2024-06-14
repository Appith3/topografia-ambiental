import { useEffect, useState} from 'react'
import { useSQLiteContext } from 'expo-sqlite'
import { useStore } from 'zustand'

import { useVegetationStore } from '../store/useVegetationStore'

const useDB = () => {
	const [loading, setLoading] = useState(false)

	const db = useSQLiteContext()

	const { addSpecimen } = useStore(useVegetationStore)

	const initDB = async () => {
		await db.execAsync(`
			CREATE TABLE IF NOT EXISTS Specimens (
				id TEXT PRIMARY KEY,
				classification TEXT,
				height REAL
			);
			CREATE TABLE IF NOT EXISTS Specimens_Detail (
				id_specimen TEXT PRIMARY KEY REFERENCES Specimens(id),
				trunk_diameter REAL,
				cup_diameter REAL
			);
			CREATE TABLE IF NOT EXISTS Specimens_Note (
				id_specimen TEXT PRIMARY KEY REFERENCES Specimens(id),
				note TEXT
			);
		`)
	}
		
	const createSpecimen = async (specimen) => {
		const {id, classification, height, note, trunk_diameter, cup_diameter} = specimen

		const insertSpecimenStmt = await db.prepareAsync(
			'INSERT INTO Specimens (id, classification, height) VALUES ($id, $classification, $height);'
		)

		const insertSpecimenDetailStmt = await db.prepareAsync(
			'INSERT INTO Specimens_Detail (id_specimen, trunk_diameter, cup_diameter) VALUES ($id_specimen, $trunk_diameter, $cup_diameter);'
		)

		const insertSpecimenNoteStmt = await db.prepareAsync(
			'INSERT INTO Specimens_Note (id_specimen, note) VALUES ($id_specimen, $note);'
		)

		try {
			setLoading(true) 

			await insertSpecimenStmt.executeAsync({$id: id, $classification: classification, $height: height})

			if(note) {
				try {
					await insertSpecimenNoteStmt.executeAsync({$id_specimen: id, $note: note})
				} catch(error) {
					console.error('error: ', error)
				} finally {
					await insertSpecimenNoteStmt.finalizeAsync()
				}
			}

			if(trunk_diameter || cup_diameter) {
				try{
					await insertSpecimenDetailStmt.executeAsync({$id_specimen: id, $trunk_diameter: trunk_diameter, $cup_diameter: cup_diameter})
				} catch(error) {
					console.error('error: ', error)
				} finally {
					await insertSpecimenDetailStmt.finalizeAsync()
				}
			}

			setLoading(false)
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
			'SELECT * FROM Specimens s LEFT JOIN Specimens_Detail sd ON s.id = sd.id_specimen;'
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
			'SELECT * FROM Specimens s LEFT JOIN Specimens_Detail sd ON s.id = sd.id_specimen LEFT JOIN Specimens_Note sn ON sn.id_specimen = s.id WHERE s.id = $specimenId;'
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
				note: specimenRow.note || '',
			}
	
			return specimenData
		} catch (error) {
			console.error('Error getting specimen by ID:', error)
			return null;
		} finally {
			await getByIdStmt.finalizeAsync()
		}
	}

	const updateSpecimenClassification = async (specimenId, newClassification) => {
		const updateStmt = await db.prepareAsync(
			'UPDATE Specimens SET classification = $newClassification WHERE id = $specimenId;'
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
			'UPDATE Specimens SET height = $newHeight WHERE id = $specimenId;'
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
			'UPDATE Specimens_Detail SET trunk_diameter = $newTrunkDiameter WHERE id_specimen = $specimenId;'
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
			'UPDATE Specimens_Detail SET cup_diameter = $newCupDiameter WHERE id_specimen = $specimenId;'
		)
	
		try {
			await updateStmt.executeAsync({ $specimenId: specimenId, $newCupDiameter: newCupDiameter })
		} catch (error) {
			console.error('Error updating specimen cup diameter:', error)
		} finally {
			await updateStmt.finalizeAsync()
		}
	}

	const updateSpecimenNote = async (specimenId, newNote) => {
		if(!newNote) return

		const updateStmt = await db.prepareAsync(
			'UPDATE Specimens_Note SET note = $newNote WHERE id_specimen = $specimenId;'
		)
	
		try {
			await updateStmt.executeAsync({ $specimenId: specimenId, $newNote: newNote })
		} catch (error) {
			console.error('Error updating specimen height:', error)
		} finally {
			await updateStmt.finalizeAsync()
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
		updateSpecimenNote,
		updateSpecimenTrunkDiameter,
		updateSpecimenCupDiameter,
		loading
	}
}

export default useDB