const OfferBanner = ({ coupon }) => {
  if (!coupon) return null;

  const offerText = `🎉 Use code ${coupon.code} to get ${coupon.discountPct}% off! 🛍️`;

  return (
    <div className="bg-orange-600 overflow-hidden py-2 hover:bg-orange-700 transition-colors duration-300">
      <div className="marquee-wrapper">
        <div className="marquee">
          {[...Array(3)].map((_, index) => (
            <span key={index} className="mx-8 text-white text-sm md:text-base">
              {offerText}
            </span>
          ))}
        </div>
        <div className="marquee" aria-hidden="true">
          {[...Array(3)].map((_, index) => (
            <span key={`dup-${index}`} className="mx-8 text-white text-sm md:text-base">
              {offerText}
            </span>
          ))}
        </div>
      </div>
      <style jsx>{`
        .marquee-wrapper {
          display: flex;
          width: 200%;
          user-select: none;
        }
        .marquee {
          flex: 0 0 100%;
          display: flex;
          animation: scroll 20s linear infinite;
          white-space: nowrap;
        }
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
        .marquee-wrapper:hover .marquee {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default OfferBanner;
