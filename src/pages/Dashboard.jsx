import { useEffect, useState } from "react";
// Inside Dashboard.jsx
import Sidebar from "./Sidebar";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard({ theme, toggleTheme }) {
  const [transactions, setTransactions] = useState([]);
  const [banks, setBanks] = useState([]); // 🔹 Bank list

  const [newTransactionName, setNewTransactionName] = useState("");
  const [newTransactionAmount, setNewTransactionAmount] = useState("");
  const [newTransactionType, setNewTransactionType] = useState("CREDIT");
  const [newBankId, setNewBankId] = useState(null); // 🔹 Selected bank

  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const [editTransaction, setEditTransaction] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editType, setEditType] = useState("CREDIT");
  const [editBankId, setEditBankId] = useState(null); // 🔹 Edit bank
  const [editDialog, setEditDialog] = useState(false);
const [deleteDialog, setDeleteDialog] = useState(false);
const [deleteTransactionId, setDeleteTransactionId] = useState(null);

  // Load banks from API
  const loadBanks = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/banks`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setBanks(data);
        if (data.length > 0) setNewBankId(data[0].id); // 🔹 default selection
      }
    } catch (err) {
      console.error("Failed to load banks:", err);
    }
  };

  // Load transactions from backend
  const loadTransactions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions`, {
        credentials: "include",
      });
      if (res.status === 401) return;
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Load transactions failed:", err);
    }
  };

  useEffect(() => {
    loadBanks();
    loadTransactions();
  }, []);

  // Create a new transaction
  const createTransaction = async () => {
    if (!newTransactionName.trim() || !newTransactionAmount) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions/createTask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          transactionName: newTransactionName,
          transactionType: newTransactionType,
          amount: parseFloat(newTransactionAmount),
          bankId: newBankId, // 🔹 include selected bank
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setDialogMessage("Transaction created successfully");
        setShowDialog(true);
        setNewTransactionName("");
        setNewTransactionAmount("");
        setNewTransactionType("CREDIT");
        setNewBankId(banks.length > 0 ? banks[0].id : null); // reset to first bank
        await loadTransactions();
      } else {
        setDialogMessage(data.message || "Transaction creation failed");
        setShowDialog(true);
      }
    } catch (err) {
      console.error(err);
      setDialogMessage("Transaction creation failed");
      setShowDialog(true);
    }
  };

// Open delete confirmation dialog
const confirmDeleteTransaction = (id) => {
  setDeleteTransactionId(id);
  setDeleteDialog(true);
};

