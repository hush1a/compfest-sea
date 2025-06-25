export interface MealPlan {
  id: number
  name: string
  price: string
  period: string
  description: string
  image: string
  features: string[]
  detailedDescription: string
  nutritionInfo: {
    calories: string
    protein: string
    carbs: string
    fat: string
  }
  sampleMeals: string[]
  dietaryInfo: string[]
}

export const mealPlansData: MealPlan[] = [
  {
    id: 1,
    name: "Healthy Balance",
    price: "Rp 1.250.000",
    period: "Weekly",
    description: "Perfect for those seeking a balanced approach to healthy eating with portion-controlled meals.",
    image: "/api/placeholder/400/300",
    features: [
      "7 breakfast meals",
      "7 lunch meals", 
      "7 dinner meals",
      "Balanced macronutrients",
      "Fresh ingredients daily",
      "Nutritionist approved"
    ],
    detailedDescription: "Our Healthy Balance plan is designed for individuals who want to maintain a nutritious diet without compromising on taste. Each meal is carefully crafted to provide optimal nutrition while keeping you satisfied throughout the day.",
    nutritionInfo: {
      calories: "1,800",
      protein: "120g",
      carbs: "180g",
      fat: "60g"
    },
    sampleMeals: [
      "Breakfast: Overnight oats with berries and nuts",
      "Lunch: Grilled chicken salad with quinoa",
      "Dinner: Baked salmon with roasted vegetables"
    ],
    dietaryInfo: ["Gluten-Free Options", "Dairy-Free Available", "Low Sodium"]
  },
  {
    id: 2,
    name: "Plant Power",
    price: "Rp 980.000",
    period: "Weekly",
    description: "Delicious plant-based meals that prove vegetarian eating can be both satisfying and nutritious.",
    image: "/api/placeholder/400/300",
    features: [
      "100% plant-based",
      "Protein-rich legumes",
      "Seasonal vegetables",
      "Whole grain options",
      "Superfood ingredients",
      "Environmentally conscious"
    ],
    detailedDescription: "Our Plant Power plan showcases the incredible variety and nutrition available in plant-based eating. Each meal is designed to provide complete nutrition while supporting sustainable eating practices.",
    nutritionInfo: {
      calories: "1,600",
      protein: "80g",
      carbs: "200g",
      fat: "50g"
    },
    sampleMeals: [
      "Breakfast: Chia pudding with almond butter",
      "Lunch: Buddha bowl with tahini dressing",
      "Dinner: Lentil curry with quinoa"
    ],
    dietaryInfo: ["100% Vegan", "Organic Options", "Sustainable", "Fiber Rich"]
  },
  {
    id: 3,
    name: "Mediterranean",
    price: "Rp 1.450.000",
    period: "Weekly",
    description: "Fresh, flavorful meals inspired by the Mediterranean diet known for its health benefits and delicious taste.",
    image: "/api/placeholder/400/300",
    features: [
      "Mediterranean diet based",
      "Olive oil and herbs",
      "Fresh seafood",
      "Whole grains",
      "Seasonal produce",
      "Heart-healthy fats"
    ],
    detailedDescription: "Experience the flavors of the Mediterranean with our carefully curated meal plan. Rich in healthy fats, fresh vegetables, and lean proteins, this plan supports heart health while delivering exceptional taste.",
    nutritionInfo: {
      calories: "1,900",
      protein: "110g",
      carbs: "160g",
      fat: "90g"
    },
    sampleMeals: [
      "Breakfast: Greek yogurt with honey and walnuts",
      "Lunch: Mediterranean quinoa salad",
      "Dinner: Herb-crusted fish with roasted vegetables"
    ],
    dietaryInfo: ["Heart Healthy", "Mediterranean Style", "Omega-3 Rich", "Antioxidant Rich"]
  }
]
