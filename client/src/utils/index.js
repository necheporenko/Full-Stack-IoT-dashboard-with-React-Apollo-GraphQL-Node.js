export const sortSensorsByType = sensors => {
  let sortedSensors = {};

  sensors.forEach(sensor => {
    if (!sortedSensors[sensor.type]) {
      sortedSensors[sensor.type] = [];
    }
    sortedSensors[sensor.type].push(sensor);
  })

  return Object.keys(sortedSensors).map(val => sortedSensors[val]);
}