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


      </div>
    </section>
  );
}