import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  CalendarDays,
  Building2,
  IndianRupee,
  Package,
  TrendingUp,
  LoaderCircle,
} from "lucide-react";

const IPODetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [ipo, setIpo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getIPODetails = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch IPO data from your existing backend
        const response = await axios.get(
          `http://localhost:8000/api/ipo/${encodeURIComponent(slug)}`,
        );

        const selectedIPO = response.data.ipo;

        if (!selectedIPO) {
          setError("IPO details are unavailable.");
          return;
        }

        setIpo(selectedIPO);
      } catch (err) {
        console.error("Error fetching IPO details:", err);
        setError("Unable to load IPO details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getIPODetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="animate-spin" size={32} />
        <p className="ml-3">Loading IPO details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-blue-600"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!ipo) return null;

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

  const formatValue = (value) =>
    value === null || value === undefined || value === ""
      ? "Not available"
      : value;

  const details = [
    {
      label: "IPO Status",
      value: formatValue(ipo.status),
      icon: TrendingUp,
    },
    {
      label: "Exchange / Board",
      value: formatValue(ipo.board),
      icon: Building2,
    },
    {
      label: "Price Band",
      value:
        ipo.priceMin != null && ipo.priceMax != null
          ? `₹${ipo.priceMin} – ₹${ipo.priceMax}`
          : "Not announced",
      icon: IndianRupee,
    },
    {
      label: "Lot Size",
      value: ipo.lotSize != null ? `${ipo.lotSize} shares` : "Not announced",
      icon: Package,
    },
    {
      label: "Issue Size",
      value:
        ipo.issueSizeCr != null ? `₹${ipo.issueSizeCr} crore` : "Not announced",
      icon: IndianRupee,
    },
    {
      label: "Opening Date",
      value: formatDate(ipo.openDate),
      icon: CalendarDays,
    },
    {
      label: "Closing Date",
      value: formatDate(ipo.closeDate),
      icon: CalendarDays,
    },
    {
      label: "Last Reported Subscription",
      value: ipo.lastSubX != null ? `${ipo.lastSubX}x` : "Not available",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to IPOs
        </button>

        {/* IPO Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                {formatValue(ipo.status)}
              </span>

              <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                {ipo.name}
              </h1>

              <p className="mt-2 text-slate-500">
                {formatValue(ipo.board)} IPO
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-5 sm:min-w-48">
              <p className="text-sm text-slate-500">Price Band</p>

              <p className="mt-2 text-2xl font-bold text-blue-700">
                {ipo.priceMin != null && ipo.priceMax != null
                  ? `₹${ipo.priceMin} – ₹${ipo.priceMax}`
                  : "Not announced"}
              </p>
            </div>
          </div>
        </div>

        {/* IPO Information */}
        <div className="mt-6">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            IPO Information
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {details.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                      <Icon size={20} />
                    </div>

                    <p className="text-sm text-slate-500">{item.label}</p>
                  </div>

                  <p className="mt-4 break-words text-lg font-semibold text-slate-900">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* GMP Information */}
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-bold text-amber-900">
            Grey Market Premium (GMP)
          </h2>

          <p className="mt-2 text-amber-800">
            {ipo.lastGmp != null
              ? `Last reported GMP: ₹${ipo.lastGmp}`
              : "GMP information is currently unavailable."}
          </p>

          {ipo.lastGmpPct != null && (
            <p className="mt-1 text-sm text-amber-800">
              Reported GMP percentage: {ipo.lastGmpPct}%
            </p>
          )}

          <p className="mt-3 text-xs text-amber-700">
            GMP is unofficial, may be unreliable, and is not a guarantee of
            listing gains.
          </p>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-sm leading-6 text-slate-500">
          IPO information is provided for educational purposes only. Verify
          dates, price bands, and other details with official exchange filings
          and the company's prospectus before making investment decisions.
        </p>

        <p className="mt-3 text-xs text-slate-400">
          Market data provided by{" "}
          <a
            href="https://www.xflot.com/api-docs"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            Xflot
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default IPODetails;
