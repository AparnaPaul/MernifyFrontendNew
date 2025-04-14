import Loading from '@/components/Loading'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Orders from './Orders'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { server } from '@/main'

const OrderPage = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const { user } = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${server}/api/order/${id}`, {
          withCredentials: true
        })

        setOrder(data)
      } catch (error) {
        console.log(error);

      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])


  if (loading) {
    return <Loading />
  }

  if (!order) {
    return <div className='min-h-[70vh] flex flex-col items-center justify-center text-center'>
      <h1 className='text-2xl font-bold text-red-600 mb-4'>No Order with this id</h1>
      <Button onClick={() => navigate("/products")}>Shop Now</Button>
    </div>
  }
  return (
    <div className='container mx-auto py-6 '>
      {
        user._id === order.user._id || user.role === "admin" ? <>
          <Card className="mb-6">
            <CardHeader>
              <div className='flex justify-between'>
                <CardTitle className="text-2xl font-bold">Order Details</CardTitle>
                <Button onClick={() => window.print()}>Print Order</Button>
              </div>

            </CardHeader>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 mb-6'>
              <div>
                <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>
                <p>
                  <strong>Order ID: </strong>
                  {order._id}
                </p>
                <p>
                  <strong>Status: </strong>
                  <span className={`${order.status === "Pending" ? "text-yellow-500" : "text-green-500"}`}>{order.status}</span>
                </p>
                <p>
                  <strong>Total Items: </strong>
                  {order.items.length}
                </p>
                <p>
                  <strong>Payment Method: </strong>
                  {order.method}
                </p>
                <p>
                  <strong>SubTotal: </strong>
                  ${order.subTotal}
                </p>
                <p>
                  <strong>Placed At: </strong>
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Paid On: </strong>
                  {order.paidAt
                    ? new Date(order.paidAt).toLocaleString("en-AU", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Australia/Adelaide"
                    })
                    : "Payment through COD"}
                </p>
              </div>

              <div >
                <h2 className='text-xl font-semibold mb-4 mt-6'>Shipping Details:</h2>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>User:</strong> {order.user?.email || "Guest"}</p>
              </div>
            </div>

          </Card>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {order.items.map((e, i) => (
              <Card key={i}>
                <Link to={`/product/${e.product._id}`}>
                  <img src={e.product.images[0]?.url}
                    alt={e.product.title}
                    className='w-full h-40 object-contain p-4 mx-auto' /></Link>
                <CardContent><h3 className='text-lg font-semibold'>
                  {e.product.title}</h3>
                  <p><strong>Quantity:</strong>{e.quantity}</p>
                  <p><strong>Price:</strong>${e.product.price}</p>

                </CardContent>
              </Card>
            ))}
          </div></> : <p className='text-red-500 text-3xl text-center'>This is not your order <br />
          <Link to={'/'} className='mt-4 underline text-blue-400 text-2xl'>Go to home page</Link>
        </p>
      }

    </div>

  )
}

export default OrderPage
