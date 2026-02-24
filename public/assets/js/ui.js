/**
 * Pairing Method — UI connector
 * Loads data, populates food select, runs engine, renders top 3 results.
 * No frameworks. Graceful error handling.
 */

import { calculatePairing } from './engine.js';

/**
 * Load foods and wines from JSON. Throws on fetch or parse failure.
 * @returns {Promise<{ foods: Array, wines: Array }>}
 */
async function loadData() {
  const foodResponse = await fetch('/data/foods.json');
  const wineResponse = await fetch('/data/wines.json');

  if (!foodResponse.ok) throw new Error('Could not load foods.');
  if (!wineResponse.ok) throw new Error('Could not load wines.');

  const foods = await foodResponse.json();
  const wines = await wineResponse.json();

  if (!Array.isArray(foods) || !Array.isArray(wines)) {
    throw new Error('Invalid data format.');
  }

  return { foods, wines };
}

/**
 * Populate the food dropdown with options from foods array.
 * @param {Array} foods
 */
function populateFoodSelect(foods) {
  const select = document.getElementById('food-select');
  if (!select) return;

  foods.forEach((food) => {
    const option = document.createElement('option');
    option.value = food.name;
    option.textContent = food.name;
    select.appendChild(option);
  });
}

/**
 * Render top 3 pairing results into #results. Clears container first.
 * @param {Array<{ name: string, score: number, reasoning: string[] }>} results
 */
function renderResults(results) {
  const container = document.getElementById('results');
  if (!container) return;

  container.innerHTML = '';

  if (!results || results.length === 0) {
    container.textContent = 'No pairings found. Try another dish.';
    return;
  }

  results.forEach((result) => {
    const card = document.createElement('div');
    card.className = 'pairing-card';

    const title = document.createElement('h3');
    title.textContent = result.name;

    const score = document.createElement('div');
    score.className = 'score';
    score.textContent = `Pairing Strength: ${result.score}%`;

    const ul = document.createElement('ul');
    (result.reasoning || []).forEach((reason) => {
      const li = document.createElement('li');
      li.textContent = reason;
      ul.appendChild(li);
    });

    card.appendChild(title);
    card.appendChild(score);
    card.appendChild(ul);

    container.appendChild(card);
  });
}

/**
 * Show an error message in #results.
 * @param {string} message
 */
function showError(message) {
  const container = document.getElementById('results');
  if (!container) return;
  container.innerHTML = '';
  const p = document.createElement('p');
  p.className = 'engine-error';
  p.textContent = message;
  p.setAttribute('role', 'alert');
  container.appendChild(p);
}

/**
 * Initialize engine UI: load data, populate select, wire up button.
 */
async function initEngine() {
  const resultsEl = document.getElementById('results');
  const selectEl = document.getElementById('food-select');
  const btnEl = document.getElementById('calculate-btn');

  if (!resultsEl || !selectEl || !btnEl) return;

  try {
    const { foods, wines } = await loadData();
    populateFoodSelect(foods);

    btnEl.addEventListener('click', () => {
      const selectedName = selectEl.value;
      if (!selectedName) {
        showError('Please select a dish.');
        return;
      }

      const selectedFood = foods.find((f) => f.name === selectedName);
      if (!selectedFood) {
        showError('Selected dish not found.');
        return;
      }

      const results = calculatePairing(selectedFood, wines);
      renderResults(results);
    });
  } catch (err) {
    showError(err.message || 'Could not load pairing data. Please try again.');
  }
}

document.addEventListener('DOMContentLoaded', initEngine);
