# Original Units 10-12 lesson content. Not copied from any program.
# Skills follow the 22-unit home tiles: More Bossy R, Long A and E teams, Long O and I teams.

def S(text):
    return {'text': text, 'words': text.split(' ')}

def hear(word, a, b):
    return {'word': word, 'choices': [word, a, b]}

def build(word, a, b, alt_a, alt_b):
    return {'word': word, 'a': a, 'b': b, 'altA': alt_a, 'altB': alt_b}

def rhyme(prompt, answer, a, b):
    return {'prompt': prompt, 'answer': answer, 'choices': [answer, a, b]}

def which(word, part):
    return {'word': word, 'part': part}

def sort(word, bin_id):
    return {'word': word, 'bin': bin_id}

def check(word, a, b):
    return {'type': 'pick', 'word': word, 'choices': [word, a, b]}

def meet(who, audio, word, chips, cap, text):
    return {'who': who, 'audio': audio, 'word': word, 'chips': chips, 'cap': cap, 'text': text}

def day(label, focus, teach, ido, wedo, youdo, spell, review, families):
    return {
        'label': label, 'focus': focus, 'teach': teach,
        'ido': ido, 'wedo': wedo, 'youdo': youdo, 'spell': spell,
        'review': review, 'families': families,
    }

LESSONS = []

def add(lesson):
    LESSONS.append(lesson)

# --- Unit 10 More Bossy R. air and are share a sound. ear (hear) is a different sound. ---

add({
    'key': 'u101', 'n': '10.1', 'unit': 10, 'name': 'air, are',
    'storyTitle': 'The Fair Chair',
    'blurb': 'air and are say the sound in chair and care. Two spellings, one sound.',
    'focus': ['are', 'air'], 'focusKind': 'pattern', 'vowels': 'aeiou',
    'label': 'air, are', 'keyword': 'chair, care',
    'rec': ['air'],
    'days': ['air', 'are', 'Mix air and are'],
    'meet': [
        meet('zip', 'u101_m1', 'chair', ['air', 'fair', 'hair', 'chair'],
             'air as in chair.',
             'Chair. Fair. Hair. This team says the sound in chair.'),
        meet('frill', 'u101_m2', 'care', ['care', 'share', 'scare', 'spare'],
             'are says the same sound.',
             'Care. Share. Scare. Spare. This spelling says the same sound as air.'),
        meet('zip', 'u101_m3', 'pair', ['pair', 'chair', 'share', 'spare'],
             'Look at the team. Then say the word.',
             'Pair. Chair. Share. Spare. Find the team, then say the word.'),
    ],
    'chant': [
        'Fair, hair, chair,',
        'pair on the stair.',
        'Care and share,',
        'a spare in the air.',
    ],
    'hear': [
        hear('chair', 'chop', 'chin'), hear('hair', 'harp', 'hard'),
        hear('fair', 'farm', 'far'), hear('pair', 'part', 'park'),
        hear('care', 'car', 'core'), hear('share', 'shore', 'shark'),
        hear('scare', 'scar', 'score'), hear('spare', 'spot', 'spit'),
    ],
    'build': [
        build('chair', 'ch', 'air', 'sh', 'are'),
        build('share', 'sh', 'are', 'ch', 'air'),
        build('stair', 'st', 'air', 'sp', 'are'),
        build('scare', 'sc', 'are', 'st', 'air'),
        build('hair', 'h', 'air', 'c', 'are'),
        build('care', 'c', 'are', 'h', 'air'),
    ],
    'chains': [
        ['fair', 'hair', 'pair', 'chair'],
        ['care', 'dare', 'rare', 'mare'],
    ],
    'scramble': ['chair', 'share', 'stair', 'scare', 'spare', 'hair'],
    'feed': ['chair', 'hair', 'fair', 'pair', 'care', 'share', 'scare', 'spare'],
    'sentences': [
        S('The pair of chairs is at the fair.'),
        S('I care, and I share.'),
        S('Frill has a spare chair.'),
        S('A scare is in the air.'),
        S('Zip sits on the stair.'),
        S('The mare has a rare hair clip.'),
    ],
    'fishLabel': 'has air or are',
    'fishYes': ['chair', 'hair', 'fair', 'care', 'share', 'scare'],
    'fishNo': ['car', 'star', 'farm', 'horn', 'store', 'her'],
    'bins': [{'id': 'air', 'label': '-air'}, {'id': 'are', 'label': '-are'}],
    'whichChoices': ['air', 'are'],
    'whichLabel': 'Tap the team.',
    'which': [
        which('chair', 'air'), which('care', 'are'), which('hair', 'air'),
        which('share', 'are'), which('stair', 'air'), which('scare', 'are'),
        which('pair', 'air'), which('spare', 'are'),
    ],
    'rhyme': [
        rhyme('chair', 'hair', 'care', 'car'),
        rhyme('care', 'share', 'chair', 'car'),
        rhyme('fair', 'pair', 'far', 'farm'),
        rhyme('scare', 'spare', 'scar', 'score'),
        rhyme('stair', 'pair', 'star', 'store'),
        rhyme('dare', 'rare', 'dark', 'dart'),
    ],
    'sort': [
        sort('fair', 'air'), sort('care', 'are'), sort('stair', 'air'),
        sort('dare', 'are'), sort('hair', 'air'), sort('spare', 'are'),
        sort('pair', 'air'), sort('share', 'are'), sort('chair', 'air'),
        sort('rare', 'are'),
    ],
    'check': [
        check('chair', 'char', 'car'), check('hair', 'hard', 'her'),
        check('fair', 'far', 'fear'), check('pair', 'park', 'pear'),
        check('stair', 'star', 'store'), check('care', 'car', 'core'),
        check('share', 'shore', 'shark'), check('scare', 'scar', 'score'),
        check('spare', 'spot', 'spit'), check('dare', 'dark', 'dart'),
    ],
    'heart': [{'w': 'wear', 'part': 'ear'}],
    'newWords': [],
    'pics': ['chair', 'hair', 'stair', 'pair', 'share'],
    'bellExtra': ['air', 'fair', 'mare', 'rare', 'dare', 'stare', 'car', 'star', 'her'],
    'story': [
        S('Zip and Frill go to the fair. Zip has a red chair.'),
        S('The wind hits hard. The chair tips on the stair.'),
        S('Frill has a spare chair. Frill will share it.'),
        S('Zip and Frill sit and grin. They care for the pair of chairs.'),
        S('A big bird lands on the stair. Zip has a scare.'),
        S('The bird lifts off. Zip and Frill share a snack. Zip will not wear a hat.'),
    ],
    'dayPlan': [
        day('Day 1', 'air', 'The team air says the sound in chair. Fair and hair use it too.',
            ['air', 'fair', 'hair', 'chair'], ['pair', 'stair', 'hair', 'fair'],
            ['chair', 'stair', 'pair', 'hair', 'fair', 'air'],
            ['fair', 'hair', 'chair', 'stair'],
            ['car', 'fair', 'star', 'hair', 'farm', 'pair'],
            [['-air', ['fair', 'hair', 'pair', 'chair', 'stair']]]),
        day('Day 2', 'are', 'are says the same sound as air. Care, share, and scare use are.',
            ['care', 'share', 'scare', 'spare'], ['dare', 'rare', 'mare', 'share'],
            ['care', 'share', 'scare', 'spare', 'dare', 'rare'],
            ['care', 'share', 'scare', 'spare'],
            ['car', 'care', 'or', 'share', 'her', 'spare'],
            [['-are', ['care', 'share', 'scare', 'spare', 'dare']]]),
        day('Day 3', 'air and are', 'Mix the two spellings. The sound matches. The letters do not.',
            ['chair', 'care', 'hair', 'share'], ['fair', 'scare', 'pair', 'spare'],
            ['chair', 'care', 'stair', 'dare', 'hair', 'share', 'pair', 'spare'],
            ['chair', 'care', 'stair', 'share'],
            ['farm', 'fair', 'store', 'share', 'star', 'stair'],
            [['-air', ['fair', 'hair', 'pair']], ['-are', ['care', 'share', 'scare']]]),
    ],
})

