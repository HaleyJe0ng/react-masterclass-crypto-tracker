import styled from "styled-components";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchCoins } from "../api";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";

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
  color: ${(props) => props.theme.mainTextColor};
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

interface ICoin {
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
  const [coins, setCoins] = useState<ICoin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const isDark = useRecoilValue(isDarkAtom);
  const setterFn = useSetRecoilState(isDarkAtom);

  useEffect(() => {
    (async () => {
      const response = await fetchCoins();

      console.log("response.slice(0, 100)", response.slice(0, 100));
      setCoins(response.slice(0, 100));
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    return () => setLoading(false); // cleanup function을 이용
  }, []);

  const toggelDarkAtom = () => {
    setterFn((prev) => !prev);
  };

  return (
    <Container>
      <Header>
        <Title>Coin</Title>
        <button onClick={toggelDarkAtom}>Toggle Mode</button>
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
