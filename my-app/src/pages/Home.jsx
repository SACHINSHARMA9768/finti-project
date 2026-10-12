import PopularIPOs from "../components/Popular.jsx";
import UpcomingIPOs from "../components/UpcomingIpos.jsx";
import Header from "../components/Header.jsx";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
      <Header />

      <main className="mx-auto min-h-screen max-w-7xl p-6">
        <PopularIPOs />

        <div className="mt-8">
          <UpcomingIPOs />
        </div>
      </main>
    </div>
  );
};

export default Home;