import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-20 bg-black text-neutral-300">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-white">
            <Clock className="h-5 w-5 text-gold" aria-hidden="true" />
            <span className="font-display text-2xl font-bold">TimeCraft Watches</span>
          </div>
          <p className="mt-3 max-w-xs text-sm">
            A demo watch store built for learning. No real products are sold and no payments are collected.
          </p>
        </div>
        <nav aria-label="Footer">
          <h2 className="font-sans text-sm font-semibold text-white">Shop</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-gold" to="/products">All watches</Link></li>
            <li><Link className="hover:text-gold" to="/products?category=Luxury">Luxury</Link></li>
            <li><Link className="hover:text-gold" to="/products?category=Classic">Classic</Link></li>
            <li><Link className="hover:text-gold" to="/products?category=Sports">Sports</Link></li>
          </ul>
        </nav>
        <div>
          <h2 className="font-sans text-sm font-semibold text-white">Store information</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>12 Clockmaker Lane, Demo City</li>
            <li>support@timecraft.example</li>
            <li>Mon - Sat, 9:00 - 18:00</li>
            <li><Link className="hover:text-gold" to="/orders">Track your orders</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-800 py-4 text-center text-xs text-neutral-500">
        &copy; {new Date().getFullYear()} TimeCraft Watches. Academic demo project.
      </div>
    </footer>
  )
}
