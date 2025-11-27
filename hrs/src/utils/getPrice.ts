
export function getPrice(checkIn: string, checkOut: string, price: number, children: number) {
  const days = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24);
  if (days === 1) return price;

  const discountedPricePerNight = price - (10 / 100 * price); // if > 1 day: -10%
  const subtotal = discountedPricePerNight * days;
  const childrenDiscount = (5 / 100) * subtotal * children; // -5% for each child
  const total = subtotal - childrenDiscount;

  return Math.round(total);
}

//book check in 2025-12-12 check out 2025-12-15 adults 1 child 1 age 7

//todo:
// 5) fix front: stick top!