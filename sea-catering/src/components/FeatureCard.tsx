interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  imageUrl: string
  extendsLeft: boolean
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon, 
  imageUrl, 
  extendsLeft 
}) => {
  return (
    <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500">
      <div className="flex items-center">
        {/* Extended Image - Left Side (for left-extending cards) */}
        {extendsLeft && (
          <div className="w-0 group-hover:w-80 transition-all duration-500 ease-in-out overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-80 h-40 object-cover"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 p-8">
          <div className="flex items-start gap-6">
            {/* Small Preview Image - Left side for left-extending, right side for right-extending */}
            {extendsLeft ? (
              <div className="w-16 h-16 group-hover:w-0 group-hover:h-0 transition-all duration-500 ease-in-out overflow-hidden rounded-lg flex-shrink-0">
                <img 
                  src={imageUrl} 
                  alt={`${title} Preview`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}
            
            {/* Text Content */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>
            
            {/* Small Preview Image - Right side for right-extending cards */}
            {!extendsLeft && (
              <div className="w-16 h-16 group-hover:w-0 group-hover:h-0 transition-all duration-500 ease-in-out overflow-hidden rounded-lg flex-shrink-0">
                <img 
                  src={imageUrl} 
                  alt={`${title} Preview`} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Extended Image - Right Side (for right-extending cards) */}
        {!extendsLeft && (
          <div className="w-0 group-hover:w-80 transition-all duration-500 ease-in-out overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-80 h-40 object-cover"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default FeatureCard
