import { useEffect, useState } from "react";
import axios from "axios";
import {
  Flame,
  ChevronRight,
  CalendarDays,
  IndianRupee,
  Package,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

const PopularIPOs = () => {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getPopularIPOs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("http://localhost:8000/api/ipo");
      console.log("popular ipos", response.data);
      const openIpos = (response.data.ipos || [])
        .filter((ipo) => ipo.status === "OPEN")
        .sort((a, b) => (b.lastSubX ?? -1) - (a.lastSubX ?? -1));

      setIpos(openIpos);
    } catch (error) {
      console.error("Error fetching IPOs:", error);
      setError("Unable to load IPO data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPopularIPOs();
  }, []);

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const formatPrice = (ipo) => {
    if (ipo.priceMin == null || ipo.priceMax == null) {
      return "Not available";
    }

    return `₹${ipo.priceMin} – ₹${ipo.priceMax}`;
  };

  const formatIssueSize = (size) => {
    if (size == null) return "Not available";

    return `₹${Number(size).toLocaleString("en-IN")} Cr`;
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-orange-50 p-2">
            <Flame size={22} className="text-orange-500" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800">Open IPOs</h2>

            <p className="text-sm text-slate-500">
              Explore currently open IPOs
            </p>
          </div>
        </div>

        <button
          onClick={getPopularIPOs}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-10 text-center text-slate-500">
          Loading live IPO data...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
          <p>{error}</p>

          <button
            onClick={getPopularIPOs}
            className="mt-3 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && ipos.length === 0 && (
        <div className="rounded-xl bg-slate-50 p-6 text-center">
          <p className="font-medium text-slate-700">No open IPOs found.</p>

          <p className="mt-1 text-sm text-slate-500">
            Check again later for new IPOs.
          </p>
        </div>
      )}

      {/* IPO Cards */}
      {!loading && !error && ipos.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {ipos.map((ipo) => (
            <article
              key={ipo.slug}
              className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:shadow-md"
            >
              {/* Company */}
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
                  {ipo.name?.charAt(0)?.toUpperCase() || "I"}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-800">
                    {ipo.name || "Unnamed IPO"}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {ipo.board || "Board not available"}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  {ipo.status || "OPEN"}
                </span>
              </div>

              {/* Price */}
              <div className="mb-4 rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Price Band</p>

                <p className="mt-1 text-lg font-bold text-slate-800">
                  {formatPrice(ipo)}
                </p>
              </div>

              {/* IPO Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays size={14} />
                    Opens
                  </div>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {formatDate(ipo.openDate)}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays size={14} />
                    Closes
                  </div>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {formatDate(ipo.closeDate)}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Package size={14} />
                    Lot Size
                  </div>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {ipo.lotSize ?? "Not available"}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <IndianRupee size={14} />
                    Issue Size
                  </div>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {formatIssueSize(ipo.issueSizeCr)}
                  </p>
                </div>
              </div>

              {/* Subscription */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-600" />

                  <span className="text-sm text-slate-500">Subscription</span>
                </div>

                <span className="font-semibold text-emerald-600">
                  {ipo.lastSubX != null ? `${ipo.lastSubX}x` : "Not available"}
                </span>
              </div>

              {/* Footer */}
              <button
                type="button"
                onClick={() => {
                  alert(
                    `IPO: ${ipo.name}\nPrice: ${formatPrice(ipo)}\nStatus: ${ipo.status}`,
                  );
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                View Details
                <ChevronRight size={16} />
              </button>
            </article>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-5 border-t border-slate-100 pt-3">
        <p className="text-xs leading-5 text-slate-400">
          Data source:{" "}
          <a
            href="https://www.xflot.com/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:underline"
          >
            Xflot
          </a>
          . Market data may be delayed or inaccurate. Subscription and grey
          market premium figures are not guarantees of listing performance. This
          information is for educational purposes only.
        </p>
      </div>
    </section>
  );
};

export default PopularIPOs;
