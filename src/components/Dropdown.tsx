'use client';

import { Listbox, Transition } from '@headlessui/react';
import { ChevronsUpDown } from 'lucide-react';
import { Fragment } from 'react';
import { cn } from '@/utils/cn';

export type DropdownOption = {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconClassName?: string;
};

type DropdownProps = {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md';
};

const Dropdown = ({ 
  value, 
  onChange, 
  options, 
  disabled = false, 
  placeholder = 'Select option',
  className = '',
  size = 'sm'
}: DropdownProps) => {
  const selectedOption = options.find(option => option.value === value);
  const SelectedIcon = selectedOption?.icon;

  const buttonSizeClasses = size === 'sm' 
    ? 'py-1.5 pl-3 pr-8 text-sm' 
    : 'py-2 pl-3 pr-10 text-base';

  const optionSizeClasses = size === 'sm' 
    ? 'py-2 pl-3 pr-6' 
    : 'py-2.5 pl-3 pr-6';

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className="relative">
        <Listbox.Button className={cn(
          'relative cursor-default text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 rounded-md border-gray-300 bg-gray-50 text-gray-600',
          buttonSizeClasses,
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}>
          <span className="flex items-center gap-2">
            {SelectedIcon && (
              <SelectedIcon className={cn('h-4 w-4 flex-shrink-0', selectedOption?.iconClassName)} />
            )}
            <span className="block truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronsUpDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 min-w-[140px] w-max overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {options.map((option) => {
              const OptionIcon = option.icon;
              return (
                <Listbox.Option
                  key={option.value}
                  className={({ active, selected }) =>
                    `relative cursor-default select-none ${optionSizeClasses} ${
                      selected 
                        ? 'bg-blue-100 text-blue-900' 
                        : active 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-900'
                    }`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <span className={`flex items-center gap-2 ${
                      selected ? 'font-medium' : 'font-normal'
                    }`}>
                      {OptionIcon && (
                        <OptionIcon className={cn('h-4 w-4 flex-shrink-0', option.iconClassName)} />
                      )}
                      {option.label}
                    </span>
                  )}
                </Listbox.Option>
              );
            })}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default Dropdown;