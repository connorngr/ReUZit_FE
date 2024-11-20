import Listings from "./Listing";


const Home = () => {

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-6 pt-6 sm:px-6 lg:px-8">
            <section className="rounded bg-neutral-100 py-8 sm:py-12">
                <div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-2">
                    <div className="max-w-md space-y-4">
                        <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Discover our Curated Collection</h2>
                        <p className="text-pretty text-neutral-600">Explore our carefully selected products for your home and lifestyle.</p>
                        <a className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-900 px-6 font-medium text-neutral-50 transition-colors hover:bg-neutral-900/90 focus:outline-none focus:ring-1 focus:ring-neutral-950" href="/category/accessories">Shop Now</a>
                    </div>
                    <img alt="Cup of Coffee" loading="eager" width="450" height="450" decoding="async" data-nimg="1" className="rounded" sizes="(max-width: 640px) 70vw, 450px"
                        src="https://breakfastwithwords.wordpress.com/wp-content/uploads/2014/08/antique-store.jpg"
                    />
                </div>
            </section>
            <h1 className="text-4xl font-extrabold text-black sm:text-center sm:text-6xl m-5">Posts</h1>
            <Listings />
        </div>
    );

}

export default Home;