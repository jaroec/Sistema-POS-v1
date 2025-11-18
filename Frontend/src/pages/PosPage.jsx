import { useEffect, useState } from "react";
import {
  searchProducts,
  fetchCustomers,
  createSale,
  fetchExchangeRate,
  fetchPaymentAccounts,
} from "../api/salesApi";

import ProductSearch from "../components/pos/ProductSearch";
import Cart from "../components/pos/Cart";
import PaymentModal from "../components/pos/PaymentModal";
import CustomerSelector from "../components/pos/CustomerSelector";
import SaleDetailsDialog from "../components/pos/SaleDetailsDialog";
import AppLayout from "../components/layout/AppLayout";

export default function PosPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rate, setRate] = useState(1);
  const [paymentAccounts, setPaymentAccounts] = useState([]);

  const [showPayment, setShowPayment] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [saleId, setSaleId] = useState(null);

  const [loading, setLoading] = useState(true);

  // ────────────────────────────────
  // CARGA INICIAL
  // ────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const [customersData, rateData, accountsData] = await Promise.all([
          fetchCustomers(),
          fetchExchangeRate(),
          fetchPaymentAccounts(),
        ]);

        setCustomers(customersData);
        setRate(rateData || 1);
        setPaymentAccounts(accountsData);
      } catch (err) {
        console.error("Error cargando POS:", err);
        alert("Error cargando datos iniciales del POS");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // ────────────────────────────────
  // BÚSQUEDA DE PRODUCTOS (nombre o código)
  // ────────────────────────────────
  const handleSearch = async (text) => {
    try {
      const result = await searchProducts(text);

      // Asegurar estructura correcta según backend nuevo
      const normalized = result.map((p) => ({
        id: p.id,
        product_code: p.product_code,
        name: p.name,
        sale_price_usd: Number(p.sale_price_usd),
        stock: p.stock,
        min_stock: p.min_stock
      }));

      setProducts(normalized);
    } catch (err) {
      alert("Error buscando productos");
    }
  };

  // ────────────────────────────────
  // AGREGAR AL CARRITO
  // ────────────────────────────────
  const addToCart = (product) => {
    const exists = cart.find((i) => i.id === product.id);

    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.sale_price_usd,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          product_code: product.product_code,
          name: product.name,
          price_usd: product.sale_price_usd,
          price_ves: product.sale_price_usd * rate,
          quantity: 1,
          subtotal: product.sale_price_usd,
        },
      ]);
    }
  };

  // ────────────────────────────────
  // ACTUALIZAR CANTIDAD
  // ────────────────────────────────
  const updateQty = (id, qty) => {
    setCart(
      cart.map((i) =>
        i.id === id
          ? {
              ...i,
              quantity: qty,
              subtotal: qty * i.price_usd,
            }
          : i
      )
    );
  };

  // ────────────────────────────────
  // ELIMINAR ITEM DEL CARRITO
  // ────────────────────────────────
  const removeItem = (id) => {
    setCart(cart.filter((i) => i.id !== id));
  };

  // ────────────────────────────────
  // TOTALES
  // ────────────────────────────────
  const totalUSD = cart.reduce((acc, i) => acc + i.subtotal, 0);
  const totalVES = totalUSD * rate;

  // ────────────────────────────────
  // PROCESAR LA VENTA
  // ────────────────────────────────
  const submitSale = async (payments) => {
    try {
      const saleData = {
        customer_id: selectedCustomer || null,
        items: cart.map((i) => ({
          product_id: i.id,
          quantity: i.quantity,
          price_usd: i.price_usd,
        })),
        payments,
        total_usd: totalUSD,
        total_ves: totalVES,
        rate,
      };

      const result = await createSale(saleData);

      setSaleId(result.sale_id);

      // Reset POS
      setCart([]);
      setSelectedCustomer(null);
      setShowPayment(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error registrando la venta");
    }
  };

  if (loading) {
    return <div className="p-6 text-white">Cargando POS…</div>;
  }

  // ────────────────────────────────
  // UI PRINCIPAL
  // ────────────────────────────────
  return (
    <div className="p-6 text-white flex gap-6 max-w-full">

      {/* IZQUIERDA */}
      <div className="flex-1 flex-col space-y-4">
        <ProductSearch
          onSearch={handleSearch}
          products={products}
          addToCart={addToCart}
        />

        <CustomerSelector
          customers={customers}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
        />
      </div>

      {/* DERECHA */}
      <div className="w-[420px]">
        <Cart
          cart={cart}
          rate={rate}
          updateQty={updateQty}
          removeItem={removeItem}
          totalUSD={totalUSD}
          totalVES={totalVES}
          openPayment={() => setShowPayment(true)}
        />
      </div>

      {/* MODAL PAGO */}
      {showPayment && (
        <PaymentModal
          totalUSD={totalUSD}
          totalVES={totalVES}
          accounts={paymentAccounts}
          rate={rate}
          close={() => setShowPayment(false)}
          submit={submitSale}
        />
      )}

      {/* DETALLES VENTA */}
      {saleId && (
        <SaleDetailsDialog saleId={saleId} onClose={() => setSaleId(null)} />
      )}
    </div>
  );
}
