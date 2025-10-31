import { DataSource } from 'typeorm';

import { Brand } from '../../src/brand/entities/brand.entity';
import { Category } from '../../src/category/entities/category.entity';
import { Discount } from '../../src/discount/entities/discount.entity';
import { PaymentMethod } from '../../src/payment-method/entities/payment-method.entity';
import { Product } from '../../src/product/entities/product.entity';
import { ProductDiscount } from '../../src/product-discount/entities/product-discount.entity';
import { ProductImage } from '../../src/product-images/entities/product-image.entity';
import { ProductSupplier } from '../../src/product-supplier/entities/product-supplier.entity';
import { ProductTag } from '../../src/product-tag/entities/product-tag.entity';
import { Purchase } from '../../src/purchase/entities/purchase.entity';
import { PurchaseDetail } from '../../src/purchase-detail/entities/purchase-detail.entity';
import { Sale } from '../../src/sale/entities/sale.entity';
import { SaleDetail } from '../../src/sale-detail/entities/sale-detail.entity';
import { Shipment } from '../../src/shipment/entities/shipment.entity';
import { ShippingCompany } from '../../src/shipping-company/entities/shipping-company.entity';
import { StoreDetail } from '../../src/store-detail/entities/store-detail.entity';
import { Subcategory } from '../../src/subcategory/entities/subcategory.entity';
import { Supplier } from '../../src/supplier/entities/supplier.entity';
import { Tag } from '../../src/tag/entities/tag.entity';
import { User } from '../../src/user/entities/user.entity';
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
