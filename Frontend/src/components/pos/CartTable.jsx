export default function CartTable({ items, setItems }) {
  const updateQty = (id, qty) => {
    const updated = items.map((i) => {
      if (i.product_id === id) {
        if (qty > i.stock) {
          alert("Stock insuficiente");
          return i;
        }
        return { ...i, quantity: qty };
      }
      return i;
    });
    setItems(updated);
  };

  const remove = (id) => {
    setItems(items.filter((i) => i.product_id !== id));
  };

  return (
    <table className="w-full border mt-4">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Producto</th>
          <th className="p-2 border">Precio</th>
          <th className="p-2 border">Cant</th>
          <th className="p-2 border">Subtotal</th>
          <th className="p-2 border"></th>
        </tr>
      </thead>

      <tbody>
        {items.map((item) => (
          <tr key={item.product_id}>
            <td className="p-2 border">{item.name}</td>
            <td className="p-2 border">${item.price_usd}</td>

            <td className="p-2 border">
              <input
                type="number"
                className="border p-1 w-20"
                min="1"
                max={item.stock}
                value={item.quantity}
                onChange={(e) => updateQty(item.product_id, Number(e.target.value))}
              />
            </td>

            <td className="p-2 border">
              ${(item.quantity * item.price_usd).toFixed(2)}
            </td>

            <td className="p-2 border">
              <button onClick={() => remove(item.product_id)} className="text-red-600">
                X
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
