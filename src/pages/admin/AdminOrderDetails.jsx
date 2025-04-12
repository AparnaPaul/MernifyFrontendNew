import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Loading from '@/components/Loading';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/admin/order/${id}`, {
          withCredentials: true,
        });
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <Loading />;

  if (!order) {
    return (
      <div className='min-h-[70vh] flex flex-col items-center justify-center text-center'>
        <h1 className='text-2xl font-bold text-red-600 mb-4'>No Order with this ID</h1>
        <Button asChild><Link to="/admin/orders">Back to Orders</Link></Button>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-6'>
        {/* <Button variant="outline" className="mb-4" onClick={() => window.history.back()}> */}
        <Button variant="outline" className="mb-4"  asChild><Link to="/admin/orders">
  ← Back</Link>
</Button>

      <Card className="mb-6">
        <CardHeader>
          <div className='flex justify-between items-center'>
            <CardTitle className="text-2xl font-bold">Order Details</CardTitle>
            <Button onClick={() => window.print()}>Print</Button>
          </div>
        </CardHeader>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 mb-6'>
          <div>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Status:</strong> <span className={order.status === 'Pending' ? 'text-yellow-500' : 'text-green-500'}>{order.status}</span></p>
            <p><strong>Total Items:</strong> {order.items.length}</p>
            <p><strong>Payment Method:</strong> {order.method}</p>
            <p><strong>SubTotal:</strong> ${order.subTotal}</p>
            <p><strong>Placed At:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Paid On:</strong> {order.paidAt ? new Date(order.paidAt).toLocaleString() : 'COD'}</p>
          </div>

          <div>
            <h2 className='text-xl font-semibold mb-4 mt-6 lg:mt-0'>Shipping Details</h2>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>User:</strong> {order.user?.email || "Guest"}</p>
          </div>
        </div>
      </Card>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {order.items.map((item, i) => (
          <Card key={i}>
            <Link to={`/product/${item.product._id}`}>
              <img
                src={item.product.images?.[0]?.url}
                alt={item.product.title}
                className='w-full h-40 object-contain p-4 mx-auto'
              />
            </Link>
            <CardContent>
              <h3 className='text-lg font-semibold'>{item.product.title}</h3>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Price:</strong> ${item.product.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminOrderDetails;
