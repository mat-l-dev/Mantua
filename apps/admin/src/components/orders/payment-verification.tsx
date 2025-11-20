'use client'

import { useState } from "react"
import { verifyPayment, rejectPayment } from "@/actions/orders"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Check, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface PaymentVerificationProps {
  proofId: string
  orderId: string
  status: string | null
}

export function PaymentVerification({ proofId, orderId, status }: PaymentVerificationProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [rejectOpen, setRejectOpen] = useState(false)

  const onVerify = async () => {
    try {
      setLoading(true)
      await verifyPayment(proofId, orderId)
      toast({
        title: "Payment verified",
        description: "The payment has been marked as approved.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const onReject = async () => {
    try {
      setLoading(true)
      await rejectPayment(proofId, orderId, rejectReason)
      setRejectOpen(false)
      toast({
        title: "Payment rejected",
        description: "The payment has been marked as rejected.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (status === 'approved') {
    return <span className="text-green-600 flex items-center"><Check className="w-4 h-4 mr-1" /> Verified</span>
  }

  if (status === 'rejected') {
    return <span className="text-red-600 flex items-center"><X className="w-4 h-4 mr-1" /> Rejected</span>
  }

  return (
    <div className="flex items-center space-x-2">
      <Button size="sm" variant="outline" className="h-8 border-green-200 hover:bg-green-50 text-green-700" onClick={onVerify} disabled={loading}>
        <Check className="w-4 h-4 mr-1" /> Verify
      </Button>
      
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="h-8 border-red-200 hover:bg-red-50 text-red-700" disabled={loading}>
            <X className="w-4 h-4 mr-1" /> Reject
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this payment proof.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Invalid amount, blurry image"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={onReject} disabled={!rejectReason || loading}>Reject Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
