var base = {
  'FR01': {
    id: 'FR01',
    suit: 'land',
    name: 'Mountain',
    strength: 9,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.contains('Smoke') && hand.contains('Wildfire') ? 50 : 0;
    },
    clearsPenalty: function (card) {
      return card.suit === 'flood';
    },
    relatedSuits: ['flood'],
    relatedCards: ['Smoke', 'Wildfire']
  },
  'FR02': {
    id: 'FR02',
    suit: 'land',
    name: 'Cavern',
    strength: 6,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.contains('Dwarvish Infantry') || hand.contains('Dragon') ? 25 : 0;
    },
    clearsPenalty: function (card) {
      return card.suit === 'weather' || isPhoenix(card);
    },
    relatedSuits: ['weather'],
    relatedCards: ['Dwarvish Infantry', 'Dragon']
  },
  'FR03': {
    id: 'FR03',
    suit: 'land',
    name: 'Bell Tower',
    strength: 8,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.containsSuit('wizard') ? 15 : 0;
    },
    relatedSuits: ['wizard'],
    relatedCards: []
  },
  'FR04': {
    id: 'FR04',
    suit: 'land',
    name: 'Forest',
    strength: 7,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 12 * hand.countSuit('beast') + (hand.contains('Elven Archers') ? 12 : 0);
    },
    relatedSuits: ['beast'],
    relatedCards: ['Elven Archers']
  },
  'FR05': {
    id: 'FR05',
    suit: 'land',
    name: 'Earth Elemental',
    strength: 4,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 15 * hand.countSuitExcluding('land', this.id);
    },
    relatedSuits: ['land'],
    relatedCards: []
  },
  'FR06': {
    id: 'FR06',
    suit: 'flood',
    name: 'Fountain of Life',
    strength: 1,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var max = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.suit === 'weapon' || card.suit === 'flood' || card.suit === 'flame' || card.suit === 'land' || card.suit === 'weather' || isPhoenix(card)) {
          if (card.strength > max) {
            max = card.strength;
          }
        }
      }
      return max;
    },
    relatedSuits: ['weapon', 'flood', 'flame', 'land', 'weather'],
    relatedCards: []
  },
  'FR07': {
    id: 'FR07',
    suit: 'flood',
    name: 'Swamp',
    strength: 18,
    bonus: false,
    penalty: true,
    penaltyScore: function (hand) {
      var penaltyCards = hand.countSuit('flame');
      if (!isArmyClearedFromPenalty(this, hand)) {
        penaltyCards += hand.countSuit('army');
      }
      return -3 * penaltyCards;
    },
    relatedSuits: ['army', 'flame'],
    relatedCards: []
  },
  'FR08': {
    id: 'FR08',
    suit: 'flood',
    name: 'Great Flood',
    strength: 32,
    bonus: false,
    penalty: true,
    blanks: function (card, hand) {
      return (card.suit === 'army' && !isArmyClearedFromPenalty(this, hand)) ||
        (card.suit === 'land' && card.name !== 'Mountain') ||
        (card.suit === 'flame' && card.name !== 'Lightning') || card.id === PHOENIX_PROMO;
    },
    relatedSuits: ['army', 'land', 'flame'],
    relatedCards: ['Mountain', 'Lightning']
  },
  'FR09': {
    id: 'FR09',
    suit: 'flood',
    name: 'Island',
    strength: 14,
    bonus: true,
    penalty: false,
    action: true,
    relatedSuits: ['flood', 'flame'],
    relatedCards: []
  },
  'FR10': {
    id: 'FR10',
    suit: 'flood',
    name: 'Water Elemental',
    strength: 4,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 15 * hand.countSuitExcluding('flood', this.id);
    },
    relatedSuits: ['flood'],
    relatedCards: []
  },
  'FR11': {
    id: 'FR11',
    suit: 'weather',
    name: 'Rainstorm',
    strength: 8,
    bonus: true,
    penalty: true,
    bonusScore: function (hand) {
      return 10 * hand.countSuit('flood');
    },
    blanks: function (card, hand) {
      return (card.suit === 'flame' && card.name !== 'Lightning') || card.id === PHOENIX_PROMO;
    },
    relatedSuits: ['flood', 'flame'],
    relatedCards: ['Lightning']
  },
  'FR12': {
    id: 'FR12',
    suit: 'weather',
    name: 'Blizzard',
    strength: 30,
    bonus: false,
    penalty: true,
    penaltyScore: function (hand) {
      var penaltyCards = hand.countSuit('beast') + hand.countSuit('flame');
      if (!isArmyClearedFromPenalty(this, hand)) {
        penaltyCards += hand.countSuit('army');
      }
      if (!isLeaderClearedFromPenalty(this, hand)) {
        penaltyCards += hand.countSuit('leader')
      }
      return -5 * penaltyCards;
    },
    blanks: function (card, hand) {
      return card.suit === 'flood';
    },
    relatedSuits: ['leader', 'beast', 'flame', 'army', 'flood'],
    relatedCards: []
  },
  'FR13': {
    id: 'FR13',
    suit: 'weather',
    name: 'Smoke',
    strength: 27,
    bonus: false,
    penalty: true,
    blankedIf: function (hand) {
      return !hand.containsSuit('flame');
    },
    relatedSuits: ['flame'],
    relatedCards: []
  },
  'FR14': {
    id: 'FR14',
    suit: 'weather',
    name: 'Whirlwind',
    strength: 13,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.contains('Rainstorm') && (hand.contains('Blizzard') || hand.contains('Great Flood')) ? 40 : 0;
    },
    relatedSuits: ['Rainstorm'],
    relatedCards: ['Blizzard', 'Great Flood']
  },
  'FR15': {
    id: 'FR15',
    suit: 'weather',
    name: 'Air Elemental',
    strength: 4,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 15 * hand.countSuitExcluding('weather', this.id);
    },
    relatedSuits: ['weather'],
    relatedCards: []
  },
  'FR16': {
    id: 'FR16',
    suit: 'flame',
    name: 'Wildfire',
    strength: 40,
    bonus: false,
    penalty: true,
    blanks: function (card, hand) {
      return !(card.suit === 'flame' || card.suit === 'wizard' || card.suit === 'weather' ||
        card.suit === 'weapon' || card.suit === 'artifact' || card.suit === 'wild' || card.name === 'Mountain' ||
        card.name === 'Great Flood' || card.name === 'Island' || card.name === 'Unicorn' || card.name === 'Dragon' ||
        isPhoenix(card));
    },
    relatedSuits: allSuits(),
    relatedCards: ['Mountain', 'Great Flood', 'Island', 'Unicorn', 'Dragon', 'River']
  },
  'FR17': {
    id: 'FR17',
    suit: 'flame',
    name: 'Candle',
    strength: 2,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.contains('Book of Changes') && hand.contains('Bell Tower') && hand.containsSuit('wizard') ? 100 : 0;
    },
    relatedSuits: ['wizard'],
    relatedCards: ['Book of Changes', 'Bell Tower']
  },
  'FR18': {
    id: 'FR18',
    suit: 'flame',
    name: 'Forge',
    strength: 9,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 9 * (hand.countSuit('weapon') + hand.countSuit('artifact'));
    },
    relatedSuits: ['weapon', 'artifact'],
    relatedCards: []
  },
  'FR19': {
    id: 'FR19',
    suit: 'flame',
    name: 'Lightning',
    strength: 11,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.contains('Rainstorm') ? 30 : 0;
    },
    relatedSuits: [],
    relatedCards: ['Rainstorm']
  },
  'FR20': {
    id: 'FR20',
    suit: 'flame',
    name: 'Fire Elemental',
    strength: 4,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 15 * hand.countSuitExcluding('flame', this.id);
    },
    relatedSuits: ['flame'],
    relatedCards: []
  },
  'FR21': {
    id: 'FR21',
    suit: 'army',
    name: 'Knights',
    strength: 20,
    bonus: false,
    penalty: true,
    penaltyScore: function (hand) {
      if (!isLeaderClearedFromPenalty(this, hand)) {
        return hand.containsSuit('leader') ? 0 : -8;
      }
      return 0;
    },
    relatedSuits: ['leader'],
    relatedCards: []
  },
  'FR22': {
    id: 'FR22',
    suit: 'army',
    name: 'Elven Archers',
    strength: 10,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.containsSuit('weather') ? 0 : 5;
    },
    relatedSuits: ['weather'],
    relatedCards: []
  },
  'FR23': {
    id: 'FR23',
    suit: 'army',
    name: 'Light Cavalry',
    strength: 17,
    bonus: false,
    penalty: true,
    penaltyScore: function (hand) {
      return -2 * hand.countSuit('land');
    },
    relatedSuits: ['land'],
    relatedCards: []

  },
  'FR24': {
    id: 'FR24',
    suit: 'army',
    name: 'Dwarvish Infantry',
    strength: 15,
    bonus: false,
    penalty: true,
    penaltyScore: function (hand) {
      if (!isArmyClearedFromPenalty(this, hand)) {
        return -2 * hand.countSuitExcluding('army', this.id);
      }
      return 0;
    },
    relatedSuits: ['army'],
    relatedCards: []
  },
  'FR25': {
    id: 'FR25',
    suit: 'army',
    name: 'Rangers',
    strength: 5,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 10 * hand.countSuit('land');
    },
    relatedSuits: ['land', 'army'],
    relatedCards: []
  },
  'FR26': {
    id: 'FR26',
    suit: 'wizard',
    name: 'Collector',
    strength: 7,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var bySuit = {};
      if (hand.containsId(PHOENIX_PROMO, true)) {
        var phoenix = hand.getCardById(PHOENIX_PROMO);
        bySuit['flame'] = {};
        bySuit['flame'][phoenix.name] = phoenix;
        bySuit['weather'] = {};
        bySuit['weather'][phoenix.name] = phoenix;
        bySuit[phoenix.suit] = {};
        bySuit[phoenix.suit][phoenix.name] = phoenix;
      }
      for (const card of hand.nonBlankedCards()) {
        if (card.id !== PHOENIX_PROMO) {
          if (card.id === PHOENIX) {
            if (bySuit['flame'] === undefined) {
              bySuit['flame'] = {};
            }
            bySuit['flame'][card.name] = card;
            if (bySuit['weather'] === undefined) {
              bySuit['weather'] = {};
            }
            bySuit['weather'][card.name] = card;
          }
          var suit = card.suit;
          if (bySuit[suit] === undefined) {
            bySuit[suit] = {};
          }
          bySuit[suit][card.name] = card;
        }
      }
      var bonus = 0;
      for (const suit of Object.values(bySuit)) {
        var count = Object.keys(suit).length;
        if (count === 3) {
          bonus += 10;
        } else if (count === 4) {
          bonus += 40;
        } else if (count >= 5) {
          bonus += 100;
        }
      }
      return bonus;
    },
    relatedSuits: allSuits(),
    relatedCards: []
  },
  'FR27': {
    id: 'FR27',
    suit: 'wizard',
    name: 'Beastmaster',
    strength: 9,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 9 * hand.countSuit('beast');
    },
    clearsPenalty: function (card) {
      return card.suit === 'beast';
    },
    relatedSuits: ['beast'],
    relatedCards: []
  },
  'FR28': {
    id: 'FR28',
    suit: 'wizard',
    name: 'Necromancer',
    strength: 3,
    bonus: true,
    penalty: false,
    relatedSuits: ['army', 'leader', 'wizard', 'beast'],
    relatedCards: [],
    extraCard: true
  },
  'FR29': {
    id: 'FR29',
    suit: 'wizard',
    name: 'Warlock Lord',
    strength: 25,
    bonus: false,
    penalty: true,
    penaltyScore: function (hand) {
      var leaderCount = !isLeaderClearedFromPenalty(this, hand) ? 0 : hand.countSuit('leader');
      return -10 * (leaderCount + hand.countSuitExcluding('wizard', this.id));
    },
    relatedSuits: ['leader', 'wizard'],
    relatedCards: []
  },
  'FR30': {
    id: 'FR30',
    suit: 'wizard',
    name: 'Enchantress',
    strength: 5,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 5 * (hand.countSuit('land') + hand.countSuit('weather') + hand.countSuit('flood') + hand.countSuit('flame'));
    },
    relatedSuits: ['land', 'weather', 'flood', 'flame'],
    relatedCards: []
  },
  'FR31': {
    id: 'FR31',
    suit: 'leader',
    name: 'King',
    strength: 8,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return (hand.contains('Queen') ? 20 : 5) * hand.countSuit('army');
    },
    relatedSuits: ['army'],
    relatedCards: ['Queen']
  },
  'FR32': {
    id: 'FR32',
    suit: 'leader',
    name: 'Queen',
    strength: 6,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return (hand.contains('King') ? 20 : 5) * hand.countSuit('army');
    },
    relatedSuits: ['army'],
    relatedCards: ['King']
  },
  'FR33': {
    id: 'FR33',
    suit: 'leader',
    name: 'Princess',
    strength: 2,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 8 * (hand.countSuit('army') + hand.countSuit('wizard') + hand.countSuitExcluding('leader', this.id));
    },
    relatedSuits: ['army', 'wizard', 'leader'],
    relatedCards: []
  },
  'FR34': {
    id: 'FR34',
    suit: 'leader',
    name: 'Warlord',
    strength: 4,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var total = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.suit === 'army') {
          total += card.strength;
        }
      }
      return total;
    },
    relatedSuits: ['army'],
    relatedCards: []
  },
  'FR35': {
    id: 'FR35',
    suit: 'leader',
    name: 'Empress',
    strength: 15,
    bonus: true,
    penalty: true,
    bonusScore: function (hand) {
      return 10 * hand.countSuit('army');
    },
    penaltyScore: function (hand) {
      if (!isLeaderClearedFromPenalty(this, hand)) {
        return -5 * hand.countSuitExcluding('leader', this.id);
      }
      return 0;
    },
    relatedSuits: ['army', 'leader'],
    relatedCards: []
  },
  'FR36': {
    id: 'FR36',
    suit: 'beast',
    name: 'Unicorn',
    strength: 9,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.contains('Princess') ? 30 : (hand.contains('Empress') || hand.contains('Queen') || hand.contains('Enchantress')) ? 15 : 0;
    },
    relatedSuits: [],
    relatedCards: ['Princess', 'Empress', 'Queen', 'Enchantress']
  },
  'FR37': {
    id: 'FR37',
    suit: 'beast',
    name: 'Basilisk',
    strength: 35,
    bonus: false,
    penalty: true,
    blanks: function (card, hand) {
      return (card.suit === 'army' && !isArmyClearedFromPenalty(this, hand)) ||
        (card.suit === 'leader' && !isLeaderClearedFromPenalty(this, hand)) ||
        (card.suit === 'beast' && !isBeastClearedFromPenalty(this, hand) && card.id !== this.id && card.id !== PHOENIX);
    },
    relatedSuits: ['army', 'leader', 'beast'],
    relatedCards: []
  },
  'FR38': {
    id: 'FR38',
    suit: 'beast',
    name: 'Warhorse',
    strength: 6,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.containsSuit('leader') || hand.containsSuit('wizard') ? 14 : 0;
    },
    relatedSuits: ['leader', 'wizard'],
    relatedCards: []
  },
  'FR39': {
    id: 'FR39',
    suit: 'beast',
    name: 'Dragon',
    strength: 30,
    bonus: false,
    penalty: true,
    penaltyScore: function (hand) {
      return hand.containsSuit('wizard') ? 0 : -40;
    },
    relatedSuits: ['wizard'],
    relatedCards: []
  },
  'FR40': {
    id: 'FR40',
    suit: 'beast',
    name: 'Hydra',
    strength: 12,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.contains('Swamp') ? 28 : 0;
    },
    relatedSuits: [],
    relatedCards: ['Swamp']
  },
  'FR41': {
    id: 'FR41',
    suit: 'weapon',
    name: 'Warship',
    strength: 23,
    bonus: true,
    penalty: true,
    blankedIf: function (hand) {
      return !hand.containsSuit('flood');
    },
    relatedSuits: ['army', 'flood'],
    relatedCards: []
  },
  'FR42': {
    id: 'FR42',
    suit: 'weapon',
    name: 'Magic Wand',
    strength: 1,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.containsSuit('wizard') ? 25 : 0;
    },
    relatedSuits: ['wizard'],
    relatedCards: []
  },
  'FR43': {
    id: 'FR43',
    suit: 'weapon',
    name: 'Sword of Keth',
    strength: 7,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.containsSuit('leader') ? (hand.contains('Shield of Keth') ? 40 : 10) : 0;
    },
    relatedSuits: ['leader'],
    relatedCards: ['Shield of Keth']
  },
  'FR44': {
    id: 'FR44',
    suit: 'weapon',
    name: 'Elven Longbow',
    strength: 3,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.contains('Elven Archers') || hand.contains('Warlord') || hand.contains('Beastmaster') ? 30 : 0;
    },
    relatedSuits: [],
    relatedCards: ['Elven Archers', 'Warlord', 'Beastmaster']
  },
  'FR45': {
    id: 'FR45',
    suit: 'weapon',
    name: 'War Dirigible',
    strength: 35,
    bonus: false,
    penalty: true,
    blankedIf: function (hand) {
      return (!hand.containsSuit('army') && !isArmyClearedFromPenalty(this, hand)) || hand.containsSuitExcluding('weather', PHOENIX);
    },
    relatedSuits: ['army', 'weather'],
    relatedCards: []
  },
  'FR46': {
    id: 'FR46',
    suit: 'artifact',
    name: 'Shield of Keth',
    strength: 4,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.containsSuit('leader') ? (hand.contains('Sword of Keth') ? 40 : 15) : 0;
    },
    relatedSuits: ['leader'],
    relatedCards: ['Sword of Keth']
  },
  'FR47': {
    id: 'FR47',
    suit: 'artifact',
    name: 'Gem of Order',
    strength: 5,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var strengths = hand.nonBlankedCards().map(card => card.strength).sort(function (a, b) { return a - b; });
      var bonus = 0;
      var runFound = false;
      do {
        var run = [];
        for (var i = 0; i < strengths.length; i++) {
          var strength = strengths[i];
          if (run.length !== 0 && (strength === run[run.length - 1] + 1)) {
            run.push(strength);
          } else if (run.length < 3 && !run.includes(strength)) {
            run = [strength];
          }
        }
        if (run.length < 3) {
          runFound = false;
        } else {
          runFound = true;
          for (var i = 0; i < run.length; i++) {
            strengths.splice(strengths.indexOf(run[i]), 1);
          }
          if (run.length === 3) {
            bonus += 10;
          } else if (run.length === 4) {
            bonus += 30;
          } else if (run.length === 5) {
            bonus += 60;
          } else if (run.length === 6) {
            bonus += 100;
          } else if (run.length >= 7) {
            bonus += 150;
          }
        }
      } while (runFound);
      return bonus;
    },
    relatedSuits: [],
    relatedCards: []
  },
  'FR48': {
    id: 'FR48',
    suit: 'artifact',
    name: 'World Tree',
    strength: 2,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var suits = [];
      for (const card of hand.nonBlankedCards()) {
        if (isPhoenix(card)) {
          if (suits.includes('weather') || suits.includes('flame')) {
            return 0;
          }
          suits.push('weather');
          suits.push('flame');
        }
        if (suits.includes(card.suit)) {
          return 0;
        }
        suits.push(card.suit);
      }
      return 50;
    },
    relatedSuits: allSuits(),
    relatedCards: []
  },
  'FR49': {
    id: 'FR49',
    suit: 'artifact',
    name: 'Book of Changes',
    strength: 3,
    bonus: true,
    penalty: false,
    action: true,
    relatedSuits: [], // empty because the main reason for relatedSuits is to determine how to use 'Book of Changes'
    relatedCards: []
  },
  'FR50': {
    id: 'FR50',
    suit: 'artifact',
    name: 'Protection Rune',
    strength: 1,
    bonus: true,
    penalty: false,
    clearsPenalty: function (card) {
      return true;
    },
    relatedSuits: [],
    relatedCards: []
  },
  'FR51': {
    id: 'FR51',
    suit: 'wild',
    name: 'Shapeshifter',
    strength: 0,
    bonus: true,
    penalty: false,
    impersonator: true,
    action: true,
    relatedSuits: ['artifact', 'leader', 'wizard', 'weapon', 'beast'].sort(),
    relatedCards: []
  },
  'FR52': {
    id: 'FR52',
    suit: 'wild',
    name: 'Mirage',
    strength: 0,
    bonus: true,
    penalty: false,
    impersonator: true,
    action: true,
    relatedSuits: ['army', 'land', 'weather', 'flood', 'flame'].sort(),
    relatedCards: []
  },
  'FR53': {
    id: 'FR53',
    suit: 'wild',
    name: 'Doppelgänger',
    strength: 0,
    bonus: true,
    penalty: false,
    impersonator: true,
    action: true,
    relatedSuits: [],
    relatedCards: []
  },
  'FR54': {
    id: 'FR54',
    suit: 'wizard',
    name: 'Jester',
    strength: 3,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var oddCount = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.strength % 2 === 1) {
          oddCount++;
        }
      }
      if (oddCount === hand.size()) {
        return 50;
      } else {
        return (oddCount - 1) * 3;
      }
    },
    relatedSuits: [],
    relatedCards: []
  },
  'FR55': {
    id: 'FR55',
    suit: 'beast',
    addSuits: ['flame', 'weather'],
    name: 'Phoenix',
    strength: 14,
    bonus: true,
    penalty: true,
    blankedIf: function (hand) {
      return hand.containsSuit('flood');
    },
    relatedSuits: [],
    relatedCards: []
  },
  'FR55P': {
    id: 'FR55P',
    suit: 'beast',
    addSuits: ['flame', 'weather'],
    name: 'Phoenix (Promo)',
    strength: 14,
    bonus: true,
    penalty: true,
    blankedIf: function (hand) {
      return hand.containsSuit('flood');
    },
    relatedSuits: [],
    relatedCards: []
  },
};

