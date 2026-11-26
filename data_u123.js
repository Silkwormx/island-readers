/* Units 1 to 3 lesson data (Short Vowels & Floss, Blends, Digraphs). Built by /workspace/u123/build_data.py from content.py.
   Unit 1 keeps every word, sentence, story line and check item from the first Unit 1 build; Unit 2 keeps the Unit 2 Blends kit lists and "The Raft Trip". */
window.IR_DATA_U123 = {
 "units": {
  "1": {
   "name": "Short Vowels & Floss",
   "sounds": "a e i o u · ff ll ss"
  },
  "2": {
   "name": "Blends",
   "sounds": "bl · st · tr · -nd · -mp"
  },
  "3": {
   "name": "Digraphs",
   "sounds": "sh · ch · th · wh · ck"
  }
 },
 "lessons": [
  {
   "key": "u11",
   "n": "1.1",
   "unit": 1,
   "name": "Short a",
   "storyTitle": "I Am Sam",
   "blurb": "UFLI lessons 1 to 11. Short a, then m, s, t, p, f, and n.",
   "focus": [
    "a"
   ],
   "focusKind": "vowel",
   "vowels": "a",
   "label": "short a",
   "keyword": "apple",
   "meet": [
    {
     "who": "zip",
     "audio": "u11_m1",
     "word": "a",
     "chips": [
      "apple"
     ],
     "cap": "Short a, as in apple. Open wide.",
     "text": "This is short a. Open your mouth wide, like you will bite an apple. Listen.",
     "snd": "a"
    },
    {
     "who": "frill",
     "audio": "u11_m2",
     "word": "mat",
     "chips": [
      "mat",
      "map",
      "man"
     ],
     "cap": "Short a is in the middle.",
     "text": "Short a is in the middle of these words. Mat. Map. Man."
    },
    {
     "who": "zip",
     "audio": "u11_m3",
     "word": "sat",
     "chips": [
      "sat",
      "fan",
      "nap"
     ],
     "cap": "Say each sound. Then say it fast.",
     "text": "Touch each sound, then say the word fast. Sat. Fan. Nap."
    }
   ],
   "hear": [
    {
     "word": "mat",
     "choices": [
      "mat",
      "map",
      "man"
     ]
    },
    {
     "word": "fan",
     "choices": [
      "fan",
      "fat",
      "pan"
     ]
    },
    {
     "word": "nap",
     "choices": [
      "nap",
      "map",
      "tap"
     ]
    },
    {
     "word": "sat",
     "choices": [
      "sat",
      "mat",
      "pat"
     ]
    },
    {
     "word": "pan",
     "choices": [
      "pan",
      "man",
      "fan"
     ]
    },
    {
     "word": "tap",
     "choices": [
      "tap",
      "nap",
      "sap"
     ]
    },
    {
     "word": "am",
     "choices": [
      "am",
      "at",
      "an"
     ]
    },
    {
     "word": "fat",
     "choices": [
      "fat",
      "mat",
      "sat"
     ]
    }
   ],
   "bellWords": [
    "mat",
    "map",
    "man",
    "sat",
    "sap",
    "pat",
    "pan",
    "tap",
    "tan",
    "nap",
    "fan",
    "fat",
    "am",
    "at",
    "an",
    "Sam",
    "Pam"
   ],
   "build": [
    {
     "word": "mat",
     "a": "m",
     "b": "at",
     "altA": "s",
     "altB": "ap"
    },
    {
     "word": "map",
     "a": "m",
     "b": "ap",
     "altA": "t",
     "altB": "an"
    },
    {
     "word": "pan",
     "a": "p",
     "b": "an",
     "altA": "f",
     "altB": "at"
    },
    {
     "word": "fan",
     "a": "f",
     "b": "an",
     "altA": "s",
     "altB": "ap"
    },
    {
     "word": "sat",
     "a": "s",
     "b": "at",
     "altA": "n",
     "altB": "an"
    },
    {
     "word": "tap",
     "a": "t",
     "b": "ap",
     "altA": "p",
     "altB": "at"
    }
   ],
   "chains": [
    [
     "mat",
     "map",
     "man",
     "pan",
     "pat",
     "sat"
    ],
    [
     "tap",
     "nap",
     "sap",
     "sat",
     "fat",
     "fan"
    ]
   ],
   "scramble": [
    "mat",
    "map",
    "fan",
    "tap",
    "pan"
   ],
   "feed": [
    "mat",
    "map",
    "man",
    "sat",
    "pan",
    "fan",
    "nap",
    "tap"
   ],
   "sentences": [
    {
     "text": "I am Sam.",
     "words": [
      "I",
      "am",
      "Sam."
     ]
    },
    {
     "text": "Sam sat.",
     "words": [
      "Sam",
      "sat."
     ]
    },
    {
     "text": "I tap Mat.",
     "words": [
      "I",
      "tap",
      "Mat."
     ]
    },
    {
     "text": "Pam sat at a mat.",
     "words": [
      "Pam",
      "sat",
      "at",
      "a",
      "mat."
     ]
    }
   ],
   "rhyme": [
    {
     "prompt": "mat",
     "choices": [
      "sat",
      "man",
      "nap"
     ],
     "answer": "sat"
    },
    {
     "prompt": "fan",
     "choices": [
      "pan",
      "fat",
      "map"
     ],
     "answer": "pan"
    },
    {
     "prompt": "nap",
     "choices": [
      "tap",
      "nan",
      "sat"
     ],
     "answer": "tap"
    },
    {
     "prompt": "pat",
     "choices": [
      "fat",
      "pan",
      "map"
     ],
     "answer": "fat"
    },
    {
     "prompt": "map",
     "choices": [
      "sap",
      "man",
      "mat"
     ],
     "answer": "sap"
    },
    {
     "prompt": "man",
     "choices": [
      "tan",
      "mat",
      "tap"
     ],
     "answer": "tan"
    }
   ],
   "fishLabel": "rhymes with mat",
   "fishYes": [
    "sat",
    "pat",
    "fat",
    "at",
    "mat",
    "Pat"
   ],
   "fishNo": [
    "man",
    "map",
    "fan",
    "nap",
    "tap",
    "pan"
   ],
   "bins": [
    {
     "id": "at",
     "label": "-at"
    },
    {
     "id": "an",
     "label": "-an"
    },
    {
     "id": "ap",
     "label": "-ap"
    }
   ],
   "sort": [
    {
     "word": "mat",
     "bin": "at"
    },
    {
     "word": "fan",
     "bin": "an"
    },
    {
     "word": "map",
     "bin": "ap"
    },
    {
     "word": "sat",
     "bin": "at"
    },
    {
     "word": "pan",
     "bin": "an"
    },
    {
     "word": "tap",
     "bin": "ap"
    },
    {
     "word": "nap",
     "bin": "ap"
    },
    {
     "word": "pat",
     "bin": "at"
    },
    {
     "word": "man",
     "bin": "an"
    }
   ],
   "which": [
    {
     "word": "mat",
     "part": "a"
    },
    {
     "word": "fan",
     "part": "a"
    },
    {
     "word": "map",
     "part": "a"
    },
    {
     "word": "sat",
     "part": "a"
    },
    {
     "word": "pan",
     "part": "a"
    },
    {
     "word": "tap",
     "part": "a"
    }
   ],
   "whichChoices": [
    "a",
    "m",
    "t"
   ],
   "whichLabel": "Tap the vowel.",
   "check": [
    {
     "type": "pick",
     "word": "mat",
     "choices": [
      "mat",
      "tam",
      "atm"
     ]
    },
    {
     "type": "pick",
     "word": "map",
     "choices": [
      "map",
      "pam",
      "amp"
     ]
    },
    {
     "type": "pick",
     "word": "fan",
     "choices": [
      "fan",
      "naf",
      "anf"
     ]
    },
    {
     "type": "pick",
     "word": "sat",
     "choices": [
      "sat",
      "tas",
      "ast"
     ]
    },
    {
     "type": "pick",
     "word": "pan",
     "choices": [
      "pan",
      "nap",
      "apn"
     ]
    },
    {
     "type": "pick",
     "word": "man",
     "choices": [
      "man",
      "nam",
      "amn"
     ]
    },
    {
     "type": "pick",
     "word": "nap",
     "choices": [
      "nap",
      "pan",
      "tap"
     ]
    },
    {
     "type": "pick",
     "word": "tap",
     "choices": [
      "tap",
      "pat",
      "nap"
     ]
    },
    {
     "type": "pick",
     "word": "fat",
     "choices": [
      "fat",
      "sat",
      "fan"
     ]
    },
    {
     "type": "pick",
     "word": "am",
     "choices": [
      "am",
      "at",
      "an"
     ]
    }
   ],
   "heart": [
    {
     "w": "I"
    },
    {
     "w": "a"
    }
   ],
   "newWords": [
    "Sam",
    "Pam"
   ],
   "pics": {
    "mat": "foundation/img/story/single-mat.jpg",
    "pan": "foundation/img/story/single-pan.jpg",
    "map": "svg:map",
    "man": "svg:man",
    "cat": "svg:cat"
   },
   "story": [
    {
     "text": "I am Sam.",
     "words": [
      "I",
      "am",
      "Sam."
     ],
     "img": "img/u11_p01.webp"
    },
    {
     "text": "Sam sat.",
     "words": [
      "Sam",
      "sat."
     ],
     "img": "img/u11_p02.webp"
    },
    {
     "text": "I fan Sam.",
     "words": [
      "I",
      "fan",
      "Sam."
     ],
     "img": "img/u11_p03.webp"
    },
    {
     "text": "Mat sat.",
     "words": [
      "Mat",
      "sat."
     ],
     "img": "img/u11_p04.webp"
    },
    {
     "text": "Pam sat at a mat.",
     "words": [
      "Pam",
      "sat",
      "at",
      "a",
      "mat."
     ],
     "img": "img/u11_p05.webp"
    },
    {
     "text": "Pam taps Sam. Sam naps!",
     "words": [
      "Pam",
      "taps",
      "Sam.",
      "Sam",
      "naps!"
     ],
     "img": "img/u11_p06.webp"
    }
   ],
   "days": [
    "Short a",
    "Build and chain",
    "Mix and read"
   ]
  },
  {
   "key": "u12",
   "n": "1.2",
   "unit": 1,
   "name": "Short i and o",
   "storyTitle": "Dad on the Cot",
   "blurb": "UFLI lessons 8 to 14. Short i, short o, then d and c.",
   "focus": [
    "i",
    "o"
   ],
   "focusKind": "vowel",
   "vowels": "aio",
   "label": "short i or short o",
   "keyword": "insect, octopus",
   "meet": [
    {
     "who": "zip",
     "audio": "u12_m1",
     "word": "i",
     "chips": [
      "insect"
     ],
     "cap": "Short i, as in insect. A small smile.",
     "text": "This is short i. Make a small smile. Listen.",
     "snd": "i"
    },
    {
     "who": "frill",
     "audio": "u12_m2",
     "word": "o",
     "chips": [
      "octopus",
      "mop",
      "pot"
     ],
     "cap": "Short o, as in octopus. Open round.",
     "text": "This is short o, as in octopus. Open your mouth round. Mop. Pot."
    },
    {
     "who": "zip",
     "audio": "u12_m3",
     "word": "sit",
     "chips": [
      "sit",
      "sat",
      "mop",
      "map"
     ],
     "cap": "Change the vowel, change the word.",
     "text": "Listen to the middle. Sit. Sat. Mop. Map. The vowel changes the word."
    }
   ],
   "hear": [
    {
     "word": "sit",
     "choices": [
      "sit",
      "sat",
      "pit"
     ]
    },
    {
     "word": "mop",
     "choices": [
      "mop",
      "map",
      "mip"
     ]
    },
    {
     "word": "cat",
     "choices": [
      "cat",
      "cot",
      "cap"
     ]
    },
    {
     "word": "pot",
     "choices": [
      "pot",
      "pat",
      "pit"
     ]
    },
    {
     "word": "pin",
     "choices": [
      "pin",
      "pan",
      "pit"
     ]
    },
    {
     "word": "cap",
     "choices": [
      "cap",
      "cop",
      "cat"
     ]
    },
    {
     "word": "dot",
     "choices": [
      "dot",
      "dad",
      "did"
     ]
    },
    {
     "word": "tip",
     "choices": [
      "tip",
      "tap",
      "top"
     ]
    }
   ],
   "bellWords": [
    "sit",
    "sip",
    "pin",
    "fin",
    "pit",
    "tip",
    "did",
    "dot",
    "pot",
    "mop",
    "cop",
    "cat",
    "cap",
    "cot",
    "mad",
    "sad",
    "dad",
    "mat",
    "map",
    "top",
    "tap",
    "pan",
    "pat",
    "sat"
   ],
   "build": [
    {
     "word": "sit",
     "a": "s",
     "b": "it",
     "altA": "p",
     "altB": "at"
    },
    {
     "word": "mop",
     "a": "m",
     "b": "op",
     "altA": "c",
     "altB": "ap"
    },
    {
     "word": "cat",
     "a": "c",
     "b": "at",
     "altA": "h",
     "altB": "ot"
    },
    {
     "word": "pot",
     "a": "p",
     "b": "ot",
     "altA": "d",
     "altB": "at"
    },
    {
     "word": "fin",
     "a": "f",
     "b": "in",
     "altA": "t",
     "altB": "on"
    },
    {
     "word": "dot",
     "a": "d",
     "b": "ot",
     "altA": "s",
     "altB": "it"
    }
   ],
   "chains": [
    [
     "sit",
     "sip",
     "tip",
     "tap",
     "map",
     "mop",
     "cop",
     "cap"
    ],
    [
     "pin",
     "pit",
     "pot",
     "dot",
     "cot",
     "cat"
    ]
   ],
   "scramble": [
    "sit",
    "mop",
    "cat",
    "pot",
    "pin",
    "dad"
   ],
   "feed": [
    "sit",
    "pin",
    "mop",
    "pot",
    "cat",
    "cap",
    "dot",
    "dad"
   ],
   "sentences": [
    {
     "text": "The cat sat.",
     "words": [
      "The",
      "cat",
      "sat."
     ]
    },
    {
     "text": "I mop the mat.",
     "words": [
      "I",
      "mop",
      "the",
      "mat."
     ]
    },
    {
     "text": "The man sat.",
     "words": [
      "The",
      "man",
      "sat."
     ]
    },
    {
     "text": "The pot is on Dad.",
     "words": [
      "The",
      "pot",
      "is",
      "on",
      "Dad."
     ]
    }
   ],
   "rhyme": [
    {
     "prompt": "sit",
     "choices": [
      "pit",
      "sat",
      "mop"
     ],
     "answer": "pit"
    },
    {
     "prompt": "mop",
     "choices": [
      "top",
      "map",
      "pin"
     ],
     "answer": "top"
    },
    {
     "prompt": "pot",
     "choices": [
      "dot",
      "pat",
      "pin"
     ],
     "answer": "dot"
    },
    {
     "prompt": "pin",
     "choices": [
      "fin",
      "pan",
      "pot"
     ],
     "answer": "fin"
    },
    {
     "prompt": "cat",
     "choices": [
      "mat",
      "cot",
      "cap"
     ],
     "answer": "mat"
    },
    {
     "prompt": "tip",
     "choices": [
      "sip",
      "top",
      "tap"
     ],
     "answer": "sip"
    }
   ],
   "fishLabel": "has short o",
   "fishYes": [
    "mop",
    "pot",
    "dot",
    "cot",
    "cop",
    "top"
   ],
   "fishNo": [
    "sit",
    "pin",
    "cat",
    "map",
    "tip",
    "fin"
   ],
   "bins": [
    {
     "id": "a",
     "label": "a"
    },
    {
     "id": "i",
     "label": "i"
    },
    {
     "id": "o",
     "label": "o"
    }
   ],
   "sort": [
    {
     "word": "mat",
     "bin": "a"
    },
    {
     "word": "sit",
     "bin": "i"
    },
    {
     "word": "mop",
     "bin": "o"
    },
    {
     "word": "cat",
     "bin": "a"
    },
    {
     "word": "pin",
     "bin": "i"
    },
    {
     "word": "pot",
     "bin": "o"
    },
    {
     "word": "cap",
     "bin": "a"
    },
    {
     "word": "fin",
     "bin": "i"
    },
    {
     "word": "dot",
     "bin": "o"
    }
   ],
   "which": [
    {
     "word": "sit",
     "part": "i"
    },
    {
     "word": "mop",
     "part": "o"
    },
    {
     "word": "cat",
     "part": "a"
    },
    {
     "word": "pin",
     "part": "i"
    },
    {
     "word": "pot",
     "part": "o"
    },
    {
     "word": "map",
     "part": "a"
    }
   ],
   "whichChoices": [
    "a",
    "i",
    "o"
   ],
   "whichLabel": "Tap the vowel.",
   "check": [
    {
     "type": "pick",
     "word": "sit",
     "choices": [
      "sit",
      "sat",
      "sot"
     ]
    },
    {
     "type": "pick",
     "word": "mop",
     "choices": [
      "mop",
      "map",
      "mip"
     ]
    },
    {
     "type": "pick",
     "word": "cat",
     "choices": [
      "cat",
      "cot",
      "cit"
     ]
    },
    {
     "type": "pick",
     "word": "pot",
     "choices": [
      "pot",
      "pat",
      "pit"
     ]
    },
    {
     "type": "pick",
     "word": "pin",
     "choices": [
      "pin",
      "pan",
      "pon"
     ]
    },
    {
     "type": "pick",
     "word": "cap",
     "choices": [
      "cap",
      "cop",
      "cat"
     ]
    },
    {
     "type": "pick",
     "word": "dot",
     "choices": [
      "dot",
      "dad",
      "did"
     ]
    },
    {
     "type": "pick",
     "word": "tip",
     "choices": [
      "tip",
      "tap",
      "top"
     ]
    },
    {
     "type": "pick",
     "word": "fin",
     "choices": [
      "fin",
      "fan",
      "pin"
     ]
    },
    {
     "type": "pick",
     "word": "cot",
     "choices": [
      "cot",
      "cat",
      "cap"
     ]
    }
   ],
   "heart": [
    {
     "w": "the"
    },
    {
     "w": "is"
    }
   ],
   "newWords": [
    "Dad"
   ],
   "pics": {
    "cat": "svg:cat",
    "mop": "svg:mop",
    "cap": "svg:cap",
    "pot": "foundation/img/objects/pot.jpg",
    "pin": "foundation/img/story/single-pin.jpg",
    "dot": "foundation/img/objects/dot.jpg",
    "fin": "foundation/img/story/single-fin.jpg"
   },
   "story": [
    {
     "text": "The cat sat on the mat.",
     "words": [
      "The",
      "cat",
      "sat",
      "on",
      "the",
      "mat."
     ],
     "img": "img/u12_p01.webp"
    },
    {
     "text": "Sam did sit.",
     "words": [
      "Sam",
      "did",
      "sit."
     ],
     "img": "img/u12_p02.webp"
    },
    {
     "text": "Dad sat on the cot.",
     "words": [
      "Dad",
      "sat",
      "on",
      "the",
      "cot."
     ],
     "img": "img/u12_p03.webp"
    },
    {
     "text": "The cat can tip the pot.",
     "words": [
      "The",
      "cat",
      "can",
      "tip",
      "the",
      "pot."
     ],
     "img": "img/u12_p04.webp"
    },
    {
     "text": "Tip! The pot is on Dad.",
     "words": [
      "Tip!",
      "The",
      "pot",
      "is",
      "on",
      "Dad."
     ],
     "img": "img/u12_p05.webp"
    },
    {
     "text": "Dad is not mad. The cat naps on Dad.",
     "words": [
      "Dad",
      "is",
      "not",
      "mad.",
      "The",
      "cat",
      "naps",
      "on",
      "Dad."
     ],
     "img": "img/u12_p06.webp"
    }
   ],
   "days": [
    "Short i",
    "Short o",
    "Mix a, i, o"
   ]
  },
  {
   "key": "u13",
   "n": "1.3",
   "unit": 1,
   "name": "Short u and e",
   "storyTitle": "Fun in the Sun",
   "blurb": "UFLI lessons 15 to 19, then the rest of the single consonants. Still no blends.",
   "focus": [
    "u",
    "e"
   ],
   "focusKind": "vowel",
   "vowels": "aeiou",
   "label": "short u or short e",
   "keyword": "umbrella, egg",
   "meet": [
    {
     "who": "zip",
     "audio": "u13_m1",
     "word": "u",
     "chips": [
      "umbrella"
     ],
     "cap": "Short u, as in umbrella.",
     "text": "This is short u, as in umbrella. Relax your mouth. Listen.",
     "snd": "u"
    },
    {
     "who": "frill",
     "audio": "u13_m2",
     "word": "e",
     "chips": [
      "egg"
     ],
     "cap": "Short e, as in egg. A little smile.",
     "text": "This is short e, as in egg. Smile a little. Listen.",
     "snd": "e"
    },
    {
     "who": "zip",
     "audio": "u13_m3",
     "word": "bed",
     "chips": [
      "cup",
      "bug",
      "bed",
      "pen",
      "sun"
     ],
     "cap": "Now we know all five short vowels.",
     "text": "Cup. Bug. Bed. Pen. Sun. Now we know all five short vowels!"
    }
   ],
   "hear": [
    {
     "word": "cup",
     "choices": [
      "cup",
      "cap",
      "cop"
     ]
    },
    {
     "word": "bed",
     "choices": [
      "bed",
      "bad",
      "bid"
     ]
    },
    {
     "word": "sun",
     "choices": [
      "sun",
      "sin",
      "set"
     ]
    },
    {
     "word": "hug",
     "choices": [
      "hug",
      "hog",
      "hut"
     ]
    },
    {
     "word": "pen",
     "choices": [
      "pen",
      "pan",
      "pin"
     ]
    },
    {
     "word": "bug",
     "choices": [
      "bug",
      "big",
      "bag"
     ]
    },
    {
     "word": "net",
     "choices": [
      "net",
      "nut",
      "not"
     ]
    },
    {
     "word": "rub",
     "choices": [
      "rub",
      "rib",
      "rug"
     ]
    }
   ],
   "bellWords": [
    "cup",
    "pup",
    "bug",
    "hug",
    "bus",
    "sun",
    "run",
    "gum",
    "bud",
    "rub",
    "tub",
    "bed",
    "red",
    "pet",
    "hen",
    "leg",
    "web",
    "pen",
    "ten",
    "men",
    "bet",
    "get",
    "met",
    "net",
    "nut",
    "rug",
    "big",
    "bag",
    "pin",
    "pan",
    "cap",
    "cop"
   ],
   "build": [
    {
     "word": "cup",
     "a": "c",
     "b": "up",
     "altA": "p",
     "altB": "ap"
    },
    {
     "word": "bed",
     "a": "b",
     "b": "ed",
     "altA": "r",
     "altB": "ug"
    },
    {
     "word": "sun",
     "a": "s",
     "b": "un",
     "altA": "r",
     "altB": "en"
    },
    {
     "word": "hug",
     "a": "h",
     "b": "ug",
     "altA": "b",
     "altB": "ag"
    },
    {
     "word": "pen",
     "a": "p",
     "b": "en",
     "altA": "t",
     "altB": "un"
    },
    {
     "word": "web",
     "a": "w",
     "b": "eb",
     "altA": "r",
     "altB": "ub"
    }
   ],
   "chains": [
    [
     "bed",
     "bet",
     "pet",
     "pen",
     "ten",
     "hen"
    ],
    [
     "bug",
     "hug",
     "hut",
     "nut",
     "net",
     "wet"
    ]
   ],
   "scramble": [
    "cup",
    "bed",
    "sun",
    "hug",
    "pen",
    "log",
    "wet"
   ],
   "feed": [
    "cup",
    "bug",
    "sun",
    "hug",
    "bed",
    "pen",
    "hen",
    "web"
   ],
   "sentences": [
    {
     "text": "A bug sat on the rug.",
     "words": [
      "A",
      "bug",
      "sat",
      "on",
      "the",
      "rug."
     ]
    },
    {
     "text": "The hen ran to the pen.",
     "words": [
      "The",
      "hen",
      "ran",
      "to",
      "the",
      "pen."
     ]
    },
    {
     "text": "I hug the pup.",
     "words": [
      "I",
      "hug",
      "the",
      "pup."
     ]
    },
    {
     "text": "The bug is in a cup.",
     "words": [
      "The",
      "bug",
      "is",
      "in",
      "a",
      "cup."
     ]
    }
   ],
   "rhyme": [
    {
     "prompt": "bug",
     "choices": [
      "hug",
      "big",
      "bed"
     ],
     "answer": "hug"
    },
    {
     "prompt": "pen",
     "choices": [
      "ten",
      "pin",
      "pup"
     ],
     "answer": "ten"
    },
    {
     "prompt": "sun",
     "choices": [
      "run",
      "sat",
      "set"
     ],
     "answer": "run"
    },
    {
     "prompt": "wet",
     "choices": [
      "pet",
      "web",
      "wig"
     ],
     "answer": "pet"
    },
    {
     "prompt": "cup",
     "choices": [
      "pup",
      "cap",
      "cut"
     ],
     "answer": "pup"
    },
    {
     "prompt": "rub",
     "choices": [
      "tub",
      "rib",
      "rug"
     ],
     "answer": "tub"
    }
   ],
   "fishLabel": "has short e",
   "fishYes": [
    "bed",
    "pen",
    "hen",
    "web",
    "wet",
    "leg"
   ],
   "fishNo": [
    "cup",
    "bug",
    "sun",
    "hug",
    "tub",
    "rug"
   ],
   "bins": [
    {
     "id": "a",
     "label": "a"
    },
    {
     "id": "e",
     "label": "e"
    },
    {
     "id": "i",
     "label": "i"
    },
    {
     "id": "o",
     "label": "o"
    },
    {
     "id": "u",
     "label": "u"
    }
   ],
   "sort": [
    {
     "word": "hat",
     "bin": "a"
    },
    {
     "word": "bed",
     "bin": "e"
    },
    {
     "word": "sit",
     "bin": "i"
    },
    {
     "word": "log",
     "bin": "o"
    },
    {
     "word": "cup",
     "bin": "u"
    },
    {
     "word": "pen",
     "bin": "e"
    },
    {
     "word": "bug",
     "bin": "u"
    },
    {
     "word": "pig",
     "bin": "i"
    },
    {
     "word": "sun",
     "bin": "u"
    },
    {
     "word": "map",
     "bin": "a"
    }
   ],
   "which": [
    {
     "word": "cup",
     "part": "u"
    },
    {
     "word": "bed",
     "part": "e"
    },
    {
     "word": "pig",
     "part": "i"
    },
    {
     "word": "log",
     "part": "o"
    },
    {
     "word": "hat",
     "part": "a"
    },
    {
     "word": "sun",
     "part": "u"
    },
    {
     "word": "pen",
     "part": "e"
    },
    {
     "word": "bug",
     "part": "u"
    }
   ],
   "whichChoices": [
    "a",
    "e",
    "i",
    "o",
    "u"
   ],
   "whichLabel": "Tap the vowel.",
   "check": [
    {
     "type": "pick",
     "word": "cup",
     "choices": [
      "cup",
      "cap",
      "cop"
     ]
    },
    {
     "type": "pick",
     "word": "bed",
     "choices": [
      "bed",
      "bad",
      "bid"
     ]
    },
    {
     "type": "pick",
     "word": "sun",
     "choices": [
      "sun",
      "sin",
      "san"
     ]
    },
    {
     "type": "pick",
     "word": "hug",
     "choices": [
      "hug",
      "hog",
      "hag"
     ]
    },
    {
     "type": "pick",
     "word": "pen",
     "choices": [
      "pen",
      "pan",
      "pin"
     ]
    },
    {
     "type": "pick",
     "word": "log",
     "choices": [
      "log",
      "lag",
      "leg"
     ]
    },
    {
     "type": "pick",
     "word": "web",
     "choices": [
      "web",
      "wet",
      "wig"
     ]
    },
    {
     "type": "pick",
     "word": "rub",
     "choices": [
      "rub",
      "rib",
      "rug"
     ]
    },
    {
     "type": "pick",
     "word": "net",
     "choices": [
      "net",
      "nut",
      "not"
     ]
    },
    {
     "type": "pick",
     "word": "ten",
     "choices": [
      "ten",
      "tin",
      "tan"
     ]
    }
   ],
   "heart": [
    {
     "w": "a"
    },
    {
     "w": "to"
    },
    {
     "w": "his"
    },
    {
     "w": "has"
    }
   ],
   "newWords": [],
   "pics": {
    "cup": "foundation/img/objects/cup.jpg",
    "bed": "foundation/img/objects/bed.jpg",
    "sun": "foundation/img/objects/sun.jpg",
    "pig": "svg:pig",
    "hen": "foundation/img/objects/hen.jpg",
    "pen": "foundation/img/objects/pen.jpg",
    "web": "foundation/img/objects/web.jpg",
    "pup": "foundation/img/objects/pup.jpg"
   },
   "story": [
    {
     "text": "A bug sat on the rug.",
     "words": [
      "A",
      "bug",
      "sat",
      "on",
      "the",
      "rug."
     ],
     "img": "img/u13_p01.webp"
    },
    {
     "text": "The hen ran to the pen.",
     "words": [
      "The",
      "hen",
      "ran",
      "to",
      "the",
      "pen."
     ],
     "img": "img/u13_p02.webp"
    },
    {
     "text": "The pup had a nap in the sun.",
     "words": [
      "The",
      "pup",
      "had",
      "a",
      "nap",
      "in",
      "the",
      "sun."
     ],
     "img": "img/u13_p03.webp"
    },
    {
     "text": "Hop! The bug hid in a red cup.",
     "words": [
      "Hop!",
      "The",
      "bug",
      "hid",
      "in",
      "a",
      "red",
      "cup."
     ],
     "img": "img/u13_p04.webp"
    },
    {
     "text": "The pup got up. Dig, dig, dig!",
     "words": [
      "The",
      "pup",
      "got",
      "up.",
      "Dig,",
      "dig,",
      "dig!"
     ],
     "img": "img/u13_p05.webp"
    },
    {
     "text": "The bug, the hen, the pup. Fun in the sun!",
     "words": [
      "The",
      "bug,",
      "the",
      "hen,",
      "the",
      "pup.",
      "Fun",
      "in",
      "the",
      "sun!"
     ],
     "img": "img/u13_p06.webp"
    }
   ],
   "days": [
    "Short u",
    "Short e",
    "All five vowels"
   ]
  },
  {
   "key": "u14",
   "n": "1.4",
   "unit": 1,
   "name": "Floss",
   "storyTitle": "The Bell on the Hill",
   "blurb": "The FLSZ rule. After a short vowel, double f, l, s, or z.",
   "focus": [
    "ff",
    "ll",
    "ss",
    "zz"
   ],
   "focusKind": "floss",
   "vowels": "aeiou",
   "label": "a floss ending",
   "keyword": "hill, miss, puff, buzz",
   "meet": [
    {
     "who": "zip",
     "audio": "u14_m1",
     "word": "hill",
     "chips": [
      "hill",
      "miss",
      "puff",
      "buzz"
     ],
     "cap": "One short vowel, then f, l, s, or z doubles.",
     "text": "Listen. Hill. Miss. Puff. Buzz. A short word with one short vowel doubles the last letter."
    },
    {
     "who": "frill",
     "audio": "u14_m2",
     "word": "bell",
     "chips": [
      "bell",
      "doll",
      "fell",
      "will"
     ],
     "cap": "Two letters, one sound.",
     "text": "Bell. Doll. Fell. Will. Two letters at the end, but we hear one sound."
    },
    {
     "who": "zip",
     "audio": "u14_m3",
     "word": "off",
     "chips": [
      "off",
      "kiss",
      "fuzz"
     ],
     "cap": "Floss words: ff, ll, ss, zz.",
     "text": "Off. Kiss. Fuzz. We call these floss words. Floss has two s letters too!"
    }
   ],
   "hear": [
    {
     "word": "hill",
     "choices": [
      "hill",
      "hit",
      "him"
     ]
    },
    {
     "word": "miss",
     "choices": [
      "miss",
      "mess",
      "moss"
     ]
    },
    {
     "word": "puff",
     "choices": [
      "puff",
      "pup",
      "cuff"
     ]
    },
    {
     "word": "bell",
     "choices": [
      "bell",
      "bed",
      "sell"
     ]
    },
    {
     "word": "doll",
     "choices": [
      "doll",
      "dot",
      "dull"
     ]
    },
    {
     "word": "buzz",
     "choices": [
      "buzz",
      "bus",
      "fuzz"
     ]
    },
    {
     "word": "fell",
     "choices": [
      "fell",
      "fill",
      "well"
     ]
    },
    {
     "word": "kiss",
     "choices": [
      "kiss",
      "kit",
      "miss"
     ]
    }
   ],
   "bellWords": [
    "off",
    "puff",
    "huff",
    "cuff",
    "miss",
    "mess",
    "kiss",
    "less",
    "fuss",
    "hill",
    "bell",
    "doll",
    "fill",
    "fell",
    "well",
    "tell",
    "mill",
    "moss",
    "buzz",
    "fuzz",
    "sell",
    "will",
    "pill"
   ],
   "build": [
    {
     "word": "hill",
     "a": "h",
     "b": "ill",
     "altA": "f",
     "altB": "ell"
    },
    {
     "word": "miss",
     "a": "m",
     "b": "iss",
     "altA": "l",
     "altB": "ess"
    },
    {
     "word": "puff",
     "a": "p",
     "b": "uff",
     "altA": "b",
     "altB": "ell"
    },
    {
     "word": "bell",
     "a": "b",
     "b": "ell",
     "altA": "t",
     "altB": "ill"
    },
    {
     "word": "kiss",
     "a": "k",
     "b": "iss",
     "altA": "m",
     "altB": "uff"
    },
    {
     "word": "fuzz",
     "a": "f",
     "b": "uzz",
     "altA": "b",
     "altB": "ess"
    }
   ],
   "chains": [
    [
     "hill",
     "fill",
     "fell",
     "tell",
     "bell"
    ],
    [
     "miss",
     "mess",
     "less",
     "loss",
     "moss"
    ]
   ],
   "scramble": [
    "hill",
    "miss",
    "puff",
    "bell",
    "doll",
    "buzz"
   ],
   "feed": [
    "hill",
    "miss",
    "puff",
    "bell",
    "doll",
    "buzz",
    "kiss",
    "fell"
   ],
   "sentences": [
    {
     "text": "The bell sat on the hill.",
     "words": [
      "The",
      "bell",
      "sat",
      "on",
      "the",
      "hill."
     ]
    },
    {
     "text": "The doll fell.",
     "words": [
      "The",
      "doll",
      "fell."
     ]
    },
    {
     "text": "I miss the cat.",
     "words": [
      "I",
      "miss",
      "the",
      "cat."
     ]
    },
    {
     "text": "The pup will huff and puff.",
     "words": [
      "The",
      "pup",
      "will",
      "huff",
      "and",
      "puff."
     ]
    }
   ],
   "rhyme": [
    {
     "prompt": "hill",
     "choices": [
      "fill",
      "hit",
      "bell"
     ],
     "answer": "fill"
    },
    {
     "prompt": "bell",
     "choices": [
      "tell",
      "ball",
      "bill"
     ],
     "answer": "tell"
    },
    {
     "prompt": "miss",
     "choices": [
      "kiss",
      "mess",
      "mid"
     ],
     "answer": "kiss"
    },
    {
     "prompt": "puff",
     "choices": [
      "cuff",
      "pup",
      "pill"
     ],
     "answer": "cuff"
    },
    {
     "prompt": "buzz",
     "choices": [
      "fuzz",
      "bus",
      "bud"
     ],
     "answer": "fuzz"
    },
    {
     "prompt": "moss",
     "choices": [
      "loss",
      "mess",
      "mop"
     ],
     "answer": "loss"
    }
   ],
   "fishLabel": "is a floss word",
   "fishYes": [
    "hill",
    "miss",
    "puff",
    "bell",
    "doll",
    "buzz"
   ],
   "fishNo": [
    "hit",
    "mat",
    "pup",
    "bed",
    "dot",
    "bus"
   ],
   "bins": [
    {
     "id": "floss",
     "label": "Floss"
    },
    {
     "id": "cvc",
     "label": "No floss"
    }
   ],
   "sort": [
    {
     "word": "hill",
     "bin": "floss"
    },
    {
     "word": "mat",
     "bin": "cvc"
    },
    {
     "word": "miss",
     "bin": "floss"
    },
    {
     "word": "cup",
     "bin": "cvc"
    },
    {
     "word": "puff",
     "bin": "floss"
    },
    {
     "word": "bed",
     "bin": "cvc"
    },
    {
     "word": "doll",
     "bin": "floss"
    },
    {
     "word": "sun",
     "bin": "cvc"
    },
    {
     "word": "bell",
     "bin": "floss"
    },
    {
     "word": "log",
     "bin": "cvc"
    },
    {
     "word": "off",
     "bin": "floss"
    },
    {
     "word": "pen",
     "bin": "cvc"
    }
   ],
   "which": [
    {
     "word": "hill",
     "part": "ll"
    },
    {
     "word": "bell",
     "part": "ll"
    },
    {
     "word": "doll",
     "part": "ll"
    },
    {
     "word": "puff",
     "part": "ff"
    },
    {
     "word": "miss",
     "part": "ss"
    },
    {
     "word": "moss",
     "part": "ss"
    },
    {
     "word": "buzz",
     "part": "zz"
    },
    {
     "word": "off",
     "part": "ff"
    }
   ],
   "whichChoices": [
    "ff",
    "ll",
    "ss",
    "zz"
   ],
   "whichLabel": "Tap the floss ending.",
   "check": [
    {
     "type": "pick",
     "word": "hill",
     "choices": [
      "hill",
      "hil",
      "hilll"
     ]
    },
    {
     "type": "pick",
     "word": "miss",
     "choices": [
      "miss",
      "mis",
      "misss"
     ]
    },
    {
     "type": "pick",
     "word": "puff",
     "choices": [
      "puff",
      "puf",
      "pufff"
     ]
    },
    {
     "type": "pick",
     "word": "bell",
     "choices": [
      "bell",
      "bel",
      "belll"
     ]
    },
    {
     "type": "pick",
     "word": "off",
     "choices": [
      "off",
      "of",
      "offf"
     ]
    },
    {
     "type": "pick",
     "word": "buzz",
     "choices": [
      "buzz",
      "buz",
      "buzzs"
     ]
    },
    {
     "type": "pick",
     "word": "doll",
     "choices": [
      "doll",
      "dot",
      "dull"
     ]
    },
    {
     "type": "pick",
     "word": "kiss",
     "choices": [
      "kiss",
      "kit",
      "miss"
     ]
    },
    {
     "type": "pick",
     "word": "fell",
     "choices": [
      "fell",
      "fill",
      "well"
     ]
    },
    {
     "type": "pick",
     "word": "fuzz",
     "choices": [
      "fuzz",
      "fun",
      "buzz"
     ]
    }
   ],
   "heart": [
    {
     "w": "of"
    },
    {
     "w": "and"
    },
    {
     "w": "what"
    }
   ],
   "newWords": [],
   "pics": {
    "hill": "svg:hill",
    "bell": "svg:bell",
    "doll": "svg:doll",
    "cliff": "img/u2pics/cliff.webp"
   },
   "story": [
    {
     "text": "The bell sat on the hill.",
     "words": [
      "The",
      "bell",
      "sat",
      "on",
      "the",
      "hill."
     ],
     "img": "img/u14_p01.webp"
    },
    {
     "text": "A doll fell.",
     "words": [
      "A",
      "doll",
      "fell."
     ],
     "img": "img/u14_p02.webp"
    },
    {
     "text": "Sam will miss the pup.",
     "words": [
      "Sam",
      "will",
      "miss",
      "the",
      "pup."
     ],
     "img": "img/u14_p03.webp"
    },
    {
     "text": "Puff, puff! The pup ran up the hill.",
     "words": [
      "Puff,",
      "puff!",
      "The",
      "pup",
      "ran",
      "up",
      "the",
      "hill."
     ],
     "img": "img/u14_p04.webp"
    },
    {
     "text": "The pup got the doll.",
     "words": [
      "The",
      "pup",
      "got",
      "the",
      "doll."
     ],
     "img": "img/u14_p05.webp"
    },
    {
     "text": "Sam and the pup sit on the hill.",
     "words": [
      "Sam",
      "and",
      "the",
      "pup",
      "sit",
      "on",
      "the",
      "hill."
     ],
     "img": "img/u14_p06.webp"
    }
   ],
   "days": [
    "Floss ll and ss",
    "Floss ff and zz",
    "Mix and read"
   ]
  },
  {
   "key": "u21",
   "n": "2.1",
   "unit": 2,
   "name": "l-blends",
   "storyTitle": "The Flag on the Cliff",
   "blurb": "bl, cl, fl, gl, pl, sl. The second sound is l.",
   "focus": [
    "bl",
    "cl",
    "fl",
    "gl",
    "pl",
    "sl"
   ],
   "focusKind": "blend",
   "vowels": "aeiou",
   "label": "an l-blend",
   "keyword": "flag, clap, plum",
   "meet": [
    {
     "who": "zip",
     "audio": "u21_m1",
     "word": "flag",
     "chips": [
      "flag",
      "flap",
      "flip"
     ],
     "cap": "Two sounds blend at the start.",
     "text": "Listen. Flag. Two sounds at the start blend together. The second sound is l."
    },
    {
     "who": "frill",
     "audio": "u21_m2",
     "word": "clap",
     "chips": [
      "clap",
      "clip",
      "slip",
      "slap"
     ],
     "cap": "Slide from the first sound right into l.",
     "text": "Clap. Clip. Slip. Slap. Slide right into the l sound. Do not stop between."
    },
    {
     "who": "zip",
     "audio": "u21_m3",
     "word": "plum",
     "chips": [
      "plum",
      "plug",
      "glad",
      "blot"
     ],
     "cap": "bl, cl, fl, gl, pl, sl.",
     "text": "Plum. Plug. Glad. Blot. These are l-blends."
    }
   ],
   "hear": [
    {
     "word": "clap",
     "choices": [
      "clap",
      "cap",
      "lap"
     ]
    },
    {
     "word": "flip",
     "choices": [
      "flip",
      "fip",
      "lip"
     ]
    },
    {
     "word": "slug",
     "choices": [
      "slug",
      "sug",
      "lug"
     ]
    },
    {
     "word": "plum",
     "choices": [
      "plum",
      "pum",
      "glum"
     ]
    },
    {
     "word": "flag",
     "choices": [
      "flag",
      "fag",
      "lag"
     ]
    },
    {
     "word": "sled",
     "choices": [
      "sled",
      "led",
      "slid"
     ]
    },
    {
     "word": "plug",
     "choices": [
      "plug",
      "pug",
      "slug"
     ]
    },
    {
     "word": "glad",
     "choices": [
      "glad",
      "lad",
      "gad"
     ]
    }
   ],
   "bellWords": [
    "clap",
    "flap",
    "slap",
    "clip",
    "flip",
    "slip",
    "flag",
    "blot",
    "plot",
    "slot",
    "plug",
    "slug",
    "plum",
    "glum",
    "glad",
    "flop",
    "plop",
    "sled",
    "plan",
    "cap",
    "lap",
    "lip",
    "lot",
    "pot",
    "lug",
    "rug",
    "lid",
    "led"
   ],
   "build": [
    {
     "word": "clap",
     "a": "cl",
     "b": "ap",
     "altA": "fl",
     "altB": "ip"
    },
    {
     "word": "flip",
     "a": "fl",
     "b": "ip",
     "altA": "sl",
     "altB": "ag"
    },
    {
     "word": "slug",
     "a": "sl",
     "b": "ug",
     "altA": "pl",
     "altB": "op"
    },
    {
     "word": "plum",
     "a": "pl",
     "b": "um",
     "altA": "gl",
     "altB": "ap"
    },
    {
     "word": "glad",
     "a": "gl",
     "b": "ad",
     "altA": "cl",
     "altB": "ug"
    },
    {
     "word": "blot",
     "a": "bl",
     "b": "ot",
     "altA": "fl",
     "altB": "um"
    }
   ],
   "chains": [
    [
     "clap",
     "clip",
     "slip",
     "slap",
     "flap",
     "flop",
     "plop"
    ],
    [
     "plug",
     "slug",
     "slot",
     "plot",
     "blot"
    ]
   ],
   "scramble": [
    "clap",
    "flag",
    "slug",
    "plum",
    "sled",
    "glad"
   ],
   "feed": [
    "clap",
    "flag",
    "slip",
    "plum",
    "glad",
    "sled",
    "blot",
    "plug"
   ],
   "sentences": [
    {
     "text": "Clap, clap, clap!",
     "words": [
      "Clap,",
      "clap,",
      "clap!"
     ]
    },
    {
     "text": "I slip on the mat.",
     "words": [
      "I",
      "slip",
      "on",
      "the",
      "mat."
     ]
    },
    {
     "text": "The slug is on a plum.",
     "words": [
      "The",
      "slug",
      "is",
      "on",
      "a",
      "plum."
     ]
    },
    {
     "text": "We plot a plan.",
     "words": [
      "We",
      "plot",
      "a",
      "plan."
     ]
    },
    {
     "text": "Plop! The plum is in the glass.",
     "words": [
      "Plop!",
      "The",
      "plum",
      "is",
      "in",
      "the",
      "glass."
     ]
    },
    {
     "text": "We sled up on the cliff.",
     "words": [
      "We",
      "sled",
      "up",
      "on",
      "the",
      "cliff."
     ]
    }
   ],
   "rhyme": [
    {
     "prompt": "clap",
     "choices": [
      "flap",
      "clip",
      "plum"
     ],
     "answer": "flap"
    },
    {
     "prompt": "slip",
     "choices": [
      "flip",
      "slap",
      "slug"
     ],
     "answer": "flip"
    },
    {
     "prompt": "plug",
     "choices": [
      "slug",
      "plum",
      "plan"
     ],
     "answer": "slug"
    },
    {
     "prompt": "plot",
     "choices": [
      "blot",
      "plop",
      "flag"
     ],
     "answer": "blot"
    },
    {
     "prompt": "glum",
     "choices": [
      "plum",
      "glad",
      "flop"
     ],
     "answer": "plum"
    },
    {
     "prompt": "flop",
     "choices": [
      "plop",
      "flip",
      "slot"
     ],
     "answer": "plop"
    }
   ],
   "fishLabel": "starts with an l-blend",
   "fishYes": [
    "clap",
    "flag",
    "slip",
    "plum",
    "glad",
    "blot"
   ],
   "fishNo": [
    "cap",
    "fat",
    "sip",
    "pup",
    "gas",
    "bot"
   ],
   "bins": [
    {
     "id": "cl",
     "label": "cl"
    },
    {
     "id": "fl",
     "label": "fl"
    },
    {
     "id": "sl",
     "label": "sl"
    },
    {
     "id": "pl",
     "label": "pl"
    }
   ],
   "sort": [
    {
     "word": "clap",
     "bin": "cl"
    },
    {
     "word": "flag",
     "bin": "fl"
    },
    {
     "word": "slip",
     "bin": "sl"
    },
    {
     "word": "plum",
     "bin": "pl"
    },
    {
     "word": "clip",
     "bin": "cl"
    },
    {
     "word": "flop",
     "bin": "fl"
    },
    {
     "word": "slug",
     "bin": "sl"
    },
    {
     "word": "plug",
     "bin": "pl"
    },
    {
     "word": "cliff",
     "bin": "cl"
    },
    {
     "word": "sled",
     "bin": "sl"
    }
   ],
   "which": [
    {
     "word": "clap",
     "part": "cl"
    },
    {
     "word": "flag",
     "part": "fl"
    },
    {
     "word": "slug",
     "part": "sl"
    },
    {
     "word": "plum",
     "part": "pl"
    },
    {
     "word": "glad",
     "part": "gl"
    },
    {
     "word": "blot",
     "part": "bl"
    },
    {
     "word": "flip",
     "part": "fl"
    },
    {
     "word": "clip",
     "part": "cl"
    }
   ],
   "whichChoices": [
    "bl",
    "cl",
    "fl",
    "gl",
    "pl",
    "sl"
   ],
   "whichLabel": "Tap the blend.",
   "check": [
    {
     "type": "pick",
     "word": "clap",
     "choices": [
      "clap",
      "cap",
      "lap"
     ]
    },
    {
     "type": "pick",
     "word": "flag",
     "choices": [
      "flag",
      "fag",
      "lag"
     ]
    },
    {
     "type": "pick",
     "word": "slip",
     "choices": [
      "slip",
      "sip",
      "lip"
     ]
    },
    {
     "type": "pick",
     "word": "plum",
     "choices": [
      "plum",
      "glum",
      "slum"
     ]
    },
    {
     "type": "pick",
     "word": "glad",
     "choices": [
      "glad",
      "lad",
      "gad"
     ]
    },
    {
     "type": "pick",
     "word": "sled",
     "choices": [
      "sled",
      "led",
      "slid"
     ]
    },
    {
     "type": "pick",
     "word": "blot",
     "choices": [
      "blot",
      "plot",
      "slot"
     ]
    },
    {
     "type": "pick",
     "word": "plug",
     "choices": [
      "plug",
      "slug",
      "pug"
     ]
    },
    {
     "type": "pick",
     "word": "flop",
     "choices": [
      "flop",
      "flip",
      "plop"
     ]
    },
    {
     "type": "pick",
     "word": "cliff",
     "choices": [
      "cliff",
      "cuff",
      "clip"
     ]
    }
   ],
   "heart": [
    {
     "w": "we"
    }
   ],
   "newWords": [
    "Frill"
   ],
   "pics": {
    "flag": "img/u2pics/flag.webp",
    "slug": "img/u2pics/slug.webp",
    "plum": "img/u2pics/plum.webp",
    "sled": "img/u2pics/sled.webp",
    "plug": "img/u2pics/plug.webp",
    "clip": "img/u2pics/clip.webp",
    "glass": "img/u2pics/glass.webp",
    "cliff": "img/u2pics/cliff.webp"
   },
   "story": [
    {
     "text": "Zip has a big red flag.",
     "words": [
      "Zip",
      "has",
      "a",
      "big",
      "red",
      "flag."
     ],
     "img": "img/u21_p01.webp"
    },
    {
     "text": "Flap, flap! The flag is up on the cliff.",
     "words": [
      "Flap,",
      "flap!",
      "The",
      "flag",
      "is",
      "up",
      "on",
      "the",
      "cliff."
     ],
     "img": "img/u21_p02.webp"
    },
    {
     "text": "Zip slips on a slug. Plop!",
     "words": [
      "Zip",
      "slips",
      "on",
      "a",
      "slug.",
      "Plop!"
     ],
     "img": "img/u21_p03.webp"
    },
    {
     "text": "Zip is not glad. Zip is glum.",
     "words": [
      "Zip",
      "is",
      "not",
      "glad.",
      "Zip",
      "is",
      "glum."
     ],
     "img": "img/u21_p04.webp"
    },
    {
     "text": "Frill claps and claps. Zip gets up.",
     "words": [
      "Frill",
      "claps",
      "and",
      "claps.",
      "Zip",
      "gets",
      "up."
     ],
     "img": "img/u21_p05.webp"
    },
    {
     "text": "Zip and Frill sit on the cliff. Flap, flap!",
     "words": [
      "Zip",
      "and",
      "Frill",
      "sit",
      "on",
      "the",
      "cliff.",
      "Flap,",
      "flap!"
     ],
     "img": "img/u21_p06.webp"
    }
   ],
   "days": [
    "cl, fl, sl",
    "bl, gl, pl",
    "Chains and doubles"
   ],
   "dayWords": [
    [
     "clap",
     "flap",
     "slap",
     "clip",
     "flip",
     "slip",
     "flag"
    ],
    [
     "blot",
     "plot",
     "slot",
     "plug",
     "slug",
     "plum",
     "glum",
     "glad"
    ],
    [
     "flop",
     "plop",
     "sled",
     "plan",
     "glass",
     "cliff",
     "fluff"
    ]
   ],
   "daySent": [
    [
     "Clap, clap, clap!",
     "I slip on the mat."
    ],
    [
     "The slug is on a plum.",
     "We plot a plan."
    ],
    [
     "Plop! The plum is in the glass.",
     "We sled up on the cliff."
    ]
   ],
   "dayDict": [
    [
     [
      "clap",
      "slap",
      "slip"
     ],
     "I slip on the mat."
    ],
    [
     [
      "slot",
      "slug",
      "blot"
     ],
     "We plot a plan."
    ],
    [
     [
      "fluff",
      "plan",
      "cliff"
     ],
     "We sled up on the cliff."
    ]
   ]
  },
  {
   "key": "u22",
   "n": "2.2",
   "unit": 2,
   "name": "r-blends",
   "storyTitle": "The Crab and the Drum",
   "blurb": "br, cr, dr, fr, gr, pr, tr. The second sound is r.",
   "focus": [
    "br",
    "cr",
    "dr",
    "fr",
    "gr",
    "pr",
    "tr"
   ],
   "focusKind": "blend",
   "vowels": "aeiou",
   "label": "an r-blend",
   "keyword": "crab, drum, frog",
   "meet": [
    {
     "who": "zip",
     "audio": "u22_m1",
     "word": "crab",
     "chips": [
      "crab",
      "grab",
      "trap"
     ],
     "cap": "The second sound is r.",
     "text": "Listen. Crab. Grab. Trap. The second sound is r."
    },
    {
     "who": "frill",
     "audio": "u22_m2",
     "word": "drum",
     "chips": [
      "drum",
      "drip",
      "trip"
     ],
     "cap": "Keep the first sound short. Slide into r.",
     "text": "Drum. Drip. Trip. Keep the first sound short and slide right into the r."
    },
    {
     "who": "zip",
     "audio": "u22_m3",
     "word": "frog",
     "chips": [
      "frog",
      "brim",
      "press",
      "Frill"
     ],
     "cap": "br, cr, dr, fr, gr, pr, tr.",
     "text": "Frog. Brim. Press. Frill! These are r-blends."
    }
   ],
   "hear": [
    {
     "word": "crab",
     "choices": [
      "crab",
      "cab",
      "grab"
     ]
    },
    {
     "word": "drum",
     "choices": [
      "drum",
      "dum",
      "rum"
     ]
    },
    {
     "word": "trip",
     "choices": [
      "trip",
      "tip",
      "rip"
     ]
    },
    {
     "word": "frog",
     "choices": [
      "frog",
      "fog",
      "grog"
     ]
    },
    {
     "word": "grin",
     "choices": [
      "grin",
      "gin",
      "grim"
     ]
    },
    {
     "word": "drop",
     "choices": [
      "drop",
      "dop",
      "prop"
     ]
    },
    {
     "word": "crib",
     "choices": [
      "crib",
      "rib",
      "grib"
     ]
    },
    {
     "word": "trap",
     "choices": [
      "trap",
      "tap",
      "rap"
     ]
    }
   ],
   "bellWords": [
    "crab",
    "grab",
    "drip",
    "trip",
    "grip",
    "trap",
    "drum",
    "frog",
    "brim",
    "trim",
    "grim",
    "grin",
    "grit",
    "crib",
    "crop",
    "drop",
    "prop",
    "cab",
    "tip",
    "rip",
    "tap",
    "rap",
    "fog",
    "rib",
    "top",
    "rim",
    "tin"
   ],
   "build": [
    {
     "word": "crab",
     "a": "cr",
     "b": "ab",
     "altA": "gr",
     "altB": "ip"
    },
    {
     "word": "drum",
     "a": "dr",
     "b": "um",
     "altA": "tr",
     "altB": "op"
    },
    {
     "word": "trip",
     "a": "tr",
     "b": "ip",
     "altA": "dr",
     "altB": "ab"
    },
    {
     "word": "frog",
     "a": "fr",
     "b": "og",
     "altA": "cr",
     "altB": "im"
    },
    {
     "word": "grin",
     "a": "gr",
     "b": "in",
     "altA": "pr",
     "altB": "ap"
    },
    {
     "word": "prop",
     "a": "pr",
     "b": "op",
     "altA": "br",
     "altB": "ug"
    }
   ],
   "chains": [
    [
     "trip",
     "trap",
     "trim",
     "brim",
     "grim",
     "grin",
     "grit"
    ],
    [
     "crab",
     "grab",
     "grip",
     "drip",
     "drop",
     "prop"
    ]
   ],
   "scramble": [
    "crab",
    "drum",
    "frog",
    "trip",
    "grin",
    "drop"
   ],
   "feed": [
    "crab",
    "drum",
    "frog",
    "trip",
    "grin",
    "drop",
    "trap",
    "crib"
   ],
   "sentences": [
    {
     "text": "The crab can grab.",
     "words": [
      "The",
      "crab",
      "can",
      "grab."
     ]
    },
    {
     "text": "Drip, drip, drip on the drum.",
     "words": [
      "Drip,",
      "drip,",
      "drip",
      "on",
      "the",
      "drum."
     ]
    },
    {
     "text": "Frill has a red dress.",
     "words": [
      "Frill",
      "has",
      "a",
      "red",
      "dress."
     ]
    },
    {
     "text": "A frog is on the grill!",
     "words": [
      "A",
      "frog",
      "is",
      "on",
      "the",
      "grill!"
     ]
    },
    {
     "text": "Fran can grin at the frog.",
     "words": [
      "Fran",
      "can",
      "grin",
      "at",
      "the",
      "frog."
     ]
    },
    {
     "text": "Fran can drop the crab in the bin.",
     "words": [
      "Fran",
      "can",
      "drop",
      "the",
      "crab",
      "in",
      "the",
      "bin."
     ]
    }
   ],
   "rhyme": [
    {
     "prompt": "crab",
     "choices": [
      "grab",
      "crib",
      "drum"
     ],
     "answer": "grab"
    },
    {
     "prompt": "trip",
     "choices": [
      "drip",
      "trap",
      "trim"
     ],
     "answer": "drip"
    },
    {
     "prompt": "drop",
     "choices": [
      "crop",
      "drip",
      "drum"
     ],
     "answer": "crop"
    },
    {
     "prompt": "grin",
     "choices": [
      "tin",
      "grim",
      "grab"
     ],
     "answer": "tin"
    },
    {
     "prompt": "trim",
     "choices": [
      "brim",
      "trip",
      "tram"
     ],
     "answer": "brim"
    },
    {
     "prompt": "frog",
     "choices": [
      "fog",
      "frill",
      "from"
     ],
     "answer": "fog"
    }
   ],
   "fishLabel": "starts with an r-blend",
   "fishYes": [
    "crab",
    "drum",
    "frog",
    "trip",
    "grin",
    "prop"
   ],
   "fishNo": [
    "cab",
    "dug",
    "fog",
    "tip",
    "gin",
    "pop"
   ],
   "bins": [
    {
     "id": "cr",
     "label": "cr"
    },
    {
     "id": "dr",
     "label": "dr"
    },
    {
     "id": "gr",
     "label": "gr"
    },
    {
     "id": "tr",
     "label": "tr"
    }
   ],
   "sort": [
    {
     "word": "crab",
     "bin": "cr"
    },
    {
     "word": "drum",
     "bin": "dr"
    },
    {
     "word": "grab",
     "bin": "gr"
    },
    {
     "word": "trip",
     "bin": "tr"
    },
    {
     "word": "crib",
     "bin": "cr"
    },
    {
     "word": "drop",
     "bin": "dr"
    },
    {
     "word": "grin",
     "bin": "gr"
    },
    {
     "word": "trap",
     "bin": "tr"
    },
    {
     "word": "crop",
     "bin": "cr"
    },
    {
     "word": "grip",
     "bin": "gr"
    }
   ],
   "which": [
    {
     "word": "crab",
     "part": "cr"
    },
    {
     "word": "drum",
     "part": "dr"
    },
    {
     "word": "frog",
     "part": "fr"
    },
    {
     "word": "grin",
     "part": "gr"
    },
    {
     "word": "prop",
     "part": "pr"
    },
    {
     "word": "trip",
     "part": "tr"
    },
    {
     "word": "brim",
     "part": "br"
    },
    {
     "word": "drip",
     "part": "dr"
    }
   ],
   "whichChoices": [
    "br",
    "cr",
    "dr",
    "fr",
    "gr",
    "pr",
    "tr"
   ],
   "whichLabel": "Tap the blend.",
   "check": [
    {
     "type": "pick",
     "word": "crab",
     "choices": [
      "crab",
      "cab",
      "grab"
     ]
    },
    {
     "type": "pick",
     "word": "drum",
     "choices": [
      "drum",
      "dum",
      "rum"
     ]
    },
    {
     "type": "pick",
     "word": "trip",
     "choices": [
      "trip",
      "tip",
      "rip"
     ]
    },
    {
     "type": "pick",
     "word": "frog",
     "choices": [
      "frog",
      "fog",
      "grog"
     ]
    },
    {
     "type": "pick",
     "word": "grin",
     "choices": [
      "grin",
      "gin",
      "grim"
     ]
    },
    {
     "type": "pick",
     "word": "drop",
     "choices": [
      "drop",
      "dop",
      "prop"
     ]
    },
    {
     "type": "pick",
     "word": "crib",
     "choices": [
      "crib",
      "rib",
      "crab"
     ]
    },
    {
     "type": "pick",
     "word": "trap",
     "choices": [
      "trap",
      "tap",
      "rap"
     ]
    },
    {
     "type": "pick",
     "word": "brim",
     "choices": [
      "brim",
      "rim",
      "trim"
     ]
    },
    {
     "type": "pick",
     "word": "press",
     "choices": [
      "press",
      "mess",
      "dress"
     ]
    }
   ],
   "heart": [
    {
     "w": "from"
    }
   ],
   "newWords": [
    "Fran"
   ],
   "pics": {
    "crab": "img/u2pics/crab.webp",
    "drum": "img/u2pics/drum.webp",
    "frog": "img/u2pics/frog.webp",
    "crib": "img/u2pics/crib.webp",
    "dress": "img/u2pics/dress.webp",
    "drill": "img/u2pics/drill.webp",
    "grill": "img/u2pics/grill.webp",
    "grin": "img/u2pics/grin.webp"
   },
   "story": [
    {
     "text": "Frill has a red drum.",
     "words": [
      "Frill",
      "has",
      "a",
      "red",
      "drum."
     ],
     "img": "img/u22_p01.webp"
    },
    {
     "text": "Tap, tap, tap! Frill can drum.",
     "words": [
      "Tap,",
      "tap,",
      "tap!",
      "Frill",
      "can",
      "drum."
     ],
     "img": "img/u22_p02.webp"
    },
    {
     "text": "A crab ran up from the mud.",
     "words": [
      "A",
      "crab",
      "ran",
      "up",
      "from",
      "the",
      "mud."
     ],
     "img": "img/u22_p03.webp"
    },
    {
     "text": "Grab! The crab has the drum.",
     "words": [
      "Grab!",
      "The",
      "crab",
      "has",
      "the",
      "drum."
     ],
     "img": "img/u22_p04.webp"
    },
    {
     "text": "Frill did not get mad. Frill had a grin.",
     "words": [
      "Frill",
      "did",
      "not",
      "get",
      "mad.",
      "Frill",
      "had",
      "a",
      "grin."
     ],
     "img": "img/u22_p05.webp"
    },
    {
     "text": "The crab and Frill drum on a log.",
     "words": [
      "The",
      "crab",
      "and",
      "Frill",
      "drum",
      "on",
      "a",
      "log."
     ],
     "img": "img/u22_p06.webp"
    }
   ],
   "days": [
    "cr, dr, gr, tr",
    "br, fr, pr",
    "Chains"
   ],
   "dayWords": [
    [
     "crab",
     "grab",
     "drip",
     "trip",
     "grip",
     "trap",
     "drum"
    ],
    [
     "frog",
     "brim",
     "trim",
     "dress",
     "press",
     "drill",
     "grill",
     "Frill"
    ],
    [
     "grim",
     "grin",
     "grit",
     "crib",
     "crop",
     "drop",
     "prop",
     "Fran"
    ]
   ],
   "daySent": [
    [
     "The crab can grab.",
     "Drip, drip, drip on the drum."
    ],
    [
     "Frill has a red dress.",
     "A frog is on the grill!"
    ],
    [
     "Fran can grin at the frog.",
     "Fran can drop the crab in the bin."
    ]
   ],
   "dayDict": [
    [
     [
      "grip",
      "drum",
      "crab"
     ],
     "Drip, drip, drip on the drum."
    ],
    [
     [
      "brim",
      "trim",
      "drill"
     ],
     "A frog is on the grill!"
    ],
    [
     [
      "crop",
      "grit",
      "grim"
     ],
     "Fran can drop the crab in the bin."
    ]
   ]
  },
  {
   "key": "u23",
   "n": "2.3",
   "unit": 2,
   "name": "s-blends",
   "storyTitle": "Stop, Zip!",
   "blurb": "sc, sk, sm, sn, sp, st, sw. Start with a long hiss.",
   "focus": [
    "sc",
    "sk",
    "sm",
    "sn",
    "sp",
    "st",
    "sw"
   ],
   "focusKind": "blend",
   "vowels": "aeiou",
   "label": "an s-blend",
   "keyword": "stop, spin, swim",
   "meet": [
    {
     "who": "zip",
     "audio": "u23_m1",
     "word": "stop",
     "chips": [
      "stop",
      "spot",
      "step"
     ],
     "cap": "Start with a long hiss.",
     "text": "Stop. Spot. Step. These start with a long hiss. Listen to the hiss.",
     "snd": "s"
    },
    {
     "who": "frill",
     "audio": "u23_m2",
     "word": "spin",
     "chips": [
      "spin",
      "snap",
      "snip",
      "sniff"
     ],
     "cap": "Hiss, then slide to the next sound.",
     "text": "Spin. Snap. Snip. Sniff. Hiss, then slide right to the next sound."
    },
    {
     "who": "zip",
     "audio": "u23_m3",
     "word": "swim",
     "chips": [
      "swim",
      "skip",
      "smell",
      "scab"
     ],
     "cap": "sc, sk, sm, sn, sp, st, sw.",
     "text": "Swim. Skip. Smell. Scab. These are s-blends."
    }
   ],
   "hear": [
    {
     "word": "stop",
     "choices": [
      "stop",
      "top",
      "spot"
     ]
    },
    {
     "word": "spin",
     "choices": [
      "spin",
      "pin",
      "skin"
     ]
    },
    {
     "word": "snap",
     "choices": [
      "snap",
      "nap",
      "sap"
     ]
    },
    {
     "word": "swim",
     "choices": [
      "swim",
      "win",
      "skim"
     ]
    },
    {
     "word": "skip",
     "choices": [
      "skip",
      "kip",
      "slip"
     ]
    },
    {
     "word": "step",
     "choices": [
      "step",
      "pep",
      "stem"
     ]
    },
    {
     "word": "snug",
     "choices": [
      "snug",
      "sug",
      "slug"
     ]
    },
    {
     "word": "smell",
     "choices": [
      "smell",
      "spell",
      "sell"
     ]
    }
   ],
   "bellWords": [
    "stop",
    "spot",
    "stem",
    "step",
    "spin",
    "snap",
    "snip",
    "skip",
    "skin",
    "skid",
    "swim",
    "swam",
    "scab",
    "snug",
    "top",
    "pot",
    "pin",
    "nap",
    "nip",
    "kin",
    "kid",
    "win",
    "cab",
    "tem",
    "pep"
   ],
   "build": [
    {
     "word": "stop",
     "a": "st",
     "b": "op",
     "altA": "sp",
     "altB": "in"
    },
    {
     "word": "spin",
     "a": "sp",
     "b": "in",
     "altA": "sk",
     "altB": "op"
    },
    {
     "word": "snap",
     "a": "sn",
     "b": "ap",
     "altA": "st",
     "altB": "ug"
    },
    {
     "word": "swim",
     "a": "sw",
     "b": "im",
     "altA": "sn",
     "altB": "ap"
    },
    {
     "word": "skip",
     "a": "sk",
     "b": "ip",
     "altA": "sw",
     "altB": "ab"
    },
    {
     "word": "scab",
     "a": "sc",
     "b": "ab",
     "altA": "sm",
     "altB": "ip"
    }
   ],
   "chains": [
    [
     "spill",
     "still",
     "stiff",
     "stuff",
     "scuff",
     "snuff",
     "sniff"
    ],
    [
     "stop",
     "step",
     "stem",
     "skim",
     "skip",
     "snip",
     "snap"
    ]
   ],
   "scramble": [
    "stop",
    "spin",
    "snap",
    "swim",
    "skip",
    "step"
   ],
   "feed": [
    "stop",
    "spin",
    "snap",
    "swim",
    "skip",
    "step",
    "smell",
    "snug"
   ],
   "sentences": [
    {
     "text": "Stop on the step!",
     "words": [
      "Stop",
      "on",
      "the",
      "step!"
     ]
    },
    {
     "text": "Do not snip the stem.",
     "words": [
      "Do",
      "not",
      "snip",
      "the",
      "stem."
     ]
    },
    {
     "text": "We swim and swim.",
     "words": [
      "We",
      "swim",
      "and",
      "swim."
     ]
    },
    {
     "text": "Do you smell a plum?",
     "words": [
      "Do",
      "you",
      "smell",
      "a",
      "plum?"
     ]
    },
    {
     "text": "Do not spill the jam.",
     "words": [
      "Do",
      "not",
      "spill",
      "the",
      "jam."
     ]
    },
    {
     "text": "I can spell stop.",
     "words": [
      "I",
      "can",
      "spell",
      "stop."
     ]
    }
   ],
   "rhyme": [
    {
     "prompt": "stop",
     "choices": [
      "top",
      "step",
      "spin"
     ],
     "answer": "top"
    },
    {
     "prompt": "spin",
     "choices": [
      "skin",
      "spot",
      "snap"
     ],
     "answer": "skin"
    },
    {
     "prompt": "snap",
     "choices": [
      "nap",
      "snip",
      "swim"
     ],
     "answer": "nap"
    },
    {
     "prompt": "skip",
     "choices": [
      "snip",
      "skin",
      "stop"
     ],
     "answer": "snip"
    },
    {
     "prompt": "swim",
     "choices": [
      "skim",
      "swam",
      "step"
     ],
     "answer": "skim"
    },
    {
     "prompt": "spell",
     "choices": [
      "smell",
      "spill",
      "still"
     ],
     "answer": "smell"
    }
   ],
   "fishLabel": "starts with an s-blend",
   "fishYes": [
    "stop",
    "spin",
    "snap",
    "swim",
    "skip",
    "scab"
   ],
   "fishNo": [
    "top",
    "pin",
    "nap",
    "win",
    "kid",
    "cab"
   ],
   "bins": [
    {
     "id": "st",
     "label": "st"
    },
    {
     "id": "sp",
     "label": "sp"
    },
    {
     "id": "sn",
     "label": "sn"
    },
    {
     "id": "sk",
     "label": "sk"
    }
   ],
   "sort": [
    {
     "word": "stop",
     "bin": "st"
    },
    {
     "word": "spin",
     "bin": "sp"
    },
    {
     "word": "snap",
     "bin": "sn"
    },
    {
     "word": "skip",
     "bin": "sk"
    },
    {
     "word": "step",
     "bin": "st"
    },
    {
     "word": "spot",
     "bin": "sp"
    },
    {
     "word": "snip",
     "bin": "sn"
    },
    {
     "word": "skin",
     "bin": "sk"
    },
    {
     "word": "stem",
     "bin": "st"
    },
    {
     "word": "sniff",
     "bin": "sn"
    }
   ],
   "which": [
    {
     "word": "stop",
     "part": "st"
    },
    {
     "word": "spin",
     "part": "sp"
    },
    {
     "word": "snap",
     "part": "sn"
    },
    {
     "word": "swim",
     "part": "sw"
    },
    {
     "word": "skip",
     "part": "sk"
    },
    {
     "word": "scab",
     "part": "sc"
    },
    {
     "word": "smell",
     "part": "sm"
    },
    {
     "word": "step",
     "part": "st"
    }
   ],
   "whichChoices": [
    "sc",
    "sk",
    "sm",
    "sn",
    "sp",
    "st",
    "sw"
   ],
   "whichLabel": "Tap the blend.",
   "check": [
    {
     "type": "pick",
     "word": "stop",
     "choices": [
      "stop",
      "top",
      "spot"
     ]
    },
    {
     "type": "pick",
     "word": "spin",
     "choices": [
      "spin",
      "pin",
      "skin"
     ]
    },
    {
     "type": "pick",
     "word": "snap",
     "choices": [
      "snap",
      "nap",
      "sap"
     ]
    },
    {
     "type": "pick",
     "word": "swim",
     "choices": [
      "swim",
      "win",
      "skim"
     ]
    },
    {
     "type": "pick",
     "word": "skip",
     "choices": [
      "skip",
      "kip",
      "slip"
     ]
    },
    {
     "type": "pick",
     "word": "step",
     "choices": [
      "step",
      "pep",
      "stem"
     ]
    },
    {
     "type": "pick",
     "word": "snug",
     "choices": [
      "snug",
      "sug",
      "slug"
     ]
    },
    {
     "type": "pick",
     "word": "smell",
     "choices": [
      "smell",
      "spell",
      "sell"
     ]
    },
    {
     "type": "pick",
     "word": "scab",
     "choices": [
      "scab",
      "cab",
      "stab"
     ]
    },
    {
     "type": "pick",
     "word": "stiff",
     "choices": [
      "stiff",
      "sniff",
      "tiff"
     ]
    }
   ],
   "heart": [
    {
     "w": "do"
    }
   ],
   "newWords": [],
   "pics": {
    "spin": "img/u2pics/spin.webp",
    "stem": "img/u2pics/stem.webp",
    "step": "img/u2pics/step.webp",
    "swim": "img/u2pics/swim.webp",
    "skip": "img/u2pics/skip.webp",
    "sniff": "img/u2pics/sniff.webp",
    "spill": "img/u2pics/spill.webp"
   },
   "story": [
    {
     "text": "Zip can spin and spin.",
     "words": [
      "Zip",
      "can",
      "spin",
      "and",
      "spin."
     ],
     "img": "img/u23_p01.webp"
    },
    {
     "text": "Zip skips on the step.",
     "words": [
      "Zip",
      "skips",
      "on",
      "the",
      "step."
     ],
     "img": "img/u23_p02.webp"
    },
    {
     "text": "Stop, Zip! A big slug is on the step.",
     "words": [
      "Stop,",
      "Zip!",
      "A",
      "big",
      "slug",
      "is",
      "on",
      "the",
      "step."
     ],
     "img": "img/u23_p03.webp"
    },
    {
     "text": "Zip stops. Zip sniffs the slug.",
     "words": [
      "Zip",
      "stops.",
      "Zip",
      "sniffs",
      "the",
      "slug."
     ],
     "img": "img/u23_p04.webp"
    },
    {
     "text": "The slug is snug on a stem.",
     "words": [
      "The",
      "slug",
      "is",
      "snug",
      "on",
      "a",
      "stem."
     ],
     "img": "img/u23_p05.webp"
    },
    {
     "text": "Do not step on the slug, Zip!",
     "words": [
      "Do",
      "not",
      "step",
      "on",
      "the",
      "slug,",
      "Zip!"
     ],
     "img": "img/u23_p06.webp"
    }
   ],
   "days": [
    "st, sp, sn",
    "sk, sm, sw, sc",
    "Chains and doubles"
   ],
   "dayWords": [
    [
     "stop",
     "spot",
     "stem",
     "step",
     "spin",
     "snap",
     "snip",
     "sniff"
    ],
    [
     "skip",
     "skin",
     "skid",
     "swim",
     "swam",
     "smell",
     "scab",
     "scuff"
    ],
    [
     "spill",
     "still",
     "stiff",
     "stuff",
     "spell",
     "swell",
     "snug"
    ]
   ],
   "daySent": [
    [
     "Stop on the step!",
     "Do not snip the stem."
    ],
    [
     "We swim and swim.",
     "Do you smell a plum?"
    ],
    [
     "Do not spill the jam.",
     "I can spell stop."
    ]
   ],
   "dayDict": [
    [
     [
      "sniff",
      "spot",
      "stop"
     ],
     "Do not snip the stem."
    ],
    [
     [
      "scab",
      "skin",
      "skip"
     ],
     "Do you smell a plum?"
    ],
    [
     [
      "stuff",
      "snug",
      "spell"
     ],
     "I can spell stop."
    ]
   ]
  },
  {
   "key": "u24",
   "n": "2.4",
   "unit": 2,
   "name": "Ending blends",
   "storyTitle": "The Raft Trip",
   "blurb": "-nd, -nt, -mp, -st, -sk, -lt, -ft. Two sounds at the end.",
   "focus": [
    "nd",
    "nt",
    "mp",
    "st",
    "sk",
    "lt",
    "ft"
   ],
   "focusKind": "endblend",
   "vowels": "aeiou",
   "label": "an ending blend",
   "keyword": "hand, tent, lamp",
   "meet": [
    {
     "who": "zip",
     "audio": "u24_m1",
     "word": "hand",
     "chips": [
      "hand",
      "sand",
      "land"
     ],
     "cap": "Two sounds at the end.",
     "text": "Hand. Sand. Land. Now the blend is at the end. Say both sounds."
    },
    {
     "who": "frill",
     "audio": "u24_m2",
     "word": "tent",
     "chips": [
      "tent",
      "went",
      "lamp",
      "jump"
     ],
     "cap": "Do not drop the last sound.",
     "text": "Tent. Went. Lamp. Jump. Do not drop the last sound!"
    },
    {
     "who": "zip",
     "audio": "u24_m3",
     "word": "raft",
     "chips": [
      "raft",
      "gift",
      "belt",
      "nest",
      "desk"
     ],
     "cap": "-nd, -nt, -mp, -st, -sk, -lt, -ft.",
     "text": "Raft. Gift. Belt. Nest. Desk. These end with a blend."
    }
   ],
   "hear": [
    {
     "word": "hand",
     "choices": [
      "hand",
      "had",
      "han"
     ]
    },
    {
     "word": "tent",
     "choices": [
      "tent",
      "ten",
      "tet"
     ]
    },
    {
     "word": "lamp",
     "choices": [
      "lamp",
      "lap",
      "lam"
     ]
    },
    {
     "word": "nest",
     "choices": [
      "nest",
      "net",
      "ness"
     ]
    },
    {
     "word": "desk",
     "choices": [
      "desk",
      "dusk",
      "disk"
     ]
    },
    {
     "word": "belt",
     "choices": [
      "belt",
      "bet",
      "bell"
     ]
    },
    {
     "word": "gift",
     "choices": [
      "gift",
      "gif",
      "lift"
     ]
    },
    {
     "word": "jump",
     "choices": [
      "jump",
      "jum",
      "bump"
     ]
    }
   ],
   "bellWords": [
    "hand",
    "sand",
    "land",
    "band",
    "tent",
    "went",
    "bent",
    "pond",
    "lamp",
    "camp",
    "jump",
    "bump",
    "nest",
    "best",
    "mask",
    "desk",
    "belt",
    "melt",
    "felt",
    "gift",
    "raft",
    "had",
    "ten",
    "lap",
    "net",
    "bet",
    "jug",
    "cap",
    "bun",
    "men",
    "wet",
    "fit"
   ],
   "build": [
    {
     "word": "hand",
     "a": "ha",
     "b": "nd",
     "altA": "te",
     "altB": "mp"
    },
    {
     "word": "tent",
     "a": "te",
     "b": "nt",
     "altA": "la",
     "altB": "st"
    },
    {
     "word": "lamp",
     "a": "la",
     "b": "mp",
     "altA": "ne",
     "altB": "nd"
    },
    {
     "word": "nest",
     "a": "ne",
     "b": "st",
     "altA": "ha",
     "altB": "mp"
    },
    {
     "word": "desk",
     "a": "de",
     "b": "sk",
     "altA": "be",
     "altB": "lt"
    },
    {
     "word": "gift",
     "a": "gi",
     "b": "ft",
     "altA": "ju",
     "altB": "sk"
    }
   ],
   "chains": [
    [
     "belt",
     "melt",
     "felt",
     "left",
     "lift",
     "gift",
     "raft"
    ],
    [
     "hand",
     "band",
     "bend",
     "bent",
     "tent",
     "went"
    ]
   ],
   "scramble": [
    "hand",
    "tent",
    "lamp",
    "nest",
    "desk",
    "gift"
   ],
   "feed": [
    "hand",
    "tent",
    "lamp",
    "nest",
    "desk",
    "gift",
    "jump",
    "belt"
   ],
   "sentences": [
    {
     "text": "They went to the pond.",
     "words": [
      "They",
      "went",
      "to",
      "the",
      "pond."
     ]
    },
    {
     "text": "The tent is on the sand.",
     "words": [
      "The",
      "tent",
      "is",
      "on",
      "the",
      "sand."
     ]
    },
    {
     "text": "We jump on the sand.",
     "words": [
      "We",
      "jump",
      "on",
      "the",
      "sand."
     ]
    },
    {
     "text": "The mask is on the desk.",
     "words": [
      "The",
      "mask",
      "is",
      "on",
      "the",
      "desk."
     ]
    },
    {
     "text": "The frost can melt.",
     "words": [
      "The",
      "frost",
      "can",
      "melt."
     ]
    },
    {
     "text": "I felt the gift.",
     "words": [
      "I",
      "felt",
      "the",
      "gift."
     ]
    }
   ],
   "rhyme": [
    {
     "prompt": "hand",
     "choices": [
      "sand",
      "hint",
      "help"
     ],
     "answer": "sand"
    },
    {
     "prompt": "tent",
     "choices": [
      "went",
      "ten",
      "test"
     ],
     "answer": "went"
    },
    {
     "prompt": "lamp",
     "choices": [
      "camp",
      "land",
      "limp"
     ],
     "answer": "camp"
    },
    {
     "prompt": "nest",
     "choices": [
      "best",
      "net",
      "nut"
     ],
     "answer": "best"
    },
    {
     "prompt": "belt",
     "choices": [
      "felt",
      "bell",
      "bent"
     ],
     "answer": "felt"
    },
    {
     "prompt": "jump",
     "choices": [
      "bump",
      "just",
      "jam"
     ],
     "answer": "bump"
    }
   ],
   "fishLabel": "ends with a blend",
   "fishYes": [
    "hand",
    "tent",
    "lamp",
    "nest",
    "desk",
    "gift"
   ],
   "fishNo": [
    "had",
    "ten",
    "lap",
    "net",
    "den",
    "fig"
   ],
   "bins": [
    {
     "id": "nd",
     "label": "-nd"
    },
    {
     "id": "nt",
     "label": "-nt"
    },
    {
     "id": "mp",
     "label": "-mp"
    },
    {
     "id": "st",
     "label": "-st"
    }
   ],
   "sort": [
    {
     "word": "hand",
     "bin": "nd"
    },
    {
     "word": "tent",
     "bin": "nt"
    },
    {
     "word": "lamp",
     "bin": "mp"
    },
    {
     "word": "nest",
     "bin": "st"
    },
    {
     "word": "sand",
     "bin": "nd"
    },
    {
     "word": "went",
     "bin": "nt"
    },
    {
     "word": "jump",
     "bin": "mp"
    },
    {
     "word": "best",
     "bin": "st"
    },
    {
     "word": "pond",
     "bin": "nd"
    },
    {
     "word": "camp",
     "bin": "mp"
    }
   ],
   "which": [
    {
     "word": "hand",
     "part": "nd"
    },
    {
     "word": "tent",
     "part": "nt"
    },
    {
     "word": "lamp",
     "part": "mp"
    },
    {
     "word": "nest",
     "part": "st"
    },
    {
     "word": "desk",
     "part": "sk"
    },
    {
     "word": "belt",
     "part": "lt"
    },
    {
     "word": "gift",
     "part": "ft"
    },
    {
     "word": "pond",
     "part": "nd"
    }
   ],
   "whichChoices": [
    "nd",
    "nt",
    "mp",
    "st",
    "sk",
    "lt",
    "ft"
   ],
   "whichLabel": "Tap the ending blend.",
   "check": [
    {
     "type": "pick",
     "word": "glad",
     "choices": [
      "glad",
      "lad",
      "gad"
     ]
    },
    {
     "type": "pick",
     "word": "blob",
     "choices": [
      "blob",
      "bob",
      "lob"
     ]
    },
    {
     "type": "pick",
     "word": "crib",
     "choices": [
      "crib",
      "rib",
      "crab"
     ]
    },
    {
     "type": "pick",
     "word": "desk",
     "choices": [
      "desk",
      "dusk",
      "disk"
     ]
    },
    {
     "type": "pick",
     "word": "trot",
     "choices": [
      "trot",
      "rot",
      "tot"
     ]
    },
    {
     "type": "pick",
     "word": "spill",
     "choices": [
      "spill",
      "pill",
      "still"
     ]
    },
    {
     "type": "pick",
     "word": "hand",
     "choices": [
      "hand",
      "had",
      "band"
     ]
    },
    {
     "type": "pick",
     "word": "spent",
     "choices": [
      "spent",
      "pent",
      "spend"
     ]
    },
    {
     "type": "pick",
     "word": "swim",
     "choices": [
      "swim",
      "win",
      "skim"
     ]
    },
    {
     "type": "pick",
     "word": "plant",
     "choices": [
      "plant",
      "pant",
      "plan"
     ]
    }
   ],
   "heart": [
    {
     "w": "they"
    }
   ],
   "newWords": [
    "gust"
   ],
   "pics": {
    "hand": "img/u2pics/hand.webp",
    "tent": "img/u2pics/tent.webp",
    "lamp": "img/u2pics/lamp.webp",
    "nest": "img/u2pics/nest.webp",
    "desk": "img/u2pics/desk.webp",
    "gift": "img/u2pics/gift.webp",
    "belt": "img/u2pics/belt.webp",
    "mask": "img/u2pics/mask.webp",
    "raft": "img/u2pics/raft.webp",
    "plant": "img/u2pics/plant.webp"
   },
   "story": [
    {
     "text": "Zip and Frill plan a trip.",
     "words": [
      "Zip",
      "and",
      "Frill",
      "plan",
      "a",
      "trip."
     ],
     "img": "img/u24_art1.webp"
    },
    {
     "text": "They get a raft. It is a big raft!",
     "words": [
      "They",
      "get",
      "a",
      "raft.",
      "It",
      "is",
      "a",
      "big",
      "raft!"
     ],
     "img": "img/u24_art1.webp"
    },
    {
     "text": "Zip can grab a tent and a lamp. Frill can grab a plum.",
     "words": [
      "Zip",
      "can",
      "grab",
      "a",
      "tent",
      "and",
      "a",
      "lamp.",
      "Frill",
      "can",
      "grab",
      "a",
      "plum."
     ],
     "img": "img/u24_art2.webp"
    },
    {
     "text": "The raft went on the pond. Drip, drip, drip!",
     "words": [
      "The",
      "raft",
      "went",
      "on",
      "the",
      "pond.",
      "Drip,",
      "drip,",
      "drip!"
     ],
     "img": "img/u24_art3.webp"
    },
    {
     "text": "Plop! A frog is on the raft. The frog is glad.",
     "words": [
      "Plop!",
      "A",
      "frog",
      "is",
      "on",
      "the",
      "raft.",
      "The",
      "frog",
      "is",
      "glad."
     ],
     "img": "img/u24_art3.webp"
    },
    {
     "text": "Zip, Frill and the frog swim and swim.",
     "words": [
      "Zip,",
      "Frill",
      "and",
      "the",
      "frog",
      "swim",
      "and",
      "swim."
     ],
     "img": "img/u24_art4.webp"
    },
    {
     "text": "A gust hit the raft. Zip and Frill did not slip.",
     "words": [
      "A",
      "gust",
      "hit",
      "the",
      "raft.",
      "Zip",
      "and",
      "Frill",
      "did",
      "not",
      "slip."
     ],
     "img": "img/u24_art4.webp"
    },
    {
     "text": "They land on the sand. Zip set up the tent.",
     "words": [
      "They",
      "land",
      "on",
      "the",
      "sand.",
      "Zip",
      "set",
      "up",
      "the",
      "tent."
     ],
     "img": "img/u24_art5.webp"
    },
    {
     "text": "Frill lit the lamp. They sat on a log and had a plum.",
     "words": [
      "Frill",
      "lit",
      "the",
      "lamp.",
      "They",
      "sat",
      "on",
      "a",
      "log",
      "and",
      "had",
      "a",
      "plum."
     ],
     "img": "img/u24_art5.webp"
    },
    {
     "text": "What a fun trip! Zip and Frill felt glad.",
     "words": [
      "What",
      "a",
      "fun",
      "trip!",
      "Zip",
      "and",
      "Frill",
      "felt",
      "glad."
     ],
     "img": "img/u24_art6.webp"
    }
   ],
   "days": [
    "-nd and -nt",
    "-mp, -st, -sk",
    "-lt, -ft, both ends"
   ],
   "dayWords": [
    [
     "hand",
     "sand",
     "land",
     "band",
     "tent",
     "went",
     "bent",
     "pond"
    ],
    [
     "lamp",
     "camp",
     "jump",
     "bump",
     "nest",
     "best",
     "mask",
     "desk"
    ],
    [
     "belt",
     "melt",
     "felt",
     "gift",
     "raft",
     "plant",
     "stamp",
     "frost"
    ]
   ],
   "daySent": [
    [
     "They went to the pond.",
     "The tent is on the sand."
    ],
    [
     "We jump on the sand.",
     "The mask is on the desk."
    ],
    [
     "The frost can melt.",
     "I felt the gift."
    ]
   ],
   "dayDict": [
    [
     [
      "hand",
      "bent",
      "went"
     ],
     "The tent is on the sand."
    ],
    [
     [
      "nest",
      "mask",
      "desk"
     ],
     "The mask is on the desk."
    ],
    [
     [
      "stamp",
      "plant",
      "gift"
     ],
     "I felt the gift."
    ]
   ]
  },
  {
   "key": "u31",
   "n": "3.1",
   "unit": 3,
   "name": "sh, ch, th",
   "storyTitle": "The Fish and the Chips",
   "blurb": "Two letters, one sound: sh, ch, and th (both th sounds).",
   "focus": [
    "sh",
    "ch",
    "th"
   ],
   "focusKind": "digraph",
   "vowels": "aeiou",
   "label": "sh, ch, or th",
   "keyword": "ship, chick, thumb",
   "meet": [
    {
     "who": "zip",
     "audio": "u31_m1",
     "word": "ship",
     "chips": [
      "ship",
      "shop",
      "fish",
      "dish"
     ],
     "cap": "s and h make one new sound.",
     "text": "Ship. Shop. Fish. Dish. Two letters, s and h, make one new sound. Finger on your lips: quiet!"
    },
    {
     "who": "frill",
     "audio": "u31_m2",
     "word": "chip",
     "chips": [
      "chip",
      "chop",
      "chin",
      "much"
     ],
     "cap": "c and h make one new sound.",
     "text": "Chip. Chop. Chin. Much. c and h make one quick sound, like a sneeze."
    },
    {
     "who": "zip",
     "audio": "u31_m3",
     "word": "thin",
     "chips": [
      "thin",
      "math",
      "this",
      "that"
     ],
     "cap": "Tongue out a little for th.",
     "text": "Thin. Math. This. That. Put your tongue out a little. Th can be quiet or buzzy."
    }
   ],
   "hear": [
    {
     "word": "ship",
     "choices": [
      "ship",
      "chip",
      "sip"
     ]
    },
    {
     "word": "chop",
     "choices": [
      "chop",
      "shop",
      "cop"
     ]
    },
    {
     "word": "thin",
     "choices": [
      "thin",
      "tin",
      "shin"
     ]
    },
    {
     "word": "fish",
     "choices": [
      "fish",
      "fit",
      "fizz"
     ]
    },
    {
     "word": "much",
     "choices": [
      "much",
      "mush",
      "mud"
     ]
    },
    {
     "word": "path",
     "choices": [
      "path",
      "pat",
      "pass"
     ]
    },
    {
     "word": "chin",
     "choices": [
      "chin",
      "shin",
      "thin"
     ]
    },
    {
     "word": "dish",
     "choices": [
      "dish",
      "did",
      "dash"
     ]
    }
   ],
   "bellWords": [
    "ship",
    "shop",
    "shed",
    "shut",
    "fish",
    "dish",
    "wish",
    "cash",
    "mash",
    "chip",
    "chop",
    "chin",
    "chat",
    "much",
    "rich",
    "thin",
    "math",
    "bath",
    "path",
    "moth",
    "sip",
    "cop",
    "tin",
    "fit",
    "mud",
    "pat",
    "dim",
    "hip",
    "cat",
    "mat",
    "bat",
    "top",
    "mop"
   ],
   "build": [
    {
     "word": "ship",
     "a": "sh",
     "b": "ip",
     "altA": "ch",
     "altB": "op"
    },
    {
     "word": "chop",
     "a": "ch",
     "b": "op",
     "altA": "sh",
     "altB": "in"
    },
    {
     "word": "thin",
     "a": "th",
     "b": "in",
     "altA": "ch",
     "altB": "ap"
    },
    {
     "word": "fish",
     "a": "fi",
     "b": "sh",
     "altA": "ba",
     "altB": "th"
    },
    {
     "word": "much",
     "a": "mu",
     "b": "ch",
     "altA": "pa",
     "altB": "sh"
    },
    {
     "word": "path",
     "a": "pa",
     "b": "th",
     "altA": "di",
     "altB": "ch"
    }
   ],
   "chains": [
    [
     "ship",
     "shop",
     "chop",
     "chip",
     "chin",
     "thin"
    ],
    [
     "math",
     "mash",
     "cash",
     "bash",
     "bath",
     "path"
    ]
   ],
   "scramble": [
    "ship",
    "chop",
    "thin",
    "fish",
    "much",
    "path"
   ],
   "feed": [
    "ship",
    "chop",
    "thin",
    "fish",
    "much",
    "path",
    "chin",
    "dish"
   ],
   "sentences": [
    {
     "text": "The ship is in the shed.",
     "words": [
      "The",
      "ship",
      "is",
      "in",
      "the",
      "shed."
     ]
    },
    {
     "text": "I put chips in a dish.",
     "words": [
      "I",
      "put",
      "chips",
      "in",
      "a",
      "dish."
     ]
    },
    {
     "text": "That moth is on the path.",
     "words": [
      "That",
      "moth",
      "is",
      "on",
      "the",
      "path."
     ]
    },
    {
     "text": "Then we chat and munch.",
     "words": [
      "Then",
      "we",
      "chat",
      "and",
      "munch."
     ]
    },
    {
     "text": "I wish I had a fish.",
     "words": [
      "I",
      "wish",
      "I",
      "had",
      "a",
      "fish."
     ]
    },
    {
     "text": "This math is fun.",
     "words": [
      "This",
      "math",
      "is",
      "fun."
     ]
    }
   ],
   "rhyme": [
    {
     "prompt": "ship",
     "choices": [
      "chip",
      "shop",
      "shed"
     ],
     "answer": "chip"
    },
    {
     "prompt": "fish",
     "choices": [
      "dish",
      "fizz",
      "fit"
     ],
     "answer": "dish"
    },
    {
     "prompt": "chop",
     "choices": [
      "shop",
      "chip",
      "chat"
     ],
     "answer": "shop"
    },
    {
     "prompt": "path",
     "choices": [
      "math",
      "pat",
      "push"
     ],
     "answer": "math"
    },
    {
     "prompt": "cash",
     "choices": [
      "mash",
      "cat",
      "chin"
     ],
     "answer": "mash"
    },
    {
     "prompt": "thin",
     "choices": [
      "chin",
      "then",
      "this"
     ],
     "answer": "chin"
    }
   ],
   "fishLabel": "has sh, ch, or th",
   "fishYes": [
    "ship",
    "chop",
    "thin",
    "fish",
    "much",
    "path"
   ],
   "fishNo": [
    "sip",
    "cop",
    "tin",
    "fit",
    "mud",
    "pat"
   ],
   "bins": [
    {
     "id": "sh",
     "label": "sh"
    },
    {
     "id": "ch",
     "label": "ch"
    },
    {
     "id": "th",
     "label": "th"
    }
   ],
   "sort": [
    {
     "word": "ship",
     "bin": "sh"
    },
    {
     "word": "chop",
     "bin": "ch"
    },
    {
     "word": "thin",
     "bin": "th"
    },
    {
     "word": "fish",
     "bin": "sh"
    },
    {
     "word": "much",
     "bin": "ch"
    },
    {
     "word": "path",
     "bin": "th"
    },
    {
     "word": "dish",
     "bin": "sh"
    },
    {
     "word": "chin",
     "bin": "ch"
    },
    {
     "word": "math",
     "bin": "th"
    },
    {
     "word": "shed",
     "bin": "sh"
    }
   ],
   "which": [
    {
     "word": "ship",
     "part": "sh"
    },
    {
     "word": "chop",
     "part": "ch"
    },
    {
     "word": "thin",
     "part": "th"
    },
    {
     "word": "fish",
     "part": "sh"
    },
    {
     "word": "much",
     "part": "ch"
    },
    {
     "word": "path",
     "part": "th"
    },
    {
     "word": "chin",
     "part": "ch"
    },
    {
     "word": "dish",
     "part": "sh"
    }
   ],
   "whichChoices": [
    "sh",
    "ch",
    "th"
   ],
   "whichLabel": "Tap the two letters that make one sound.",
   "check": [
    {
     "type": "pick",
     "word": "ship",
     "choices": [
      "ship",
      "chip",
      "sip"
     ]
    },
    {
     "type": "pick",
     "word": "chop",
     "choices": [
      "chop",
      "shop",
      "cop"
     ]
    },
    {
     "type": "pick",
     "word": "thin",
     "choices": [
      "thin",
      "tin",
      "shin"
     ]
    },
    {
     "type": "pick",
     "word": "fish",
     "choices": [
      "fish",
      "fit",
      "fizz"
     ]
    },
    {
     "type": "pick",
     "word": "much",
     "choices": [
      "much",
      "mush",
      "mud"
     ]
    },
    {
     "type": "pick",
     "word": "path",
     "choices": [
      "path",
      "pat",
      "pass"
     ]
    },
    {
     "type": "pick",
     "word": "chin",
     "choices": [
      "chin",
      "shin",
      "thin"
     ]
    },
    {
     "type": "pick",
     "word": "dish",
     "choices": [
      "dish",
      "did",
      "dash"
     ]
    },
    {
     "type": "pick",
     "word": "shed",
     "choices": [
      "shed",
      "said",
      "sled"
     ]
    },
    {
     "type": "pick",
     "word": "math",
     "choices": [
      "math",
      "mash",
      "mat"
     ]
    }
   ],
   "heart": [
    {
     "w": "put"
    },
    {
     "w": "want"
    }
   ],
   "newWords": [
    "champ"
   ],
   "pics": {
    "ship": "img/u3pics/ship.webp",
    "fish": "img/u3pics/fish.webp",
    "dish": "img/u3pics/dish.webp",
    "chin": "img/u3pics/chin.webp",
    "bath": "img/u3pics/bath.webp",
    "moth": "img/u3pics/moth.webp",
    "shell": "img/u3pics/shell.webp"
   },
   "story": [
    {
     "text": "Zip and Frill get on a ship.",
     "words": [
      "Zip",
      "and",
      "Frill",
      "get",
      "on",
      "a",
      "ship."
     ],
     "img": "img/u31_p01.webp"
    },
    {
     "text": "The ship has a red shed on top.",
     "words": [
      "The",
      "ship",
      "has",
      "a",
      "red",
      "shed",
      "on",
      "top."
     ],
     "img": "img/u31_p02.webp"
    },
    {
     "text": "Frill gets a dish of chips from the shed.",
     "words": [
      "Frill",
      "gets",
      "a",
      "dish",
      "of",
      "chips",
      "from",
      "the",
      "shed."
     ],
     "img": "img/u31_p03.webp"
    },
    {
     "text": "Then a big fish flips up. Smash!",
     "words": [
      "Then",
      "a",
      "big",
      "fish",
      "flips",
      "up.",
      "Smash!"
     ],
     "img": "img/u31_p04.webp"
    },
    {
     "text": "The fish grabs a chip and a chip and a chip!",
     "words": [
      "The",
      "fish",
      "grabs",
      "a",
      "chip",
      "and",
      "a",
      "chip",
      "and",
      "a",
      "chip!"
     ],
     "img": "img/u31_p05.webp"
    },
    {
     "text": "That fish is a champ! Zip and Frill chat and munch.",
     "words": [
      "That",
      "fish",
      "is",
      "a",
      "champ!",
      "Zip",
      "and",
      "Frill",
      "chat",
      "and",
      "munch."
     ],
     "img": "img/u31_p06.webp"
    }
   ],
   "days": [
    "sh",
    "ch",
    "th and mix"
   ],
   "dayWords": [
    [
     "ship",
     "shop",
     "shed",
     "shut",
     "fish",
     "dish",
     "wish",
     "cash",
     "mash"
    ],
    [
     "chip",
     "chop",
     "chin",
     "chat",
     "much",
     "such",
     "rich",
     "chest"
    ],
    [
     "thin",
     "math",
     "bath",
     "path",
     "with",
     "moth",
     "this",
     "that",
     "then"
    ]
   ],
   "daySent": [
    [
     "The ship is in the shed.",
     "I wish I had a fish."
    ],
    [
     "I put chips in a dish.",
     "Then we chat and munch."
    ],
    [
     "That moth is on the path.",
     "This math is fun."
    ]
   ],
   "dayDict": [
    [
     [
      "ship",
      "fish",
      "shop"
     ],
     "The ship is in the shed."
    ],
    [
     [
      "chip",
      "chin",
      "much"
     ],
     "I put chips in a dish."
    ],
    [
     [
      "thin",
      "path",
      "with"
     ],
     "That moth is on the path."
    ]
   ]
  },
  {
   "key": "u32",
   "n": "3.2",
   "unit": 3,
   "name": "ck and wh",
   "storyTitle": "The Duck and the Sock",
   "blurb": "ck after a short vowel. wh at the start. Then mix every digraph.",
   "focus": [
    "ck",
    "wh"
   ],
   "focusKind": "digraph",
   "vowels": "aeiou",
   "label": "ck or wh",
   "keyword": "duck, whale",
   "meet": [
    {
     "who": "zip",
     "audio": "u32_m1",
     "word": "duck",
     "chips": [
      "duck",
      "sock",
      "back",
      "kick"
     ],
     "cap": "c and k together say one sound.",
     "text": "Duck. Sock. Back. Kick. c and k together make one sound, right after a short vowel. Listen.",
     "snd": "k"
    },
    {
     "who": "frill",
     "audio": "u32_m2",
     "word": "whip",
     "chips": [
      "whip",
      "when",
      "which",
      "whiz"
     ],
     "cap": "wh at the start says the w sound.",
     "text": "Whip. When. Which. Whiz. w and h at the start make the w sound, with a puff of air."
    },
    {
     "who": "zip",
     "audio": "u32_m3",
     "word": "black",
     "chips": [
      "black",
      "clock",
      "stuck",
      "quack"
     ],
     "cap": "Mix it all.",
     "text": "Black. Clock. Stuck. Quack! Now we can read blends and digraphs together."
    }
   ],
   "hear": [
    {
     "word": "duck",
     "choices": [
      "duck",
      "dug",
      "dock"
     ]
    },
    {
     "word": "sock",
     "choices": [
      "sock",
      "sack",
      "sob"
     ]
    },
    {
     "word": "kick",
     "choices": [
      "kick",
      "kit",
      "pick"
     ]
    },
    {
     "word": "whip",
     "choices": [
      "whip",
      "hip",
      "ship"
     ]
    },
    {
     "word": "when",
     "choices": [
      "when",
      "hen",
      "then"
     ]
    },
    {
     "word": "back",
     "choices": [
      "back",
      "bag",
      "black"
     ]
    },
    {
     "word": "rock",
     "choices": [
      "rock",
      "rot",
      "sock"
     ]
    },
    {
     "word": "neck",
     "choices": [
      "neck",
      "net",
      "deck"
     ]
    }
   ],
   "bellWords": [
    "duck",
    "sock",
    "back",
    "kick",
    "pick",
    "rock",
    "neck",
    "sack",
    "luck",
    "pack",
    "deck",
    "tick",
    "whip",
    "when",
    "dug",
    "sob",
    "kit",
    "hip",
    "hen",
    "bag",
    "rot",
    "net",
    "sat",
    "lug",
    "pan",
    "den",
    "tin",
    "win"
   ],
   "build": [
    {
     "word": "duck",
     "a": "du",
     "b": "ck",
     "altA": "si",
     "altB": "sh"
    },
    {
     "word": "sock",
     "a": "so",
     "b": "ck",
     "altA": "ba",
     "altB": "ch"
    },
    {
     "word": "kick",
     "a": "ki",
     "b": "ck",
     "altA": "ne",
     "altB": "th"
    },
    {
     "word": "whip",
     "a": "wh",
     "b": "ip",
     "altA": "sh",
     "altB": "en"
    },
    {
     "word": "when",
     "a": "wh",
     "b": "en",
     "altA": "th",
     "altB": "ip"
    },
    {
     "word": "back",
     "a": "ba",
     "b": "ck",
     "altA": "lu",
     "altB": "sh"
    }
   ],
   "chains": [
    [
     "back",
     "pack",
     "pick",
     "kick",
     "tick",
     "tack",
     "sack",
     "sock"
    ],
    [
     "duck",
     "luck",
     "lick",
     "lock",
     "rock",
     "dock"
    ]
   ],
   "scramble": [
    "duck",
    "sock",
    "kick",
    "whip",
    "when",
    "back"
   ],
   "feed": [
    "duck",
    "sock",
    "kick",
    "whip",
    "when",
    "back",
    "rock",
    "neck"
   ],
   "sentences": [
    {
     "text": "The duck is on the rock.",
     "words": [
      "The",
      "duck",
      "is",
      "on",
      "the",
      "rock."
     ]
    },
    {
     "text": "Pick up the sock.",
     "words": [
      "Pick",
      "up",
      "the",
      "sock."
     ]
    },
    {
     "text": "When can we get a snack?",
     "words": [
      "When",
      "can",
      "we",
      "get",
      "a",
      "snack?"
     ]
    },
    {
     "text": "Which sack is black?",
     "words": [
      "Which",
      "sack",
      "is",
      "black?"
     ]
    },
    {
     "text": "Where is the clock?",
     "words": [
      "Where",
      "is",
      "the",
      "clock?"
     ]
    },
    {
     "text": "Who is stuck in the mud?",
     "words": [
      "Who",
      "is",
      "stuck",
      "in",
      "the",
      "mud?"
     ]
    }
   ],
   "rhyme": [
    {
     "prompt": "duck",
     "choices": [
      "luck",
      "dock",
      "deck"
     ],
     "answer": "luck"
    },
    {
     "prompt": "sock",
     "choices": [
      "rock",
      "sack",
      "sick"
     ],
     "answer": "rock"
    },
    {
     "prompt": "kick",
     "choices": [
      "pick",
      "kit",
      "back"
     ],
     "answer": "pick"
    },
    {
     "prompt": "back",
     "choices": [
      "pack",
      "beck",
      "bag"
     ],
     "answer": "pack"
    },
    {
     "prompt": "when",
     "choices": [
      "hen",
      "whip",
      "wet"
     ],
     "answer": "hen"
    },
    {
     "prompt": "whip",
     "choices": [
      "ship",
      "which",
      "whiz"
     ],
     "answer": "ship"
    }
   ],
   "fishLabel": "has ck or wh",
   "fishYes": [
    "duck",
    "sock",
    "kick",
    "whip",
    "when",
    "back"
   ],
   "fishNo": [
    "dug",
    "sob",
    "kit",
    "hip",
    "hen",
    "bag"
   ],
   "bins": [
    {
     "id": "ck",
     "label": "ck"
    },
    {
     "id": "wh",
     "label": "wh"
    },
    {
     "id": "sh",
     "label": "sh"
    },
    {
     "id": "ch",
     "label": "ch"
    }
   ],
   "sort": [
    {
     "word": "duck",
     "bin": "ck"
    },
    {
     "word": "whip",
     "bin": "wh"
    },
    {
     "word": "ship",
     "bin": "sh"
    },
    {
     "word": "chop",
     "bin": "ch"
    },
    {
     "word": "sock",
     "bin": "ck"
    },
    {
     "word": "when",
     "bin": "wh"
    },
    {
     "word": "fish",
     "bin": "sh"
    },
    {
     "word": "much",
     "bin": "ch"
    },
    {
     "word": "back",
     "bin": "ck"
    },
    {
     "word": "which",
     "bin": "wh"
    }
   ],
   "which": [
    {
     "word": "duck",
     "part": "ck"
    },
    {
     "word": "sock",
     "part": "ck"
    },
    {
     "word": "whip",
     "part": "wh"
    },
    {
     "word": "when",
     "part": "wh"
    },
    {
     "word": "kick",
     "part": "ck"
    },
    {
     "word": "ship",
     "part": "sh"
    },
    {
     "word": "chin",
     "part": "ch"
    },
    {
     "word": "thin",
     "part": "th"
    }
   ],
   "whichChoices": [
    "ck",
    "wh",
    "sh",
    "ch",
    "th"
   ],
   "whichLabel": "Tap the two letters that make one sound.",
   "check": [
    {
     "type": "pick",
     "word": "duck",
     "choices": [
      "duck",
      "dug",
      "dock"
     ]
    },
    {
     "type": "pick",
     "word": "sock",
     "choices": [
      "sock",
      "sack",
      "sob"
     ]
    },
    {
     "type": "pick",
     "word": "kick",
     "choices": [
      "kick",
      "kit",
      "pick"
     ]
    },
    {
     "type": "pick",
     "word": "whip",
     "choices": [
      "whip",
      "hip",
      "ship"
     ]
    },
    {
     "type": "pick",
     "word": "when",
     "choices": [
      "when",
      "hen",
      "then"
     ]
    },
    {
     "type": "pick",
     "word": "back",
     "choices": [
      "back",
      "bag",
      "black"
     ]
    },
    {
     "type": "pick",
     "word": "ship",
     "choices": [
      "ship",
      "chip",
      "sip"
     ]
    },
    {
     "type": "pick",
     "word": "chop",
     "choices": [
      "chop",
      "shop",
      "cop"
     ]
    },
    {
     "type": "pick",
     "word": "thin",
     "choices": [
      "thin",
      "tin",
      "shin"
     ]
    },
    {
     "type": "pick",
     "word": "clock",
     "choices": [
      "clock",
      "lock",
      "cluck"
     ]
    }
   ],
   "heart": [
    {
     "w": "where"
    },
    {
     "w": "who"
    }
   ],
   "newWords": [
    "quack"
   ],
   "pics": {
    "duck": "img/u3pics/duck.webp",
    "sock": "img/u3pics/sock.webp",
    "clock": "img/u3pics/clock.webp",
    "rock": "img/u3pics/rock.webp",
    "sack": "img/u3pics/sack.webp"
   },
   "story": [
    {
     "text": "Zip has a black sack.",
     "words": [
      "Zip",
      "has",
      "a",
      "black",
      "sack."
     ],
     "img": "img/u32_p01.webp"
    },
    {
     "text": "In the sack is a clock and a sock.",
     "words": [
      "In",
      "the",
      "sack",
      "is",
      "a",
      "clock",
      "and",
      "a",
      "sock."
     ],
     "img": "img/u32_p02.webp"
    },
    {
     "text": "Quack! A duck pecks at the sack.",
     "words": [
      "Quack!",
      "A",
      "duck",
      "pecks",
      "at",
      "the",
      "sack."
     ],
     "img": "img/u32_p03.webp"
    },
    {
     "text": "Which duck is that? Frill asks.",
     "words": [
      "Which",
      "duck",
      "is",
      "that?",
      "Frill",
      "asks."
     ],
     "img": "img/u32_p04.webp"
    },
    {
     "text": "The duck grabs the sock and runs back to the pond.",
     "words": [
      "The",
      "duck",
      "grabs",
      "the",
      "sock",
      "and",
      "runs",
      "back",
      "to",
      "the",
      "pond."
     ],
     "img": "img/u32_p05.webp"
    },
    {
     "text": "Whiz! Zip and Frill get the sock back. When will that duck stop?",
     "words": [
      "Whiz!",
      "Zip",
      "and",
      "Frill",
      "get",
      "the",
      "sock",
      "back.",
      "When",
      "will",
      "that",
      "duck",
      "stop?"
     ],
     "img": "img/u32_p06.webp"
    }
   ],
   "days": [
    "ck",
    "wh",
    "Mix all digraphs"
   ],
   "dayWords": [
    [
     "duck",
     "sock",
     "back",
     "kick",
     "pick",
     "rock",
     "neck",
     "sack",
     "luck"
    ],
    [
     "whip",
     "when",
     "which",
     "whiz",
     "whiff",
     "whim"
    ],
    [
     "stuck",
     "trick",
     "black",
     "clock",
     "snack",
     "ship",
     "chop",
     "thin",
     "quack"
    ]
   ],
   "daySent": [
    [
     "The duck is on the rock.",
     "Pick up the sock."
    ],
    [
     "When can we get a snack?",
     "Which sack is black?"
    ],
    [
     "Where is the clock?",
     "Who is stuck in the mud?"
    ]
   ],
   "dayDict": [
    [
     [
      "duck",
      "sock",
      "kick"
     ],
     "Pick up the sock."
    ],
    [
     [
      "whip",
      "when",
      "which"
     ],
     "Which sack is black?"
    ],
    [
     [
      "black",
      "stuck",
      "chop"
     ],
     "The duck is on the rock."
    ]
   ]
  }
 ]
};
