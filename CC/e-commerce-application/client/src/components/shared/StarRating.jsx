import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, numReviews, size = 'sm' }) {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">
        {rating.toFixed(1)}
        {numReviews !== undefined && <span className="ml-1">({numReviews.toLocaleString()})</span>}
      </span>
    </div>
  );
}
