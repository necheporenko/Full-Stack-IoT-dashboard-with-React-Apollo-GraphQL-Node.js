import { Area, Sensor } from '../models';

export default {
  Query: {
    sensors: () => Sensor.find({}),
    sensor: (_, { _id }) => Sensor.findById(_id)
  },
  Mutation: {
    createSensor: (_, { name, type, status, value, areaID }) => {
      const sensor = Sensor.create({ name, type, status, value, areaID });

      sensor.then(sensor => {
        Area.findById(areaID).then(prevResultArea => {
          Area.update({ _id: areaID }, { sensors: [...prevResultArea.sensors, sensor._id] }, { new: true },
            function (err) { if (err) return console.log(err) }
          )
        })
      });

      return sensor;
    },
    updateSensor: (_, { _id, name, type, status }) => {
      return Sensor.findOneAndUpdate({ _id: _id }, { name, type, status }, { new: true },
        function (err) { if (err) return console.log(err) }
      )
    },
    deleteSensor: (_, { _id }) => {
      return Sensor.findByIdAndRemove(_id).exec();
    }
  }
};

