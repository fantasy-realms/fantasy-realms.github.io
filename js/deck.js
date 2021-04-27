var base = {
  'FR01': {
    id: 'FR01',
    suit: 'Land',
    name: 'Mountain',
    strength: 9,
    bonus: '+50 with both <span class="weather">Smoke</span> and <span class="flame">Wildfire</span>. <br />CLEARS the Penalty on all <span class="flood">Floods</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.contains('Smoke') && hand.contains('Wildfire') ? 50 : 0;
    },
    clearsPenalty: function(card) {
      return card.suit === 'Flood';
    },
    relatedSuits: ['Flood'],
    relatedCards: ['Smoke', 'Wildfire']
  },
  'FR02': {
    id: 'FR02',
    suit: 'Land',
    name: 'Cavern',
    strength: 6,
    bonus: '+25 with <span class="army">Dwarvish Infantry</span> or <span class="beast">Dragon</span>. <br />CLEARS the Penalty on all <span class="weather">Weather</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.contains('Dwarvish Infantry') || hand.contains('Dragon') ? 25 : 0;
    },
    clearsPenalty: function(card) {
      return card.suit === 'Weather';
    },
    relatedSuits: ['Weather'],
    relatedCards: ['Dwarvish Infantry', 'Dragon']
  },
  'FR03': {
    id: 'FR03',
    suit: 'Land',
    name: 'Bell Tower',
    strength: 8,
    bonus: '+15 with any one <span class="wizard">Wizard</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.containsSuit('Wizard') ? 15 : 0;
    },
    relatedSuits: ['Wizard'],
    relatedCards: []
  },
  'FR04': {
    id: 'FR04',
    suit: 'Land',
    name: 'Forest',
    strength: 7,
    bonus: '+12 for each <span class="beast">Beast</span> and <span class="army">Elven Archers</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return 12 * hand.countSuit('Beast') + (hand.contains('Elven Archers') ? 12 : 0);
    },
    relatedSuits: ['Beast'],
    relatedCards: ['Elven Archers']
  },
  'FR05': {
    id: 'FR05',
    suit: 'Land',
    name: 'Earth Elemental',
    strength: 4,
    bonus: '+15 for each other <span class="land">Land</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return 15 * hand.countSuitExcluding('Land', this.id);
    },
    relatedSuits: ['Land'],
    relatedCards: []
  },
  'FR06': {
    id: 'FR06',
    suit: 'Flood',
    name: 'Fountain of Life',
    strength: 1,
    bonus: 'Add the base strength of any one <span class="weapon">Weapon</span>, <span class="flood">Flood</span>, <span class="flame">Flame</span>, <span class="land">Land</span> or <span class="weather">Weather</span> in your hand.',
    penalty: null,
    bonusScore: function(hand) {
      var max = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.suit === 'Weapon' || card.suit === 'Flood' || card.suit === 'Flame' || card.suit === 'Land' || card.suit === 'Weather') {
          if (card.strength > max) {
            max = card.strength;
          }
        }
      }
      return max;
    },
    relatedSuits: ['Weapon', 'Flood', 'Flame', 'Land', 'Weather'],
    relatedCards: []
  },
  'FR07': {
    id: 'FR07',
    suit: 'Flood',
    name: 'Swamp',
    strength: 18,
    bonus: null,
    penalty: '-3 for each <span class="army">Army</span> and <span class="flame">Flame</span>.',
    penaltyScore: function(hand) {
      var penaltyCards = hand.countSuit('Flame');
      if (!(hand.containsId('FR25') || hand.containsId('CH19') || hand.containsId('FR41'))) { // these clear the word 'Army' from the penalty
        penaltyCards += hand.countSuit('Army');
      }
      return -3 * penaltyCards;
    },
    relatedSuits: ['Army', 'Flame'],
    relatedCards: []
  },
  'FR08': {
    id: 'FR08',
    suit: 'Flood',
    name: 'Great Flood',
    strength: 32,
    bonus: null,
    penalty: 'BLANKS all <span class="army">Armies</span>, all <span class="land">Lands</span> except <span class="land">Mountain</span>, and all <span class="flame">Flames</span> except <span class="flame">Lightning</span>.',
    blanks: function(card, hand) {
      return (card.suit === 'Army' && !(hand.containsId('FR25') || hand.containsId('CH19') || hand.containsId('FR41'))) || // these clear the word 'Army' from the penalty
        (card.suit === 'Land' && card.name !== 'Mountain') ||
        (card.suit === 'Flame' && card.name !== 'Lightning');
    },
    relatedSuits: ['Army', 'Land', 'Flame'],
    relatedCards: ['Mountain', 'Lightning']
  },
  'FR09': {
    id: 'FR09',
    suit: 'Flood',
    name: 'Island',
    strength: 14,
    bonus: 'CLEARS the Penalty on any one <span class="flood">Flood</span> or <span class="flame">Flame</span>.',
    penalty: null,
    action: 'Pick a Flood or Flame from your hand to clear.',
    relatedSuits: ['Flood', 'Flame'],
    relatedCards: []
  },
  'FR10': {
    id: 'FR10',
    suit: 'Flood',
    name: 'Water Elemental',
    strength: 4,
    bonus: '+15 for each other <span class="flood">Flood</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return 15 * hand.countSuitExcluding('Flood', this.id);
    },
    relatedSuits: ['Flood'],
    relatedCards: []
  },
  'FR11': {
    id: 'FR11',
    suit: 'Weather',
    name: 'Rainstorm',
    strength: 8,
    bonus: '+10 for each <span class="flood">Flood</span>.',
    penalty: 'BLANKS all <span class="flame">Flames</span> except <span class="flame">Lightning</span>.',
    bonusScore: function(hand) {
      return 10 * hand.countSuit('Flood');
    },
    blanks: function(card, hand) {
      return card.suit === 'Flame' && card.name !== 'Lightning';
    },
    relatedSuits: ['Flood', 'Flame'],
    relatedCards: ['Lightning']
  },
  'FR12': {
    id: 'FR12',
    suit: 'Weather',
    name: 'Blizzard',
    strength: 30,
    bonus: null,
    penalty: 'BLANKS all <span class="flood">Floods</span>. <br />-5 for each <span class="army">Army</span>, <span class="leader">Leader</span>, <span class="beast">Beast</span>, and <span class="flame">Flame</span>.',
    penaltyScore: function(hand) {
      var penaltyCards = hand.countSuit('Leader') + hand.countSuit('Beast') + hand.countSuit('Flame');
      if (!(hand.containsId('FR25') || hand.containsId('CH19'))) { // clears the word 'Army' from the penalty
        penaltyCards += hand.countSuit('Army');
      }
      return -5 * penaltyCards;
    },
    blanks: function(card, hand) {
      return card.suit === 'Flood';
    },
    relatedSuits: ['Leader', 'Beast', 'Flame', 'Army', 'Flood'],
    relatedCards: []
  },
  'FR13': {
    id: 'FR13',
    suit: 'Weather',
    name: 'Smoke',
    strength: 27,
    bonus: null,
    penalty: 'This card is BLANKED unless with at least one <span class="flame">Flame</span>.',
    blankedIf: function(hand) {
      return !hand.containsSuit('Flame');
    },
    relatedSuits: ['Flame'],
    relatedCards: []
  },
  'FR14': {
    id: 'FR14',
    suit: 'Weather',
    name: 'Whirlwind',
    strength: 13,
    bonus: '+40 with <span class="weather">Rainstorm</span> and either <span class="weather">Blizzard</span> or <span class="flood">Great Flood</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.contains('Rainstorm') && (hand.contains('Blizzard') || hand.contains('Great Flood')) ? 40 : 0;
    },
    relatedSuits: ['Rainstorm'],
    relatedCards: ['Blizzard', 'Great Flood']
  },
  'FR15': {
    id: 'FR15',
    suit: 'Weather',
    name: 'Air Elemental',
    strength: 4,
    bonus: '+15 for each other <span class="weather">Weather</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return 15 * hand.countSuitExcluding('Weather', this.id);
    },
    relatedSuits: ['Weather'],
    relatedCards: []
  },
  'FR16': {
    id: 'FR16',
    suit: 'Flame',
    name: 'Wildfire',
    strength: 40,
    bonus: null,
    penalty: 'BLANKS all cards except <span class="flame">Flames</span>, <span class="wizard">Wizards</span>, <span class="weather">Weather</span>, <span class="weapon">Weapons</span>, <span class="artifact">Artifacts</span>, <span class="land">Mountain</span>, <span class="flood">Great Flood</span>, <span class="flood">Island</span>, <span class="beast">Unicorn</span> and <span class="beast">Dragon</span>.',
    blanks: function(card, hand) {
      return !(card.suit === 'Flame' || card.suit === 'Wizard' || card.suit === 'Weather' ||
        card.suit === 'Weapon' || card.suit === 'Artifact' || card.suit === 'Wild' || card.name === 'Mountain' ||
        card.name === 'Great Flood' || card.name === 'Island' || card.name === 'Unicorn' || card.name === 'Dragon');
    },
    relatedSuits: allSuits(),
    relatedCards: ['Mountain', 'Great Flood', 'Island', 'Unicorn', 'Dragon']
  },
  'FR17': {
    id: 'FR17',
    suit: 'Flame',
    name: 'Candle',
    strength: 2,
    bonus: '+100 with <span class="artifact">Book of Changes</span>, <span class="land">Bell Tower</span>, and any one <span class="wizard">Wizard</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.contains('Book of Changes') && hand.contains('Bell Tower') && hand.containsSuit('Wizard') ? 100 : 0;
    },
    relatedSuits: ['Wizard'],
    relatedCards: ['Book of Changes', 'Bell Tower']
  },
  'FR18': {
    id: 'FR18',
    suit: 'Flame',
    name: 'Forge',
    strength: 9,
    bonus: '+9 for each <span class="weapon">Weapon</span> and <span class="artifact">Artifact</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return 9 * (hand.countSuit('Weapon') + hand.countSuit('Artifact'));
    },
    relatedSuits: ['Weapon', 'Artifact'],
    relatedCards: []
  },
  'FR19': {
    id: 'FR19',
    suit: 'Flame',
    name: 'Lightning',
    strength: 11,
    bonus: '+30 with <span class="weather">Rainstorm</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.contains('Rainstorm') ? 30 : 0;
    },
    relatedSuits: [],
    relatedCards: ['Rainstorm']
  },
  'FR20': {
    id: 'FR20',
    suit: 'Flame',
    name: 'Fire Elemental',
    strength: 4,
    bonus: '+15 for each other <span class="flame">Flame</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return 15 * hand.countSuitExcluding('Flame', this.id);
    },
    relatedSuits: ['Flame'],
    relatedCards: []
  },
  'FR21': {
    id: 'FR21',
    suit: 'Army',
    name: 'Knights',
    strength: 20,
    bonus: null,
    penalty: '-8 unless with at least one <span class="leader">Leader</span>.',
    penaltyScore: function(hand) {
      return hand.containsSuit('Leader') ? 0 : -8;
    },
    relatedSuits: ['Leader'],
    relatedCards: []
  },
  'FR22': {
    id: 'FR22',
    suit: 'Army',
    name: 'Elven Archers',
    strength: 10,
    bonus: '+5 if no <span class="weather">Weather</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.containsSuit('Weather') ? 0 : 5;
    },
    relatedSuits: ['Weather'],
    relatedCards: []
  },
  'FR23': {
    id: 'FR23',
    suit: 'Army',
    name: 'Light Cavalry',
    strength: 17,
    bonus: null,
    penalty: '-2 for each <span class="land">Land</span>.',
    penaltyScore: function(hand) {
      return -2 * hand.countSuit('Land');
    },
    relatedSuits: ['Land'],
    relatedCards: []

  },
  'FR24': {
    id: 'FR24',
    suit: 'Army',
    name: 'Dwarvish Infantry',
    strength: 15,
    bonus: null,
    penalty: '-2 for each other <span class="army">Army</span>.',
    penaltyScore: function(hand) {
      if (!(hand.containsId('FR25') || hand.containsId('CH19'))) { // clears the word 'Army' from the penalty
        return -2 * hand.countSuitExcluding('Army', this.id);
      }
      return 0;
    },
    relatedSuits: ['Army'],
    relatedCards: []
  },
  'FR25': {
    id: 'FR25',
    suit: 'Army',
    name: 'Rangers',
    strength: 5,
    bonus: '+10 for each <span class="land">Land</span>. <br />CLEARS the word <span class="army">Army</span> from all Penalties.',
    penalty: null,
    bonusScore: function(hand) {
      return 10 * hand.countSuit('Land');
    },
    relatedSuits: ['Land', 'Army'],
    relatedCards: []
  },
  'FR26': {
    id: 'FR26',
    suit: 'Wizard',
    name: 'Collector',
    strength: 7,
    bonus: '+10 if three different cards in same suit, +40 if four different cards in same suit, +100 if five different cards in same suit.',
    penalty: null,
    bonusScore: function(hand) {
      var bySuit = {};
      for (const card of hand.nonBlankedCards()) {
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
    suit: 'Wizard',
    name: 'Beastmaster',
    strength: 9,
    bonus: '+9 for each <span class="beast">Beast</span>. <br />CLEARS the Penalty on all <span class="beast">Beasts</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return 9 * hand.countSuit('Beast');
    },
    clearsPenalty: function(card) {
      return card.suit === 'Beast';
    },
    relatedSuits: ['Beast'],
    relatedCards: []
  },
  'FR28': {
    id: 'FR28',
    suit: 'Wizard',
    name: 'Necromancer',
    strength: 3,
    bonus: 'At the end of the game, you may take one <span class="army">Army</span>, <span class="leader">Leader</span>, <span class="wizard">Wizard</span>, or <span class="beast">Beast</span> from the discard pile and add it to your hand.',
    penalty: null,
    relatedSuits: ['Army', 'Leader', 'Wizard', 'Beast'],
    relatedCards: [],
    extraCard: true
  },
  'FR29': {
    id: 'FR29',
    suit: 'Wizard',
    name: 'Warlock Lord',
    strength: 25,
    bonus: null,
    penalty: '-10 for each <span class="leader">Leader</span> and other <span class="wizard">Wizard</span>.',
    penaltyScore: function(hand) {
      return -10 * (hand.countSuit('Leader') + hand.countSuitExcluding('Wizard', this.id));
    },
    relatedSuits: ['Leader', 'Wizard'],
    relatedCards: []
  },
  'FR30': {
    id: 'FR30',
    suit: 'Wizard',
    name: 'Enchantress',
    strength: 5,
    bonus: '+5 for each <span class="land">Land</span>, <span class="weather">Weather</span>, <span class="flood">Flood</span>, and <span class="flame">Flame</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return 5 * (hand.countSuit('Land') + hand.countSuit('Weather') + hand.countSuit('Flood') + hand.countSuit('Flame'));
    },
    relatedSuits: ['Land', 'Weather', 'Flood', 'Flame'],
    relatedCards: []
  },
  'FR31': {
    id: 'FR31',
    suit: 'Leader',
    name: 'King',
    strength: 8,
    bonus: '+5 for each <span class="army">Army</span>. <br />OR +20 for each <span class="army">Army</span> if with <span class="leader">Queen</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return (hand.contains('Queen') ? 20 : 5) * hand.countSuit('Army');
    },
    relatedSuits: ['Army'],
    relatedCards: ['Queen']
  },
  'FR32': {
    id: 'FR32',
    suit: 'Leader',
    name: 'Queen',
    strength: 6,
    bonus: '+5 for each <span class="army">Army</span>. <br />OR +20 for each <span class="army">Army</span> if with <span class="leader">King</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return (hand.contains('King') ? 20 : 5) * hand.countSuit('Army');
    },
    relatedSuits: ['Army'],
    relatedCards: ['King']
  },
  'FR33': {
    id: 'FR33',
    suit: 'Leader',
    name: 'Princess',
    strength: 2,
    bonus: '+8 for each <span class="army">Army</span>, <span class="wizard">Wizard</span>, and other <span class="leader">Leader</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return 8 * (hand.countSuit('Army') + hand.countSuit('Wizard') + hand.countSuitExcluding('Leader', this.id));
    },
    relatedSuits: ['Army', 'Wizard', 'Leader'],
    relatedCards: []
  },
  'FR34': {
    id: 'FR34',
    suit: 'Leader',
    name: 'Warlord',
    strength: 4,
    bonus: 'The sum of the base strength of all <span class="army">Armies</span>.',
    penalty: null,
    bonusScore: function(hand) {
      var total = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.suit === 'Army') {
          total += card.strength;
        }
      }
      return total;
    },
    relatedSuits: ['Army'],
    relatedCards: []
  },
  'FR35': {
    id: 'FR35',
    suit: 'Leader',
    name: 'Empress',
    strength: 15,
    bonus: '+10 for each <span class="army">Army</span>.',
    penalty: '-5 for each other <span class="leader">Leader</span>.',
    bonusScore: function(hand) {
      return 10 * hand.countSuit('Army');
    },
    penaltyScore: function(hand) {
      return -5 * hand.countSuitExcluding('Leader', this.id);
    },
    relatedSuits: ['Army', 'Leader'],
    relatedCards: []
  },
  'FR36': {
    id: 'FR36',
    suit: 'Beast',
    name: 'Unicorn',
    strength: 9,
    bonus: '+30 with <span class="leader">Princess</span>. <br />OR +15 with <span class="leader">Empress</span>, <span class="leader">Queen</span>, or <span class="leader">Enchantress</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.contains('Princess') ? 30 : (hand.contains('Empress') || hand.contains('Queen') || hand.contains('Enchantress')) ? 15 : 0;
    },
    relatedSuits: [],
    relatedCards: ['Princess', 'Empress', 'Queen', 'Enchantress']
  },
  'FR37': {
    id: 'FR37',
    suit: 'Beast',
    name: 'Basilisk',
    strength: 35,
    bonus: null,
    penalty: 'BLANKS all <span class="army">Armies</span>, <span class="leader">Leaders</span>, and other <span class="beast">Beasts</span>.',
    blanks: function(card, hand) {
      return (card.suit === 'Army' && !(hand.containsId('FR25') || hand.containsId('CH19'))) || // clears the word 'Army' from the penalty
        card.suit === 'Leader' ||
        (card.suit === 'Beast' && card.id !== this.id);
    },
    relatedSuits: ['Army', 'Leader', 'Beast'],
    relatedCards: []
  },
  'FR38': {
    id: 'FR38',
    suit: 'Beast',
    name: 'Warhorse',
    strength: 6,
    bonus: '+14 with any <span class="leader">Leader</span> or <span class="wizard">Wizard</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.containsSuit('Leader') || hand.containsSuit('Wizard') ? 14 : 0;
    },
    relatedSuits: ['Leader', 'Wizard'],
    relatedCards: []
  },
  'FR39': {
    id: 'FR39',
    suit: 'Beast',
    name: 'Dragon',
    strength: 30,
    bonus: null,
    penalty: '-40 unless with at least one <span class="wizard">Wizard</span>.',
    penaltyScore: function(hand) {
      return hand.containsSuit('Wizard') ? 0 : -40;
    },
    relatedSuits: ['Wizard'],
    relatedCards: []
  },
  'FR40': {
    id: 'FR40',
    suit: 'Beast',
    name: 'Hydra',
    strength: 12,
    bonus: '+28 with <span class="flood">Swamp</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.contains('Swamp') ? 28 : 0;
    },
    relatedSuits: [],
    relatedCards: ['Swamp']
  },
  'FR41': {
    id: 'FR41',
    suit: 'Weapon',
    name: 'Warship',
    strength: 23,
    bonus: 'CLEARS the word <span class="army">Army</span> from all Penalties of all <span class="flood">Floods</span>.',
    penalty: 'BLANKED unless with at least one <span class="flood">Flood</span>.',
    blankedIf: function(hand) {
      return !hand.containsSuit('Flood');
    },
    relatedSuits: ['Army', 'Flood'],
    relatedCards: []
  },
  'FR42': {
    id: 'FR42',
    suit: 'Weapon',
    name: 'Magic Wand',
    strength: 1,
    bonus: '+25 with any one <span class="wizard">Wizard</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.containsSuit('Wizard') ? 25 : 0;
    },
    relatedSuits: ['Wizard'],
    relatedCards: []
  },
  'FR43': {
    id: 'FR43',
    suit: 'Weapon',
    name: 'Sword of Keth',
    strength: 7,
    bonus: '+10 with any one <span class="leader">Leader</span>. <br />OR +40 with both <span class="leader">Leader</span> and <span class="artifact">Shield of Keth</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.containsSuit('Leader') ? (hand.contains('Shield of Keth') ? 40 : 10) : 0;
    },
    relatedSuits: ['Leader'],
    relatedCards: ['Shield of Keth']
  },
  'FR44': {
    id: 'FR44',
    suit: 'Weapon',
    name: 'Elven Longbow',
    strength: 3,
    bonus: '+30 with <span class="army">Elven Archers</span>, <span class="leader">Warlord</span> or <span class="wizard">Beastmaster</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.contains('Elven Archers') || hand.contains('Warlord') || hand.contains('Beastmaster') ? 30 : 0;
    },
    relatedSuits: [],
    relatedCards: ['Elven Archers', 'Warlord', 'Beastmaster']
  },
  'FR45': {
    id: 'FR45',
    suit: 'Weapon',
    name: 'War Dirigible',
    strength: 35,
    bonus: null,
    penalty: 'BLANKED unless with at least one <span class="army">Army</span>. <br />BLANKED with any <span class="weather">Weather</span>.',
    blankedIf: function(hand) {
      return !hand.containsSuit('Army') || hand.containsSuit('Weather');
    },
    relatedSuits: ['Army', 'Weather'],
    relatedCards: []
  },
  'FR46': {
    id: 'FR46',
    suit: 'Artifact',
    name: 'Shield of Keth',
    strength: 4,
    bonus: '+15 with any one <span class="leader">Leader</span>. <br />OR +40 with both <span class="leader">Leader</span> and <span class="weapon">Sword of Keth</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.containsSuit('Leader') ? (hand.contains('Sword of Keth') ? 40 : 15) : 0;
    },
    relatedSuits: ['Leader'],
    relatedCards: ['Sword of Keth']
  },
  'FR47': {
    id: 'FR47',
    suit: 'Artifact',
    name: 'Gem of Order',
    strength: 5,
    bonus: '+10 for 3-card run, +30 for 4-card run, +60 for 5-card run, +100 for 6-card run, +150 for 7-card run. <br />(This refers to the base strength numbers.)',
    penalty: null,
    bonusScore: function(hand) {
      var strengths = hand.nonBlankedCards().map(card => card.strength);
      var currentRun = 0;
      var runs = [];
      for (var i = 0; i <= 40; i++) {
        if (strengths.includes(i)) {
          currentRun++;
        } else {
          runs.push(currentRun);
          currentRun = 0;
        }
      }
      var bonus = 0;
      for (var run of runs) {
        if (run === 3) {
          bonus += 10;
        } else if (run === 4) {
          bonus += 30;
        } else if (run === 5) {
          bonus += 60;
        } else if (run === 6) {
          bonus += 100;
        } else if (run >= 7) {
          bonus += 150;
        }
      }
      return bonus;
    },
    relatedSuits: [],
    relatedCards: []
  },
  'FR48': {
    id: 'FR48',
    suit: 'Artifact',
    name: 'World Tree',
    strength: 2,
    bonus: '+50 if every non-BLANKED card is a different suit.',
    penalty: null,
    bonusScore: function(hand) {
      var suits = [];
      for (const card of hand.nonBlankedCards()) {
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
    suit: 'Artifact',
    name: 'Book of Changes',
    strength: 3,
    bonus: 'You may change the suit of one other card. Its name, bonuses and penalties remain the same.',
    penalty: null,
    action: 'Pick a suit and a target card from your hand.',
    relatedSuits: [], // empty because the main reason for relatedSuits is to determine how to use 'Book of Changes'
    relatedCards: []
  },
  'FR50': {
    id: 'FR50',
    suit: 'Artifact',
    name: 'Protection Rune',
    strength: 1,
    bonus: 'CLEARS the Penalty on all cards.',
    penalty: null,
    clearsPenalty: function(card) {
      return true;
    },
    relatedSuits: [],
    relatedCards: []
  },
  'FR51': {
    id: 'FR51',
    suit: 'Wild',
    name: 'Shapeshifter',
    strength: 0,
    bonus: '<b>Shapeshifter</b> may duplicate the name and suit of any one <span class="artifact">Artifact</span>, <span class="leader">Leader</span>, <span class="wizard">Wizard</span>, <span class="weapon">Weapon</span> or <span class="beast">Beast</span> in the game. <br />Does not take the bonus, penalty, or base strength of the card duplicated.',
    penalty: null,
    action: 'Pick a target card to duplicate.',
    relatedSuits: ['Artifact', 'Leader', 'Wizard', 'Weapon', 'Beast'].sort(),
    relatedCards: []
  },
  'FR52': {
    id: 'FR52',
    suit: 'Wild',
    name: 'Mirage',
    strength: 0,
    bonus: '<b>Mirage</b> may duplicate the name and suit of any one <span class="army">Army</span>, <span class="land">Land</span>, <span class="weather">Weather</span>, <span class="flood">Flood</span> or <span class="flame">Flame</span> in the game. <br />Does not take the bonus, penalty, or base strength of the card duplicated.',
    penalty: null,
    action: 'Pick a target card to duplicate.',
    relatedSuits: ['Army', 'Land', 'Weather', 'Flood', 'Flame'].sort(),
    relatedCards: []
  },
  'FR53': {
    id: 'FR53',
    suit: 'Wild',
    name: 'Doppelgänger',
    strength: 0,
    bonus: '<b>Doppelgänger</b> may duplicate the name, base strength, suit, and penalty BUT NOT BONUS of any one other card in your hand.',
    penalty: null,
    action: 'Pick a card from your hand to duplicate.',
    relatedSuits: [],
    relatedCards: []
  },
  'FR54': {
    id: 'FR54',
    suit: 'Wizard',
    name: 'Jester',
    strength: 3,
    bonus: '+3 for each other card with an odd base value. <br />OR +50 if entire hand has odd base values.',
    penalty: null,
    bonusScore: function(hand) {
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
  }
};

var cursedHoard = {
  'CH01': {
    id: 'CH01',
    suit: 'Building',
    name: 'Dungeon',
    strength: 7,
    bonus: '+10 each for the first <span class="undead">Undead</span>, <span class="beast">Beast</span>, and <span class="artifact">Artifact</span>. <br />+5 for each additional card in any of these suits and <span class="wizard">Necromancer</span>, <span class="wizard">Warlock Lord</span>, <span class="outsider">Demon</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return (hand.containsSuit('Undead') ? 10 + (hand.countSuit('Undead') - 1) * 5: 0) +
        (hand.containsSuit('Beast') ? 10 + (hand.countSuit('Beast') - 1) * 5: 0) +
        (hand.containsSuit('Artifact') ? 10 + (hand.countSuit('Artifact') - 1) * 5: 0) +
        (hand.contains('Necromancer') ? 5: 0) +
        (hand.contains('Warlock Lord') ? 5: 0) +
        (hand.contains('Demon') ? 5: 0);
    },
    relatedSuits: ['Undead', 'Beast', 'Artifact'],
    relatedCards: ['Necromancer', 'Warlock Lord', 'Demon']
  },
  'CH02': {
    id: 'CH02',
    suit: 'Building',
    name: 'Castle',
    strength: 10,
    bonus: '+10 for the first <span class="leader">Leader</span>, <span class="army">Army</span>, <span class="land">Land</span>, and other <span class="building">Building</span>. <br />+5 for each additional <span class="building">Building</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return (hand.containsSuit('Leader') ? 10: 0) +
        (hand.containsSuit('Army') ? 10: 0) +
        (hand.containsSuit('Land') ? 10: 0) +
        (hand.containsSuitExcluding('Building', this.id) ? 10 + (hand.countSuitExcluding('Building', this.id) - 1) * 5: 0);
    },
    relatedSuits: ['Leader', 'Army', 'Land', 'Building'],
    relatedCards: []
  },
  'CH03': {
    id: 'CH03',
    suit: 'Building',
    name: 'Crypt',
    strength: 21,
    bonus: 'The sum of the base strength of all <span class="undead">Undead</span>.',
    penalty: 'BLANKs all <span class="leader">Leaders</span>.',
    bonusScore: function(hand) {
      var total = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.suit === 'Undead') {
          total += card.strength;
        }
      }
      return total;
    },
    blanks: function(card, hand) {
      return card.suit === 'Leader';
    },
    relatedSuits: ['Undead', 'Leader'],
    relatedCards: []
  },
  'CH04': {
    id: 'CH04',
    suit: 'Building',
    name: 'Chapel',
    strength: 2,
    bonus: '+40 if you have exactly two cards from among these suits: <span class="leader">Leader</span>, <span class="wizard">Wizard</span>, <span class="outsider">Outsider</span>, and <span class="undead">Undead</span>.',
    penalty: null,
    bonusScore: function(hand) {
      if (hand.countSuit('Leader') + hand.countSuit('Wizard') + hand.countSuit('Outsider') + hand.countSuit('Undead') === 2) {
        return 40;
      } else {
        return 0;
      }
    },
    relatedSuits: ['Leader', 'Wizard', 'Outsider', 'Undead'],
    relatedCards: []
  },
  'CH05': {
    id: 'CH05',
    suit: 'Land',
    name: 'Garden',
    strength: 11,
    bonus: '+11 for each <span class="leader">Leader</span> and <span class="beast">Beast</span>.',
    penalty: 'BLANKED by any <span class="undead">Undead</span>, <span class="wizard">Necromancer</span>, or <span class="outsider">Demon</span>.',
    bonusScore: function(hand) {
      return 11 * (hand.countSuit('Leader') + hand.countSuit('Beast'));
    },
    blankedIf: function(hand) {
      return hand.containsSuit('Undead') || hand.contains('Necromancer') || hand.contains('Demon');
    },
    relatedSuits: ['Leader', 'Beast', 'Undead'],
    relatedCards: ['Necromancer', 'Demon']
  },
  'CH06': {
    id: 'CH06',
    suit: 'Outsider',
    name: 'Genie',
    strength: -50,
    bonus: '+10 per other player. <br />At the end of the game, look through the draw deck and put one card in your hand. <br />(Resolves after <span class="outsider">Leprechaun</span>.)',
    penalty: null,
    bonusScore: function(hand) {
      return 10 * playerCount;
    },
    relatedSuits: [],
    relatedCards: ['Leprechaun'],
    extraCard: true,
    referencesPlayerCount: true
  },
  'CH07': {
    id: 'CH07',
    suit: 'Outsider',
    name: 'Judge',
    strength: 11,
    bonus: '+10 for each card that contains a Penalty that is not CLEARED.',
    penalty: null,
    bonusScore: function(hand) {
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
    suit: 'Outsider',
    name: 'Angel',
    strength: 16,
    bonus: 'Prevent one other card from being BLANKED. This card can never be BLANKED.',
    action: 'Pick a target card from your hand.',
    penalty: null,
    relatedSuits: [],
    relatedCards: []
  },
  'CH09': {
    id: 'CH09',
    suit: 'Outsider',
    name: 'Leprechaun',
    strength: 20,
    bonus: 'Draw the top card from the deck at the end of the game and add it to your hand. <br />(Resolves before <span class="outsider">Genie</span>.)',
    penalty: null,
    relatedSuits: [],
    relatedCards: [],
    extraCard: true
  },
  'CH10': {
    id: 'CH10',
    suit: 'Outsider',
    name: 'Demon',
    strength: 45,
    bonus: null,
    penalty: 'For every non-<span class="outsider">Outsider</span> card: If that card is the only card you have in that suit, then that card is BLANKED. <br />This takes place before any other BLANKING.',
    blanks: function(card, hand) {
      return card.suit !== 'Outsider' && hand.countSuit(card.suit) === 1;
    },
    relatedSuits: ['Outsider'],
    relatedCards: []
  },
  'CH11': {
    id: 'CH11',
    suit: 'Undead',
    name: 'Dark Queen',
    strength: 10,
    bonus: '+5 for each <span class="land">Land</span>, <span class="flood">Flood</span>, <span class="flame">Flame</span>, <span class="weather">Weather</span>, and <span class="beast">Unicorn</span> in the discard area.',
    penalty: null,
    bonusScore: function(hand, discard) {
      return (5 * (discard.countSuit('Land') + discard.countSuit('Flood') + discard.countSuit('Flame') + discard.countSuit('Weather')))
        + (discard.contains('Unicorn') ? 5 : 0);
    },
    relatedSuits: ['Land', 'Flood', 'Flame', 'Weather'],
    relatedCards: ['Unicorn'],
    referencesDiscardArea: true
  },
  'CH12': {
    id: 'CH12',
    suit: 'Undead',
    name: 'Ghoul',
    strength: 8,
    bonus: '+4 for each <span class="wizard">Wizard</span>, <span class="leader">Leader</span>, <span class="army">Army</span>, <span class="beast">Beast</span>, and <span class="undead">Undead</span> in the discard area.',
    penalty: null,
    bonusScore: function(hand, discard) {
      return 4 * (discard.countSuit('Wizard') + discard.countSuit('Leader') + discard.countSuit('Army') + discard.countSuit('Beast') + discard.countSuit('Undead'));
    },
    relatedSuits: ['Wizard', 'Leader', 'Army', 'Beast', 'Undead'],
    relatedCards: [],
    referencesDiscardArea: true
  },
  'CH13': {
    id: 'CH13',
    suit: 'Undead',
    name: 'Specter',
    strength: 12,
    bonus: '+6 for each <span class="wizard">Wizard</span>, <span class="artifact">Artifact</span>, and <span class="outsider">Outsider</span> in the discard area.',
    penalty: null,
    bonusScore: function(hand, discard) {
      return 6 * (discard.countSuit('Wizard') + discard.countSuit('Artifact') + discard.countSuit('Outsider'));
    },
    relatedSuits: ['Wizard', 'Artifact', 'Outsider'],
    relatedCards: [],
    referencesDiscardArea: true
  },
  'CH14': {
    id: 'CH14',
    suit: 'Undead',
    name: 'Lich',
    strength: 13,
    bonus: '+10 for <span class="wizard">Necromancer</span> and each other <span class="undead">Undead</span>. <br /><span class="undead">Undead</span> may not be BLANKED.',
    penalty: null,
    bonusScore: function(hand) {
      return (hand.contains('Necromancer') ? 10 : 0) + 10 * hand.countSuitExcluding('Undead', this.id);
    },
    relatedSuits: ['Undead'],
    relatedCards: ['Necromancer']
  },
  'CH15': {
    id: 'CH15',
    suit: 'Undead',
    name: 'Death Knight',
    strength: 14,
    bonus: '+7 for each <span class="weapon">Weapon</span> and <span class="army">Army</span> in the discard area.',
    penalty: null,
    bonusScore: function(hand, discard) {
      return 7 * (discard.countSuit('Weapon') + discard.countSuit('Army'));
    },
    relatedSuits: ['Weapon', 'Army'],
    relatedCards: [],
    referencesDiscardArea: true
  },
  'CH16': {
    id: 'CH16',
    suit: 'Building',
    name: 'Bell Tower',
    replaces: 'FR03',
    strength: 8,
    bonus: '+15 with any one <span class="wizard">Wizard</span> or <span class="undead">Undead</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return (hand.containsSuit('Wizard') || hand.containsSuit('Undead')) ? 15 : 0;
    },
    relatedSuits: ['Wizard', 'Undead'],
    relatedCards: []
  },
  'CH17': {
    id: 'CH17',
    suit: 'Flood',
    name: 'Fountain of Life',
    replaces: 'FR06',
    strength: 1,
    bonus: 'Add the base strength of any one <span class="building">Building</span>, <span class="weapon">Weapon</span>, <span class="flood">Flood</span>, <span class="flame">Flame</span>, <span class="land">Land</span> or <span class="weather">Weather</span> in your hand.',
    penalty: null,
    bonusScore: function(hand) {
      var max = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.suit === 'Building' || card.suit === 'Weapon' || card.suit === 'Flood' || card.suit === 'Flame' || card.suit === 'Land' || card.suit === 'Weather') {
          if (card.strength > max) {
            max = card.strength;
          }
        }
      }
      return max;
    },
    relatedSuits: ['Building', 'Weapon', 'Flood', 'Flame', 'Land', 'Weather'],
    relatedCards: []
  },
  'CH18': {
    id: 'CH18',
    suit: 'Flood',
    name: 'Great Flood',
    replaces: 'FR08',
    strength: 32,
    bonus: null,
    penalty: 'BLANKS all <span class="army">Armies</span>, all <span class="building">Buildings</span>, all <span class="land">Lands</span> except <span class="land">Mountain</span>, and all <span class="flame">Flames</span> except <span class="flame">Lightning</span>.',
    blanks: function(card, hand) {
      return (card.suit === 'Army' && !(hand.containsId('FR25') || hand.containsId('CH19') || hand.containsId('FR41'))) || // these clear the word 'Army' from the penalty
        (card.suit === 'Building') ||
        (card.suit === 'Land' && card.name !== 'Mountain') ||
        (card.suit === 'Flame' && card.name !== 'Lightning');
    },
    relatedSuits: ['Army', 'Building', 'Land', 'Flame'],
    relatedCards: ['Mountain', 'Lightning']
  },
  'CH19': {
    id: 'CH19',
    suit: 'Army',
    name: 'Rangers',
    replaces: 'FR25',
    strength: 5,
    bonus: '+10 for each <span class="land">Land</span> and <span class="building">Building</span>. <br />CLEARS the word <span class="army">Army</span> from all Penalties.',
    penalty: null,
    bonusScore: function(hand) {
      return 10 * (hand.countSuit('Land') + hand.countSuit('Building'));
    },
    relatedSuits: ['Land', 'Building', 'Army'],
    relatedCards: []
  },
  'CH20': {
    id: 'CH20',
    suit: 'Wizard',
    name: 'Necromancer',
    replaces: 'FR28',
    strength: 3,
    bonus: 'At the end of the game, you may take one <span class="army">Army</span>, <span class="leader">Leader</span>, <span class="wizard">Wizard</span>, <span class="beast">Beast</span>, or <span class="undead">Undead</span> from the discard pile and add it to your hand. <br /><span class="undead">Undead</span> may not be blanked.',
    penalty: null,
    relatedSuits: ['Army', 'Leader', 'Wizard', 'Beast', 'Undead'],
    relatedCards: [],
    extraCard: true
  },
  'CH21': {
    id: 'CH21',
    suit: 'Artifact',
    name: 'World Tree',
    replaces: 'FR48',
    strength: 2,
    bonus: '+70 if every non-BLANKED card is a different suit.',
    penalty: null,
    bonusScore: function(hand) {
      var suits = [];
      for (const card of hand.nonBlankedCards()) {
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
    suit: 'Wild',
    name: 'Shapeshifter',
    replaces: 'FR51',
    strength: 0,
    bonus: '<b>Shapeshifter</b> may duplicate the name and suit of any one <span class="artifact">Artifact</span>, <span class="leader">Leader</span>, <span class="wizard">Wizard</span>, <span class="weapon">Weapon</span>, <span class="beast">Beast</span>, or <span class="undead">Undead</span> in the game. <br />Does not take the bonus, penalty, or base strength of the card duplicated.',
    penalty: null,
    action: 'Pick a target card to duplicate.',
    relatedSuits: ['Artifact', 'Leader', 'Wizard', 'Weapon', 'Beast', 'Undead'].sort(),
    relatedCards: []
  },
  'CH23': {
    id: 'CH23',
    suit: 'Wild',
    name: 'Mirage',
    replaces: 'FR52',
    strength: 0,
    bonus: '<b>Mirage</b> may duplicate the name and suit of any one <span class="army">Army</span>, <span class="building">Building</span>, <span class="land">Land</span>, <span class="weather">Weather</span>, <span class="flood">Flood</span> or <span class="flame">Flame</span> in the game. <br />Does not take the bonus, penalty, or base strength of the card duplicated.',
    penalty: null,
    action: 'Pick a target card to duplicate.',
    relatedSuits: ['Army', 'Building', 'Land', 'Weather', 'Flood', 'Flame'].sort(),
    relatedCards: []
  }
};

var cursedItems = {
  'CH24': {
    id: 'CH24',
    suit: 'Cursed Item',
    name: 'Spyglass',
    timing: 'ANY TIME',
    description: 'Look at another player’s hand. <br />(*This item’s base value is -10 in 2-player game)',
    points: -1 // TODO: -10 in 2-player
  },
  'CH25': {
    id: 'CH25',
    suit: 'Cursed Item',
    name: 'Sarcophagus',
    timing: 'REPLACE TURN',
    description: 'Take the top card from the deck and place it directly in the discard area, then end your turn. <br />(The makeup of your hand will not change this turn.)',
    points: 5
  },
  'CH26': {
    id: 'CH26',
    suit: 'Cursed Item',
    name: 'Blindfold',
    timing: 'REPLACE TURN',
    description: 'Reverse normal turn order: discard a card first, then draw a card from the deck.',
    points: 5
  },
  'CH27': {
    id: 'CH27',
    suit: 'Cursed Item',
    name: 'Book of Prophecy',
    timing: 'ANY TIME',
    description: 'Look at the bottom seven cards of the deck, then replace them there.',
    points: -1
  },
  'CH28': {
    id: 'CH28',
    suit: 'Cursed Item',
    name: 'Crystal Ball',
    timing: 'ANY TIME',
    description: 'Name a suit. All other players must reveal all cards they possess of that suit.',      
    points: -1
  },
  'CH29': {
    id: 'CH29',
    suit: 'Cursed Item',
    name: 'Market Wagon',
    timing: 'REPLACE TURN',
    description: 'Reveal a card from your hand. Any other player may reveal up to 3 cards to offer in exchange. <br />You may choose to trade your card for one of them; if no offer is acceptable, keep your card or discard it and draw from the deck.',    
    points: -2
  },
  'CH30': {
    id: 'CH30',
    suit: 'Cursed Item',
    name: 'Backpack',
    timing: 'ANY TIME',
    description: 'Draw three <span class="cursed-item">Cursed Items</span> and set them aside face up. <br />The next three times you would draw a new <span class="cursed-item">Cursed Item</span> from the deck, you must take one of these cards instead.',    
    points: -2
  },
  'CH31': {
    id: 'CH31',
    suit: 'Cursed Item',
    name: 'Shovel',
    timing: 'ANY TIME',
    description: 'Put a card from the discard area on the bottom of the deck.',    
    points: -2
  },
  'CH32': {
    id: 'CH32',
    suit: 'Cursed Item',
    name: 'Sealed Vault',
    timing: 'ANY TIME',
    description: 'Cover two cards in the discard area with this card. They still count towards the end of the game and give bonuses to <span class="undead">Undead</span>, but no one but you may take them, and they are immune to <span class="cursed-item">Shovel</span> and <span>Gold Mirror</span>.',
    points: -4
  },
  'CH33': {
    id: 'CH33',
    suit: 'Cursed Item',
    name: 'Crystal Lens',
    timing: 'ANY TIME',
    description: 'You may peek at the top card of the deck before deciding whether to draw from the deck or discard area.',    
    points: -2
  },
  'CH34': {
    id: 'CH34',
    suit: 'Cursed Item',
    name: 'Larcenous Gloves',
    timing: 'ANY TIME',
    description: 'Steal a face-up <span class="cursed-item">Cursed Item</span> from another player. You must use it immediately. <br />The player you stole from must immediately draw a replacement from the <span class="cursed-item">Cursed Item</span> deck.',    
    points: -3
  },
  'CH35': {
    id: 'CH35',
    suit: 'Cursed Item',
    name: 'Junkyard Map',
    timing: 'ANY TIME',
    description: 'Take one of the top three discarded <span class="cursed-item">Cursed Item</span> cards and play it immediately.',  
    points: -3
  },
  'CH36': {
    id: 'CH36',
    suit: 'Cursed Item',
    name: 'Winged Boots',
    timing: 'ANY TIME',
    description: 'Put the top card of the deck directly into the discard area.',    
    points: -4
  },
  'CH37': {
    id: 'CH37',
    suit: 'Cursed Item',
    name: 'Staff of Transmutation',
    timing: 'REPLACE TURN',
    description: 'Return 3-8 cards from your hand to the bottom of the deck and replace them from the top of the deck.',    
    points: -4
  },
  'CH38': {
    id: 'CH38',
    suit: 'Cursed Item',
    name: 'Rake',
    timing: 'REPLACE TURN',
    description: 'Draw two cards from the discard area, then discard two cards.',    
    points: -4
  },
  'CH39': {
    id: 'CH39',
    suit: 'Cursed Item',
    name: 'Treasure Chest',
    timing: 'ANY TIME',
    description: 'Worth +25 points at the end of the game if you have at least three other <span class="cursed-item">Cursed Items</span> facedown.',
    bonusScore: function(hand) {
      return hand.countSuitExcluding('Cursed Item', this.id) >= 3 ? 25: 0;
    },
    points: -5 // TODO: +25 if at least 3 other Cursed Items
  },
  'CH40': {
    id: 'CH40',
    suit: 'Cursed Item',
    name: 'Fishhook',
    timing: 'REPLACE TURN',
    description: 'Draw two cards from the deck, then discard any two cards.',    
    points: -6
  },
  'CH41': {
    id: 'CH41',
    suit: 'Cursed Item',
    name: 'Repair Kit',
    timing: 'COPY TIMING OF COPIED CARD',
    description: 'Copy the ability of any <span class="cursed-item">Cursed Item</span> you have already played other than <span class="cursed-item">Backpack</span>, <span class="cursed-item">Sarcophagus</span>, <span class="cursed-item">Blindfold</span>, and <span class="cursed-item">Treasure Chest</span>. <br />Discard and redraw if you have no facedown <span class="cursed-item">Cursed Items</span>.',    
    points: -6
  },
  'CH42': {
    id: 'CH42',
    suit: 'Cursed Item',
    name: 'Hourglass',
    timing: 'AFTER TURN',
    description: 'Take an extra turn. Do not replace this card with a new <span class="cursed-item">Cursed Item</span> until after your second turn.',    
    points: -7
  },
  'CH43': {
    id: 'CH43',
    suit: 'Cursed Item',
    name: 'Gold Mirror',
    timing: 'ANY TIME',
    description: 'Put three cards from the discard area on the bottom of the deck. <br />Replace them with the top three cards of the deck.',    
    points: -8
  },
  'CH44': {
    id: 'CH44',
    suit: 'Cursed Item',
    name: 'Cauldron',
    timing: 'REPLACE TURN',
    description: 'Instead of drawing a card from the deck, draw three cards, then place two of them on the top or bottom of the deck (or one each) before you discard normally.',    
    points: -9
  },
  'CH45': {
    id: 'CH45',
    suit: 'Cursed Item',
    name: 'Lantern',
    timing: 'REPLACE TURN',
    description: 'Name a suit. Draw from the deck until you draw a card from that suit, or until you have drawn ten cards. (Wild cards do not count.) <br />If you draw a card from the named suit, keep it and discard a different card from your hand. <br />Show the other cards you drew and reshuffle them into the deck.',    
    points: -10
  },
  'CH46': {
    id: 'CH46',
    suit: 'Cursed Item',
    name: 'Portal',
    timing: 'ANY TIME',
    description: 'Skip your discard phase this turn. <br />(You will have one extra card in your hand from now on.)',    
    points: -20,
    extraCard: true // TODO: support this
  },
  'CH47': {
    id: 'CH47',
    suit: 'Cursed Item',
    name: 'Wishing Ring',
    timing: 'ANY TIME',
    description: 'Look through the deck and place any card you wish on top. <br />(You may do this immediately before you draw.) <br />Reshuffle the deck at the end of your turn.',
    points: -30
  }
}

var deck = {
  cards: {...base},
  cursedItems: {},
  enableCursedHoardSuits: function() {
    this.cards = {...base, ...cursedHoard};
    for (const id in cursedHoard) {
      const card = this.cards[id];
      if (card.replaces) {
        delete this.cards[card.replaces];
      }
    }
  },
  disableCursedHoardSuits: function() {
    this.cards = {...base}
  },
  enableCursedHoardItems: function() {
    this.cursedItems = cursedItems;
  },
  disableCursedHoardItems: function() {
    this.cursedItems = {};
  },
  getCardByName: function(cardName) {
    for (const id in this.cards) {
      const card = this.cards[id];
      if (card.name === cardName) {
        return card;
      }
    }
  },
  getCardById: function(id) {
    if (id.match(/^[0-9+]+$/)) {
      id = 'FR' + id.padStart(2, '0')
    }
    return this.cards[id];
  },
  getCardsBySuit: function(suits) {
    var cardsBySuit = {};
    for (const id in this.cards) {
      const card = this.cards[id];
      if (suits === undefined || suits.includes(card.suit)) {
        if (cardsBySuit[card.suit] === undefined) {
          cardsBySuit[card.suit] = [];
        }
        cardsBySuit[card.suit].push(card);
      }
    }
    var ordered = {};
    if (Object.keys(cursedItems).length > 0 && suits === undefined) {
      ordered['Cursed Item'] = [];
      for (const id in this.cursedItems) {
        ordered['Cursed Item'].push(this.cursedItems[id]);
      }  
    }
    Object.keys(cardsBySuit).sort().forEach(function(key) {
      ordered[key] = cardsBySuit[key];
    });
    return ordered;
  },
  suits: function() {
    var suits = {};
    for (const id in this.cards) {
      const card = this.cards[id];
      suits[card.suit] = card.suit;
    }
    return Object.keys(suits).sort();
  }
};

function allSuits() {
    return ['Land', 'Flood', 'Weather', 'Flame', 'Army', 'Wizard', 'Leader', 'Beast', 'Weapon', 'Artifact', 'Wild', 'Building', 'Outsider', 'Undead'].sort();
}

var NONE = -1;
var ISLAND = 'FR09';
var NECROMANCER = 'FR28';
var BOOK_OF_CHANGES = 'FR49';
var SHAPESHIFTER = 'FR51';
var MIRAGE = 'FR52';
var DOPPELGANGER = 'FR53';

var CH_NECROMANCER = 'CH20';
var CH_SHAPESHIFTER = 'CH22';
var CH_MIRAGE = 'CH22';
var CH_DEMON = 'CH10';
var CH_LICH = 'CH14';
var CH_ANGEL = 'CH08';

var ACTION_ORDER = [DOPPELGANGER, MIRAGE, CH_MIRAGE, SHAPESHIFTER, CH_SHAPESHIFTER, BOOK_OF_CHANGES, ISLAND, CH_ANGEL];
