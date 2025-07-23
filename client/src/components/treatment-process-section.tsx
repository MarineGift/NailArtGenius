import { Button } from '@/components/ui/button';

export function TreatmentProcessSection() {
  const treatmentSteps = [
    {
      step: 1,
      title: "Nail Preparation",
      description: "Cuticle care and nail trimming"
    },
    {
      step: 2,
      title: "Base Coating",
      description: "Base work for healthy nails"
    },
    {
      step: 3,
      title: "Color Application",
      description: "Precise color application process"
    },
    {
      step: 4,
      title: "Finish Coating",
      description: "Top coating for long-lasting shine"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-6">
        {/* Treatment Process */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">Treatment Process</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {treatmentSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">Step {step.step}</span>
                </div>
                <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">
            Do you have a design you like?
          </h3>
          <p className="text-lg mb-6">
            Book now and experience professional nail art services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3"
              onClick={() => window.location.href = '/booking'}
            >
              Book Appointment
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3"
              onClick={() => window.location.href = '/contact'}
            >
              Get Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}