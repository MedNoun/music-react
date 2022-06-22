import { useScore } from "react-native-vexflow"; // import the one and only thing provided
import React from "react";
import { View } from "react-native";
import Vex from "vexflow";
import { performance_data } from "../../assets/data";

export default function Sheet() {
  const [context, stave] = useScore({
    contextSize: { x: 1000, y: 1000 }, // canvas size
    staveOffset: { x: 5, y: 5 }, // starting point of the staff relative to the top-right corner of canvas
    staveWidth: 400, // ofc, stave width
    clef: "treble", // clef
    timeSig: performance_data.timesig, // time signiture
  });
  // We have our context and stave. Now we add notes to it.
  const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental, BarNote } =
    Vex.Flow;
  var notes = [
    new StaveNote({
      keys: ["c#/4"],
      duration: "h",
    }).setKeyStyle(0, {
      fillStyle: "red",
    }),
    new BarNote(),
    new StaveNote({
      keys: ["c/4"],
      duration: "8",
    }).setKeyStyle(0, {
      fillStyle: "blue",
    }),
    new StaveNote({
      keys: ["b/4"],
      duration: "qr",
    }),
    new StaveNote({
      keys: ["C#/4", "e/4", "g/4"],
      duration: "8",
    })
      .setKeyStyle(1, {
        fillStyle: "yellow",
      })
      .addModifier(0, new Accidental("#")),
    new StaveNote({
      keys: ["C/4", "e/4", "g/4"],
      duration: "8",
    }).setKeyStyle(1, {
      fillStyle: "yellow",
    }),
  ];
  // Render voice
  Formatter.FormatAndDraw(context, stave, notes);
  return <View>{context.render()}</View>;
}
