// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// import {
//   CalendarDays,
//   ChevronRight,
//   Package,
//   RefreshCw,
//   TrendingUp,
// } from "lucide-react";

// const UpcomingIPOs = () => {
//   const [ipos, setIpos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   const getUpcomingIPOs = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await axios.get(
//         "http://localhost:8000/api/ipo/upcoming"
//       );

//       setIpos(response.data.ipos || []);
//     } catch (err) {
//       console.error("Error fetching upcoming IPOs:", err);

//       setError("Unable to load upcoming IPOs.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getUpcomingIPOs();
//   }, []);

//   const formatDate = (date) => {
//     if (!date) return "To be announced";

//     return new Date(date).toLocaleDateString("en-IN", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//       timeZone: "UTC",
//     });
//   };

//   const formatPrice = (ipo) => {
//     if (ipo.priceMin == null || ipo.priceMax == null) {
//       return "To be announced";
//     }

//     return `₹${ipo.priceMin} – ₹${ipo.priceMax}`;
//   };

//   return (
// <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

//   {/* Header */}
//   <div className="mb-6 flex items-center justify-between gap-3">
//     <div>
//       <h2 className="text-xl font-bold text-slate-800">
//         Upcoming IPOs
//       </h2>

//       <p className="mt-1 text-sm text-slate-500">
//         Explore IPOs expected to open soon
//       </p>
//     </div>

//     <button
//       onClick={getUpcomingIPOs}
//       disabled={loading}
//       className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
//     >
//       <RefreshCw
//         size={15}
//         className={loading ? "animate-spin" : ""}
//       />

//       Refresh
//     </button>
//   </div>

//   {/* Loading */}
//   {loading && (
//     <p className="py-8 text-center text-slate-500">
//       Loading upcoming IPOs...
//     </p>
//   )}

//   {/* Error */}
//   {!loading && error && (
//     <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
//       {error}

//       <button
//         onClick={getUpcomingIPOs}
//         className="ml-2 font-semibold underline"
//       >
//         Try again
//       </button>
//     </div>
//   )}

//   {/* Empty State */}
//   {!loading && !error && ipos.length === 0 && (
//     <div className="rounded-xl bg-slate-50 p-8 text-center">
//       <CalendarDays
//         size={32}
//         className="mx-auto text-slate-400"
//       />

//       <p className="mt-3 font-semibold text-slate-700">
//         No upcoming IPOs found
//       </p>

//       <p className="mt-1 text-sm text-slate-500">
//         Check again later for newly announced IPOs.
//       </p>
//     </div>
//   )}

//   {/* IPO Cards */}
//   {!loading && !error && ipos.length > 0 && (
//     <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

//       {ipos.map((ipo) => (
//         <article
//           key={ipo.slug}
//           className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:shadow-md"
//         >
//           {/* Company */}
//           <div className="flex items-start gap-3">
//             <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
//               {ipo.name?.charAt(0)?.toUpperCase() || "I"}
//             </div>

//             <div className="min-w-0 flex-1">
//               <h3 className="font-semibold text-slate-800">
//                 {ipo.name}
//               </h3>

//               <p className="mt-1 text-xs text-slate-500">
//                 {ipo.board || "Board not announced"}
//               </p>
//             </div>

//             <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
//               Upcoming
//             </span>
//           </div>

//           {/* Price Band */}
//           <div className="mt-5 rounded-lg bg-slate-50 p-3">
//             <p className="text-xs text-slate-500">
//               Price Band
//             </p>

//             <p className="mt-1 text-lg font-bold text-slate-800">
//               {formatPrice(ipo)}
//             </p>
//           </div>

//           {/* Dates */}
//           <div className="mt-4 grid grid-cols-2 gap-4">
//             <div>
//               <div className="flex items-center gap-1.5 text-xs text-slate-500">
//                 <CalendarDays size={14} />
//                 Opens
//               </div>

//               <p className="mt-1 text-sm font-medium text-slate-700">
//                 {formatDate(ipo.openDate)}
//               </p>
//             </div>

//             <div>
//               <div className="flex items-center gap-1.5 text-xs text-slate-500">
//                 <CalendarDays size={14} />
//                 Closes
//               </div>

//               <p className="mt-1 text-sm font-medium text-slate-700">
//                 {formatDate(ipo.closeDate)}
//               </p>
//             </div>
//           </div>

//           {/* Additional Details */}
//           <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">

//             <div className="flex items-center gap-2 text-sm text-slate-600">
//               <Package size={16} />

//               <span>
//                 Lot size: {ipo.lotSize ?? "Not announced"}
//               </span>
//             </div>

//             {ipo.issueSizeCr != null && (
//               <div className="flex items-center gap-1 text-sm text-slate-600">
//                 <TrendingUp size={15} />

//                 <span>
//                   ₹{Number(ipo.issueSizeCr).toLocaleString("en-IN")} Cr
//                 </span>
//               </div>
//             )}

//           </div>

//           {/* Details Button */}
//           <button
//             onClick={() => {
//               if (ipo.slug) {
//                 navigate(`/ipo/${ipo.slug}`);
//               }
//             }}
//             disabled={!ipo.slug}
//             className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             View Details

