export class Move {
  constructor(source, destination, selection, description, zone) {
    this.source = source;
    this.destination = destination;
    this.selection = selection;
    this.description = description;
    this.zone = zone;
  }

  isReverseOf(move2) {
    return this.source.id === move2.destination.id
      && this.destination.id === move2.source.id
      && this.selection.every((c, i) => c.isEqual(move2.selection[i]));
  }
}
