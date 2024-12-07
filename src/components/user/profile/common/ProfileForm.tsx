import React from 'react';

interface ProfileFormProps {
  formData: {
    firstName: string;
    lastName: string;
    bio: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  userEmail: string;
  userMoney: string | number;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  formData,
  onChange,
  onSubmit,
  userEmail,
  userMoney,
}) => (
  <form onSubmit={onSubmit}>
    <div className="items-center mt-8 sm:mt-14 text-[#202142]">
      <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
        <div className="w-full">
          <label htmlFor="first_name" className="block mb-2 text-sm font-medium">
            Your first name
          </label>
          <input
            type="text"
            id="first_name"
            className="bg-indigo-50 border text-sm rounded-lg w-full p-2.5"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
          />
        </div>
        <div className="w-full">
          <label htmlFor="last_name" className="block mb-2 text-sm font-medium">
            Your last name
          </label>
          <input
            type="text"
            id="last_name"
            className="bg-indigo-50 border text-sm rounded-lg w-full p-2.5"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
          />
        </div>
      </div>
      <div className="mb-2 sm:mb-6">
        <label htmlFor="email" className="block mb-2 text-sm font-medium">
          Your email
        </label>
        <input
          type="email"
          id="email"
          className="bg-indigo-50 border text-sm rounded-lg w-full p-2.5"
          value={userEmail}
          readOnly
        />
      </div>
      <div className="mb-2 sm:mb-6">
        <label htmlFor="money" className="block mb-2 text-sm font-medium">
          Your money
        </label>
        <input
          type="text"
          id="money"
          className="bg-indigo-50 border text-sm rounded-lg w-full p-2.5"
          value={userMoney}
          readOnly
        />
      </div>
      <div className="mb-6">
        <label htmlFor="bio" className="block mb-2 text-sm font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          rows={4}
          className="bg-indigo-50 border text-sm rounded-lg w-full p-2.5"
          name="bio"
          value={formData.bio}
          onChange={onChange}
        ></textarea>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg text-sm w-auto px-5 py-2.5"
        >
          Save
        </button>
      </div>
    </div>
  </form>
);

export default ProfileForm;
