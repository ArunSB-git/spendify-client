import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProfilePage({ theme, toggleTheme }) {
  const [query, setQuery] = useState("");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const [importStep, setImportStep] = useState(1);
  const [importFile, setImportFile] = useState(null);
  const [taskIdMap, setTaskIdMap] = useState(null);

  const [user, setUser] = useState(null);
  const isOnline = navigator.onLine;

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/users/me`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => setUser(data))
      .catch(err => console.error("Failed to fetch user", err));
  }, []);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    : "";

  const handleSendQuery = () => {
    if (!query || !user?.email) return;

    fetch(`${API_BASE_URL}/api/send-query`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        to: user.email,
        subject: "Query Regarding Dashboard Application",
        body: query
      })
    }).then(() => {
      alert("Query sent successfully!");
      setQuery("");
    });
  };

  const blocks = [
{
  name: "Trackify",
  description: "Use Other Services",
  image: "/circle-cropped.png", // from public folder
  onClick: () =>
    window.open(
      "https://trackify-client-wy2i.onrender.com/",
      "_blank"
    )
}
,
    {
      name: "Import Data",
      description: "Upload your data",
      image: `https://img.icons8.com/ios-filled/100/${theme.progressCircle.replace(
        "#",
        ""
      )}/upload.png`,
      onClick: () => {
        setShowImportDialog(true);
        setImportStep(1);
        setImportFile(null);
        setTaskIdMap(null);
      }
    },
    {
      name: "Download Statistics",
      description: "Export your stats",
      image: `https://img.icons8.com/ios-filled/100/${theme.progressCircle.replace(
        "#",
        ""
      )}/download.png`,
      onClick: () => setShowExportDialog(true)
    },
    {
      name: "Delete Account",
      description: "Remove your account permanently",
      image: `https://img.icons8.com/ios-filled/100/${theme.delete.replace(
        "#",
        ""
      )}/delete-forever.png`,
      onClick: () => setShowDeleteDialog(true)
    },
    {
      name: "Logout",
      description: "Sign out of your account",
      image: `https://img.icons8.com/ios-filled/100/${theme.progressCircle.replace(
        "#",
        ""
      )}/logout-rounded.png`,
      onClick: () => setShowLogoutDialog(true)
    },
    {
      name: "Contribute on GitHub",
      description: "Open repository",
      image: `https://img.icons8.com/ios-glyphs/90/${theme.progressCircle.replace(
        "#",
        ""
      )}/github.png`,
      onClick: () => window.open("https://github.com/", "_blank")
    }
  ];

  const s = {
    page: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: theme.background,
      color: theme.text
    },
    main: {
      flex: 1,
      padding: "20px",
      background: theme.mainBackground,
      position: "relative"
    },
    /* 🔹 QUERY (FIXED) */
queryInput: {
  width: "260px",
  padding: "8px 10px",
  borderRadius: "6px",
  border: `1px solid ${theme.progressCircle}`,
  background: theme.inputBackground,
  color: theme.text,
  outline: "none",
  fontSize: "14px"
},
sendButton: {
  padding: "8px 14px",
  borderRadius: "6px",
  border: "none",
  background: theme.progressCircle,
  color: "#fff",
  cursor: "pointer",
  fontSize: "14px",
  transition: "opacity 0.2s ease"
},


    /* 🔹 QUERY */
    topRightQuery: {
      position: "absolute",
      top: "20px",
      right: "20px",
      display: "flex",
      gap: "6px"
    },

    /* 🔹 PROFILE */
    profileRow: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "35px"
    },
    profileCard: {
      background: theme.profileBlockBackground,
      borderRadius: "16px",
      padding: "28px 40px",
      display: "flex",
      alignItems: "center",
      gap: "35px",
      boxShadow: `0 0 8px ${theme.border}`,
      minWidth: "680px",
      cursor: "pointer",
      transition: "transform 0.3s ease, box-shadow 0.3s ease"
    },
    profileImage: {
      width: "140px",
      height: "140px",
      borderRadius: "50%",
      border: `4px solid ${theme.progressCircle}`,
      objectFit: "cover"
    },
    profileInfo: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    },
    profileName: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#4cbb17"
    },
    profileEmail: {
      fontSize: "15px"
    },
    profileStatus: {
      fontSize: "14px"
    },
    profileSince: {
      fontSize: "13px",
      opacity: 0.7
    },

    /* 🔹 GRID */
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px",
      listStyle: "none",
      padding: 0,
      margin: 0
    },
    gridItem: {
      background: theme.profileBlockBackground,
      borderRadius: "10px",
      cursor: "pointer",
      transition: "transform 0.3s ease",
      boxShadow: `0 0 5px ${theme.border}`
    },
    figure: {
      margin: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "18px",
      gap: "12px"
    },
    blockImage: {
      width: "70px",
      height: "70px",
      borderRadius: "50%",
      border: `2px solid ${theme.progressCircle}`
    },
    blockTitle: {
      fontSize: "16px",
      color: "#4cbb17",
      textAlign: "center"
    },
    blockDesc: {
      fontSize: "13px",
      color: theme.blockText,
      textAlign: "center"
    }
  };

  return (
    <div style={s.page}>
      <Sidebar theme={theme} toggleTheme={toggleTheme} />

      <div style={s.main}>
        <h1>Profile & Settings</h1>

        {/* 🔹 Query */}
        <div style={s.topRightQuery}>
          <input
            style={s.queryInput}
            placeholder="Type your query..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button style={s.sendButton} onClick={handleSendQuery}>
            ➤
          </button>
        </div>

        {/* 🔹 PROFILE DETAILS */}
        <div style={s.profileRow}>
          <div
            style={s.profileCard}
            onMouseEnter={e =>
              (e.currentTarget.style.transform = "translateY(-6px)")
            }
            onMouseLeave={e =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <img
              src={
                user?.profilePicture ||
                `https://ui-avatars.com/api/?name=Arun+S.B&background=${theme.progressCircle.replace(
                  "#",
                  ""
                )}&color=fff&size=256`
              }
              alt="Profile"
              style={s.profileImage}
            />

            <div style={s.profileInfo}>
              <div style={s.profileName}>{user?.name}</div>
              <div style={s.profileEmail}>{user?.email}</div>
              <div style={s.profileStatus}>
                {isOnline ? "🟢 Active" : "🔴 Offline"}
              </div>
              <div style={s.profileSince}>
                Member since {memberSince}
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 ACTION BLOCKS */}
        <ul style={s.grid}>
          {blocks.map(block => (
            <li
              key={block.name}
              style={s.gridItem}
              onClick={block.onClick}
              onMouseEnter={e =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={e =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <figure style={s.figure}>
                <img src={block.image} alt="" style={s.blockImage} />
                <figcaption>
                  <h3 style={s.blockTitle}>{block.name}</h3>
                  <p style={s.blockDesc}>{block.description}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
