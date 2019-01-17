import mongoose from 'mongoose';

const areaSchema = new mongoose.Schema({
  name: { type: String },
  sensors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sensor' }]
});

export default mongoose.model('Area', areaSchema);