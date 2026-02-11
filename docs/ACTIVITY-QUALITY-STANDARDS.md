# Activity Quality Standards

**Purpose:** Guidelines for creating high-quality interactive activities that test understanding, not just recall.

**Last Updated:** 2026-02-11

---

## General Principles

All activities, regardless of type, must follow these core principles:

### 1. Clear, Concise Instructions
- **Maximum 1-2 sentences** for instructions
- Use active voice ("Match each term..." not "Terms should be matched...")
- Avoid jargon unless it's being taught in the lesson
- State the goal clearly (what the student will demonstrate)

**Examples:**
- ✅ GOOD: "Match each organelle to its function in the cell."
- ❌ POOR: "In this activity, you will be matching various cellular organelles to their respective functions within the cellular environment."

---

### 2. Meaningful Feedback
Feedback should **educate**, not just confirm correctness.

| Quality Level | Example | Why |
|--------------|---------|-----|
| ❌ **Poor** | "Correct!" | Doesn't teach anything |
| ⚠️ **OK** | "Correct! Mitochondria produce ATP." | States a fact but doesn't explain significance |
| ✅ **Excellent** | "Correct! Mitochondria are called the powerhouse of the cell because they produce ATP through cellular respiration, which provides energy for all cellular processes." | Explains WHY and connects to bigger concept |

**For wrong answers:**
- Explain WHY it's incorrect
- Provide a hint toward the correct answer
- Don't just say "Try again"

**Example:**
- ✅ GOOD: "Not quite. While the nucleus contains DNA, it doesn't produce energy. Remember, we're looking for the organelle that produces ATP through cellular respiration."

---

### 3. Test Understanding, Not Just Recall

Activities should require **application** or **analysis**, not just memorisation.

| Recall (❌ Avoid) | Understanding (✅ Aim For) |
|------------------|--------------------------|
| "What is the powerhouse of the cell?" | "Which organelle would be most abundant in a muscle cell that requires high energy?" |
| "Define osmosis" | "Predict what will happen to a plant cell in a hypertonic solution" |
| "List the phases of mitosis" | "Arrange the phases of mitosis in the correct order and explain what happens in each" |

---

### 4. Appropriate Difficulty

- **Too easy:** Student can guess without understanding
- **Too hard:** Student gives up or feels frustrated
- **Just right:** Student must think but can succeed with lesson knowledge

**Difficulty indicators:**
- Foundational: Direct application of a single concept
- Intermediate: Combining 2-3 concepts
- Advanced: Multi-step reasoning or analysis

---

### 5. Real-World Context (When Possible)

Ground abstract concepts in concrete examples students can relate to.

**Examples:**
- Osmosis → "Why do you get thirsty after eating salty chips?"
- Photosynthesis → "Why does a plant placed in a dark cupboard turn yellow?"
- Cell division → "How does a small fertilised egg become a fully-grown human?"

---

## Activity-Specific Standards

### Matching Activities

**Format:** Pairs of related items (term ↔ definition, cause ↔ effect, structure ↔ function)

**Quality Standards:**
- **5-8 pairs** (not too few to be trivial, not too many to be overwhelming)
- **Distinct items** - no ambiguity about which pairs match
- **Balanced difficulty** - mix of easy, medium, hard pairs
- **Meaningful connections** - not arbitrary associations

**✅ EXCELLENT Example:**
```json
{
  "type": "matching",
  "title": "Match Cell Organelles to Their Functions",
  "items": [
    {
      "text": "Mitochondria",
      "match": "Produces ATP through cellular respiration"
    },
    {
      "text": "Ribosome",
      "match": "Synthesises proteins from amino acids"
    },
    {
      "text": "Chloroplast",
      "match": "Converts light energy into glucose through photosynthesis"
    },
    {
      "text": "Nucleus",
      "match": "Stores and protects DNA, controls gene expression"
    },
    {
      "text": "Cell membrane",
      "match": "Controls what enters and exits the cell"
    }
  ]
}
```

**❌ POOR Example:**
```json
{
  "items": [
    { "text": "Cell", "match": "Building block of life" },  // Too vague
    { "text": "DNA", "match": "In the nucleus" },  // Not a function
    { "text": "Enzyme", "match": "Protein" }  // Too simplistic
  ]
}
```

---

### Classification Activities

**Format:** Sort items into 2-4 categories

**Quality Standards:**
- **3-4 categories** (2 is too simple, 5+ is overwhelming)
- **10-15 items total** (2-5 per category)
- **Clear category definitions** with examples
- **No ambiguous items** - each belongs clearly to one category
- **Educational groupings** - categories teach a concept (not arbitrary)

**✅ EXCELLENT Example:**
```json
{
  "type": "classification",
  "title": "Classify Organisms by Cell Type",
  "categories": [
    {
      "id": "prokaryote",
      "label": "Prokaryotes",
      "description": "Single-celled organisms without a nucleus"
    },
    {
      "id": "eukaryote",
      "label": "Eukaryotes",
      "description": "Organisms with cells containing a nucleus"
    }
  ],
  "items": [
    { "text": "E. coli bacteria", "category": "prokaryote" },
    { "text": "Human", "category": "eukaryote" },
    { "text": "Yeast", "category": "eukaryote" },
    { "text": "Streptococcus bacteria", "category": "prokaryote" },
    { "text": "Oak tree", "category": "eukaryote" }
  ]
}
```

