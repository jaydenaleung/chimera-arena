/**
 * Animal data for chimera generation.
 */
const ANIMALS = [
  'Lion', 'Eagle', 'Shark', 'Wolf', 'Bear', 'Tiger', 'Dragon', 'Phoenix',
  'Cobra', 'Gorilla', 'Elephant', 'Hawk', 'Crocodile', 'Panther', 'Scorpion',
  'Octopus', 'Rhino', 'Falcon', 'Mantis', 'Chameleon', 'Stag', 'Ram',
  'Wasp', 'Barracuda', 'Komodo Dragon', 'Wolverine', 'Hyena', 'Owl',
  'Piranha', 'Bull'
];

/**
 * Populate all animal dropdown selects with options.
 */
function populateAnimalDropdowns() {
  const dropdowns = document.querySelectorAll('.animal-dropdown');
  dropdowns.forEach((select, index) => {
    select.innerHTML = '';
    ANIMALS.forEach((animal) => {
      const option = document.createElement('option');
      option.value = animal;
      option.textContent = animal;
      select.appendChild(option);
    });
    // Set different defaults so dropdowns don't all show the same animal
    const defaults = [0, 1, 2, 3];
    if (defaults[index] !== undefined) {
      select.selectedIndex = defaults[index];
    }
  });
}

/**
 * Build a chimera name from two animal names.
 */
function buildChimeraName(animalA, animalB) {
  const halfA = animalA.slice(0, Math.ceil(animalA.length / 2));
  const halfB = animalB.slice(Math.floor(animalB.length / 2));
  return halfA + halfB;
}
