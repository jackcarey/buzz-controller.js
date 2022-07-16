(function () {
    var buzz = {
        match: "Logitech Buzz(tm) Controller V1",
        inexact_match: "Buzz",
        name: "Buzz Quiz Controller for PS2",
        description: "A wired USB PS2 Buzz controller.",
        buttons: {
            P1_RED: 0,
            P1_YELLOW: 1,
            P1_GREEN: 2,
            P1_ORANGE: 3,
            P1_BLUE: 4,
            P2_RED: 5,
            P2_YELLOW: 6,
            P2_GREEN: 7,
            P2_ORANGE: 8,
            P2_BLUE: 9,
            P3_RED: 10,
            P3_YELLOW: 11,
            P3_GREEN: 12,
            P3_ORANGE: 13,
            P3_BLUE: 14,
            P4_RED: 15,
            P4_YELLOW: 16,
            P4_GREEN: 17,
            P4_ORANGE: 18,
            P4_BLUE: 19,
        },
        axes: {}
    };
    Controller.layouts.register(buzz);
})();