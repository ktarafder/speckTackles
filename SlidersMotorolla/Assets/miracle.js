// -----JS CODE New-----
// When using Spectacles (2021), you should track marker only once, 
// and detach the marker on found to performance

// @ui {"widget":"label", "label":"Must Set Device Tracking to 'World' on Camera object"}
// @input Component.MarkerTrackingComponent markerComponent
// @input bool trackMarkerOnce = true
// @input bool detachOnFound = true {"showIf": "trackMarkerOnce"}

if (!script.markerComponent) {
    print("Please assign a marker component to track");
    return;
}

// Get info about object to track
var objectT;
var originalPos; 
var originalRot; 
var originalScale; 

function parentChildrenToParent(childrenParent) {
    var parentMarkerChildren = global.scene.createSceneObject("parentMarkerChildren");
    var children = [];
    
    // Parent every child of the marker to a parent object that we can move around easily
    for ( var i = 0; i < childrenParent.getChildrenCount(); i++) {
        var child = childrenParent.getChild(i);
        children.push(child);
    }
    children.forEach(function(d) {
        d.setParent(parentMarkerChildren);
    });
    
    parentMarkerChildren.setParent(childrenParent);
    
    return parentMarkerChildren;
}

//// Detach function now keeps the object in place relative to the marker
//function detachMarker(objectContainer, parent) {
//    objectT = objectContainer.getTransform();
//    print("Marker lost, freezing object in place relative to the marker.");
//    
//    // Keep the parent unchanged, maintaining the current position relative to the marker
//    objectT.getWorldPosition();  // This can be used for reference or debugging, but we don't change parent
//    
//    // Optionally: Disable the marker tracking component for performance
//    disableMarkerTracking();
//}

function detachMarker(objectContainer, parent) {
    var objectT = objectContainer.getTransform();

    // Save the object's current world position, rotation, and scale
    var worldPos = objectT.getWorldPosition();
    //    var worldRot = objectT.getWorldRotation();
    //    var worldScale = objectT.getWorldScale();

    print("Marker lost, freezing object in place relative to the world.");

    // Detach the object by setting its parent to null (or to a root object)
    objectContainer.setParent(null); // Detaching from the marker

    // Reapply the saved world transform to keep the object in place
    objectT.setWorldPosition(worldPos);
    //    objectT.setWorldRotation(worldRot);
    //    objectT.setWorldScale(worldScale);
    
    disableMarkerTracking();
}

function attachMarker(objectContainer, parent) {
    var objectT = objectContainer.getTransform();
    objectContainer.setParent(parent);
    
    objectT.setLocalPosition(originalPos);
    objectT.setLocalRotation(originalRot);
    objectT.setLocalScale(originalScale);
    
    print("Attached to Marker!");
}

function disableMarkerTracking () {
    script.markerComponent.enabled = false;
    print("Marker Disabled!");
}

function init() {    
    // Parent for when object should be detached (no longer used for parenting)
    var freeParent = script.getSceneObject();  // This is kept only for reference

    // Parent for when the object should be attached to the marker
    var markerParent = script.markerComponent.getSceneObject();   
    
    // Create a parent for everything under marker that we can parent to a free parent
    var objectContainer = parentChildrenToParent(markerParent);
    
    // Keep information about the original transform that we can apply back later
    var objectT = objectContainer.getTransform();
    originalPos = objectT.getLocalPosition(); 
    originalRot = objectT.getLocalRotation(); 
    originalScale = objectT.getLocalScale(); 

    // Choose when we should detach object from marker
    var detachEvent = script.trackMarkerOnce && script.detachOnFound ?
        "onMarkerFound" : "onMarkerLost";
    
    // When we lose the marker, do not set the parent to the World; freeze the objects relative to the marker
    script.markerComponent[detachEvent] = wrapFunction(
        script.markerComponent[detachEvent], 
        detachMarker.bind(this, objectContainer, markerParent) // Pass the same parent to keep it unchanged
    );
    
    // If we only want to track the marker once, rely on World tracking, 
    // don't re-attach on marker found and disable marker component
    if (script.trackMarkerOnce) {
        script.markerComponent[detachEvent] = wrapFunction(
            script.markerComponent[detachEvent], 
            disableMarkerTracking.bind(this)
        );      
    } else {
        script.markerComponent.onMarkerFound = wrapFunction(
            script.markerComponent.onMarkerFound, 
            attachMarker.bind(this, objectContainer, markerParent)
        );  
    }
}

init();

// Helper: Allow behavior and others to bind to the event as well
function wrapFunction(origFunc, newFunc) {
    if (!origFunc) {
        return newFunc;
    }
    return function() {
        origFunc();
        newFunc();
    };
}
