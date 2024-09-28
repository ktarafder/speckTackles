// -----JS CODE-----
// ObjectDetectionController.js
// Version: 0.0.1
// Event: Initialized
// Description: Script that creates copies of specified object and controls their positions on the screen according to object detection bounding boxes
// their positions on the screen

// @input Component.Text counter
// @input SceneObject objectToCopy {"hint" : "Object with s Screen Transform on it used to display detection boxes on the screen"}
// @input float smoothing = 0.5 {"widget":"slider", "min":0.0, "max":0.95, "step" : 0.05}

// @input bool advanced = false

// @input Component.ScriptComponent mlController {"showIf" : "advanced"}
// @input Component.ScriptComponent hintController {"showIf" : "advanced"}

// @ui {"widget" : "separator", "showIf":"advanced"}
// @input float matchingThreshold = 0.5 {"showIf":"advanced"}
// If the tracklet isn't matched then it will remain active during <lostFrameThreshold> updates
// @input int lostFramesThreshold = 0 {"showIf":"advanced"}


var defaultAnchors = Rect.create(-100, -100, 0, 0);
var detectionBoxes;

var updateEvent = script.createEvent("UpdateEvent");
var classLabels;

if (checkInputs()) {
    script.objectToCopy.enabled = false;
    updateEvent.bind(waitOnInitialized);
}

function waitOnInitialized() {
    if (!script.mlController.api.getDetections) {
        return;
    }
    var maxCount = script.mlController.api.getMaxDetectionsCount();
    detectionBoxes = instantiateObjects(script.objectToCopy, maxCount);
    classLabels = script.mlController.api.getClassLabels();
    updateEvent.bind(onUpdate);
}

function onUpdate() {
    var detections = script.mlController.api.getDetections();
    updateDetectionBoxes(detections);

    if (script.hintController && script.hintController.api.showHint) {
        script.hintController.api.showHint(detections.boxes.length == 0);
    }

    if (script.counter) {
        script.counter.text = detections.boxes.length.toString();
    }
}

function instantiateObjects(origin, count) {

    var parent = script.objectToCopy.getParent();
    var screenRegion = parent.getComponent("Component.ScreenRegionComponent");
    if (screenRegion == null) {
        screenRegion = parent.createComponent("Component.ScreenRegionComponent")
    }
    screenRegion.region = ScreenRegionType.FullFrame;

    var boxes = [];
    for (var i = 0; i < count; i++) {
        var sceneObject = parent.copyWholeHierarchy(origin);
        var screenTransform = sceneObject.getComponent("Component.ScreenTransform");
        var boxText = sceneObject.getChild(0).getComponent("Component.Text");
        screenTransform.anchors = defaultAnchors;

        boxes.push({
            sceneObject: sceneObject,
            screenTransform: screenTransform,
            boxText: boxText,
            isTracking: false,
            updated: false,
            lost_time: 0
        });
    }
    return boxes;
}



