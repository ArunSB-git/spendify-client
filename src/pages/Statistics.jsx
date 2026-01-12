import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer
} from "recharts";

/* 🔹 MUI Icons */
import AddCircleIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CreateIcon from '@mui/icons-material/UpgradeSharp';
import DeleteIcon from '@mui/icons-material/DeleteOutlineSharp';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineSharp';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import EditIcon from '@mui/icons-material/Edit';






/* 🔹 Sample chart data */
const sampleLineData = [
  { month: "JAN 2026", Salary: 1200, Bonus: 500 },
  { month: "FEB 2026", Salary: 1500, Bonus: 800 },
  { month: "MAR 2026", Salary: 1700, Bonus: 700 },
  { month: "APR 2026", Salary: 1600, Bonus: 600 }
];

const samplePieData = [
  { name: "Not Loading", value: 400 }
];

const sampleBarData = [
  { month: "JAN 2026", Planned: 1200, Actual: 1300 },
  { month: "FEB 2026", Planned: 1400, Actual: 1350 },
  { month: "MAR 2026", Planned: 1600, Actual: 1500 },
  { month: "APR 2026", Planned: 1700, Actual: 1800 }
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ITEMS_PER_PAGE = 8;

/* 🔹 Generate consistent colors */
function stringToColor(str, theme) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  const s = 70;
  const l = theme === "light" ? 50 : 30;
  return `hsl(${h},${s}%,${l}%)`;
}

const getAmountColor = (action) => {
  switch (action) {
    case "Created a new transaction":
      return "green";

    case "Amount for this transaction has been updated":
      return "#DAA520";

    case "Added money to this existing transaction":
      return "#1976d2";

    case "DELETE":
      return "red";

    default:
      return "gray";
  }
};


/* 🔹 Action icon mapper */
const getActionIcon = (action) => {
  switch (action) {
    case "Created a new transaction":
      return <AddBoxOutlinedIcon sx={{ color: "green" }} />;

    case "Amount for this transaction has been updated":
      return <EditIcon sx={{ color: "#DAA520" }} />;

    case "Added money to this existing transaction": // ✅ 4th case
      return <CreateIcon sx={{ color: "#1976d2" }} />; // blue add icon

    case "Transaction was deleted":
      return <DeleteIcon sx={{ color: "red" }} />;

    default:
      return <HelpOutlineIcon sx={{ color: "gray" }} />;
  }
};


export default function Statistics({ theme, toggleTheme }) {

const [pieData, setPieData] = useState(samplePieData);
  const [barData] = useState(sampleBarData);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
// 🔹 Pie filters
const currentDate = new Date();
const [pieType, setPieType] = useState("MONTH");

  /* 🔹 Pagination state */
  const [currentPage, setCurrentPage] = useState(1);

  const [lineData, setLineData] = useState([]);
const [lineKeys, setLineKeys] = useState([]);

const [lineTxnType, setLineTxnType] = useState("CREDIT");
const [varianceData, setVarianceData] = useState([]);


useEffect(() => {
  const year = new Date().getFullYear();

  fetch(`${API_BASE_URL}/api/transactions/yearly-credit-debit-amount?year=${year}`, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      const months = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
      ];

      const formatted = data.map(item => ({
        month: months[item.month - 1],
        Credit: item.creditAmount,
        Debit: item.debitAmount
      }));

      setVarianceData(formatted);
    })
    .catch(console.error);
}, []);


useEffect(() => {
  const year = new Date().getFullYear();

  fetch(
    `${API_BASE_URL}/api/transactions/yearly-summary?year=${year}&transactionType=${lineTxnType}`,
    {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    }
  )
    .then(res => res.json())
    .then(apiData => {
      const months = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
      ];

      const allKeys = new Set();
      const formatted = apiData.map(item => {
        const row = {
          month: `${months[item.month - 1]} ${year}`
        };

        item.transactions.forEach(tx => {
          row[tx.transactionName] = tx.amount;
          allKeys.add(tx.transactionName);
        });

        return row;
      });

      setLineData(formatted);
      setLineKeys([...allKeys]);
    })
    .catch(console.error);
}, [lineTxnType]); // 👈 IMPORTANT



