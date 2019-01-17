import mongoose from 'mongoose';

const sensorSchema = new mongoose.Schema({
  name: { type: String },
  type: { type: String },
  status: { type: Boolean },
  value: { type: String },
  areaID: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' }
});

export default mongoose.model('Sensor', sensorSchema);


