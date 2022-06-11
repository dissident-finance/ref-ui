import React from 'react';
import getConfig from './config';
import {
  near,
  Transaction,
  executeMultipleTransactions,
  ONE_YOCTO_NEAR,
} from './near';
import { wallet, REF_FI_CONTRACT_ID } from './near';
import { toNonDivisibleNumber } from '../utils/numbers';
const { networkId, USN_ID } = getConfig();

export const fetchMultiplier = async () => {
  try {
    const response = await near.connection.provider.query({
      request_type: 'call_function',
      account_id: `priceoracle.${networkId === 'mainnet' ? 'near' : 'testnet'}`,
      method_name: 'get_price_data',
      args_base64: btoa(
        `{"asset_ids": ["wrap.${
          networkId === 'mainnet' ? 'near' : 'testnet'
        }","wrap.${networkId === 'mainnet' ? 'near' : 'testnet'}#3600"]}`
      ),
      finality: 'final',
    });

    const res = JSON.parse(
      //@ts-ignore
      response.result.map((x: any) => String.fromCharCode(x)).join('')
    );

    const rates = res.prices.map((p: any) => p.price);
    // return res.prices[0].price;

    console.log('previous price', res.prices[0].price);

    return wallet
      .account()
      .viewFunction(USN_ID, 'predict_buy', {
        account: REF_FI_CONTRACT_ID,
        amount: '1000000000000000000000000',
        rates,
      })
      .then((res) => {
        console.log('current price', res.rate);
        return res.rate;
      });
  } catch (error) {
    console.warn('Failed to load ', error);
  }
};

export const buyUSN = async ({
  multiplier,
  slippage,
  amount,
}: {
  multiplier: string;
  slippage: number;
  amount: string;
}) => {
  const transaction: Transaction = {
    receiverId: USN_ID,
    functionCalls: [
      {
        methodName: 'buy',
        args: {
          expected: {
            multiplier,
            slippage: `${Math.round((Number(multiplier) / 100) * slippage)}`,
            decimals: 28,
          },
        },
        amount,
        gas: '50000000000000',
      },
    ],
  };

  executeMultipleTransactions([transaction]);
};

export const sellUSN = async ({
  multiplier,
  slippage,
  amount,
}: {
  multiplier: string;
  slippage: number;
  amount: string;
}) => {
  const transaction: Transaction = {
    receiverId: USN_ID,
    functionCalls: [
      {
        methodName: 'sell',
        args: {
          expected: {
            multiplier,
            slippage: `${Math.round((Number(multiplier) / 100) * slippage)}`,
            decimals: 28,
          },
          amount: toNonDivisibleNumber(18, amount),
        },
        amount: ONE_YOCTO_NEAR,
        gas: '50000000000000',
      },
    ],
  };

  executeMultipleTransactions([transaction]);
};