add({
    'key': 'u102', 'n': '10.2', 'unit': 10, 'name': 'ear',
    'storyTitle': 'Hear the Gear',
    'blurb': 'ear says the sound in hear, near, and year. A few words that look like ear say the air sound. Learn those by heart.',
    'focus': ['ear'], 'focusKind': 'pattern', 'vowels': 'aeiou',
    'label': 'ear', 'keyword': 'hear, near',
    'rec': ['ear'],
    'days': ['ear', 'ear word families', 'Review air, are, and ear'],
    'meet': [
        meet('zip', 'u102_m1', 'hear', ['ear', 'hear', 'near', 'year'],
             'ear as in hear.',
             'Hear. Near. Year. This team says the sound in hear.'),
        meet('frill', 'u102_m2', 'clear', ['clear', 'fear', 'gear', 'beard'],
             'Read the team, then the rest.',
             'Clear. Fear. Gear. Beard. The team ear sits in each word.'),
        meet('zip', 'u102_m3', 'bear', ['bear', 'wear', 'hear', 'near'],
             'Bear and wear look like ear. They say the air sound.',
             'Bear. Wear. These two look like ear, but they say the sound in care. Learn them by heart.'),
    ],
    'chant': [
        'Hear it near,',
        'year by year.',
        'Clear the gear.',
        'No fear, no fear.',
    ],
    'hear': [
        hear('hear', 'hair', 'her'), hear('near', 'nap', 'nor'),
        hear('year', 'yard', 'yell'), hear('fear', 'fair', 'far'),
        hear('clear', 'chair', 'clerk'), hear('gear', 'girl', 'car'),
        hear('beard', 'bird', 'bed'), hear('ear', 'air', 'are'),
    ],
    'build': [
        build('hear', 'h', 'ear', 'n', 'air'),
        build('near', 'n', 'ear', 'f', 'are'),
        build('fear', 'f', 'ear', 'g', 'air'),
        build('gear', 'g', 'ear', 'h', 'are'),
        build('year', 'y', 'ear', 'cl', 'air'),
        build('clear', 'cl', 'ear', 'y', 'are'),
    ],
    'chains': [
        ['hear', 'near', 'fear', 'gear'],
        ['ear', 'year', 'fear', 'clear'],
    ],
    'scramble': ['hear', 'near', 'clear', 'beard', 'gear', 'year'],
    'feed': ['hear', 'near', 'year', 'fear', 'clear', 'gear', 'beard', 'ear'],
    'sentences': [
        S('Frill can hear a tap near the dock.'),
        S('Zip has a fear of the bell this year.'),
        S('A gear is stuck. The bell will not ring.'),
        S('Frill can clear the gear.'),
        S('The beard of moss is on the gear.'),
        S('A bear is not near. It was just the gear.'),
    ],
    'fishLabel': 'has ear as in hear',
    'fishYes': ['hear', 'near', 'year', 'fear', 'clear', 'gear'],
    'fishNo': ['chair', 'share', 'car', 'star', 'horn', 'her'],
    'bins': [{'id': 'ear', 'label': '-ear'}, {'id': 'air', 'label': '-air / -are'}],
    'whichChoices': ['ear', 'air', 'are'],
    'whichLabel': 'Tap the team.',
    'which': [
        which('hear', 'ear'), which('chair', 'air'), which('care', 'are'),
        which('near', 'ear'), which('hair', 'air'), which('clear', 'ear'),
        which('share', 'are'), which('year', 'ear'),
    ],
    'rhyme': [
        rhyme('hear', 'near', 'hair', 'her'),
        rhyme('fear', 'gear', 'fair', 'far'),
        rhyme('year', 'ear', 'yard', 'yell'),
        rhyme('clear', 'fear', 'chair', 'clerk'),
        rhyme('near', 'hear', 'nap', 'nor'),
        rhyme('gear', 'year', 'girl', 'car'),
    ],
    'sort': [
        sort('hear', 'ear'), sort('chair', 'air'), sort('clear', 'ear'),
        sort('share', 'air'), sort('near', 'ear'), sort('fair', 'air'),
        sort('year', 'ear'), sort('care', 'air'), sort('gear', 'ear'),
        sort('spare', 'air'),
    ],
    'check': [
        check('hear', 'hair', 'her'), check('near', 'nor', 'nap'),
        check('year', 'yard', 'yell'), check('fear', 'fair', 'far'),
        check('clear', 'chair', 'clerk'), check('gear', 'girl', 'car'),
        check('beard', 'bird', 'bed'), check('ear', 'air', 'are'),
        check('spear', 'spare', 'star'), check('smear', 'smart', 'share'),
    ],
    'heart': [{'w': 'bear', 'part': 'ear'}, {'w': 'pear', 'part': 'ear'}],
    'newWords': [],
    'pics': ['ear', 'gear', 'beard', 'year'],
    'bellExtra': ['ear', 'spear', 'smear', 'chair', 'care', 'her', 'bird'],
    'story': [
        S('Frill hears a tap near the dock.'),
        S('Zip and Frill fear a big storm. The year is wet.'),
        S('A gear is stuck in the bell. The bell will not ring.'),
        S('Frill can clear the gear. Zip holds the bell.'),
        S('The gear pops out. The bell is clear.'),
        S('Zip and Frill hear the bell. A pear sits by the dock. A bear is not near.'),
    ],
    'dayPlan': [
        day('Day 1', 'ear', 'ear says the sound in hear. Near, year, and fear use it too.',
            ['ear', 'hear', 'near', 'year'], ['fear', 'gear', 'clear', 'beard'],
            ['hear', 'near', 'year', 'fear', 'clear', 'gear'],
            ['hear', 'near', 'fear', 'year'],
            ['her', 'hear', 'hair', 'near', 'car', 'clear'],
            [['-ear', ['hear', 'near', 'fear', 'gear', 'year']]]),
        day('Day 2', 'ear families', 'Keep the ear team. Change the sound in front.',
            ['clear', 'fear', 'gear', 'beard'], ['spear', 'smear', 'year', 'ear'],
            ['clear', 'spear', 'gear', 'beard', 'smear', 'year'],
            ['clear', 'gear', 'beard', 'spear'],
            ['chair', 'clear', 'share', 'spear', 'store', 'year'],
            [['-ear', ['clear', 'fear', 'gear']], ['-ear', ['year', 'spear', 'smear']]]),
        day('Day 3', 'Review', 'Review air, are, and ear. Bear, wear, and pear are heart words.',
            ['chair', 'hear', 'care', 'near'], ['fair', 'fear', 'share', 'year'],
            ['chair', 'hear', 'share', 'clear', 'stair', 'gear', 'spare', 'year'],
            ['chair', 'hear', 'share', 'clear'],
            ['car', 'care', 'hear', 'her', 'fair', 'fear'],
            [['-air', ['fair', 'hair', 'chair']], ['-are', ['care', 'share']], ['-ear', ['hear', 'near', 'year']]]),
    ],
})

# spear/smear were used but not in the main word bank. Add them to bell via bellExtra. They need to be decodable: s-p-ear, s-m-ear. Yes.

