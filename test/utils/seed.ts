import { DataSource } from 'typeorm';

// Brand
import { Brand } from '../../src/brand/entities/brand.entity';
// Category
import { Category } from '../../src/category/entities/category.entity';
// Discount
import { Discount } from '../../src/discount/entities/discount.entity';
// PaymentMethod
import { PaymentMethod } from '../../src/payment-method/entities/payment-method.entity';
// Product
import { Product } from '../../src/product/entities/product.entity';
// ProductDiscount
import { ProductDiscount } from '../../src/product-discount/entities/product-discount.entity';
// ProductImage
import { ProductImage } from '../../src/product-images/entities/product-image.entity';
// ProductSupplier
import { ProductSupplier } from '../../src/product-supplier/entities/product-supplier.entity';
// ProductTag
import { ProductTag } from '../../src/product-tag/entities/product-tag.entity';
// Purchase
import { Purchase } from '../../src/purchase/entities/purchase.entity';
// PurchaseDetail
import { PurchaseDetail } from '../../src/purchase-detail/entities/purchase-detail.entity';
// Sale
import { Sale } from '../../src/sale/entities/sale.entity';
// SaleDetail
import { SaleDetail } from '../../src/sale-detail/entities/sale-detail.entity';
// Shipment
import { Shipment } from '../../src/shipment/entities/shipment.entity';
// ShippingCompany
import { ShippingCompany } from '../../src/shipping-company/entities/shipping-company.entity';
// StoreDetail
import { StoreDetail } from '../../src/store-detail/entities/store-detail.entity';
// Subcategory
import { Subcategory } from '../../src/subcategory/entities/subcategory.entity';
// Supplier
import { Supplier } from '../../src/supplier/entities/supplier.entity';
// Tag
import { Tag } from '../../src/tag/entities/tag.entity';
// User
import { User } from '../../src/user/entities/user.entity';
// Wishlist
import { Wishlist } from '../../src/wishlist/entities/wishlist.entity';

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5433,
  username: process.env.POSTGRES_USER || 'e2e',
  password: process.env.POSTGRES_PASSWORD || 'e2e123',
  database: process.env.POSTGRES_DB || 'db_e2e',
  entities: [
    Brand,
    Category,
    Discount,
    PaymentMethod,
    Product,
    ProductDiscount,
    ProductImage,
    ProductSupplier,
    ProductTag,
    Purchase,
    PurchaseDetail,
    Sale,
    SaleDetail,
    Shipment,
    ShippingCompany,
    StoreDetail,
    Subcategory,
    Supplier,
    Tag,
    User,
    Wishlist,
  ],
});

export const upSeed = async () => {
  await dataSource.initialize();
  await dataSource.synchronize(true);
  await dataSource.destroy();
};

export const downSeed = async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
  await dataSource.destroy();
};
