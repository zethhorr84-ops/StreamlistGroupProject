import { useEffect, useMemo, useState } from "react";
import {
  Film,
  ShoppingCart,
  Sparkles,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Package,
  Clapperboard,
} from "lucide-react";
import products from "./data.js";

const STORAGE_KEY = "streamlist-plus-cart-v1";
const isSubscription = (product) => product.id >= 1 && product.id <= 4;
const currency = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

function readSavedCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    // Keep only known products and normalize quantities.
    return parsed
      .filter((item) => products.some((product) => product.id === item.id))
      .map((item) => {
        const product = products.find((product) => product.id === item.id);
        return {
          id: product.id,
          quantity: isSubscription(product)
            ? 1
            : Math.max(1, Math.floor(Number(item.quantity) || 1)),
        };
      });
  } catch {
    return [];
  }
}

function Navbar({ page, setPage, itemCount }) {
  return (
    <header className="site-header">
      <a
        className="brand"
        href="#home"
        onClick={(event) => {
          event.preventDefault();
          setPage("subscriptions");
        }}
        aria-label="StreamList+ home"
      >
        <span className="brand-icon"><Film size={22} /></span>
        <span>StreamList<span className="brand-plus">+</span></span>
      </a>

      <nav className="main-nav" aria-label="Main navigation">
        <button
          className={page === "subscriptions" ? "nav-link active" : "nav-link"}
          onClick={() => setPage("subscriptions")}
        >
          Subscriptions
        </button>
        <button
          className={page === "accessories" ? "nav-link active" : "nav-link"}
          onClick={() => setPage("accessories")}
        >
          Accessories
        </button>
      </nav>

      <button
        className={page === "cart" ? "cart-nav active" : "cart-nav"}
        onClick={() => setPage("cart")}
        aria-label={`Shopping cart, ${itemCount} items`}
      >
        <ShoppingCart size={19} />
        <span>Cart</span>
        <span className="cart-count">{itemCount}</span>
      </button>
    </header>
  );
}

function ProductCard({ product, onAdd, subscriptionInCart }) {
  const subscription = isSubscription(product);
  const disabled = subscription && subscriptionInCart;
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          className="product-image"
          src={product.img}
          alt={product.service}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
            event.currentTarget.parentElement.classList.add("image-fallback");
          }}
        />
        <span className={subscription ? "product-tag subscription-tag" : "product-tag accessory-tag"}>
          {subscription ? "Subscription" : "EZTech accessory"}
        </span>
      </div>
      <div className="product-info">
        <h3>{product.service}</h3>
        <p className="product-description">{product.serviceInfo}</p>
        <div className="product-card-bottom">
          <div>
            <strong className="price">{currency(product.price)}</strong>
            {subscription && <span className="billing-note"> / month</span>}
          </div>
          <button
            className="button button-primary add-button"
            onClick={() => onAdd(product)}
            disabled={disabled}
          >
            <Plus size={16} />
            {disabled ? "Subscription selected" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductListing({ title, subtitle, items, onAdd, subscriptionInCart }) {
  return (
    <section className="page-content">
      <div className="page-heading">
        <div>
          <p className="eyebrow"><Sparkles size={14} /> THE STREAMLIST+ STORE</p>
          <h1>{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
      </div>
      <div className="product-grid">
        {items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={onAdd}
            subscriptionInCart={subscriptionInCart}
          />
        ))}
      </div>
    </section>
  );
}

function CartItem({ product, quantity, onQuantityChange, onRemove }) {
  const subscription = isSubscription(product);
  return (
    <article className="cart-item">
      <div className="cart-item-image">
        <img src={product.img} alt="" onError={(event) => { event.currentTarget.style.display = "none"; }} />
      </div>
      <div className="cart-item-details">
        <h3>{product.service}</h3>
        <p>{product.serviceInfo}</p>
        <span className="cart-unit-price">
          {currency(product.price)}{subscription ? " / month" : " each"}
        </span>
        {subscription && <span className="fixed-quantity">Subscription quantity is fixed at 1</span>}
      </div>
      <div className="cart-item-actions">
        {!subscription ? (
          <div className="quantity-control" aria-label={`Quantity for ${product.service}`}>
            <button onClick={() => onQuantityChange(product.id, quantity - 1)} aria-label="Decrease quantity">
              <Minus size={15} />
            </button>
            <span>{quantity}</span>
            <button onClick={() => onQuantityChange(product.id, quantity + 1)} aria-label="Increase quantity">
              <Plus size={15} />
            </button>
          </div>
        ) : (
          <span className="quantity-fixed">Qty: 1</span>
        )}
        <strong className="line-total">{currency(product.price * quantity)}</strong>
        <button className="remove-button" onClick={() => onRemove(product.id)}>
          <Trash2 size={15} /> Remove
        </button>
      </div>
    </article>
  );
}

