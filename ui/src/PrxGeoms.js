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
    useFrame
}
from 'react-three-fiber'

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

export default function PrxGeoms( props )
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