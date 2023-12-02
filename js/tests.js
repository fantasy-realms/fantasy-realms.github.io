cursedHoardItems = false;
cursedHoardSuits = false;

$(document).ready(function () {
  assertScoreByName(['Blizzard', 'Great Flood', 'Elven Archers'], 35);
  assertScoreByName(['Smoke', 'Dwarvish Infantry', 'War Dirigible'], 50);
  assertScoreByName(['Candle', 'Smoke', 'Dwarvish Infantry', 'War Dirigible'], 44);
  assertScoreByCode('FR21,FR24,FR25,FR31,FR32,FR43,FR46+', 265);
  assertScoreByCode('FR06,FR07,FR08,FR09,FR10,FR11,FR26+', 326);
  assertScoreByCode('FR18,FR22,FR31,FR32,FR43,FR46,FR47+', 351, 'Max score without special cards?');
  assertScoreByCode('FR01,FR08,FR13,FR14,FR15,FR16,FR52+FR52:FR11', 260, 'Rulebook example I')
  assertScoreByCode('FR03,FR17,FR32,FR43,FR46,FR47,FR49+FR49:FR47:Wizard', 380, 'Rulebook example II');
  assertScoreByCode('FR03,FR17,FR28,FR38,FR43,FR46,FR47,FR49+FR49:FR03:Leader', 397, 'Best hand ever?');
  assertScoreByCode('FR02,FR03,FR05,FR17,FR26,FR28,FR47,FR49+FR49:FR17:Land', 388, 'Second best');
  assertScoreByCode('FR03,FR17,FR28,FR32,FR43,FR46,FR47,FR49+FR49:FR03:Army', 388, 'Second best');
  assertScoreByCode('FR28,FR29,FR31,FR32,FR34,FR35,FR51,FR53+FR51:FR31,FR53:FR29', -74, 'Worst hand ever?');
  assertScoreByCode('FR37,FR53+FR53:FR37', 0, '2 Basilisks should blank eachother');
  assertScoreByCode('FR24,FR53+FR53:FR24', 26, '2 Dwarvish Infantries should penalty eachother');
  assertScoreByCode('FR09,FR12,FR16,FR37+FR09:FR16', 95, 'Island can be used even when blanked');
  assertScoreByCode('FR10,FR53+FR53:FR10', 23, 'Elementals count their Doppelgänger');
  assertScoreByCode('FR26,FR27,FR30,FR36,FR38,FR39,FR40+', 193, 'Collector can score multiple sets');
  assertScoreByCode('FR26,FR46,FR47,FR51,FR53+FR51:FR46,FR53:FR46', 20, 'Collector does not score duplicated cards');
  assertScoreByCode('FR22,FR31,FR36,FR43,FR44,FR46,FR47+', 206, 'Gem of Order can score multiple sets');
  assertScoreByCode('FR46,FR47,FR02,FR05,FR25,FR32+', 105, 'Gem of Order can score multiple identical sets')
  assertScoreByCode('FR16,FR49,FR11,FR12+FR49:FR12:flood', 11, 'Blanking I');
  assertScoreByCode('FR12,FR08,FR16,FR49+FR49:FR12:beast', 3, 'Blanking II');
  assertScoreByCode('FR49,FR41,FR37,FR21+FR49:FR37:flood', 73, 'Blanking III');
  assertScoreByCode('FR49,FR41,FR24,FR22+FR49:FR24:flood', 56, 'Blanking IV');
  assertScoreByCode('FR49,FR41,FR06,FR08,FR22+FR49:FR08:wizard', 82, 'Blanking V');
  assertScoreByCode('FR08,FR12,FR16+', 65, 'Blanking cycle (base case) - Rulebook Q&A'); // Blizzard: 30 - 5  + Wildfire: 40 = 65
  assertScoreByCode('FR02,FR08,FR12,FR16+', 62, 'Blanking cycle (with cavern) - Rulebook Q&A'); // Blizzard: 30 + Flood: 32 = 62
  assertScoreByCode('FR08,FR12,FR16,FR49+FR49:FR12:beast', 3, 'Blanking cycle (with book changing Blizzard to beast)'); // Assuming cycle blanks itself, only book is active
  assertScoreByCode('FR02,FR08,FR12,FR16,FR49+FR49:FR12:beast', 9, 'Blanking cycle (with cavern and book)'); // Cycle blanks itself. Cavern isn't blanked : 6 + book 3 = 9
  assertScoreByCode('FR49,FR41,FR45,FR23,FR15+FR49:FR45:flood', 24, 'War Dirigible and Warship are blanked');
  assertScoreByCode('FR49,FR41,FR45+FR49:FR45:flood', 61, 'War Dirigible does not need Army when Army cleared from penalty');
  assertScoreByCode('FR49,FR45,FR25+FR49:FR25:land', 53, 'War Dirigible does not need Army when Army cleared from penalty');
  assertScoreByCode('FR21,FR45,FR13+', 47, 'War Dirigible + Smoke');
  assertScoreByCode('FR21,FR13,FR45+', 47, 'Smoke + War Dirigible');
  deck.enableCursedHoardSuits();
  cursedHoardSuits = true;
  assertScoreByCode('CH10,FR41,FR10,FR07,FR22,FR23+', 114);
  assertScoreByCode('CH08,FR32,FR37+CH08:FR32', 57, 'Angel');
  // Phoenix
  assertScoreByCode('FR55,FR37,FR16,FR11,CH08,FR49+CH08:FR16,FR49:FR37:wizard', 116, 'Phoenix can not be blanked by any card except Floods');
  assertScoreByCode('FR55,CH10+', 59, 'Phoenix can not be blanked by Demon');
  assertScoreByCode('FR55,CH10,FR18,FR15+', 87, 'Phoenix prevents blanking by Demon because of its bonus');
  assertScoreByCode('CH18,FR55,FR27+', 41, 'Great Flood can still blank a Phoenix since it is a Flood');
  assertScoreByCode('FR55,FR45,FR22+', 59, 'Phoenix can not blank any other card');
  assertScoreByCode('FR55,FR02,CH17,FR15,FR22,FR26,FR11+', 114, 'Phoenix also counts as a Weather');
  assertScoreByCode('FR55,FR13,FR20,FR17,FR26+', 94, 'Phoenix also counts as a Flame');
  assertScoreByCode('FR55,FR20,FR17,FR26,FR19,FR15,FR14,FR13+', 252, 'Phoenix is a Flame and a Weather at the same time');
  assertScoreByCode('FR55,FR30+', 29, 'Phoenix gives double bonus for Enchantress');
  assertScoreByCode('FR55,FR12+', 34, 'Phoenix gives double penalty for Blizzard');
  assertScoreByCode('FR55,CH21,FR15+', 35, 'Bonus of Phoenix prevents bonus of World Tree');
  assertScoreByCode('FR55,FR20,FR15,CH22,FR53,FR26,FR27+CH22:FR55,FR53:FR55', 109, 'Copy of a Phoenix only counts as a Beast');
  // Phoenix (Promo)
  assertScoreByCode('FR55P,FR02,CH17,FR15,FR22,FR26,FR11+', 114, 'Phoenix (Promo) also counts as a Weather');
  assertScoreByCode('FR55P,FR13,FR20,FR17,FR26+', 94, 'Phoenix (Promo) also counts as a Flame');
  assertScoreByCode('FR55P,FR20,FR17,FR26,FR19,FR15,FR14,FR13+', 252, 'Phoenix (Promo) is a Flame and a Weather at the same time');
  assertScoreByCode('FR55P,FR30+', 29, 'Phoenix (Promo) gives double bonus for Enchantress');
  assertScoreByCode('FR55P,FR12+', 34, 'Phoenix (Promo) gives double penalty for Blizzard');
  assertScoreByCode('FR55P,CH21,FR15+', 35, 'Bonus of Phoenix (Promo) prevents bonus of World Tree');
  assertScoreByCode('FR55P,FR20,FR15,CH22,FR53,FR26,FR27+CH22:FR55,FR53:FR55P', 109, 'Copy of a Phoenix (Promo) only counts as a Beast');
  assertScoreByCode('FR55P,FR10,FR20,FR15,FR36,FR38,FR26,CH05+', 132, 'Phoenix (Promo) retains suits when blanked');
});

function assertScoreByName(cardNames, expectedScore, message) {
  hand.clear();
  for (const cardName of cardNames) {
    hand.addCard(deck.getCardByName(cardName));
  }
  assertScore(hand, expectedScore, message);
}

function assertScoreByCode(code, expectedScore, message) {
  hand.clear();
  hand.loadFromString(code);
  assertScore(hand, expectedScore, message);
}

function assertScore(hand, expectedScore, message) {
  var score = hand.score();
  if (score === expectedScore) {
    $('#tests').append('<li class="list-group-item list-group-item-success"><b>TEST SUCCESS</b> &nbsp;<a href="index.html?hand=' +
      hand.toString() + '">' + hand.cardNames().join() + '</a>&nbsp; scored ' + score + ' points' +
      (message ? ':&nbsp;<b>' + message + '</b>' : '') + '</li>');
  } else {
    $('#tests').append('<li class="list-group-item list-group-item-danger"><b>TEST FAILED:</b> &nbsp;<a href="index.html?hand=' +
      hand.toString() + '">' + hand.cardNames().join() + '</a>&nbsp; scored ' + score + ' points (expected: ' + expectedScore + ')' +
      (message ? ':&nbsp;<b>' + message + '</b>' : '') + '</li>');
  }
}