// Actual delete API call
const handleDeleteTransaction = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/transactions/${deleteTransactionId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();

    if (res.ok) {
      setDialogMessage("Transaction deleted successfully");
    } else {
      setDialogMessage(data.message || "Delete failed");
    }

    setShowDialog(true);
    setDeleteDialog(false);
    await loadTransactions();
  } catch (err) {
    console.error(err);
    setDialogMessage("Delete failed");
    setShowDialog(true);
    setDeleteDialog(false);
  }
};


  // Open edit dialog
  const openEditDialog = (tx) => {
    setEditTransaction(tx);
    setEditName(tx.transactionName);
    setEditAmount(tx.amount);
    setEditType(tx.transactionType);
    setEditBankId(tx.bankId || (banks.length > 0 ? banks[0].id : null));
    setEditDialog(true);
  };

  // Update transaction
  const updateTransaction = async () => {
    if (!editName.trim() || !editAmount) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions/${editTransaction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          transactionName: editName,
          transactionType: editType,
          amount: parseFloat(editAmount),
          bankId: editBankId, // 🔹 include selected bank
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setDialogMessage("Transaction updated successfully");
        setShowDialog(true);
        setEditDialog(false);
        await loadTransactions();
      } else {
        setDialogMessage(data.message || "Transaction not updated");
        setShowDialog(true);
      }
    } catch (err) {
      console.error(err);
      setDialogMessage("Transaction not updated");
      setShowDialog(true);
    }
  };

  // Format date + time (IST)
  const formatIST = (utcString) => {
    const date = new Date(utcString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Styles
  const s = {
    page: { display: "flex", flexDirection: "column", height: "100vh", background: theme.background, color: theme.text },
    main: { flex: 1, padding: "20px", background: theme.mainBackground },
    createBox: { display: "flex", gap: "10px", marginBottom: "15px" },
    input: { padding: "8px", background: theme.inputBackground, color: theme.text, border: `1px solid ${theme.border}` },
    select: { padding: "8px", background: theme.inputBackground, color: theme.text, border: `1px solid ${theme.border}` },
    createBtn: { padding: "8px 14px", background: theme.progressCircle, color: theme.text, border: "none", cursor: "pointer" },
    editBtn: { padding: "4px 0", width: "60px", background: "#f59e0b", border: "none", cursor: "pointer", color: theme.text, fontWeight: "bold" },
    deleteBtn: { padding: "4px 0", width: "60px", background: theme.delete, border: "none", cursor: "pointer", color: theme.text, fontWeight: "bold" },
    tableWrapper: { overflow: "auto", border: `1px solid ${theme.border}`, borderRadius: "6px" },
    table: { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" },
    th: { border: `1px solid ${theme.border}`, padding: "8px", background: theme.tableHeader, textAlign: "center" },
    td: { border: `1px solid ${theme.border}`, padding: "6px", textAlign: "center" },
    dialogOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 },
    dialog: { background: theme.inputBackground, padding: "20px", borderRadius: "6px", textAlign: "center", border: `1px solid ${theme.border}` },
  };

  return (
    <div style={s.page}>
      <Sidebar theme={theme} toggleTheme={toggleTheme} />

      <div style={s.main}>
        <h1>Dashboard</h1>

        {/* Create transaction */}
        <div style={s.createBox}>
          <input
            type="text"
            placeholder="Transaction Name"
            value={newTransactionName}
            onChange={(e) => setNewTransactionName(e.target.value)}
            style={s.input}
          />
          <input
            type="number"
            placeholder="Amount"
            value={newTransactionAmount}
            onChange={(e) => setNewTransactionAmount(e.target.value)}
            style={s.input}
          />
          <select value={newTransactionType} onChange={(e) => setNewTransactionType(e.target.value)} style={s.select}>
            <option value="CREDIT">CREDIT</option>
            <option value="DEBIT">DEBIT</option>
          </select>
          {/* 🔹 Bank dropdown */}
          <select value={newBankId} onChange={(e) => setNewBankId(parseInt(e.target.value))} style={s.select}>
            {banks.map((bank) => (
              <option key={bank.id} value={bank.id}>{bank.bankName}</option>
            ))}
          </select>
          <button onClick={createTransaction} style={s.createBtn}>➕ Create</button>
        </div>

        {/* Transactions table */}
        <div style={s.tableWrapper}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={{ ...s.th, width: "18%" }}>Name</th>
                <th style={{ ...s.th, width: "10%" }}>Type</th>
                <th style={{ ...s.th, width: "12%" }}>Amount</th>
                <th style={{ ...s.th, width: "18%" }}>Last Updated</th>
                <th style={{ ...s.th, width: "28%" }}>Description</th>
                <th style={{ ...s.th, width: "8%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td style={s.td}>{tx.transactionName}</td>
                  <td style={s.td}>{tx.transactionType}</td>
                  <td style={{ ...s.td, color: tx.transactionType === "CREDIT" ? "green" : "red", fontWeight: "bold" }}>
                    {tx.amount.toFixed(2)}
                  </td>
                  <td style={s.td}>{formatIST(tx.updatedAt)}</td>
                  {/* 🔹 Show bank name in Description */}
                  <td style={{ ...s.td, textAlign: "left", paddingLeft: "12px" }}>
                    {banks.find((b) => b.id === tx.bankId)?.bankName || "—"}
                  </td>
                  <td style={s.td}>
                    <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                      <button style={s.editBtn} onClick={() => openEditDialog(tx)}>✏️</button>
                      <button style={s.deleteBtn} onClick={() => confirmDeleteTransaction(tx.id)}>🗑</button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog */}
      {showDialog && (
        <div style={s.dialogOverlay}>
          <div style={s.dialog}>
            <h3>Info</h3>
            <p>{dialogMessage}</p>
            <button onClick={() => setShowDialog(false)} style={s.createBtn}>OK</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
{deleteDialog && (
  <div style={s.dialogOverlay}>
    <div style={s.dialog}>
      <h3>Confirm Delete</h3>
      <p>Are you sure you want to delete this transaction?</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button style={s.deleteBtn} onClick={handleDeleteTransaction}>Yes</button>
        <button style={s.createBtn} onClick={() => setDeleteDialog(false)}>No</button>
      </div>
    </div>
  </div>
)}


      {/* Edit dialog */}
      {editDialog && (
        <div style={s.dialogOverlay}>
          <div style={s.dialog}>
            <h3>Edit Transaction</h3>
            <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" style={{ ...s.input, marginBottom: "10px" }} />
            <input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} placeholder="Amount" style={{ ...s.input, marginBottom: "10px" }} />
            <select value={editType} onChange={(e) => setEditType(e.target.value)} style={{ ...s.select, marginBottom: "10px" }}>
              <option value="CREDIT">CREDIT</option>
              <option value="DEBIT">DEBIT</option>
            </select>
            {/* 🔹 Bank dropdown for edit */}
            <select value={editBankId} onChange={(e) => setEditBankId(parseInt(e.target.value))} style={{ ...s.select, marginBottom: "10px" }}>
              {banks.map((bank) => (
                <option key={bank.id} value={bank.id}>{bank.bankName}</option>
              ))}
            </select>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <button style={s.editBtn} onClick={updateTransaction}>Update</button>
              <button style={s.deleteBtn} onClick={() => setEditDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
