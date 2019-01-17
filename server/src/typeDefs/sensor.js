import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    sensors: [Sensor]
    sensor(_id: ID!): Sensor
  }

  type Sensor {
    _id: ID!
    name: String
    type: String
    status: Boolean
    value: String
    areaID: ID
  }

  extend type Mutation {
    createSensor(id: ID name: String type: String status: Boolean value: String areaID: ID!): Sensor
    updateSensor(_id: ID! name: String type: String status: Boolean value: String areaID: ID): Sensor
    deleteSensor(_id: ID! name: String type: String status: Boolean value: String areaID: ID): Sensor
  }
`;

