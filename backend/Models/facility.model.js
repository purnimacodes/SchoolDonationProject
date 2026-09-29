import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  classRooms: {
    available: { type: String, default: '0' },
    required: { type: String, default: '0' }
  },
  buildingElectricity: {
    light: {
      available: { type: String, default: 'NO' },
      required: { type: String, default: 'NO' }
    },
    fan: {
      available: { type: String, default: '0' },
      required: { type: String, default: '0' }
    }
  },
  drinkingWater: {
    available: { type: String, default: '0' },
    required: { type: String, default: '0' }
  },
  benchDesk: {
    available: { type: String, default: '0' },
    required: { type: String, default: '0' }
  },
  boysToilet: {
    available: { type: String, default: '0' },
    required: { type: String, default: '0' }
  },
  girlsToilet: {
    available: { type: String, default: '0' },
    required: { type: String, default: '0' }
  },
  cwsnToilet: {
    available: { type: String, default: '0' },
    required: { type: String, default: '0' }
  },
  playground: { type: String, default: 'NO' },
  ramp: { type: String, default: 'NO' },
  boundaryWall: { type: String, default: 'NO' },
  kitchenMdm: { type: String, default: 'NO' }
}, { timestamps: true });

export const Facility = mongoose.model('Facility', facilitySchema);
