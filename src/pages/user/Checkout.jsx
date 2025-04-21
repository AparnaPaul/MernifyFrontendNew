import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '@/components/Loading';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { server } from '@/main';

const Checkout = () => {
    const [address, setAddress] = useState([])
    const [loading, setLoading] = useState(true)


    async function fetchAddress() {
        try {
            const { data } = await axios.get(`${server}/api/address/all`, {
                withCredentials: true
            })

            setAddress(data)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const [modalOpen, setModalOpen] = useState(false)
    const [newAddress, setNewAddress] = useState({
        address: "",
        phone: "",
    })

    const handleAddAddress = async () => {
        try {
            const { data } = await axios.post(`${server}/api/address/new`, {
                address: newAddress.address, phone: newAddress.phone
            }, {
                withCredentials: true
            })

            if (data.message) {
                toast.success(data.message)
                fetchAddress();
                setNewAddress({
                    address: "",
                    phone: ""
                }),
                    setModalOpen(false)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
    useEffect(() => {
        fetchAddress()
    }, [])

    const deleteHandler = async (id) => {
        if (confirm("Are you sure you want to delete this address?")) {
            try {
                const { data } = await axios.delete(`${server}/api/address/${id}`, {
                    withCredentials: true
                })
                toast.success(data.message)
                fetchAddress()
            } catch (error) {
                console.log("Error deleting address:", error);
                if (error.response) {
                    toast.error(error.response.data.message || "Error deleting address");
                } else {
                    toast.error("An unexpected error occurred");
                }
            }
        }
    };
    return (
        <div className='container mx-auto px-4 py-8 min-h-[60vh]'>
            <h1 className='text-3xl font-bold mb-6 text-center'>Checkout</h1>
            {
                loading ? <Loading /> : <div className='grid grid-cols-1 sm:grid-cols-3  lg:grid-cols-4 gap-4'>
                    {address && address.length > 0 ? address.map((e) => (
                        <div className='p-4 border rounded-lg shadow-sm ' key={e._id}>
                            <h3 className='text-lg font-semibold flex justify-between gap-3'>Address - {e.address}
                                <Button variant="destructive" onClick={() => deleteHandler(e._id)}><Trash /></Button>
                            </h3>
                            <p>Phone - {e.phone}</p>
                            <Link to={`/payment/${e._id}`}>
                                <Button variant="outline">Use Address</Button></Link>
                        </div>
                    )) : (<p>No Address found</p>)}</div>

            }
            <Button className="mt-6" variant="outline" onClick={() => setModalOpen(true)}>Add New Address</Button>
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Address</DialogTitle>
                    </DialogHeader>
                    <div className='space-y-4'>

                        <Input placeholder="Address" value={newAddress.address} onChange={e => setNewAddress({ ...newAddress, address: e.target.value })} />
                        <Input placeholder="Phone" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalOpen(false)}>Close</Button>
                        <Button variant="outline" onClick={handleAddAddress}>Add Address</Button>
                    </DialogFooter>
                </DialogContent>

            </Dialog>
        </div>
    )
}

export default Checkout
