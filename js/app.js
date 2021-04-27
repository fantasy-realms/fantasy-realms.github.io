Handlebars.registerHelper('normalize', function(str) {
  return str.replace(/\s+/g, '-').toLowerCase();
});

$(document).ready(function() {
  configureSelectedPlayerCount();
  configureSelectedExpansions();
  showCards();
  getDiscardFromQueryString();
  getHandFromQueryString();
  $('#ch_items').change(function() {
    toggleCursedHoardItems();
  });
  $('#ch_suits').change(function() {
    toggleCursedHoardSuits();
  });
});

var click = new Audio('sound/click.mp3');
var swoosh = new Audio('sound/swoosh.mp3');
var clear = new Audio('sound/clear.mp3');
var magic = new Audio('sound/magic.mp3');
var actionId = NONE;
var bookOfChangesSelectedCard = NONE;
var bookOfChangesSelectedSuit = undefined;
var cursedHoardItems = false;
var cursedHoardSuits = false;
var playerCount = 2;
var inputDiscardArea = false;

function configureSelectedExpansions() {
  if (window.location.search) {
    var params = window.location.search.substring(1).split('&');
    for (var i = 0; i < params.length; i++) {
      var param = params[i].split('=');
      if (param[0] === 'expansions') {
        if (param[1].indexOf('ch_items') > -1) {
          cursedHoardItems = true;
          deck.enableCursedHoardItems();
          $('#ch_items').prop('checked', true);
        }
        if (param[1].indexOf('ch_suits') > -1) {
          cursedHoardSuits = true;
          deck.enableCursedHoardSuits();
          $('#ch_suits').prop('checked', true);
        }
      }
    }
  } else {
    if (localStorage.getItem('ch_items')) {
      cursedHoardItems = true;
      deck.enableCursedHoardItems();
      $('#ch_items').prop('checked', true);
    }
    if (localStorage.getItem('ch_suits')) {
      cursedHoardSuits = true;
      deck.enableCursedHoardSuits();
      $('#ch_suits').prop('checked', true);
    }
  }
}

function configureSelectedPlayerCount() {
  if (window.location.search) {
    var params = window.location.search.substring(1).split('&');
    for (var i = 0; i < params.length; i++) {
      var param = params[i].split('=');
      if (param[0] === 'playerCount') {
        playerCount = param[1];
      }
    }
  } else if (localStorage.getItem('playerCount')) {
      playerCount = localStorage.getItem('playerCount');
  }
}

function toggleCursedHoardItems() {
  cursedHoardItems = !cursedHoardItems;
  localStorage.setItem('ch_items', cursedHoardItems);
  if (cursedHoardItems) {
    deck.enableCursedHoardItems();
  } else {
    deck.disableCursedHoardItems();
  }
  reset();
}

function toggleCursedHoardSuits() {
  cursedHoardSuits = !cursedHoardSuits;
  localStorage.setItem('ch_suits', cursedHoardSuits);
  if (cursedHoardSuits) {
    deck.enableCursedHoardSuits();
  } else {
    deck.disableCursedHoardSuits();
  }
  reset();
}

function setPlayerCount(count) {
  click.play();
  playerCount = count;
  localStorage.setItem('playerCount', playerCount);
  updateHandView();
}

function reset() {
  clear.play();
  discard.clear();
  hand.clear();
  showCards();
  updateHandView();
  actionId = NONE;
  bookOfChangesSelectedCard = NONE;
  bookOfChangesSelectedSuit = undefined;
  inputDiscardArea = false;
  $("#discard").hide();
  $("#hand").show();
}

function addToView(id) {
  if (inputDiscardArea) {
    if (discard.addCard(deck.getCardById(id))) {
      click.play();
      updateDiscardAreaView();
    }
  } else {
    if ([SHAPESHIFTER, CH_SHAPESHIFTER, MIRAGE, CH_MIRAGE].includes(actionId)) {
      click.play();
      magic.play();
      var duplicator = hand.getCardById(actionId);
      duplicator.actionData = [id];
      showCards();
      updateHandView();
      actionId = NONE;
    } else if (hand.addCard(deck.getCardById(id))) {
      click.play();
      updateHandView();
      actionId = NONE;
      if (discard.containsId(id)) {
        discard.deleteCardById(id);
      }
    }
  }
}

function selectFromHand(id) {
  if (actionId === BOOK_OF_CHANGES) {
    if (id !== BOOK_OF_CHANGES) {
      click.play();
      bookOfChangesSelectedCard = id;
      performBookOfChanges();
    }
  } else if (actionId === DOPPELGANGER) {
    if (id !== DOPPELGANGER) {
      actionId = NONE;
      click.play();
      magic.play();
      var doppelGanger = hand.getCardById(DOPPELGANGER);
      doppelGanger.actionData = [id];
      updateHandView();
    }
  } else if (actionId === ISLAND) {
    var selectedCard = hand.getCardById(id);
    var island = hand.getCardById(ISLAND);
    if (selectedCard.suit === 'Flood' || selectedCard.suit === 'Flame') {
      actionId = NONE;
      click.play();
      magic.play();
      island.actionData = [id];
      updateHandView();
    }
  } else if (actionId === CH_ANGEL) {
    actionId = NONE;
    click.play();
    magic.play();
    var angel = hand.getCardById(CH_ANGEL);
    angel.actionData = [id];
    updateHandView();  
  } else {
    removeFromHand(id);
  }
}

