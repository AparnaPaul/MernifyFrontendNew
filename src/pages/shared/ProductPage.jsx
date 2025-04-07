import Loading from '@/components/Loading';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useAuth } from '@/context/AuthContext';
import { CartData } from '@/context/CartContext';
import { ProductData } from '@/context/ProductContext'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';

const ProductPage = () => {
    const { fetchProduct, relatedProduct, product, loading } = ProductData();
    const { addToCart } = CartData()
    const { id } = useParams()
    const { isAuth } = useAuth()
    // console.log(product)
    // console.log(relatedProduct)
    useEffect(() => {
        fetchProduct(id)
    }, [id]);

    const addToCartHandler = () => {
        addToCart(id);
    }
    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <div className="container mx-auto px-4 py-8">
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
                                                        alt="image"
                                                        className="w-full rounded-md"
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
                                {isAuth ? (
                                    <>
                                        {product.stock <= 0 ? (
                                            <p className="text-red-600 text-2xl">Out of Stock</p>
                                        ) : (
                                            <Button onClick={addToCartHandler}>Add To Cart</Button>
                                        )}
                                    </>
                                ) : (
                                    <a href="/login" className="text-blue-500">
                                        Please Login to add someting in cart
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )

            }
            {relatedProduct?.length > 0 && <div className='mt-12'>
                <h2 className="text-xl font-bold">Related Products</h2>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {relatedProduct.map(e => (
                        <ProductCard key={e._id} product={e} />
                    ))}
                </div>
            </div>}
        </div>
    )
}
export default ProductPage