var cursedHoard = {
  'CH01': {
    id: 'CH01',
    suit: 'building',
    name: 'Dungeon',
    strength: 7,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return (hand.containsSuit('undead') ? 10 + (hand.countSuit('undead') - 1) * 5 : 0) +
        (hand.containsSuit('beast') ? 10 + (hand.countSuit('beast') - 1) * 5 : 0) +
        (hand.containsSuit('artifact') ? 10 + (hand.countSuit('artifact') - 1) * 5 : 0) +
        (hand.countCardName('Necromancer') * 5) +
        (hand.countCardName('Warlock Lord') * 5) +
        (hand.countCardName('Demon') * 5);
    },
    relatedSuits: ['undead', 'beast', 'artifact'],
    relatedCards: ['Necromancer', 'Warlock Lord', 'Demon']
  },
  'CH02': {
    id: 'CH02',
    suit: 'building',
    name: 'Castle',
    strength: 10,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return (hand.containsSuit('leader') ? 10 : 0) +
        (hand.containsSuit('army') ? 10 : 0) +
        (hand.containsSuit('land') ? 10 : 0) +
        (hand.containsSuitExcluding('building', this.id) ? 10 + (hand.countSuitExcluding('building', this.id) - 1) * 5 : 0);
    },
    relatedSuits: ['leader', 'army', 'land', 'building'],
    relatedCards: []
  },
  'CH03': {
    id: 'CH03',
    suit: 'building',
    name: 'Crypt',
    strength: 21,
    bonus: true,
    penalty: true,
    bonusScore: function (hand) {
      var total = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.suit === 'undead') {
          total += card.strength;
        }
      }
      return total;
    },
    blanks: function (card, hand) {
      return card.suit === 'leader' && !isLeaderClearedFromPenalty(this, hand);
    },
    relatedSuits: ['undead', 'leader'],
    relatedCards: []
  },
  'CH04': {
    id: 'CH04',
    suit: 'building',
    name: 'Chapel',
    strength: 2,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      if (hand.countSuit('leader') + hand.countSuit('wizard') + hand.countSuit('outsider') + hand.countSuit('undead') === 2) {
        return 40;
      } else {
        return 0;
      }
    },
    relatedSuits: ['leader', 'wizard', 'outsider', 'undead'],
    relatedCards: []
  },
  'CH05': {
    id: 'CH05',
    suit: 'land',
    name: 'Garden',
    strength: 11,
    bonus: true,
    penalty: true,
    bonusScore: function (hand) {
      return 11 * (hand.countSuit('leader') + hand.countSuit('beast'));
    },
    blankedIf: function (hand) {
      return hand.containsSuit('undead') || hand.contains('Necromancer') || hand.contains('Demon');
    },
    relatedSuits: ['leader', 'beast', 'undead'],
    relatedCards: ['Necromancer', 'Demon']
  },
  'CH06': {
    id: 'CH06',
    suit: 'outsider',
    name: 'Genie',
    strength: -50,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 10 * (playerCount - 1);
    },
    relatedSuits: [],
    relatedCards: ['Leprechaun'],
    extraCard: true,
    referencesPlayerCount: true
  },
  'CH07': {
    id: 'CH07',
    suit: 'outsider',
    name: 'Judge',
    strength: 11,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var bonus = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.penalty && !card.penaltyCleared) {
          bonus += 10;
        }
      }
      return bonus;
    },
    relatedSuits: [],
    relatedCards: []
  },
  'CH08': {
    id: 'CH08',
    suit: 'outsider',
    name: 'Angel',
    strength: 16,
    bonus: true,
    action: true,
    penalty: false,
    relatedSuits: [],
    relatedCards: []
  },
  'CH09': {
    id: 'CH09',
    suit: 'outsider',
    name: 'Leprechaun',
    strength: 20,
    bonus: true,
    penalty: false,
    relatedSuits: [],
    relatedCards: [],
    extraCard: true
  },
  'CH10': {
    id: 'CH10',
    suit: 'outsider',
    name: 'Demon',
    strength: 45,
    bonus: false,
    penalty: true,
    blanks: function (card, hand) {
      if (card.suit === 'outsider' || card.id === PHOENIX) {
        return false;
      }
      if (card.id === PHOENIX_PROMO) {
        return hand.countSuit(card.suit) === 1 || hand.countSuit('flame') === 1 || hand.countSuit('weather') === 1;
      } else {
        return hand.countSuit(card.suit) === 1;
      }
    },
    relatedSuits: ['outsider'],
    relatedCards: []
  },
  'CH11': {
    id: 'CH11',
    suit: 'undead',
    name: 'Dark Queen',
    strength: 10,
    bonus: true,
    penalty: false,
    bonusScore: function (hand, discard) {
      return (5 * (discard.countSuit('land') + discard.countSuit('flood') + discard.countSuit('flame') + discard.countSuit('weather')))
        + (discard.contains('Unicorn') ? 5 : 0);
    },
    relatedSuits: ['land', 'flood', 'flame', 'weather'],
    relatedCards: ['Unicorn'],
    referencesDiscardArea: true
  },
  'CH12': {
    id: 'CH12',
    suit: 'undead',
    name: 'Ghoul',
    strength: 8,
    bonus: true,
    penalty: false,
    bonusScore: function (hand, discard) {
      return 4 * (discard.countSuit('wizard') + discard.countSuit('leader') + discard.countSuit('army') + discard.countSuit('beast') + discard.countSuit('undead'));
    },
    relatedSuits: ['wizard', 'leader', 'army', 'beast', 'undead'],
    relatedCards: [],
    referencesDiscardArea: true
  },
  'CH13': {
    id: 'CH13',
    suit: 'undead',
    name: 'Specter',
    strength: 12,
    bonus: true,
    penalty: false,
    bonusScore: function (hand, discard) {
      return 6 * (discard.countSuit('wizard') + discard.countSuit('artifact') + discard.countSuit('outsider'));
    },
    relatedSuits: ['wizard', 'artifact', 'outsider'],
    relatedCards: [],
    referencesDiscardArea: true
  },
  'CH14': {
    id: 'CH14',
    suit: 'undead',
    name: 'Lich',
    strength: 13,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return (hand.contains('Necromancer') ? 10 : 0) + 10 * hand.countSuitExcluding('undead', this.id);
    },
    relatedSuits: ['undead'],
    relatedCards: ['Necromancer']
  },
  'CH15': {
    id: 'CH15',
    suit: 'undead',
    name: 'Death Knight',
    strength: 14,
    bonus: true,
    penalty: false,
    bonusScore: function (hand, discard) {
      return 7 * (discard.countSuit('weapon') + discard.countSuit('army'));
    },
    relatedSuits: ['weapon', 'army'],
    relatedCards: [],
    referencesDiscardArea: true
  },
  'CH16': {
    id: 'CH16',
    suit: 'building',
    name: 'Bell Tower',
    replaces: 'FR03',
    strength: 8,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return (hand.containsSuit('wizard') || hand.containsSuit('undead')) ? 15 : 0;
    },
    relatedSuits: ['wizard', 'undead'],
    relatedCards: []
  },
  'CH17': {
    id: 'CH17',
    suit: 'flood',
    name: 'Fountain of Life',
    replaces: 'FR06',
    strength: 1,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var max = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.suit === 'building' || card.suit === 'weapon' || card.suit === 'flood' || card.suit === 'flame' || card.suit === 'land' || card.suit === 'weather' || isPhoenix(card)) {
          if (card.strength > max) {
            max = card.strength;
          }
        }
      }
      return max;
    },
    relatedSuits: ['building', 'weapon', 'flood', 'flame', 'land', 'weather'],
    relatedCards: []
  },
  'CH18': {
    id: 'CH18',
    suit: 'flood',
    name: 'Great Flood',
    replaces: 'FR08',
    strength: 32,
    bonus: false,
    penalty: true,
    blanks: function (card, hand) {
      return (card.suit === 'army' && !isArmyClearedFromPenalty(this, hand)) ||
        (card.suit === 'building') ||
        (card.suit === 'land' && card.name !== 'Mountain') ||
        (card.suit === 'flame' && card.name !== 'Lightning') || card.id === PHOENIX_PROMO;
    },
    relatedSuits: ['army', 'building', 'land', 'flame'],
    relatedCards: ['Mountain', 'Lightning']
  },
  'CH19': {
    id: 'CH19',
    suit: 'army',
    name: 'Rangers',
    replaces: 'FR25',
    strength: 5,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 10 * (hand.countSuit('land') + hand.countSuit('building'));
    },
    relatedSuits: ['land', 'building', 'army'],
    relatedCards: []
  },
  'CH20': {
    id: 'CH20',
    suit: 'wizard',
    name: 'Necromancer',
    replaces: 'FR28',
    strength: 3,
    bonus: true,
    penalty: false,
    relatedSuits: ['army', 'leader', 'wizard', 'beast', 'undead'],
    relatedCards: [],
    extraCard: true
  },
  'CH21': {
    id: 'CH21',
    suit: 'artifact',
    name: 'World Tree',
    replaces: 'FR48',
    strength: 2,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var suits = [];
      for (const card of hand.nonBlankedCards()) {
        if (isPhoenix(card)) {
          if (suits.includes('weather') || suits.includes('flame')) {
            return 0;
          }
          suits.push('weather');
          suits.push('flame');
        }
        if (suits.includes(card.suit)) {
          return 0;
        }
        suits.push(card.suit);
      }
      return 70;
    },
    relatedSuits: allSuits(),
    relatedCards: []
  },
  'CH22': {
    id: 'CH22',
    suit: 'wild',
    name: 'Shapeshifter',
    replaces: 'FR51',
    strength: 0,
    bonus: true,
    penalty: false,
    impersonator: true,
    action: true,
    relatedSuits: ['artifact', 'leader', 'wizard', 'weapon', 'beast', 'undead'].sort(),
    relatedCards: []
  },
  'CH23': {
    id: 'CH23',
    suit: 'wild',
    name: 'Mirage',
    replaces: 'FR52',
    strength: 0,
    bonus: true,
    penalty: false,
    impersonator: true,
    action: true,
    relatedSuits: ['army', 'building', 'land', 'weather', 'flood', 'flame'].sort(),
    relatedCards: []
  }
};

