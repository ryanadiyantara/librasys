import { create } from "zustand";

const token = localStorage.getItem("accessToken");

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

const memberInfo = token ? parseJwt(token)?.MemberInfo : null;

export const useMemberStore = create((set) => ({
  members: [],
  currentMember: memberInfo,
  currentMembers: [],
  setMember: (members) => set({ members }),

  // Function to create a new member
  createMember: async (newMember) => {
    if (!newMember.role || !newMember.name || !newMember.email || !newMember.identityNumber) {
      return { success: false, message: "Please fill in all fields." };
    }

    const res = await fetch("/api/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newMember),
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({ members: [...state.members, data.data] }));
    return { success: true, message: "Member created successfully" };
  },

  // Function to fetch all members
  fetchMember: async () => {
    const res = await fetch("/api/members", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();

    set({ members: data.data });
  },

  // Function to fetch current member
  fetchCurrentMember: async () => {
    const res = await fetch(`/api/members/${memberInfo.pid}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();

    set({ currentMembers: data.data });
  },

  // Function to update a member by ID
  updateMember: async (pid, updatedMember) => {
    if (
      !updatedMember.role ||
      !updatedMember.name ||
      !updatedMember.email ||
      !updatedMember.identityNumber
    ) {
      return { success: false, message: "Please fill in all fields." };
    }

    const formData = new FormData();
    formData.append("role", updatedMember.role);
    formData.append("name", updatedMember.name);
    formData.append("email", updatedMember.email);
    formData.append("identityNumber", updatedMember.identityNumber);
    formData.append("file", updatedMember.profileImage);

    const res = await fetch(`/api/members/${pid}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      members: state.members.map((member) => (member._id === pid ? data.data : member)),
    }));
    return { success: true, message: data.message };
  },

  // Function to update a member's password by ID
  changePassword: async (pid, currentEmail, changedPassword) => {
    if (!changedPassword.old_password || !changedPassword.new_password) {
      return { success: false, message: "Please fill in all fields." };
    }

    const formData = new FormData();
    formData.append("old_password", changedPassword.old_password);
    formData.append("new_password", changedPassword.new_password);
    formData.append("currentEmail", currentEmail);

    const res = await fetch(`/api/members/${pid}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      members: state.members.filter((member) => member._id !== pid),
    }));
    return { success: true, message: data.message };
  },

  // Function to update onLoan status of a member by ID
  updateOnLoan: async (pid, currentOnLoan) => {
    const newOnLoan = !currentOnLoan;

    const formData = new FormData();
    formData.append("onLoan", newOnLoan);

    const res = await fetch(`/api/members/${pid}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      members: state.members.map((member) => (member._id === pid ? data.data : member)),
    }));
    return { success: true, message: data.message };
  },

  // Function to update status of a member by ID
  setStatusMember: async (pid, currentStatus) => {
    const newStatus = !currentStatus;

    const formData = new FormData();
    formData.append("status", newStatus);

    const res = await fetch(`/api/members/${pid}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      members: state.members.map((member) => (member._id === pid ? data.data : member)),
    }));
    return { success: true, message: data.message };
  },

  // Auth functions
  // Function to login a member
  loginMember: async (newMember) => {
    if (!newMember.email || !newMember.password) {
      return { success: false, message: "Please fill in all fields." };
    }

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMember),
    });

    const data = await res.json();

    if (!data.success)
      return { success: false, message: "Incorrect email or password. Please try again." };

    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
    }

    set((state) => ({ members: [...state.members, data.data] }));
    return { success: true, message: "Login successfully", role: data.role };
  },

  // Function to logout a member
  logoutMember: async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!data.success) {
      return { success: false, message: "Failed to logout. Please try again." };
    }

    localStorage.removeItem("accessToken");
    set({ members: [] });
    return { success: true, message: "Logout successfully" };
  },

  // Function to handle forgot password
  forgotPassword: async (newMember) => {
    if (!newMember.email) {
      return { success: false, message: "Please fill in all fields." };
    }

    const res = await fetch("/api/auth/forgotpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMember),
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    return { success: true, message: data.message };
  },
}));
