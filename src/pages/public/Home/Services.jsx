import React from 'react';

// Importing icons from assets
import SupportIcon from '../../../assets/images/Support.png';
import SecuredLetterIcon from '../../../assets/icons/imail.svg';
import EditIcon from '../../../assets/icons/edit.svg';
import ServiceIcon from '../../../assets/icons/setting.svg';

const services = [
  { title: 'Custom Software Development', icon: SupportIcon },
  { title: 'Web & Mobile App Development', icon: SecuredLetterIcon },
  { title: 'UI/UX Design', icon: EditIcon },
  { title: 'DevOps & Cloud Engineering', icon: SecuredLetterIcon },
  { title: 'AI/ML & Data Solutions', icon: SecuredLetterIcon },
  { title: 'QA & Testing', icon: ServiceIcon },
];

const borderClasses = [
  'border-r-2 border-b-2',
  'border-b-2',
  'border-l-2 border-b-2',
  'border-r-2 border-t-2',
  'border-t-2',
  'border-l-2 border-t-2',
];

const ServiceGrid = () => {
 return (
  <div className="w-full px-2 py-16 flex flex-col items-center">
    <div className="w-full max-w-[940px] flex flex-col items-center gap-12">
      <h2 className="text-center text-white text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
        Services Snapshot
      </h2>

      <div className="grid grid-cols-3 w-full">
        {services.map((service, index) => (
          <div
            key={index}
            className={`aspect-square flex flex-col justify-center items-center gap-6 sm:gap-8 p-2 sm:p-4 
              ${index < 3 ? 'border-b-2' : ''} 
              ${index % 3 !== 2 ? 'border-r-2' : ''} 
              border-white`}
          >
            <img
              src={service.icon}
              alt={`${service.title} icon`}
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            <div className="text-center text-white text-sm sm:text-lg font-semibold leading-snug px-2">
              {service.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);


};

export default ServiceGrid;