var cursedItems = {
  'CH24': {
    id: 'CH24',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Spyglass',
    timing: 'any-time',
    bonus: true,
    penalty: true,
    penaltyScore: function () {
      return playerCount === 2 ? -9 : 0;
    },
    strength: -1,
    referencesPlayerCount: true
  },
  'CH25': {
    id: 'CH25',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Sarcophagus',
    timing: 'replace-turn',
    bonus: true,
    strength: 5
  },
  'CH26': {
    id: 'CH26',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Blindfold',
    timing: 'replace-turn',
    bonus: true,
    strength: 5
  },
  'CH27': {
    id: 'CH27',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Book of Prophecy',
    timing: 'any-time',
    bonus: true,
    strength: -1
  },
  'CH28': {
    id: 'CH28',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Crystal Ball',
    timing: 'any-time',
    bonus: true,
    strength: -1
  },
  'CH29': {
    id: 'CH29',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Market Wagon',
    timing: 'replace-turn',
    bonus: true,
    strength: -2
  },
  'CH30': {
    id: 'CH30',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Backpack',
    timing: 'any-time',
    bonus: true,
    strength: -2
  },
  'CH31': {
    id: 'CH31',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Shovel',
    timing: 'any-time',
    bonus: true,
    strength: -2
  },
  'CH32': {
    id: 'CH32',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Sealed Vault',
    timing: 'any-time',
    bonus: true,
    strength: -4
  },
  'CH33': {
    id: 'CH33',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Crystal Lens',
    timing: 'any-time',
    bonus: true,
    strength: -2
  },
  'CH34': {
    id: 'CH34',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Larcenous Gloves',
    timing: 'any-time',
    bonus: true,
    strength: -3
  },
  'CH35': {
    id: 'CH35',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Junkyard Map',
    timing: 'any-time',
    bonus: true,
    strength: -3
  },
  'CH36': {
    id: 'CH36',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Winged Boots',
    timing: 'any-time',
    bonus: true,
    strength: -4
  },
  'CH37': {
    id: 'CH37',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Staff of Transmutation',
    timing: 'replace-turn',
    bonus: true,
    strength: -4
  },
  'CH38': {
    id: 'CH38',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Rake',
    timing: 'replace-turn',
    bonus: true,
    strength: -4
  },
  'CH39': {
    id: 'CH39',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Treasure Chest',
    timing: 'any-time',
    bonus: true,
    bonusScore: function (hand) {
      return hand.faceDownCursedItems().length > 3 ? 25 : 0;
    },
    strength: -5
  },
  'CH40': {
    id: 'CH40',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Fishhook',
    timing: 'replace-turn',
    bonus: true,
    strength: -6
  },
  'CH41': {
    id: 'CH41',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Repair Kit',
    timing: 'copy',
    bonus: true,
    strength: -6
  },
  'CH42': {
    id: 'CH42',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Hourglass',
    timing: 'after-turn',
    bonus: true,
    strength: -7
  },
  'CH43': {
    id: 'CH43',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Gold Mirror',
    timing: 'any-time',
    bonus: true,
    strength: -8
  },
  'CH44': {
    id: 'CH44',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Cauldron',
    timing: 'replace-turn',
    bonus: true,
    strength: -9
  },
  'CH45': {
    id: 'CH45',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Lantern',
    timing: 'replace-turn',
    bonus: true,
    strength: -10
  },
  'CH46': {
    id: 'CH46',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Portal',
    timing: 'any-time',
    bonus: true,
    strength: -20,
    extraCard: true
  },
  'CH47': {
    id: 'CH47',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Wishing Ring',
    timing: 'any-time',
    bonus: true,
    strength: -30
  }
}

