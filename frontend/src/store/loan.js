import { create } from "zustand";

const token = localStorage.getItem("accessToken");

export const useLoanStore = create((set) => ({
  loans: [],
  setLoan: (loans) => set({ loans }),

  // Function to create a new loan
  createLoan: async (newLoan) => {
    if (!newLoan.userId || !newLoan.bookId || !newLoan.borrowDate || !newLoan.dueDate) {
      return { success: false, message: "Please fill in all fields." };
    }

    const res = await fetch("/api/loans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newLoan),
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({ loans: [...state.loans, data.data] }));
    return { success: true, message: "Loan created successfully" };
  },

  // Function to fetch all loans
  fetchLoan: async () => {
    const res = await fetch("/api/loans", {
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

    set({ loans: data.data });
  },

  // Function to update a loan by ID
  updateLoan: async (pid, updatedLoan) => {
    if (
      !updatedLoan.userId ||
      !updatedLoan.bookId ||
      !updatedLoan.borrowDate ||
      !updatedLoan.dueDate
    ) {
      return { success: false, message: "Please fill in all fields." };
    }

    const res = await fetch(`/api/loans/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedLoan),
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      loans: state.loans.map((loan) => (loan._id === pid ? data.data : loan)),
    }));
    return { success: true, message: data.message };
  },

  // Function to delete a loan by ID
  deleteLoan: async (pid) => {
    const deletedLoan = {
      na: true,
      del: true,
    };

    const res = await fetch(`/api/loans/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(deletedLoan),
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      loans: state.loans.filter((loan) => loan._id !== pid),
    }));
    return { success: true, message: data.message };
  },
}));
