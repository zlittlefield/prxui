import React,
{
    useMemo,
    useEffect,
    useState
}
from 'react'

import
{
    useThree
}
from 'react-three-fiber'

export default function Recorder( props )
{
    const
    {
        gl
    } = useThree()

    const [ past_record_state, updateRecord ] = useState( false );

    var recorder_object = useMemo( () =>
    {
        const chunks = [];
        const stream = gl.domElement.captureStream( 60 );
        const rec = new MediaRecorder( stream );

        rec.ondataavailable = e => chunks.push( e.data );
        rec.onstop = e =>
        {
            var blob = new Blob( chunks,
            {
                type: 'video/webm'
            } );
            const a = document.createElement( 'a' );
            a.download = 'screengrab.webm';
            a.href = URL.createObjectURL( blob );
            a.click();
        };
        return rec

    }, [ gl.domElement ] );

    useEffect( () =>
    {
        if( props.recording_state && !past_record_state )
        {
            updateRecord( true )
            recorder_object.start();
        }
        if( !props.recording_state && past_record_state )
        {
            updateRecord( false )
            recorder_object.stop();
        }
    }, [ recorder_object, props.recording_state ] );

    return null
}