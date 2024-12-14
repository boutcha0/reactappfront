import React from 'react';
import { Link } from 'react-router-dom';

const OrdersAdmin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-yellow-800 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Orders Management</h1>
          <p className="text-xl text-yellow-200">Manage and oversee all customer orders in a sleek interface.</p>
        </div>

        {/* Main Content */}
        <div className="p-8 space-y-6">
          {/* Orders List Section */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 border-b-4 border-yellow-600 pb-2">
              Recent Orders
            </h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full table-auto text-left">
                <thead>
                  <tr className="bg-yellow-600 text-white">
                    <th className="py-3 px-4 text-sm font-medium">Order ID</th>
                    <th className="py-3 px-4 text-sm font-medium">Customer</th>
                    <th className="py-3 px-4 text-sm font-medium">Status</th>
                    <th className="py-3 px-4 text-sm font-medium">Total</th>
                    <th className="py-3 px-4 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Example row */}
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700">#001</td>
                    <td className="py-3 px-4 text-sm text-gray-700">John Doe</td>
                    <td className="py-3 px-4 text-sm text-gray-700">Pending</td>
                    <td className="py-3 px-4 text-sm text-gray-700">$120.00</td>
                    <td className="py-3 px-4 text-sm">
                      <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition duration-300">
                        View
                      </button>
                    </td>
                  </tr>
                  {/* Repeat rows for each order */}
                </tbody>
              </table>
            </div>
          </section>

          {/* Action Buttons Section */}
          <section className="flex justify-between items-center mt-8">
            <Link
              to="/add-order"
              className="inline-block bg-yellow-600 text-white px-8 py-3 rounded-lg hover:bg-yellow-700 transition duration-300 text-lg font-semibold"
            >
              Add New Order
            </Link>
            <div>
              <Link
                to="/archived-orders"
                className="inline-block text-yellow-600 font-semibold hover:text-yellow-700 transition duration-300 mr-6"
              >
                Archived Orders
              </Link>
              <Link
                to="/settings"
                className="inline-block text-yellow-600 font-semibold hover:text-yellow-700 transition duration-300"
              >
                Settings
              </Link>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-yellow-800 text-white p-4 text-center">
          <p>&copy; 2024 Skylark E-Commerce. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default OrdersAdmin;
