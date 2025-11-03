/*
  - Really great application!
  - Easy to read, concise and precise comments
  - Really like how the team went beyond and create a full frotnend for it
*/

// Calorie Counter Main Application
console.log("🍽️ Calorie Counter App Loading...");

// Global meals data and selected date
let mealsData = [];
let selectedDate = new Date(); // Default to current date

// DOM Elements
const mealsListElement = document.getElementById('meals-list');
const mealFormElement = document.getElementById('meal-form');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing app...");
    initializeCalendar();
    createMealForm();
    initializeProgressTracker();
    loadMealsData();
});

// Initialize calendar functionality
function initializeCalendar() {
    const currentDateDisplay = document.getElementById('current-date-display');
    const datePicker = document.getElementById('date-picker');
    const prevDayBtn = document.getElementById('prev-day');
    const nextDayBtn = document.getElementById('next-day');
    const todayBtn = document.getElementById('today-btn');
    const yesterdayBtn = document.getElementById('yesterday-btn');
    const weekAgoBtn = document.getElementById('week-ago-btn');

    // Set initial date picker value
    updateDateDisplay();

    // Event listeners for navigation buttons
    prevDayBtn.addEventListener('click', () => {
        selectedDate.setDate(selectedDate.getDate() - 1);
        updateDateDisplay();
        refreshMealDisplay();
    });

    nextDayBtn.addEventListener('click', () => {
        selectedDate.setDate(selectedDate.getDate() + 1);
        updateDateDisplay();
        refreshMealDisplay();
    });

    // Date picker change event
    datePicker.addEventListener('change', (e) => {
        if (e.target.value) {
            selectedDate = new Date(e.target.value + 'T00:00:00');
            updateDateDisplay();
            refreshMealDisplay();
        }
    });

    // Quick navigation buttons
    todayBtn.addEventListener('click', () => {
        selectedDate = new Date();
        updateDateDisplay();
        refreshMealDisplay();
        updateQuickNavButtons('today');
    });

    yesterdayBtn.addEventListener('click', () => {
        selectedDate = new Date();
        selectedDate.setDate(selectedDate.getDate() - 1);
        updateDateDisplay();
        refreshMealDisplay();
        updateQuickNavButtons('yesterday');
    });

    weekAgoBtn.addEventListener('click', () => {
        selectedDate = new Date();
        selectedDate.setDate(selectedDate.getDate() - 7);
        updateDateDisplay();
        refreshMealDisplay();
        updateQuickNavButtons('week-ago');
    });
}

// Update the date display and picker
function updateDateDisplay() {
    const currentDateDisplay = document.getElementById('current-date-display');
    const datePicker = document.getElementById('date-picker');
    
    // Format display date
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const displayDate = selectedDate.toLocaleDateString('en-US', options);
    
    // Check if it's today, yesterday, etc.
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const selectedDateString = selectedDate.toDateString();
    const todayString = today.toDateString();
    const yesterdayString = yesterday.toDateString();
    
    let dateLabel = displayDate;
    if (selectedDateString === todayString) {
        dateLabel = `Today - ${displayDate}`;
        updateQuickNavButtons('today');
    } else if (selectedDateString === yesterdayString) {
        dateLabel = `Yesterday - ${displayDate}`;
        updateQuickNavButtons('yesterday');
    } else {
        updateQuickNavButtons(null);
    }
    
    currentDateDisplay.textContent = dateLabel;
    
    // Update date picker value
    const isoDate = selectedDate.toISOString().split('T')[0];
    datePicker.value = isoDate;
}

// Update quick navigation button states
function updateQuickNavButtons(activeButton) {
    const buttons = ['today-btn', 'yesterday-btn', 'week-ago-btn'];
    buttons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        btn.classList.remove('active');
        if (btnId === activeButton + '-btn') {
            btn.classList.add('active');
        }
    });
}

// Refresh meal display when date changes
function refreshMealDisplay() {
    displayMeals();
    displayTotals();
    updateMealFormDate();
    // Also refresh progress tracker daily summary for the new date
    displayDailySummary();
}

