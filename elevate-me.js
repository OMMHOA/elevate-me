{
    init: function(elevators, floors) {
        var elevatorFirst = elevators[0];
        var elevatorSecond = elevators[1];
        var elevatorThird = elevators[2];
        var elevatorFourth = elevators[3];
        var pressedUpAtFloor = [];
        var pressedDownAtFloor = [];
        for (var i = 0; i < 12; i++) {
            pressedUpAtFloor[i] = 0;
            pressedDownAtFloor[i] = 0;

            floors[i].on("up_button_pressed", function() {
                pressedUpAtFloor[this.floorNum()] += 1;
            });
            floors[i].on("down_button_pressed", function() {
                pressedDownAtFloor[this.floorNum()] += 1;
            });
        }

        function swap(destinations, i, j) {
            destinations[i] += destinations[j];
            destinations[j] = destinations[i] - destinations[j];
            destinations[i] -= destinations[j];
        }

        function sortDesc(destinations) {
            for (var i = 0; i < destinations.length - 1; i++) {
                for (var j = i + 1; j < destinations.length; j++) {
                    if (destinations[i] < destinations[j]) {
                        swap(destinations, i, j);
                    }
                }
            }
        }

        function btnPressedHandler(floorNum, actualElevator) {
            actualElevator.goToFloor(floorNum);
            var destinations = actualElevator.destinationQueue;
            sortDesc(destinations);
            if (floorNum > actualElevator.currentFloor()) {
                if (actualElevator.currentFloor() < 4 && actualElevator.currentFloor() > 0)
                    actualElevator.goToFloor(0, true);
            }
            actualElevator.checkDestinationQueue();
        }

        function scope1Btn(floorNum) {
            btnPressedHandler(floorNum, elevatorFirst);
        }

        elevatorFirst.on("floor_button_pressed", scope1Btn);

        function idleHandler(actualElevator) {
            var maxI = 0;
            for (var i = 0; i < 12; i++) {
                if (pressedUpAtFloor[i] + pressedDownAtFloor[i] > pressedUpAtFloor[maxI] + pressedDownAtFloor[maxI])
                    maxI = i;
            }
            actualElevator.goToFloor(maxI);
        }

        function scope1Idle() {
            idleHandler(elevatorFirst);
        }

        elevatorFirst.on("idle", scope1Idle);

        function passingFloorHandler(floorNum, direction, actualElevator) {
            if (actualElevator.loadFactor() < 0.5) {
                if (direction === "up" && (pressedUpAtFloor[floorNum] + pressedDownAtFloor[floorNum] > 3)) {
                    actualElevator.goToFloor(floorNum, true);
                    pressedUpAtFloor[floorNum] = 0;
                    pressedDownAtFloor[floorNum] = 0;
                }
                if (direction === "down" && (pressedUpAtFloor[floorNum] + pressedDownAtFloor[floorNum] > 3)) {
                    actualElevator.goToFloor(floorNum, true);
                    pressedUpAtFloor[floorNum] = 0;
                    pressedDownAtFloor[floorNum] = 0;
                }
            }
        }

        function scope1PassFloor(floorNum, direction) {
            passingFloorHandler(floorNum, direction, elevatorFirst);
        }

        elevatorFirst.on("passing_floor", scope1PassFloor);

        function scope2Btn(floorNum) {
            btnPressedHandler(floorNum, elevatorSecond);
        }

        function scope2Idle() {
            idleHandler(elevatorSecond);
        }

        function scope2PassFloor(floorNum, direction) {
            passingFloorHandler(floorNum, direction, elevatorSecond);
        }

        elevatorSecond.on("floor_button_pressed", scope2Btn);

        elevatorSecond.on("idle", scope2Idle);

        elevatorSecond.on("passing_floor", scope2PassFloor);

        function scope3Btn(floorNum) {
            btnPressedHandler(floorNum, elevatorThird);
        }

        function scope3Idle() {
            idleHandler(elevatorThird);
        }

        function scope3PassFloor(floorNum, direction) {
            passingFloorHandler(floorNum, direction, elevatorThird);
        }

        elevatorThird.on("floor_button_pressed", scope3Btn);

        elevatorThird.on("idle", scope3Idle);

        elevatorThird.on("passing_floor", scope3PassFloor);

        function scope4Btn(floorNum) {
            btnPressedHandler(floorNum, elevatorFourth);
        }

        function scope4Idle() {
            idleHandler(elevatorFourth);
        }

        function scope4PassFloor(floorNum, direction) {
            passingFloorHandler(floorNum, direction, elevatorFourth);
        }

        elevatorFourth.on("floor_button_pressed", scope4Btn);

        elevatorFourth.on("idle", scope4Idle);

        elevatorFourth.on("passing_floor", scope4PassFloor);
    },
        update: function(dt, elevators, floors) {}
}
