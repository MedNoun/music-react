import { useScore } from "react-native-vexflow";
import React from "react";
import { View } from "react-native";
import Vex from "vexflow";
import data from "../../assets/data";


export default function Sheet() {
  const [context, stave] = useScore({
    contextSize: { x: 400, y: 100 }, // canvas size
    staveOffset: { x: 5, y: 5 }, // starting point of the staff relative to the top-right corner of canvas
    staveWidth: 400, // ofc, stave width
    clef: "treble", // clef
    timeSig: data.timesig, // time signiture
  });

  // We have our context and stave. Now we add notes to it.
  const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental, BarNote } =
    Vex.Flow;

  function group_by_onset(notes) {
    var group_notes = {};
    for (var i in notes) {
      var note = notes[i];
      var onset = note.onset_time;
      group_notes[onset] = group_notes[onset] || [];
      group_notes[onset].push(note);
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
      } else {
        for (var j in chord) {
          var n = chord[j];

          if (n.note_type == "incorrect") {
            note.setKeyStyle(j, { fillStyle: "red" });
          } else if (n.note_type == "missing") {
            note.setKeyStyle(j, { fillStyle: "blue" });
          } else if (n.note_type == "extra") {
            note.setKeyStyle(j, { fillStyle: "yellow" });
            // I will assume that I am given the onset of the previous note
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

  function note_by_index(idx, chords) {
    var count = 0;
    for (var i in chords) {
      var chord = chords[i];
      for (var j in chord) {
        var note = chord[j];
        if (count == idx) {
          return note;
        }
        count++;
      }
    }
  }

  var chords = group_by_onset(data.notes);

  var notes = create_notes(chords);

  // Render voice
  Formatter.FormatAndDraw(context, stave, notes);
  

  return <View>{context.render()}</View>;
}