// Update meal form date to match selected date
function updateMealFormDate() {
    const mealDateInput = document.getElementById('meal-date');
    if (mealDateInput) {
        // Use selected date but current time
        const now = new Date();
        const selectedDateTime = new Date(selectedDate);
        selectedDateTime.setHours(now.getHours(), now.getMinutes());
        
        const localDateTime = selectedDateTime.toISOString().slice(0, 16);
        mealDateInput.value = localDateTime;
    }
}

// Initialize progress tracker functionality
function initializeProgressTracker() {
    console.log("Initializing progress tracker...");
    
    // Get DOM elements
    const updateProgressBtn = document.getElementById('updateProgressBtn');
    const updateMacrosBtn = document.getElementById('updateMacrosBtn');
    
    // Connect form buttons to progressTracker functions
    if (updateProgressBtn) {
        updateProgressBtn.addEventListener('click', handleUpdateProgress);
    }
    
    if (updateMacrosBtn) {
        updateMacrosBtn.addEventListener('click', handleUpdateMacros);
    }
    
    // Load existing progress data into forms
    loadProgressData();
    
    // Display current progress
    displayProgress();
    displayDailySummary();
}

// Handle weight and height update
function handleUpdateProgress() {
    const currentWeight = document.getElementById('currentWeight').value;
    const targetWeight = document.getElementById('targetWeight').value;
    const heightFeet = document.getElementById('heightFeet').value;
    const heightInches = document.getElementById('heightInches').value;
    
    if (!currentWeight && !targetWeight && !heightFeet && !heightInches) {
        showMessage("Please enter at least one value to update", "error");
        return;
    }
    
    // Call progressTracker function
    if (typeof updateWeightAndHeight === 'function') {
        updateWeightAndHeight({
            currentWeight: currentWeight || undefined,
            targetWeight: targetWeight || undefined,
            heightFeet: heightFeet || undefined,
            heightInches: heightInches || undefined
        });
        
        // Refresh displays
        displayProgress();
        displayDailySummary();
        showMessage("✅ Weight and height updated successfully!", "success");
    }
}

// Handle macro targets update
function handleUpdateMacros() {
    const targetCals = document.getElementById('targetCals').value;
    const targetCarbs = document.getElementById('targetCarbs').value;
    const targetFat = document.getElementById('targetFat').value;
    const targetProtein = document.getElementById('targetProtein').value;
    
    if (!targetCals && !targetCarbs && !targetFat && !targetProtein) {
        showMessage("Please enter at least one macro target to update", "error");
        return;
    }
    
    // Call progressTracker function
    if (typeof updateTargetMacros === 'function') {
        updateTargetMacros({
            targetCals: targetCals || undefined,
            targetCarbs: targetCarbs || undefined,
            targetFat: targetFat || undefined,
            targetProtein: targetProtein || undefined
        });
        
        // Refresh displays
        displayProgress();
        displayDailySummary();
        displayTotals(); // Also refresh meal totals to show targets
        showMessage("✅ Macro targets updated successfully!", "success");
    }
}

// Load existing progress data into form fields
function loadProgressData() {
    const progress = typeof getProgress === 'function' ? getProgress() : null;
    
    if (progress) {
        const currentWeightField = document.getElementById('currentWeight');
        const targetWeightField = document.getElementById('targetWeight');
        const heightFeetField = document.getElementById('heightFeet');
        const heightInchesField = document.getElementById('heightInches');
        const targetCalsField = document.getElementById('targetCals');
        const targetCarbsField = document.getElementById('targetCarbs');
        const targetFatField = document.getElementById('targetFat');
        const targetProteinField = document.getElementById('targetProtein');
        
        if (progress.currentWeight && currentWeightField) {
            currentWeightField.value = progress.currentWeight;
        }
        if (progress.targetWeight && targetWeightField) {
            targetWeightField.value = progress.targetWeight;
        }
        if (progress.height && heightFeetField && heightInchesField) {
            // Convert meters back to feet and inches for display
            const totalInches = progress.height / 0.0254;
            const feet = Math.floor(totalInches / 12);
            const inches = Math.round(totalInches % 12);
            heightFeetField.value = feet;
            heightInchesField.value = inches;
        }
        if (progress.targetCals && targetCalsField) {
            targetCalsField.value = progress.targetCals;
        }
        if (progress.targetCarbs && targetCarbsField) {
            targetCarbsField.value = progress.targetCarbs;
        }
        if (progress.targetFat && targetFatField) {
            targetFatField.value = progress.targetFat;
        }
        if (progress.targetProtein && targetProteinField) {
            targetProteinField.value = progress.targetProtein;
        }
    }
}

