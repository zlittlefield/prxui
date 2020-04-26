import React from 'react';
import { Button } from 'grommet';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries
} from 'react-vis';

function generateData() {
  return [...new Array(10)].map(row => ({
    x: Math.random() * 5,
    y: Math.random() * 10
  }));
}

const MODE = ['noWobble', 'gentle', 'wobbly', 'stiff'];

export default class SamplePlots extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: generateData(),
      modeIndex: 0
    };
  }


  render() {

    const updateModeIndex = increment => () => {
      const newIndex = this.state.modeIndex + (increment ? 1 : -1);
      const modeIndex =
        newIndex < 0 ? MODE.length - 1 : newIndex >= MODE.length ? 0 : newIndex;
      this.setState({
        modeIndex
      });
    };

    const {modeIndex, data} = this.state;
    return (
      <div className="centered-and-flexed">
        <div className="centered-and-flexed-controls">
          <Button
            onClick={updateModeIndex(false)}
            label={'PREV'}
          />
          <div> {`ANIMATION TECHNIQUE: ${MODE[modeIndex]}`} </div>
          <Button
            onClick={updateModeIndex(true)}
            label={'NEXT'}
          />
        </div>
        <XYPlot width={300} height={300}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <MarkSeries animation={MODE[modeIndex]} data={data} />
        </XYPlot>
        <Button
          onClick={() => this.setState({data: generateData()})}
          label={'UPDATE DATA'}
        />
      </div>
    );
  }
}