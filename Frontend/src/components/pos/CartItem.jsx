import React from "react";

export default function CartItem({ item, onChangeQty, onRemove, exchangeRate }) {
  const subtotalUSD = item.subtotal ?? 0;
  const subtotalVES = exchangeRate ? subtotalUSD * exchangeRate : null;

  return (
    <div className="flex justify-between items-center p-2 border rounded">
      <div>
        <p className="font-semibold">{item.product_name}</p>
        <p className="text-xs text-slate-500">${item.unit_price?.toFixed(2)} USD c/u</p>

        {subtotalVES !== null && (
          <p className="text-xs text-slate-600 mt-1">
            {subtotalVES.toLocaleString("es-VE")} VES
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onChangeQty(item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="px-2 bg-slate-200 rounded"
        >
          -
        </button>

        <span className="font-semibold">{item.quantity}</span>

        <button
          onClick={() => onChangeQty(item.quantity + 1)}
          className="px-2 bg-slate-200 rounded"
        >
          +
        </button>

        <div className="text-right ml-4">
          <p className="font-bold">${subtotalUSD.toFixed(2)}</p>
        </div>

        <button className="text-red-600 ml-4" onClick={onRemove}>
          ✕
        </button>
      </div>
    </div>
  );
}
