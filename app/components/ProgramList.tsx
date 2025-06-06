import React from "react";

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
  handleProgramClick: (program: Program) => Promise<void>;
}

const ProgramList: React.FC<ProgramListProps> = ({
  programs,
  handleProgramClick,
}) => {
  return (
    <div className="space-y-4 overflow-y-auto">
      {programs?.map((program, index) => (
        <div
          key={index}
          className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          onClick={() => handleProgramClick(program)}
        >
          <div className="flex flex-col items-center p-3">
            <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white p-2">
              <svg
                fill="currentColor"
                height="16"
                width="16"
                viewBox="0 0 491.351 491.351"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M381.559,182.007c-0.895,0-1.755,0.115-2.632,0.138l-14.934-87.322c-0.809-4.71-3.613-8.842-7.674-11.355
                        c-4.051-2.511-8.998-3.154-13.582-1.772l-44.975,13.622c-8.792,2.667-13.763,11.963-11.097,20.771
                        c2.667,8.801,11.992,13.789,20.757,11.111l26.901-8.15l6.167,35.949H198.895v-7.076l17.403-4.393
                        c6.916-1.741,11.845-8.19,11.433-15.575c-0.464-8.369-7.639-14.77-16.018-14.29l-64.285,3.653c-1.282,0.08-2.701,0.292-4.001,0.616
                        c-11.415,2.889-18.349,14.487-15.467,25.906c2.882,11.419,14.495,18.339,25.911,15.458l11.707-2.959v10.815l-13.694,23.586
                        c-12.964-5.61-27.142-8.733-42.032-8.733C49.282,182.007,0,233.227,0,296.184C0,359.151,49.282,410.37,109.852,410.37
                        c55.081,0,100.708-42.453,108.494-97.529h17.763c4.732,0,9.239-2.017,12.396-5.547l24.432-27.287
                        c-0.732,5.304-1.239,10.673-1.239,16.177c0,62.968,49.291,114.187,109.861,114.187c60.543,0,109.792-51.219,109.792-114.187
                        C491.351,233.227,442.102,182.007,381.559,182.007z M109.852,377.058c-42.203,0-76.544-36.28-76.544-80.874
                        c0-44.591,34.341-80.864,76.544-80.864c8.783,0,17.084,1.895,24.956,4.789l-39.365,67.709c-2.994,5.148-3.011,11.508-0.035,16.672
                        c2.959,5.165,8.474,8.352,14.444,8.352h74.824C177.39,349.464,146.62,377.058,109.852,377.058z M184.676,279.528h-45.868
                        l24.078-41.406C173.682,249.151,181.476,263.423,184.676,279.528z M228.66,279.528h-10.314
                        c-4.001-28.383-17.988-53.433-38.255-71.018l11.743-20.202h118.464L228.66,279.528z M381.559,377.058
                        c-42.211,0-76.544-36.28-76.544-80.874c0-33.481,19.355-62.272,46.874-74.536l13.239,77.351c1.403,8.118,8.431,13.842,16.397,13.842
                        c0.945,0,1.892-0.072,2.829-0.236c9.085-1.553,15.166-10.167,13.618-19.232l-13.307-77.72c40.714,1.774,73.378,37.07,73.378,80.531
                        C458.043,340.777,423.719,377.058,381.559,377.058z"
                />
              </svg>
            </div>
            <span className="text-[8px] text-cyan-400 mt-1">Bicycle</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-cyan-600 text-sm">
              Girls on the Run {program.region}
            </h4>
            <p className="text-xs text-gray-600">
              {program.address}, {program.city}, {program.state} {program.zip}
            </p>
            <p className="text-xs text-gray-500">📞 (555)-55555</p>
            <p className="text-xs text-gray-500">
              Age Range: {program.ageRange}
            </p>
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