//             <ChevronRight size={16} />
//           </button>
//         </article>
//       ))}

//     </div>
//   )}

//   {/* Attribution and Disclaimer */}
//   <p className="mt-5 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-400">
//     Data source:{" "}
//     <a
//       href="https://www.xflot.com/"
//       target="_blank"
//       rel="noreferrer"
//       className="text-blue-500 hover:underline"
//     >
//       Xflot
//     </a>
//     . IPO dates and price bands may change. Data may be delayed or
//     incomplete. This information is for educational purposes only,
//     not investment advice.
//   </p>

// </section>
//   );
// };

// export default UpcomingIPOs;
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  RefreshCw,
  CalendarDays,
  Package,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

const UpcomingIpos = () => {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Format IPO price
  const formatPrice = (ipo) => {
    if (ipo.priceMin == null || ipo.priceMax == null) {
      return "Not announced";
    }

    if (ipo.priceMin === ipo.priceMax) {
      return `₹${ipo.priceMin.toLocaleString("en-IN")}`;
    }

    return `₹${ipo.priceMin.toLocaleString("en-IN")} - ₹${ipo.priceMax.toLocaleString("en-IN")}`;
  };

  // Format IPO date
  const formatDate = (date) => {
    if (!date) return "Not announced";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not announced";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  // Fetch upcoming IPOs
  const fetchIpos = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:8000/api/upcoming"
      );

      setIpos(response.data.ipos || []);
    } catch (error) {
      console.error(
        "Error fetching IPOs:",
        error.response?.data || error.message
      );

      setError("Unable to load IPOs. Please try again later.");
      setIpos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIpos();
  }, [fetchIpos]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Upcoming IPOs
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Explore IPOs expected to open soon
          </p>
        </div>

        <button
          onClick={fetchIpos}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="py-8 text-center text-slate-500">
          Loading upcoming IPOs...
        </p>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}

          <button
            onClick={fetchIpos}
            className="ml-2 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && ipos.length === 0 && (
        <div className="rounded-xl bg-slate-50 p-8 text-center">
          <CalendarDays
            size={32}
            className="mx-auto text-slate-400"
          />

          <p className="mt-3 font-semibold text-slate-700">
            No upcoming IPOs found
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Check again later for newly announced IPOs.
          </p>
        </div>
      )}

      {/* IPO Cards */}
      {!loading && !error && ipos.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {ipos.map((ipo) => (
            <article
              key={ipo.id || ipo.slug}
              className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:shadow-md"
            >
              {/* Company */}
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
                  {ipo.name?.charAt(0)?.toUpperCase() || "I"}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-800">
                    {ipo.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {ipo.board || "Board not announced"}
                  </p>
                </div>

                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                  Upcoming
                </span>
              </div>

              {/* Price Band */}
              <div className="mt-5 rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">
                  Price Band
                </p>

                <p className="mt-1 text-lg font-bold text-slate-800">
                  {formatPrice(ipo)}
                </p>
              </div>

              {/* Dates */}
              <div className="mt-4 grid grid-cols-2 gap-4">
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
              </div>

              {/* Additional Details */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Package size={16} />

                  <span>
                    Lot size: {ipo.lotSize ?? "Not announced"}
                  </span>
                </div>

                {ipo.issueSizeCr != null && (
                  <div className="flex items-center gap-1 text-sm text-slate-600">
                    <TrendingUp size={15} />

                    <span>
                      ₹
                      {Number(ipo.issueSizeCr).toLocaleString("en-IN")}
                      {" "}Cr
                    </span>
                  </div>
                )}
              </div>

              {/* GMP */}
              <div className="mt-4 rounded-lg bg-amber-50 p-3">
                <p className="text-xs text-amber-700">
                  Grey Market Premium (Unofficial)
                </p>

                <p className="mt-1 font-semibold text-amber-900">
                  {ipo.lastGmp == null
                    ? "Not available"
                    : `₹${ipo.lastGmp.toLocaleString("en-IN")}`}
                </p>

                {ipo.gmpDisputed && (
                  <p className="mt-1 text-xs text-red-600">
                    GMP reports are disputed.
                  </p>
                )}
              </div>

              {/* Details Button */}
              <button
                onClick={() => navigate(`/ipo/${ipo.slug}`)}
                disabled={!ipo.slug}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                View Details
                <ChevronRight size={16} />
              </button>
            </article>
          ))}
        </div>
      )}

      {/* Attribution and Disclaimer */}
      <div className="mt-5 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-400">
        <p>
          Data source:{" "}
          <a
            href="https://www.xflot.com/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:underline"
          >
            Xflot
          </a>
          . IPO dates and price bands may change. Data may be delayed
          or incomplete.
        </p>

        <p className="mt-2">
          GMP is unofficial and unverifiable, and is not published by
          any exchange or regulator. This information is for educational
          purposes only, not investment advice.
        </p>
      </div>
    </section>
  );
};

export default UpcomingIpos;