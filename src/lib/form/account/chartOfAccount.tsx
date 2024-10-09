

import { z } from 'zod';

export const chartOfAccountSchema = z.object({
    name: z.string().min(1, 'Account Name is required'),
    code: z.number(
        {
            invalid_type_error: "The account id is invalid "
        }
    ).min(4, 'The account id needs at least 4 digits'),
    accountType: z.enum([
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
        "Other_current_liabilities",], {
        required_error: 'You must select at least one account type!',
    }),
    balance: z.object({
        amount: z.number({
            required_error: 'Balance amount is required!',
            invalid_type_error: 'Balance amount must be a number!',
        }),
    })
})


export const chartOfAccountsSchema = z.object({
    accounts: z.array(chartOfAccountSchema)
    // .min(5, "At least one Chart of accounts are required"),
})