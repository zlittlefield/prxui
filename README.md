# PRX UI

This is a repo for a common UI for the PRACSYS group at Rutgers University. The UI is built using React, Three.js, Grommet, and websockets with the C++ side.

### Starting UI

Do this once
```
cd ui/
bazel run @nodejs//:yarn install
```

To actually run the ui,
```
cd ui/
bazel run @nodejs//:yarn start
```
```