import Listings from "./listing/common/homeListing/Listing";
import logo from '/src/assets/images/ReUZit_logo.png'; 

const Home = () => {

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-6 pt-6 sm:px-6 lg:px-8">
            <section>
            <div className="grid md:grid-cols-3 gap-6 min-h-[164px] py-8 p-16 bg-gradient-to-r from-green-700 to-green-400 font-sans overflow-hidden">
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold text-white">Chào mừng đến với ReUzit!</h1>
        <p className="text-base text-gray-200 mt-4">Nền tảng trao đổi đồ cũ tốt nhất cho mọi người</p>

        <button
          type="button"
          className="py-3 px-6 text-sm font-semibold bg-white text-green-600 hover:bg-slate-100 rounded-md mt-8"
        >
          Bắt đầu ngay
        </button>
      </div>

      <div className="relative max-md:hidden">
        <img
          src={logo}
          alt="Banner Image"
          className="w-full right-4 top-[-13px] md:absolute skew-x-[-16deg] rotate-2 object-cover"
        />
      </div>
    </div>
    </section>
            <h1 className="text-4xl font-extrabold text-black sm:text-center sm:text-6xl m-5">  </h1>
            <Listings />
        </div>
    );

}

export default Home;