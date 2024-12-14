import logo from '../../assets/images/ReUZit_logo.png'

const Footer: React.FC = () => {
    return (
        <footer className="text-sm text-neutral-500">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-6 py-12 text-sm md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0">
                <div className="flex items-center font-bold">
                    <img
                        src={logo}
                        alt="logo team"
                        className="h-8 w-8 m-2"
                    />
                    <p>ReUZit</p>
                </div>
                {/* Navigation */}
                <nav>
                    <ul>
                        <li><a className="block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm text-black" href="/">Home</a></li>
                        <li><a className="block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm" href="/about">About</a></li>
                        <li><a className="block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm" href="/terms-conditions">Terms & Conditions</a></li>
                        <li><a className="block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm" href="/shipping-return-policy">Shipping & Return Policy</a></li>
                        <li><a className="block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm" href="/privacy-policy">Privacy Policy</a></li>
                        <li><a className="block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm" href="/frequently-asked-questions">FAQ</a></li>
                    </ul>
                </nav>
            </div>
            <div className="border-t border-neutral-200 py-6 text-sm">
                <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
                    <p>
                        © 2024 ReUZit, Inc. All rights reserved.
                    </p>
                    <p className="md:ml-auto"><a href="https://vercel.com" className="text-black">Created by a Tri0</a></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
