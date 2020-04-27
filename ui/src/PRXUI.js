import React,
{
    useState,
    useEffect
}
from 'react'

import
{
    Grid,
    Box,
    Grommet,
}
from 'grommet';

import
{
    serialize,
    deserialize
}
from 'bson';

import useWebSocket from 'react-use-websocket';
import FPSStats from "react-fps-stats";

import RootGraphics from './RootGraphics.js'
import PlayPause from './PlayPause.js'
import RecordControl from './RecordControl.js'

const theme = {
    global:
    {
        edgeSize:
        {
            small: '2px',
        },
    },
    button:
    {
        padding:
        {
            horizontal: '2px'
        }
    }

};

export default function PRXUI()
{
    const [ current_state, setState ] = useState(
    {
        geoms: []
    } );

    const [ feedback_state, setFeedbackState ] = useState(
    {
        paused: true,
    } );

    const [ recording_state, setRecordingState ] = useState(
    {
        recording: false,
    } );

    const [ sendMessage, lastMessage, readyState, getWebSocket ] = useWebSocket( "ws://localhost:9999/prx" );

    useEffect( () =>
    {
        if( getWebSocket() !== null )
        {
            getWebSocket()
                .binaryType = 'arraybuffer';
        }
    }, [ readyState ] );

    useEffect( () =>
    {
        if( getWebSocket() !== null )
        {
            sendMessage( serialize( feedback_state ) )
        }
    } );

    useEffect( () =>
    {
        if( getWebSocket() !== null && lastMessage !== null )
        {
            var received_msg = lastMessage.data;
            const current_message = deserialize( new Uint8Array( received_msg ) );
            //merge current_state and current_message, then setState
            var cloned_state = Object.assign(
            {}, current_state )

            if( current_message.new_geoms )
            {
                for( var index = 0; index < current_message.new_geoms.length; index++ )
                {
                    var geom_message = current_message.new_geoms[ index ]
                    var result = cloned_state.geoms.find( geom => geom.name == geom_message.name );
                    if( result )
                    {
                        result = geom_message
                    }
                    else
                    {
                        cloned_state.geoms.push( geom_message )
                    }
                }
            }
            if( current_message.geom_poses )
            {
                for( var index = 0; index < current_message.geom_poses.length; index++ )
                {
                    var pose_message = current_message.geom_poses[ index ]
                    const result = cloned_state.geoms.find( geom => geom.name == pose_message.name );
                    if( result )
                    {
                        result.position = pose_message.position
                        result.orientation = pose_message.orientation
                    }
                }
            }
            setState( cloned_state )
        }
    }, [ lastMessage ] );

    return ( <Grommet theme={theme}>
      <Grid
          border={{size: 'xsmall' }}
          pad="none" 
          rows={['99vh']}
          columns={['10vw', 'auto']}
          gap="xxsmall"
          areas={[
            { name: 'sidebar', start: [0, 0], end: [0, 0] },
            { name: 'graphics', start: [1, 0], end: [1, 0] },
          ]}
        >
          <Box pad="none" border={{ color: 'border', size: 'xsmall' }} gridArea="sidebar" background="light-5" >
              <PlayPause paused={feedback_state.paused} handle={setFeedbackState}/>
              <RecordControl recording={recording_state.recording} handle={setRecordingState}/>
          </Box>
          <Box pad="none" border={{ color: 'border', size: 'xsmall' }} gridArea="graphics" style={{position:"relative"}}>
              <FPSStats top='0' right='0' bottom='auto' left='auto'/>
              <RootGraphics object_props={current_state} recording_state={recording_state.recording} />
          </Box>
      </Grid>
    </Grommet> );
}