import React from 'react';
import { Check } from 'lucide-react';

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps, currentStep }) => (
  <div className="flex items-center justify-between mb-8">
    {steps.map((step, index) => (
      <React.Fragment key={index}>
        <div className="flex flex-col items-center flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
            index < currentStep ? 'bg-green-500 text-white' :
            index === currentStep ? 'bg-sky-500 text-white' :
            'bg-neutral-200 text-neutral-500'
          }`}>
            {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
          </div>
          <p className={`text-xs mt-2 font-medium ${
            index <= currentStep ? 'text-neutral-800' : 'text-neutral-400'
          }`}>{step}</p>
        </div>
        {index < steps.length - 1 && (
          <div className={`h-1 flex-1 mx-2 transition-all ${
            index < currentStep ? 'bg-green-500' : 'bg-neutral-200'
          }`} />
        )}
      </React.Fragment>
    ))}
  </div>
);