function removeFromHand(id) {
  swoosh.play();
  hand.deleteCardById(id);
  updateHandView();
}

function removeFromDiscard(id) {
  swoosh.play();
  discard.deleteCardById(id);
  updateDiscardAreaView();
}

function updateHandView() {
  var template = Handlebars.compile($("#hand-template").html());
  var score = hand.score(discard);
  var html = template({
    hand: hand,
    playerCount: playerCount,
    playerCounts: [2, 3, 4, 5, 6]
  }, {
    allowProtoMethodsByDefault: true
  });
  $('#hand').html(html);
  if (score >= 0) {
    $('#points').text(('000' + score).slice(-3));
  } else {
    $('#points').text('-' + ('000' + Math.abs(score)).slice(-3));
  }
  $('#cardCount').text(hand.size());
  $('#cardLimit').text(hand.limit());
  updateUrl();
}

function updateDiscardAreaView() {
  var template = Handlebars.compile($("#discard-template").html());
  var score = hand.score(discard);
  var html = template({
    discard: discard.cards()
  }, {
    allowProtoMethodsByDefault: true
  });
  $('#discard').html(html);
  if (score >= 0) {
    $('#points').text(('000' + score).slice(-3));
  } else {
    $('#points').text('-' + ('000' + Math.abs(score)).slice(-3));
  }
  updateUrl();
}

function updateUrl() {
  var params = [];
  if (cursedHoardItems || cursedHoardSuits) {
    var expansions = [];
    if (cursedHoardItems) {
      expansions.push('ch_items');
    }
    if (cursedHoardSuits) {
      expansions.push('ch_suits')
    }
    params.push('expansions=' + expansions.join(','));
    params.push('playerCount=' + playerCount);
  }
  if (hand.size() > 0) {
    params.push('hand=' + hand.toString());
  }
  if (discard.size() > 0) {
    params.push('discard=' + discard.toString());
  }
  if (params.length > 0) {
    history.replaceState(null, null, "index.html?" + params.join('&'));
  } else {
    history.replaceState(null, null, "index.html");
  }
}

function getHandFromQueryString() {
  var params = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < params.length; i++) {
    var param = params[i].split('=');
    if (param[0] === 'hand') {
      hand.loadFromString(param[1]);
    }
  }
  updateHandView();
}

function getDiscardFromQueryString() {
  var params = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < params.length; i++) {
    var param = params[i].split('=');
    if (param[0] === 'discard') {
      discard.loadFromString(param[1]);
    }
  }
}

function useCard(id) {
  click.play();
  actionId = id;
  if (id === BOOK_OF_CHANGES) {
    bookOfChangesSelectedCard = NONE;
    bookOfChangesSelectedSuit = undefined;
    hand.undoCardAction(id);
    var template = Handlebars.compile($("#suit-selection-template").html());
    var html = template({
      suits: deck.suits()
    }, {
      allowProtoMethodsByDefault: true
    });
    $('#cards').html(html);
  } else if ([SHAPESHIFTER, CH_SHAPESHIFTER, MIRAGE, CH_MIRAGE].includes(id)) {
    hand.undoCardAction(id);
    var duplicator = hand.getCardById(id);
    showCards(duplicator.card.relatedSuits);
  } else if ([DOPPELGANGER, ISLAND, CH_ANGEL].includes(id)) {
    hand.undoCardAction(id);
  }
  updateHandView();
  $('#card-action-text-' + id).text(deck.getCardById(id).action);
}

function performBookOfChanges() {
  if (bookOfChangesSelectedCard !== NONE && bookOfChangesSelectedSuit !== undefined) {
    magic.play();
    var bookOfChanges = hand.getCardById(BOOK_OF_CHANGES);
    bookOfChanges.actionData = [bookOfChangesSelectedCard, bookOfChangesSelectedSuit];
    showCards();
    updateHandView();
    actionId = NONE;
  }
}

function selectSuit(suit) {
  click.play();
  bookOfChangesSelectedSuit = suit;
  performBookOfChanges();
}

function switchToDiscardArea() {
  click.play();
  inputDiscardArea = true;
  updateDiscardAreaView();
  showCards();
  $("#hand").hide();
  $("#discard").show();
}

function switchToHand() {
  click.play();
  inputDiscardArea = false;
  updateHandView();
  showCards();
  $("#discard").hide();
  $("#hand").show();
}

function showCards(suits) {
  var template = Handlebars.compile($("#cards-template").html());
  var html = template({
    suits: deck.getCardsBySuit(suits),
  }, {
    allowProtoMethodsByDefault: true
  });
  $('#cards').html(html);
}
