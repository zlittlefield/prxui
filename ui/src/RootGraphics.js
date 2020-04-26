import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React,
{
    Suspense,
    useCallback,
    useRef,
    useMemo,
    useEffect,
    useState
}
from 'react'
import
{
    Canvas,
    useFrame,
    useThree
}
from 'react-three-fiber'

import CameraControls from './CameraControls.js'

function PrxBox( props )
{
    const mesh = useRef( () => new THREE.Mesh() )

    useFrame( () =>
    {
        mesh.current.position.set( ...props.position )
        mesh.current.quaternion.set( ...props.orientation )
    } )

    return ( <mesh ref={mesh} castShadow receiveShadow>
        <boxBufferGeometry attach="geometry" args={props.dims} />
        <meshStandardMaterial attach="material" color={props.color} />
        </mesh> )
}

function PrxSphere( props )
{
    const mesh = useRef( () => new THREE.Mesh() )

    useFrame( () =>
    {
        mesh.current.position.set( ...props.position )
        mesh.current.quaternion.set( ...props.orientation )
    } )

    return ( <mesh ref={mesh} castShadow receiveShadow>
        <sphereBufferGeometry attach="geometry" args={[props.radius,16,16]} />
        <meshStandardMaterial attach="material" color={props.color} />
        </mesh> )
}

function PrxGroundPlane()
{
    const mesh = useRef( () => new THREE.Mesh() )

    return ( <React.Fragment> 
      <mesh ref={mesh} receiveShadow>
        <planeBufferGeometry attach="geometry" args={[200,200]} />
        <meshStandardMaterial attach="material" color={"#bbbbbb"} />
        </mesh>
        <axesHelper position={[0,0,.001]}/>
        </React.Fragment> )

}

function PrxGeoms( props )
{
    const [ single_geoms, setGeoms ] = useState( [] );
    useEffect( () =>
    {
        setGeoms( props.geoms )
    } );
    return ( <React.Fragment> 
        {single_geoms.map(item => ((item.type=="box") && <React.Fragment key={item.name}><PrxBox position={item.position} orientation={item.orientation} dims={item.dims} color={item.color}/></React.Fragment>))}
        {single_geoms.map(item => ((item.type=="sphere") && <React.Fragment key={item.name}><PrxSphere position={item.position} orientation={item.orientation} radius={item.radius} color={item.color}/></React.Fragment>))}
        </React.Fragment> )
}

function Recorder( props )
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

export default function RootGraphics( props )
{

    const [ current_geoms, setGeoms ] = useState( [] );
    useEffect( () =>
    {
        setGeoms( props.object_props.geoms )
    } );

    return ( <div style={{ width: '100%', height: '100%' }} >
      <Canvas
        gl={{ alpha: true, antialias: true, logarithmicDepthBuffer: true }}
        camera={{ fov: 45, position: [0, -5, 20], up: [0, 0, 1], near: 0.1, far: 1000 }}
        shadowMap={true}
        onCreated={({ gl }) => {
          gl.setClearColor('white')
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.outputEncoding = THREE.sRGBEncoding
        }}>
        <Recorder recording_state={props.recording_state} />
        <CameraControls />
        <ambientLight intensity={1.1} />
        <pointLight position={[-50, -50, 50]} intensity={2.2}  castShadow/>
        <PrxGroundPlane />
        <PrxGeoms geoms={current_geoms} />
      </Canvas>
    </div> )
}