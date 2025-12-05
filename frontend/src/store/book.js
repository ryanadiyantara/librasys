import { create } from "zustand";

const token = localStorage.getItem("accessToken");

export const useBookStore = create((set) => ({
  books: [],
  setBook: (books) => set({ books }),

  // Function to create a new book
  createBook: async (newBook) => {
    if (!newBook.title || !newBook.stock || !newBook.available) {
      return { success: false, message: "Please fill in all fields." };
    }

    const formData = new FormData();
    formData.append("title", newBook.title);
    formData.append("author", newBook.author);
    formData.append("publisher", newBook.publisher);
    formData.append("year", newBook.year);
    formData.append("category", newBook.category);
    formData.append("stock", newBook.stock);
    formData.append("available", newBook.available);
    formData.append("location", newBook.location);
    formData.append("file", newBook.image);

    const res = await fetch("/api/books", {
      method: "POST",
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
    set((state) => ({ books: [...state.books, data.data] }));
    return { success: true, message: "Book created successfully" };
  },

  // Function to fetch all books
  fetchBook: async (newBook) => {
    const res = await fetch("/api/books", {
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

    set({ books: data.data });
  },

  // Function to update a book by ID
  updateBook: async (pid, updatedBook) => {
    if (!updatedBook.title || !updatedBook.stock || !updatedBook.available) {
      return { success: false, message: "Please fill in all fields." };
    }

    const formData = new FormData();
    formData.append("title", updatedBook.title);
    formData.append("author", updatedBook.author);
    formData.append("publisher", updatedBook.publisher);
    formData.append("year", updatedBook.year);
    formData.append("category", updatedBook.category);
    formData.append("stock", updatedBook.stock);
    formData.append("available", updatedBook.available);
    formData.append("location", updatedBook.location);
    formData.append("file", updatedBook.image);

    const res = await fetch(`/api/books/${pid}`, {
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
      books: state.books.map((book) => (book._id === pid ? data.data : book)),
    }));
    return { success: true, message: data.message };
  },

  // Function to delete a book by ID
  deleteBook: async (pid) => {
    const res = await fetch(`/api/books/${pid}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      books: state.books.filter((book) => book._id !== pid),
    }));
    return { success: true, message: data.message };
  },
}));