var rrgItems = {
  'RG01': {
    id: 'RG01',
    suit: 'flame',
    name: 'Fire Elemental',
    replaces: 'FR20',
    strength: 10,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var multiplier = hand.countSuitExcluding('flame', this.id);
      multiplier += hand.countElementalsExcluding(this.name);
      return 15 * multiplier;
    },
    relatedSuits: ['flame'],
    relatedCards: ['Water Elemental', 'Air Elemental', 'Earth Elemental']
  },
  'RG02': {
    id: 'RG02',
    suit: 'building',
    name: 'Bridge',
    strength: 13,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var strengths = hand.nonBlankedCards().map(card => card.strength).sort(function (a, b) { return a - b; });
      return strengths[strengths.length - 1] - strengths[0];
    },
    clearsPenalty: function(card) {
      return card.suit == "flood";
    },
    relatedSuits: ['flood'],
    relatedCards: []
  },
  'RG03': {
    id: 'RG03',
    suit: 'wizard',
    name: 'Juggler',
    replaces: 'FR54',
    strength: 3,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var oddCards = hand.nonBlankedCards().map(card => card.strength).filter(function (a) { return (a % 2) - 1 == 0; });
      if (oddCards.length >= 7) {
        return 91;
      }
      return (oddCards.length - 1) * 3; //without itself
    },
    relatedSuits: [],
    relatedCards: []
  },
  'RG04': {
    id: 'RG04',
    suit: 'weapon',
    name: 'Trebuchet',
    replaces: 'FR45',
    strength: 32,
    bonus: true,
    penalty: true,
    action: true,
    multiAction: true,
    blankedIf: function (hand) {
      return !hand.containsSuit('army');
    },
    bonusScore: function (hand) {
      return hand.containsSuit('flame') ? hand.countCardName('Projectile') * 8 : 0;
    },
    relatedSuits: ['army', 'flame'],
    relatedCards: []
  },
  'RG05': {
    id: 'RG05',
    suit: 'beast',
    addSuits: ['flame'],
    name: 'Phoenix',
    replaces: ['FR55', 'FR55P'],
    unselectable: true,
    strength: 20,
    bonus: true,
    penalty: true,
    penaltyScore: function (hand) {
      return hand.containsSuit('flood') ? -8 : 0;
    },
    relatedSuits: [],
    relatedCards: []
  },
  'RG06': {
    id: 'RG06',
    suit: 'weapon',
    name: 'Wand',
    replaces: 'FR42',
    strength: 1,
    action: true,
    bonus: true,
    bonusScore: function(hand) {
      return hand.containsSuit('wizard') ? 25 : 0;
    },
    penalty: false,
    relatedSuits: ['wizard'], //TODO --> Magier
    relatedCards: []
  },
  'RG07': {
    id: 'RG07',
    suit: 'flame',
    name: 'Forge',
    replaces: 'FR18',
    strength: 9,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 15 * (hand.countSuit('weapon') + hand.countSuit('artifact')) * (hand.contains('Dwarfes') ? 2 : 1);
    },
    relatedSuits: ['weapon', 'artifact'],
    relatedCards: ['Dwarfes']
  },
  'RG08': {
    id: 'RG08',
    suit: 'army',
    name: 'Dwarfes',
    replaces: 'FR24',
    strength: 21,
    bonus: false,
    penalty: true,
    penaltyScore: function(hand) {
      return -3 * hand.countSuit('wizard');
    },
    relatedSuits: ['wizard'],
    relatedCards: []
  },
  'RG09': {
    id: 'RG09',
    suit: 'army',
    name: 'Elves',
    replaces: 'FR22',
    strength: 9,
    bonus: true,
    bonusScore: function(hand) {
      return hand.contains('Forest') ? 25 : 0;
    },
    penalty: false,
    relatedSuits: [],
    relatedCards: ['Forest', 'Moon']
  },
  'RG10': {
    id: 'RG10',
    suit: 'army',
    name: 'Guard',
    strength: 11,
    bonus: true,
    penalty: false,
    /* clearsPenalty: function (card) {
      return card.suit == 'leader'
    }, */
    action: true,
    relatedSuits: [],
    relatedCards: []
  },
  'RG11': {
    id: 'RG11',
    suit: 'army',
    name: 'Scout',
    replaces: ['FR25', 'CH19'],
    strength: 12,
    bonus: true,
    bonusScore: function(hand) {
      return 13 * hand.countSuit('land');
    },
    penalty: false,
    relatedSuits: ['land', 'flame', 'flood', 'weather'],
    relatedCards: []
  },
  'RG12': {
    id: 'RG12',
    suit: 'army',
    name: 'Knight',
    replaces: ['FR21', 'FR23'],
    strength: 20,
    bonus: true,
    bonusScore: function(hand) {
      return hand.contains('Warhorse') ? 20 : 0;
    },
    penalty: true,
    penaltyScore: function(hand) {
      return hand.countSuit('leader') < 1 ? -10 : 0;
    },
    relatedSuits: ['land', 'flame', 'flood', 'weather'],
    relatedCards: []
  },
  'RG13': {
    id: 'RG13',
    suit: 'leader',
    name: 'Field mistress',
    replaces: 'FR34',
    strength: 4,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var total = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.suit === 'army' || card.suit === 'weapon') {
          total += card.strength;
        }
      }
      return total;
    },
    relatedSuits: ['army', 'weapon'],
    relatedCards: []
  },
  'RG14': {
    id: 'RG14',
    suit: 'leader',
    name: 'King',
    replaces: 'FR31',
    strength: 7,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return (hand.contains('Queen') ? 40 : 8) * (hand.countSuit('artifact')+hand.countSuit('building'));
    },
    relatedSuits: ['artifact','building'],
    relatedCards: ['Queen']
  },
  'RG15': {
    id: 'RG15',
    suit: 'leader',
    name: 'Queen',
    replaces: 'FR32',
    strength: 7,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return (hand.contains('King') ? 40 : 8) * (hand.countSuit('army')+hand.countSuit('weapon'));
    },
    relatedSuits: ['army','weapon'],
    relatedCards: ['King']
  },
  'RG16': {
    id: 'RG16',
    suit: 'leader',
    name: 'Scholar',
    strength: 4,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var quoteCount = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.id == this.id) {
          continue;
        }
        var cardNames = [jQuery.i18n.prop(card.id + '.name')];
        if (card.magic) {
          cardNames = [...cardNames, ...card.actionData.map(cid=>jQuery.i18n.prop(cid + '.name'))];
        }
        for (const card2 of hand.nonBlankedCards()) {
          if (card2.id === card.id || card2.id === this.id) {
            continue;
          }
          
          if (card2.bonus) {
            var card2Bonus = jQuery.i18n.prop(card2.id + '.bonus');
            quoteCount += countInstances(card2Bonus, cardNames);
          }
          if (card2.penalty) {
            var card2Penalty = jQuery.i18n.prop(card2.id + '.penalty');
            quoteCount += countInstances(card2Penalty, cardNames);
          }
        }
      }
      return quoteCount * 15;
    },
    relatedSuits: ['army'],
    relatedCards: ['Queen']
  },
  'RG17': {
    id: 'RG17',
    suit: 'leader',
    name: 'Empress',
    replaces: 'FR35',
    strength: 15,
    bonus: true,
    bonusScore: function (hand) {
      return 13 * (hand.countSuit('army')+hand.countSuit('monster'));
    },
    penalty: true,
    penaltyScore: function(hand) {
      return -8 * hand.countSuitExcluding('leader', this.id)
    },
    relatedSuits: ['army'],
    relatedCards: ['King']
  },
  'RG18': {
    id: 'RG18',
    suit: 'monster',
    name: 'Hydra',
    replaces: 'FR40',
    strength: 9,
    bonus: true,
    bonusScore: function (hand) {
      if (hand.containsSuit('weapon')) {
        return 9 * Math.pow(2, hand.countSuitDistinctCardNames('weapon')) - 9;
      } else {
        return 0;
      }
    },
    penalty: false,
    relatedSuits: ['weapon'],
    relatedCards: []
  },
  'RG19': {
    id: 'RG19',
    suit: 'monster',
    name: 'Basilisk',
    replaces: 'FR37',
    strength: 35,
    bonus: false,
    penalty: true,
    relatedSuits: ['army', 'leader', 'beast'],
    relatedCards: []
  },
  'RG20': {
    id: 'RG20',
    suit: 'monster',
    name: 'Unicorn',
    replaces: 'FR36',
    strength: 1,
    bonus: true,
    bonusScore: function (hand) {
      return (hand.contains('Princess') && hand.contains('Fountain of Life')) ||
      (hand.contains('Axe') && hand.contains('Warlock Lady') && hand.contains('Wand')) ? 150 : 0;
    },
    relatedSuits: [],
    relatedCards: ['Princess', 'Fountain of Life', 'Axe', 'Wand', 'Warlock Lady']
  },
  'RG21': {
    id: 'RG21',
    suit: 'flame',
    name: 'Candle',
    replaces: 'FR17',
    strength: 2,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.contains('Book of Changes') && hand.contains('Tower') && hand.containsSuit('wizard') ? 100 : 0;
    },
    relatedSuits: ['wizard'],
    relatedCards: ['Book of Changes', 'Tower']
  },
  'RG22': {
    id: 'RG22',
    suit: 'monster',
    name: 'Dragon',
    replaces: 'FR39',
    strength: 35,
    bonus: true,
    bonusScore: function(hand) {
      return hand.containsSuit('flame') ? 10 : 0;
    },
    penalty: true,
    penaltyScore: function (hand) {
      return hand.containsSuit('wizard') ? 0 : -50;
    },
    blanks: function (card, hand) {
      if (!hand.containsSuit('wizard')) {
        return (card.suit == 'army' && !isArmyClearedFromPenalty(this, hand) ||
        card.suit == 'leader' && !isLeaderClearedFromPenalty(this, hand));
      } else {
        return false;
      }
      
    },
    relatedSuits: ['wizard'],
    relatedCards: []
  },
  'RG23': {
    id: 'RG23',
    suit: 'beast',
    name: 'Warhorse',
    replaces: 'FR38',
    strength: 8,
    bonus: true,
    bonusScore: function (hand) {
      return (hand.containsSuit('leader') || hand.containsSuit('army') || hand.containsSuit('wizard')) ? 17 :0;
    },
    relatedSuits: ['leader', 'wizard'],
    relatedCards: []
  },
  'RG24': {
    id: 'RG24',
    suit: 'artifact',
    name: 'Mystic Path',
    replaces: 'FR47',
    strength: 5,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var strengths = hand.nonBlankedCards().map(card => card.strength).sort(function (a, b) { return a - b; });
      var bonus = 0;
      var runFound = false;
      do {
        var run = [];
        for (var i = 0; i < strengths.length; i++) {
          var strength = strengths[i];
          if (run.length !== 0 && (strength === run[run.length - 1] + 1)) {
            run.push(strength);
          } else if (run.length < 4 && !run.includes(strength)) {
            run = [strength];
          }
        }
        if (run.length < 4) {
          runFound = false;
        } else {
          runFound = true;
          for (var i = 0; i < run.length; i++) {
            strengths.splice(strengths.indexOf(run[i]), 1);
          }
          if (run.length === 5) {
            bonus += 50;
          } else if (run.length === 6) {
            bonus += 100;
          } else if (run.length >= 7) {
            bonus += 150;
          }
        }
      } while (runFound);
      return bonus;
    },
    relatedSuits: [],
    relatedCards: []
  },
  'RG25': {
    id: 'RG25',
    suit: 'artifact',
    name: 'Amulet',
    replaces: 'FR50',
    strength: 1,
    bonus: true,
    bonusScore: function(hand) {
      return 13 * hand.countSuit('wizard');
    },
    penalty: false,
    clearsPenalty: function (card) {
      return true;
    },
    relatedSuits: [],
    relatedCards: []
  },
  'RG26': {
    id: 'RG26',
    suit: 'artifact',
    name: 'Book of Changes',
    replaces: 'FR49',
    strength: 3,
    bonus: true,
    penalty: false,
    action: true,
    relatedSuits: [], // empty because the main reason for relatedSuits is to determine how to use 'Book of Changes'
    relatedCards: []
  },
  'RG27': {
    id: 'RG27',
    suit: 'flame',
    name: 'Lightning',
    replaces: 'FR19',
    strength: 11,
    bonus: true,
    penalty: false,
    action: true,
    bonusScore: function (hand) {
      return hand.contains('Rainstorm') ? 30 : 0;
    },
    relatedSuits: [],
    relatedCards: ['Rainstorm']
  },
  'RG28': {
    id: 'RG28',
    suit: 'artifact',
    name: 'World Tree',
    replaces: ['FR48', 'CH21'],
    strength: 2,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var suits = ['artifact'];
      for (const card of hand.nonBlankedCards()) {
        if (isPhoenix(card)) {
          if (!suits.includes('flame')) {
            suits.push('flame');
          }
        }
        if (!suits.includes(card.suit)) {
          suits.push(card.suit);
        }
      }
      return suits.length == 6 ? 25 : (suits.length >= 7 ? 75 : 0);
    },
    blankedIf: function(hand) {
      return hand.contains('Axe')
    },
    relatedSuits: allSuits(),
    relatedCards: []
  },
  'RG29': {
    id: 'RG29',
    suit: 'artifact',
    name: 'Kings Shield',
    replaces: 'FR46',
    strength: 6,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.containsSuit('leader') ? (hand.contains('Queens Sword') ? 40 : 15) : 0;
    },
    relatedSuits: ['leader'],
    relatedCards: ['Queens Sword']
  },
  'RG30': {
    id: 'RG30',
    suit: 'weapon',
    name: 'Queens Sword',
    replaces: 'FR43',
    strength: 6,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.containsSuit('leader') ? (hand.contains('Kings Shield') ? 40 : 15) : 0;
    },
    relatedSuits: ['leader'],
    relatedCards: ['Kings Shield']
  },
  'RG31': {
    id: 'RG31',
    suit: 'weather',
    name: 'Smoke',replaces: 'FR13',
    strength: 27,
    bonus: true,
    bonusScore: function(hand) {
      return hand.countSuit('flame') >= 3 ? 30 : 0;
    },
    penalty: true,
    blankedIf: function (hand) {
      return !hand.containsSuit('flame');
    },
    relatedSuits: ['flame'],
    relatedCards: []
  },
  'RG32': {
    id: 'RG32',
    suit: 'weapon',
    name: 'Ship',
    replaces: 'FR41',
    strength: 26,
    bonus: true,
    penalty: true,
    blankedIf: function (hand) {
      return !hand.containsSuit('flood');
    },
    relatedSuits: ['army', 'flood'],
    relatedCards: []
  },
  'RG33': {
    id: 'RG33',
    suit: 'wild',
    name: 'Shapeshifter',
    replaces: ['FR51', 'CH22'],
    strength: 0,
    bonus: true,
    penalty: false,
    impersonator: true,
    action: true,
    relatedSuits: ['artifact', 'leader', 'wizard', 'weapon', 'beast'].sort(),
    relatedCards: ['Oxen']
  },
  'RG34': {
    id: 'RG34',
    suit: 'flood',
    name: 'Fountain of Life',
    replaces: ['FR06', 'CH17'],
    strength: 1,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var max = 0;
      for (const card of hand.nonBlankedCards()) {
        if (['monster', 'beast', 'flood', 'flame', 'land', 'weather'].includes(card.suit) || isPhoenix(card)) {
          if (card.strength > max) {
            max = card.strength;
          }
        }
      }
      return max;
    },
    relatedSuits: ['beast', 'flood', 'flame', 'land', 'weather'],
    relatedCards: []
  },
  'RG35': {
    id: 'RG35',
    suit: 'flood',
    name: 'Great Flood',
    replaces: ['FR08', 'CH18'],
    strength: 33,
    bonus: false,
    penalty: true,
    blanks: function (card, hand) {
      if (isPhoenix(card)) {
        return false;
      }
      return (card.suit === 'army' && !isArmyClearedFromPenalty(this, hand)) ||
        (card.suit === 'land' && card.name !== 'Mountain') ||
        (card.suit === 'flame' && card.name !== 'Lightning') || isPhoenix(card);
    },
    relatedSuits: ['army', 'land', 'flame'],
    relatedCards: ['Mountain', 'Lightning']
  },
  'RG36': {
    id: 'RG36',
    suit: 'flood',
    name: 'Swamp',
    replaces: 'FR07',
    strength: 17,
    bonus: true,
    bonusScore: function(hand) {
      var beastsInList = 0;
      for (const beast of ['Basilisk', 'Hydra']) {
        beastsInList += (hand.contains(beast) ? 1 : 0)
      }
      return beastsInList == 1 ? 20 : 0;
    },
    penalty: true,
    penaltyScore: function (hand) {
      var penaltyCards = hand.countSuit('flame');
      if (!isArmyClearedFromPenalty(this, hand)) {
        penaltyCards += hand.countSuit('army');
      }
      return -5 * penaltyCards;
    },
    relatedSuits: ['army', 'flame'],
    relatedCards: []
  },
  'RG37': {
    id: 'RG37',
    suit: 'flame',
    name: 'Campfire',
    strength: 12,
    bonus: true,
    bonusScore: function(hand) {
      return (hand.contains('Oxen') ? 40 : 8) * hand.countSuit('army');
    },
    penalty: false,
    relatedSuits: ['army'],
    relatedCards: ['Oxen']
  },
  'RG38': {
    id: 'RG38',
    suit: 'flood',
    name: 'Water Elemental',
    replaces: 'FR10',
    strength: 10,
    bonus: true,
    bonusScore: function(hand) {
      var multiplier = hand.countSuitExcluding('flood', this.id);
      multiplier += hand.countElementalsExcluding(this.name);
      return 15 * multiplier;
    },
    penalty: false,
    relatedSuits: ['flood'],
    relatedCards: ['Fire Elemental', 'Air Elemental', 'Earth Elemental']
  },
  'RG39': {
    id: 'RG39',
    suit: 'land',
    name: 'Mountain',
    replaces: 'FR01',
    strength: 19,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.contains('Smoke') && hand.contains('Wildfire') ? 40 : 0;
    },
    clearsPenalty: function (card) {
      return card.suit === 'flood';
    },
    relatedSuits: ['flood'],
    relatedCards: ['Smoke', 'Wildfire']
  },
  'RG40': {
    id: 'RG40',
    suit: 'building',
    name: 'Crypt',
    replaces: 'CH03',
    strength: 2,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var total = 0;
      total += 40 * hand.blankedCards().length;
      if (hand.contains('Necromancer')) {
        total += 20;
      }
      return total;
    },
    relatedSuits: ['undead', 'leader'],
    relatedCards: []
  },
  'RG41': {
    id: 'RG41',
    suit: 'land',
    altSuits: ['building'],
    name: 'Tower',
    replaces: ['FR03', 'CH16'],
    strength: 8,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.contains('Guard') ? 21 : (hand.containsSuit('wizard') ? 15 : 0);
    },
    relatedSuits: ['wizard'],
    relatedCards: ['Guard']
  },
  'RG42': {
    id: 'RG42',
    suit: 'building',
    name: 'Garden',
    replaces: 'CH05',
    strength: 11,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var bonus = 0;
      bonus += 15 * hand.countSuit('leader');
      bonus += 35 * hand.countPetrified();
      return bonus;
    },
    relatedSuits: ['leader'],
    relatedCards: []
  },
  'RG43': {
    id: 'RG43',
    suit: 'building',
    name: 'Castle',
    strength: 24,
    bonus: true,
    bonusScore: function (hand) {
      var bonus = 0;
      bonus += 8 * hand.countSuit('leader');
      bonus += 8 * hand.countSuit('army');
      bonus += 8 * hand.countSuitExcluding('building', this.id);
      return bonus;
    },
    penalty: true,
    blankedIf: function(hand) {
      return hand.contains('Blizzard') || hand.contains('Dragon');
    },
    relatedSuits: ['leader', 'army', 'building'],
    relatedCards: ['Blizzard', 'Dragon']
  },
  'RG44': {
    id: 'RG44',
    suit: 'flame',
    name: 'Candle',
    replaces: ['FR17', 'RG21'],
    strength: 2,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.contains('Book of Changes') && hand.contains('Tower') && hand.containsSuit('wizard') ? 100 : 0;
    },
    relatedSuits: ['wizard'],
    relatedCards: ['Book of Changes', 'Tower']
  },
  'RG45': {
    id: 'RG45',
    suit: 'flame',
    name: 'Wildfire',
    replaces: 'FR16',
    strength: 40,
    bonus: false,
    penalty: true,
    blanks: function (card, hand) {
      if (isPhoenix(card)) {
        return false;
      }
      return (card.suit == 'army' && !isArmyClearedFromPenalty(this, hand)) || 
        (card.suit == 'leader' && !isLeaderClearedFromPenalty(this, hand)) || 
        (card.suit == 'land' && card.name != 'Mountain') ||
        (card.suit == 'beast' && card.name != 'Dragon' && !isBeastClearedFromPenalty(this, hand)) ||
        (card.suit == 'flood' && card.name != 'Island' && card.name != 'Great Flood')
    },
    relatedSuits: ['army', 'leader', 'land', 'beast', 'flood'],
    relatedCards: ['Mountain', 'Great Flood', 'Island', 'Unicorn', 'Dragon']
  },
  'RG46': {
    id: 'RG46',
    suit: 'land',
    name: 'Earth Elemental',
    replaces: 'FR05',
    strength: 10,
    bonus: true,
    penalty: false,
    clearsPenalty: function(card) {
      return card.name === 'Earthquake';
    },
    bonusScore: function (hand) {
      var multiplier = hand.countSuitExcluding('land', this.id);
      multiplier += hand.countElementalsExcluding(this.name);
      return 15 * multiplier;
    },
    relatedSuits: ['flame'],
    relatedCards: ['Water Elemental', 'Air Elemental', 'Flame Elemental']
  },
  'RG47': {
    id: 'RG47',
    suit: 'weather',
    name: 'Air Elemental',
    replaces: 'FR15',
    strength: 10,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var multiplier = hand.countSuitExcluding('air', this.id);
      multiplier += hand.countElementalsExcluding(this.name);
      return 15 * multiplier;
    },
    relatedSuits: ['flame'],
    relatedCards: ['Water Elemental', 'Earth Elemental', 'Flame Elemental']
  },
  'RG48': {
    id: 'RG48',
    suit: 'land',
    name: 'Earthquake',
    strength: 31,
    bonus: true,
    penalty: true,
    blanks: function(card, hand) {
      return (['artifact', 'weapon', 'land'].includes(card.suit) && card.id != this.id && card.name != 'Earth Elemental') ||
        card.suit === 'building' && !isBuildingClearedFromPenalty(this, hand);
    },
    removeIf: function(ctx) {
      return !ctx.buildingsEnabled
    },
    relatedSuits: ['artifact', 'building', 'weapon', 'land'],
    relatedCards: ['Earth Elemental']
  },
  'RG49': {
    id: 'RG49',
    suit: 'land',
    name: 'Forest',
    replaces: 'FR04',
    strength: 23,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 5 * (
        (hand.containsSuit('flood') ? 1 : 0) + 
        (hand.containsSuit('monster') ? 1 : 0) + 
        (hand.containsSuit('beast') ? 1 : 0)
      );
    },
    relatedSuits: ['beast'],
    relatedCards: []
  },
  'RG50': {
    id: 'RG50',
    suit: 'wizard',
    name: 'Warlock Lady',
    replaces: 'FR29',
    strength: 25,
    bonus: true,
    bonusScore: function (hand) {
      return hand.contains('Lightning') ? 25 : 0;
    },
    penalty: true,
    penaltyScore: function (hand) {
      return -10 * (hand.countSuit('leader') + hand.countSuitExcluding('wizard', this.id));
    },
    relatedSuits: ['leader', 'wizard'],
    relatedCards: []
  },
  'RG51': {
    id: 'RG51',
    suit: 'wizard',
    name: 'Necromancer',
    replaces: ['FR28', 'CH20'],
    strength: 3,
    bonus: true,
    penalty: false,
    relatedSuits: ['army', 'leader', 'wizard', 'beast'],
    relatedCards: [],
    extraCard: true
  },
  'RG52': {
    id: 'RG52',
    suit: 'wizard',
    name: 'Beastmaster',
    replaces: 'FR27',
    strength: 9,
    bonus: true,
    bonusScore: function(hand) {
      return 15 * (hand.countSuit('beast') + hand.countSuit('monster') + (hand.contains('Griffin') ? 1 : 0));
    },
    penalty: false,
    clearsPenalty: function(card) {
      return card.suit == 'monster'
    },
    relatedSuits: ['beast', 'monster'],
    relatedCards: [],
  },
  'RG53': {
    id: 'RG53',
    suit: 'wizard',
    name: 'Enchantress',
    replaces: 'FR30',
    strength: 5,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var landCount = hand.countSuit('land');
      var weatherCount = hand.countSuit('weather');
      var floodCount = hand.countSuit('flood');
      var flameCount = hand.countSuit('flame');
      if (landCount > 0 && weatherCount > 0 && floodCount > 0 && flameCount > 0) {
        return 60;
      }
      return 8 * (landCount + weatherCount + floodCount + flameCount);
    },
    relatedSuits: ['land', 'weather', 'flood', 'flame'],
    relatedCards: []
  },
  'RG54': {
    id: 'RG54',
    suit: 'weather',
    name: 'Blizzard',
    replaces: 'FR12',
    strength: 30,
    bonus: false,
    penalty: true,
    penaltyScore: function (hand) {
      var penaltyCards = hand.countSuit('flame') + hand.containsSuit('land');
      if (!isArmyClearedFromPenalty(this, hand)) {
        penaltyCards += hand.countSuit('army');
      }
      if (!isLeaderClearedFromPenalty(this, hand)) {
        penaltyCards += hand.countSuit('leader')
      }
      if (!isBeastClearedFromPenalty(this, hand)) {
        penaltyCards += hand.countSuit('beast')
      }
      return -5 * penaltyCards;
    },
    blanks: function (card, hand) {
      return card.suit === 'flood';
    },
    relatedSuits: ['leader', 'beast', 'flame', 'army', 'flood'],
    relatedCards: []
  },
  'RG55': {
    id: 'RG55',
    suit: 'wild',
    name: 'Mirage',
    replaces: ['FR52', 'CH23'],
    strength: 0,
    bonus: true,
    penalty: false,
    impersonator: true,
    action: true,
    relatedSuits: ['army', 'land', 'weather', 'flood', 'flame'].sort(),
    relatedCards: []
  },
  'RG56': {
    id: 'RG56',
    suit: 'wild',
    name: 'Mirage',
    replaces: ['FR52', 'CH23', 'RG55'],
    strength: 0,
    bonus: true,
    penalty: false,
    impersonator: true,
    action: true,
    removeIf: function(ctx) {
      return !ctx.buildingsEnabled
    },
    relatedSuits: ['army', 'building', 'land', 'weather', 'flood', 'flame'].sort(),
    relatedCards: [],
  },
  'RG57': {
    id: 'RG57',
    suit: 'wild',
    name: 'Enchanted Mirror',
    strength: -7,
    bonus: true,
    penalty: true,
    impersonator: true,
    blanks: function(card, hand) {
      return card.name == "Basilisk";
    },
    action: true,
    relatedSuits: allSuits(),
    relatedCards: []
  },
  'RG58': {
    id: 'RG58',
    suit: 'flood',
    name: 'Island',
    replaces: 'FR09',
    strength: 14,
    bonus: true,
    bonusScore: function(hand) {
      return hand.contains('Ship') ? 20 : 0;
    },
    penalty: false,
    action: true,
    relatedSuits: ['flood', 'flame'],
    relatedCards: []
  },
  'RG59': {
    id: 'RG59',
    suit: 'wizard',
    name: 'Collector',
    replaces: 'FR26',
    strength: 7,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var bySuit = {};
      for (const card of hand.nonBlankedCards()) {
        if (card.addSuits) {
          for (const addSuit of card.addSuits) {
            if (bySuit[addSuit] === undefined) {
              bySuit[addSuit] = {};
            }
            bySuit[addSuit][card.name] = card;
          }
        }
        var suit = card.suit;
        if (bySuit[suit] === undefined) {
          bySuit[suit] = {};
        }
        bySuit[suit][card.name] = card;
      }
      var bonus = 0;
      for (const suit of Object.values(bySuit)) {
        var count = Object.keys(suit).length;
        if (count === 3) {
          bonus += 20;
        } else if (count === 4) {
          bonus += 50;
        } else if (count === 5) {
          bonus += 100;
        } else if (count >= 6) {
          bonus += 150;
        }
      }
      return bonus;
    },
    relatedSuits: allSuits(),
    relatedCards: []
  },
  'RG60': {
    id: 'RG60',
    suit: 'land',
    name: 'Cavern',
    replaces: 'FR02',
    strength: 6,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.contains('Dwarfes') || hand.contains('Dragon') || hand.contains('Bats') || hand.containsSuit('flame') ? 20 : 0;
    },
    clearsPenalty: function (card) {
      return card.suit === 'weather';
    },
    relatedSuits: ['weather'],
    relatedCards: ['Dwarfes', 'Dragon']
  },
  'RG61': {
    id: 'RG61',
    suit: 'weather',
    name: 'Rainstorm',
    replaces: 'FR11',
    strength: 6,
    bonus: true,
    penalty: true,
    bonusScore: function (hand) {
      return 13 * hand.countSuit('flood');
    },
    blanks: function (card, hand) {
      return card.suit === 'flame' && card.name !== 'Lightning';
    },
    relatedSuits: ['flood', 'flame'],
    relatedCards: ['Lightning']
  },
  'RG62': {
    id: 'RG62',
    suit: 'weapon',
    name: 'Longbow',
    replaces: 'FR44',
    strength: 3,
    bonus: true,
    bonusScore: function(hand) {
      return (hand.contains('Elves') || hand.contains('Field mistress') || hand.contains('Beastmaster')) ? 30 : 0;
    },
    penalty: true,
    penaltyScore: function(hand) {
      return hand.containsSuit('weather') ? -15 : 0;
    },
    relatedSuits: ['weather'],
    relatedCards: ['Elves', 'Field mistress', 'Beastmaster']
  },
  'RG63': {
    id: 'RG63',
    suit: 'leader',
    name: 'Princess',
    replaces: 'FR33',
    strength: 2,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 10 * (hand.countSuit('beast') + hand.countSuit('wizard') + hand.countSuitExcluding('leader', this.id) + (hand.contains('Griffin') ? 2 : 0));
    },
    relatedSuits: ['army', 'wizard', 'leader'],
    relatedCards: []
  },
  'RG64': {
    id: 'RG64',
    suit: 'wild',
    name: 'Doppelgänger',
    replaces: 'FR53',
    strength: 0,
    bonus: true,
    penalty: false,
    impersonator: true,
    action: true,
    relatedSuits: [],
    relatedCards: []
  },
  'RG65': {
    id: 'RG65',
    suit: 'monster',
    name: 'Griffin',
    strength: 16,
    bonus: true,
    bonusScore: function(hand) {
      return (hand.contains('Fields') || hand.contains('Mountain')) ? 20 : 0;
    },
    penalty: false,
    relatedSuits: [],
    relatedCards: ['Fields', 'Mountain']
  },
  'RG66': {
    id: 'RG66',
    suit: 'monster',
    name: 'Giant',
    strength: 22,
    bonus: true,
    bonusScore: function(hand) {
      return hand.containsNoStrongerThan(this.strength) ? 22 : 0;
    },
    penalty: true,
    blanks: function(card, hand) {
      return card.name == 'Knight';
    },
    relatedSuits: [],
    relatedCards: ['Fields', 'Mountain']
  },
  'RG67': {
    id: 'RG67',
    suit: 'beast',
    name: 'Falcon',
    strength: 6,
    bonus: true,
    bonusScore: function(hand) {
      return hand.containsSuit('leader') || hand.contains('Tower') ? 25 : 0;
    },
    penalty: false,
    relatedSuits: ['leader'],
    relatedCards: ['Tower']
  },
  'RG68': {
    id: 'RG68',
    suit: 'beast',
    name: 'Frog',
    strength: 2,
    bonus: true,
    bonusScore: function(hand) {
      return hand.containsSuit('flood') || hand.contains('Rainstorm') || hand.containsSuit('wizard') ? 25 : 0;
    },
    penalty: false,
    relatedSuits: ['flood', 'wizard'],
    relatedCards: ['Rainstorm']
  },
  'RG69': {
    id: 'RG69',
    suit: 'beast',
    name: 'Bats',
    strength: 5,
    bonus: true,
    bonusScore: function(hand) {
      return 10 * hand.countStrengthLessThanExcept(10, this);
    },
    penalty: false,
    relatedSuits: [],
    relatedCards: []
  },
  'RG70': {
    id: 'RG70',
    suit: 'beast',
    name: 'Guard dogs',
    strength: 8,
    bonus: true,
    bonusScore: function(hand) {
      return 20 * hand.containsSuit('building');
    },
    penalty: false,
    relatedSuits: ['building'],
    relatedCards: ['Warden'],
    actionData: ['suitChangeDummy']
  }
}

