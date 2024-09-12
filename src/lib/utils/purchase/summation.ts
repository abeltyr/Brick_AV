import {
  ProductCategoryType,
  ProductPurchaseType,
  ProductUnitType,
} from "@prisma/client";
import Decimal from "decimal.js";

const generateSummation = ({
  hasVat,
  hasWithholding,
  purchaseProducts,
}: {
  hasVat: boolean;
  hasWithholding: boolean;
  purchaseProducts: {
    productId: string;
    type: ProductCategoryType;
    purchaseType: ProductPurchaseType;
    unit: ProductUnitType;
    unitPrice: number;
    quantity: number;
  }[];
}) => {
  let localGoodSummaryAmount = new Decimal(0);
  let importedGoodSummaryAmount = new Decimal(0);
  let serviceSummaryAmount = new Decimal(0);

  let localPurchaseCapitalAssets: Decimal = new Decimal(0);
  let vatOnLocalPurchaseCapitalAssets: Decimal = new Decimal(0);

  let importedCapitalAssets: Decimal = new Decimal(0);
  let vatOnImportedCapitalAssets: Decimal = new Decimal(0);

  let localPurchaseInputs: Decimal = new Decimal(0);
  let vatOnLocalPurchaseInputs: Decimal = new Decimal(0);

  let importedInputs: Decimal = new Decimal(0);
  let vatOnImportedInputs: Decimal = new Decimal(0);

  let generalExpenseInputs: Decimal = new Decimal(0);
  let vatOnGeneralExpenseInputs: Decimal = new Decimal(0);

  let purchaseWithNoVat: Decimal = new Decimal(0);

  let totalCapitalAssets: Decimal = new Decimal(0);
  let vatOnTotalAssets: Decimal = new Decimal(0);

  let totalNonCapitalInputs: Decimal = new Decimal(0);
  let vatOnTotalInputs: Decimal = new Decimal(0);

  let purchaseProductData: {
    productId: string;
    type: ProductCategoryType;
    purchaseType: ProductPurchaseType;
    unit: ProductUnitType;
    unitPrice: Decimal;
    quantity: number;
    totalValue: Decimal;
    vat: Decimal;
    grossAmount: Decimal;
    order: number;
  }[] = [];

  const VAT_RATE = new Decimal("0.15"); // 15% VAT rate

  // Calculate sums and prepare data for bulk updates

  purchaseProducts.map(async (product, index) => {
    const totalValue = new Decimal(product.unitPrice).times(product.quantity);
    const vat = totalValue.times(VAT_RATE);
    let grossAmount = totalValue.plus(vat);

    // ... (Update summary variables like localGoodSummaryAmount, etc. - same logic as before)

    // Prepare data for purchaseProducts array
    purchaseProductData.push({
      productId: product.productId,
      type: product.type,
      purchaseType: product.purchaseType,
      unit: product.unit,
      unitPrice: new Decimal(product.unitPrice),
      quantity: product.quantity,
      totalValue: totalValue,
      vat: vat,
      grossAmount: grossAmount,
      order: index + 1,
    });
  });
};
