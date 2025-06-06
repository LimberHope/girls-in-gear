import React from 'react';

type Program = {
  programType: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  ageRange: string;
  meetingDay: string;
  meetingTime: string;
  region: string;
  registrationStatus: string;
  acceptingVolunteers: string;
};

interface ProgramListProps {
  programs: Program[];
}

const ProgramList: React.FC<ProgramListProps> = ({ programs }) => {
  return (
    <div className="space-y-4  overflow-y-auto">
      {programs?.map((program, index) => (
        <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
          <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
            👟
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-cyan-600 text-sm">
              {program.programType}
            </h4>
            <p className="text-xs text-gray-600">
              {program.address}, {program.city}, {program.state} {program.zip}
            </p>
            <p className="text-xs text-gray-500">📞 (555)-55555</p>
            <p className="text-xs text-gray-500">Age Range: {program.ageRange}</p>
            <p className="text-xs text-cyan-500">
              {program.meetingDay} {program.meetingTime}
            </p>
          </div>
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </div>
      ))}
    </div>
  );
};

export default ProgramList; 