// Display progress information
function displayProgress() {
    const progressDisplay = document.getElementById('progressDisplay');
    const progress = typeof getProgress === 'function' ? getProgress() : null;
    
    if (!progress || !progressDisplay) {
        if (progressDisplay) {
            progressDisplay.innerHTML = '<p class="text-gray-500">Set your weight and height to see progress metrics</p>';
        }
        return;
    }
    
    const weightDiffText = progress.weightDiff > 0 
        ? `${progress.weightDiff.toFixed(1)} lbs to go`
        : progress.weightDiff < 0 
        ? `${Math.abs(progress.weightDiff).toFixed(1)} lbs over target`
        : 'At target weight!';
    
    const weightDiffClass = progress.weightDiff > 0 
        ? 'positive' 
        : progress.weightDiff < 0 
        ? 'negative' 
        : '';
    
    progressDisplay.innerHTML = `
        <div class="progress-display">
            <div class="progress-card">
                <h4>Current Weight</h4>
                <div class="progress-value">${progress.currentWeight} lbs</div>
            </div>
            <div class="progress-card">
                <h4>Target Weight</h4>
                <div class="progress-value">${progress.targetWeight} lbs</div>
            </div>
            <div class="progress-card">
                <h4>BMI</h4>
                <div class="progress-value">${progress.bmi}</div>
            </div>
            <div class="progress-card">
                <h4>Progress</h4>
                <div class="progress-value ${weightDiffClass}">${weightDiffText}</div>
            </div>
        </div>
    `;
}

// Display daily summary with macro progress
function displayDailySummary() {
    const dailySummaryDisplay = document.getElementById('dailySummaryDisplay');
    const summary = typeof getDailySummary === 'function' ? getDailySummary(selectedDate) : null;
    
    if (!summary || !dailySummaryDisplay) {
        if (dailySummaryDisplay) {
            dailySummaryDisplay.innerHTML = '<p class="text-gray-500">Set your macro targets to see daily progress</p>';
        }
        return;
    }
    
    const { totals, remaining } = summary;
    
    // Calculate percentages for progress bars
    const caloriesPercent = Math.min((totals.calories / (totals.calories + Math.max(0, remaining.calories))) * 100, 100);
    const carbsPercent = Math.min((totals.carbs / (totals.carbs + Math.max(0, remaining.carbs))) * 100, 100);
    const fatPercent = Math.min((totals.fat / (totals.fat + Math.max(0, remaining.fat))) * 100, 100);
    const proteinPercent = Math.min((totals.protein / (totals.protein + Math.max(0, remaining.protein))) * 100, 100);
    
    dailySummaryDisplay.innerHTML = `
        <h3 class="text-lg font-semibold mb-3">📊 Daily Macro Progress</h3>
        <div class="macro-progress">
            ${createMacroCard('Calories', totals.calories, remaining.calories, caloriesPercent, '')}
            ${createMacroCard('Carbs', totals.carbs, remaining.carbs, carbsPercent, 'g')}
            ${createMacroCard('Fat', totals.fat, remaining.fat, fatPercent, 'g')}
            ${createMacroCard('Protein', totals.protein, remaining.protein, proteinPercent, 'g')}
        </div>
    `;
}

