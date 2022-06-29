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

  for (var i in measures) {
    // We likely aren't ready for multiple pages/contexts yet
    if (i == 3) {
      break;
    }

    // JSON currently contains some measures with -1 values
    if (i >= 0) {
      if (i % 3 == 0) {
        var [context, stave] = useScore({
          contextSize: { x: 400, y: 300 }, // canvas size
          staveOffset: { x: 5, y: 5 }, // starting point of the staff relative to the top-right corner of canvas
          staveWidth: 365, // ofc, stave width
          clef: "treble", // clef
          timeSig: response.timesig, // time signiture
        });
      } else {
        // Create a stave of width 365 on the canvas.
        stave = new Stave(5, 5 + (i % 3) * 95, 365);

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

  function group_by(notes, prop) {
    var group_notes = {};
    for (var i in notes) {
      if (!i.length) {
        i.length = "q";
      }
      var note = notes[i];
      // TODO: remove this ugly hack
      var val = parseFloat(note[prop]) * 100000;
      group_notes[val] = group_notes[val] || [];
      group_notes[val].push(note);
    }
    return group_notes;
  }

  function create_notes(chords) {
    var notes = [];

    for (var i in chords) {
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
        for (var j in chord) {
          var n = chord[j];
          var idx = parseInt(j);

          if (n.note_type == "incorrect") {
            note.setKeyStyle(idx, { fillStyle: "red" });
          } else if (n.note_type == "missing") {
            note.setKeyStyle(idx, { fillStyle: "blue" });
          } else if (n.note_type == "extra") {
            note.setKeyStyle(idx, { fillStyle: "yellow" });
            // I will assume that I am given the onset of the previous note
          }
          if (n.pitch_spelled.includes("#")) {
            note.addModifier(idx, new Accidental("#"));
          } else if (n.pitch_spelled.includes("b")) {
            note.addModifier(idx, new Accidental("b"));
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
