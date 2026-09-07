import { dark } from "@clerk/themes";

export const customClerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#8B5CF6", // Violet-500
    colorBackground: "#0E0916", // OLED Dark Surface
    colorInputBackground: "#1A1028",
    colorInputText: "#F8FAFC",
    colorText: "#F8FAFC",
    colorTextSecondary: "#94A3B8",
    borderRadius: "1rem",
    fontFamily: "inherit",
  },
  elements: {
    card: "border border-violet-500/20 shadow-[0_10px_40px_-10px_rgba(139,92,246,0.25)] backdrop-blur-2xl bg-[#0E0916]/95 rounded-3xl",
    modalContent: "border border-violet-500/20 shadow-[0_10px_40px_-10px_rgba(139,92,246,0.25)] backdrop-blur-2xl bg-[#0E0916]/95 rounded-3xl",
    headerTitle: "text-slate-50 font-bold tracking-tight text-2xl",
    headerSubtitle: "text-slate-400 text-sm",
    socialButtonsBlockButton:
      "border border-violet-500/20 bg-[#1A1028]/80 hover:bg-violet-500/15 text-slate-100 transition-all rounded-xl font-semibold shadow-sm",
    socialButtonsBlockButtonText: "font-semibold text-slate-200",
    dividerLine: "bg-violet-900/40",
    dividerText: "text-slate-400 text-xs uppercase tracking-widest font-semibold",
    formFieldLabel: "text-slate-300 font-medium text-xs tracking-wide",
    formFieldInput:
      "bg-[#1A1028] border border-violet-500/30 text-white rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all",
    formButtonPrimary:
      "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all",
    footerActionLink: "text-violet-400 hover:text-fuchsia-400 font-semibold transition-colors",
    identityPreview: "border border-violet-500/20 bg-[#1A1028] rounded-xl",
    userButtonPopoverCard:
      "border border-violet-500/20 shadow-2xl backdrop-blur-2xl bg-[#0E0916]/95 rounded-2xl",
    userProfileNavbar: "border-r border-violet-500/10",
  },
};
