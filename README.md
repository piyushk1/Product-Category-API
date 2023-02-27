# Product-Category-API
 API to manage products and categories
 
 
## Getting Started

### Prerequisites

    Node.js
	MongoDB

###Installing
**1.  Clone the repository: **
```bash
git clone https://github.com/<your-username>/product-category-api.git
```
**2. Install dependencies:**
```bash
cd product-category-api
npm install
```
**3. Start the server:**
```bash
npm start
```

The API should now be running at http://localhost:3000.


#API Endpoints

**Products**

    `GET /products `- Retrieve all products
  `  GET /products/:productId` - Retrieve a product by ID
    `GET /productsWithCategories `- Retrieve all products with their corresponding category objects
   ` POST /products `- Create a new product
    `PUT /products/:productId` - Update a product by ID
    `DELETE /products/:productId` - Delete a product by ID



**Categories**

   ` GET /categories` - Retrieve all categories
    `GET /categories/:categoryId` - Retrieve a category by ID
   ` DELETE /categories/:categoryId` - Delete a category by ID



