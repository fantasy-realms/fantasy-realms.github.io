$(document).ready(function () {
  findMaxAndMinScore();
});

async function findMaxAndMinScore() {
  cursedHoardSuits = false;
  var necromancer = true;
  var cards = 7;
  var parts = 1;
  var part = 1;
  var startFrom = 0;
  var params = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < params.length; i++) {
    var param = params[i].split('=');
    if (param[0] === 'part') {
      part = parseInt(param[1].split('/')[0]);
      parts = parseInt(param[1].split('/')[1]);
    } else if (param[0] === 'startFrom') {
      startFrom = parseInt(param[1]);
    } else if (param[0] === 'cards') {
      cards = parseInt(param[1]);
    } else if (param[0] === 'necromancer') {
      necromancer = (param[1] == 'true');
    }
  }
  var set = [];
  for (var i = 1; i <= 54; i++) {
    set.push(i);
  }
  var combinations = Combinatorics.bigCombination(set, cards);
  var combination;
  var i = 0;
  var percent = Math.floor(combinations.length / 100);
  var top10 = [];
  var bottom10 = [];
  console.log('checking +/-' + combinations.length + ' ' + cards + '-card combinations');
  console.log('part ' + part + ' of ' + parts);
  var startPosition = startFrom * percent;
  var totalVariations = 0;
  while (combination = combinations.next()) {
    i++;
    if (i % percent === 0) {
      console.log(Math.round(i / percent) + '% completed');
      await sleep(20);
    }
    if (((i % parts) + 1) !== part || i < startPosition) {
      continue;
    }
    var baseCombinations = [combination];
    try {
      if (necromancer && combination.includes(NECROMANCER)) {
        var necromancerTargetCards = deck.getCardsBySuit(deck.getCardById(NECROMANCER).relatedSuits);
        for (const suit of Object.keys(necromancerTargetCards)) {
          for (const extraCard of necromancerTargetCards[suit]) {
            if (!combination.includes(extraCard.id)) {
              var handWithExtraCard = combination.slice();
              handWithExtraCard.push(extraCard.id);
              baseCombinations.push(handWithExtraCard);
            }
          }
        }
      }
      for (const baseCombination of baseCombinations) {
        hand.loadFromArrays(baseCombination, []);
        var actionVariations = generateActionVariations(hand);
        totalVariations += actionVariations.length;
        for (const variation of actionVariations) {
          hand.loadFromArrays(baseCombination, variation);
          var score = hand.score();
          if (top10.length === 0 || score > top10[top10.length - 1].score) {
            var topHand = {
              score: score,
              cardNames: hand.cardNames().join(),
              code: hand.toString()
            };
            var add = true;
            for (const existing of top10) {
              if (existing.score === score) {
                add = false;
              }
            }
            if (add) {
              console.log('New top 10 hand', topHand);
              top10.push(topHand);
              top10 = top10.sort(function (a, b) {
                return a.score > b.score ? -1 : 1
              });
              console.log('MAX', top10[0]);
              top10 = top10.slice(0, 10);
            }
          }
          if (bottom10.length === 0 || score < bottom10[bottom10.length - 1].score) {
            var bottomHand = {
              score: score,
              cardNames: hand.cardNames().join(),
              code: hand.toString()
            };
            var add = true;
            for (const existing of bottom10) {
              if (existing.score === score) {
                add = false;
              }
            }
            if (add) {
              console.log('New bottom 10 hand', bottomHand);
              bottom10.push(bottomHand);
              bottom10 = bottom10.sort(function (a, b) {
                return a.score > b.score ? 1 : -1
              });
              console.log('MIN', bottom10[0]);
              bottom10 = bottom10.slice(0, 10);
            }
          }
        }
      }
    }
    catch(error){
      console.log("Error on hand scoring")
      console.log("Iteration" + i.toString())
    }
  }
  console.log(totalVariations);
  for (const topHand of top10) {
    $('#scores').append('<li class="list-group-item list-group-item-success"><b>TOP SCORE:</b> &nbsp;<a href="index.html?hand=' +
      topHand.code + '">' + topHand.cardNames + '</a>&nbsp; scored ' + topHand.score + ' points</li>');
  }
  for (const bottomHand of bottom10) {
    $('#scores').append('<li class="list-group-item list-group-item-danger"><b>MIN SCORE:</b> &nbsp;<a href="index.html?hand=' +
      bottomHand.code + '">' + bottomHand.cardNames + '</a>&nbsp; scored ' + bottomHand.score + ' points</li>');
  }
}