// Helper function to create macro progress cards
function createMacroCard(name, consumed, remaining, percent, unit) {
    const isOver = remaining < 0;
    const displayRemaining = isOver ? Math.abs(remaining) : remaining;
    const remainingText = isOver ? `${displayRemaining.toFixed(1)}${unit} over` : `${displayRemaining.toFixed(1)}${unit} left`;
    const remainingClass = isOver ? 'remaining over' : 'remaining';
    const barClass = isOver ? 'macro-bar-fill over' : 'macro-bar-fill';
    
    return `
        <div class="macro-card">
            <h5>${name}</h5>
            <div class="macro-values">
                <span class="consumed">${consumed.toFixed(1)}${unit}</span>
                <span class="${remainingClass}">${remainingText}</span>
            </div>
            <div class="macro-bar">
                <div class="${barClass}" style="width: ${percent}%"></div>
            </div>
        </div>
    `;
}

// Create the meal input form
function createMealForm() {
    mealFormElement.innerHTML = `
        <form id="add-meal-form" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1" for="meal-name">Meal Name</label>
                    <input type="text" id="meal-name" name="name" required 
                           class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" 
                           placeholder="e.g., Grilled Chicken">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1" for="meal-calories">Calories</label>
                    <input type="number" id="meal-calories" name="calories" required min="0"
                           class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" 
                           placeholder="0">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1" for="meal-carbs">Carbs (g)</label>
                    <input type="number" id="meal-carbs" name="carbs" required min="0" step="0.1"
                           class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" 
                           placeholder="0">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1" for="meal-fat">Fat (g)</label>
                    <input type="number" id="meal-fat" name="fat" required min="0" step="0.1"
                           class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" 
                           placeholder="0">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1" for="meal-protein">Protein (g)</label>
                    <input type="number" id="meal-protein" name="protein" required min="0" step="0.1"
                           class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" 
                           placeholder="0">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1" for="meal-date">Date & Time</label>
                    <input type="datetime-local" id="meal-date" name="date"
                           class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            <button type="submit" class="button">
                ➕ Add Meal
            </button>
        </form>
    `;

    // Set default date to selected date (but current time)
    updateMealFormDate();

    // Add form submit event listener
    document.getElementById('add-meal-form').addEventListener('submit', handleAddMeal);
}

// Load meals data from JSON file or localStorage
async function loadMealsData() {
    try {
        // First try to load from localStorage (in case we've added meals)
        const localData = localStorage.getItem('mealsData');
        if (localData) {
            const parsedData = JSON.parse(localData);
            console.log("Raw localStorage data:", parsedData);
            // Handle both array format and object format
            mealsData = Array.isArray(parsedData) ? parsedData : (parsedData.meals || []);
            console.log("Processed mealsData:", mealsData);
            console.log("Loaded meals from localStorage");
        } else {
            // Load from data.json file
            const response = await fetch('./data.json');
            const data = await response.json();
            mealsData = data.meals || [];
            console.log("Loaded meals from data.json");
        }
        
        displayMeals();
        displayTotals();
    } catch (error) {
        console.error('Error loading meals data:', error);
        mealsData = [];
        displayMeals();
    }
}

// Handle form submission
function handleAddMeal(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const mealData = {
        name: formData.get('name'),
        calories: parseInt(formData.get('calories')),
        carbs: parseFloat(formData.get('carbs')),
        fat: parseFloat(formData.get('fat')),
        protein: parseFloat(formData.get('protein')),
        date: formData.get('date').replace('T', ' ')
    };

    console.log("Adding new meal:", mealData);
    
    // Add meal using the meal.js function
    if (typeof addMeal === 'function') {
        addMeal(mealData);
    }
    
    // Add to local array and update display
    mealsData.push(mealData);
    
    // Save to localStorage
    const dataToSave = { meals: mealsData };
    localStorage.setItem('mealsData', JSON.stringify(dataToSave));
    
    // Clear form and refresh display
    event.target.reset();
    const now = new Date();
    document.getElementById('meal-date').value = now.toISOString().slice(0, 16);
    
    displayMeals();
    displayTotals();
    
    // Show success message
    showMessage("✅ Meal added successfully!", "success");
}

