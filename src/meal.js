
// I see this function writes our meal form data to the json file, and then saves it to localStorage
// There is a bug when we try and add more than 1 meal.

// The localstorage will only ever have the first meal added, because we read from data.json each time

// When we refresh the page, we only get the meals from the json + the last meal that we added

// Sample fix:
function addMealExample(meal) {
    mealsData.push(meal);
    const dataToSave = { meals: mealsData };
    localStorage.setItem('mealsData', JSON.stringify(dataToSave));
    console.log("Meal added & saved:", meal);

    // And then when we call this in LoadMealsData, we read from localStorage only
    // or if there is nothing in localStorage, we read from data.json 
}

var addMeal = function(meal) {
    console.log("Meal added:", meal);
    
    fetch('../data.json')
        .then(response => response.json())
        .then(data => {
            data.meals.push(meal);
            
            console.log("Updated meals data:", data);
            
            localStorage.setItem('mealsData', JSON.stringify(data));
            console.log("Meal saved to localStorage");
        })
        .catch(error => {
            console.error('Error reading data.json:', error);
        });
}

// // Node.js version - can actually write to the file system
// var addMealToFile = function(meal) {
//     if (typeof require !== 'undefined') {
//         const fs = require('fs');
//         const path = require('path');
        
//         console.log("Meal added:", meal);
        
//         try {
//             // Read the current data from data.json
//             const dataPath = path.join(__dirname, '../data.json');
//             const rawData = fs.readFileSync(dataPath, 'utf8');
//             const data = JSON.parse(rawData);
            
//             // Add the new meal to the meals array
//             data.meals.push(meal);
            
//             // Write the updated data back to the file
//             fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
//             console.log("Meal successfully added to data.json");
            
//             return data;
//         } catch (error) {
//             console.error('Error updating data.json:', error);
//             throw error;
//         }
//     } else {
//         console.error('Node.js environment required for file operations');
//     }
// }

// Helper function to create a meal object with current timestamp
var createMeal = function(name, calories, carbs, fat, protein, customDate) {
    const date = customDate || new Date().toISOString().slice(0, 16).replace('T', ' ');
    
    return {
        name: name,
        calories: calories,
        carbs: carbs,
        fat: fat,
        protein: protein,
        date: date
    };
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        addMeal: addMeal,
        createMeal: createMeal
    };
} else {
    // Browser environment - attach to window object
    window.addMeal = addMeal;
    //window.addMealToFile = addMealToFile;
    //Becuase of CORS, we can't use Node.JS version
    window.createMeal = createMeal;
}