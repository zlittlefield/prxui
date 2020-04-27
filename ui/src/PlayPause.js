import React from 'react'

import Button from 'react-bootstrap/Button'

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
        return ( <Button onClick={() => {props.handle({paused: false})}}><Play/></Button> )
    }
    else
    {
        return ( <Button onClick={() => {props.handle({paused: true})}}><Pause/></Button> )
    }
}