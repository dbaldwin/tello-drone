import { strict as assert } from "assert";
import { verifyCommand, parseDroneState, formatCommand } from "../src/utility";
import { ValidCommands } from "../src/types/commands.types";

describe("tello-drone library", function () {
  it("Can parse a tello state (v???)", function () {
    const state =
      "mid:0;x:0;y:0;z:0;mpry:0,0,0;pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:0;templ:60;temph:62;tof:10;h:0;bat:94;baro:-16.92;time:0;agx:13.00;agy:-10.00;agz:-998.00;\r\n";
    const expected = {
      mid: 0,
      x: 0,
      y: 0,
      z: 0,
      mpry: [0, 0, 0],
      pitch: 0,
      roll: 0,
      yaw: 0,
      vgx: 0,
      vgy: 0,
      vgz: 0,
      templ: 60,
      temph: 62,
      tof: 10,
      h: 0,
      bat: 94,
      baro: -16.92,
      time: 0,
      agx: 13.0,
      agy: -10.0,
      agz: -998.0,
    };

    const actual = parseDroneState(state);

    assert.deepEqual(expected, actual);
  });

  it("Can parse a tello state (v01.04.91.01)", function () {
    const state =
      "pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:0;templ:74;temph:76;tof:10;h:0;bat:81;baro:70.96;time:0;agx:3.00;agy:-3.00;agz:-1000.00;";
    const expected = {
      pitch: 0,
      roll: 0,
      yaw: 0,
      vgx: 0,
      vgy: 0,
      vgz: 0,
      templ: 74,
      temph: 76,
      tof: 10,
      h: 0,
      bat: 81,
      baro: 70.96,
      time: 0,
      agx: 3.0,
      agy: -3.0,
      agz: -1000.0,
    };

    const actual = parseDroneState(state);

    assert.deepEqual(expected, actual);
  });

  it("Can verify valid commands", function () {
    const noOptionCommands = ["command", "takeoff", "land", "streamon"];
    const optionCommands = [
      "jump",
      "go",
      "up",
      "down",
      "ccw",
      "flip",
      "curve",
      "EXT led",
      "EXT led br",
      "EXT led bl",
      "EXT mled g",
      "EXT mled",
      "EXT DIY",
      "mdirection",
      "mon",
      "moff",
      "motoron",
      "motoroff",
    ];
    const options = [
      { x: 20, y: 20, z: 20, speed: 50, yaw: 90, mid1: "m1", mid2: "m5" },
      { x: 100, y: 100, z: 100, speed: 50, mid: 3 },
      { value: 200 },
      { value: 50 },
      { value: 180 },
      { value: "r" },
      { x1: 250, y1: 100, z1: 100, x2: 100, y2: 50, z2: 50, speed: 30 },
      { r: 199, g: 255, b: 10 },
      { t: 0.5, r: 0, g: 0, b: 255 },
      { t: 2.5, r1: 0, g1: 0, b1: 255, r2: 0, g2: 255, b2: 0 },
      {
        value:
          "rbprbprbprbprbprbprbprbprbprbprbprbprbprbprbprbprbprbprbprbprpbr",
      },
      {
        direction: "u",
        color: "b",
        frequency: 1.0,
        text: "hello",
      },
      { value: "servo open" },
      { value: 2 },
    ];

    for (const command of noOptionCommands) {
      assert.equal(verifyCommand(command as ValidCommands), undefined);
    }

    for (let i = 0; i < optionCommands.length; i++) {
      const command = optionCommands[i];
      const option = options[i];

      assert.equal(verifyCommand(command as ValidCommands, option), undefined);
    }
  });

  it("Can verify invalid commands", function () {
    const invalidNoOptionCommands = ["im", "not", "a", "validCommand"];
    const invalidOptions = [
      { value: 2000 },
      { value: 5000 },
      { value: 18000 },
      { value: "j" },
      { x1: 25000, y1: 10000, x2: 10000, y2: 5000, speed: 3000 },
    ];

    for (const command of invalidNoOptionCommands) {
      // @ts-ignore we are intentionally failing
      assert.equal(verifyCommand(command) instanceof Error, true);
    }

    for (let i = 0; i < invalidNoOptionCommands.length; i++) {
      const command = invalidNoOptionCommands[i];
      const option = invalidOptions[i];

      // @ts-ignore we are intentionally failing
      assert.equal(verifyCommand(command, option) instanceof Error, true);
    }
  });

  it("Can format command with options", function () {
    const command = "ccw";
    const options = { x1: 250, y1: 100, x2: 100, y2: 50, speed: 30 };

    const result = formatCommand(command, options);

    assert.equal(result.split(" ").length, 1 + Object.values(options).length);
    assert.deepEqual(
      [command, ...Object.values(options)].map((val) => val.toString()),
      result.split(" ")
    );
  });
});
