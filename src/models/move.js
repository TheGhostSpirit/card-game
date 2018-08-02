export class Move {
    
    constructor(source, destination, selection, cardWasTurned) {
        this.source = source;
        this.destination = destination;
        this.selection = selection;
        this.cardWasTurned = cardWasTurned;
    }
}
