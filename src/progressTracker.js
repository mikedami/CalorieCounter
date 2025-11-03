// ----------------------
// progressTracker.js (Browser version)
// ----------------------

// ----------------------
// Update Weight and Height
// ----------------------
var updateWeightAndHeight = function({ currentWeight, targetWeight, heightFeet, heightInches }) {
    console.log("Updating weight and height...");

    // Get existing data from localStorage
    const localData = localStorage.getItem('mealsData');
    const data = localData ? JSON.parse(localData) : { meals: [], progress: {} };

    // Convert height to meters
    let heightMeters = data.progress?.height ?? 1.7;
    if (heightFeet !== undefined || heightInches !== undefined) {
        const feet = Number(heightFeet ?? 0);
        const inches = Number(heightInches ?? 0);
        heightMeters = feet * 0.3048 + inches * 0.0254;
    }

    // Nice use of ... operator here to keep existing progress data
    // while only updating fields you want to change.
    data.progress = {
        ...data.progress,
        currentWeight: Number(currentWeight ?? data.progress?.currentWeight),
        targetWeight: Number(targetWeight ?? data.progress?.targetWeight),
        height: heightMeters
    };

    localStorage.setItem('mealsData', JSON.stringify(data));
    console.log("? Weight and height updated in localStorage");
};

// ----------------------
// Update Daily Macro Targets
// ----------------------
var updateTargetMacros = function({ targetCals, targetCarbs, targetFat, targetProtein }) {
    console.log("Updating daily macro targets...");

    const localData = localStorage.getItem('mealsData');
    const data = localData ? JSON.parse(localData) : { meals: [], progress: {} };

    data.progress = {
        ...data.progress,
        targetCals: Number(targetCals ?? data.progress?.targetCals),
        targetCarbs: Number(targetCarbs ?? data.progress?.targetCarbs),
        targetFat: Number(targetFat ?? data.progress?.targetFat),
        targetProtein: Number(targetProtein ?? data.progress?.targetProtein)
    };

    localStorage.setItem('mealsData', JSON.stringify(data));
    console.log("? Daily macro targets updated in localStorage");
};

// ----------------------
// Get Progress (Weight, BMI, Difference)
// ----------------------
var getProgress = function() {
    const localData = localStorage.getItem('mealsData');
    const data = localData ? JSON.parse(localData) : { meals: [], progress: {} };
    const p = data.progress;

    if (!p || !p.currentWeight || !p.height) return null;

    const weightKg = p.currentWeight * 0.453592;
    const bmi = +(weightKg / (p.height ** 2)).toFixed(1);
    const weightDiff = p.targetWeight - p.currentWeight;

    return { ...p, bmi, weightDiff };
};

// ----------------------
// Get Daily Summary (Macros)
// ----------------------
// This function is doing a lot of work maybe break it into smaller helper functions
// like filterMealsByDate() and calculateTotals()
var getDailySummary = function(selectedDate) {
    const localData = localStorage.getItem('mealsData');
    const data = localData ? JSON.parse(localData) : { meals: [], progress: {} };
    const p = data.progress;

    if (!p || !p.targetCals) return null;

    // Use selected date if provided, otherwise use today
    const targetDate = selectedDate 
        ? (selectedDate instanceof Date ? selectedDate.toISOString().slice(0, 10) : selectedDate.slice(0, 10))
        : new Date().toISOString().slice(0, 10);
    const todayMeals = data.meals.filter(f => f.date && f.date.startsWith(targetDate));

    if (todayMeals.length === 0) {
        return { totals: { calories: 0, carbs: 0, fat: 0, protein: 0 }, remaining: { 
            calories: p.targetCals, carbs: p.targetCarbs, fat: p.targetFat, protein: p.targetProtein 
        }};
    }

    const totals = todayMeals.reduce(
        (acc, f) => ({
            calories: acc.calories + (f.calories || 0),
            carbs: acc.carbs + (f.carbs || 0),
            fat: acc.fat + (f.fat || 0),
            protein: acc.protein + (f.protein || 0)
        }),
        { calories: 0, carbs: 0, fat: 0, protein: 0 }
    );

    const remaining = {
        calories: (p.targetCals || 0) - totals.calories,
        carbs: (p.targetCarbs || 0) - totals.carbs,
        fat: (p.targetFat || 0) - totals.fat,
        protein: (p.targetProtein || 0) - totals.protein
    };

    return { totals, remaining };
};

// ----------------------
// Attach to window for browser use
// ----------------------
window.updateWeightAndHeight = updateWeightAndHeight;
window.updateTargetMacros = updateTargetMacros;
window.getProgress = getProgress;
window.getDailySummary = getDailySummary;
