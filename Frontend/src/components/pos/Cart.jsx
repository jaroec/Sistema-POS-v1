export default function Cart({
  cart,
  rate,
  updateQty,
  removeItem,
  totalUSD,
  totalVES,
  openPayment,
}) {
  return (
    <div className="bg-white/10 p-5 rounded-xl border border-white/10">
      <h2 className="text-lg font-semibold mb-4">Carrito</h2>

      {cart.length === 0 && (
        <p className="text-white/50">No hay productos</p>
      )}

      {cart.map((item) => (
        <div
          key={item.id}
          className="pb-3 mb-3 border-b border-white/10"
        >
          <div className="flex justify-between">
            <p className="text-white">{item.name}</p>
            <p className="text-emerald-400 font-semibold">
              ${item.subtotal.toFixed(2)}
            </p>
          </div>

          <div className="flex items-center mt-2 gap-2">
            <input
              type="number"
              min="1"
              className="w-16 bg-white/10 text-white p-1 rounded"
              value={item.quantity}
              onChange={(e) =>
                updateQty(item.id, Number(e.target.value))
              }
            />

            <span className="text-white/50 text-sm">
              x ${item.price_usd}
            </span>

            <button
              onClick={() => removeItem(item.id)}
              className="text-red-400 text-sm ml-auto hover:underline"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}

      {/* TOTAL */}
      <div className="mt-6">
        <p className="text-white text-md">
          Total USD:{" "}
          <span className="font-bold text-emerald-400">
            ${totalUSD.toFixed(2)}
          </span>
        </p>

        <p className="text-white/70 text-sm mt-1">
          Total VES: <span>{totalVES.toFixed(2)}</span>
        </p>
      </div>

      <button
        onClick={openPayment}
        disabled={cart.length === 0}
        className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 p-3 rounded font-semibold text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        Cobrar
      </button>
    </div>
  );
}