add({
    'key': 'u111', 'n': '11.1', 'unit': 11, 'name': 'ai, ay',
    'storyTitle': 'Rain on the Trail',
    'blurb': 'ai and ay say the long a sound. ai is in the middle of a word. ay is at the end.',
    'focus': ['ai', 'ay'], 'focusKind': 'pattern', 'vowels': 'aeiou',
    'label': 'ai, ay', 'keyword': 'rain, day',
    'rec': ['ay'],
    'days': ['ai', 'ay', 'Mix ai and ay'],
    'meet': [
        meet('zip', 'u111_m1', 'rain', ['rain', 'wait', 'trail', 'paint'],
             'ai says the long a sound.',
             'Rain. Wait. Trail. The team ai says the long a sound.'),
        meet('frill', 'u111_m2', 'day', ['day', 'play', 'stay', 'way'],
             'ay says the long a sound at the end.',
             'Day. Play. Stay. Way. At the end of a word, ay says the long a sound.'),
        meet('zip', 'u111_m3', 'paint', ['paint', 'train', 'hay', 'bay'],
             'Middle or end. Same sound.',
             'Paint. Train. Hay. Bay. Find ai or ay, then say the long a sound.'),
    ],
    'chant': [
        'Rain on the trail.',
        'Wait, wait, wait.',
        'A ray on the bay.',
        'Play, play, play.',
    ],
    'hear': [
        hear('rain', 'ran', 'rid'), hear('wait', 'wet', 'wit'),
        hear('trail', 'trot', 'trim'), hear('paint', 'pant', 'pat'),
        hear('day', 'den', 'did'), hear('play', 'plan', 'plop'),
        hear('stay', 'step', 'stop'), hear('hay', 'had', 'hit'),
    ],
    'build': [
        build('rain', 'r', 'ain', 'w', 'ay'),
        build('wait', 'w', 'ait', 'pl', 'ay'),
        build('day', 'd', 'ay', 'r', 'ain'),
        build('play', 'pl', 'ay', 'tr', 'ail'),
        build('trail', 'tr', 'ail', 'p', 'aint'),
        build('paint', 'p', 'aint', 'st', 'ay'),
    ],
    'chains': [
        ['rain', 'pain', 'paint', 'faint'],
        ['day', 'pay', 'play', 'stay'],
    ],
    'scramble': ['rain', 'trail', 'paint', 'play', 'stay', 'train'],
    'feed': ['rain', 'wait', 'trail', 'paint', 'day', 'play', 'stay', 'hay'],
    'sentences': [
        S('Rain hits the trail. Zip and Frill wait.'),
        S('The paint on the cart runs in the rain.'),
        S('They stay on the trail till the sun is back.'),
        S('A ray of sun hits the bay.'),
        S('Zip and Frill play in the bay.'),
        S('They paint the cart. The day is fair.'),
    ],
    'fishLabel': 'has ai or ay',
    'fishYes': ['rain', 'wait', 'trail', 'day', 'play', 'hay'],
    'fishNo': ['ran', 'wet', 'trip', 'den', 'plan', 'had'],
    'bins': [{'id': 'ain', 'label': '-ain'}, {'id': 'ay', 'label': '-ay'}, {'id': 'ail', 'label': '-ail'}],
    'whichChoices': ['ai', 'ay'],
    'whichLabel': 'Tap the team.',
    'which': [
        which('rain', 'ai'), which('day', 'ay'), which('wait', 'ai'),
        which('play', 'ay'), which('trail', 'ai'), which('stay', 'ay'),
        which('paint', 'ai'), which('hay', 'ay'),
    ],
    'rhyme': [
        rhyme('rain', 'pain', 'ran', 'rid'),
        rhyme('day', 'play', 'den', 'did'),
        rhyme('wait', 'bait', 'wet', 'wit'),
        rhyme('trail', 'mail', 'trot', 'trim'),
        rhyme('stay', 'way', 'step', 'stop'),
        rhyme('bay', 'hay', 'bag', 'hit'),
    ],
    'sort': [
        sort('rain', 'ain'), sort('day', 'ay'), sort('trail', 'ail'),
        sort('play', 'ay'), sort('pain', 'ain'), sort('mail', 'ail'),
        sort('stay', 'ay'), sort('train', 'ain'), sort('hay', 'ay'),
        sort('wait', 'ain'),
    ],
    'check': [
        check('rain', 'ran', 'rid'), check('wait', 'wet', 'wit'),
        check('trail', 'trot', 'trim'), check('paint', 'pant', 'pat'),
        check('train', 'trap', 'trot'), check('day', 'den', 'did'),
        check('play', 'plan', 'plop'), check('stay', 'step', 'stop'),
        check('hay', 'had', 'hit'), check('bay', 'bag', 'bit'),
    ],
    'heart': [{'w': 'says', 'part': 'ay'}],
    'newWords': [],
    'pics': ['rain', 'train', 'paint', 'hay', 'bay'],
    'bellExtra': ['pain', 'faint', 'pay', 'way', 'ray', 'mail', 'bait', 'ran', 'plan'],
    'story': [
        S('Rain hits the trail. Zip and Frill wait.'),
        S('The paint on the cart runs in the rain.'),
        S('They stay on the trail till the sun is back.'),
        S('A ray of sun hits the bay. The rain stops.'),
        S('Zip and Frill play in the bay. The paint is a mess.'),
        S('They stay and paint the cart again. Frill says the day is fair.'),
    ],
    'dayPlan': [
        day('Day 1', 'ai', 'ai says the long a sound in the middle of a word. Rain, wait, and trail.',
            ['rain', 'wait', 'pain', 'trail'], ['paint', 'train', 'mail', 'bait'],
            ['rain', 'wait', 'trail', 'paint', 'train', 'pain'],
            ['rain', 'wait', 'pain', 'mail'],
            ['ran', 'rain', 'wet', 'wait', 'trip', 'trail'],
            [['-ain', ['rain', 'pain', 'train']], ['-ail', ['trail', 'mail']]]),
        day('Day 2', 'ay', 'ay says the long a sound at the end. Day, play, stay, and way.',
            ['day', 'play', 'stay', 'way'], ['pay', 'hay', 'bay', 'ray'],
            ['day', 'play', 'stay', 'way', 'hay', 'bay'],
            ['day', 'play', 'stay', 'hay'],
            ['den', 'day', 'plan', 'play', 'step', 'stay'],
            [['-ay', ['day', 'play', 'stay', 'way', 'hay']]]),
        day('Day 3', 'ai and ay', 'Mix ai and ay. Same long a sound. ai in the middle, ay at the end.',
            ['rain', 'day', 'trail', 'play'], ['paint', 'stay', 'train', 'hay'],
            ['rain', 'day', 'wait', 'play', 'trail', 'stay', 'paint', 'way'],
            ['rain', 'day', 'trail', 'play'],
            ['ran', 'rain', 'den', 'day', 'had', 'hay', 'wet', 'wait'],
            [['-ain', ['rain', 'pain']], ['-ay', ['day', 'play', 'stay']], ['-ail', ['trail', 'mail']]]),
    ],
})

