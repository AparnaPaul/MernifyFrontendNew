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
import { Edit, Loader, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductPage = () => {
    const { fetchProduct, relatedProduct, product, loading } = ProductData();
    const { addToCart } = CartData();
    const { id } = useParams();
    const { isAuth, user } = useAuth();

    useEffect(() => {
        fetchProduct(id);
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
