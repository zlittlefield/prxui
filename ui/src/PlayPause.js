import React from 'react'
import
{
    Button
}
from 'grommet';

import
{
    Play,
    Pause
}
from 'grommet-icons';

export default function PlayPause( props )
{
    if( props.paused )
    {
        return ( <Button fill={false} plain={false} icon={<Play/>} label={""} onClick={() => {props.handle({paused: false})}}/> )
    }
    else
    {
        return ( <Button  fill={false} plain={false} icon={<Pause/>} label={""} onClick={() => {props.handle({paused: true})}}/> )
    }
}