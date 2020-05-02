import * as THREE from 'three'
import React,
{
    useRef,
    useEffect,
    useState
}
from 'react'
import
{
    Canvas
}
from 'react-three-fiber'

import CameraControls from './CameraControls.js'
import RecordCanvas from './RecordCanvas.js'
import PrxGeoms from './PrxGeoms.js'

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

export default function RootGraphics( props )
{

    const [ current_geoms, setGeoms ] = useState( [] );
    useEffect( () =>
    {
        setGeoms( props.object_props.geometries )
    } );

    return (
        <Canvas
        gl={{ alpha: true, antialias: true, logarithmicDepthBuffer: true }}
        camera={{ fov: 45, position: [0, -5, 20], up: [0, 0, 1], near: 0.1, far: 1000 }}
        shadowMap={true}
        onCreated={({ gl }) => {
          gl.setClearColor('white')
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.outputEncoding = THREE.sRGBEncoding
        }}>
        <RecordCanvas recording_state={props.recording_state} />
        <CameraControls />
        <ambientLight intensity={1.1} />
        <pointLight position={[-50, -50, 50]} intensity={2.2}  castShadow/>
        <PrxGroundPlane />
        <PrxGeoms geoms={current_geoms} />
      </Canvas> )
}