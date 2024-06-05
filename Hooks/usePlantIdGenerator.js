import { useState } from 'react';

const usePlantIdGenerator = () => {
  const [sequenceNumbers, setSequenceNumbers] = useState({
    árbol: 1,
    arbusto: 1,
    palma: 1,
    'suculenta/cactácea': 1 
  });

  const generatePlantId = (classification) => {
    const prefix = getPrefix(classification);
    const sequenceNumber = sequenceNumbers[classification]++;
    const paddedSequenceNumber = String(sequenceNumber).padStart(2, '0');
    return `${prefix}-${paddedSequenceNumber}`;
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

  return { generatePlantId };
};

export default usePlantIdGenerator;
