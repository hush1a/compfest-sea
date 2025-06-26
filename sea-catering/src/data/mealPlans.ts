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
    name: "Diet Plan",
    price: "Rp 30.000",
    period: "per meal",
    description: "Perfect for those seeking a balanced approach to healthy eating with portion-controlled, nutritious meals.",
    image: "/api/placeholder/400/300",
    features: [
      "Calorie-controlled portions",
      "Fresh, wholesome ingredients", 
      "Balanced macronutrients",
      "Weight management support",
      "Nutritionist approved",
      "Daily delivery available"
    ],
    detailedDescription: "Our Diet Plan is designed for individuals who want to maintain a healthy weight while enjoying delicious, nutritious meals. Each meal is carefully crafted to provide optimal nutrition with controlled portions.",
    nutritionInfo: {
      calories: "400-500",
      protein: "25-30g",
      carbs: "40-50g",
      fat: "15-20g"
    },
    sampleMeals: [
      "Breakfast: Greek yogurt with berries and granola",
      "Lunch: Grilled chicken salad with quinoa",
      "Dinner: Baked fish with steamed vegetables"
    ],
    dietaryInfo: ["Low Calorie", "Portion Controlled", "Balanced Nutrition"]
  },
  {
    id: 2,
    name: "Protein Plan",
    price: "Rp 40.000",
    period: "per meal",
    description: "High-protein meals designed for active individuals and fitness enthusiasts looking to optimize their performance.",
    image: "/api/placeholder/400/300",
    features: [
      "High-protein content (30g+)",
      "Lean meat and fish options",
      "Post-workout meal support",
      "Muscle building nutrition",
      "Energy optimization",
      "Performance focused recipes"
    ],
    detailedDescription: "Our Protein Plan is specifically designed for athletes, fitness enthusiasts, and anyone looking to increase their protein intake. Each meal is crafted to support muscle building, recovery, and overall performance.",
    nutritionInfo: {
      calories: "500-600",
      protein: "35-45g",
      carbs: "30-40g",
      fat: "20-25g"
    },
    sampleMeals: [
      "Breakfast: Protein pancakes with Greek yogurt",
      "Lunch: Grilled chicken breast with sweet potato",
      "Dinner: Lean beef stir-fry with quinoa"
    ],
    dietaryInfo: ["High Protein", "Muscle Building", "Post-Workout Optimized"]
  },
  {
    id: 3,
    name: "Royal Plan",
    price: "Rp 60.000",
    period: "per meal",
    description: "Premium gourmet meals with the finest ingredients, perfect for those who want luxury dining at home.",
    image: "/api/placeholder/400/300",
    features: [
      "Premium gourmet ingredients",
      "Chef-crafted recipes",
      "Luxurious presentation",
      "Exotic and rare ingredients",
      "Fine dining experience",
      "Artisanal preparation"
    ],
    detailedDescription: "Experience fine dining at home with our Royal Plan. Featuring premium ingredients, chef-crafted recipes, and restaurant-quality presentation delivered to your doorstep.",
    nutritionInfo: {
      calories: "600-700",
      protein: "30-40g",
      carbs: "50-60g",
      fat: "25-35g"
    },
    sampleMeals: [
      "Breakfast: Truffle scrambled eggs with smoked salmon",
      "Lunch: Wagyu beef salad with arugula",
      "Dinner: Pan-seared duck breast with seasonal vegetables"
    ],
    dietaryInfo: ["Gourmet", "Premium Ingredients", "Fine Dining Quality"]
  }
]
