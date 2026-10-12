import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeftRight, GitCompareArrows } from "lucide-react";

const API_URL = "http://localhost:8000";

const CompareIPOs = () => {
  const [ipos, setIpos] = useState([]);
  const [ipo1, setIpo1] = useState("");
  const [ipo2, setIpo2] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIPOs = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch open and upcoming IPOs from your backend
        const [openResponse, upcomingResponse] = await Promise.all([
          axios.get(`${API_URL}/api/ipo`),
          axios.get(`${API_URL}/api/upcoming`),
        ]);

        const openIPOs = Array.isArray(openResponse.data)
          ? openResponse.data
          : openResponse.data.ipos || [];

        const upcomingIPOs = Array.isArray(upcomingResponse.data)
          ? upcomingResponse.data
          : upcomingResponse.data.ipos || [];

        // Combine both lists and remove duplicate IPOs
        const allIPOs = [
          ...new Map(
            [...openIPOs, ...upcomingIPOs].map((ipo) => [ipo.slug, ipo]),
          ).values(),
        ].filter((ipo) => ipo.slug);

        setIpos(allIPOs);

        if (allIPOs.length < 2) {
          setError("At least two different IPOs are required for comparison.");
        }
      } catch (err) {
        console.error("Error fetching IPOs:", err);
        setError("Unable to load IPOs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchIPOs();
  }, []);

  const firstIPO = ipos.find((ipo) => ipo.slug === ipo1);
  const secondIPO = ipos.find((ipo) => ipo.slug === ipo2);

  const formatDate = (date) => {
    if (!date) return "Not announced";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const formatPrice = (ipo) => {
    if (!ipo) return "—";

    if (ipo.priceMin == null || ipo.priceMax == null) {
      return "Not announced";
    }

    return `₹${ipo.priceMin} – ₹${ipo.priceMax}`;
  };

  const formatValue = (value, suffix = "") => {
    if (value == null || value === "") {
      return "Not available";
    }

    return `${value}${suffix}`;
  };

  const comparisonRows = [
    {
      label: "IPO Status",
      getValue: (ipo) => formatValue(ipo.status),
    },
    {
      label: "Board",
      getValue: (ipo) => formatValue(ipo.board),
    },
    {
      label: "Price Band",
      getValue: formatPrice,
    },
    {
      label: "Lot Size",
      getValue: (ipo) =>
        ipo.lotSize == null ? "Not announced" : `${ipo.lotSize} shares`,
    },
    {
      label: "Minimum Investment",
      getValue: (ipo) =>
        ipo.priceMax == null || ipo.lotSize == null
          ? "Not available"
          : `₹${ipo.priceMax * ipo.lotSize}`,
    },
    {
      label: "Issue Size",
      getValue: (ipo) =>
        ipo.issueSizeCr == null ? "Not available" : `₹${ipo.issueSizeCr} crore`,
    },
    {
      label: "Opening Date",
      getValue: (ipo) => formatDate(ipo.openDate),
    },
    {
      label: "Closing Date",
      getValue: (ipo) => formatDate(ipo.closeDate),
    },
    {
      label: "GMP",
      getValue: (ipo) =>
        ipo.lastGmp == null ? "Not available" : `₹${ipo.lastGmp}`,
    },
    {
      label: "GMP Percentage",
      getValue: (ipo) =>
        ipo.lastGmpPct == null ? "Not available" : `${ipo.lastGmpPct}%`,
    },
    {
      label: "Subscription",
      getValue: (ipo) =>
        ipo.lastSubX == null ? "Not available" : `${ipo.lastSubX}x`,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 flex justify-center">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
              <GitCompareArrows size={30} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Compare IPOs
          </h1>

          <p className="mt-3 text-slate-600">
            Compare important IPO details side by side.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="py-10 text-center text-slate-600">Loading IPOs...</p>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center text-amber-800">
            {error}
          </div>
        )}

        {/* Comparison */}
        {!loading && ipos.length >= 2 && (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* First IPO */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <label className="mb-3 block font-semibold text-slate-700">
                  Select First IPO
                </label>

                <select
                  value={ipo1}
                  onChange={(e) => setIpo1(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 outline-none focus:border-blue-500"
                >
                  <option value="">Choose an IPO</option>

                  {ipos.map((ipo) => (
                    <option key={ipo.slug} value={ipo.slug}>
                      {ipo.name}
                    </option>
                  ))}
                </select>

                {firstIPO && (
                  <div className="mt-5 rounded-xl bg-blue-50 p-4">
                    <h2 className="text-xl font-bold text-slate-900">
                      {firstIPO.name}
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                      {firstIPO.board || "Board not available"}
                    </p>
                  </div>
                )}
              </div>

              {/* Second IPO */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <label className="mb-3 block font-semibold text-slate-700">
                  Select Second IPO
                </label>

                <select
                  value={ipo2}
                  onChange={(e) => setIpo2(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 outline-none focus:border-blue-500"
                >
                  <option value="">Choose an IPO</option>

                  {ipos.map((ipo) => (
                    <option key={ipo.slug} value={ipo.slug}>
                      {ipo.name}
                    </option>
                  ))}
                </select>

                {secondIPO && (
                  <div className="mt-5 rounded-xl bg-purple-50 p-4">
                    <h2 className="text-xl font-bold text-slate-900">
                      {secondIPO.name}
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                      {secondIPO.board || "Board not available"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Comparison Table */}
            {firstIPO &&
              secondIPO &&
              (firstIPO.slug === secondIPO.slug ? (
                <div className="mt-6 rounded-xl bg-amber-50 p-4 text-center text-amber-800">
                  Please select two different IPOs.
                </div>
              ) : (
                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center gap-2 border-b border-slate-200 p-5">
                    <ArrowLeftRight className="text-blue-600" />

                    <h2 className="text-xl font-bold text-slate-900">
                      Comparison Results
                    </h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="p-4 text-sm font-semibold text-slate-700">
                            Feature
                          </th>

                          <th className="p-4 text-sm font-semibold text-blue-700">
                            {firstIPO.name}
                          </th>

                          <th className="p-4 text-sm font-semibold text-purple-700">
                            {secondIPO.name}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {comparisonRows.map((row) => (
                          <tr
                            key={row.label}
                            className="border-t border-slate-100"
                          >
                            <td className="whitespace-nowrap p-4 text-sm font-medium text-slate-700">
                              {row.label}
                            </td>

                            <td className="p-4 text-sm text-slate-600">
                              {row.getValue(firstIPO)}
                            </td>

                            <td className="p-4 text-sm text-slate-600">
                              {row.getValue(secondIPO)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
          </>
        )}

        {/* Disclaimer */}
        <div className="mt-8 text-sm leading-6 text-slate-500">
          <p>
            Data provided by{" "}
            <a
              href="https://www.xflot.com/api-docs"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              Xflot
            </a>
            . GMP is unofficial and is not a guarantee of listing gains. This
            comparison is for educational purposes only and is not investment
            advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompareIPOs;
