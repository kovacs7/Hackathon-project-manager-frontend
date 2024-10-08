import Faqs from "../components/Home/Faqs";
import Features from "../components/Home/Features";
import Footer from "../components/Home/Footer";
import Hero from "../components/Home/Hero";
import NavBar from "../components/NavBar/NavBar";
import { useEffect } from "react";
import useAccountData from "../store/authStore";
import Project from "../components/Dashboard/Project";
import Loading from "../components/Home/Loading";

const Home = () => {
  const { data, getAccountData } = useAccountData();
  useEffect(() => {
    getAccountData();
  }, [getAccountData]);
  return (
    <>
      <NavBar />
      {data ? (
        Object.keys(data).length === 0 ? (
          <Loading />
        ) : (
          <>
            <Project />
          </>
        )
      ) : (
        <>
          <Hero />
          <Features />
          <Faqs />
          <Footer />
        </>
      )}
    </>
  );
};

export default Home;
