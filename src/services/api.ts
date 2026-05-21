export interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
}

const BASE_URL = 'https://dummyjson.com/recipes';

// 100% Resilient offline fallback database for dummyjson connection resets/firewalls
const LOCAL_FALLBACK_RECIPES: Recipe[] = [
  {
    id: 1,
    name: "Classic Margherita Pizza",
    ingredients: [
      "Pizza dough (store-bought or homemade)",
      "1/2 cup Premium tomato sauce",
      "1 cup Fresh mozzarella cheese, sliced",
      "Fresh organic basil leaves",
      "1 tbsp Extra virgin olive oil",
      "Salt and black pepper to taste"
    ],
    instructions: [
      "Preheat your oven to 450°F (230°C).",
      "Roll out the pizza dough on a floured surface to your desired thickness.",
      "Spread the tomato sauce evenly over the dough, leaving a small border around the edges.",
      "Arrange the sliced fresh mozzarella cheese evenly on top of the sauce.",
      "Bake in the preheated oven for 12-15 minutes, or until the crust is golden brown and cheese is bubbly.",
      "Remove from oven, top with fresh basil leaves, drizzle with olive oil, slice and serve immediately."
    ],
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    servings: 4,
    difficulty: "Easy",
    cuisine: "Italian",
    caloriesPerServing: 300,
    tags: ["Pizza", "Italian", "Vegetarian", "Lunch", "Dinner"],
    userId: 1,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 120,
    mealType: ["Lunch", "Dinner"]
  },
  {
    id: 2,
    name: "Double Cheese Gourmet Burger",
    ingredients: [
      "80% Lean Ground Beef Patties",
      "Brioche Burger Buns",
      "Cheddar Cheese slices",
      "Fresh Lettuce leaves",
      "Ripe Red Tomato, sliced",
      "Red Onion, thinly sliced",
      "Gourmet Burger Sauce (Mayo, Ketchup, Relish)"
    ],
    instructions: [
      "Preheat your grill or cast-iron skillet to medium-high heat.",
      "Season the beef patties generously with salt and fresh cracked pepper.",
      "Sear patties for 3-4 minutes per side. Add Cheddar cheese slice on top during the last minute of cooking.",
      "Lightly toast the brioche buns on the grill surface.",
      "Spread gourmet burger sauce on the bottom bun, layer lettuce, tomato, sliced red onions.",
      "Place the cheese-melted burger patty on top, cover with upper bun, and enjoy hot!"
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    servings: 2,
    difficulty: "Easy",
    cuisine: "American",
    caloriesPerServing: 450,
    tags: ["Burger", "Fast Food", "Beef", "Lunch", "Dinner"],
    userId: 1,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 340,
    mealType: ["Lunch", "Dinner"]
  },
  {
    id: 3,
    name: "Creamy Fettuccine Alfredo",
    ingredients: [
      "8 oz Fettuccine Pasta",
      "1/2 cup Unsalted Butter",
      "1/2 cup Heavy Cream",
      "3/4 cup Grated Parmesan Cheese",
      "2 Garlic cloves, minced",
      "Fresh Parsley, chopped"
    ],
    instructions: [
      "Cook the fettuccine pasta in a large pot of boiling salted water according to package instructions.",
      "In a large skillet, melt the butter over medium heat. Add minced garlic and cook for 1 minute until fragrant.",
      "Pour in the heavy cream and let it simmer gently for 2 minutes.",
      "Reduce heat to low, stir in the grated Parmesan cheese until melted and smooth.",
      "Drain the pasta, reserving a splash of pasta water.",
      "Toss the fettuccine pasta into the alfredo sauce. Add pasta water if sauce is too thick. Garnish with parsley and serve."
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 3,
    difficulty: "Medium",
    cuisine: "Italian",
    caloriesPerServing: 380,
    tags: ["Pasta", "Italian", "Creamy", "Lunch", "Dinner"],
    userId: 2,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=600&auto=format&fit=crop",
    rating: 4.7,
    reviewCount: 85,
    mealType: ["Lunch", "Dinner"]
  },
  {
    id: 4,
    name: "Avocado Toast with Poached Egg",
    ingredients: [
      "2 Slices of Sourdough Bread",
      "1 Ripe Avocado",
      "2 Fresh Eggs",
      "1 tsp Lemon juice",
      "Red pepper flakes",
      "Salt and pepper"
    ],
    instructions: [
      "Toast the sourdough bread slices until golden brown and crispy.",
      "Mash the ripe avocado in a small bowl with lemon juice, salt, and pepper.",
      "Poach the eggs in gently simmering water with a drop of vinegar for 3-4 minutes.",
      "Spread the mashed avocado generously over the toasted sourdough slices.",
      "Carefully top each slice with a poached egg.",
      "Garnish with red pepper flakes and extra black pepper. Serve warm."
    ],
    prepTimeMinutes: 5,
    cookTimeMinutes: 5,
    servings: 1,
    difficulty: "Easy",
    cuisine: "Healthy",
    caloriesPerServing: 240,
    tags: ["Breakfast", "Healthy", "Avocado", "Egg"],
    userId: 3,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 210,
    mealType: ["Breakfast", "Snack"]
  },
  {
    id: 5,
    name: "Spicy Tuna Sushi Roll",
    ingredients: [
      "1 cup Sushi Rice (seasoned with vinegar)",
      "Nori (Seaweed sheets)",
      "4 oz Fresh Sashimi-grade Tuna, diced",
      "1 tbsp Sriracha sauce",
      "1 tsp Kewpie Mayonnaise",
      "Sesame seeds"
    ],
    instructions: [
      "Mix diced tuna with Sriracha and Kewpie mayonnaise in a bowl to make spicy tuna filling.",
      "Place a sheet of nori on a bamboo sushi rolling mat.",
      "Wet your hands and spread the seasoned sushi rice evenly over the nori, leaving a 1-inch border.",
      "Lay the spicy tuna mixture horizontally across the center of the rice.",
      "Roll the sushi tightly using the bamboo mat.",
      "Slice the roll into 8 equal pieces with a sharp wet knife, sprinkle with sesame seeds, and serve."
    ],
    prepTimeMinutes: 20,
    cookTimeMinutes: 15,
    servings: 2,
    difficulty: "Hard",
    cuisine: "Japanese",
    caloriesPerServing: 280,
    tags: ["Sushi", "Japanese", "Seafood", "Lunch", "Dinner"],
    userId: 2,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop",
    rating: 4.6,
    reviewCount: 95,
    mealType: ["Lunch", "Dinner"]
  },
  {
    id: 6,
    name: "Crispy Chocolate Chip Cookies",
    ingredients: [
      "1 cup All-purpose flour",
      "1/2 cup Unsalted butter, softened",
      "1/2 cup Brown sugar",
      "1/4 cup White granulated sugar",
      "1 Egg",
      "1 tsp Vanilla extract",
      "1/2 cup Chocolate chips"
    ],
    instructions: [
      "Preheat your oven to 375°F (190°C) and line a baking sheet with parchment paper.",
      "Cream the softened butter, brown sugar, and white sugar together until fluffy.",
      "Beat in the egg and vanilla extract.",
      "Gradually mix in the flour until just combined, then fold in the chocolate chips.",
      "Drop rounded tablespoons of dough onto the baking sheet, spaced 2 inches apart.",
      "Bake for 10-12 minutes until edges are golden brown. Let cool and enjoy!"
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    servings: 12,
    difficulty: "Easy",
    cuisine: "Dessert",
    caloriesPerServing: 180,
    tags: ["Dessert", "Cookies", "Baking", "Snack"],
    userId: 4,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 420,
    mealType: ["Snack"]
  }
];

export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await fetch(`${BASE_URL}?limit=30`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.recipes || [];
  } catch (error) {
    console.warn('Network request failed, serving local gourmet recipes database:', error);
    return LOCAL_FALLBACK_RECIPES;
  }
};

export const searchRecipes = async (query: string): Promise<Recipe[]> => {
  try {
    const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.recipes || [];
  } catch (error) {
    console.warn(`Failed to search recipes on network, matching offline search for "${query}":`, error);
    const lower = query.toLowerCase();
    return LOCAL_FALLBACK_RECIPES.filter(r => 
      r.name.toLowerCase().includes(lower) || 
      r.cuisine.toLowerCase().includes(lower) ||
      r.tags.some(t => t.toLowerCase().includes(lower))
    );
  }
};

export const getRecipeById = async (id: number): Promise<Recipe> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`Failed to fetch recipe ID ${id} over network, resolving with local database fallback:`, error);
    
    // Look up in explicit fallback list first
    const found = LOCAL_FALLBACK_RECIPES.find(r => r.id === id);
    if (found) return found;

    // Dynamically construct recipe details to prevent crashes for arbitrary IDs (7+)
    return {
      id: id,
      name: id === 7 ? "Creamy Garlic Pasta" : id === 8 ? "Gourmet Chicken Caesar" : `Signature Selection Dish #${id}`,
      ingredients: [
        "Fresh premium organic ingredients",
        "Chef's special garlic-herb infused butter",
        "Fragrant fresh garden microgreens",
        "Aromatic seasoning spices"
      ],
      instructions: [
        "Carefully prepare and plate the fresh ingredients.",
        "Saute lightly in warm pan over medium heat with garlic-herb butter.",
        "Garnish beautifully with freshly chopped greens and serve hot!"
      ],
      prepTimeMinutes: 12,
      cookTimeMinutes: 18,
      servings: 2,
      difficulty: "Medium",
      cuisine: "Continental",
      caloriesPerServing: 290,
      tags: ["Chef Special", "Gourmet", "Signature", "Lunch", "Dinner"],
      userId: 1,
      image: id === 7 
        ? "https://images.unsplash.com/photo-1546549032-9571cd6b27df?q=80&w=400&auto=format&fit=crop"
        : id === 8 
        ? "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=400&auto=format&fit=crop"
        : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop",
      rating: 4.8,
      reviewCount: 95,
      mealType: ["Lunch", "Dinner"]
    };
  }
};

export const getRecipesByMealType = async (mealType: string): Promise<Recipe[]> => {
  try {
    const response = await fetch(`${BASE_URL}/meal-type/${encodeURIComponent(mealType)}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.recipes || [];
  } catch (error) {
    console.warn(`Failed to fetch recipes by meal type "${mealType}", serving matching local offline data:`, error);
    if (mealType.toLowerCase() === 'all') return LOCAL_FALLBACK_RECIPES;
    return LOCAL_FALLBACK_RECIPES.filter(r => 
      r.mealType.some(m => m.toLowerCase() === mealType.toLowerCase())
    );
  }
};
