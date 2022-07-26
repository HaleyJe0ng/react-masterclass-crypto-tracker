import styled from "styled-components";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

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

const CoinsList = styled.ul``;

const Img = styled.img`
  width: 32px;
  height: 32px;
  margin-right: 10px;
`;

const Coin = styled.li`
  background-color: white;
  color: ${(props) => props.theme.bgColor};
  margin-bottom: 10px;
  padding: 20px;
  border-radius: 15px;
  transition: color 0.3s ease-in-out;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: bold;

  &:hover {
    color: ${(props) => props.theme.accentColor};
  }
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

interface CoinInterface {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

//https://cryptoicons.org/api/:style/:currency/:size
//https://cryptoicons.org/api/icon/eth/200
//black, white, color, icon

function Coins() {
  const [coins, setCoins] = useState<CoinInterface[]>([]); //우리 state가 coin으로 된 array이다
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const response = await fetch("https://api.coinpaprika.com/v1/coins");
      const json = await response.json();

      setCoins(json.slice(0, 100));
      console.log(coins);
      setLoading(false);
    })(); // 내부에 코드를 짜면 바로 function이 실행됨!
  }, []);

  return (
    <Container>
      <Header>
        <Title>Coin</Title>
      </Header>
      {loading ? (
        <Loader>"Loading..."</Loader>
      ) : (
        <CoinsList>
          {coins.map((coin) => {
            return (
              <Link
                key={coin.id}
                to={`/${coin.id}`}
                state={{ name: coin.name }}
              >
                {/* react-router 6 */}
                <Coin key={coin.id}>
                  <Img
                    src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                  />
                  {coin.name} &rarr;
                </Coin>
              </Link>
            );
          })}
        </CoinsList>
      )}
    </Container>
  );
}

export default Coins;
function useEffects(arg0: () => void, arg1: never[]) {
  throw new Error("Function not implemented.");
}