add({
    'key': 'u112', 'n': '11.2', 'unit': 11, 'name': 'ee, ea, ey',
    'storyTitle': 'The Key and the Bee',
    'blurb': 'ee, ea, and ey can say the long e sound. ee as in bee, ea as in beach, ey as in key.',
    'focus': ['ee', 'ea', 'ey'], 'focusKind': 'pattern', 'vowels': 'aeiou',
    'label': 'ee, ea, ey', 'keyword': 'bee, beach, key',
    'rec': [],
    'days': ['ee', 'ea', 'ey and review'],
    'meet': [
        meet('zip', 'u112_m1', 'bee', ['bee', 'see', 'tree', 'seed'],
             'ee says the long e sound.',
             'Bee. See. Tree. The team ee says the long e sound.'),
        meet('frill', 'u112_m2', 'beach', ['beach', 'leaf', 'tea', 'cream'],
             'ea can say the long e sound too.',
             'Beach. Leaf. Tea. Cream. The team ea can say the long e sound.'),
        meet('zip', 'u112_m3', 'key', ['key', 'donkey', 'honey', 'money'],
             'ey can say the long e sound at the end.',
             'Key. Donkey. Honey. Money. At the end, ey can say the long e sound.'),
    ],
    'chant': [
        'See the bee in the tree.',
        'A key, a key, a key.',
        'Cream and tea at the beach.',
        'Reach, reach, reach.',
    ],
    'hear': [
        hear('bee', 'bed', 'bay'), hear('tree', 'trip', 'tray'),
        hear('see', 'set', 'say'), hear('seed', 'send', 'sand'),
        hear('beach', 'bench', 'bead'), hear('leaf', 'left', 'let'),
        hear('tea', 'ten', 'tap'), hear('key', 'keep', 'kit'),
    ],
    'build': [
        build('bee', 'b', 'ee', 's', 'ea'),
        build('tree', 'tr', 'ee', 'b', 'each'),
        build('beach', 'b', 'each', 't', 'ee'),
        build('leaf', 'l', 'eaf', 'k', 'ey'),
        build('key', 'k', 'ey', 's', 'ee'),
        build('tea', 't', 'ea', 'b', 'ee'),
    ],
    'chains': [
        ['bee', 'see', 'seed', 'weed'],
        ['tea', 'team', 'beam', 'beach'],
    ],
    'scramble': ['tree', 'beach', 'leaf', 'cream', 'key', 'seed'],
    'feed': ['bee', 'tree', 'see', 'beach', 'leaf', 'tea', 'cream', 'key'],
    'sentences': [
        S('A key sits up in the tree. Frill sees it.'),
        S('A bee is on the leaf. Zip can not reach the key.'),
        S('The bee zips to the beach.'),
        S('The key drops in the sand. Frill grabs it.'),
        S('The key fits a green box of cream and tea.'),
        S('The stick will not break. They eat the cream.'),
    ],
    'fishLabel': 'has the long e team',
    'fishYes': ['bee', 'tree', 'beach', 'leaf', 'tea', 'key'],
    'fishNo': ['bed', 'trip', 'left', 'ten', 'red', 'pen'],
    'bins': [{'id': 'long', 'label': 'long e'}, {'id': 'short', 'label': 'short e'}],
    'whichChoices': ['ee', 'ea', 'ey'],
    'whichLabel': 'Tap the team.',
    'which': [
        which('bee', 'ee'), which('beach', 'ea'), which('key', 'ey'),
        which('tree', 'ee'), which('leaf', 'ea'), which('honey', 'ey'),
        which('seed', 'ee'), which('cream', 'ea'),
    ],
    'rhyme': [
        rhyme('bee', 'see', 'bed', 'bay'),
        rhyme('tree', 'see', 'trip', 'tray'),
        rhyme('tea', 'sea', 'ten', 'tap'),
        rhyme('key', 'see', 'kit', 'keep'),
        rhyme('beach', 'reach', 'bench', 'batch'),
        rhyme('leaf', 'sheaf', 'left', 'loaf'),
    ],
    'sort': [
        sort('tree', 'long'), sort('bed', 'short'), sort('beach', 'long'),
        sort('red', 'short'), sort('key', 'long'), sort('ten', 'short'),
        sort('seed', 'long'), sort('pen', 'short'), sort('cream', 'long'),
        sort('met', 'short'), sort('leaf', 'long'), sort('leg', 'short'),
    ],
    'check': [
        check('bee', 'bed', 'bay'), check('tree', 'trip', 'tray'),
        check('see', 'set', 'say'), check('beach', 'bench', 'bead'),
        check('leaf', 'left', 'let'), check('tea', 'ten', 'tap'),
        check('cream', 'crept', 'cram'), check('key', 'kit', 'keep'),
        check('honey', 'hop', 'hunt'), check('reach', 'rich', 'ranch'),
    ],
    'heart': [{'w': 'break', 'part': 'ea'}],
    'newWords': [],
    'pics': ['bee', 'tree', 'key', 'leaf', 'beach', 'tea'],
    'bellExtra': ['seed', 'weed', 'reach', 'team', 'beam', 'sea', 'honey', 'money', 'green', 'eat'],
    'story': [
        S('A key sits up in the tree. Frill sees it.'),
        S('A bee is on the leaf. Zip can not reach the key.'),
        S('A donkey is on the beach. The bee zips past it.'),
        S('The key drops in the sand. Frill grabs it.'),
        S('The key fits a green box of cream and tea.'),
        S('The stick will not break. The box pops. They eat the cream.'),
    ],
    'dayPlan': [
        day('Day 1', 'ee', 'ee says the long e sound. Bee, see, tree, and seed.',
            ['bee', 'see', 'tree', 'seed'], ['weed', 'green', 'see', 'bee'],
            ['bee', 'see', 'tree', 'seed', 'weed', 'green'],
            ['bee', 'see', 'tree', 'seed'],
            ['bed', 'bee', 'set', 'see', 'trip', 'tree'],
            [['-ee', ['bee', 'see', 'tree', 'seed']]]),
        day('Day 2', 'ea', 'ea can say the long e sound. Beach, leaf, tea, and cream.',
            ['beach', 'leaf', 'tea', 'cream'], ['reach', 'eat', 'team', 'sea'],
            ['beach', 'leaf', 'tea', 'cream', 'reach', 'eat'],
            ['beach', 'leaf', 'tea', 'cream'],
            ['bench', 'beach', 'left', 'leaf', 'ten', 'tea'],
            [['-ea', ['beach', 'leaf', 'tea', 'cream', 'reach']]]),
        day('Day 3', 'ey and review', 'ey can say the long e sound at the end, as in key. Then mix ee, ea, and ey.',
            ['key', 'honey', 'money', 'donkey'], ['bee', 'beach', 'key', 'tree'],
            ['key', 'honey', 'bee', 'leaf', 'tea', 'see', 'cream', 'money'],
            ['key', 'honey', 'see', 'beach'],
            ['bed', 'bee', 'ten', 'tea', 'red', 'reach', 'pen', 'key'],
            [['-ee', ['bee', 'see', 'tree']], ['-ea', ['tea', 'leaf']], ['-ey', ['key', 'honey']]]),
    ],
})

# sheaf may be unfamiliar. Keep it as a rhyme distractor only if it's a real word - it is, but kids may not know it.
# It's a wrong choice so they shouldn't need to have learned it as a pattern word. Still, an unknown word in a choice
# can confuse. Swap sheaf for leap? leap is ea. leaf rhymes with sheaf only. Rhymes of leaf: sheaf is the main one.
# Use beef? beef doesn't rhyme with leaf. "leaf" rhymes with "sheaf". I'll change the rhyme prompt to team/beam/dream.
LESSONS[-1]['rhyme'][5] = rhyme('team', 'beam', 'ten', 'tam')

