import React from 'react';

const Sidebar: React.FC = () => (
  <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
    <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
      <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
      {/* <a href="#" className="flex items-center px-3 py-2.5 font-bold bg-white text-indigo-900 border rounded-full">
        Public Profile
      </a>
      <a href="#" className="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full">
        Account Settings
      </a>
      <a href="#" className="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full">
        Notifications
      </a>
      <a href="#" className="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full">
        WishList
      </a> */}
    </div>
  </aside>
);

export default Sidebar;
