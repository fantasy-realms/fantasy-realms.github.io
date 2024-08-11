Handlebars.registerHelper('i18n', function () {
  var key = '';
  for (var arg in arguments) {
    if (typeof arguments[arg] != 'object') {
      key += arguments[arg];
    }
  }
  try {
    return jQuery.i18n.prop(key);
  } catch (e) {
    return key;
  }
});

var languages = {
  'en': 'English',
  'de': 'Deutsch',
  'es': 'Español',
  'fr': 'Français',
  'pl': 'Polski',
  'pt': 'Português',
  'ua': 'Українська',
  'cz': 'Čeština',
  'kr': '한국어',
  'ru': 'Русский',
  'zh': '中文'
}

$(document).ready(function () {
  const lang = localStorage.getItem('language') || 'en';
  jQuery.i18n.properties({
    name: 'Messages',
    path: 'i18n/',
    mode: 'map',
    cache: true,
    language: lang,
    async: true,
    callback: function () {
      configureSelectedPlayerCount();
      configureSelectedExpansions();
      configureSound();
      showCards();
      getDiscardFromQueryString();
      getHandFromQueryString();
      $('#ch_items').change(function () {
        toggleCursedHoardItems();
      });
      $('#ch_suits').change(function () {
        toggleCursedHoardSuits();
      });
      $('#sound_state').change(function () {
        toggleSound();
      });
      updateLabels(lang);
    }
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
var playerCount = 4;
var inputDiscardArea = false;

function selectLanguage(lang) {
  localStorage.setItem('language', lang);
  jQuery.i18n.properties({
    name: 'Messages',
    path: 'i18n/',
    mode: 'map',
    cache: true,
    language: lang,
    async: true,
    callback: function () {
      swoosh.play();
      showCards();
      updateLabels(lang);
    }
  });
}

function updateLabels(lang) {
  $('#clear').attr('title', jQuery.i18n.prop('button.reset'));
  $('#lbl_ch_items').html(jQuery.i18n.prop('label.cursed-hoard.items'));
  $('#lbl_ch_suits').html(jQuery.i18n.prop('label.cursed-hoard.suits'));
  $('#sound-label').html(jQuery.i18n.prop('button.sound'));
  $('#selected-language').html(languages[lang]);
  $('#language .dropdown-item').removeClass('active');
  $('#lang-' + lang).addClass('active');
}

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
        return;
      }
    }
  }
  if (localStorage.getItem('ch_items') === true || localStorage.getItem('ch_items') === 'true') {
    cursedHoardItems = true;
    deck.enableCursedHoardItems();
    $('#ch_items').prop('checked', true);
  }
  if (localStorage.getItem('ch_suits') === true || localStorage.getItem('ch_suits') === 'true') {
    cursedHoardSuits = true;
    deck.enableCursedHoardSuits();
    $('#ch_suits').prop('checked', true);
  }
}

function configureSound() {
  if (localStorage.getItem('sound_state') === false || localStorage.getItem('sound_state') === 'false') {
    click.muted = swoosh.muted = clear.muted = magic.muted = true;
    $('#sound_state').prop('checked', false);
  }
}

function configureSelectedPlayerCount() {
  if (window.location.search) {
    var params = window.location.search.substring(1).split('&');
    for (var i = 0; i < params.length; i++) {
      var param = params[i].split('=');
      if (param[0] === 'playerCount') {
        playerCount = param[1];
        return;
      }
    }
  }
  if (localStorage.getItem('playerCount')) {
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

function toggleSound() {
  const enabled = $('#sound_state').prop('checked');
  localStorage.setItem('sound_state', enabled);
  click.muted = swoosh.muted = clear.muted = magic.muted = !enabled;
  clear.play();
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
      if (discard.containsId(id)) {
        discard.deleteCardById(id);
      }
      updateHandView();
      actionId = NONE;
    }
  }
}

function selectFromHand(id) {
  const card = hand.getCardById(id);
  if (card.cursedItem) {
    removeFromHand(id);
  } else if (actionId === BOOK_OF_CHANGES) {
    if (id !== BOOK_OF_CHANGES && id !== PHOENIX) {
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
    if (selectedCard.suit === 'flood' || selectedCard.suit === 'flame' || isPhoenix(selectedCard)) {
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
  } else if (actionId === NONE) {
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
    playerCards: hand.faceDownCursedItems().concat(hand.cards()),
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
  if (hand.empty()) {
    $('#settings').show();
  } else {
    $('#settings').hide();
  }
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
  if (!hand.empty()) {
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
      hand.loadFromString(decodeURIComponent(param[1]).replace(/ /g, '+'));
    }
  }
  updateHandView();
}

function getDiscardFromQueryString() {
  var params = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < params.length; i++) {
    var param = params[i].split('=');
    if (param[0] === 'discard') {
      discard.loadFromString(decodeURIComponent(param[1]));
    }
  }
}

function useCardAction(id) {
  click.play();
  actionId = id;
  hand.undoCardAction(id);
  showCards();
  if (id === BOOK_OF_CHANGES) {
    bookOfChangesSelectedCard = NONE;
    bookOfChangesSelectedSuit = undefined;
    var template = Handlebars.compile($("#suit-selection-template").html());
    var html = template({
      suits: deck.suits()
    }, {
      allowProtoMethodsByDefault: true
    });
    $('#cards').html(html);
  } else if ([SHAPESHIFTER, CH_SHAPESHIFTER, MIRAGE, CH_MIRAGE].includes(id)) {
    var duplicator = hand.getCardById(id);
    showCards(duplicator.card.relatedSuits);
  }
  updateHandView();
  $('#card-action-text-' + id).text(jQuery.i18n.prop(id + '.action'));
  $('#card-action-use-' + id).hide();
  $('#card-action-cancel-' + id).show();
}

function cancelCardAction(id) {
  click.play();
  hand.undoCardAction(id)
  actionId = NONE;
  bookOfChangesSelectedCard = NONE;
  bookOfChangesSelectedSuit = undefined;
  $('#card-action-cancel-' + id).hide();
  $('#card-action-use-' + id).show();
  showCards();
  updateHandView();
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
  showCards(allSuits());
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