add({
    'key': 'u121', 'n': '12.1', 'unit': 12, 'name': 'oa, oe',
    'storyTitle': 'Toast on the Boat',
    'blurb': 'oa and oe say the long o sound. oa as in boat. oe as in toe.',
    'focus': ['oa', 'oe'], 'focusKind': 'pattern', 'vowels': 'aeiou',
    'label': 'oa, oe', 'keyword': 'boat, toe',
    'rec': [],
    'days': ['oa', 'oe', 'Mix oa and oe'],
    'meet': [
        meet('zip', 'u121_m1', 'boat', ['boat', 'toad', 'coat', 'soap'],
             'oa says the long o sound.',
             'Boat. Toad. Coat. The team oa says the long o sound.'),
        meet('frill', 'u121_m2', 'toast', ['toast', 'soap', 'float', 'road'],
             'Keep the long o sound in the middle.',
             'Toast. Soap. Float. Road. oa sits in the middle and says the long o sound.'),
        meet('zip', 'u121_m3', 'toe', ['toe', 'hoe', 'Joe', 'foe'],
             'oe says the long o sound at the end.',
             'Toe. Hoe. At the end, oe says the long o sound, the same sound as oa.'),
    ],
    'chant': [
        'A toad in a boat,',
        'toast and a coat.',
        'Soap on a toe.',
        'Off they float.',
    ],
    'hear': [
        hear('boat', 'bat', 'bit'), hear('toad', 'top', 'tap'),
        hear('coat', 'cat', 'cot'), hear('soap', 'sop', 'sip'),
        hear('toast', 'test', 'toss'), hear('float', 'flat', 'flit'),
        hear('toe', 'top', 'tie'), hear('hoe', 'hop', 'hay'),
    ],
    'build': [
        build('boat', 'b', 'oat', 't', 'oe'),
        build('coat', 'c', 'oat', 'g', 'oat'),
        build('toad', 't', 'oad', 'r', 'oad'),
        build('road', 'r', 'oad', 't', 'oat'),
        build('toe', 't', 'oe', 'h', 'oe'),
        build('hoe', 'h', 'oe', 't', 'oad'),
    ],
    'chains': [
        ['boat', 'coat', 'goat', 'moat'],
        ['toad', 'road', 'load', 'toad'],
    ],
    'scramble': ['boat', 'toast', 'float', 'soap', 'toad', 'coat'],
    'feed': ['boat', 'toad', 'coat', 'soap', 'toast', 'float', 'toe', 'road'],
    'sentences': [
        S('Zip loads a boat with toast, a coat, and soap.'),
        S('A toad hops in and sits on the coat.'),
        S('The boat floats off the dock. The toad will not hop off.'),
        S('The boat hits a rock. Toast drops on the toe.'),
        S('Frill has a hoe on the boat.'),
        S('The toad hops to shore. Zip and Frill eat the toast.'),
    ],
    'fishLabel': 'has oa or oe',
    'fishYes': ['boat', 'toad', 'coat', 'soap', 'toast', 'toe'],
    'fishNo': ['bat', 'top', 'cot', 'hop', 'rock', 'dock'],
    'bins': [{'id': 'oat', 'label': '-oat'}, {'id': 'oad', 'label': '-oad'}, {'id': 'oe', 'label': '-oe'}],
    'whichChoices': ['oa', 'oe'],
    'whichLabel': 'Tap the team.',
    'which': [
        which('boat', 'oa'), which('toe', 'oe'), which('toad', 'oa'),
        which('hoe', 'oe'), which('coat', 'oa'), which('soap', 'oa'),
        which('road', 'oa'), which('toe', 'oe'),
    ],
    'rhyme': [
        rhyme('boat', 'coat', 'bat', 'bit'),
        rhyme('toad', 'road', 'top', 'tap'),
        rhyme('soap', 'hope', 'sop', 'sip'),
        rhyme('toe', 'hoe', 'top', 'tie'),
        rhyme('float', 'boat', 'flat', 'flit'),
        rhyme('goat', 'coat', 'got', 'get'),
    ],
    'sort': [
        sort('boat', 'oat'), sort('toad', 'oad'), sort('toe', 'oe'),
        sort('road', 'oad'), sort('coat', 'oat'), sort('hoe', 'oe'),
        sort('goat', 'oat'), sort('load', 'oad'), sort('float', 'oat'),
        sort('soap', 'oad'),
    ],
    'check': [
        check('boat', 'bat', 'bit'), check('toad', 'top', 'tap'),
        check('coat', 'cat', 'cot'), check('soap', 'sop', 'sip'),
        check('toast', 'test', 'toss'), check('float', 'flat', 'flit'),
        check('road', 'rod', 'rid'), check('goat', 'got', 'get'),
        check('toe', 'top', 'tie'), check('hoe', 'hop', 'hay'),
    ],
    'heart': [{'w': 'shoe', 'part': 'oe'}],
    'newWords': [],
    'pics': ['boat', 'toad', 'coat', 'soap', 'toast', 'toe', 'hoe', 'Joe', 'foe', 'doe', 'woe', 'float', 'road', 'goat', 'load', 'moat'],
    'bellExtra': ['goat', 'moat', 'load', 'float', 'road', 'hoe', 'dock', 'rock'],
    'story': [
        S('Zip loads a boat with toast, a coat, and soap.'),
        S('A toad hops in and sits on the coat.'),
        S('The boat floats off the dock. The toad will not hop off.'),
        S('The boat hits a rock. Toast drops on the toe.'),
        S('Frill has a hoe on the boat. The hoe helps them get in.'),
        S('The toad hops to shore. Zip has a wet shoe. They eat the toast.'),
    ],
    'dayPlan': [
        day('Day 1', 'oa', 'oa says the long o sound. Boat, toad, coat, and soap.',
            ['boat', 'toad', 'coat', 'soap'], ['toast', 'float', 'road', 'goat'],
            ['boat', 'toad', 'coat', 'soap', 'toast', 'road'],
            ['boat', 'toad', 'coat', 'road'],
            ['bat', 'boat', 'top', 'toad', 'cot', 'coat'],
            [['-oat', ['boat', 'coat', 'goat']], ['-oad', ['toad', 'road']]]),
        day('Day 2', 'oe', 'oe says the long o sound at the end. Toe, hoe, Joe, and foe.',
            ['toe', 'hoe', 'Joe', 'foe'], ['toe', 'hoe', 'doe', 'woe'],
            ['toe', 'hoe', 'Joe', 'foe', 'doe', 'woe'],
            ['toe', 'hoe', 'Joe', 'foe'],
            ['toe', 'hoe', 'Joe', 'foe', 'doe', 'woe'],
            [['-oe', ['toe', 'hoe', 'Joe', 'foe', 'doe', 'woe']]]),
        day('Day 3', 'oa and oe', 'Mix oa and oe. Same long o sound.',
            ['boat', 'toe', 'toast', 'hoe'], ['coat', 'toad', 'float', 'road'],
            ['boat', 'toe', 'coat', 'hoe', 'toast', 'road', 'soap', 'float'],
            ['boat', 'toe', 'road', 'hoe'],
            ['bat', 'boat', 'top', 'toe', 'hop', 'hoe', 'rod', 'road'],
            [['-oat', ['boat', 'coat', 'float']], ['-oad', ['toad', 'road']], ['-oe', ['toe', 'hoe']]]),
    ],
})

