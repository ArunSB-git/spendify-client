import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";



const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GITHUB=import.meta.env.VITE_GITHUB_URL;
const LINKEDIN=import.meta.env.VITE_LINKEDIN_URL;
const TRACKIFY=import.meta.env.VITE_TRACKIFY_URL;
const PORTFOLIO=import.meta.env.VITE_PORTFOLIO_URL;

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

  const navigate = useNavigate();

  const handleLogout = async () => {
  try {
    await fetch(`${API_BASE_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout failed", err);
  } finally {
    localStorage.removeItem("token"); // optional but recommended
    setShowLogoutDialog(false);
    navigate("/login");
  }
};

const handleDeleteAccount = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/delete`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      throw new Error("Delete failed");
    }
  } catch (err) {
    console.error("Delete account failed", err);
  } finally {
    // cleanup like logout
    localStorage.removeItem("token");
    setShowDeleteDialog(false);
    navigate("/login");
  }
};


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
      TRACKIFY,
      "_blank"
    )
}
,
    {
      name: "Import Data",
      description: "Upload your data ⚠️ (Work in Progress)",
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
      description: "Export your stats ⚠️ (Work in Progress)",
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
    name: "Social Profile",
    socialLinks: [
      { icon: "github", url: GITHUB },
      { icon: "linkedin", url: LINKEDIN },
      { icon: "portfolio", url: PORTFOLIO },
      { icon: "resume", url: "/SDE_CV.pdf" }
    ]
  }
  ];

  const s = {

socialIconsRow: {
  display: "flex",
  justifyContent: "center",
  gap: "24px",      // space between icons
  marginTop: "6px"   // space between icons and legend
},

socialIconImg: {
  width: "70px",       // increased from 36px
  height: "70px",      // increased from 36px
  cursor: "pointer",
  transition: "transform 0.2s ease, opacity 0.2s ease",
},



modalOverlay: {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
},

modalBox: {
  
  padding: "25px",
  borderRadius: "12px",
  width: "520px",
  position: "relative"
},

closeIcon: {
  position: "absolute",
  top: "10px",
  right: "15px",
  cursor: "pointer",
  fontSize: "18px"
},


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
      gap: "1px"
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
      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-5px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <figure style={s.figure}>
        {/* Normal image blocks */}
        {block.image && <img src={block.image} alt="" style={s.blockImage} />}

        {/* Title */}
        {block.name && <h3 style={s.blockTitle}>{block.name}</h3>}

        {/* Social Profile icons */}
        {block.socialLinks && (
          <div style={s.socialIconsRow}>
            {block.socialLinks.map(link => (
              <img
                key={link.icon}
                src={`https://img.icons8.com/ios-filled/100/${theme.progressCircle.replace("#", "")}/${link.icon}.png`}
                alt={link.icon}
                style={s.socialIconImg}
                onClick={() => window.open(link.url, "_blank")}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.2)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              />
            ))}
          </div>
        )}

        {/* Legend only for social block */}
        {block.legend && (
          <p style={{ ...s.blockDesc, marginTop: "12px" }}>{block.legend}</p>
        )}

        {/* Description for other blocks */}
        {!block.socialLinks && block.description && (
          <p style={s.blockDesc}>{block.description}</p>
        )}
      </figure>
    </li>
  ))}
</ul>

      </div>
{/* 🔹 LOGOUT CONFIRMATION MODAL */}
{showLogoutDialog && (
  <div style={s.modalOverlay}>
    <div
      style={{
        ...s.modalBox,
        background: theme.logoutDialogBox,
        width: "360px"
      }}
    >
      <span
        style={{ ...s.closeIcon, color: theme.text }}
        onClick={() => setShowLogoutDialog(false)}
      >
        ✕
      </span>

      <h2
        style={{
          textAlign: "center",
          color: theme.text
        }}
      >
        Confirm Logout
      </h2>

      <p
        style={{
          marginTop: "15px",
          fontSize: "14px",
          color: theme.blockText,
          textAlign: "center"
        }}
      >
        Are you sure you want to logout?
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "25px"
        }}
      >
        <button
          style={{
            background: "#ef4444",
            color: theme.inputBackground,
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
          onClick={handleLogout}
        >
          Yes
        </button>

        <button
          style={{
            background: "#4cbb17",
            color: theme.inputBackground,
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
          onClick={() => setShowLogoutDialog(false)}
        >
          No
        </button>
      </div>
    </div>
  </div>
)}

{/* 🔹 DELETE CONFIRMATION MODAL */}
{showDeleteDialog && (
  <div style={s.modalOverlay}>
    <div
      style={{
        ...s.modalBox,
        background: theme.logoutDialogBox,
        width: "380px",
      }}
    >
      <span
        style={{ ...s.closeIcon, color: theme.text }}
        onClick={() => setShowDeleteDialog(false)}
      >
        ✕
      </span>

      <h2 style={{ textAlign: "center", color: theme.text }}>
        Delete Account
      </h2>

      <p
        style={{
          marginTop: "15px",
          fontSize: "14px",
          color: theme.blockText,
          textAlign: "center",
        }}
      >
        This action is permanent.  
        All your data will be deleted.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "25px",
        }}
      >
        <button
          style={{
            background: "#ef4444",
            color: theme.inputBackground,
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={handleDeleteAccount}
        >
          Delete
        </button>

        <button
          style={{
            background: "#4cbb17",
            color: theme.inputBackground,
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={() => setShowDeleteDialog(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


    </div>
    
  );
}
