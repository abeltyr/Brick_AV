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
        type: "ASSET" | "LIABILITY" | "EQUITY" | "EXPENSE" | "REVENUE"
    }
} =
{
    "Account_payable": {
        type: "LIABILITY"
    },
    "Account_receivable": {
        type: "ASSET"
    },
    "Accumulated_depreciation": {
        type: "ASSET"
    },
    "Cash": {
        type: "ASSET"
    },
    "Cost_of_sales": {
        type: "EXPENSE"
    },
    "Equity_does_not_close": {
        type: "EQUITY"
    },
    "Equity_get_closed": {
        type: "EQUITY"
    },
    "Equity_retained_earnings": {
        type: "EQUITY"
    },
    "Expenses": {
        type: "EXPENSE"
    },
    "Fixed_assets": {
        type: "ASSET"
    },
    "Income": {
        type: "REVENUE"
    },
    "Inventory": {
        type: "ASSET"
    },
    "Long_term_liabilities": {
        type: "LIABILITY"
    },
    "Other_assets": {
        type: "ASSET"
    },
    "Other_current_assets": {
        type: "ASSET"
    },
    "Other_current_liabilities": {
        type: "LIABILITY"
    },
}