function updateDetectionBoxes(detections) {
    var boxes = detections.boxes;
    var classes = detections.classes;
    var active_tracklets = Array(detectionBoxes.length);
    var num_active = 0;
    var num_new = 0;
    var first_new = 0;
    var new_tracklets = Array(detectionBoxes.length);
    for (var j = 0; j < detectionBoxes.length; j++) {
        if (detectionBoxes[j].isTracking) {
            active_tracklets[num_active] = j;
            num_active++;
        }
        detectionBoxes[j].updated = false;
    }
    for (var i = 0; i < boxes.length; i++) {
        var temp;
        var class_idx = classes[i];
        temp = Rect.create(0, 0, 0, 0);
        temp.left = boxes[i][0];
        temp.right = boxes[i][0] + boxes[i][2];
        temp.bottom = boxes[i][1]
        temp.top = boxes[i][1] + boxes[i][3];

        var best_tracklet_idx = -1;
        var best_iou = 0;
        for (var j = 0; j < num_active; j++) {
            if (active_tracklets[j] == -1) {
                continue
            }
            var iou = computeMatchingScore(temp, detectionBoxes[active_tracklets[j]].screenTransform.anchors)
            if (iou > best_iou) {
                best_iou = iou;
                best_tracklet_idx = j;
            }
        }
        if (best_tracklet_idx == -1 || best_iou < script.matchingThreshold) {
            // Not matched to any existing tracklet => create a new one
            new_tracklets[num_new] = temp;
            num_new++;
        }
        else {
            var temp_idx = active_tracklets[best_tracklet_idx];
            detectionBoxes[temp_idx].screenTransform.anchors = lerpRect(detectionBoxes[temp_idx].screenTransform.anchors, temp, 1.0 - script.smoothing);         
            detectionBoxes[temp_idx].boxText.text = classLabels[class_idx];
            detectionBoxes[temp_idx].isTracking = true;
            detectionBoxes[temp_idx].updated = true;
            detectionBoxes[temp_idx].lost_time = 0;
            active_tracklets[best_tracklet_idx] = -1;
        }
    }
    // remove all tracklets which weren't matched with any candidate detection
    for (var j = 0; j < detectionBoxes.length; j++) {
        if (!detectionBoxes[j].updated) {
            if (detectionBoxes[j].isTracking && detectionBoxes[j].lost_time < script.lostFramesThreshold) {
                detectionBoxes[j].lost_time++;
                continue;
            }
            if (num_new > 0) {
                num_new--;
                detectionBoxes[j].screenTransform.anchors = new_tracklets[first_new];
                first_new++;
                detectionBoxes[j].isTracking = true;
                detectionBoxes[j].sceneObject.enabled = true;
            }
            else {
                detectionBoxes[j].screenTransform.anchors = defaultAnchors;
                detectionBoxes[j].sceneObject.enabled = false;
                detectionBoxes[j].isTracking = false;
            }
            detectionBoxes[j].lost_time = 0;
        }
    }
}

function computeMatchingScore(box1, box2) {

    var xx1 = Math.max(box1.left, box2.left);
    var yy1 = Math.min(box1.top, box2.top);
    var xx2 = Math.min(box1.right, box2.right);
    var yy2 = Math.max(box1.bottom, box2.bottom);

    var area1 = (box1.right - box1.left) * (box1.top - box1.bottom);
    var area2 = (box2.right - box2.left) * (box2.top - box2.bottom);
    var inter = Math.max(0, xx2 - xx1) * Math.max(0, yy1 - yy2);

    return inter / (area1 + area2 - inter);
}

function lerpRect(a, b, t) {
    a.left = a.left + (b.left - a.left) * t;
    a.right = a.right + (b.right - a.right) * t;
    a.bottom = a.bottom + (b.bottom - a.bottom) * t;
    a.top = a.top + (b.top - a.top) * t;
    return a;
}

function checkInputs() {
    if (!script.objectToCopy) {
        debugPrint("Error, Please set the object you would like to place on the detected object");
        return false;
    }

    if (script.objectToCopy.getComponent("Component.ScreenTransform") == null) {
        debugPrint("Error, Object To Copy has to have a ScreenTansform component in order to be positioned correcty");
        return false;
    }
    if (script.objectToCopy.getParent() == null || script.objectToCopy.getParent().getComponent("Component.ScreenTransform") == null) {
        debugPrint("Error, Object To Copy has to have a parent with ScreenTransform component");
        return false;
    }
    if (!script.objectToCopy.getComponent("Component.ScreenTransform").isInScreenHierarchy()) {
        debugPrint("Error, Object To Copy should be a child of an Othographic camera");
        return false;
    }
    if (!script.mlController) {
        debugPrint("Error, MLController script is not set");
        return false;
    }

    if (!script.counter) {
        debugPrint("Warning, text component for the object counter is not set");
    }
    return true;
}

function debugPrint(text) {
    print("ObjectDetectionController, " + text);
}