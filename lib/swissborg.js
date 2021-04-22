const ExcelJS = require('exceljs')

export default async function (filename) {
    const worksheet = await new ExcelJS.stream.xlsx.WorkbookReader(filename).parse().next()
    return new AccountStatement(worksheet)
}

function AccountStatement(aWorksheet) {

    const DATA_HEADER_ROW_INDEX = 9

    const worksheet = aWorksheet

    // this.getUserId = function () {
    //     return worksheet.getRow(1).getCell(2).value
    // }

    // this.getDateRange = function () {
    //     return {
    //         start: new Date(worksheet.getRow(2).getCell(2).value),
    //         end: new Date(worksheet.getRow(3).getCell(2).value)
    //     }
    // }

    this.getLedgerEntries =  function () {

        let balances = {}

        worksheet.eachRow((row, index) => {
            if (index > DATA_HEADER_ROW_INDEX) {

                const type = row.getCell(3).value
                const currency = row.getCell(4).value
                const netAmount = row.getCell(9).value
                const decrease = type == 'Withdrawals' || type == 'Sell'

                // compute the balance of each asset
                balances[currency] = (balances[currency] ? balances[currency] : 0) + (decrease ? -netAmount : netAmount)

                const entry = {
                    // time: new Date(row.getCell(2).value + 'Z'),
                    time: row.getCell(2).value,
                    type: type,
                    currency: currency,
                    grossAmount: row.getCell(5).value,
                    fee: row.getCell(7).value,
                    netAmount: netAmount,
                    balance: balances[currency],
                    note: row.getCell(11).value
                }

                return entry
            }
        })
    }

    this.getTrades = function () {

        let trades = []
        let currentTrade;

        for (var i = 0; i < ledgerEntries.length; i++) {

            /*
             * We assume that a Sell always appear right before the corresponding
             * Buy and that the fee is always paid in the bought currency.
             */

            if (ledgerEntries[i].type == 'Sell') {
                currentTrade = {
                    time: ledgerEntries[i].time,
                    buy: undefined,
                    sell: {
                        currency: ledgerEntries[i].currency,
                        amount: ledgerEntries[i].grossAmount,
                        fee: 0,
                        misc: ledgerEntries[i].note
                    }
                }
            }
            else if (ledgerEntries[i].type == 'Buy') {

                currentTrade.buy = {
                    currency: ledgerEntries[i].currency,
                    amount: ledgerEntries[i].netAmount,
                    fee: ledgerEntries[i].fee,
                    misc: ledgerEntries[i].note
                }

                trades.push(currentTrade)
                currentTrade = null
            }
        }

        return trades
    }

    this.getFunding = function () {
        return ledgerEntries.filter(entry => entry.type == 'Deposit' || entry.type == 'Withdrawal')
    }

    this.getDeposits = function () {
        return ledgerEntries.filter(entry => entry.type == 'Deposit')
    }

    this.getWithdrawals = function () {
        return ledgerEntries.filter(entry => entry.type == 'Withdrawal')
    }

    this.getRewards = function () {
        // exclude smart yield earnings
        return ledgerEntries.filter(entry => entry.type == 'Earnings' && entry.note == '')
    }

    this.getEarnings = function () {
        // only return smart yield earnings
        return ledgerEntries.filter(entry => entry.type == 'Earnings' && entry.note == 'Yield earnings')
    }
}