# soap sorted into -oad is WRONG. soap is oa but not -oad or -oat (soap ends with p). Fix sort.
# soap = s oa p, family -oap. Add bin or put soap only in games not in the oat/oad sort.
# I'll fix sort to not include soap in -oad.
LESSONS[-1]['sort'][9] = sort('float', 'oat')
# last was soap in oad, I replaced with a duplicate float. Use moat instead.
LESSONS[-1]['sort'][9] = sort('moat', 'oat')
# chains second chain toad road load toad repeats toad. Change end to a different word. load -> loaf is wrong.
# goat is oat not oad. Keep load and use "load" only once: toad, road, load. Need 4. "toad, road" then what?
# foal is oa. "toad, load" . Add "goad"? obscure.
# Chain: boat, coat, goat, moat is good. Second: soap is hard. Use float, boat, coat, goat - overlaps.
# Second chain of one-grapheme changes: toad (t,oa,d) road (r,oa,d) - first letter changes. load (l,oa,d). 
# Need a fourth: woad is obscure. I'll use 3-word chain by padding with "toad" removed.
# The JS chain needs at least 2. 3 is OK. Let me set ['toad', 'road', 'load', 'goad'] - goad is rare.
# I'll use ['toad', 'road', 'load'] and add a dummy by repeating structure with moat chain only plus
# ['soap', 'soak'] soak is oa. soap (s,oa,p) soak (s,oa,k) one change. Then boat? 
# soap, soak, boat is two changes. soap -> soak -> cloak? cloak is c,l,oa,k. 
# Keep ['soap', 'soak'] too short for a fun chain. ['toad', 'road', 'load', 'toad'] is a loop and the chain game
# may not like repeated word. I'll use oak words: oak is oa+k? o-a-k the focus oa is in oak. oak = oa, k.
# boat = b, oa, t. Not one step from oak.
# I'll leave ['toad', 'road', 'load', 'goad'] and include goad in bellExtra. It's a real word (to goad). A bit odd for kids.
# Better fourth: "coal" c,oa,l and "goal" g,oa,l. Chain: coal, goal, goat, coat.
# coal (c,oa,l) goal (g,oa,l) one change. goal (g,oa,l) goat (g,oa,t) one change. goat (g,oa,t) coat (c,oa,t) one change.
LESSONS[-1]['chains'][1] = ['coal', 'goal', 'goat', 'coat']
LESSONS[-1]['bellExtra'] = ['hop', 'rod', 'goat', 'moat', 'load', 'float', 'road', 'hoe', 'coal', 'goal', 'soak', 'dock', 'rock']

add({
    'key': 'u122', 'n': '12.2', 'unit': 12, 'name': 'ow',
    'storyTitle': 'The Low Rowboat',
    'blurb': 'ow says the long o sound in snow and row. This is not the sound in cow. That sound comes later.',
    'focus': ['ow'], 'focusKind': 'pattern', 'vowels': 'aeiou',
    'label': 'ow as in snow', 'keyword': 'snow, row',
    'rec': [],
    'days': ['ow as in snow', 'ow word families', 'Long o and short o'],
    'meet': [
        meet('zip', 'u122_m1', 'snow', ['snow', 'row', 'low', 'glow'],
             'ow says the long o sound.',
             'Snow. Row. Low. This ow says the long o sound, as in snow.'),
        meet('frill', 'u122_m2', 'glow', ['glow', 'slow', 'show', 'grow'],
             'The long o sound stays.',
             'Glow. Slow. Show. Grow. ow says the long o sound in each word.'),
        meet('zip', 'u122_m3', 'boat', ['boat', 'snow', 'toe', 'row'],
             'oa, oe, and this ow all say the long o sound.',
             'Boat. Snow. Toe. Row. Three spellings can say the long o sound.'),
    ],
    'chant': [
        'Row, row, slow.',
        'Yellow glow.',
        'Low in the bay,',
        'row, row, away.',
    ],
    'hear': [
        hear('snow', 'snap', 'snip'), hear('row', 'rob', 'rib'),
        hear('low', 'lot', 'let'), hear('slow', 'slip', 'slap'),
        hear('glow', 'glad', 'glob'), hear('show', 'shop', 'ship'),
        hear('grow', 'grab', 'grip'), hear('own', 'on', 'in'),
    ],
    'build': [
        build('snow', 'sn', 'ow', 'r', 'oa'),
        build('row', 'r', 'ow', 'l', 'ow'),
        build('slow', 'sl', 'ow', 'gl', 'ow'),
        build('glow', 'gl', 'ow', 'sh', 'ow'),
        build('show', 'sh', 'ow', 'gr', 'ow'),
        build('grow', 'gr', 'ow', 'sn', 'ow'),
    ],
    'chains': [
        ['row', 'low', 'grow', 'glow'],
        ['snow', 'show', 'slow', 'blow'],
    ],
    'scramble': ['snow', 'slow', 'glow', 'show', 'grow', 'yellow'],
    'feed': ['snow', 'row', 'low', 'slow', 'glow', 'show', 'grow', 'own'],
    'sentences': [
        S('The yellow rowboat sits low in the bay.'),
        S('A hole lets the bay in. The boat is slow.'),
        S('A yellow glow shows the hole.'),
        S('Zip and Frill row to shore. The boat stays low.'),
        S('They own a plan. They tip the boat and patch the hole.'),
        S('The rowboat can float. It glows as they row.'),
    ],
    'fishLabel': 'has ow as in snow',
    'fishYes': ['snow', 'row', 'low', 'slow', 'glow', 'show'],
    'fishNo': ['boat', 'toad', 'coat', 'pot', 'hot', 'top'],
    'bins': [{'id': 'long', 'label': 'long o'}, {'id': 'short', 'label': 'short o'}],
    'whichChoices': ['ow', 'oa', 'oe'],
    'whichLabel': 'Tap the team.',
    'which': [
        which('snow', 'ow'), which('boat', 'oa'), which('toe', 'oe'),
        which('row', 'ow'), which('coat', 'oa'), which('hoe', 'oe'),
        which('glow', 'ow'), which('road', 'oa'),
    ],
    'rhyme': [
        rhyme('snow', 'row', 'snap', 'snip'),
        rhyme('low', 'glow', 'lot', 'let'),
        rhyme('show', 'grow', 'shop', 'ship'),
        rhyme('slow', 'blow', 'slip', 'slap'),
        rhyme('row', 'low', 'rob', 'rib'),
        rhyme('own', 'shown', 'on', 'in'),
    ],
    'sort': [
        sort('snow', 'long'), sort('pot', 'short'), sort('boat', 'long'),
        sort('hot', 'short'), sort('row', 'long'), sort('box', 'short'),
        sort('toe', 'long'), sort('top', 'short'), sort('glow', 'long'),
        sort('mop', 'short'), sort('coat', 'long'), sort('rock', 'short'),
    ],
    'check': [
        check('snow', 'snap', 'snip'), check('row', 'rob', 'rib'),
        check('low', 'lot', 'let'), check('slow', 'slip', 'slap'),
        check('glow', 'glad', 'glob'), check('show', 'shop', 'ship'),
        check('grow', 'grab', 'grip'), check('own', 'on', 'in'),
        check('blow', 'blot', 'blip'), check('yellow', 'yell', 'yelp'),
    ],
    'heart': [],
    'newWords': [],
    'pics': ['snow', 'rowboat', 'glow', 'bowl', 'pillow'],
    'bellExtra': ['blow', 'shown', 'yellow', 'window', 'bowl', 'pillow', 'own', 'pot', 'hot', 'top'],
    'story': [
        S('The yellow rowboat sits low in the bay.'),
        S('A hole lets the bay in. The boat is slow to float.'),
        S('A yellow glow shows the hole. Zip can see it.'),
        S('Zip and Frill row to shore. The boat stays low.'),
        S('They own a slow plan. They patch the hole.'),
        S('The rowboat can float. It glows in the sun as they row.'),
    ],
    'dayPlan': [
        day('Day 1', 'ow', 'This ow says the long o sound, as in snow. Row, low, and glow use it too. This is not the sound in cow.',
            ['snow', 'row', 'low', 'glow'], ['slow', 'show', 'grow', 'blow'],
            ['snow', 'row', 'low', 'slow', 'glow', 'show'],
            ['snow', 'row', 'low', 'glow'],
            ['snap', 'snow', 'rob', 'row', 'lot', 'low'],
            [['-ow', ['snow', 'row', 'low', 'glow', 'show']]]),
        day('Day 2', 'ow families', 'Keep ow. Change the sounds in front. Snow, show, slow, and blow.',
            ['show', 'slow', 'grow', 'blow'], ['own', 'shown', 'yellow', 'window'],
            ['show', 'slow', 'grow', 'blow', 'own', 'yellow'],
            ['show', 'slow', 'blow', 'own'],
            ['shop', 'show', 'slip', 'slow', 'on', 'own'],
            [['-ow', ['show', 'slow', 'grow', 'blow']], ['-own', ['own', 'shown']]]),
        day('Day 3', 'long o and short o', 'Sort long o and short o. The long o words are mixed in. oa, oe, and ow can all say the long o sound.',
            ['snow', 'boat', 'toe', 'row'], ['pot', 'glow', 'hot', 'coat'],
            ['snow', 'pot', 'boat', 'hot', 'row', 'top', 'toe', 'glow'],
            ['snow', 'boat', 'row', 'toe'],
            ['pot', 'snow', 'hot', 'boat', 'top', 'toe', 'mop', 'row'],
            [['long o', ['snow', 'boat', 'toe', 'row']], ['short o', ['pot', 'hot', 'top', 'mop']]]),
    ],
})

