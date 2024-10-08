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
    }
} =
{
    "Account_payable": {
        type: "LIABILITY",
        data: "Account payable",
    },
    "Account_receivable": {
        type: "ASSET",
        data: "Account receivable",
    },
    "Accumulated_depreciation": {
        type: "ASSET",
        data: "Accumulated depreciation",
    },
    "Cash": {
        type: "ASSET",
        data: "Cash"
    },
    "Cost_of_sales": {
        type: "EXPENSE",
        data: "Cost of sales"
    },
    "Equity_does_not_close": {
        type: "EQUITY",
        data: "Equity does not close"
    },
    "Equity_get_closed": {
        type: "EQUITY",
        data: "Equity get closed"
    },
    "Equity_retained_earnings": {
        type: "EQUITY",
        data: "Equity retained earnings"
    },
    "Expenses": {
        type: "EXPENSE",
        data: "Expenses"
    },
    "Fixed_assets": {
        type: "ASSET",
        data: "Fixed assets"
    },
    "Income": {
        type: "REVENUE",
        data: "Income"
    },
    "Inventory": {
        type: "ASSET",
        data: "Inventory"
    },
    "Long_term_liabilities": {
        type: "LIABILITY",
        data: "Long term liabilities"
    },
    "Other_assets": {
        type: "ASSET",
        data: "Other assets"
    },
    "Other_current_assets": {
        type: "ASSET",
        data: "Other current assets"
    },
    "Other_current_liabilities": {
        type: "LIABILITY",
        data: "Other current liabilities"
    },
}