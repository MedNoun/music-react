import { useScore } from "react-native-vexflow"; // import the one and only thing provided
import React from "react";
import { View } from "react-native";
import Vex from "vexflow";

export default function Sheet() {
  const [context, stave] = useScore({
    contextSize: { x: 300, y: 300 }, // this determine the canvas size
    staveOffset: { x: 5, y: 5 }, // this determine the starting point of the staff relative to top-right corner of canvas
    staveWidth: 500, // ofc, stave width
    clef: "treble", // clef
    timeSig: "4/4", // time signiture
  });

  // you got your context, you got your stave, you can do your stuff now

  // picked from Vexflow tutorial: https://github.com/0xfe/vexflow/wiki/The-VexFlow-Tutorial
  const VF = Vex.Flow;
  var notes = [
    // A quarter-note C.
    new VF.StaveNote({ clef: "treble", keys: ["c/4"], duration: "q" }),

    // A quarter-note D.
    new VF.StaveNote({ clef: "treble", keys: ["d/4"], duration: "q" }),
    // A quarter-note rest. Note that the key (b/4) specifies the vertical
    // position of the rest.
    new VF.StaveNote({ clef: "treble", keys: ["b/4"], duration: "qr" }),

    // A C-Major chord.
    new VF.StaveNote({
      clef: "treble",
      keys: ["c/4", "e/4", "g/4"],
      duration: "q",
    }),
  ];
  var notes2 = [
    // A quarter-note C.
    new VF.StaveNote({ clef: "treble", keys: ["a/4"], duration: "q" }),

    // A quarter-note D.
    new VF.StaveNote({ clef: "treble", keys: ["a/4"], duration: "q" }),
    // A quarter-note rest. Note that the key (b/4) specifies the vertical
    // position of the rest.
    new VF.StaveNote({ clef: "treble", keys: ["a/4"], duration: "qr" }),

    // A C-Major chord.
    new VF.StaveNote({
      clef: "treble",
      keys: ["c/4", "e/4", "a/4"],
      duration: "q",
    }),
  ];

  // Create a voice in 4/4 and add the notes from above
  var voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
  voice.addTickables(notes);
  var voice2 = new VF.Voice({ num_beats: 4, beat_value: 4 });
  voice2.addTickables(notes2);

  // Format and justify the notes to 200 pixels.
  var formatter = new VF.Formatter()
    .joinVoices([voice, voice2])
    .format([voice, voice2], 200);

  // Render voice
  voice.draw(context, stave);

  return <View>{context.render()}</View>;
}
