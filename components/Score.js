import SheetMusic from "@slnsw/react-sheet-music";

export default function Score({ notation, id, onEvent, isPlaying }) {
  return (
    <SheetMusic
      notation={notation}
      id={id}
      isPlaying={isPlaying}
      onEvent={onEvent}
      bpm={70}
    />
  );
}
