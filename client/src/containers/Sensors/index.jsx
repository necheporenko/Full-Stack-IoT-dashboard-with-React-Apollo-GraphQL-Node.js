import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import Popup from '../../components/Popup/index.jsx';
import { sortSensorsByType } from '../../utils';

const GET_SENSORS = gql`
  query getSensors($_id: ID!){
    area(_id: $_id) {
      _id
      name
      sensors {
        _id
        name
        type
        status
        value
      }
    }
  }
`;

const CREATE_SENSOR = gql`
  mutation createSensor(
      $areaID: ID! 
      $name: String 
      $type: String
      $status: Boolean
      $value: String
    ) { createSensor(
          name: $name
          type: $type
          status: $status
          value: $value
          areaID: $areaID
        ) {
          _id
          name
          type
          status
          value     
        }
  }
`;

const DELETE_SENSOR = gql`
  mutation deleteSensor($_id: ID!) { 
    deleteSensor(_id: $_id) {
        _id   
      }
  }
`;

const UPDATE_AREA = gql`
mutation updateArea($_id: ID!, $name: String!) {
  updateArea (
    _id: $_id
    name: $name
  ) {
    name
  }
}
`;

const updateCacheCreateSensor = (cache, { createSensor }, areaID) => {
  const { area } = cache.readQuery({ query: GET_SENSORS, variables: { _id: areaID } });

  cache.writeQuery({
    query: GET_SENSORS,
    data: { area: Object.assign(area, { sensors: area.sensors.concat(createSensor) }) }
  });
}

const updateCacheDeleteSensor = (cache, { deleteSensor }, areaID) => {
  const { area } = cache.readQuery({ query: GET_SENSORS, variables: { _id: areaID } });

  cache.writeQuery({
    query: GET_SENSORS,
    data: { area: Object.assign(area, { sensors: area.sensors.filter(sensor => sensor._id !== deleteSensor._id) }) }
  });
}

const updateCacheEditArea = (cache, { updateArea }, areaID) => {
  const { area } = cache.readQuery({ query: GET_SENSORS, variables: { _id: areaID } });

  cache.writeQuery({
    query: GET_SENSORS,
    data: { area: Object.assign(area, { name: updateArea.name }) }
  });
}

class Area extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areaName: '',
      isOpenAddSensor: false,
      isOpenEditArea: false,
      isOpenEditSensor: false,
      sensor: {
        name: '',
        type: 'humidity',
        status: true
      }
    };
  }

  togglePopup(state, popup) {
    switch (popup) {
      case 'addSensor':
        this.setState({ isOpenAddSensor: state });
        break;
      case 'editArea':
        this.setState({ isOpenEditArea: state });
        break;
    }
  }

  saveNewSensor(createSensor) {
    const { name, type, status } = this.state.sensor;
    let value;
    switch (type) {
      case 'temperature':
        value = Math.floor(Math.random() * 15 + 10).toString();
        break;
      case 'humidity':
        value = Math.floor(Math.random() * 70 + 20).toString();
        break;
    }

    createSensor({ variables: { name, type, status: !!+status, value } });
    this.setState({ isOpenAddSensor: false });
  }

  updateCurrentArea(updateArea) {
    const { areaName } = this.state;

    updateArea({ variables: { name: areaName } });
    this.setState({ isOpenEditArea: false });
  }

  render() {
    const { isOpenAddSensor, isOpenEditArea } = this.state;
    const { location: { pathname } } = this.props;
    const areaID = pathname.slice(6);

    return (
      <Query query={GET_SENSORS} variables={{ _id: areaID }}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          return (
            <div>
              <div className="wrapper__header">
                <div className="title">Area: {data.area.name}</div>
                <div className="btns">
                  <Link to="/"><button className="btn--actions btn--actions--cancel">Back</button></Link>
                  <button
                    className="btn--actions"
                    onClick={() => this.togglePopup(true, 'editArea')}
                  >
                    Edit Area
                  </button>
                  <button
                    className="btn--actions"
                    onClick={() => this.togglePopup(true, 'addSensor')}
                  >
                    Add Sensor
                  </button>
                </div>
              </div>
              <div className="wrapper__body__sensors">
                {sortSensorsByType(data.area.sensors).map((sensorType, index) => (
                  <div className="wrapper__sensor" key={index}>
                    <div className="sensor__header">
                      <div className="title">{sensorType[0].type}</div>
                    </div>
                    <div className="sensor__body">
                      <table>
                        <thead>
                          <tr>
                            <td>ID</td>
                            <td>Name</td>
                            <td>Type</td>
                            <td>Status</td>
                            <td>Value</td>
                            <td>Actions</td>
                          </tr>
                        </thead>
                        <tbody>
                          {sensorType.map(sensor => (
                            <tr key={sensor._id}>
                              <td>{sensor._id}</td>
                              <td>{sensor.name}</td>
                              <td>{sensor.type}</td>
                              <td>{sensor.status ? "active" : "disable"}</td>
                              <td>{sensor.status ? sensor.value : "-"}</td>
                              <td>
                                <div className="table__btns">
                                  <Mutation
                                    mutation={DELETE_SENSOR}
                                    update={(cache, { data }) => updateCacheDeleteSensor(cache, data, areaID)}
                                    variables={{ _id: sensor._id }}
                                  >
                                    {deleteSensor => (
                                      <div className="delete" onClick={deleteSensor}>
                                        Delete
                                      </div>
                                    )}
                                  </Mutation>
                                  <div className="edit">Edit</div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              {isOpenAddSensor &&
                <Mutation
                  mutation={CREATE_SENSOR}
                  update={(cache, { data }) => updateCacheCreateSensor(cache, data, areaID)}
                  variables={{ areaID: areaID }}
                >
                  {createSensor => (
                    <Popup
                      title="Add Sensor"
                      closePopup={() => this.togglePopup(false, 'addSensor')}
                      savePopup={() => this.saveNewSensor(createSensor)}
                    >
                      <div className="row">
                        <label htmlFor="name">Name</label>
                        <input type="text" onChange={e => this.setState({ sensor: { ...this.state.sensor, name: e.target.value } })} />
                      </div>
                      <div className="row">
                        <label htmlFor="name2">Type</label>
                        <select onChange={e => this.setState({ sensor: { ...this.state.sensor, type: e.target.value } })}>
                          <option value="humidity">Humidity</option>
                          <option value="temperature">Temperature</option>
                        </select>
                      </div>
                      <div className="row">
                        <label htmlFor="name3">Status</label>
                        <select onChange={e => this.setState({ sensor: { ...this.state.sensor, status: e.target.value } })}>
                          <option value={1}>Active</option>
                          <option value={0}>Disable</option>
                        </select>
                      </div>
                    </Popup>
                  )}
                </Mutation>
              }

              {isOpenEditArea &&
                <Mutation
                  mutation={UPDATE_AREA}
                  update={(cache, { data }) => updateCacheEditArea(cache, data, areaID)}
                  variables={{ _id: areaID }}
                >
                  {updateArea => (
                    <Popup
                      title="Edit Area"
                      closePopup={() => this.togglePopup(false, 'editArea')}
                      savePopup={() => this.updateCurrentArea(updateArea)}
                    >
                      <div className="row">
                        <label>Name</label>
                        <input
                          type="text"
                          defaultValue={data.area.name}
                          onChange={e => this.setState({ areaName: e.target.value })}
                        />
                      </div>
                    </Popup>
                  )}
                </Mutation>
              }

            </div>
          );
        }}
      </Query>
    )
  }
}

export default Area;