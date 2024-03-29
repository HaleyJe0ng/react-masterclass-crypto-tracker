import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  useLocation,
  Navigate,
  Route,
  Routes,
  Link,
  useMatch,
  Outlet,
} from "react-router-dom";
import styled from "styled-components";
import Price from "./Price";
import Chart from "./Chart";
import { fetchInfoData, fetchPriceData } from "../api";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 25px;
  font-weight: bold;
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${(props) => props.theme.textBgColor};
  padding: 10px 20px;
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: ${(props) => props.theme.textBgColor};
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

type Params = {
  coinId: string;
};

interface ILocationState {
  state: {
    name: string;
    rank: number;
  };
}

/*
예제처럼  
    interface LocationState{
        name: string;
    } 
    const { state } = useLocation<LocationState>(); 
따라치면   //state가 unknown이다! 에러난다!! 
  */

interface IInfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface IQuotes {
  ath_date: string;
  ath_price: number;
  market_cap: number;
  market_cap_change_24h: number;
  percent_change_1h: number;
  percent_change_1y: number;
  percent_change_6h: number;
  percent_change_7d: number;
  percent_change_12h: number;
  percent_change_15m: number;
  percent_change_24h: number;
  percent_change_30d: number;
  percent_change_30m: number;
  percent_from_price_ath: number;
  price: number;
  volume_24h: number;
  volume_24h_change_24h: number;
}

interface IPriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: IQuotes;
}

function Coin() {
  const [loading, setLoading] = useState<boolean>(true);
  const { coinId } = useParams<Params>();
  const { state } = useLocation() as ILocationState;
  const [info, setInfo] = useState<IInfoData>();
  const [priceInfo, setPriceInfo] = useState<IPriceData>();
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");

  const redirectHome = () => {
    //만약 state가 존재하지 않으면 다시 root로 이동시켜라
    return <Navigate to="/" replace />;
  };

  useEffect(() => {
    (async () => {
      const infoData = await fetchInfoData(coinId ?? "");
      const priceData = await fetchPriceData(coinId ?? "");

      setInfo(infoData);
      setPriceInfo(priceData);
      setLoading(false);
    })();
  }, []);

  return (
    <Container>
      <Header>
        <Title>{state?.name.toUpperCase() ?? redirectHome()}</Title>
        {/* 만약 state가 존재하면 state.name을 가져오고 state가 존재하지 않으면 Loading을 출력해라 */}
      </Header>
      {loading ? (
        <Loader>"Loading..."</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{info?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${info?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Open Source:</span>
              <span>{info?.open_source ? "Yes" : "No"}</span>
            </OverviewItem>
          </Overview>
          <Description>{info?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{priceInfo?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{priceInfo?.max_supply}</span>
            </OverviewItem>
          </Overview>
          <div>
            <Tabs>
              <Tab isActive={chartMatch !== null}>
                {/* 만약 이 URL에 들어와있다면 object를 전달받고, 이 URL에 들어와있지 않으면 null을 전달받는다. */}
                <Link to={`/${coinId}/chart`} state={{ name: state?.name }}>
                  {/* state 전해주지 않으면 redirectHome()이 실행된다 */}
                  Chart
                </Link>
              </Tab>
              <Tab isActive={priceMatch !== null}>
                <Link to={`/${coinId}/price`} state={{ name: state?.name }}>
                  Price
                </Link>
              </Tab>
            </Tabs>
            <Outlet />
          </div>
        </>
      )}
    </Container>
  );
}

export default Coin;