**Feedback Example:**
- ✅ "Correct! E. coli is a prokaryote because it lacks a membrane-bound nucleus—its DNA floats freely in the cytoplasm."

---

### Ordering Activities

**Format:** Arrange steps/stages in correct sequence

**Quality Standards:**
- **4-6 steps** (fewer is trivial, more is confusing)
- **Logical sequence** with clear cause-effect relationships
- **Explanation provided** after completion (why this order matters)
- **Each step distinct** - no overlap or ambiguity

**✅ EXCELLENT Example:**
```json
{
  "type": "ordering",
  "title": "Order the Stages of Mitosis",
  "items": [
    {
      "order": 1,
      "text": "Prophase: Chromosomes condense and become visible"
    },
    {
      "order": 2,
      "text": "Metaphase: Chromosomes align at the cell's equator"
    },
    {
      "order": 3,
      "text": "Anaphase: Sister chromatids separate and move to opposite poles"
    },
    {
      "order": 4,
      "text": "Telophase: Nuclear envelopes reform around each set of chromosomes"
    }
  ],
  "explanation": "This sequence ensures that genetic material is duplicated accurately and distributed equally to daughter cells. Each stage must complete before the next begins to prevent errors in cell division."
}
```

**Explanation Quality:**
- ✅ Explains WHY the order matters
- ✅ Connects to the bigger concept (accurate cell division)
- ✅ Notes consequences of wrong order

---

### Fill-in-the-Blank Activities

**Format:** Complete sentences by filling in missing key terms

**Quality Standards:**
- **Key terms only** - not trivial words like "the" or "is"
- **Context provided** - sentence gives clues without giving away the answer
- **One clear answer** - not multiple valid options
- **Educational sentences** - teach a concept, not just test vocabulary

**✅ EXCELLENT Example:**
```json
{
  "type": "fill-blank",
  "title": "Complete the Sentences About Photosynthesis",
  "items": [
    {
      "text": "Plants convert light energy into chemical energy stored in {{glucose}} during photosynthesis.",
      "answer": "glucose"
    },
    {
      "text": "The green pigment {{chlorophyll}} absorbs light energy in the chloroplasts.",
      "answer": "chlorophyll"
    },
    {
      "text": "Photosynthesis produces {{oxygen}} as a by-product, which is released into the atmosphere.",
      "answer": "oxygen"
    }
  ]
}
```

**❌ POOR Example:**
```json
{
  "items": [
    { "text": "Cells are {{small}}.", "answer": "small" },  // Trivial
    { "text": "DNA is made of {{nucleotides}}.", "answer": "nucleotides" }  // Just vocabulary, no concept
  ]
}
```

---

### Calculation Activities

**Format:** Mathematical problems requiring numeric answers

**Quality Standards:**
- **Tolerance defined** (±5% standard, ±2% for precision work)
- **Worked example shown FIRST** in lesson content
- **Units specified** in the question
- **Realistic values** - not contrived numbers
- **Step-by-step solution** provided in feedback

**✅ EXCELLENT Example:**
```json
{
  "type": "calculation",
  "title": "Calculate the Magnification of a Microscope",
  "question": "A microscope has an eyepiece lens of ×10 and an objective lens of ×40. What is the total magnification?",
  "answer": 400,
  "tolerance": 0,
  "units": "×",
  "workingOut": "Total magnification = Eyepiece magnification × Objective magnification = 10 × 40 = 400×",
  "feedback": "Correct! To find total magnification, multiply the eyepiece lens power by the objective lens power. This microscope would make objects appear 400 times larger than they actually are."
}
```

**Tolerance Guidelines:**
- Exact values (counting, simple multiplication): `tolerance: 0`
- Measured values with rounding: `tolerance: 5` (±5%)
- Precision chemistry calculations: `tolerance: 2` (±2%)

---

## Feedback Quality Rubric

### Level 1: Minimal (❌ Unacceptable)
- "Correct!"
- "Wrong."
- "Try again."

**Why it fails:** Doesn't teach anything, frustrates students

---

### Level 2: Basic (⚠️ Needs Improvement)
- "Correct! Mitochondria produce ATP."
- "Incorrect. The answer is chloroplast."

**Why it's weak:** States facts but doesn't explain WHY or connect to concepts

---

### Level 3: Good (✅ Acceptable)
- "Correct! Mitochondria produce ATP through cellular respiration, providing energy for the cell."
- "Not quite. Chloroplasts are found in plant cells, not animal cells. They perform photosynthesis to convert light energy into glucose."

**Why it works:** Explains the concept and provides reasoning

---

