'use client';

import React from 'react';
import { CheckCircle, Clock, Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimelineStep {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'pending' | 'rejected';
  date?: string;
  description?: string;
}

interface ApplicationTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export function ApplicationTimeline({ steps, className }: ApplicationTimelineProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="relative">
        {/* Horizontal line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{
              width: `${(steps.filter(s => s.status === 'completed').length / (steps.length - 1)) * 100}%`
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center" style={{ flex: 1 }}>
              {/* Icon */}
              <div
                className={cn(
                  'relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 bg-white transition-all duration-300',
                  {
                    'border-blue-600 bg-blue-600': step.status === 'completed',
                    'border-blue-500 bg-blue-50': step.status === 'current',
                    'border-gray-300 bg-white': step.status === 'pending',
                    'border-red-500 bg-red-50': step.status === 'rejected',
                  }
                )}
              >
                {step.status === 'completed' && (
                  <CheckCircle className="w-6 h-6 text-white" />
                )}
                {step.status === 'current' && (
                  <Clock className="w-6 h-6 text-blue-600 animate-pulse" />
                )}
                {step.status === 'pending' && (
                  <Clock className="w-6 h-6 text-gray-400" />
                )}
                {step.status === 'rejected' && (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                )}
              </div>

              {/* Label */}
              <div className="mt-3 text-center max-w-[120px]">
                <p
                  className={cn(
                    'text-sm font-medium',
                    {
                      'text-blue-600': step.status === 'completed' || step.status === 'current',
                      'text-gray-500': step.status === 'pending',
                      'text-red-500': step.status === 'rejected',
                    }
                  )}
                >
                  {step.label}
                </p>
                {step.date && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {step.date}
                  </p>
                )}
                {step.description && (
                  <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