function CartPage({ cart, onQuantityChange, onRemove, onContinueShopping }) {
  const cartProducts = cart.map((item) => ({
    ...products.find((product) => product.id === item.id),
    quantity: item.quantity,
  })).filter((item) => item.id);

  const subtotal = cartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const subscription = cartProducts.find((item) => isSubscription(item));

  return (
    <section className="page-content">
      <div className="page-heading">
        <div>
          <p className="eyebrow"><ShoppingCart size={14} /> YOUR CART</p>
          <h1>Shopping cart</h1>
          <p className="page-subtitle">Review your subscription and EZTech accessories.</p>
        </div>
      </div>

      {cartProducts.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon"><ShoppingCart size={30} /></div>
          <h2>Your cart is taking a movie break.</h2>
          <p>Add a subscription or an accessory to get started.</p>
          <button className="button button-primary" onClick={onContinueShopping}>Browse the store <ArrowRight size={16} /></button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            <div className="cart-list-header">
              <h2>Cart items <span>{cartProducts.reduce((sum, item) => sum + item.quantity, 0)}</span></h2>
              <span>Price</span>
            </div>
            {cartProducts.map((item) => (
              <CartItem
                key={item.id}
                product={item}
                quantity={item.quantity}
                onQuantityChange={onQuantityChange}
                onRemove={onRemove}
              />
            ))}
            <button className="text-button" onClick={onContinueShopping}>← Continue shopping</button>
          </div>

          <aside className="order-summary">
            <h2>Order summary</h2>
            <div className="summary-row"><span>Items subtotal</span><strong>{currency(subtotal)}</strong></div>
            {subscription && (
              <div className="summary-note">
                <CheckCircle2 size={16} />
                <span>{subscription.service} renews monthly. This demo does not process payments.</span>
              </div>
            )}
            <div className="summary-divider" />
            <div className="summary-total"><span>Total</span><strong>{currency(subtotal)}</strong></div>
            <p className="summary-disclaimer">Taxes, shipping, and actual payment processing are not included in this class prototype.</p>
            <button className="button button-primary checkout-button" onClick={() => window.alert("Checkout is a prototype only. No payment has been collected.")}>
              Continue to checkout <ArrowRight size={16} />
            </button>
            <div className="secure-note"><Package size={15} /> Secure checkout would be integrated in a future release.</div>
          </aside>
        </div>
      )}
    </section>
  );
}

export default function App() {
  const [page, setPage] = useState("subscriptions");
  const [cart, setCart] = useState(readSavedCart);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(null), 4500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const subscriptionInCart = useMemo(
    () => cart.some((item) => isSubscription(products.find((product) => product.id === item.id))),
    [cart]
  );
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart(product) {
    if (isSubscription(product) && subscriptionInCart) {
      setNotice({
        type: "warning",
        message: "Only one subscription can be in your cart at a time. Remove your current subscription before choosing another.",
      });
      return;
    }

    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        if (isSubscription(product)) return current;
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { id: product.id, quantity: 1 }];
    });
    setNotice({ type: "success", message: `${product.service} added to your cart.` });
  }

  function changeQuantity(productId, nextQuantity) {
    const product = products.find((item) => item.id === productId);
    if (!product || isSubscription(product)) return;
    if (nextQuantity < 1) {
      removeItem(productId);
      return;
    }
    setCart((current) =>
      current.map((item) => item.id === productId ? { ...item, quantity: nextQuantity } : item)
    );
  }

  function removeItem(productId) {
    const removed = products.find((product) => product.id === productId);
    setCart((current) => current.filter((item) => item.id !== productId));
    if (removed) setNotice({ type: "success", message: `${removed.service} removed from your cart.` });
  }

  const subscriptionProducts = products.filter(isSubscription);
  const accessoryProducts = products.filter((product) => !isSubscription(product));

  return (
    <div className="app-shell">
      <Navbar page={page} setPage={setPage} itemCount={itemCount} />

      <main>
        {page === "subscriptions" && (
          <>
            <section className="hero">
              <div className="hero-content">
                <p className="hero-kicker"><Clapperboard size={16} /> YOUR ENTERTAINMENT, ORGANIZED</p>
                <h1>Find your next<br /><span>favorite thing.</span></h1>
                <p>Discover your StreamList+ plan and keep your movie-night essentials in one place.</p>
                <button className="button button-light" onClick={() => document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" })}>
                  Explore plans <ArrowRight size={16} />
                </button>
              </div>
              <div className="hero-art" aria-hidden="true">
                <div className="orb orb-one" />
                <div className="orb orb-two" />
                <div className="floating-ticket"><Film size={50} /><span>STREAM MORE</span></div>
                <div className="hero-sparkle sparkle-one">✦</div>
                <div className="hero-sparkle sparkle-two">✧</div>
              </div>
            </section>
            <div id="plans">
              <ProductListing
                title="Choose your subscription"
                subtitle="Choose one plan to add to your cart. You can switch plans by removing your current selection first."
                items={subscriptionProducts}
                onAdd={addToCart}
                subscriptionInCart={subscriptionInCart}
              />
            </div>
            <section className="accessory-promo">
              <div>
                <p className="eyebrow">THE FAN COLLECTION</p>
                <h2>Represent your tech side.</h2>
                <p>Shop EZTech gear and add multiple accessories to your cart.</p>
              </div>
              <button className="button button-light" onClick={() => setPage("accessories")}>Shop accessories <ArrowRight size={16} /></button>
            </section>
          </>
        )}

        {page === "accessories" && (
          <ProductListing
            title="EZTech accessories"
            subtitle="Show off your StreamList+ style. Add multiple items and adjust quantities in your cart."
            items={accessoryProducts}
            onAdd={addToCart}
            subscriptionInCart={subscriptionInCart}
          />
        )}

        {page === "cart" && (
          <CartPage
            cart={cart}
            onQuantityChange={changeQuantity}
            onRemove={removeItem}
            onContinueShopping={() => setPage("subscriptions")}
          />
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-brand"><Film size={18} /> StreamList<span>+</span></div>
        <p>Discover more. Organize your watchlist. Make movie night yours.</p>
        <small>Student project prototype · No real payments are processed.</small>
      </footer>

      {notice && (
        <div className={`toast toast-${notice.type}`} role="status" aria-live="polite">
          {notice.type === "warning" ? <AlertTriangle size={19} /> : <CheckCircle2 size={19} />}
          <span>{notice.message}</span>
          <button onClick={() => setNotice(null)} aria-label="Dismiss notification">×</button>
        </div>
      )}
    </div>
  );
}
