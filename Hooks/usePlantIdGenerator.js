import { useState, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

const usePlantIdGenerator = () => {
  const [sequenceNumbers, setSequenceNumbers] = useState({
    árbol: 1,
    arbusto: 1,
    palma: 1,
    'suculenta/cactácea': 1,
  }); 
  const db = useSQLiteContext(); 

  const fetchSequenceNumbers = async () => {
    try {
      const getLastIdStmt = await db.prepareAsync(
        'SELECT classification, MAX(id) AS last_id FROM Specimens GROUP BY classification;'
      );
      const result = await getLastIdStmt.executeAsync();
      const rows = await result.getAllAsync();
  
      const updatedSequenceNumbers = { ...sequenceNumbers }; // Create a copy of the current state
  
      for (const row of rows) {
        const { classification, last_id } = row;
        const id = Number(last_id.split('-')[1]);
        updatedSequenceNumbers[classification] = id ? id + 1 : 1;
      }
  
      setSequenceNumbers(updatedSequenceNumbers); // Update the state with the modified copy
  
    } catch (error) {
      console.error('Error fetching sequence numbers:', error);
    } finally {
      await getLastIdStmt.finalizeAsync();
    }
  };

  const generatePlantId = async (classification) => {
    const prefix = getPrefix(classification);

    const sequenceNumber = sequenceNumbers[classification]++;
    const paddedSequenceNumber = String(sequenceNumber).padStart(2, '0');
    const generatedId = `${prefix}-${paddedSequenceNumber}`;

    setSequenceNumbers({ ...sequenceNumbers, [classification]: sequenceNumber });

    return generatedId;
  };

  const getPrefix = (classification) => {
    switch (classification) {
			case 'árbol':
				return 'A';
			case 'arbusto':
				return 'B';
			case 'palma':
				return 'P';
			case 'suculenta/cactácea':
				return 'S'; 
			default:
				throw new Error(`Clasificación no válida: ${classification}`);
		}
  };

  useEffect(() => {
    fetchSequenceNumbers();
  }, []);

  return { generatePlantId };
};

export default usePlantIdGenerator;