import Loading from '@/components/Loading';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { CartData } from '@/context/CartContext';
import { ProductData } from '@/context/ProductContext';
import { categories, server } from '@/main';
import axios from 'axios';
import { Edit, Edit3, Loader, Trash, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

// Review Form component
const ReviewForm = ({ productId, fetchReviews }) => {
    const [rating, setRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!rating || !reviewComment) {
            setErrors({ message: 'Rating and comment are required.' });
            return;
        }

        try {
            const response = await axios.post(
                `${server}/api/review/add`,
                { productId, rating, reviewComment },
                { withCredentials: true }
            );

            toast.success(response.data.message);
            fetchReviews(); // Refresh reviews after submission

            // Clear form fields
            setRating(0);
            setReviewComment('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label>Rating (1-5)</Label>
                <div className="flex items-center">
                    {/* Loop through 5 stars and display clickable ones */}
                    {[...Array(5)].map((_, index) => (
                        <span
                            key={index}
                            className={`cursor-pointer text-3xl ${rating > index ? 'text-yellow-500' : 'text-gray-300'}`} // Highlight stars based on the rating
                            onClick={() => setRating(index + 1)} // Set rating on click
                        >
                            ★
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <Label>Review Comment</Label>
                <Input
                    type="text"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                />
            </div>
            <Button type="submit" className="w-full">
                Submit Review
            </Button>
        </form>
    );
};

// Product Reviews component
const ProductReviews = ({ productId, user }) => {
    const [reviews, setReviews] = useState([]);
    const [editReviewId, setEditReviewId] = useState(null);
    const [updatedRating, setUpdatedRating] = useState(0);
    const [updatedComment, setUpdatedComment] = useState("");

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`${server}/api/review/${productId}`, { withCredentials: true });
            setReviews(response.data.reviews);
        } catch (err) {
            // Only show error toasts for non-admin users
            if (user?.role !== 'admin') {
                toast.error('Failed to fetch reviews');
            }
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const handleEdit = (reviewId, rating, comment) => {
        setEditReviewId(reviewId);
        setUpdatedRating(rating);
        setUpdatedComment(comment);
    };

    const handleEditSubmit = async (reviewId) => {
        try {
            const response = await axios.put(
                `${server}/api/review/${reviewId}`,
                { rating: updatedRating, reviewComment: updatedComment },
                { withCredentials: true }
            );

            toast.success(response.data.message);
            setEditReviewId(null); // Close the edit form
            fetchReviews(); // Refresh reviews
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update review");
        }
    };

    const handleDelete = async (reviewId) => {
        // Check if the logged-in user is the owner of the review
        if (user._id !== reviews.find(review => review._id === reviewId).userId.id) {
            toast.error('Not authorized to delete this review');
            return;
        }

        try {
            await axios.delete(`${server}/api/review/${reviewId}`, { withCredentials: true });
            toast.success('Review deleted successfully');
            fetchReviews(); // Refresh reviews after deletion
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete review");
        }
    };

    return (
        <div className="mt-6">
            <h2 className="text-lg font-bold">Reviews</h2>
            {reviews.length === 0 ? (
                <p>No reviews yet.</p>
            ) : (
                reviews.map((review) => (
                    <div key={review._id} className="border p-4 rounded-md mt-4">
                        <div className="flex justify-between items-center">
                            <strong>{review.userId.username}</strong> {/* Username */}
                            <div className="flex">
                                {/* Display stars */}
                                {[...Array(5)].map((_, index) => (
                                    <span key={index} className={index < review.rating ? "text-yellow-500" : "text-gray-300"}>★</span>
                                ))}
                            </div>
                        </div>
                        <p>{review.reviewComment}</p>

                        {/* Show delete/edit options only if the logged-in user is the one who wrote the review */}
                        {user && review.userId.id === user._id && (
                            <div className="mt-2">
                                <button className="text-blue-600" onClick={() => handleEdit(review._id, review.rating, review.reviewComment)}><Edit3 className="w-4 h-4" /></button>
                                <button className="text-red-600 ml-2" onClick={() => handleDelete(review._id)}><Trash className="w-4 h-4" /></button>
                            </div>
                        )}

                        {/* Show edit form if this review is being edited */}
                        {editReviewId === review._id && (
                            <form onSubmit={() => handleEditSubmit(review._id)} className="mt-4 space-y-2">
                                <div>
                                    <label>Rating (1-5)</label>
                                    <div className="flex items-center">
                                        {/* Loop through 5 stars and display clickable ones */}
                                        {[...Array(5)].map((_, index) => (
                                            <span
                                                key={index}
                                                className={`cursor-pointer text-3xl ${updatedRating > index ? 'text-yellow-500' : 'text-gray-300'}`} // Highlight stars based on the rating
                                                onClick={() => setUpdatedRating(index + 1)} // Set rating on click
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label>Review Comment</label>
                                    <input
                                        type="text"
                                        value={updatedComment}
                                        onChange={(e) => setUpdatedComment(e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>

                                <button type="submit" className="bg-blue-600 text-white p-2 rounded-md w-full">
                                    Update Review
                                </button>
                            </form>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

const ProductPage = () => {
    const { fetchProduct, relatedProduct, product, loading } = ProductData();
    const { addToCart } = CartData();
    const { id } = useParams();
    const { isAuth, user } = useAuth();
    const [averageRating, setAverageRating] = useState(null);

    useEffect(() => {
        fetchProduct(id);
    }, [id]);

    // Fetch reviews and calculate average rating
    const fetchReviewsAndCalculateRating = async () => {
        try {
            const response = await axios.get(`${server}/api/review/${id}`, { withCredentials: true });
            const reviews = response.data.reviews;
            if (reviews.length > 0) {
                const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
                setAverageRating(totalRating / reviews.length);  // Calculate the average rating
            } else {
                setAverageRating(null);  // No reviews, no rating
            }
        } catch (err) {
            toast.error('Failed to fetch reviews');
        }
    };

    useEffect(() => {
        fetchReviewsAndCalculateRating();
    }, [id]);

    const addToCartHandler = () => {
        addToCart(id);
    };
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);
    const [updatedImages, setUpdatedImages] = useState(null);

    const updateHandler = () => {
        setShow(!show);
        setCategory(product.category);
        setTitle(product.title);
        setDescription(product.description);
        setStock(product.stock);
        setPrice(product.price);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setBtnLoading(true);

        try {
            const { data } = await axios.put(
                `${server}/api/product/${id}`,
                { title, description, price, stock, category },
                { withCredentials: true }
            );

            toast.success(data.message);
            fetchProduct(id);
            setShow(false);
            setBtnLoading(false);
        } catch (error) {
            toast.error(error.response.data.message);
            setBtnLoading(false);
        }
    };

    const handleSubmitImage = async (e) => {
        e.preventDefault();
        setBtnLoading(true);

        if (!updatedImages || updatedImages.length === 0) {
            toast.error('Please select new images.');
            setBtnLoading(false);
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < updatedImages.length; i++) {
            formData.append('files', updatedImages[i]);
        }

        try {
            const { data } = await axios.post(`${server}/api/product/${id}`, formData, {
                withCredentials: true,
            });

            toast.success(data.message);
            fetchProduct(id);
            setUpdatedImages(null);
            setBtnLoading(false);
        } catch (error) {
            toast.error(error.response.data.message);
            setBtnLoading(false);
        }
    };


    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <div className="container mx-auto px-4 py-8">
                    {user && user.role === 'admin' && (
                        <div className="w-[300px] md:w-[450px] m-auto mb-5">
                            <Button onClick={updateHandler}>{show ? <X /> : <Edit />}</Button>
                            {show && (
                                <form className="space-y-4" onSubmit={submitHandler}>
                                    <div>
                                        <Label>Title</Label>
                                        <Input
                                            placeholder="Product Title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label>Description</Label>
                                        <Input
                                            placeholder="About Product"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label>Category</Label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            required
                                            className="w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white"
                                        >
                                            {categories.map((e) => (
                                                <option value={e} key={e}>
                                                    {e}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <Label>Price</Label>
                                        <Input
                                            placeholder="Product Price"
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label>Stock</Label>
                                        <Input
                                            placeholder="Product Stock"
                                            type="number"
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label>Update Images</Label>
                                        <Input
                                            type="file"
                                            multiple
                                            onChange={(e) => setUpdatedImages(e.target.files)}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={btnLoading}
                                    >
                                        {btnLoading ? <Loader /> : 'Update Product'}
                                    </Button>

                                    <Button
                                        className="w-full"
                                        onClick={handleSubmitImage}
                                        disabled={btnLoading}
                                    >
                                        {btnLoading ? <Loader /> : 'Upload New Images'}
                                    </Button>
                                </form>
                            )}
                        </div>
                    )}

                    {product && (
                        <div className="flex flex-col lg:flex-row items-start gap-14">
                            <div className="w-[290px] md:w-[650px]">
                                <Carousel>
                                    <CarouselContent>
                                        {product.images &&
                                            product.images.map((image, index) => (
                                                <CarouselItem key={index}>
                                                    <img
                                                        src={image.url}
                                                        alt="product"
                                                        className="w-full h-[400px] object-contain rounded-md"
                                                    />
                                                </CarouselItem>
                                            ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </div>

                            <div className="w-full lg:w-1/2 space-y-4">
                                <h1 className="text-2xl font-bold">{product.title}</h1>
                                <p className="text-lg">{product.description}</p>
                                <p className="text-xl font-semibold">$ {product.price}</p>

                                {/* Display average rating below the price */}
                                {averageRating !== null && (
                                    <div className="flex items-center">
                                        <div className="flex">
                                            {[...Array(5)].map((_, index) => (
                                                <span
                                                    key={index}
                                                    className={`text-2xl ${index < averageRating ? 'text-yellow-500' : 'text-gray-300'}`}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <span className="ml-2 text-sm">({averageRating.toFixed(1)})</span>
                                    </div>
                                )}

                                {isAuth && user?.role !== 'admin' ? (
                                    product.stock <= 0 ? (
                                        <p className="text-red-600 text-2xl">Out of Stock</p>
                                    ) : (
                                        <Button onClick={addToCartHandler}>Add To Cart</Button>
                                    )
                                ) : !isAuth ? (
                                    <a href="/login" className="text-blue-500">
                                        Please login to add something to cart
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    )}

                    {/* Display Review Form and Reviews */}
                    {isAuth && user?.role !== 'admin' && (
                        <ReviewForm productId={id} fetchReviews={() => fetchReviewsAndCalculateRating()} />
                    )}

                    <ProductReviews productId={id} user={user} />
                </div>
            )}

            {relatedProduct?.length > 0 && (
                <div className="mt-12 container mx-auto px-4">
                    <h2 className="text-xl font-bold mb-4">Related Products</h2>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedProduct.map((e) => (
                            <ProductCard key={e._id} product={e} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


export default ProductPage;
