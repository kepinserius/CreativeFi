// src/components/HowItWorks.tsx
export const HowItWorks = () => {
  const steps = [
    {
      title: "Create Your Project",
      description: "Set your funding goal, milestones, and token distribution for investors",
      number: "01",
      icon: "💡"
    },
    {
      title: "Crowdsource Funding",
      description: "Investors contribute ETH/USDC/USDT and receive project tokens in return",
      number: "02",
      icon: "💰"
    },
    {
      title: "Achieve Milestones",
      description: "Complete project milestones to unlock funds and prove progress",
      number: "03",
      icon: "🎯"
    },
    {
      title: "Share Revenue",
      description: "Distribute profits to token holders as your project succeeds",
      number: "04",
      icon: "📈"
    }
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How CreativeFi Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A decentralized platform where creators and investors collaborate to bring innovative projects to life.
          </p>
        </div>
        
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 text-center transition-all card-hover"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-2xl">
                    {step.icon}
                  </div>
                </div>
                
                <div className="text-3xl font-bold text-gray-600 mb-3">{step.number}</div>
                
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};