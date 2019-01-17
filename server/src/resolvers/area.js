import { Area } from '../models';

export default {
  Query: {
    areas: (root, args, context, info) => {
      return Area.find({}).populate('sensors');
    },
    area: (root, { _id }) => {
      return Area.findById(_id).populate('sensors');
    }
  },
  Mutation: {
    createArea: (_, { name, sensors = [] }) => {
      return Area.create({ name, sensors });
    },
    updateArea: (_, { _id, name }) => {
      return Area.findOneAndUpdate(
        { _id: _id },
        { name: name },
        { new: true },
        function (err) {
          if (err) return console.log(err);
        }
      )
    },
    deleteArea: (_, { _id }) => {
      return Area.findByIdAndRemove(_id).exec();
    }
  }
};  