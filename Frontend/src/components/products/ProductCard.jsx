export default function ProductCard({ product }) {
  return (
    <div className="bg-white/10 p-4 border border-white/10 rounded-xl">
      <p className="text-xs text-white/50">{product.product_code}</p>
      <h3 className="text-white font-semibold text-lg">{product.name}</h3>

      <p className="text-emerald-400 font-bold text-sm mt-2">
        ${product.sale_price_usd?.toFixed(2)}
      </p>

      <p
        className={`mt-1 text-sm ${
          product.stock <= product.min_stock
            ? "text-red-400"
            : "text-white/60"
        }`}
      >
        Stock: {product.stock}
      </p>
    </div>
  );
}