/* 🔹 Fetch Pie chart data */
useEffect(() => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  let url = `${API_BASE_URL}/api/transactions/pie?type=${pieType}`;

  if (pieType === "MONTH") {
    url += `&year=${currentYear}&month=${currentMonth}`;
  }

  if (pieType === "YEAR") {
    url += `&year=${currentYear}`;
  }

  fetch(url, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch pie data");
      return res.json();
    })
    .then(data => {
      const formatted = data.map(item => ({
        name: item.transactionName,
        value: Number(item.amount)
      }));
      setPieData(formatted);
    })
    .catch(err => console.error(err));
}, [pieType]);



  /* 🔹 Fetch transaction logs */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/transactions/logs`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status === 401) throw new Error("Not authenticated");
        if (!res.ok) throw new Error("Failed to fetch logs");
        return res.json();
      })
      .then(data => {
        const formattedLogs = data.map(log => ({
          id: log.id,
          name: log.transactionName,
          type: log.transactionType,
          amount: log.amount,
          action: log.action,
createdAt: new Date(log.createdAt).toLocaleString("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,   // 🔹 12-hour format
  timeZone: "Asia/Kolkata" // 🔹 IST
})


        }));
        setLogs(formattedLogs);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  /* 🔹 Pagination logic */
  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const paginatedLogs = logs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const s = {
    page: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: theme.background,
      color: theme.text
    },
    
    paginationFixed: {
  position: "fixed",
  bottom: "16px",
  left: "60%",
  transform: "translateX(-50%)",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  background: theme.mainBackground,
  border: `1px solid ${theme.border}`,
  padding: "8px 14px",
  borderRadius: "8px",
  zIndex: 1000
},
pageBtn: {
  padding: "6px 14px",
  cursor: "pointer",
  border: `1px solid ${theme.border}`,
  background: theme.highlight,
  color: theme.text,
  borderRadius: "6px"
},
disabledBtn: {
  opacity: 0.4,
  cursor: "not-allowed"
},

    main: {
      flex: 1,
      padding: "12px",
      background: theme.mainBackground,
      overflow: "hidden"
    },
    topSection: {
      height: "25%",
      border: `1px solid ${theme.border}`,
      marginBottom: "10px",
      padding: "8px"
    },
    bottomSection: {
      height: "75%",
      display: "grid",
      gridTemplateColumns: "25% 75%",
      gap: "10px"
    },
    leftColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    },
    chartBox: {
      border: `1px solid ${theme.border}`,
      flex: 1,
      padding: "8px"
    },
    logsBox: {
      border: `1px solid ${theme.border}`,
      padding: "8px",
      overflowY: "auto"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse"
    },
    th: { border: `1px solid ${theme.border}`, padding: "8px", background: theme.tableHeader, textAlign: "center" },
    td: { border: `1px solid ${theme.border}`, padding: "6px", textAlign: "center" },
    pagination: {
      display: "flex",
      gap: "6px",
      marginTop: "10px"
    }
  };

  return (
    <div style={s.page}>
      <Sidebar theme={theme} toggleTheme={toggleTheme} />

      <div style={s.main}>
        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
  }}
>
  <h1 style={{ margin: 0 }}>Statistics</h1>

  {/* 🔹 Credit / Debit dropdown */}
  <select
    value={lineTxnType}
    onChange={e => setLineTxnType(e.target.value)}
    style={{
      padding: "6px 12px",
      borderRadius: "6px",
      border: `1px solid ${theme.border}`,
      background: theme.mainBackground,
      color: theme.text,
      cursor: "pointer",
      minWidth: "120px"
    }}
  >
    <option value="CREDIT">Credit</option>
    <option value="DEBIT">Debit</option>
  </select>
</div>


        {error && <div style={{ color: "red" }}>{error}</div>}

        {/* 🔹 LINE CHART */}
        <div style={s.topSection}>

<ResponsiveContainer width="100%" height="100%">
  <LineChart data={lineData}>
    <XAxis dataKey="month" stroke={theme.text} />
    <YAxis stroke={theme.text} />
    <Tooltip />


    {lineKeys.map(key => (
      <Line
        key={key}
        type="monotone"
        dataKey={key}
        stroke={stringToColor(key, theme.mode)}
        strokeWidth={2}
        dot={{ r: 3 }}
      />
    ))}
  </LineChart>
</ResponsiveContainer>

        </div>

        {/* 🔹 BOTTOM */}
        <div style={s.bottomSection}>
          <div style={s.leftColumn}>
{/* PIE */}
<div style={s.chartBox}>

{/* 🔹 Pie Filter – Full width */}
<div style={{ width: "100%", marginBottom: "8px" }}>
  <select
    value={pieType}
    onChange={e => setPieType(e.target.value)}
    style={{
      width: "100%",
      padding: "8px 10px",
      borderRadius: "6px",
      border: `1px solid ${theme.border}`,
      background: theme.mainBackground,
      color: theme.text,
      outline: "none",
      cursor: "pointer"
    }}
  >
    <option value="TODAY">Today</option>
    <option value="MONTH">This Month</option>
    <option value="YEAR">This Year</option>
  </select>
</div>


  {/* 🔹 Pie Chart */}
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie data={pieData} dataKey="value" outerRadius={90}>
        {pieData.map((e, i) => (
          <Cell key={i} fill={stringToColor(e.name, theme.mode)} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>

</div>

            {/* BAR */}
            <div style={s.chartBox}
>

              <ResponsiveContainer width="100%" height="70%">
<ResponsiveContainer width="100%" height="100%">
<ResponsiveContainer width="100%" height="100%">
  <BarChart data={varianceData}>
    
    <XAxis 
      dataKey="month" 
      stroke={theme.text} 
      interval={0}       // 👈 show every month
      angle={-45}        // 👈 rotate for better fit
      textAnchor="end"   // 👈 needed when rotating
    />
    <YAxis stroke={theme.text} />
    <Tooltip />
        <Legend
      verticalAlign="bottom"  // 👈 move legend below the chart
      align="center"           // center it horizontally
      wrapperStyle={{ paddingTop: 20 }} // optional spacing
    />
    <Bar dataKey="Credit" fill={stringToColor("Credit", theme.mode)} radius={[6, 6, 0, 0]} />
    <Bar dataKey="Debit" fill={stringToColor("Debit", theme.mode)} radius={[6, 6, 0, 0]} />
  </BarChart>
</ResponsiveContainer>

</ResponsiveContainer>

              </ResponsiveContainer>
            </div>
          </div>

          {/* 🔹 LOGS */}
          <div style={s.logsBox}>
            <h3>Transaction Logs</h3>

            <table style={s.table}>
              <thead>
                <tr>

                  <th style={s.th}>Transaction Name</th>
                  <th style={s.th}>Transaction Type</th>
                  <th style={s.th}>Transaction Amount</th>
                  <th style={s.th}>Action</th>
                  <th style={s.th}>Last Updated At</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map(log => (
                  <tr key={log.id}>


                    <td style={s.td}>{log.name}</td>
                    <td style={s.td}>{log.type}</td>
                    <td
  style={{
    ...s.td,
    color: getAmountColor(log.action)
  }}
>
  {log.amount.toLocaleString()}
</td>

                    <td
  style={{
    ...s.td, // merge the original td styles
    display: "flex",
    alignItems: "center",
    gap: "6px",
  }}
>
  {getActionIcon(log.action)}
  <span>{log.action}</span>
</td>
                    <td style={s.td}>{log.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 🔹 Pagination */}
<div style={s.paginationFixed}>
  <button
    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
    disabled={currentPage === 1}
    style={{
      ...s.pageBtn,
      ...(currentPage === 1 ? s.disabledBtn : {})
    }}
  >
    ◀ Prev
  </button>

  <span>
    Page {currentPage} / {totalPages}
  </span>

  <button
    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
    disabled={currentPage === totalPages}
    style={{
      ...s.pageBtn,
      ...(currentPage === totalPages ? s.disabledBtn : {})
    }}
  >
    Next ▶
  </button>
</div>


          </div>
        </div>
      </div>
    </div>
  );
}