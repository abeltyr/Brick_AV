export const AccountTypes = [
    "Account_payable",
    "Account_receivable",
    "Accumulated_depreciation",
    "Cash",
    "Cost_of_sales",
    "Equity_does_not_close",
    "Equity_get_closed",
    "Equity_retained_earnings",
    "Expenses",
    "Fixed_assets",
    "Income",
    "Inventory",
    "Long_term_liabilities",
    "Other_assets",
    "Other_current_assets",
    "Other_current_liabilities",
]

export const AccountTypeData = [
    { data: "Account payable", value: "Account_payable" },
    { data: "Account receivable", value: "Account_receivable" },
    { data: "Accumulated depreciation", value: "Accumulated_depreciation" },
    { data: "Cash", value: "Cash" },
    { data: "Cost of sales", value: "Cost_of_sales" },
    { data: "Equity does not close", value: "Equity_does_not_close" },
    { data: "Equity get closed", value: "Equity_get_closed" },
    { data: "Equity retained earnings", value: "Equity_retained_earnings" },
    { data: "Expenses", value: "Expenses" },
    { data: "Fixed assets", value: "Fixed_assets" },
    { data: "Income", value: "Income" },
    { data: "Inventory", value: "Inventory" },
    { data: "Long term liabilities", value: "Long_term_liabilities" },
    { data: "Other assets", value: "Other_assets" },
    { data: "Other current assets", value: "Other_current_assets" },
    { data: "Other current liabilities", value: "Other_current_liabilities" },
];



export const BalanceTypeData = [
    { value: "credit", data: "Credit" },
    { value: "debit", data: "Debit" },
];

