import React, { useState } from "react";

type ProductImagesProps = {
  // Pass an array of image URLs from your API / DB
  images: string[];
};

const ProductImages: React.FC<ProductImagesProps> = ({ images }) => {
  // Fallback: if no images passed, avoid crashes
  const safeImages =
    images && images.length > 0
      ? images
      : ["/images/placeholder-1.jpg", "/images/placeholder-2.jpg"];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCursorPos({ x, y });
  };

  return (
    <div className="flex gap-8">
      {/* LEFT: main image + thumbnails */}
      <div>
        {/* main image (hover area) */}
        <div
          className="w-[350px] h-[350px] overflow-hidden rounded-xl bg-gray-100 cursor-crosshair"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
        >
          <img
            src={safeImages[activeIndex]}
            alt="Product"
            className="w-full h-full object-cover"
          />
        </div>

        {/* thumbnails row */}
        <div className="flex gap-3 mt-3">
          {safeImages.map((img, index) => (
            <button
              key={img + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                index === activeIndex
                  ? "border-orange-500"
                  : "border-transparent"
              }`}
            >
              <img
                src={img}
                alt={`thumb-${index}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: zoom panel OR product info */}
      <div className="flex-1">
        {isHovering ? (
          // zoom panel (shows only while hovering left image)
          <div className="w-[350px] h-[350px] border rounded-xl overflow-hidden bg-gray-100">
            <div
              className="w-full h-full bg-no-repeat"
              style={{
                backgroundImage: `url(${safeImages[activeIndex]})`,
                backgroundSize: "200%", // zoom level
                backgroundPosition: `${cursorPos.x}% ${cursorPos.y}%`,
              }}
            />
          </div>
        ) : (
          // normal product content when not hovering
          <div className="space-y-3">
            <h1 className="text-xl font-semibold">
              Product title goes here
            </h1>
            <p className="text-lg text-green-700 font-medium">₹1,499</p>

            <div className="flex gap-3 mt-2">
              <button className="px-6 py-2 rounded-full bg-orange-500 text-white">
                Buy Now
              </button>
              <button className="px-6 py-2 rounded-full border border-orange-500 text-orange-500">
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImages;
