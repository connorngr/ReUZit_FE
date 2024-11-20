import { NavLink } from "react-router-dom"; // Use NavLink for navigation
import { IoHomeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
interface NavItem {
   label: string;
   path: string;
}

// const navItems: NavItem[] = [
//   { label: "Dashboard", path: "/admin/dashboard" },
//   { label: "Users", path: "/admin/users" },
//   { label: "Settings", path: "/admin/settings" },
//   { label: "Reports", path: "/admin/reports" },
//   { label: "Logout", path: "/logout" },
// ];

const VerticalNavbar: React.FC = () => {
   return (
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-14 flex-col border-r bg-background sm:flex">
         <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            {/*<a className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base" href="https://vercel.com/templates/next.js/admin-dashboard-tailwind-postgres-react-nextjs">*/}
            {/*   <svg className="h-3 w-3 transition-all group-hover:scale-110" aria-label="Vercel logomark" height="64" role="img" viewBox="0 0 74 64">*/}
            {/*      <path d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z" fill="currentColor"></path>*/}
            {/*   </svg>*/}
            {/*   <span className="sr-only">Acme Inc</span>*/}
            {/*</a>*/}
            <Link to="dashboard" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8" data-state="closed">
               <IoHomeOutline className="h-6 w-6" />
            </Link>


            {/* <a className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8" data-state="closed" href="#">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-shopping-cart h-5 w-5">
            <circle cx="8" cy="21" r="1"></circle>
            <circle cx="19" cy="21" r="1"></circle>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
         </svg>
         <span className="sr-only">Orders</span>
      </a>
      <a className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 bg-accent text-black" data-state="closed" href="/">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-package h-5 w-5">
            <path d="m7.5 4.27 9 5.15"></path>
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
            <path d="m3.3 7 8.7 5 8.7-5"></path>
            <path d="M12 22V12"></path>
         </svg>
         <span className="sr-only">Products</span>
      </a>
      <a className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8" data-state="closed" href="/customers">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-users-round h-5 w-5">
            <path d="M18 21a8 8 0 0 0-16 0"></path>
            <circle cx="10" cy="8" r="5"></circle>
            <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"></path>
         </svg>
         <span className="sr-only">Customers</span>
      </a>
      <a className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8" data-state="closed" href="#">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-line-chart h-5 w-5">
            <path d="M3 3v18h18"></path>
            <path d="m19 9-5 5-4-4-3 3"></path>
         </svg>
         <span className="sr-only">Analytics</span>
      </a> */}
         </nav>
         {/* <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
      <a className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8" data-state="closed" href="#">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-settings h-5 w-5">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
         </svg>
         <span className="sr-only">Settings</span>
      </a>
   </nav> */}
      </aside>

      // <div classNameName="vertical-navbar">
      //   <h2 classNameName="navbar-title">Admin Panel</h2>
      //   <ul classNameName="navbar-list">
      //     {navItems.map((item) => (
      //       <li key={item.label} classNameName="navbar-item">
      //         <NavLink
      //           to={item.path}
      //           classNameName={({ isActive }) => (isActive ? "active" : "")}
      //         >
      //           {item.label}
      //         </NavLink>
      //       </li>
      //     ))}
      //   </ul>
      // </div>
   );
};

export default VerticalNavbar;
