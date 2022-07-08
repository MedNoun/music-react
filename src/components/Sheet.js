import { useScore } from "react-native-vexflow";
import React from "react";
import { View } from "react-native";
import Vex from "vexflow";

export default function Sheet({ route, navigation }) {
  const response = navigation.state.params.response;

  // We have our context and stave. Now we add notes to it.
  const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } = Vex.Flow;

  response.notes.sort(
    function(a, b) {
      if (a.onset_time === b.onset_time) {
        return a.pitch_integer - b.pitch_integer;
      }
      return a.onset_time > b.onset_time ? 1 : -1;
    }
  );

  var measures = group_by(response.notes, "measure");

  var mpp = 4; // measures per page

  for (var i of sorted_k(measures)) {
    // We likely aren't ready for multiple pages/contexts yet
    if (i == mpp) {
      break;
    }

    // JSON currently contains some measures with -1 values
    if (i >= 0) {
      if (i % mpp == 0) {
        var [context, stave] = useScore({
          contextSize: { x: 400, y: 680 }, // canvas size
          staveOffset: { x: 5, y: 5 }, // starting point of the staff relative to the top-right corner of canvas
          staveWidth: 365, // ofc, stave width
          clef: "treble", // clef
          timeSig: response.timesig, // time signiture
        });
      } else {
        // Create a stave of width 365 on the canvas.
        stave = new Stave(5, 5 + (i % mpp) * 165, 365);

        // Connect it to the rendering context and draw!
        stave.setContext(context).draw();
      }

      var measure = measures[i];
      var chords = group_by(measure, "onset_time");
      var notes = create_notes(chords);

      // Helper function to justify and draw a voice.
      Formatter.FormatAndDraw(context, stave, notes);
    }
  }

  function sorted_k(dict) {
    return Object.keys(dict).map(Number).sort((a, b) => a - b);
  }

  function group_by(notes, prop) {
    var group_notes = {};
    for (var note of notes) {
      var val = note[prop];
      group_notes[val] = group_notes[val] || [];
      group_notes[val].push(note);
    }
    return group_notes;
  }

  function create_notes(chords) {
    var notes = [];

    for (var i of sorted_k(chords)) {
      var chord = chords[i];

      var note = new StaveNote({
        keys: keys(chord),
        duration: chord[0].length,
      });

      if (chord.length == 1) {
        var n = chord[0];

        if (n.note_type == "incorrect") {
          note.setKeyStyle(0, { fillStyle: "red" });
        } else if (n.note_type == "missing") {
          note.setKeyStyle(0, { fillStyle: "blue" });
        } else if (n.note_type == "extra") {
          note.setKeyStyle(0, { fillStyle: "yellow" });
          // I will assume that I am given the onset of the previous note
        }
        if (n.pitch_spelled.includes("#")) {
          note.addModifier(0, new Accidental("#"));
        } else if (n.pitch_spelled.includes("b")) {
          note.addModifier(0, new Accidental("b"));
        }
      } else {
        for (var j = 0; j < chord.length; j++) {
          var n = chord[j];

          if (n.note_type == "incorrect") {
            note.setKeyStyle(j, { fillStyle: "red" });
          } else if (n.note_type == "missing") {
            note.setKeyStyle(j, { fillStyle: "blue" });
          } else if (n.note_type == "extra") {
            note.setKeyStyle(j, { fillStyle: "yellow" });
            // I will assume that I am given the onset of the previous note
          }
          if (n.pitch_spelled.includes("#")) {
            note.addModifier(j, new Accidental("#"));
          } else if (n.pitch_spelled.includes("b")) {
            note.addModifier(j, new Accidental("b"));
          }
        }
      }
      notes.push(note);
    }
    return notes;
  }

  function keys(chord) {
    function format_pitch(note) {
      var p = note.pitch_spelled;
      return [p.slice(0, -1) + "/" + p.slice(-1)];
    }
    return chord.map(format_pitch).flat();
  }

  return <View>{context.render()}</View>;
}