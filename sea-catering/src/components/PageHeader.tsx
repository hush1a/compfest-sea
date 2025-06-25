interface PageHeaderProps {
  title: string
  description: string
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white py-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
          {description}
        </p>
      </div>
    </div>
  )
}

export default PageHeader
