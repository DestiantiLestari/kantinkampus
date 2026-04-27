import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Menu as MenuIcon, 
  X, 
  Plus, 
  Minus, 
  ArrowRight,
  Coffee,
  UtensilsCrossed,
  Clock,
  MapPin,
  ChevronRight,
  Heart
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'Food' | 'Drink';
  image: string;
  description: string;
  tag?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

// --- Data ---
const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Nasi Goreng',
    price: 32000,
    category: 'Food',
    image: 'https://picsum.photos/seed/nasi1/600/450',
    description: 'Traditional Indonesian fried rice with aromatic spices, topped with a golden egg.',
    tag: 'Popular'
  },
  {
    id: '2',
    name: 'Iced Matcha Latte',
    price: 28000,
    category: 'Drink',
    image: 'https://picsum.photos/seed/matcha1/600/450',
    description: 'High-quality Japanese matcha with silky milk over ice.',
    tag: 'Refreshing'
  },
  {
    id: '3',
    name: 'Creamy Carbonara',
    price: 38000,
    category: 'Food',
    image: 'https://picsum.photos/seed/pasta1/600/450',
    description: 'Classic spaghetti with rich parmesan sauce and crispy beef bits.',
  },
  {
    id: '4',
    name: 'Cold Brew Coffee',
    price: 25000,
    category: 'Drink',
    image: 'https://picsum.photos/seed/coffee1/600/450',
    description: 'Slow-steeped coffee for a smooth, bold, and non-acidic finish.',
  },
  {
    id: '5',
    name: 'Avocado Toast',
    price: 35000,
    category: 'Food',
    image: 'https://picsum.photos/seed/avo1/600/450',
    description: 'Rustic sourdough topped with smashed avocado and poached eggs.',
    tag: 'Healthy'
  },
  {
    id: '6',
    name: 'Fresh Mango Smoothie',
    price: 26000,
    category: 'Drink',
    image: 'https://picsum.photos/seed/mango1/600/450',
    description: 'Blended ripe mangoes for a sweet and vibrant boost.',
  },
];

// --- Components ---

