import React from 'react'
import
{
    Grid,
    Button,
}
from 'grommet';

import
{
    StopFill,
    Radial,
    RadialSelected
}
from 'grommet-icons';

export default function RecordControl( props )
{
    if( props.recording )
    {
        return (
            <Grid
                rows={['flex']}
                columns={['auto', 'auto']}
                areas={[
                  { name: 'recording_now', start: [0, 0], end: [0, 0] },
                  { name: 'stop_recording', start: [1, 0], end: [1, 0] },
                ]}
              >
              <Button gridArea="recording_now" width="large" fill={false} plain={false} icon={<RadialSelected color={"#ff0000"}/>} color={"#ff0000"} label={""} disabled/> 
              <Button gridArea="stop_recording" width="large" fill={false} plain={false} icon={<StopFill/>} label={""} onClick={() => {props.handle({recording: false})}}/>
            </Grid> )
    }
    else
    {
        return (
            <Grid
                rows={['flex']}
                columns={['auto', 'auto']}
                areas={[
                  { name: 'recording_now', start: [0, 0], end: [0, 0] },
                  { name: 'stop_recording', start: [1, 0], end: [1, 0] },
                ]}
              >
              <Button gridArea="recording_now" width="large" fill={false} plain={false} icon={<Radial color={"#ff0000"}/>} label={""} onClick={() => {props.handle({recording: true})}}/>
              <Button gridArea="stop_recording" width="large" fill={false} plain={false} icon={<StopFill/>} label={""} onClick={() => {}} disabled/>
            </Grid> )
    }
}