/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { UpdateProduct } from '../../store/productSlice'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RxCross1 } from "react-icons/rx";

const UpdateProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: "",
        buyingPrice: "",
        quantity: "",
        expiryDate: "",
        description: "",
        imageUrl: "",   // ✅ image url field
    });

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await fetch(`http://localhost:5000/api/products/${id}`);
            const data = await res.json();
            setFormData({
                name: data.name,
                buyingPrice: data.buyingPrice,
                quantity: data.quantity,
                expiryDate: data.expiryDate.split("T")[0],
                description: data.description || "",
                imageUrl: data.images || "",   // ✅ get image url
            });
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(UpdateProduct({ id, updatedData: formData })).then(() => {
            navigate("/inventory");
        });
    };

    return (
        <div className="h-screen flex justify-center items-center backdrop-blur-3xl">
            <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="p-6 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg w-full max-w-md relative"
            >
                <RxCross1
                    onClick={() => navigate("/inventory")}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                />
                <h2 className="text-xl text-center font-bold mb-4 text-gray-900 dark:text-white">
                    Update Product
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Product Name"
                        required
                    />
                    <Input
                        type="number"
                        name="buyingPrice"
                        value={formData.buyingPrice}
                        onChange={handleChange}
                        placeholder="Buying Price"
                        required
                    />
                    <Input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Quantity"
                        required
                    />
                    <Input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Product Description"
                    />

                    {/* ✅ Image URL field */}
                    <Input
                        type="text"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="Image URL"
                    />

                    {/* ✅ Preview image */}
                    {formData.imageUrl && (
                        <img
                            src={formData.imageUrl}
                            alt="Product Preview"
                            className="w-32 h-32 object-cover rounded-md self-center"
                        />
                    )}

                    <Button type="submit" className="bg-blue-600 text-white">
                        Update
                    </Button>
                </form>
            </motion.div>
        </div>
    );
};

export default UpdateProductPage;
