import React from 'react';

interface PersonalDetailsProps {
  email: string | undefined;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ email }) => (
  
    // <div className="grid md:grid-cols-3 gap-4">
    //         <div>
    //           <h3 className="text-3xl font-bold text-gray-300">01</h3>
    //           <h3 className="text-xl font-bold text-gray-800 mt-1">Personal Details</h3>
    //         </div>
    //         <PersonalDetails email={user?.email || ''} />
    //       </div>
    <div className="md:col-span-2">
      <form>
        {/* Email */}
        <div>
          <input
            type="email"
            value={email || ''}
            disabled
            className="px-4 py-3 bg-gray-200 text-gray-800 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
          />
        </div>
        {/* Full Name */}
        <div>
          <input
            type="text"
            placeholder="Full name"
            className="px-4 mt-2 py-3 bg-white text-gray-800 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
          />
        </div>
        {/* Phone Number */}
        <div>
          <input
            type="number"
            placeholder="Phone number"
            className="px-4 mt-2 py-3 bg-white text-gray-800 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
          />
        </div>
      </form>
    </div>
  
);

export default PersonalDetails;
