# 🧪 Browser Testing Plan for Marketplace Application

**Base URL:** http://marketplace.test

## 🎯 Testing Objectives
- Verify all user flows work end-to-end
- Test file upload functionality thoroughly 
- Validate role-based access controls
- Ensure payment integration flows properly
- Test responsive design and usability

---

## 👥 Test User Setup

### Create Test Accounts:
1. **Admin User**
   - Email: admin@test.com
   - Password: password123
   - Role: admin

2. **Merchant User** 
   - Email: merchant@test.com
   - Password: password123
   - Role: merchant

3. **Buyer User**
   - Email: buyer@test.com  
   - Password: password123
   - Role: buyer

---

## 🧪 Core Testing Scenarios

### 1. Authentication & Registration Flow
**Test Steps:**
- [ ] Visit http://marketplace.test
- [ ] Click "Register" → Complete registration form
- [ ] Check email verification flow (if enabled)
- [ ] Test login with valid/invalid credentials
- [ ] Test "Forgot Password" functionality
- [ ] Verify logout works properly

**Expected Results:**
- Registration creates account successfully
- Login redirects to appropriate role dashboard
- Password reset emails are sent
- Logout clears session

---

### 2. Buyer User Journey
**Test Steps:**
- [ ] Login as buyer@test.com
- [ ] Browse products on homepage
- [ ] Use search functionality
- [ ] Filter by category and price range
- [ ] View individual product pages
- [ ] Add products to cart
- [ ] Update cart quantities
- [ ] Remove items from cart
- [ ] Proceed to checkout
- [ ] Fill billing information
- [ ] Complete order (test payment flow)
- [ ] View order history
- [ ] Download digital products (if purchased)

**Expected Results:**
- All product browsing works smoothly
- Cart updates correctly
- Checkout process completes
- Orders appear in buyer dashboard
- Digital downloads work only for purchased items

---

### 3. Merchant User Journey
**Test Steps:**
- [ ] Login as merchant@test.com
- [ ] Create store (if first time)
- [ ] Wait for admin approval (or approve via admin)
- [ ] Navigate to Products section
- [ ] Create new physical product
- [ ] Upload product images (test multiple formats: JPG, PNG, WebP)
- [ ] Create new digital product
- [ ] Upload digital files (test PDF, ZIP, DOC formats)
- [ ] Publish/unpublish products
- [ ] Edit existing products
- [ ] Delete product images/files
- [ ] View analytics dashboard
- [ ] Check order management

**Expected Results:**
- Store creation works properly
- File uploads handle multiple formats correctly
- Product CRUD operations work
- Only approved stores can add products
- Analytics show relevant data

---

### 4. Admin User Journey
**Test Steps:**
- [ ] Login as admin@test.com
- [ ] Review platform statistics
- [ ] Manage users (view, filter, search)
- [ ] Approve/suspend stores
- [ ] View all orders and payments
- [ ] Manage categories
- [ ] Access file management dashboard
- [ ] Run orphaned file cleanup
- [ ] View platform analytics

**Expected Results:**
- All admin functions accessible
- Store approval/suspension works
- File management shows storage stats
- Analytics display correctly

---

### 5. File Upload Testing (Critical)
**Test Different File Types:**

**Product Images:**
- [ ] Upload JPG files (< 5MB)
- [ ] Upload PNG files (< 5MB) 
- [ ] Upload WebP files (< 5MB)
- [ ] Upload GIF files (< 5MB)
- [ ] Try uploading oversized files (> 5MB) - should fail
- [ ] Try uploading invalid formats (TXT, PDF) - should fail
- [ ] Delete uploaded images
- [ ] Verify images display correctly on product pages

**Digital Files:**
- [ ] Upload PDF files (< 50MB)
- [ ] Upload ZIP files (< 50MB)
- [ ] Upload DOC/DOCX files (< 50MB)
- [ ] Upload Excel files (< 50MB)
- [ ] Try uploading oversized files (> 50MB) - should fail
- [ ] Try uploading invalid formats (EXE, DMG) - should fail
- [ ] Delete uploaded files
- [ ] Verify file download works for authorized users