var rrgExtItems = {
  'RGE01': {
    id: 'RGE01',
    suit: 'building',
    name: 'Bridge',
    replaces: 'RG02',
    strength: 13,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var strengths = hand.nonBlankedCards().map(card => card.strength).sort(function (a, b) { return a - b; });
      var bonus = strengths[strengths.length - 1] - strengths[0];
      if (hand.contains("River")) {
        bonus += 23;
      }
      return bonus;
    },
    relatedSuits: ['flood'],
    relatedCards: ['River']
  },
  'RGE02': {
    id: 'RGE02',
    suit: 'land',
    altSuits: ['building'],
    name: 'Tower',
    replaces: ['FR03', 'CH16', 'RG41'],
    strength: 8,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var bonuses = [];
      if (hand.contains('Guard')) {
        bonuses.push(21);
      }
      if (hand.containsSuit('wizard')) {
        bonuses.push(15);
      }
      if (hand.contains('Scholar')) {
        bonuses.push(40 * hand.countSuit('weather'));
      }
      return bonuses.length > 0 ? Math.max(...bonuses) : 0;
    },
    relatedSuits: ['weather', 'wizard'],
    relatedCards: ['Guard', 'Scholar']
  },
  'RGE03': {
    id: 'RGE03',
    suit: 'army',
    name: 'Elves',
    replaces: ['FR22', 'RG09'],
    strength: 9,
    bonus: true,
    bonusScore: function(hand) {
      var bonus = 0;
      if (hand.contains('Moon')) {
        bonus += 15;
      }
      if (hand.contains('Forest')) {
        bonus += 20;
      }
      return bonus;
    },
    penalty: false,
    relatedSuits: [],
    relatedCards: ['Forest', 'Moon']
  },
  'RGE04': {
    id: 'RGE04',
    suit: 'army',
    name: 'Monster hunter',
    strength: 10,
    bonus: true,
    bonusScore: function(hand) {
      return hand.countSuit('monster') == 1 ? 25 : 0;
    },
    penalty: true,
    blankedIf: function(hand) {
      return hand.contains('Beastmaster')
    },
    relatedSuits: ['monster'],
    relatedCards: ['Beastmaster']
  },
  'RGE05': {
    id: 'RGE05',
    suit: 'artifact',
    name: 'Talisman',
    strength: 6,
    bonus: true,
    bonusScore: function (hand) {
      var cards = hand.nonBlankedCards();
      var cardsToScore = 0;
      for (const card of cards) {
        if (card.id === this.id) {
          continue
        }
        if (card.strength + (card.bonusScore && card.bonusScore(hand) || 0) - (card.penaltyScore && card.penaltyScore(hand) || 0) <= 10) {
          cardsToScore++;
        }
      }
      return 20 * cardsToScore;
    },
    penalty: false,
    relatedSuits: [],
    relatedCards: []
  },
  'RGE06': {
    id: 'RGE06',
    suit: 'beast',
    name: 'Pony companion',
    strength: 4,
    bonus: true,
    bonusScore: function (hand) {
      return hand.contains('Scout') || hand.contains('Dwarfes') ? 30 : 0
    },
    relatedSuits: [],
    relatedCards: ['Scout', 'Dwarfes']
  },
  'RGE07': {
    id: 'RGE07',
    suit: 'flood',
    name: 'River',
    strength: 2,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      if (hand.contains('Fountain of Life') && hand.contains('Fields') ||
        hand.contains('Rainstorm') && hand.contains('Great Flood')) {
          return 40;
      }
      return 0;
    },
    relatedSuits: ['flood'],
    relatedCards: ['Fountain of Life', 'Fields', 'Rainstorm', 'Great Flood']
  },
  /* 'RGE08': {
    id: 'RGE08',
    suit: 'flood',
    name: 'Sea',
    strength: 18,
    bonus: true,
    bonusScore: function(hand) {
      if (hand.contains('Ship')) {
        if (hand.contains('Moon') && hand.contains('Telescope')) {
          return 120;
        } else if (hand.contains('Net')) { 
          return 40;
        }
      }
      return 0;
    },
    penalty: false,
    relatedSuits: ['army', 'flame'],
    relatedCards: ['Ship', 'Net', 'Moon', 'Telescope']
  }, */
  'RGE09': {
    id: 'RGE09',
    suit: 'flame',
    name: 'Sun',
    strength: 0,
    bonus: true,
    bonusScore: function(hand) {
      return -60 + hand.allStrengths();
    },
    penalty: false,
    relatedSuits: [],
    relatedCards: []
  },
  'RGE10': {
    id: 'RGE10',
    suit: 'flame',
    name: 'Wildfire',
    replaces: ['FR16', 'RG45'],
    strength: 40,
    bonus: false,
    penalty: true,
    blanks: function (card, hand) {
      if (isPhoenix(card)) {
        return false;
      }
      return (card.suit == 'army' && !isArmyClearedFromPenalty(this, hand)) || 
        (card.suit == 'leader' && !isLeaderClearedFromPenalty(this, hand)) || 
        (card.suit == 'land' && card.name != 'Mountain') ||
        (card.suit == 'building' && card.name != 'Castle' && !isBuildingClearedFromPenalty(this, hand)) ||
        (card.suit == 'beast' && !isBeastClearedFromPenalty(this, hand)) ||
        (card.suit == 'monster' && card.name != 'Dragon' && !isMonsterClearedFromPenalty(this, hand)) ||
        (card.suit == 'flood' && card.name != 'Great Flood')
    },
    relatedSuits: ['army', 'leader', 'land', 'beast', 'flood', 'monster', 'building'],
    relatedCards: ['Mountain', 'Great Flood', 'Island', 'Dragon', 'Castle']
  },
  'RGE11': {
    id: 'RGE11',
    suit: 'land',
    altSuits: ['building'],
    name: 'Garden',
    replaces: ['CH05', 'RG42'],
    strength: 11,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var bonus = 0;
      bonus += 15 * hand.countSuit('leader');
      bonus += 35 * hand.countPetrified();
      return bonus;
    },
    relatedSuits: ['leader'],
    relatedCards: []
  },
  'RGE12': {
    id: 'RGE12',
    suit: 'weapon',
    name: 'Longbow',
    replaces: ['FR44', 'RG62'],
    strength: 3,
    bonus: true,
    bonusScore: function(hand) {
      return (hand.contains('Elves') || hand.contains('Field mistress') || hand.contains('Monster hunter')) ? 30 : 0;
    },
    penalty: true,
    penaltyScore: function(hand) {
      if (hand.containsSuit('weather')) {
        if (hand.contains('Elves')) {
          return 0;
        } else {
          return -15;
        }
      }
      return 0;
    },
    relatedSuits: ['weather'],
    relatedCards: ['Elves', 'Field mistress', 'Monster hunter', 'Elves']
  },
  'RGE13': {
    id: 'RGE13',
    suit: 'weapon',
    name: 'Axe',
    strength: 7,
    bonus: true,
    bonusScore: function(hand) {
      if (hand.contains('Field mistress') || hand.contains('Giant') || hand.contains('Dwarfes')) {
        return 20;
      }
      return 0;
    },
    penalty: true,
    relatedSuits: [],
    relatedCards: ['Field mistress', 'Giant', 'Dwarfes', 'World Tree']
  },
  'RGE14': {
    id: 'RGE14',
    suit: 'weather',
    name: 'Moon',
    strength: 0,
    bonus: true,
    bonusScore: function(hand) {
      return 90 - hand.allStrengths();
    },
    blankedIf: function(hand) {
      return hand.contains('Sun');
    },
    penalty: true,
    relatedSuits: [],
    relatedCards: ['Sun']
  },
  'RGE15': {
    id: 'RGE15',
    suit: 'land',
    name: 'Fields',
    strength: 7,
    bonus: true,
    bonusScore: function(hand) {
      var count = 0;
      if (hand.contains('Pony companion')) {
        count++;
      }
      if (hand.contains('Warhorse')) {
        count++;
      }
      if (hand.contains('Unicorn')) {
        count++;
      }
      if (count == 1) {
        return 20;
      } else if (count == 2) {
        return 70;
      } else if (count == 3) {
        return 130;
      }
      return 0;
    },
    penalty: false,
    relatedSuits: [],
    relatedCards: []
  },
  'RGE16': {
    id: 'RGE16',
    suit: 'weather',
    name: 'Whirlwind',
    replaces: 'FR14',
    strength: 13,
    bonus: true,
    penalty: true,
    bonusScore: function (hand) {
      if (hand.contains('Rainstorm') && (hand.contains('Blizzard') !== hand.contains('Great Flood'))) {
        return 40;
      }
      return 0;
    },
    blanks: function (card, hand) {
      return card.name == 'Falcon' || card.name == 'Bats' || card.name == 'Griffin';
    },
    relatedSuits: [],
    relatedCards: ['Rainstorm', 'Blizzard', 'Great Flood', 'Falcon', 'Bats', 'Griffin']
  },
  'RGE17': {
    id: 'RGE17',
    suit: 'building',
    name: 'Treasury',
    strength: 20,
    bonus: true,
    penalty: false,
    relatedSuits: [],
    relatedCards: [],
    extraCard: true
  },
  'RGE18': {
    id: 'RGE18',
    suit: 'leader',
    name: 'Builder',
    strength: 4,
    bonus: true,
    bonusScore: function(hand) {
      var buildings = deck.getCardsBySuit('building', hand.nonBlankedCards())?.building || [];
      return 15 * (hand.countSuit('building') + hand.countModExcept('strength', 4, [...buildings,[this]]));
    },
    penalty: false,
    relatedSuits: ['building'],
    relatedCards: []
  },
  'RGE19': {
    id: 'RGE19',
    suit: 'weapon',
    name: 'Cart',
    strength: 4,
    bonus: true,
    bonusScore: function(hand) {
      var bonus = 10 * hand.countSuit('army');
      if (hand.contains('Oxen')) {
        bonus += 30;
      }
      return bonus;
    },
    penaltyScore: function(hand) {
      return -10 * hand.countSuit('land');
    },
    penalty: true,
    relatedSuits: [],
    relatedCards: []
  },
  'RGE20': {
    id: 'RGE20',
    suit: 'artifact',
    name: 'Treasure chest',
    strength: 20,
    bonus: true,
    penalty: false,
    relatedSuits: [],
    relatedCards: [],
    extraCard: true
  },
  'RGE21': {
    id: 'RGE21',
    suit: 'weather',
    name: 'Clouds',
    strength: 6,
    bonus: true,
    bonusScore: function(hand) {
      var bonus = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.penalty && !card.penaltyCleared) {
          bonus += 10;
        }
      }
      return bonus;
    },
    penalty: true,
    penaltyScore: function(hand) {
      return (hand.contains('Moon') || hand.contains('Sun')) ? -8 : 0;
    },
    relatedSuits: [],
    relatedCards: [],
    extraCard: true
  },
  'RGE22': {
    id: 'RGE22',
    suit: 'monster',
    name: 'Troll',
    strength: -30,
    bonus: true,
    penalty: true,
    relatedSuits: [],
    relatedCards: [],
  },
  'RGE23': {
    id: 'RGE23',
    suit: 'building',
    name: 'Dam',
    strength: 15,
    bonus: true,
    bonusScore: function(hand) {
      return 10 * hand.countSuit('flood');
    },
    blankedIf: function(hand) {
      return hand.countSuit('flood') >= 4;
    },
    penalty: true,
    relatedSuits: [],
    relatedCards: [],
  },
  'RGE24': {
    id: 'RGE24',
    suit: 'building',
    name: 'Academy',
    strength: 16,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var quoteCount = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.id == this.id) {
          continue;
        }
        var cardNames = [jQuery.i18n.prop(card.id + '.name')];
        if (card.magic) {
          cardNames = [...cardNames, ...card.actionData.map(cid=>jQuery.i18n.prop(cid + '.name'))];
        }
        for (const card2 of hand.nonBlankedCards()) {
          if (card2.id === card.id || card2.id === this.id) {
            continue;
          }
          
          if (card2.bonus) {
            var card2Bonus = jQuery.i18n.prop(card2.id + '.bonus');
            quoteCount += countInstances(card2Bonus, cardNames);
          }
          if (card2.penalty) {
            var card2Penalty = jQuery.i18n.prop(card2.id + '.penalty');
            quoteCount += countInstances(card2Penalty, cardNames);
          }
        }
      }
      return quoteCount * 10;
    },
    relatedSuits: [],
    relatedCards: []
  },
}

