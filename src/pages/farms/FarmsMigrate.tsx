import React, { useEffect, useRef, useState, useContext } from 'react';
import QuestionMark from '~components/farm/QuestionMark';
import { Checkbox, CheckboxSelected } from '~components/icon';
import {
  GradientButton,
  ButtonTextWrapper,
  GreenConnectToNearBtn,
} from '~components/button/Button';
import {
  getRewards,
  get_list_user_seeds,
  getBoostSeeds,
  Seed,
  getBoostTokenPrices,
  migrate_user_seed,
} from '~services/farm';
import { withdrawAllReward } from '~services/m-token';
import {
  formatWithCommas,
  toReadableNumber,
  toInternationalCurrencySystem,
} from '~utils/numbers';
import { ArrowLeftIcon, MigrateIcon } from '~components/icon/FarmBoost';
import { useTokens } from '~state/token';
import ReactTooltip from 'react-tooltip';
import { toRealSymbol } from '~utils/token';
import { ftGetTokenMetadata, TokenMetadata } from '~services/ft-contract';
import { Link, useHistory, useLocation } from 'react-router-dom';
import _ from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';
import { BigNumber } from 'bignumber.js';
import { getPoolIdBySeedId } from '~components/farm/FarmsHome';
import { getCurrentWallet, WalletContext } from '../../utils/sender-wallet';
import { PoolRPCView } from '~services/api';
import Loading from '~components/layout/Loading';
export default function FarmsMigrate() {
  const [user_migrate_seeds, set_user_migrate_seeds] = useState([]);
  const [user_claimed_rewards, set_user_claimed_rewards] = useState({});
  const [all_token_price_list, set_all_token_price_list] = useState({});
  const [seed_loading, set_seed_loading] = useState(true);
  const [rewards_loading, set_rewards_loading] = useState(true);
  const { globalState } = useContext(WalletContext);
  const isSignedIn = globalState.isSignedIn;
  const history = useHistory();
  const goBacktoFarms = () => {
    const from = new URLSearchParams(location.search).get('from');
    if (from == 'v2') {
      history.push('/farmsBoost');
    } else {
      history.push('/farms');
    }
  };
  useEffect(() => {
    if (isSignedIn) {
      get_user_seeds();
      get_user_claimed_rewards();
      get_price_list();
    }
  }, []);

  async function get_user_seeds() {
    const userMigrateSeeds: MigrateSeed[] = [];
    if (isSignedIn) {
      const result_old: Record<string, string> = await get_list_user_seeds({});
      const result_new: Record<string, any> = await getBoostSeeds();
      const { seeds, pools } = result_new;
      Object.keys(result_old).forEach((seedId: string) => {
        const poolId = getPoolIdBySeedId(seedId);
        const boostFarmHasSamePool = seeds.find((seed: Seed) => {
          const id = getPoolIdBySeedId(seed.seed_id);
          if (poolId == id) return true;
        });
        if (boostFarmHasSamePool) {
          // can migrate
          const pool = pools.find((p: PoolRPCView) => {
            if (p.id == +poolId) return true;
          });
          userMigrateSeeds.push({
            seed_id: seedId,
            amount: result_old[seedId],
            pool,
          });
        }
      });
      set_user_migrate_seeds(userMigrateSeeds);
    }
    set_seed_loading(false);
  }
  async function get_user_claimed_rewards() {
    const rewards = await getRewards({});
    const tempMap = {};
    Object.entries(rewards).forEach((item) => {
      const [key, v] = item;
      if (v !== '0') {
        tempMap[key] = v;
      }
    });
    set_user_claimed_rewards(tempMap);
    set_rewards_loading(false);
  }
  async function get_price_list() {
    const tokenPriceList = await getBoostTokenPrices();
    set_all_token_price_list(tokenPriceList);
  }
  function goBoostFarmPage() {
    history.push('/farmsBoost');
  }
  const noData =
    user_migrate_seeds.length == 0 &&
    Object.keys(user_claimed_rewards).length == 0 &&
    !seed_loading &&
    !rewards_loading;

  if (isSignedIn && (seed_loading || rewards_loading))
    return <Loading></Loading>;
  return (
    <div className={`m-auto lg:w-580px md:w-5/6 xs:w-11/12 xs:-mt-4 md:-mt-4`}>
      <div className="breadCrumbs flex items-center text-farmText text-base hover:text-white">
        <ArrowLeftIcon onClick={goBacktoFarms} className="cursor-pointer" />
        <label className="cursor-pointer" onClick={goBacktoFarms}>
          <FormattedMessage id="farms" />
        </label>
      </div>
      <div className="instruction flex justify-between items-center mt-10">
        <MigrateIcon className="flex-shrink-0 mr-4"></MigrateIcon>
        {!isSignedIn ? (
          <GreenConnectToNearBtn className="mt-6 ml-16"></GreenConnectToNearBtn>
        ) : (
          <>
            {noData ? (
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-lightGreenColor">
                  No Farm need to Migrate
                </span>
                <GradientButton
                  onClick={goBoostFarmPage}
                  color="#fff"
                  className={`mt-8 px-10 h-8 text-center text-lg text-white focus:outline-none font-semibold`}
                  backgroundImage="linear-gradient(270deg, #7F43FF 0%, #00C6A2 97.06%)"
                >
                  <ButtonTextWrapper
                    loading={false}
                    Text={() => <FormattedMessage id="go_to_new_farm" />}
                  />
                </GradientButton>
              </div>
            ) : (
              <div>
                <span className="text-2xl font-bold text-lightGreenColor">
                  V2 New Farm Migration
                </span>
                <p className="text-base text-white mt-4">
                  V2 Farm will support boost farm for the LOVE token stakers.
                  Meanwhile, the V1 farm rewards will stop at 1. July,2022.
                  Please migrate your farms and withdraw your rewards.
                </p>
              </div>
            )}
          </>
        )}
      </div>
      {!isSignedIn ? null : (
        <>
          {user_migrate_seeds.length > 0 ? (
            <div className="migratSeedBox bg-cardBg rounded-2xl p-5 mt-8">
              {user_migrate_seeds.map(
                (migrateSeed: MigrateSeed, index: number) => {
                  return (
                    <MigrateLineBox
                      migrateSeed={migrateSeed}
                      key={index}
                    ></MigrateLineBox>
                  );
                }
              )}
            </div>
          ) : seed_loading ? (
            <div className="flex items-center justify-center bg-cardBg rounded-2xl p-5 mt-8 text-white text-base">
              Loading ...
            </div>
          ) : null}

          {Object.keys(user_claimed_rewards).length > 0 &&
          Object.keys(all_token_price_list).length ? (
            <div className="withDrawBox bg-cardBg rounded-2xl p-5 mt-3">
              <WithDrawBox
                userRewardList={user_claimed_rewards}
                tokenPriceList={all_token_price_list}
              ></WithDrawBox>
            </div>
          ) : rewards_loading ? (
            <div className="flex items-center justify-center bg-cardBg rounded-2xl p-5 mt-8 text-white text-base">
              Loading ...
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
function MigrateLineBox(props: { migrateSeed: MigrateSeed }) {
  const { pool, seed_id, amount } = props.migrateSeed;
  const { id, token_account_ids } = pool;
  const [migrateLoading, setMigrateLoading] = useState(false);
  const tokens = useTokens(token_account_ids);
  function doMigrate() {
    setMigrateLoading(true);
    migrate_user_seed({ seed_id, amount, poolId: id.toString() });
  }
  if (!tokens || tokens.length < 2) return null;
  function getImages() {
    const images = tokens.map((token, index) => {
      const { icon, id } = token;
      if (icon)
        return (
          <img
            key={id + index}
            className={
              'h-9 w-9 rounded-full border border-gradientFromHover bg-cardBg ' +
              (index != 0 ? '-ml-1.5' : '')
            }
            src={icon}
          />
        );
      return (
        <div
          key={id + index}
          className={
            'h-9 w-9 rounded-full bg-cardBg border border-gradientFromHover ' +
            (index == 1 ? '-ml-1.5' : '')
          }
        />
      );
    });
    return images;
  }
  function getSymbols() {
    const symbols = tokens.map((token, index) => {
      const { symbol } = token;
      const hLine = index === tokens.length - 1 ? '' : '-';
      return (
        <span className="text-sm text-white" key={index}>{`${toRealSymbol(
          symbol
        )}${hLine}`}</span>
      );
    });
    return symbols;
  }
  return (
    <div className="flex items-center justify-between my-6">
      <div className="flex items-center">
        <div className="flex items-center">{getImages()}</div>
        <div className="flex items-center ml-3">{getSymbols()}</div>
      </div>
      <div className="flex justify-center items-center">
        <GradientButton
          color="#fff"
          className={`w-36 h-9 text-center text-base text-white focus:outline-none font-semibold`}
          onClick={doMigrate}
          loading={migrateLoading}
        >
          <div>
            <ButtonTextWrapper
              loading={migrateLoading}
              Text={() => (
                <FormattedMessage id="migrate" defaultMessage="Migrate" />
              )}
            />
          </div>
        </GradientButton>
      </div>
    </div>
  );
}
function WithDrawBox(props: { userRewardList: any; tokenPriceList: any }) {
  const { userRewardList, tokenPriceList } = props;
  const [rewardList, setRewardList] = useState<Record<string, any>>({});
  const [checkedList, setCheckedList] = useState<Record<string, any>>({});
  const [selectAll, setSelectAll] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState<boolean>(false);
  const rewardRef = useRef(null);
  const intl = useIntl();
  const withdrawNumber = 5;
  useEffect(() => {
    if (
      Object.keys(userRewardList).length &&
      Object.keys(tokenPriceList).length
    ) {
      const tempList = Object.keys(userRewardList).map(async (key: string) => {
        const rewardToken = await ftGetTokenMetadata(key);
        const price = tokenPriceList[key]?.price;
        return {
          tokenId: key,
          rewardToken,
          price,
          number: userRewardList[key],
        };
      });
      Promise.all(tempList).then((list) => {
        const tempRewardList = {};
        list.forEach((item: any) => {
          tempRewardList[item.tokenId] = item;
        });
        setRewardList(tempRewardList);
      });
    }
  }, [Object.keys(userRewardList).length, Object.keys(tokenPriceList).length]);
  function valueOfWithDrawLimitTip() {
    const tip = intl.formatMessage({ id: 'over_tip' });
    let result: string = `<div class="text-navHighLightText text-xs w-52 text-left">${tip}</div>`;
    return result;
  }
  function displaySinglePrice(price: string) {
    let displayPrice = '$-';
    if (price && price != 'N/A') {
      if (new BigNumber('0.01').isGreaterThan(price)) {
        displayPrice = '<$0.01';
      } else {
        displayPrice = `$${toInternationalCurrencySystem(price.toString(), 2)}`;
      }
    }
    return displayPrice;
  }
  function displayTotalPrice(item: any) {
    const { rewardToken, number, price } = item;
    let resultTotalPrice = '0';
    if (price && price != 'N/A') {
      const totalPrice = new BigNumber(price).multipliedBy(
        toReadableNumber(rewardToken.decimals, number)
      );
      if (new BigNumber('0.01').isGreaterThan(totalPrice)) {
        resultTotalPrice = '<$0.01';
      } else {
        resultTotalPrice = `$${toInternationalCurrencySystem(
          totalPrice.toString(),
          2
        )}`;
      }
    }
    return resultTotalPrice;
  }
  function displayWithDrawTokenNumber(item: any) {
    const { rewardToken, number } = item;
    const tokenNumber = toReadableNumber(rewardToken.decimals, number);
    let resultDisplay = '';
    if (new BigNumber('0.001').isGreaterThan(tokenNumber)) {
      resultDisplay = '<0.001';
    } else {
      resultDisplay = formatWithCommas(
        new BigNumber(tokenNumber).toFixed(3, 1).toString()
      );
    }
    return resultDisplay;
  }
  function clickCheckBox(tokenId: string) {
    if (checkedList[tokenId]) {
      delete checkedList[tokenId];
      if (selectAll) {
        setSelectAll(false);
      }
    } else if (Object.keys(checkedList).length < withdrawNumber) {
      checkedList[tokenId] = { value: rewardList[tokenId].number };
      if (
        Object.keys(checkedList).length ==
        Math.min(withdrawNumber, Object.keys(rewardList).length)
      ) {
        setSelectAll(true);
      }
    }
    setCheckedList(JSON.parse(JSON.stringify(checkedList)));
  }
  function clickAllCheckBox() {
    const status = !selectAll;
    const checkedList = {};
    if (status) {
      const allAtOneTime = Object.entries(rewardList).slice(0, withdrawNumber);
      allAtOneTime.forEach(([key, value]) => {
        checkedList[key] = value.number;
      });
    }
    setCheckedList(checkedList);
    setSelectAll(status);
    rewardRef.current.scrollTop = 0;
  }
  async function doWithDraw() {
    setWithdrawLoading(true);
    const keys = Object.keys(checkedList);
    const handleMap = {};
    keys.map((key, index) => {
      handleMap[key] = {
        index,
        value: checkedList[key],
      };
    });
    withdrawAllReward(handleMap);
  }
  return (
    <div className="flex flex-col">
      <div
        className={`pl-3 pr-6 max-h-96 overflow-auto pt-5 px-5 xs:px-3 md:px-3`}
        ref={rewardRef}
      >
        {Object.values(rewardList).map((item) => {
          return (
            <div
              className="flex justify-between py-3.5 select-none"
              key={item.tokenId}
            >
              <div className="flex items-center text-sm text-white">
                <div
                  className="mr-3 cursor-pointer"
                  onClick={() => {
                    clickCheckBox(item.tokenId);
                  }}
                >
                  {checkedList[item.tokenId] ? (
                    <CheckboxSelected></CheckboxSelected>
                  ) : (
                    <Checkbox></Checkbox>
                  )}
                </div>
                <img
                  src={item.rewardToken.icon}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div className="flex flex-col">
                  <label className="text-sm text-white">
                    {toRealSymbol(item.rewardToken.symbol)}
                  </label>
                  <label className="text-primaryText text-xs">
                    {displaySinglePrice(item.price)}
                  </label>
                </div>
              </div>
              <div className="flex flex-col text-right">
                <label className="text-sm text-white">
                  {displayWithDrawTokenNumber(item)}
                </label>
                <label className="text-primaryText text-xs">
                  {displayTotalPrice(item)}
                </label>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center pt-4 pb-3 pl-3 pr-6 select-none">
        <div className="flex items-center text-primaryText">
          <label className="mr-3 cursor-pointer" onClick={clickAllCheckBox}>
            {selectAll ? (
              <CheckboxSelected></CheckboxSelected>
            ) : (
              <Checkbox></Checkbox>
            )}
          </label>
          {Object.keys(rewardList).length > withdrawNumber ? (
            <div className="flex items-center ">
              <label className="mr-1 text-xs">
                <FormattedMessage id="all_5_v2" />
              </label>
              <div
                className="text-white text-right ml-1"
                data-class="reactTip"
                data-for="selectAllId"
                data-place="top"
                data-html={true}
                data-tip={valueOfWithDrawLimitTip()}
              >
                <QuestionMark></QuestionMark>
                <ReactTooltip
                  id="selectAllId"
                  backgroundColor="#1D2932"
                  border
                  borderColor="#7e8a93"
                  effect="solid"
                />
              </div>
            </div>
          ) : (
            <label className="text-xs">
              <FormattedMessage id="all" />
            </label>
          )}
        </div>
        <div className="flex justify-center items-center">
          <GradientButton
            color="#fff"
            className={`w-36 h-9 text-center text-base text-white focus:outline-none font-semibold ${
              Object.keys(checkedList).length == 0 ? 'opacity-40' : ''
            }`}
            onClick={doWithDraw}
            disabled={Object.keys(checkedList).length == 0}
            btnClassName={
              Object.keys(checkedList).length == 0 ? 'cursor-not-allowed' : ''
            }
            loading={withdrawLoading}
          >
            <div>
              <ButtonTextWrapper
                loading={withdrawLoading}
                Text={() => (
                  <FormattedMessage id="withdraw" defaultMessage="Withdraw" />
                )}
              />
            </div>
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
interface MigrateSeed {
  seed_id: string;
  amount: string;
  pool: PoolRPCView;
}
