import { Listing } from "../../api/listing";
import { API_URL } from "../../api/auth.ts";


interface CardProps {
   listing: Listing;
}



const Card: React.FC<CardProps> = ({ listing }) => {
   const imageUrl = listing.images.length > 0 ? listing.images[0].url : null;
  return (
     <div>
        {/* <a href={`/product/${listing.id}`}> */}
           <article className="overflow-hidden rounded border bg-white">
              <div className="aspect-square w-full overflow-hidden bg-neutral-100">
                 {listing.images.length > 0 ? (
                    <img 
                       src={`${API_URL}${imageUrl}`} // Display the first image from the images array
                       alt={listing.title} 
                       loading="eager" 
                       width="768" 
                       height="768" 
                       decoding="async" 
                       data-nimg="1" 
                       className="group-hover:rotate hover-perspective w-full bg-neutral-100 object-cover object-center transition-opacity group-hover:opacity-75" 
                       sizes="(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 700px" 
                    />
                 ) : (
                    <div className="w-full h-full bg-neutral-200 flex items-center justify-center">No Image</div>
                 )}
              </div>
              <div className="p-4">
                 <h2 className="text-lg font-semibold text-neutral-700">{listing.title}</h2>
                 <footer className="text-sm font-medium text-neutral-900">
                    <p>${listing.price.toFixed(2)}</p>  {/* Format price to 2 decimal places */}
                 </footer>
              </div>
           </article>
        {/* </a> */}
     </div>
  );
};

export default Card;