var rrgExtraItems = {
  'RGS01': {
    id: 'RGS01',
    suit: 'beast',
    name: 'Oxen',
    impersonator: true,
    strength: 16,
    bonus: false,
    bonusScore: ()=>0,
    penalty: false,
    penaltyScore: ()=>0,
    action: false,
    relatedSuits: [],
    relatedCards: []
  },
  'RGS03': {
    id: 'RGS03',
    suit: 'weapon',
    name: 'Projectile',
    impersonator: true,
    strength: 16,
    bonus: false,
    bonusScore: ()=>0,
    penalty: false,
    penaltyScore: ()=>0,
    action: false,
    relatedSuits: [],
    relatedCards: []
  }
}

var deck = {
  cards: { ...base, ...rrgItems },
  enabledStacks: [base, rrgItems],
  buildingsEnabled: false,
  rrgEditionEnabled: true,
  cursedItems: {},
  enableCursedHoardSuits: function () {
    this.addStackToCards(cursedHoard);
  },
  disableCursedHoardSuits: function () {
    this.removeStackFromCards(cursedHoard);
  },
  enableCursedHoardItems: function () {
    this.cursedItems = cursedItems;
  },
  disableCursedHoardItems: function () {
    this.cursedItems = {};
  },
  enableRereadgamesEdition: function () {
    this.addStackToCards(rrgItems);
    this.rrgEditionEnabled = true;
    BOOK_OF_CHANGES = RRG_BOOK_OF_CHANGES;
  },
  disableRereadgamesEdition: function () {
    this.removeStackFromCards(rrgItems);
    this.rrgEditionEnabled = false;
    BOOK_OF_CHANGES = ORG_BOOK_OF_CHANGES;
  },
  enableRereadgamesEditionExt: function () {
    this.addStackToCards(rrgItems);
    this.addStackToCards(rrgExtItems);
  },
  disableRereadgamesEditionExt: function () {
    this.removeStackFromCards(rrgExtItems);
  },
  enableRereadgamesBuildings: function() {
    this.buildingsEnabled = true;
    this.refreshStack();
    RRG_MIRAGE = 'RG56';
  },
  disableRereadgamesBuildings: function() {
    this.buildingsEnabled = false;
    RRG_MIRAGE = 'RG55';
    this.refreshStack();
  },
  addStackToCards: function(stack) {
    if (this.enabledStacks.indexOf(stack) < 0) {
      this.enabledStacks.push(stack);
    }
    this.refreshStack();
  },
  removeStackFromCards: function(stack) {
    this.enabledStacks.splice(this.enabledStacks.indexOf(stack), 1);
    this.refreshStack();
  },
  refreshStack: function() {
    this.cards = {};
    for (const stack of this.enabledStacks) {
      this.cards = { ...this.cards, ...stack }
      this.checkReplacementCards();
    }
  },
  checkReplacementCards: function() {
    for (const id in this.cards) {
      const card = this.cards[id];
      // fix tower suit
      if (card.altSuits && card.altSuits.includes('building')) {
        if (this.buildingsEnabled) {
          card.orgSuit = card.suit;
          card.suit = 'building';
        } else {
          if (card.orgSuit) {
            card.suit = card.orgSuit;
          }
        }
      }
      var skipCard = false;
      if ((card.suit == 'building' && !this.buildingsEnabled) || (card.removeIf && card.removeIf(this))) {
        delete this.cards[card.id];
        skipCard = true;
      }
      if (card.replaces && !skipCard) {
        if (Array.isArray(card.replaces)) {
          for (const repl of card.replaces) {
            delete this.cards[repl];
          }
        } else {
          delete this.cards[card.replaces];
        }
      }
    }
  },
  getCardByName: function (cardName) {
    for (const id in this.cards) {
      const card = this.cards[id];
      if (card.name === cardName) {
        return card;
      }
    }
    for (const id in this.cursedItems) {
      const card = this.cursedItems[id];
      if (card.name === cardName) {
        return card;
      }
    }
  },
  getCardById: function (id) {
    if (typeof (id) == "number") {
      id = id.toString()
    }

    if (id.match(/^[0-9+]+$/)) {
      id = 'FR' + id.padStart(2, '0')
    }
    return this.cards[id] || this.cursedItems[id];
  },
  getCardsBySuit: function (suits, cards) {
    var cardsBySuit = {};
    if (!cards) {
      cards = this.cards;
    }
    for (const id in cards) {
      const card = cards[id];
      if (suits === undefined || suits.includes(card.suit)) {
        if (cardsBySuit[card.suit] === undefined) {
          cardsBySuit[card.suit] = [];
        }
        cardsBySuit[card.suit].push(card);
      }
    }
    var ordered = {};
    if (Object.keys(this.cursedItems).length > 0 && (suits === undefined || suits.includes('cursed-item'))) {
      ordered['cursed-item'] = [];
      for (const id in this.cursedItems) {
        ordered['cursed-item'].push(this.cursedItems[id]);
      }
    }
    Object.keys(cardsBySuit).sort((a, b) => jQuery.i18n.prop('suit.' + a).localeCompare(jQuery.i18n.prop('suit.' + b))).forEach(function (key) {
      ordered[key] = cardsBySuit[key];
    });
    return ordered;
  },
  suits: function () {
    var suits = {};
    for (const id in this.cards) {
      const card = this.cards[id];
      suits[card.suit] = card.suit;
    }
    return Object.keys(suits).sort();
  }
};