---

### 6. Security & Access Control Testing
**Test Steps:**
- [ ] Try accessing admin routes as buyer/merchant (should fail)
- [ ] Try accessing merchant routes as buyer (should fail)
- [ ] Try downloading digital files without purchase (should fail)
- [ ] Try modifying other users' products/orders (should fail)
- [ ] Verify suspended stores cannot add products
- [ ] Test CSRF protection on forms

---

### 7. Edge Cases & Error Handling
**Test Steps:**
- [ ] Empty cart checkout attempt
- [ ] Add out-of-stock items to cart
- [ ] Add unpublished products to cart
- [ ] Upload malformed/corrupted files
- [ ] Extremely long product names/descriptions
- [ ] Special characters in search queries
- [ ] Navigation with browser back/forward buttons
- [ ] Refresh pages during form submissions

---

### 8. Payment Flow Testing
**Test Steps:**
- [ ] Add items to cart and checkout
- [ ] Test payment success scenario
- [ ] Test payment cancellation
- [ ] Verify order status updates correctly
- [ ] Test webhook handling (if possible)
- [ ] Verify stock updates after purchase
- [ ] Test refund scenarios (if implemented)

---

### 9. Mobile/Responsive Testing
**Test on Different Devices:**
- [ ] iPhone/Android - Portrait mode
- [ ] iPhone/Android - Landscape mode  
- [ ] Tablet - Portrait/Landscape
- [ ] Desktop - Various screen sizes
- [ ] Test touch interactions
- [ ] Verify all buttons/links are accessible

---

### 10. Performance & Usability
**Test Steps:**
- [ ] Page load times (especially with images)
- [ ] File upload progress indicators
- [ ] Large file upload handling
- [ ] Search response times
- [ ] Navigation smoothness
- [ ] Form validation feedback
- [ ] Error message clarity

---

## 🚨 Critical Test Points

### Must Work Flawlessly:
1. **File Upload Security** - Only authorized file types
2. **Digital File Access** - Purchase verification required
3. **Role-Based Access** - Users can only access appropriate areas
4. **Payment Processing** - Orders complete successfully
5. **Stock Management** - Inventory updates correctly

### Common Issues to Watch For:
- File upload timeouts on large files
- Image display issues after upload
- Digital download links not working
- Cart not persisting between sessions
- Payment redirects failing
- Admin actions not taking effect

---

## 📋 Testing Checklist Summary

**Pre-Testing Setup:**
- [ ] Application running at http://marketplace.test
- [ ] Database seeded with test data
- [ ] Storage directories writable
- [ ] Test payment credentials configured

**Core Functionality:**
- [ ] User registration/authentication
- [ ] Product browsing and search
- [ ] Shopping cart operations
- [ ] Order placement and management
- [ ] File upload/download system
- [ ] Admin panel functionality

**Security & Performance:**
- [ ] Access control enforcement
- [ ] File type validation
- [ ] Error handling
- [ ] Responsive design
- [ ] Performance under load

---

## 📝 Testing Notes

### File Upload Specifications:
- **Product Images**: JPG, PNG, GIF, WebP (max 5MB each)
- **Digital Files**: PDF, ZIP, DOC, DOCX, XLS, XLSX, TXT (max 50MB each)
- **Storage Locations**: 
  - Images: `storage/app/public/products/{store_id}/`
  - Digital files: `storage/app/digital/{store_id}/`

### Test Data Requirements:
- Categories with products
- Stores in different approval states
- Products (both physical and digital)
- Sample images and digital files for upload testing

### Debugging Tips:
- Check Laravel logs: `storage/logs/laravel.log`
- Monitor browser console for JavaScript errors
- Use browser dev tools to inspect network requests
- Verify database records after operations

---

**Happy Testing! 🎉**

Remember to test systematically and document any issues you encounter. Focus especially on the file upload system since it's the newest feature.