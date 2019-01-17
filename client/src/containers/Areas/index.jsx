import React, { Component } from 'react';
import gql from "graphql-tag";
import { Link } from 'react-router-dom';
import { Query, Mutation } from "react-apollo";
import Popup from '../../components/Popup/index.jsx';
import { sortSensorsByType } from '../../utils';

const GET_AREAS = gql`
  query {
    areas {
      _id
      name
      sensors {
        name
        type
        status
      }
    }
  }
`;

const CREATE_AREA = gql`
  mutation createArea($name: String!) {
    createArea(name: $name) {
      _id
      name
      sensors {
        name
        type
        status
      }
    }
  }
`;

const updateCache = (cache, { data: { createArea } }) => {
  const { areas } = cache.readQuery({ query: GET_AREAS });
  cache.writeQuery({
    query: GET_AREAS,
    data: { areas: areas.concat(createArea) }
  });
}

class Area extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenAddArea: false,
      areaName: ''
    };
  }

  toggleAddArea(state) {
    this.setState({ isOpenAddArea: state });
  }

  saveNewArea(createArea) {
    createArea({ variables: { name: this.state.areaName } });
    this.setState({ areaName: '', isOpenAddArea: false })
  }

  render() {
    const { isOpenAddArea, areaName } = this.state;
    return (
      <Query query={GET_AREAS}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          return (
            <div>
              <div className="wrapper__header">
                <div className="title">List of Areas </div>
                <div >
                  <button className="btn--actions" onClick={() => this.toggleAddArea(true)}>Add Area</button>
                </div>
              </div>
              <div className="wrapper__body">
                {data.areas.map(({ _id, name, sensors }) => (
                  <div className="wrapper__body__area area" key={_id}>
                    <Link to={`/area/${_id}`}>
                      <div className="area__header">
                        <div className="title">{name}</div>
                      </div>
                      <div className="area__body">
                        {sortSensorsByType(sensors).map((sensorType, index) => (
                          <div className="sensor" key={index}>
                            <div className="title">{sensorType[0].type}:</div>
                            <div className="status">
                              {sensorType.filter(sensor => sensor.status).length}/{sensorType.length}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {isOpenAddArea &&
                <Mutation mutation={CREATE_AREA} update={updateCache} variables={{ name }}>
                  {createArea => (
                    <Popup
                      title="Add Area"
                      closePopup={() => this.toggleAddArea(false)}
                      savePopup={() => this.saveNewArea(createArea)}
                    >
                      <div className="row">
                        <label htmlFor="name">Name</label>
                        <input id="name" type="text" onChange={e => this.setState({ areaName: e.target.value })} />
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