function countInstances(string, words) {
  if (!Array.isArray(words)) {
    words = [words];
  }
  var allCount = 0;
  for (var word of words) {
    var count = string.split(word).length - 1;
    if (count > 0) {
      allCount += count;
      console.log("Found literal reference: " + word + " in string: " + string);
    }
  }
  return allCount;
}

function isArmyClearedFromPenalty(card, hand) {
  // FR25, CH19: Rangers: CLEARS the word Army from all Penalties
  // FR41/RG32: Warship/Ship: CLEARS the word Army from all Penalties of all Floods
  // RGE04: Monster hunter: CLEARS the word Army from all Penalties of all Beasts
  // RG11: Scout: CLEARS the word Army from all Penalties of all Flames, Floods and Weathers
  return hand.containsId('FR25', true) || hand.containsId('CH19', true) || 
    (card.suit === 'flood' && hand.containsId('FR41', true)) || 
    (card.suit === 'flood' && hand.containsId('RG32', true)) || 
    (card.suit === 'monster' && hand.containsId('RGE04', true)) ||
    (['flame', 'flood', 'weather'].includes(card.suit) && hand.containsId('RG11', true));
}

function isLeaderClearedFromPenalty(card, hand) {
  // (OLD) RG10: Guard: CLEARS the word Leader from all Penalties
  return false //hand.containsId('RG10', true);
}