### Level 4: Excellent (✅✅ Target)
- "Correct! Mitochondria are called the powerhouse of the cell because they produce ATP through cellular respiration. This ATP (adenosine triphosphate) provides energy for all cellular processes, from muscle contraction to protein synthesis. Cells with high energy demands, like muscle cells, have thousands of mitochondria."

- "Not quite. While chloroplasts do produce energy (glucose) through photosynthesis, they're only found in plant cells and some algae—not in animal cells. Animal cells rely on mitochondria to produce ATP from the glucose they consume. Remember: chloroplasts make glucose FROM light, while mitochondria make ATP FROM glucose."

**Why it excels:**
- Explains the WHY (not just the what)
- Connects to related concepts
- Provides real-world context
- Addresses common misconceptions
- Uses precise scientific language

---

## Anti-Patterns (What NOT to Do)

### 1. Guessable Activities
❌ **Problem:** Student can succeed without understanding

**Example:**
- Binary choice: "Is the cell membrane permeable? Yes/No"
- 50% chance of guessing correctly

**Fix:** Make it application-based
- ✅ "Which substances can pass through the cell membrane by simple diffusion: water-soluble molecules or lipid-soluble molecules?"

---

### 2. Trick Questions
❌ **Problem:** Tests reading comprehension, not scientific understanding

**Example:**
- "The powerhouse of the cell is NOT the: A) Mitochondria B) Nucleus C) Chloroplast"

**Fix:** Ask direct, clear questions
- ✅ "Which organelle produces ATP through cellular respiration?"

---

### 3. Ambiguous Items
❌ **Problem:** Multiple valid answers or unclear instructions

**Example:**
- "Match the cell part to its description"
- Item: "Found in plants" → Could match chloroplast, cell wall, or vacuole

**Fix:** Be specific
- ✅ "Converts light energy into chemical energy (glucose) through photosynthesis" → Chloroplast

---

### 4. Generic Feedback
❌ **Problem:** Doesn't teach or explain

**Fix:** Every piece of feedback should teach something new or reinforce a concept

---

### 5. Trivial Activities
❌ **Problem:** Tests vocabulary, not understanding

**Example:**
- Fill-blank: "The {{mitochondria}} is the powerhouse of the cell."

**Fix:** Make it application
- ✅ "A marathon runner's muscle cells would have more {{mitochondria}} than a skin cell because they require more energy for sustained contraction."

---

## Quality Checklist (Use Before Committing)

For each activity in your lesson, verify:

- [ ] **Instructions are clear** (1-2 sentences, active voice)
- [ ] **Difficulty is appropriate** (not trivial, not impossible)
- [ ] **Tests understanding** (not just recall)
- [ ] **Feedback is educational** (explains WHY, not just confirms)
- [ ] **Items are distinct** (no ambiguity)
- [ ] **Quantity is right** (not too few/many items)
- [ ] **Real-world context** (if applicable)
- [ ] **Australian English** (specialised, behaviour, colour)
- [ ] **No trick questions** or guessable answers
- [ ] **Accessibility considered** (colour-blind friendly, keyboard accessible)

---

## Examples: Excellent vs Poor

### Matching Activity

**❌ POOR:**
```json
{
  "title": "Match the Things",
  "items": [
    { "text": "Mitochondria", "match": "Energy" },
    { "text": "Nucleus", "match": "DNA" },
    { "text": "Cell", "match": "Small" }
  ]
}
```

**Problems:**
- Vague title ("Things")
- Overly simplistic matches (Energy, DNA, Small)
- No educational value
- Too few items (3)

**✅ EXCELLENT:**
```json
{
  "title": "Match Organelles to Their Functions",
  "description": "Match each organelle with its primary function in the cell.",
  "items": [
    {
      "text": "Mitochondria",
      "match": "Produces ATP through aerobic cellular respiration"
    },
    {
      "text": "Nucleus",
      "match": "Stores genetic information and controls gene expression"
    },
    {
      "text": "Ribosome",
      "match": "Synthesises proteins from amino acid chains"
    },
    {
      "text": "Golgi apparatus",
      "match": "Modifies and packages proteins for export"
    },
    {
      "text": "Lysosome",
      "match": "Breaks down waste materials and cellular debris"
    }
  ],
  "feedback": {
    "correct": "Excellent! Understanding organelle functions helps explain how cells maintain life processes.",
    "incorrect": "Review the lesson section on organelle functions. Remember, each organelle has a specific role that contributes to the cell's overall function."
  }
}
```

**Why it's excellent:**
- Specific, clear title
- Detailed, educational matches
- 5 items (good quantity)
- Educational feedback
- Tests understanding of biological concepts

---

## Final Notes

**Remember:** Every activity is an opportunity to teach, not just test. The best activities make students think, apply knowledge, and understand WHY concepts matter—not just memorise facts.

**When in doubt:** Ask yourself, "Would a student who memorised the lesson without understanding still get this right?" If yes, make it harder. If a student who understood the concept might still get it wrong due to ambiguity, make it clearer.

---

**Document Location:** `/docs/ACTIVITY-QUALITY-STANDARDS.md`
**Review Frequency:** Quarterly or when new activity types are added
**Owned By:** Content Quality Team
