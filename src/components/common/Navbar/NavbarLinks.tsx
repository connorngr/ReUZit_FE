const NavbarLinks = () => {
    const links = [
      { name: "All", href: "/default-channel/products" },
      { name: "Apparel", href: "/default-channel/categories/apparel" },
      { name: "Accessories", href: "/default-channel/categories/accessories" },
    ];
  
    return (
      <ul className="hidden gap-4 overflow-x-auto whitespace-nowrap md:flex lg:gap-8 lg:px-0">
        {links.map((link) => (
          <li key={link.name} className="inline-flex">
            <a
              className="border-transparent text-neutral-500 inline-flex items-center border-b-2 pt-px text-sm font-medium hover:text-neutral-700"
              href={link.href}
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    );
  };
  
  export default NavbarLinks;
  