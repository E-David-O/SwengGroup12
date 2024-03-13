import React from 'react';

// Example Props Format: 
// objectAccuracyData = [{ object: 'Cat', accuracy: 98.5 }, { object: 'Dog', accuracy: 89.7 }]

function ObjectAccuracy({ objectAccuracyData }) {
  return (
    <div className="object-accuracy">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Object Detection Accuracy</h3>
      <ul className="space-y-2">
        {objectAccuracyData.map((item, index) => (
          <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white">
            <span>{item.object}</span>
            <span>{item.accuracy.toFixed(2)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ObjectAccuracy;
