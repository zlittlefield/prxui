import React from 'react';
import RootGraphics from './RootGraphics.js'
import SamplePlots from './SamplePlots.js'
import { Box } from 'grommet';
import { Long, serialize, deserialize } from 'bson';


let socket = new WebSocket("ws://localhost:9999/prx");
socket.binaryType = 'arraybuffer';

socket.onopen = function() {
  console.log("Message is sent...");
};
  
socket.onmessage = function (evt) { 
  var received_msg = evt.data;
  console.log(received_msg);
  const doc = deserialize(new Uint8Array(received_msg));
  console.log('doc:', doc);
};

socket.onclose = function() { 
  console.log("Connection is closed..."); 
};

export default class PRXApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box
        direction="row"
        border={{ color: 'brand', size: 'large' }}
      >
        <Box pad="small" background="dark-3" style={{width:"50%",position:"relative"}}>
          <SamplePlots />
        </Box>
        <Box pad="small" background="light-3" style={{width:"400px",height:"400px",position:"relative"}}>
          <RootGraphics />
        </Box>
      </Box>
    );
  }
}