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

            <p className="text-xs text-gray-500 mb-1">
              <svg
                className="inline-block w-3 h-3 mr-1 text-cyan-400"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16.5562 12.9062L16.1007 13.359C16.1007 13.359 15.0181 14.4355 12.0631 11.4972C9.10812 8.55901 10.1907 7.48257 10.1907 7.48257L10.4775 7.19738C11.1841 6.49484 11.2507 5.36691 10.6342 4.54348L9.37326 2.85908C8.61028 1.83992 7.13596 1.70529 6.26145 2.57483L4.69185 4.13552C4.25823 4.56668 3.96765 5.12559 4.00289 5.74561C4.09304 7.33182 4.81071 10.7447 8.81536 14.7266C13.0621 18.9492 17.0468 19.117 18.6763 18.9651C19.1917 18.9171 19.6399 18.6546 20.0011 18.2954L21.4217 16.883C22.3806 15.9295 22.1102 14.2949 20.8833 13.628L18.9728 12.5894C18.1672 12.1515 17.1858 12.2801 16.5562 12.9062Z" />
              </svg>
              (555)-55555
            </p>
            <p className="text-xs text-cyan-500 mb-3">
              <svg
                className="inline-block w-3 h-3 mr-1 text-cyan-500"
                viewBox="0 0 512 512"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M477.984,39.203H34.016C15.219,39.203,0,54.438,0,73.219v283.969c0,18.781,15.219,34.016,34.016,34.016H220
                        v7.578c0,18.781-15.219,34.016-34.016,34.016H136v40h73.188h93.625H376v-40h-49.984c-18.797,0-34.016-15.234-34.016-34.016v-7.578
                        h185.984c18.797,0,34.016-15.234,34.016-34.016V73.219C512,54.438,496.781,39.203,477.984,39.203z M464,315.859
                        c0,6.266-5.078,11.344-11.344,11.344H59.344c-6.266,0-11.344-5.078-11.344-11.344V98.547c0-6.266,5.078-11.344,11.344-11.344
                        h393.313c6.266,0,11.344,5.078,11.344,11.344V315.859z"
                />
              </svg>
              http://girlsingear.org/
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
