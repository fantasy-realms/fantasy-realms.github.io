class Discard {

  constructor() {
    this.discardedCards = {};
  }

  addCard(card) {
    if (this._canAdd(card)) {
      this.discardedCards[card.id] = card;
      return true;
    }
    return false;
  }

  _canAdd(newCard) {
    if (this.discardedCards[newCard.id] !== undefined || hand.containsId(newCard.id, true)) {
      return false;
    } else {
      return true;
    }
  }

  deleteCardById(id) {
    delete this.discardedCards[id];
  }

  getCardById(id) {
    return this.discardedCards[id];
  }

  contains(cardName) {
    for (const card of this.cards()) {
      if (card.name === cardName) {
        return true;
      }
    }
    return false;
  }

  containsId(cardId) {
    return this.discardedCards[cardId] !== undefined;
  }

  containsSuit(suitName) {
    for (const card of this.cards()) {
      if (card.suit === suitName) {
        return true;
      }
    }
    return false;
  }

  countSuit(suitName) {
    var count = 0;
    for (const card of this.cards()) {
      if (card.suit === suitName) {
        count++;
      }
    }
    return count;
  }

  cards() {
    return Object.values(this.discardedCards);
  }

  cardNames() {
    return this.cards().map(function(card) {
      return card.name;
    });
  }

  clear() {
    this.discardedCards = {};
  }

  size() {
    return Object.keys(this.discardedCards).length;
  }

  toString() {
    return Object.keys(this.discardedCards).join();
  }

  loadFromString(string) {
    var cardIds = string.split(',');
    this.loadFromArray(cardIds);
  }

  loadFromArray(cardIds) {
    this.clear();
    for (const cardId of cardIds) {
      this.addCard(deck.getCardById(cardId));
    }
  }

}

var discard = new Discard();