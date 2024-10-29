import {Link} from "react-router-dom";

interface NavItem {
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Users", path: "/admin/users" },
  // { label: "Settings", path: "/admin/settings" },
  // { label: "Reports", path: "/admin/reports" },
  // { label: "Logout", path: "/logout" },
];

const VerticalNavbar: React.FC = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-14 flex-col border-r bg-background sm:flex">
   <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
       {navItems.map((item) => (
           <Link
               key={item.path}
               to={item.path}
               className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
           >
               {item.label}
           </Link>
       ))}
      <a className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base" href="https://vercel.com/templates/next.js/admin-dashboard-tailwind-postgres-react-nextjs">
         <svg className="h-3 w-3 transition-all group-hover:scale-110" aria-label="Vercel logomark" height="64" role="img" viewBox="0 0 74 64">
            <path d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z" fill="currentColor"></path>
         </svg>
         <span className="sr-only">Acme Inc</span>
      </a>
      <a className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8" data-state="closed" href="#">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-house h-5 w-5">
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
            <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
         </svg>
         <span className="sr-only">Dashboard</span>
      </a>
   </nav>
</aside>
  );
};

export default VerticalNavbar;
