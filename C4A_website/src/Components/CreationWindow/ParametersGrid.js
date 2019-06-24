import React, { Component } from 'react';

import styles from './style.css';
import CustomSlider from './CustomSlider'

import consts from '../../Providers/consts';


class ParametersGrid extends Component {

  changeLinesValue(e) {
    let params = this.props.parameters;
    params.lines = e;
    this.props.changeGridParameters(params);
  }

  changeColumnsValue(e) {
    let params = this.props.parameters;
    params.columns = e;
    this.props.changeGridParameters(params);
  }

  changePatternValue(e) {
    let params = this.props.parameters;
    if(e.target.value === "0") {
      params.background = null;
      params.backgroundId = null;
    }
    else {
      params.background = consts.url() + this.props.patterns[e.target.value].nom;
      params.backgroundId = Number(e.target.value);
    }
    this.props.changeGridParameters(params);
  }

  render() {
    let patterns = [];
    if(this.props.patterns) {
      Object.values(this.props.patterns).forEach(pattern => {
        if(pattern.id === this.props.parameters.backgroundId) {
          patterns.push(<option selected value={pattern.id}>{pattern.id}</option>)
        }
        else {
          patterns.push(<option value={pattern.id}>{pattern.id}</option>)
        }
      });
    }

    return (
        <div className={styles.parametersgrid}>
            <div className="content">
                <label>Lignes : </label>
                <CustomSlider
                    changeSize={this.changeLinesValue.bind(this)} 
                    min={1} 
                    max={50} 
                    default={this.props.parameters.lines} 
                />

                <label>Colonnes : </label>
                <CustomSlider
                    changeSize={this.changeColumnsValue.bind(this)} 
                    min={1} 
                    max={50} 
                    default={this.props.parameters.columns} 
                />

                <label>Pattern : </label>
                <select id="select" onChange={this.changePatternValue.bind(this)}>
                  <option value="0">none</option>
                  {patterns}
                </select>
            </div>
        </div>
    );
  }
}

export default ParametersGrid;
