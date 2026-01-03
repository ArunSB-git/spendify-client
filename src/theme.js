import LightModeIcon from "@mui/icons-material/LightMode"; 
import CircleIcon from "@mui/icons-material/DarkModeOutlined"; 

export const darkTheme = {
  background: "#071104",
  mainBackground: "#000000",
  sidebarBackground: "#071104",
  inputBackground: "#071104",
  sidebarInput:"#052e16",
  tableHeader: "#052e16",      // deep green tint
  tableCell: "#4b5320",
  border: "#14532d",
  text: "#ecfdf5",
  progressCircle: "#4cbb17",   // primary green
  tooltipBg: "#052e16",
  tooltipBorder: "#22c55e",
  highlight: "#22c55e",
  delete: "#ef4444",
  online: "#4cbb17",
  offline: "#ef4444",
  blockText: "#9ca3af",
  selectBackground: "#4b5320",
  selectText: "#ecfdf5",
  switchTrack: "#052e16",
switchThumb: "#4cbb17",
switchCheckedTransform: "translateX(20px)",
 // moves right for dark
  themeIcon: LightModeIcon,
   themeIconColor: "#facc15",
};



export const lightTheme = {
  background: "#9dc183",
  mainBackground: "#d0f0c0",
  sidebarBackground: "#9dc183",
  inputBackground: "#ffffff",
  sidebarInput:"#ffffff",
  tableHeader: "#c7ea46",      // soft green tint
  tableCell: "#9dc183",
  border: "#4cbb17",
  text: "#111827",
  progressCircle: "#4cbb17",   // strong green
  tooltipBg: "#f0fdf4",
  tooltipBorder: "#16a34a",
  highlight: "#16a34a",
  delete: "#dc2626",
  online: "#4cbb17",
  offline: "#ef4444",
  blockText: "#6b7280",
  selectBackground: "#d0f0c0",
  selectText: "#111827",
  profileBlockBackground: "#f0fdf4",
  switchTrack: "#d0f0c0",
switchThumb: "#16a34a",
switchCheckedTransform: "translateX(0px)", // stays left for light
themeIcon: CircleIcon,
themeIconColor: "#000000",

};

