import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold sm:text-xl">
          All Orders
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* ---------- Mobile Card View ---------- */}
        <div className="space-y-4 sm:hidden">
          {orderList && orderList.length > 0 ? (
            orderList.map((orderItem) => (
              <div
                key={orderItem?._id}
                className="p-4 bg-white border rounded-lg shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500">
                    Order ID:
                  </span>
                  <span className="text-xs font-mono break-all max-w-[180px] text-right">
                    {orderItem?._id}
                  </span>
                </div>

                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-600">
                    Date:
                  </span>
                  <span className="text-sm">
                    {orderItem?.orderDate?.split("T")[0]}
                  </span>
                </div>

                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-600">
                    Status:
                  </span>
                  <Badge
                    className={`py-1 px-2 text-xs capitalize ${
                      orderItem?.orderStatus === "confirmed"
                        ? "bg-green-500"
                        : orderItem?.orderStatus === "rejected"
                        ? "bg-red-600"
                        : "bg-gray-700"
                    }`}
                  >
                    {orderItem?.orderStatus}
                  </Badge>
                </div>

                <div className="flex justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    Total:
                  </span>
                  <span className="font-semibold">${orderItem?.totalAmount}</span>
                </div>

                <Dialog
                  open={openDetailsDialog}
                  onOpenChange={() => {
                    setOpenDetailsDialog(false);
                    dispatch(resetOrderDetails());
                  }}
                >
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleFetchOrderDetails(orderItem?._id)}
                  >
                    View Details
                  </Button>
                  <AdminOrderDetailsView orderDetails={orderDetails} />
                </Dialog>
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-gray-500">No orders found.</p>
          )}
        </div>

        {/* ---------- Desktop Table View ---------- */}
        <div className="hidden overflow-x-auto sm:block">
          <Table className="min-w-[700px] text-sm sm:text-base">
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orderList && orderList.length > 0 ? (
                orderList.map((orderItem) => (
                  <TableRow key={orderItem?._id}>
                    <TableCell className="break-all">{orderItem?._id}</TableCell>
                    <TableCell>
                      {orderItem?.orderDate?.split("T")[0]}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 text-xs sm:text-sm capitalize ${
                          orderItem?.orderStatus === "confirmed"
                            ? "bg-green-500"
                            : orderItem?.orderStatus === "rejected"
                            ? "bg-red-600"
                            : "bg-gray-700"
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>${orderItem?.totalAmount}</TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <Button
                          size="sm"
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }
                        >
                          View Details
                        </Button>
                        <AdminOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