function generateActionVariations(hand) {
  var actionVariations = {};
  if (hand.containsId(DOPPELGANGER)) {
    actionVariations[DOPPELGANGER] = [];
    for (const card of hand.cards()) {
      if (card.id !== DOPPELGANGER) {
        actionVariations[DOPPELGANGER].push([DOPPELGANGER, card.id]);
      }
    }
    actionVariations[DOPPELGANGER].push([]);
  }
  if (hand.containsId(MIRAGE)) {
    generateDuplicatorVariations(MIRAGE, hand, actionVariations);
  }
  if (hand.containsId(SHAPESHIFTER)) {
    generateDuplicatorVariations(SHAPESHIFTER, hand, actionVariations);
  }
  if (hand.containsId(BOOK_OF_CHANGES)) {
    var bookOfChangesActions = [];
    var suitsOfInterest = new Set();
    for (const card of hand.cards()) {
      if (!(card.id === MIRAGE || card.id === SHAPESHIFTER)) {
        for (const suit of card.relatedSuits) {
          suitsOfInterest.add(suit);
        }
      }
    }
    for (const card of hand.cards()) {
      if (card.id !== BOOK_OF_CHANGES) {
        for (const suit of suitsOfInterest) {
          if (card.suit !== suit) {
            bookOfChangesActions.push([BOOK_OF_CHANGES, card.id, suit]);
          }
        }
        if (!suitsOfInterest.has('Wild')) {
          // turning a card into Wild may avoid a Penalty (there's never a Penalty for Wild suit)
          bookOfChangesActions.push([BOOK_OF_CHANGES, card.id, 'Wild']);
        }
      }
    }
    if (bookOfChangesActions.length > 0) {
      bookOfChangesActions.push([]);
      actionVariations[BOOK_OF_CHANGES] = bookOfChangesActions;
    }
  }
  if (hand.containsId(ISLAND)) {
    var islandActions = [];
    for (const card of hand.cards()) {
      if (((card.suit === 'Flood' || card.suit === 'Flame' || isPhoenix(card) || hand.containsId(BOOK_OF_CHANGES)) && card.penalty) || card.id === DOPPELGANGER) {
        islandActions.push([ISLAND, card.id]);
      }
    }
    if (islandActions.length > 0) {
      islandActions.push([]);
      actionVariations[ISLAND] = islandActions;
    }
  }
  if (Object.keys(actionVariations).length === 0) {
    return [[]];
  } else {
    return Combinatorics.cartesianProduct(...Object.values(actionVariations)).toArray();
  }
}

function generateDuplicatorVariations(id, hand, variations) {
  var actions = [];
  var candidates = deck.getCardsBySuit(deck.getCardById(id).relatedSuits);
  var suitsOfInterest = new Set();
  var cardsOfInterest = new Set();
  for (const card of hand.cards()) {
    if (card.id !== id) {
      for (const relatedSuit of card.relatedSuits) {
        suitsOfInterest.add(relatedSuit);
      }
      for (const relatedCard of card.relatedCards) {
        cardsOfInterest.add(relatedCard);
      }
    }
  }
  for (const cards of Object.values(candidates)) {
    if (suitsOfInterest.has(cards[0].suit)) {
      actions.push([id, cards[0].id]);
    }
    for (const card of cards) {
      if (cardsOfInterest.has(card.name)) {
        actions.push([id, card.id]);
      }
    }
  }
  if (actions.length > 0) {
    actions.push([]);
    variations[id] = actions;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
