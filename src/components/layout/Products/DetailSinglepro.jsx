import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSingleProduct } from "../../../../store/newproductSlice";
import {
  Barcode,
  Box,
  DollarSign,
  Layers,
  Package,
  AlertCircle,
} from "lucide-react";

const DetailSinglepro = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { data: singleProduct, loading, error } = useSelector(
    (state) => state.newProducts
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-80 bg-gray-200 rounded-lg"></div>
          <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-red-600 flex items-center gap-2">
        <AlertCircle size={20} /> <span>Error: {error}</span>
      </div>
    );
  }

  if (!singleProduct) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-gray-600">
        No product found.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
        {/* Image */}
        <div className="w-full h-80 bg-gray-50 flex items-center justify-center">
          <img
            src={singleProduct.image_url}
            alt={singleProduct.name}
            className="max-h-full object-contain"
          />
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Title + Price */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {singleProduct.name}
            </h1>
            <span className="inline-block px-4 py-2 text-lg font-semibold bg-green-600 text-white rounded-lg shadow">
              ${singleProduct.price}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-base leading-relaxed">
            {singleProduct.description || "No description available."}
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InfoItem icon={<Barcode />} label="Barcode" value={singleProduct.barcode} />
            <InfoItem icon={<Package />} label="SKU" value={singleProduct.sku} />
            <InfoItem icon={<Layers />} label="Quantity" value={singleProduct.quantity} />
            <InfoItem icon={<Box />} label="Reorder Level" value={singleProduct.reorder_level} />
            <InfoItem icon={<DollarSign />} label="Cost Price" value={`$${singleProduct.cost_price}`} />
            <InfoItem
              icon={<Package />}
              label="Active"
              value={
                <span
                  className={
                    singleProduct.is_active ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
                  }
                >
                  {singleProduct.is_active ? "Yes" : "No"}
                </span>
              }
            />
          </div>

          {/* Vendor / Branch Info */}
          <div className="mt-6 border-t pt-6 space-y-2 text-sm text-gray-700">
            <p>
              <strong>Vendor Email:</strong> {singleProduct.email || "N/A"}
            </p>
            <p>
              <strong>Vendor Phone:</strong> {singleProduct.phone || "N/A"}
            </p>
            <p>
              <strong>Branch:</strong> {singleProduct.branch?.name || "N/A"}
            </p>
            <p>
              <strong>Location:</strong> {singleProduct.location || "N/A"}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(singleProduct.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {new Date(singleProduct.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 text-sm">
    <span className="text-gray-500">{icon}</span>
    <span className="text-gray-700">
      {label}: <strong>{value}</strong>
    </span>
  </div>
);

export default DetailSinglepro;
