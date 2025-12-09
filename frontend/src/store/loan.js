import { create } from "zustand";
import { useMemberStore } from "./member";
import { useBookStore } from "./book";

const token = localStorage.getItem("accessToken");

export const useLoanStore = create((set, get) => ({
  loans: [],
  setLoan: (loans) => set({ loans }),

  // Function to create a new loan
  createLoan: async (newLoan) => {
    const { members, updateOnLoan } = useMemberStore.getState();
    const { books, updateBook } = useBookStore.getState();

    if (
      !newLoan.memberId ||
      newLoan.bookIds.length === 0 ||
      !newLoan.borrowDate ||
      !newLoan.dueDate
    ) {
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

    // Decrease the available count for each book in the loan
    for (const bookId of newLoan.bookIds) {
      const currentBook = books.find((book) => book._id === bookId);
      if (!currentBook) continue;

      await updateBook(bookId, {
        ...currentBook,
        available: currentBook.available - 1,
      });
    }

    // Update member's onLoan status
    const currentMember = members.find((member) => member._id === newLoan.memberId);

    if (currentMember) {
      await updateOnLoan(newLoan.memberId, currentMember.onLoan);
    }

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
    const { books, updateBook } = useBookStore.getState();

    if (
      !updatedLoan.memberId ||
      updatedLoan.bookIds.length === 0 ||
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

    // Get the existing loan BEFORE update
    const oldLoan = get().loans.find((loan) => loan._id === pid);
    if (!oldLoan) {
      return { success: false, message: "Loan not found." };
    }

    // OLD bookIds vs NEW bookIds
    const oldBookIds = oldLoan.bookIds.map((book) => (typeof book === "string" ? book : book._id));
    const newBookIds = updatedLoan.bookIds.map((book) =>
      typeof book === "string" ? book : book._id
    );

    // Books removed
    const removedBooks = oldBookIds.filter((id) => !newBookIds.includes(id));

    // Books added
    const addedBooks = newBookIds.filter((id) => !oldBookIds.includes(id));

    // Removed books → available +1
    for (const bookId of removedBooks) {
      const book = books.find((book) => book._id === bookId);
      if (!book) continue;

      await updateBook(bookId, {
        ...book,
        available: book.available + 1,
      });
    }

    // Added books → available -1
    for (const bookId of addedBooks) {
      const book = books.find((book) => book._id === bookId);
      if (!book) continue;

      await updateBook(bookId, {
        ...book,
        available: book.available - 1,
      });
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      loans: state.loans.map((loan) => (loan._id === pid ? data.data : loan)),
    }));
    return { success: true, message: data.message };
  },

  // Function to return a loan by ID
  returnLoan: async (pid) => {
    const { members, updateOnLoan } = useMemberStore.getState();
    const { books, updateBook } = useBookStore.getState();

    const loanToReturn = get().loans.find((loan) => loan._id === pid);
    if (!loanToReturn) {
      return { success: false, message: "Loan not found." };
    }

    const returnedLoan = {
      ...loanToReturn,
      returnDate: new Date(),
      status: true,
    };

    const res = await fetch(`/api/loans/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(returnedLoan),
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // Increase the available count for each book in the loan
    for (const book of loanToReturn.bookIds) {
      const bookId = typeof book === "string" ? book : book._id;

      const currentBook = books.find((b) => b._id === bookId);
      if (!currentBook) continue;

      await updateBook(bookId, {
        ...currentBook,
        available: currentBook.available + 1,
      });
    }

    // Update member's onLoan status
    const currentMember = members.find((member) => member._id === loanToReturn.memberId._id);

    if (currentMember) {
      await updateOnLoan(currentMember._id, currentMember.onLoan);
    }

    // update the ui immediately, without needing a refresh
    set((state) => ({
      loans: state.loans.map((loan) => (loan._id === pid ? data.data : loan)),
    }));
    return { success: true, message: data.message };
  },
}));
