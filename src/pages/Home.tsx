import { CiAirportSign1, CiLocationArrow1 } from "react-icons/ci";
import Listings from "./listing/common/homeListing/Listing";
import logo from '/src/assets/images/ReUZit_logo.png';
import Footer from "../components/layout/Footer";

const Home = () => {

  return (
    <div>
      <div className="container px-20 py-10 mx-auto xl:px-0 flex flex-wrap">
        <HeroContent />
        <HeroImage />
      </div>
      <Listings />
      <Footer />
    </div>


  );

}

const HeroContent = () => {
  return (
    <div className="flex px-10 items-center w-full lg:w-1/2">
      <div className="max-w-2xl mb-8">
        <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight">
          ReUZit: Peer-to-Peer Marketplace.
        </h1>
        <p className="py-5 text-xl leading-normal text-black lg:text-xl xl:text-2x">
          ReUzit is a peer-to-peer marketplace designed to help people buy, sell, and trade goods or services directly with others. Our platform fosters a sustainable community by promoting reuse and reducing waste, making it easier to find value in pre-loved items. Join us in creating a more eco-friendly and connected world!
        </p>
        <div className="flex flex-row items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
          <a
            target="_blank"
            rel="noopener"
            className="flex px-8 py-4 text-lg items-center font-medium text-center text-white bg-primary rounded-md"
          >
            See more
            <CiLocationArrow1
              className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

const HeroImage = () => {
  return (
    <div className="flex items-center justify-center w-full lg:w-1/2">
      <div>
        <img
          alt="Hero Illustration"
          loading="eager"
          width="616"
          height="617"
          decoding="async"
          data-nimg="1"
          className="rounded-full"
          style={{ color: "transparent" }}
          src="https://img.freepik.com/premium-photo/violet-stock-chart-going-up_1279572-10534.jpg"
        />
      </div>
    </div>
  );
};

export default Home;