import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    areas: [Area]
    area(_id: ID!): Area
  }

  type Area {
    _id: ID!
    name: String
    sensors: [Sensor]
  }

  extend type Mutation {
    createArea(name: String! sensors: String): Area
    updateArea(_id: ID! name: String!): Area
    deleteArea(_id: ID! name: String): Area
  }
`;
