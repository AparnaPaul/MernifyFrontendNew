import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CartData } from '@/context/CartContext'
import axios from 'axios'

import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js'

const Payment = () => {
    const { cart, subTotal, fetchCart } = CartData()
    const [address, setAddress] = useState("")
    const [method, setMethod] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const { id } = useParams()
    async function fetchAddress() {
        try {
            const { data } = await axios.get(`http://localhost:4000/api/address/${id}`, {
                withCredentials: true
            }

            )
            setAddress(data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchAddress();
    }, [id])

    const paymentHandler = async () => {
        if (method === "cod") {
            setLoading(true)
            try {
                const { data } = await axios.post(`http://localhost:4000/api/order/new/cod`, {
                    method,
                    address: address.address,
                    phone: address.phone,
                }, {
                    withCredentials: true
                })
                setLoading(false)
                toast.success(data.message)
                fetchCart()
                navigate("/orders")
            } catch (error) {
                setLoading(false)
                toast.error(error.response.data.message)
            }
        }

        if (method === "online") {

            const stripePromise = loadStripe("pk_test_51RBUz7PooL0X0ySs5Fc4IyqnFh46MIAUg6Mhgcbul6D0buKPkDwQ2hpG7puQUkvNkCzyB2V1XlnADkj1VAmHuvUb00JNM5wwwY");

            try {
                setLoading(true);
                const stripe = await stripePromise
                const { data } = await axios.post(`http://localhost:4000/api/order/new/online`, {
                    method,
                    address: address.address,
                    phone: address.phone,
                }, {
                    withCredentials: true
                })

                if (data.url) {
                    window.location.href = data.url
                    setLoading(false)
                } else P
                toast.error("Failed to create Payment session")
                setLoading(false)

            } catch (error) {
                toast.error("Payment Failed. Please try again..!")
                setLoading(false)
            }
        }
    }

    return (

        <div>
            {
                loading ? <Loading /> : <div className='container mx-auto px-4 py-8'>
                    <div className='space-y-8'>
                        <h2 className='text-3xl font-bold text-center'>
                            Proceed to Payment</h2></div>
                    <h3 className='text-xl font-semibold'>Products</h3>
                    <Separator className="my-2" />
                    <div className='space-y-4'>
                        {cart && cart.map((e, i) => (
                            <div key={i} className='flex flex-col md:flex-row items-center justify-between bg-card p-4 rounded-lg shadow border dark:border-gray-700'> <img src={e.product.images[0].url} alt="" className='w-16 h-16 object-cover rounded mb-4 md:mb-0' />
                                <div className='flex-1 md:ml-4 text-center md:text-left'>
                                    <h2 className='text-lg font-medium'>{e.product.title}</h2>
                                    <p className='text-sm text-muted-foreground dark:text-gray-400'>$ {e.product.price} X {e.quantity}</p>
                                    <p className='text-sm text-muted-foreground dark:text-gray-400'>{e.product.price * e.quantity}</p>
                                </div>
                            </div>
                        ))}
                        <div className='text-lg font-medium text-center'>Total Price to be Paid : $ {subTotal}</div>
                        {
                            address && <div className='bg-card p-4 rounded-lg shadow border space-y-4 dark:border-gray-700'>
                                <h3 className='text-lg font-semibold text-center'>Details</h3>
                                <Separator />
                                <div className='flex flex-col space-y-4 '>
                                    <div>
                                        <h4 className='font-semibold mb-1'>Delivery Address</h4>
                                        <p className='text-sm text-muted-foreground dark:text-gray-400'>
                                            <strong>Address:</strong> {address.address}
                                        </p>
                                        <p className='text-sm text-muted-foreground dark:text-gray-400'>
                                            <strong>Phone:</strong> {address.phone}
                                        </p>
                                    </div>
                                    <div className='w-full md:w-1/2'>
                                        <h4 className='font-semibold mb-1'>Select Payment Method</h4>
                                        <select value={method}
                                            onChange={(e) => setMethod(e.target.value)} className='w-full p-2 border rounded-lg bg-card dark:bg-gray-900 dark:text-white'>
                                            <option value="">Select Payment Method</option>
                                            <option value="cod">COD</option>
                                            <option value="online">Online</option>
                                        </select></div>
                                </div>
                            </div>
                        }
                    </div>
                    <Button className="w-full py-3 mt-4" onClick={paymentHandler} disabled={!method || !address}>Proceed to Checkout</Button>
                </div>

            }

        </div>

    )
}

export default Payment