export const accountTypeObject: {
    [key: string]: {
        type: "ASSET" | "LIABILITY" | "EQUITY" | "EXPENSE" | "REVENUE",
        data: string
        normal_balance: "credit" | "debit",
        "negative_balance_behavior": "credit" | "debit"
    }
} =
{
    "Account_payable": {
        type: "LIABILITY",
        data: "Account payable",
        normal_balance: "credit",
        negative_balance_behavior: "debit"
    },
    "Account_receivable": {
        type: "ASSET",
        data: "Account receivable",
        normal_balance: "debit",
        "negative_balance_behavior": "credit"
    },
    "Accumulated_depreciation": {
        type: "ASSET",
        data: "Accumulated depreciation",
        normal_balance: "credit",
        negative_balance_behavior: "debit"
    },
    "Cash": {
        type: "ASSET",
        data: "Cash",
        normal_balance: "debit",
        negative_balance_behavior: "credit"
    },
    "Cost_of_sales": {
        type: "EXPENSE",
        data: "Cost of sales",
        normal_balance: "debit",
        negative_balance_behavior: "credit"
    },
    "Equity_does_not_close": {
        type: "EQUITY",
        data: "Equity does not close",
        normal_balance: "credit",
        negative_balance_behavior: "debit"
    },
    "Equity_get_closed": {
        type: "EQUITY",
        data: "Equity get closed",
        normal_balance: "credit",
        negative_balance_behavior: "debit"
    },
    "Equity_retained_earnings": {
        type: "EQUITY",
        data: "Equity retained earnings",
        normal_balance: "credit",
        negative_balance_behavior: "debit"
    },
    "Expenses": {
        type: "EXPENSE",
        data: "Expenses",
        normal_balance: "debit",
        negative_balance_behavior: "credit"
    },
    "Fixed_assets": {
        type: "ASSET",
        data: "Fixed assets",
        normal_balance: "debit",
        negative_balance_behavior: "credit"
    },
    "Income": {
        type: "REVENUE",
        data: "Income",
        normal_balance: "credit",
        negative_balance_behavior: "debit"
    },
    "Inventory": {
        type: "ASSET",
        data: "Inventory",
        normal_balance: "debit",
        negative_balance_behavior: "credit"
    },
    "Long_term_liabilities": {
        type: "LIABILITY",
        data: "Long term liabilities",
        normal_balance: "credit",
        negative_balance_behavior: "debit"
    },
    "Other_assets": {
        type: "ASSET",
        data: "Other assets",
        normal_balance: "debit",
        negative_balance_behavior: "credit"
    },
    "Other_current_assets": {
        type: "ASSET",
        data: "Other current assets",
        normal_balance: "debit",
        negative_balance_behavior: "credit"
    },
    "Other_current_liabilities": {
        type: "LIABILITY",
        data: "Other current liabilities",
        normal_balance: "credit",
        negative_balance_behavior: "debit"
    },
}
// const chartOfAccountTypeDetail = {
//     "accounts": [
//         {
//             "name": "Account_payable",
//             normal_balance: "credit",
//             negative_balance_behavior: "debit",
//             "description": "Liability account. Normally a credit when you owe money. If negative, it means your payable is reduced, and that is a debit."
//         },
//         {
//             "name": "Account_receivable",
//             normal_balance: "debit",
//             negative_balance_behavior: "credit",
//             "description": "Asset account. Normally a debit when money is owed to you. If negative, it means your receivable has decreased, and that is a credit."
//         },
//         {
//             "name": "Accumulated_depreciation",
//             normal_balance: "credit",
//             negative_balance_behavior: "debit",
//             "description": "Contra-asset account reducing asset value. Normally a credit. A negative balance would indicate a reduction in accumulated depreciation, recorded as a debit."
//         },
//         {
//             "name": "Cash",
//             normal_balance: "debit",
//             negative_balance_behavior: "credit",
//             "description": "Asset account. Normally a debit representing cash you have. If negative, it means cash is reduced (or you're overdrafting), and that is a credit."
//         },
//         {
//             "name": "Cost_of_sales",
//             normal_balance: "debit",
//             negative_balance_behavior: "credit",
//             "description": "Expense account. Normally a debit as it represents costs incurred. A negative balance would reduce expenses, recorded as a credit."
//         },
//         {
//             "name": "Equity_does_not_close",
//             "normal_balance": "credit",
//             "negative_balance_behavior": "debit",
//             "description": "Equity account. Normally a credit. A negative balance means equity has decreased, and that is recorded as a debit."
//         },
//         {
//             "name": "Equity_get_closed",
//             "normal_balance": "credit",
//             "negative_balance_behavior": "debit",
//             "description": "Equity account. Normally a credit. A reduction would be a debit."
//         },
//         {
//             "name": "Equity_retained_earnings",
//             "normal_balance": "credit",
//             "negative_balance_behavior": "debit",
//             "description": "Equity account representing retained earnings. Normally a credit. A negative balance means retained earnings are reduced, recorded as a debit."
//         },
//         {
//             "name": "Expenses",
//             "normal_balance": "debit",
//             "negative_balance_behavior": "credit",
//             "description": "Expense account. Normally a debit. A negative balance indicates a reduction in expenses, which is a credit."
//         },
//         {
//             "name": "Fixed_assets",
//             "normal_balance": "debit",
//             "negative_balance_behavior": "credit",
//             "description": "Asset account. Normally a debit. A reduction in the value of fixed assets (negative balance) would be recorded as a credit."
//         },
//         {
//             "name": "Income",
//             "normal_balance": "credit",
//             "negative_balance_behavior": "debit",
//             "description": "Income account. Normally a credit. A negative balance means income has decreased, and that is a debit."
//         },
//         {
//             "name": "Inventory",
//             "normal_balance": "debit",
//             "negative_balance_behavior": "credit",
//             "description": "Asset account. Normally a debit. A reduction in inventory (negative balance) would be recorded as a credit."
//         },
//         {
//             "name": "Long_term_liabilities",
//             "normal_balance": "credit",
//             "negative_balance_behavior": "debit",
//             "description": "Liability account. Normally a credit. A negative balance means the liability is reduced, recorded as a debit."
//         },
//         {
//             "name": "Other_assets",
//             "normal_balance": "debit",
//             "negative_balance_behavior": "credit",
//             "description": "Asset account. Normally a debit. A negative balance would reduce the asset value, recorded as a credit."
//         },
//         {
//             "name": "Other_current_assets",
//             "normal_balance": "debit",
//             "negative_balance_behavior": "credit",
//             "description": "Asset account. Normally a debit. A reduction (negative balance) would be recorded as a credit."
//         },
//         {
//             "name": "Other_current_liabilities",
//             "normal_balance": "credit",
//             "negative_balance_behavior": "debit",
//             "description": "Liability account. Normally a credit. A negative balance means the liability is reduced, and that would be recorded as a debit."
//         }
//     ]
// }