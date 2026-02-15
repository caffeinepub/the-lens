import { Separator } from '../ui/separator';
import { CartItem } from '../../store/cart';
import { formatINR } from '../../utils/currency';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
}

export default function OrderSummary({ items, subtotal }: OrderSummaryProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.product.id} className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {item.product.name} × {item.quantity}
            </span>
            <span className="font-medium">{formatINR(Number(item.product.price) * item.quantity)}</span>
          </div>
        ))}
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between text-base font-semibold">
        <span>Subtotal</span>
        <span className="text-accent">{formatINR(subtotal)}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Shipping and taxes calculated at checkout
      </p>
    </div>
  );
}
