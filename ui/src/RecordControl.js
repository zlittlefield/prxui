import React from 'react'

import Button from 'react-bootstrap/Button'

import
{
    StopFill,
    Radial
}
from 'grommet-icons';

import Spinner from 'react-bootstrap/Spinner'

export default function RecordControl( props )
{
    if( props.recording )
    {
        return (
            <React.Fragment>
              <Button color={"#ff0000"} disabled>
              <Spinner as="span" size="sm" animation="grow" />
              </Button> 
              <Button onClick={() => {props.handle({recording: false})}}>
              <StopFill/>
              </Button>
            </React.Fragment> )
    }
    else
    {
        return (
            <React.Fragment>
              <Button onClick={() => {props.handle({recording: true})}}>
              <Radial/>
              </Button>
              <Button onClick={() => {}} disabled>
              <StopFill/>
              </Button>
            </React.Fragment> )
    }
}