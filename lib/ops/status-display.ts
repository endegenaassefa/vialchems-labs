// Status pill colors, shared by the ops order list and the order detail
// page so a given status always reads the same color in both places.

export function statusColor(status: string): string {
  switch (status) {
    case "awaiting_payment":
      return "bg-yellow-100 text-yellow-800";
    case "paid":
      return "bg-blue-100 text-blue-800";
    case "fulfilled":
      return "bg-amber-100 text-amber-800";
    case "shipped":
      return "bg-indigo-100 text-indigo-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-gray-100 text-gray-700";
    case "refunded":
      return "bg-rose-100 text-rose-800";
    case "jurisdictional_rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
