import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import React from 'react';
import { BsStarFill } from 'react-icons/bs';
import { supabase } from '../lib/supabase';
import { v4 } from 'uuid';
import toast from 'react-hot-toast';

interface Review {
  review: string;
  rating: number;
  email?: string;
}

interface Product {
  id: string;
  reviews: Review[];
}

interface ReviewsProps {
  product: Product;
}

interface RatingCount {
  rating: number;
  count: number;
  id: string;
}

interface ReviewsData {
  totalCount: number;
  average: number;
  counts: RatingCount[];
}

function Reviews({ product }: ReviewsProps) {
  const [revealReview, setRevealReview] = useState<boolean>(false);
  const userAcc = JSON.parse(localStorage.getItem("authUser") || "{}");
  const [emptyField, setEmptyField] = useState<boolean>(false);
  const [userReview, setUserReview] = useState<Review>({ review: "", rating: 0 });
  const [reviews, setReviews] = useState<ReviewsData>();
  const [reviewArray, setReviewArray] = useState<Review[]>([]);

  // 🔑 Fetch reviews from Supabase
  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("comment, rating, user_id, users: user_id (email)")
        .eq("product_id", product.id);

      if (error) throw error;

      const mappedReviews: Review[] = data.map((r: any) => ({
        review: r.comment,
        rating: r.rating,
        email: r.users?.email || "Anonymous",
      }));

      setReviewArray(mappedReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  // 🚀 Run once on mount
  useEffect(() => {
    fetchReviews();
  }, [product.id]);

  // 🔥 Realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("reviews-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reviews", filter: `product_id=eq.${product.id}` },
        (payload) => {
          const newReview: Review = {
            review: payload.new.comment,
            rating: payload.new.rating,
            email: userAcc.email,
          };
          setReviewArray((prev) => [...prev, newReview]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [product.id]);

  // ⭐ Calculate averages and counts
  useEffect(() => {
    const totalCount = reviewArray?.length ?? 0;
    const average = reviewArray?.length
      ? reviewArray.reduce((acc, review) => acc + Number(review.rating), 0) /
        reviewArray.length
      : 0;

    const ratingCounts: { [key: number]: number } = {};
    reviewArray?.forEach((eachReview) => {
      const rating = Number(eachReview?.rating);
      if (ratingCounts[rating]) {
        ratingCounts[rating]++;
      } else {
        ratingCounts[rating] = 1;
      }
    });

    const counts: RatingCount[] = Object.keys(ratingCounts).map((rating) => {
      return {
        rating: Number(rating),
        count: ratingCounts[Number(rating)],
        id: v4(),
      };
    });

    const reviewData = { totalCount, average, counts };
    setReviews(reviewData);
  }, [reviewArray]);

  function classNames(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
  }

  const handleReview = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUserReview((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmitReview = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userReview.review.trim() === "") {
      setEmptyField(true);
      toast.error("Enter all Fields");
      return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      toast.error("You must be logged in to review");
      return;
    }

    try {
      const { error } = await supabase.from("reviews").insert([
        {
          product_id: product.id,
          user_id: user.id,
          rating: Number(userReview.rating),
          comment: userReview.review,
        },
      ]);

      if (error) {
        console.log("AN Unexpected error occurred", error);
        if(error?.message.includes("duplicate")){
          toast.error("Multiple comments are not allowed.");

        }
        toast.error("Failed to submit review.");
        return;
      }

      // ✅ Reset form
      setUserReview({ review: "", rating: 0 });
      setRevealReview(false);

      // ✅ Refresh reviews list
      await fetchReviews();

      toast.success("Review submitted!");
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Failed to submit review.");
    }
  };

  // Clear red border after 3s
  useEffect(() => {
    const timer = setTimeout(() => {
      setEmptyField(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [emptyField]);

  return (
    <React.Fragment>
      {/* Review form modal */}
      {revealReview && (
        <section className='bg-black bg-opacity-85 flex flex-col items-center justify-center z-10 px-10 py-14 fixed w-full h-full top-0 left-0'>
          <form onSubmit={handleSubmitReview} className='flex flex-col gap-6'>
            <textarea
              onChange={handleReview}
              name="review"
              placeholder='Write Your Review'
              value={userReview.review}
              className={`${emptyField && userReview.review.trim() === "" && "border-red-600 border-[2px]"} outline-none border-black border-[2px] w-[400px] h-[200px] md:w-[600px] md:h-[200px] rounded-lg px-5 py-2`}
            />
            <label className="w-full text-black">
              <span className='text-white'>Rating:</span>
              <input
                onChange={handleReview}
                type="number"
                min={0}
                max={5}
                name="rating"
                value={userReview.rating}
                className='ring-[#086148] outline-none rounded-md px-2 py-1 w-full'
              />
            </label>
            <aside className='grid grid-cols-2 gap-5 justify-between items-center px-10'>
              <button className='rounded-md px-2 py-1 bg-[#086148] text-white font-semibold text-lg'>
                Submit Review
              </button>
              <button
                onClick={() => setRevealReview(false)}
                className='rounded-md px-2 py-1 ring-2 ring-[#086148] text-white font-semibold text-lg'
              >
                Cancel
              </button>
            </aside>
          </form>
        </section>
      )}

      {/* Reviews Section */}
      <section aria-labelledby="reviews-heading" className="bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 py-5">
          <div className="lg:col-span-4">
            <h2 id="reviews-heading" className="text-2xl font-bold tracking-tight text-gray-900">
              Customer Reviews
            </h2>

            {/* Average rating */}
            <div className="mt-3 flex items-center">
              <div>
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <BsStarFill
                      key={rating}
                      className={classNames(
                        reviews && reviews.average > rating
                          ? "text-yellow-400"
                          : "text-gray-300",
                        "h-5 w-5 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{reviews?.average} out of 5 stars</p>
              </div>
              <p className="ml-2 text-sm text-gray-900">
                Based on {reviewArray?.length ?? "0"} reviews
              </p>
            </div>

            {/* Ratings breakdown */}
            <div className="mt-6">
              <dl className="space-y-3">
                {reviews?.counts.map((count) => (
                  <div key={count.rating} className="flex items-center text-sm">
                    <dt className="flex flex-1 items-center">
                      <p className="w-3 font-medium text-gray-900">
                        {count?.rating}
                      </p>
                      <div className="ml-1 flex flex-1 items-center">
                        <BsStarFill
                          className={classNames(
                            count?.count > 0 ? "text-yellow-400" : "text-gray-300",
                            "h-5 w-5 flex-shrink-0"
                          )}
                        />
                        <div className="relative ml-3 flex-1">
                          <div className="h-3 rounded-full border border-gray-200 bg-gray-100" />
                          {count?.count > 0 && reviews?.totalCount ? (
                            <div
                              className="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                              style={{
                                width: `calc(${count?.count} / ${reviews?.totalCount} * 100%)`,
                              }}
                            />
                          ) : null}
                        </div>
                      </div>
                    </dt>
                    <dd className="ml-3 w-10 text-right text-sm tabular-nums text-gray-900">
                      {reviews?.totalCount &&
                        Math.round((count?.count / reviews?.totalCount) * 100)}%
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Write a review button */}
            <div className="mt-10">
              <h3 className="text-lg font-medium text-gray-900">
                Share your thoughts
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                If you’ve used this product, share your thoughts with other customers
              </p>
              <button
                onClick={() => setRevealReview(true)}
                className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 sm:w-auto lg:w-full"
              >
                Write a review
              </button>
            </div>
          </div>

          {/* Reviews list */}
          <div className="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
            <div className="-my-12 divide-y divide-gray-200">
              {reviewArray?.length === 0 ? (
                <p>NO REVIEWS</p>
              ) : (
                reviewArray?.map((review, index) => (
                  <div key={index} className="py-12">
                    <div className="flex items-center">
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/149/149071.png"
                        alt={`${review?.email}`}
                        className="h-12 w-12 rounded-full"
                      />
                      <div className="ml-4">
                        <h4 className="text-sm font-bold text-gray-900">
                          {review?.email}
                        </h4>
                        <div className="mt-1 flex items-center">
                          {review?.rating === 0 && (
                            <p className="text-sm font-semibold text-gray-900">
                              No Rating
                            </p>
                          )}
                          {[...Array(Number(review.rating))].map((_, i) => (
                            <BsStarFill key={i} className="text-yellow-400 h-5 w-5" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div
                      className="mt-4 space-y-6 text-base italic text-gray-600"
                      dangerouslySetInnerHTML={{ __html: review?.review }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

export default Reviews;