const Navbar = ({ cartCount, onCartClick }: { cartCount: number, onCartClick: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-cream-300 rounded-full flex items-center justify-center text-stone-800">
            <UtensilsCrossed size={20} />
          </div>
          <span className="text-xl font-serif font-bold tracking-tight text-stone-800">Kantin.</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <a href="#" className="hover:text-stone-900 transition-colors">Home</a>
          <a href="#menu" className="hover:text-stone-900 transition-colors">Menu</a>
          <a href="#about" className="hover:text-stone-900 transition-colors">About</a>
          <button 
            onClick={onCartClick}
            className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-full hover:bg-stone-800 transition-all shadow-md active:scale-95 relative"
          >
            <ShoppingBag size={18} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-cream-300 text-stone-800 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={onCartClick}
            className="p-2 relative text-stone-800"
          >
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-cream-300 text-stone-800 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-stone-800"
          >
            {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-t border-stone-100 shadow-xl p-8 md:hidden flex flex-col gap-6 text-lg font-serif"
          >
            <a href="#" onClick={() => setIsMenuOpen(false)} className="text-stone-800">Home</a>
            <a href="#menu" onClick={() => setIsMenuOpen(false)} className="text-stone-800">Menu</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-stone-800">About</a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const CartSidebar = ({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
}) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-stone-800">Your Basket</h2>
              <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4">
                  <ShoppingBag size={64} strokeWidth={1} />
                  <p className="font-medium">Your cart is empty</p>
                  <button 
                    onClick={onClose}
                    className="text-stone-800 underline underline-offset-4 font-medium"
                  >
                    Start shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-stone-900">{item.name}</h3>
                        <span className="font-serif text-sm">Rp{item.price.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1 line-clamp-1">{item.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-stone-50 space-y-4">
                <div className="flex justify-between items-center text-lg font-serif">
                  <span className="text-stone-500">Total</span>
                  <span className="font-bold text-stone-900">Rp{total.toLocaleString()}</span>
                </div>
                <button className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-all shadow-lg active:scale-[0.98]">
                  Checkout Now
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const MenuItemCard = ({ 
  item, 
  onAddToCart,
  isInCart
}: { 
  item: MenuItem; 
  onAddToCart: (item: MenuItem) => void;
  isInCart: boolean;
}) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 p-3"
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
        <motion.img 
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {item.tag && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-800 shadow-sm">
            {item.tag}
          </div>
        )}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-stone-400 hover:text-rose-500 transition-colors shadow-sm">
          <Heart size={16} />
        </button>
      </div>

      <div className="px-2 pb-2">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-lg font-serif font-bold text-stone-800 leading-tight">{item.name}</h3>
        </div>
        <p className="text-xs text-stone-500 line-clamp-2 mb-4 h-8">{item.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="font-serif font-bold text-stone-900 italic">Rp{item.price.toLocaleString()}</span>
          <button 
            onClick={() => onAddToCart(item)}
            className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300",
              isInCart 
                ? "bg-cream-300 text-stone-800 shadow-inner" 
                : "bg-sage-100 text-stone-800 hover:bg-stone-900 hover:text-white"
            )}
          >
            {isInCart ? <ShoppingBag size={18} /> : <Plus size={20} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const App = () => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Food' | 'Drink'>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return MENU_ITEMS;
    return MENU_ITEMS.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen">
      <Navbar cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onUpdateQuantity={updateQuantity}
      />

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center px-6 pt-20">
        <div className="absolute inset-x-6 inset-y-12 bg-cream-200 rounded-[3rem] overflow-hidden">
          <div className="absolute inset-0 bg-stone-900/10 z-10" />
          <img 
            src="https://picsum.photos/seed/canteenhero/1920/1080?blur=1" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-20 text-center max-w-3xl space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-xs font-bold uppercase tracking-widest text-stone-800"
          >
            <Clock size={14} />
            <span>Open Daily : 08:00 - 20:00</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-serif font-bold text-stone-900 leading-[0.9]"
          >
            Flavors that <br /> feel like <span className="italic text-stone-500">home.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-stone-600 md:text-xl max-w-xl mx-auto leading-relaxed"
          >
            The heart of campus dining. Simple ingredients, prepared with care, served in a calm and elegant atmosphere.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a 
              href="#menu" 
              className="px-10 py-5 bg-stone-900 text-white rounded-full font-bold flex items-center gap-3 hover:bg-stone-800 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
            >
              Explore Menu
              <ArrowRight size={20} />
            </a>
            <div className="flex items-center gap-3 text-stone-500 text-sm font-medium">
              <MapPin size={18} className="text-stone-400" />
              Central Campus, Block B
            </div>
          </motion.div>
        </div>

        {/* Floating Accents */}
        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-24 right-20 hidden lg:block bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-cream-300 rounded-2xl flex items-center justify-center">
              <Heart className="fill-rose-500 text-rose-500" size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-tighter">Student's Choice</p>
              <p className="font-serif font-bold text-stone-800">Classic Nasi Goreng</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-32 px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-serif font-bold text-stone-800 tracking-tight">Our Curated Menu</h2>
            <p className="text-stone-500 max-w-md">From energizing mornings to comforting evenings, we have something for every moment of your campus life.</p>
          </div>

          <div className="flex bg-sage-100 p-1.5 rounded-full self-start">
            {(['All', 'Food', 'Drink'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-8 py-3 rounded-full text-sm font-bold transition-all duration-300",
                  activeCategory === cat 
                    ? "bg-white text-stone-900 shadow-md" 
                    : "text-stone-500 hover:text-stone-800"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <MenuItemCard 
                key={item.id} 
                item={item} 
                onAddToCart={addToCart} 
                isInCart={cart.some(i => i.id === item.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-7xl mx-auto bg-sage-100 rounded-[3rem] overflow-hidden grid md:grid-cols-2 items-center">
          <div className="p-12 md:p-24 space-y-8">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Our Philosophy</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-stone-800 leading-tight">Beyond just a <br /> meal, it's a <span className="italic text-stone-400">pause.</span></h2>
            <p className="text-stone-600 leading-relaxed text-lg">
              Kantin was founded on the belief that student life deserves better than rushed, generic food. We focus on locally sourced ingredients and a space that invites focus and recharge.
            </p>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-sage-100 bg-stone-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="avatar" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-stone-500">
                <span className="text-stone-900 font-bold">2,000+</span> Students served daily
              </p>
            </div>
          </div>
          <div className="h-full relative min-h-[400px]">
             <img 
               src="https://picsum.photos/seed/canteenmood/800/1000" 
               alt="Vibe" 
               className="absolute inset-0 w-full h-full object-cover"
               referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-stone-900/10" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6 md:col-span-1">
               <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-cream-300 rounded-full flex items-center justify-center text-stone-800">
                  <UtensilsCrossed size={16} />
                </div>
                <span className="text-2xl font-serif font-bold tracking-tight">Kantin.</span>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed">
                Elevating campus dining through simplicity, quality, and a touch of classic elegance.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="font-bold text-sm uppercase tracking-widest">Navigation</h4>
              <ul className="space-y-4 text-stone-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#menu" className="hover:text-white transition-colors">Menu</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-sm uppercase tracking-widest">Connect</h4>
              <ul className="space-y-4 text-stone-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-sm uppercase tracking-widest">Newsletter</h4>
              <p className="text-stone-400 text-sm">Join our list for weekly specials and student discounts.</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cream-300 transition-all"
                />
                <button className="absolute right-2 top-1.5 p-1.5 bg-cream-300 text-stone-900 rounded-lg">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-stone-500 text-[10px] font-bold uppercase tracking-[0.2em]">
            <p>© 2024 Kantin SaaS Solutions. All rights Reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