function isBeastClearedFromPenalty(card, hand) {
  // RGE06: Pony companion: CLEAR the word Beast from all Penalties
  return hand.containsId('RGE06', true);
}

function isMonsterClearedFromPenalty(card, hand) {
  return false;
}

function isBuildingClearedFromPenalty(card, hand) {
  // RG70: Guard dogs: Building cannot be blocked
  return hand.containsId('RG70', true);
}

function allSuits() {
  return ['land', 'flood', 'weather', 'flame', 'army', 'wizard', 'leader', 'beast', 'weapon', 'artifact', 'wild', 'building', 'outsider', 'undead'].sort();
}

function isPhoenix(card) {
  return card.id === PHOENIX || card.id === PHOENIX_PROMO || card.id === RRG_PHOENIX;
}

var NONE = -1;
var ISLAND = 'FR09';
var NECROMANCER = 'FR28';
var BOOK_OF_CHANGES = 'FR49';
var ORG_BOOK_OF_CHANGES = 'FR49';
var SHAPESHIFTER = 'FR51';
var MIRAGE = 'FR52';
var DOPPELGANGER = 'FR53';
var PHOENIX = 'FR55';
var PHOENIX_PROMO = 'FR55P';

//(OLD) var RRG_RIVER = 'RGE07';
var RRG_PHOENIX = 'RG05';
var RRG_WAND = 'RG06';
var RRG_OXEN = 'RGS01';
//(OLD, now: RRG_GUARD) var RRG_KNIGHT = 'RG12';
var RRG_BASILISK = 'RG19';
var RRG_BOOK_OF_CHANGES = 'RG26';
var RRG_NECROMANCER = 'RG51';
var RRG_MIRAGE = 'RG55';
var RRG_MIRAGE_G = 'RG56';
var RRG_SHAPESHIFTER = 'RG33';
var RRG_TREBUCHET = 'RG04';
var RRG_PROJECTILE = 'RGS03';
var RRG_MIRROR = 'RG57';
var RRG_ISLAND = 'RG58';
var RRG_DOPPELGANGER = 'RG64';
var RRG_GUARD = 'RG10';
var RRG_LIGHTNING = 'RG27';
var RRG_WARDEN = 'RG10';
var RRG_GUARD_DOGS = 'RG70';
var RRG_SUN = 'RGE09';
var RRG_TROLL = 'RGE22';

var CH_NECROMANCER = 'CH20';
var CH_SHAPESHIFTER = 'CH22';
var CH_MIRAGE = 'CH23';
var CH_DEMON = 'CH10';
var CH_LICH = 'CH14';
var CH_ANGEL = 'CH08';

var ACTION_ORDER = [DOPPELGANGER, RRG_DOPPELGANGER, RRG_MIRROR, MIRAGE, CH_MIRAGE, RRG_MIRAGE, RRG_MIRAGE_G, SHAPESHIFTER, CH_SHAPESHIFTER, RRG_SHAPESHIFTER, BOOK_OF_CHANGES, RRG_BOOK_OF_CHANGES, ISLAND, RRG_ISLAND, CH_ANGEL, RRG_TREBUCHET, RRG_WAND, RRG_GUARD, RRG_LIGHTNING, RRG_GUARD_DOGS];
