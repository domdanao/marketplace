# 🛒 Laravel Marketplace Platform

A comprehensive, production-ready multi-vendor marketplace platform built with Laravel, React, and modern web technologies. Designed for scalability, security, and extensibility.

## ✨ Features

### 🏪 **Multi-Vendor Architecture**
- **Merchant Management** - Complete lifecycle management for vendor accounts
- **Store Creation** - Individual storefronts for each merchant
- **Product Catalog** - Support for both physical and digital products
- **Inventory Management** - Real-time stock tracking and management

### 👥 **User Management & Authentication**
- **Role-Based Access Control** - Admin, Merchant, and Buyer roles
- **Secure Authentication** - Laravel Sanctum with email verification
- **Profile Management** - Comprehensive user account management
- **Permission System** - Granular access control across platform features

### 💳 **E-Commerce Core**
- **Shopping Cart** - Persistent cart with quantity management
- **Order Processing** - Complete order lifecycle management
- **Payment Integration** - Secure payment processing with webhooks
- **Digital Downloads** - Automated delivery for digital products

### 🔧 **Admin Dashboard**
- **Platform Analytics** - Revenue, orders, and user metrics
- **Content Management** - Categories, products, and store oversight
- **User Administration** - Complete user and merchant account management
- **System Monitoring** - File management, payment tracking, and system health

### 📱 **Modern Frontend**
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Interactive UI** - React-powered dynamic user interface
- **Server-Side Rendering** - Inertia.js for optimal performance
- **File Upload** - Drag-and-drop file management with validation

## 🚀 **Technology Stack**

### **Backend**
- **Laravel 12** - Modern PHP framework with latest features
- **PHP 8.4** - Latest PHP with performance improvements
- **MySQL/PostgreSQL** - Robust database support
- **Laravel Sanctum** - API authentication
- **Laravel Queues** - Background job processing

### **Frontend**
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Inertia.js v2** - Modern monolith architecture
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vite** - Fast build tooling and HMR

### **Testing & Quality**
- **Pest PHP** - Modern PHP testing framework
- **Laravel Pint** - Code formatting and style enforcement
- **Browser Testing** - End-to-end testing capabilities
- **Feature Testing** - Comprehensive test coverage

## 📋 **Requirements**

- PHP 8.4 or higher
- Node.js 18+ and npm
- MySQL 8.0+ or PostgreSQL 13+
- Composer 2.0+
- Web server (Apache/Nginx)

## 🛠 **Installation**

### **1. Clone & Setup**
```bash
git clone <repository-url>
cd marketplace
composer install
npm install
```

### **2. Environment Configuration**
```bash
cp .env.example .env
php artisan key:generate
```

Configure your `.env` file with:
- Database credentials
- Payment gateway settings
- File upload configurations
- Mail server settings

### **3. Database Setup**
```bash
php artisan migrate
php artisan db:seed  # Optional: seed with sample data
```

### **4. Storage & Assets**
```bash
php artisan storage:link
npm run build
```

### **5. Start Development**
```bash
php artisan serve
npm run dev  # In separate terminal for hot reloading
```

Visit `http://localhost:8000` to access the platform.

## 👤 **Default Admin Account**

Create an admin account via tinker:
```bash
php artisan tinker
```
```php
User::create([
    'name' => 'Admin User',
    'email' => 'admin@example.com',
    'email_verified_at' => now(),
    'password' => Hash::make('password'),
    'role' => 'admin',
]);
```

## 🏗 **Architecture Overview**

### **User Roles & Permissions**
- **Admin** - Full platform management and oversight
- **Merchant** - Store and product management within their scope
- **Buyer** - Shopping, orders, and account management

### **Merchant Lifecycle**
1. **Account Creation** - Admin creates or user applies for merchant status
2. **Approval Process** - Admin review and approval workflow  
3. **Store Setup** - Merchant creates and configures their storefront
4. **Product Management** - Add, manage, and publish products
5. **Order Fulfillment** - Process and manage customer orders

### **File Management**
- **Product Images** - Optimized image storage and delivery
- **Digital Products** - Secure download management with access control
- **File Validation** - Type and size restrictions for security
- **Storage Optimization** - Automated cleanup of orphaned files

## 🧪 **Testing**

### **Run Test Suite**
```bash
php artisan test                    # All tests
php artisan test --filter=Feature   # Feature tests only
php artisan test --coverage        # With coverage report
```

### **Browser Testing**
Follow the comprehensive testing plan in `human-testing-plan.md` for manual testing scenarios.

### **Code Quality**
```bash
vendor/bin/pint          # Format code
vendor/bin/pint --test   # Check formatting
```

## 📦 **Key Features Deep Dive**

### **Merchant Account Management**
- **Standalone Creation** - Admins can create complete merchant accounts
- **Status Management** - Pending, approved, suspended, rejected states
- **Business Information** - Complete business profiles with banking details
- **Access Control** - Status-based feature access and restrictions

### **Product Catalog**
- **Dual Product Types** - Physical products with inventory, digital with downloads
- **Category Management** - Hierarchical product categorization
- **Search & Filtering** - Advanced product discovery features
- **Image Management** - Multi-image support with optimization

### **Order & Payment Processing**
- **Cart Management** - Persistent shopping cart across sessions
- **Checkout Flow** - Streamlined purchase process
- **Payment Integration** - Webhook-based payment confirmation
- **Order Tracking** - Complete order status management

### **Admin Dashboard**
- **Analytics** - Revenue, user, and performance metrics
- **User Management** - Complete platform user administration
- **Content Control** - Category, product, and store oversight
- **System Health** - File management and system monitoring

## 🔒 **Security Features**

- **CSRF Protection** - Built-in request forgery protection
- **SQL Injection Prevention** - Eloquent ORM with parameter binding
- **File Upload Security** - Type validation and secure storage
- **Access Control** - Role-based permissions throughout
- **Rate Limiting** - API and authentication rate limiting
- **Data Validation** - Comprehensive input validation

## 📈 **Performance & Scalability**

- **Database Optimization** - Proper indexing and query optimization
- **File Storage** - Scalable file storage with CDN support
- **Caching** - Built-in caching for performance
- **Queue Processing** - Background job processing for heavy tasks
- **Asset Optimization** - Vite-based asset bundling and optimization

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow Laravel conventions and best practices
- Write tests for new features
- Use Laravel Pint for code formatting
- Update documentation for significant changes

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

- **Documentation** - Check `human-testing-plan.md` for comprehensive testing
- **Issues** - Report bugs and feature requests via GitHub Issues
- **Testing** - Follow the testing plan for validation scenarios

## 🌟 **Roadmap**

### **Current Release (v1.0)**
- ✅ Multi-vendor marketplace core
- ✅ Merchant account management
- ✅ Product catalog with digital downloads
- ✅ Order and payment processing
- ✅ Admin dashboard and analytics

### **Future Enhancements**
- 📧 Enhanced email notifications and templates
- 📱 Mobile app API endpoints
- 🔍 Advanced search with Elasticsearch
- 💬 Built-in messaging system
- 📊 Advanced analytics and reporting
- 🌍 Multi-language and currency support

---

**Built with ❤️ using Laravel, React, and modern web technologies**

*A production-ready marketplace platform designed for growth and scalability*