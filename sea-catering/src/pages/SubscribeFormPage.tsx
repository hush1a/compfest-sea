import SubscriptionForm from '../components/SubscriptionForm'
import PageHeader from '../components/PageHeader'

const SubscribeFormPage = () => {
  return (
    <div className="pt-16">
      <PageHeader 
        title="Subscribe to SEA Catering"
        description="Fill out the form below to create your personalized meal subscription plan."
      />
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <SubscriptionForm />
        </div>
      </section>
    </div>
  )
}

export default SubscribeFormPage
