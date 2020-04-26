import React,
{
    useEffect
}
from "react";
import
{
    Canvas,
    useThree
}
from "react-three-fiber";
import
{
    MapControls
}
from "three/examples/jsm/controls/OrbitControls";

export default function CameraControls()
{
    const
    {
        camera,
        gl
    } = useThree();
    useEffect(
        () =>
        {
            const controls = new MapControls( camera, gl.domElement );

            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.screenSpacePanning = true;
            controls.minDistance = 0;
            controls.maxDistance = 200;
            controls.maxPolarAngle = Math.PI / 2;

            return () =>
            {
                controls.dispose();
            };
        },
        [ camera, gl ]
    );
    return null;
}