# row -> low -> grow is NOT one grapheme. row = r, ow. low = l, ow. OK one change.
# low = l, ow. grow = g, r, ow. That ADDS g and changes l to r. Two changes. Fix chain.
# row, low, bow, mow? mow is ok. bow can be two sounds. Avoid bow.
# row, low, sow, mow. sow might be confused with sew. Use: row, low, flow, glow.
# row (r,ow) low (l,ow) OK. low (l,ow) flow (f,l,ow) ADDS f. Not one change.
# glow (g,l,ow) slow (s,l,ow) one change. slow (s,l,ow) show (sh,ow) not one slot.
# Best chain of 2-part words: row, low, mow, tow.
# tow is a real word. mow too.
LESSONS[-1]['chains'][0] = ['row', 'low', 'mow', 'tow']
LESSONS[-1]['chains'][1] = ['snow', 'show', 'slow', 'glow']
# snow (s,n,ow) show (sh,ow) NOT one change. 
# glow (g,l,ow) slow (s,l,ow) one change (g/s).
# blow (b,l,ow) glow (g,l,ow) one. slow (s,l,ow) blow (b,l,ow) one.
LESSONS[-1]['chains'][1] = ['glow', 'slow', 'blow', 'flow']
LESSONS[-1]['bellExtra'] = ['blow', 'flow', 'mow', 'tow', 'shown', 'yellow', 'window', 'bowl', 'pillow', 'own', 'pot', 'hot']

# show in chain 1 was removed. show still in other lists. Good.
# snow -> ? snow (sn, ow) if sn is not a grapheme, split is s, n, ow.
# show is sh, ow. Different structure.
# Second chain glow, slow, blow, flow all end with l, ow except they are 3 graphemes: g,l,ow / s,l,ow / b,l,ow / f,l,ow. One change each. Good.

add({
    'key': 'u123', 'n': '12.3', 'unit': 12, 'name': 'ie, igh',
    'storyTitle': 'The Bright Night Pie',
    'blurb': 'ie and igh say the long i sound. ie as in pie. igh as in night.',
    'focus': ['igh', 'ie'], 'focusKind': 'pattern', 'vowels': 'aeiou',
    'label': 'ie, igh', 'keyword': 'pie, night',
    'rec': ['ie'],
    'days': ['igh', 'ie', 'Review long i and the unit'],
    'meet': [
        meet('zip', 'u123_m1', 'night', ['night', 'light', 'right', 'high'],
             'igh says the long i sound.',
             'Night. Light. Right. The team igh says the long i sound.'),
        meet('frill', 'u123_m2', 'pie', ['pie', 'tie', 'lie', 'night'],
             'ie says the long i sound at the end.',
             'Pie. Tie. Lie. At the end, ie says the long i sound.'),
        meet('zip', 'u123_m3', 'bright', ['bright', 'high', 'sight', 'pie'],
             'Same long i sound. Two teams.',
             'Bright. High. Sight. Pie. igh and ie say the long i sound.'),
    ],
    'chant': [
        'Night, light, bright.',
        'Tie the tin up high.',
        'The path is right.',
        'They eat the pie.',
    ],
    'hear': [
        hear('night', 'net', 'not'), hear('light', 'let', 'lot'),
        hear('right', 'rest', 'rot'), hear('bright', 'brat', 'brought'),
        hear('high', 'hug', 'hag'), hear('sight', 'sit', 'set'),
        hear('pie', 'pit', 'pay'), hear('tie', 'tip', 'top'),
    ],
    'build': [
        build('night', 'n', 'ight', 'l', 'ight'),
        build('light', 'l', 'ight', 'r', 'ight'),
        build('right', 'r', 'ight', 's', 'ight'),
        build('sight', 's', 'ight', 'n', 'ight'),
        build('pie', 'p', 'ie', 't', 'ie'),
        build('tie', 't', 'ie', 'l', 'ie'),
    ],
    'chains': [
        ['night', 'light', 'right', 'sight'],
        ['pie', 'tie', 'lie'],
    ],
    'scramble': ['night', 'light', 'bright', 'right', 'pie', 'sight'],
    'feed': ['night', 'light', 'right', 'bright', 'high', 'pie', 'tie', 'sight'],
    'sentences': [
        S('At night the path is not bright.'),
        S('Zip and Frill might trip.'),
        S('Frill ties a pie tin up high on a stick.'),
        S('A lamp hits the tin. The path is bright.'),
        S('They see the right trail. The light is high.'),
        S('Zip and Frill eat the pie. The night feels right.'),
    ],
    'fishLabel': 'has ie or igh',
    'fishYes': ['night', 'light', 'right', 'pie', 'tie', 'high'],
    'fishNo': ['net', 'let', 'pit', 'boat', 'rain', 'see'],
    'bins': [{'id': 'ight', 'label': '-ight'}, {'id': 'ie', 'label': '-ie'}],
    'whichChoices': ['igh', 'ie'],
    'whichLabel': 'Tap the team.',
    'which': [
        which('night', 'igh'), which('pie', 'ie'), which('light', 'igh'),
        which('tie', 'ie'), which('right', 'igh'), which('lie', 'ie'),
        which('high', 'igh'), which('bright', 'igh'),
    ],
    'rhyme': [
        rhyme('night', 'light', 'net', 'not'),
        rhyme('right', 'sight', 'rest', 'rot'),
        rhyme('pie', 'tie', 'pit', 'pay'),
        rhyme('high', 'sigh', 'hug', 'hag'),
        rhyme('bright', 'light', 'brat', 'bat'),
        rhyme('tie', 'lie', 'tip', 'top'),
    ],
    'sort': [
        sort('night', 'ight'), sort('pie', 'ie'), sort('light', 'ight'),
        sort('tie', 'ie'), sort('right', 'ight'), sort('lie', 'ie'),
        sort('sight', 'ight'), sort('pie', 'ie'), sort('bright', 'ight'),
        sort('high', 'ight'),
    ],
    'check': [
        check('night', 'net', 'not'), check('light', 'let', 'lot'),
        check('right', 'rest', 'rot'), check('bright', 'brat', 'bat'),
        check('high', 'hug', 'hag'), check('sight', 'sit', 'set'),
        check('might', 'met', 'mat'), check('pie', 'pit', 'pay'),
        check('tie', 'tip', 'top'), check('lie', 'lip', 'lap'),
    ],
    'heart': [],
    'newWords': [],
    'pics': ['pie', 'night', 'light', 'tie'],
    'bellExtra': ['might', 'sigh', 'tight', 'flight', 'lie', 'high', 'sight'],
    'story': [
        S('At night the path is not bright. Zip and Frill might trip.'),
        S('Frill ties a pie tin up high on a stick.'),
        S('A lamp hits the tin. The path is bright.'),
        S('They see the right trail. The light is high.'),
        S('A pie sits on the trail. It is still bright and hot.'),
        S('Zip and Frill eat the pie. The tin is up high.'),
    ],
    'dayPlan': [
        day('Day 1', 'igh', 'igh says the long i sound. Night, light, right, and high.',
            ['night', 'light', 'right', 'high'], ['bright', 'sight', 'might', 'tight'],
            ['night', 'light', 'right', 'bright', 'sight', 'high'],
            ['night', 'light', 'right', 'sight'],
            ['net', 'night', 'let', 'light', 'sit', 'sight'],
            [['-ight', ['night', 'light', 'right', 'sight', 'bright']]]),
        day('Day 2', 'ie', 'ie says the long i sound at the end. Pie, tie, and lie.',
            ['pie', 'tie', 'lie'], ['pie', 'night', 'tie', 'light'],
            ['pie', 'tie', 'lie', 'night', 'light'],
            ['pie', 'tie', 'lie', 'night'],
            ['pit', 'pie', 'tip', 'tie', 'lip', 'lie'],
            [['-ie', ['pie', 'tie', 'lie']], ['-ight', ['night', 'light']]]),
        day('Day 3', 'Review', 'Review ie and igh, then the long o teams from this unit. The story is The Bright Night Pie.',
            ['night', 'pie', 'snow', 'boat'], ['light', 'tie', 'row', 'toe'],
            ['night', 'pie', 'light', 'tie', 'bright', 'high', 'sight', 'right'],
            ['night', 'pie', 'light', 'tie'],
            ['net', 'night', 'pit', 'pie', 'pot', 'boat', 'lot', 'light'],
            [['-ight', ['night', 'light', 'right']], ['-ie', ['pie', 'tie']]]),
    ],
})

