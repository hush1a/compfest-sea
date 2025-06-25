import MealPlanCard from '../components/MealPlanCard'
import PageHeader from '../components/PageHeader'
import { mealPlansData } from '../data/mealPlans'

const Menu = () => {
  return (
    <div className="pt-16">
      <PageHeader 
        title="Our Menu & Meal Plans"
        description="Discover our carefully crafted meal plans designed to meet your nutritional needs and taste preferences."
      />
      
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mealPlansData.map((plan) => (
              <MealPlanCard key={plan.id} mealPlan={plan} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Menu
