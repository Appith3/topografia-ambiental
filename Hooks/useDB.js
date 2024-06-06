import { useEffect, useState} from 'react'
import { useSQLiteContext } from 'expo-sqlite';

const useDB = () => {
	const [specimens, setSpecimens] = useState([])
	const [loading, setLoading] = useState(false)

	const db = useSQLiteContext();

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
		`)
	}
		
	const createSpecimen = async (specimen) => {
		const {id, classification, height, trunkDiameter, cupDiameter} = specimen

		const insertSpecimenStmt = await db.prepareAsync(
			'INSERT INTO Specimens (id, classification, height) VALUES ($id, $classification, $height);'
		);

		const insertSpecimenDetailStmt = await db.prepareAsync(
			'INSERT INTO Specimens_Detail (id_specimen, trunk_diameter, cup_diameter) VALUES ($id_specimen, $trunk_diameter, $cup_diameter);'
		);

		try {
			console.log(id, classification, height)
			const result = await insertSpecimenStmt.executeAsync({$id: id, $classification: classification, $height: height})

			if(trunkDiameter && cupDiameter) {
				try{
					await insertSpecimenDetailStmt.executeAsync({$id_specimen: id, $trunk_diameter: trunkDiameter, $cup_diameter: cupDiameter})
				} finally {
					await insertSpecimenDetailStmt.finalizeAsync()
				}
			}

			console.info('Specimen created successfully');
		} catch (error) {
			if (error.message.includes('database is locked')) {
        console.error("Database locked");
      } else {
        throw error; 
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
			setLoading(true); 
	
			const result = await getSpecimensStmt.executeAsync();
			const allRows = await result.getAllAsync();
	
			setSpecimens(allRows.map((row) => ({
				id: row.id,
				classification: row.classification,
				height: row.height,
				trunk_diameter: row.trunk_diameter,
				cup_diameter: row.cup_diameter,
			})));
	
			setLoading(false); 
		} catch (error) {
			console.error('Error fetching specimens:', error); 
		} finally {
			await getSpecimensStmt.finalizeAsync(); 
		}
	}

	useEffect(() => {
		initDB()
	}, []);
	
	return {
		createSpecimen,
		getAllSpecimens,
		specimens,
		loading
	}
}

export default useDB;