// Display all meals for the selected date
function displayMeals() {
    // Ensure mealsData is an array
    if (!Array.isArray(mealsData)) {
        console.error('mealsData is not an array:', mealsData);
        mealsData = [];
    }
    
    if (!mealsData || mealsData.length === 0) {
        mealsListElement.innerHTML = '<p class="text-gray-500">No meals logged yet. Add your first meal above!</p>';
        return;
    }

    // Filter meals for the selected date
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    const selectedDateMeals = mealsData.filter(meal => meal.date && meal.date.startsWith(selectedDateString));

    if (selectedDateMeals.length === 0) {
        const dateString = selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
        });
        mealsListElement.innerHTML = `<p class="text-gray-500">No meals logged for ${dateString}. Add a meal above!</p>`;
        return;
    }

    // Sort meals by time (newest first)
    const sortedMeals = [...selectedDateMeals].sort((a, b) => new Date(b.date) - new Date(a.date));

    const mealsHTML = sortedMeals.map((meal, index) => `
        <div class="meal-item bg-gray-50 rounded p-4 mb-3 border-l-4 border-blue-500">
            <div class="flex justify-between items-start mb-2">
                <h3 class="font-semibold text-lg">${meal.name}</h3>
                <span class="text-sm text-gray-600">${formatDate(meal.date)}</span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div class="bg-white rounded p-2 text-center">
                    <div class="font-medium text-orange-600">${meal.calories}</div>
                    <div class="text-xs text-gray-500">Calories</div>
                </div>
                <div class="bg-white rounded p-2 text-center">
                    <div class="font-medium text-green-600">${meal.carbs}g</div>
                    <div class="text-xs text-gray-500">Carbs</div>
                </div>
                <div class="bg-white rounded p-2 text-center">
                    <div class="font-medium text-red-600">${meal.fat}g</div>
                    <div class="text-xs text-gray-500">Fat</div>
                </div>
                <div class="bg-white rounded p-2 text-center">
                    <div class="font-medium text-blue-600">${meal.protein}g</div>
                    <div class="text-xs text-gray-500">Protein</div>
                </div>
            </div>
        </div>
    `).join('');

    mealsListElement.innerHTML = mealsHTML;
}

// Display daily totals for selected date
function displayTotals() {
    // Ensure mealsData is an array
    if (!Array.isArray(mealsData)) {
        console.error('mealsData is not an array in displayTotals:', mealsData);
        mealsData = [];
    }
    
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    const selectedDateMeals = mealsData.filter(meal => meal.date && meal.date.startsWith(selectedDateString));
    
    const totals = selectedDateMeals.reduce((acc, meal) => ({
        calories: acc.calories + meal.calories,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat,
        protein: acc.protein + meal.protein
    }), { calories: 0, carbs: 0, fat: 0, protein: 0 });

    // Add or update totals display
    let totalsElement = document.getElementById('daily-totals');
    if (!totalsElement) {
        totalsElement = document.createElement('div');
        totalsElement.id = 'daily-totals';
        totalsElement.className = 'card mt-6';
        document.querySelector('.container').appendChild(totalsElement);
    }

    // Create the title based on selected date
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = selectedDate.toDateString() === yesterday.toDateString();
    
    let titleText = "📊 ";
    if (isToday) {
        titleText += "Today's Totals";
    } else if (isYesterday) {
        titleText += "Yesterday's Totals";
    } else {
        const dateString = selectedDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric'
        });
        titleText += `Totals for ${dateString}`;
    }

    totalsElement.innerHTML = `
        <h2 class="text-xl font-semibold mb-4">${titleText}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
                <div class="text-2xl font-bold text-orange-600">${totals.calories}</div>
                <div class="text-sm text-gray-600">Calories</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold text-green-600">${totals.carbs.toFixed(1)}g</div>
                <div class="text-sm text-gray-600">Carbs</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold text-red-600">${totals.fat.toFixed(1)}g</div>
                <div class="text-sm text-gray-600">Fat</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">${totals.protein.toFixed(1)}g</div>
                <div class="text-sm text-gray-600">Protein</div>
            </div>
        </div>
        <div class="text-center mt-4 text-sm text-gray-600">
            ${selectedDateMeals.length} meal${selectedDateMeals.length !== 1 ? 's' : ''} logged ${isToday ? 'today' : isYesterday ? 'yesterday' : 'on this date'}
        </div>
    `;
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    let bgColor = 'bg-blue-500';
    if (type === 'success') bgColor = 'bg-green-500';
    if (type === 'error') bgColor = 'bg-red-500';
    
    messageDiv.className = `fixed top-4 right-4 p-4 rounded shadow-lg z-50 ${bgColor} text-white`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Debug function to clear localStorage if needed
