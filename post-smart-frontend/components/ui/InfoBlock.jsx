import React from 'react';

const InfoBlock = () => {
  const steps = [
    {
      number: '1',
      title: 'Enter Your Topic',
      description: 'Provide a topic or keywords for your post and let AI do the heavy lifting.'
    },
    {
      number: '2',
      title: 'Customize Content',
      description: 'Adjust tone, length and style to match your brand voice and target audience.'
    },
    {
      number: '3',
      title: 'Generate & Edit',
      description: 'Review AI-generated content and make quick edits before publishing.'
    },
    {
      number: '4',
      title: 'Share Everywhere',
      description: 'Publish directly to your favorite platforms with just one click.'
    }
  ];

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 pb-4 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
          Writing your posts. Easier than ever.
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 text-white font-bold text-2xl">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoBlock;