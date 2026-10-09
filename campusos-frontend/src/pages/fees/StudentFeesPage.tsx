import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feesApi } from '../../api/fees';
import { useNotificationStore } from '../../store/notificationStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { StudentFee } from '../../types';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle,
  CurrencyInr,
  Receipt,
  CalendarBlank,
} from '@phosphor-icons/react';

export const StudentFeesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { addToast } = useNotificationStore();

  const [activeFee, setActiveFee] = useState<StudentFee | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<StudentFee | null>(null);

  const { data: fees, isLoading } = useQuery({
    queryKey: ['myFees'],
    queryFn: feesApi.getMyFees,
  });

  const payMutation = useMutation({
    mutationFn: async (fee: StudentFee) => {
      // Step 1: Create order
      const order = await feesApi.createPaymentOrder(fee.id);
      // Step 2: Verify mock sandbox payment
      const verifyRes = await feesApi.verifyPayment({
        razorpayOrderId: order.orderId,
        razorpayPaymentId: `pay_mock_${Date.now()}`,
        razorpaySignature: 'mock_verified_signature_campusos_ok',
      });
      return { order, verifyRes };
    },
    onSuccess: (_, fee) => {
      queryClient.invalidateQueries({ queryKey: ['myFees'] });
      queryClient.invalidateQueries({ queryKey: ['studentDashboard'] });
      addToast({
        type: 'success',
        title: 'Payment Confirmed',
        message: `Payment for ${fee.feeStructureName} was successful. Receipt issued.`,
      });
      setIsCheckoutOpen(false);
    },
    onError: (err: any) => {
      addToast({
        type: 'error',
        title: 'Transaction Incomplete',
        message: err.response?.data?.message || 'Payment could not be processed.',
      });
    },
  });

  const handleStartPayment = (fee: StudentFee) => {
    setActiveFee(fee);
    setIsCheckoutOpen(true);
  };

  const handleConfirmPay = () => {
    if (activeFee) {
      payMutation.mutate(activeFee);
    }
  };

  const handleViewReceipt = (fee: StudentFee) => {
    setReceiptData(fee);
    setIsReceiptOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge variant="success">Paid</Badge>;
      case 'OVERDUE':
        return <Badge variant="danger">Overdue</Badge>;
      default:
        return <Badge variant="warning">Pending</Badge>;
    }
  };

  const totalOutstanding =
    fees?.filter((f) => f.status !== 'PAID').reduce((sum, f) => sum + (f.amount - f.paidAmount), 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
            Student Tuition & Invoices
          </h1>
          <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 mt-0.5">
            View fee assessments, make payments online via Razorpay sandbox, and download receipts
          </p>
        </div>

        {totalOutstanding > 0 && (
          <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center gap-2">
            <span>Outstanding Balance:</span>
            <span className="text-sm font-bold font-mono">₹{totalOutstanding.toLocaleString()}</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-apple-gray-400">Loading student dues...</div>
      ) : !fees || fees.length === 0 ? (
        <Card className="p-12 text-center text-apple-gray-400 text-xs">
          No fee invoices currently assigned to your student record.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fees.map((fee) => (
            <Card key={fee.id} hoverable className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-apple-gray-900 dark:text-white">
                    {fee.feeStructureName}
                  </h3>
                  <p className="text-xs text-apple-gray-500 mt-0.5">
                    Due Date: {fee.dueDate}
                  </p>
                </div>
                {getStatusBadge(fee.status)}
              </div>

              <div className="flex items-baseline justify-between pt-2">
                <div>
                  <span className="text-xs text-apple-gray-400 uppercase font-medium">Assessed Amount</span>
                  <p className="text-2xl font-bold text-apple-gray-900 dark:text-white">
                    ₹{fee.amount.toLocaleString()}
                  </p>
                </div>
                {fee.paidAmount > 0 && (
                  <div className="text-right">
                    <span className="text-xs text-apple-gray-400 uppercase font-medium">Paid</span>
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      ₹{fee.paidAmount.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-apple-gray-200/50 dark:border-apple-gray-800/50 flex items-center justify-between">
                <span className="text-xs text-apple-gray-400 font-mono">
                  {fee.paymentReference ? `Ref: ${fee.paymentReference.slice(0, 16)}...` : 'Unpaid Invoice'}
                </span>

                {fee.status === 'PAID' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewReceipt(fee)}
                    icon={<Receipt weight="duotone" className="h-4 w-4" />}
                  >
                    View Receipt
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStartPayment(fee)}
                    icon={<CreditCard weight="duotone" className="h-4 w-4" />}
                  >
                    Pay Online (₹{fee.amount.toLocaleString()})
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Razorpay Sandbox Checkout Modal */}
      <Modal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title="Razorpay Secure Payment Gateway"
        description="Encrypted 256-bit sandbox transaction environment"
      >
        {activeFee && (
          <div className="space-y-5 pt-2">
            <div className="p-4 rounded-2xl bg-apple-gray-50 dark:bg-apple-gray-800/60 border border-apple-gray-200 dark:border-apple-gray-700/60 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-apple-gray-500">Invoice:</span>
                <span className="font-semibold text-apple-gray-900 dark:text-white">
                  {activeFee.feeStructureName}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-apple-gray-500">Total Due:</span>
                <span className="font-bold text-apple-blue dark:text-apple-blue-dark font-mono text-sm">
                  ₹{activeFee.amount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-apple-gray-500 uppercase tracking-wider">
                Payment Channel (Simulated)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl border border-apple-blue bg-apple-blue/5 text-xs font-semibold text-apple-blue flex items-center gap-2">
                  <CreditCard weight="duotone" className="h-4 w-4" /> Credit / Debit Card
                </div>
                <div className="p-3 rounded-xl border border-apple-gray-200 dark:border-apple-gray-700 text-xs font-medium text-apple-gray-600 dark:text-apple-gray-400 flex items-center gap-2">
                  <CurrencyInr weight="duotone" className="h-4 w-4" /> UPI / NetBanking
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-apple-gray-400">
              <ShieldCheck weight="duotone" className="h-4 w-4 text-emerald-500" />
              <span>Razorpay sandbox test mode. No real funds will be deducted.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-apple-gray-200/60 dark:border-apple-gray-800/60">
              <Button type="button" variant="ghost" onClick={() => setIsCheckoutOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleConfirmPay}
                isLoading={payMutation.isPending}
              >
                Authorize Payment (₹{activeFee.amount.toLocaleString()})
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Digital Receipt Modal */}
      <Modal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        title="Electronic Payment Receipt"
        description="Official university transaction voucher"
      >
        {receiptData && (
          <div className="space-y-4 pt-2">
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
              <CheckCircle weight="duotone" className="h-10 w-10 text-emerald-500 mx-auto" />
              <h4 className="text-base font-bold text-apple-gray-900 dark:text-white">
                Payment Complete
              </h4>
              <p className="text-xs text-apple-gray-500">
                Transaction Ref: {receiptData.paymentReference || 'MOCK-TXN-2026-9921'}
              </p>
            </div>

            <div className="space-y-2 text-xs border-y border-apple-gray-200/60 dark:border-apple-gray-800/60 py-3">
              <div className="flex justify-between">
                <span className="text-apple-gray-400">Item:</span>
                <span className="font-semibold text-apple-gray-900 dark:text-white">
                  {receiptData.feeStructureName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-apple-gray-400">Amount Paid:</span>
                <span className="font-bold text-apple-gray-900 dark:text-white font-mono">
                  ₹{receiptData.paidAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-apple-gray-400">Date Paid:</span>
                <span className="text-apple-gray-600 dark:text-apple-gray-300">
                  {receiptData.paidAt || new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-apple-gray-400">Payment Gateway:</span>
                <span className="text-apple-gray-600 dark:text-apple-gray-300">
                  Razorpay Sandbox
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button type="button" variant="primary" onClick={() => setIsReceiptOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