# brought is an untaught pattern as a distractor. A child might be asked to consider it.
# It's a wrong choice in hear, so they see the word. "brought" has ough (unit 16). Avoid showing it.
LESSONS[-1]['hear'][3] = hear('bright', 'brat', 'bat')

# Duplicate pie in sort is ok? The sort game will ask pie twice. That's a bit dull but valid.
# Change second pie to lie already there. Use flight.
LESSONS[-1]['sort'][7] = sort('flight', 'ight')

# high sorted as ight: high is h+igh, not -ight (no t). The bin is labeled -ight.
# high does not end with ight. Move high out of that bin. Use tight.
LESSONS[-1]['sort'][9] = sort('tight', 'ight')

# which has high with part igh. That's correct for the which game, not the -ight family bin. Good.

# Chain row/low/mow/tow: split row = r, ow and low = l, ow. One change. low to mow = l to m. mow to tow = m to t. Good.

# glow/slow/blow/flow: g,l,ow vs s,l,ow. One change. Good.

# fair/hair/pair/chair: f,air / h,air / p,air / ch,air. pair to chair is p vs ch. One slot. Good.

# care/dare/rare/mare: c,are / d,are / r,are / m,are. Good.

# hear/near/fear/gear: h,ear / n,ear / f,ear / g,ear. Good.
# Second chain ear, year, fear, clear:
# ear = ear (1 part)
# year = y, ear (2)
# fear = f, ear
# clear = c, l, ear (3)
# ear -> year adds y. The chain code uses changedAt on the split arrays.
# If lengths differ, changedAt returns the first index that differs.
# ear [ear] vs year [y, ear]: index 0 differs (ear vs y). The "need" is y, but the word also has a second part.
# That chain is messy. Replace with hear, near, fear, year.
LESSONS[1]['chains'][1] = ['clear', 'fear', 'gear', 'year']
# clear = c, l, ear (3). fear = f, ear (2). NOT a clean one-part change.
# Use hear, near, fear, year. All are C + ear except year is y+ear. hear h+ear, near n+ear, fear f+ear, year y+ear. All 2 parts. Good.
LESSONS[1]['chains'][1] = ['hear', 'near', 'fear', 'year']
# First chain is also hear, near, fear, gear. Duplicate start. Change first to beard? beard is b, ear, d (3 parts).
# gear, fear, near, hear is the reverse of the second. Use smear, spear? 
# clear is 3 parts. Skip clear in chains.
# Chain 1: gear, fear, near, hear
# Chain 2: year, fear, gear, near
LESSONS[1]['chains'][0] = ['gear', 'fear', 'near', 'hear']
LESSONS[1]['chains'][1] = ['year', 'fear', 'gear', 'near']

# rain/pain/paint/faint:
# rain = r, ai, n
# pain = p, ai, n  one change. Good.
# paint = p, ai, n, t  ADDS t. Not one change.
# Fix: rain, pain, main, gain? gain is ok. main is ok.
LESSONS[2]['chains'][0] = ['rain', 'pain', 'main', 'gain']
LESSONS[2]['bellExtra'] = ['pain', 'main', 'gain', 'faint', 'pay', 'way', 'ray', 'mail', 'bait', 'ran', 'plan']
# day, pay, play, stay:
# day = d, ay
# pay = p, ay OK
# play = p, l, ay NOT one change from pay (p, ay)
# Fix: day, pay, say, way. say is the heart word "says" related but "say" might be regular ay!
# "say" is s+ay, the long a sound. Fully decodable with ay! "says" is the heart because it says /sez/.
# day, pay, say, way. Good.
LESSONS[2]['chains'][1] = ['day', 'pay', 'say', 'way']
LESSONS[2]['bellExtra'] = ['pain', 'main', 'gain', 'pay', 'say', 'way', 'ray', 'mail', 'bait', 'ran', 'plan']

# bee, see, seed, weed:
# bee = b, ee
# see = s, ee OK
# seed = s, ee, d ADDS d. 
# Fix: bee, see, wee, fee? wee and fee are real. Or keep seed out.
LESSONS[3]['chains'][0] = ['bee', 'see', 'wee', 'fee']
# tea, team, beam, beach:
# tea = t, ea
# team = t, ea, m adds m
# Fix: tea, sea, pea? pea is fine. Or beam, team, seam.
# beam = b, ea, m. team = t, ea, m. seam = s, ea, m. dream = d, r, ea, m (4).
LESSONS[3]['chains'][0] = ['bee', 'see', 'wee', 'fee']
LESSONS[3]['chains'][1] = ['beam', 'team', 'seam', 'beam']
# repeated beam at end. Use dream? dream = d, r, ea, m not one change from seam (s, ea, m).
# cream = c, r, ea, m. 
# beam, team, seam, and... "ream" is obscure. I'll use 3: beam, team, seam and add "heap"? heap is h, ea, p.
# 3-word chain is OK.
LESSONS[3]['chains'][1] = ['beam', 'team', 'seam']
LESSONS[3]['bellExtra'] = ['seed', 'weed', 'wee', 'fee', 'reach', 'team', 'beam', 'seam', 'sea', 'honey', 'money', 'green', 'eat']

# boat, coat, goat, moat: b,oa,t / c,oa,t / g,oa,t / m,oa,t. Perfect.
# coal, goal, goat, coat:
# coal = c, oa, l
# goal = g, oa, l OK
# goat = g, oa, t OK (l to t)
# coat = c, oa, t OK
# Good.

# night, light, right, sight: n,igh,t / l,igh,t / r,igh,t / s,igh,t. Perfect.
# pie, tie, lie: p,ie / t,ie / l,ie. Perfect.

# wait sort bin is 'ain' but wait is -ait not -ain. FIX.
# sort list: rain ain, day ay, trail ail, play ay, pain ain, mail ail, stay ay, train ain, hay ay, wait ain.
# wait should not be ain. Use "gain" or "main".
LESSONS[2]['sort'][9] = sort('main', 'ain')

# faint was removed from chain. OK if still in bell. I removed faint from bellExtra. Good.

print('lesson specs', len(LESSONS))