function clearStorageData() {
    localStorage.removeItem('mealsData');
    console.log("localStorage cleared");
    location.reload();
}

// Make it available globally for debugging
window.clearStorageData = clearStorageData;

console.log("✅ Calorie Counter App Ready!");
console.log("💡 If you see data loading errors, run clearStorageData() in console");

// ----------------------
// Progress Tracker Integration
// ----------------------

// Elements
const updateProgressBtn = document.getElementById('updateProgressBtn');
const updateMacrosBtn = document.getElementById('updateMacrosBtn');
const progressDisplay = document.getElementById('progressDisplay');
const dailySummaryDisplay = document.getElementById('dailySummaryDisplay');

// Update weight and height
updateProgressBtn.addEventListener('click', () => {
    const currentWeight = Number(document.getElementById('currentWeight').value);
    const targetWeight = Number(document.getElementById('targetWeight').value);
    const heightFeet = Number(document.getElementById('heightFeet').value);
    const heightInches = Number(document.getElementById('heightInches').value);

    updateWeightAndHeight({ currentWeight, targetWeight, heightFeet, heightInches });
    renderProgress();
});

// Update daily macro targets
updateMacrosBtn.addEventListener('click', () => {
    const targetCals = Number(document.getElementById('targetCals').value);
    const targetCarbs = Number(document.getElementById('targetCarbs').value);
    const targetFat = Number(document.getElementById('targetFat').value);
    const targetProtein = Number(document.getElementById('targetProtein').value);

    updateTargetMacros({ targetCals, targetCarbs, targetFat, targetProtein });
    renderDailySummary();
});

// Render progress (BMI, weight difference, etc.)
function renderProgress() {
    const progress = getProgress();
    if (!progress) {
        progressDisplay.innerHTML = 'No progress data available.';
        return;
    }

    progressDisplay.innerHTML = `
        <p>Current Weight: ${progress.currentWeight} lbs</p>
        <p>Target Weight: ${progress.targetWeight} lbs</p>
        <p>Height: ${progress.height.toFixed(2)} m</p>
        <p>BMI: ${progress.bmi}</p>
        <p>Weight Remaining to Goal: ${progress.weightDiff} lbs</p>
    `;
}

// Render daily macro summary
function renderDailySummary() {
    const summary = getDailySummary();
    if (!summary || !summary.totals) {
        dailySummaryDisplay.innerHTML = 'No meals logged today.';
        return;
    }

    const { totals, remaining } = summary;
    dailySummaryDisplay.innerHTML = `
        <p><strong>Consumed Today:</strong></p>
        <p>Calories: ${totals.calories}</p>
        <p>Carbs: ${totals.carbs} g</p>
        <p>Fat: ${totals.fat} g</p>
        <p>Protein: ${totals.protein} g</p>
        <p><strong>Remaining:</strong></p>
        <p>Calories: ${remaining.calories}</p>
        <p>Carbs: ${remaining.carbs} g</p>
        <p>Fat: ${remaining.fat} g</p>
        <p>Protein: ${remaining.protein} g</p>
    `;
}

// Initial render on page load
document.addEventListener('DOMContentLoaded', () => {
    renderProgress();
    renderDailySummary();
});
