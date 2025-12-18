# AI Hardware Shop - Full-Stack E-Commerce Platform

A complete, production-ready e-commerce web application for selling AI hardware products, built with React, TypeScript, Node.js, and Express.

## Features

### Customer Features
- Browse premium AI hardware products (GPUs, TPUs, Accelerators, etc.)
- Search and filter products by category
- View detailed product specifications
- Add items to shopping cart
- Secure checkout process
- Order history and tracking
- User authentication (register/login)

### Admin Features
- Complete product management (Create, Read, Update, Delete)
- Order management and status updates
- Inventory tracking
- Admin dashboard

### Technical Features
- Full TypeScript implementation (frontend & backend)
- RESTful API architecture
- JWT-based authentication
- SQLite database with proper relationships
- Responsive design
- Context API for state management
- Secure password hashing with bcrypt

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Axios** for API calls
- **Vite** as build tool
- **Context API** for state management
- Modern CSS with responsive design

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **SQLite** database with better-sqlite3
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** enabled

## Project Structure

```
ai-hardware-shop/
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   ├── init.ts          # Database initialization
│   │   │   └── seed.ts          # Seed data
│   │   ├── middleware/
│   │   │   └── auth.ts          # Authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.ts          # Auth endpoints
│   │   │   ├── products.ts      # Product endpoints
│   │   │   ├── cart.ts          # Cart endpoints
│   │   │   └── orders.ts        # Order endpoints
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript types
│   │   └── server.ts            # Main server file
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx  # Auth state management
│   │   │   └── CartContext.tsx  # Cart state management
│   │   ├── pages/
│   │   │   ├── Home.tsx         # Product listing
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Orders.tsx
│   │   │   └── Admin.tsx        # Admin dashboard
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── api.ts           # Axios instance
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd TestBeeRay
```

2. **Install all dependencies**
```bash
npm run install:all
```

Or manually install for each part:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Set up environment variables**
```bash
cd backend
cp .env.example .env
```

Edit `.env` and update the values:
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
```

4. **Start the development servers**

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```
The backend will start on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```
The frontend will start on http://localhost:3000

5. **Access the application**

Open your browser and navigate to:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health

## Default Credentials

The application comes pre-seeded with sample data:

**Admin Account:**
- Email: `admin@aihardware.com`
- Password: `admin123`

**Sample Products:**
- 8 AI hardware products including NVIDIA H100, A100, Google TPU, AMD MI250X, etc.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (supports query params: category, search, sort, order)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user's cart (auth required)
- `POST /api/cart/add` - Add item to cart (auth required)
- `PUT /api/cart/:id` - Update cart item quantity (auth required)
- `DELETE /api/cart/:id` - Remove item from cart (auth required)
- `DELETE /api/cart` - Clear cart (auth required)

### Orders
- `GET /api/orders` - Get user's orders (auth required)
- `GET /api/orders/:id` - Get order details (auth required)
- `POST /api/orders/create` - Create new order (auth required)
- `PATCH /api/orders/:id/status` - Update order status (admin only)

## Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

The built files will be in `frontend/dist/`

## Features in Detail

### Authentication System
- JWT-based authentication with 7-day expiration
- Secure password hashing using bcrypt
- Protected routes for authenticated users
- Role-based access control (admin vs customer)

### Shopping Cart
- Real-time cart updates
- Stock validation
- Quantity management
- Persistent cart (tied to user account)

### Product Management
- Rich product details with specifications
- Category-based organization
- Image support via URLs
- Stock tracking
- Search and filter capabilities

### Order Processing
- Complete checkout flow
- Order history
- Order status tracking
- Detailed order items

### Admin Dashboard
- Full CRUD operations for products
- Order status management
- Real-time inventory updates
- Clean, intuitive interface

## Database Schema

The application uses SQLite with the following tables:

- **users** - User accounts and authentication
- **products** - Product catalog with specs
- **cart_items** - Shopping cart items
- **orders** - Customer orders
- **order_items** - Line items for each order

All relationships are properly enforced with foreign keys.

## Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens for stateless authentication
- Protected API routes with middleware
- SQL injection prevention with prepared statements
- CORS enabled for API access
- Admin-only routes for sensitive operations

## Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## Future Enhancements

Potential features to add:
- Payment gateway integration (Stripe, PayPal)
- Email notifications
- Product reviews and ratings
- Wishlist functionality
- Advanced search with filters
- Image upload for products
- Export orders to CSV
- Analytics dashboard
- Multi-currency support
- Discount codes and promotions

## Troubleshooting

### Backend won't start
- Ensure port 5000 is not in use
- Check that all dependencies are installed
- Verify .env file exists with correct values

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check Vite proxy configuration in vite.config.ts
- Clear browser cache and restart dev server

### Database issues
- Delete `backend/database.sqlite` and restart the backend to recreate
- Check file permissions

## Development

### Code Style
- TypeScript strict mode enabled
- Consistent naming conventions
- Organized file structure
- Reusable components

### Adding New Features
1. Define types in `types/index.ts`
2. Create backend routes in `backend/src/routes/`
3. Add frontend pages/components in `frontend/src/`
4. Update context providers if needed
5. Test thoroughly

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

For issues, questions, or contributions, please open an issue in the repository.

---

Built with ❤️ using React, TypeScript, Node.js, and Express
