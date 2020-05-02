import * as THREE from 'three'
import React,
{
    useRef,
    useEffect,
    useState,
    useCallback,
    useMemo
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
        <meshPhongMaterial attach="material" color={props.color} />
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
        <sphereBufferGeometry attach="geometry" args={[props.radius,32,32]} />
        <meshPhongMaterial attach="material" color={props.color} />
        </mesh> )
}

function PrxCylinder( props )
{
    const mesh = useRef( () => new THREE.Mesh() )

    useFrame( () =>
    {
        mesh.current.position.set( ...props.position )
        var quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), Math.PI / 2 );
        var quaternion2 = new THREE.Quaternion( ...props.orientation );
        mesh.current.quaternion.multiplyQuaternions( quaternion2, quaternion )
    } )

    return ( <mesh ref={mesh} castShadow receiveShadow>
        <cylinderBufferGeometry attach="geometry" args={[props.radius,props.radius,props.height,32]} />
        <meshPhongMaterial attach="material" color={props.color} />
        </mesh> )
}

function PrxLine( props )
{
    const geometry = useMemo( () =>
    {
        return new THREE.BufferGeometry()
            .setFromPoints( props.points )
    }, [ props.points ] )
    return (
        <line geometry={geometry}>
            <lineBasicMaterial attach="material" color={'#9c88ff'} linewidth={20} linecap={'round'} linejoin={'round'} />
          </line>
    )
}

export default function PrxGeoms( props )
{
    const [ single_geoms, setGeoms ] = useState( [] );
    useEffect( () =>
    {
        setGeoms( props.geoms )
    } );
    return ( <React.Fragment> 
        {single_geoms.map(item => ((item.type=="line") && <React.Fragment key={item.name}><PrxLine points={item.points.map(v => new THREE.Vector3(...v))}/></React.Fragment>))}
        {single_geoms.map(item => ((item.type=="box") && <React.Fragment key={item.name}><PrxBox {...item} /></React.Fragment>))}
        {single_geoms.map(item => ((item.type=="sphere") && <React.Fragment key={item.name}><PrxSphere {...item} /></React.Fragment>))}
        {single_geoms.map(item => ((item.type=="cylinder") && <React.Fragment key={item.name}><PrxCylinder {...item} /></React.Fragment>))}
        </React.Fragment> )
}