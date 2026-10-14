/**
 * Book Tracker Application
 * Built with Vanilla JavaScript ES6+
 * Adheres to AGENTS.md and design.md (Wise Design System)
 */

(function () {
  'use strict';

  // Storage key
  const STORAGE_KEY = 'book_tracker_books_v1';

  // Initial Seed Data if user visits for the first time
  const INITIAL_SEED_BOOKS = [
    {
      id: 'book-seed-1',
      title: 'Aadujeevitham',
      author: 'Benyamin',
      status: 'To read',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 // 1 day ago
    },
    {
      id: 'book-seed-2',
      title: 'Atomic Habits',
      author: 'James Clear',
      status: 'Reading',
      createdAt: Date.now() - 1000 * 60 * 60 * 48 // 2 days ago
    },
    {
      id: 'book-seed-3',
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      status: 'Finished',
      createdAt: Date.now() - 1000 * 60 * 60 * 72 // 3 days ago
    }
  ];

  // App State
  let books = [];
  let currentSearchQuery = '';
  let currentStatusFilter = 'All';

  // DOM Elements
  const bookForm = document.getElementById('bookForm');
  const bookTitleInput = document.getElementById('bookTitle');
  const bookAuthorInput = document.getElementById('bookAuthor');
  const bookStatusSelect = document.getElementById('bookStatus');
  const titleError = document.getElementById('titleError');
  const authorError = document.getElementById('authorError');

  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const filterTabs = document.getElementById('filterTabs');
  const bookList = document.getElementById('bookList');
  const emptyState = document.getElementById('emptyState');
  const emptyTitle = document.getElementById('emptyTitle');
  const emptyDesc = document.getElementById('emptyDesc');

  // Stats Elements
  const statTotal = document.getElementById('statTotal');
  const statToRead = document.getElementById('statToRead');
  const statReading = document.getElementById('statReading');
  const statFinished = document.getElementById('statFinished');

  const countFilterAll = document.getElementById('countFilterAll');
  const countFilterToRead = document.getElementById('countFilterToRead');
  const countFilterReading = document.getElementById('countFilterReading');
  const countFilterFinished = document.getElementById('countFilterFinished');

  // =========================================================================
  // Initialization & LocalStorage Management
  // =========================================================================

  function initApp() {
    loadBooks();
    setupEventListeners();
    renderApp();
  }

  function loadBooks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        books = JSON.parse(stored);
        if (!Array.isArray(books)) {
          books = INITIAL_SEED_BOOKS.slice();
          saveBooks();
        }
      } else {
        // First visit: Seed sample books
        books = INITIAL_SEED_BOOKS.slice();
        saveBooks();
      }
    } catch (e) {
      console.error('Failed to parse books from localStorage:', e);
      books = INITIAL_SEED_BOOKS.slice();
    }
  }

  function saveBooks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch (e) {
      console.error('Failed to save books to localStorage:', e);
    }
  }

  // =========================================================================
  // Form Validation & Book Creation (Feature 1)
  // =========================================================================

  function clearErrors() {
    titleError.textContent = '';
    authorError.textContent = '';
    bookTitleInput.classList.remove('input-error');
    bookAuthorInput.classList.remove('input-error');
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const titleValue = bookTitleInput.value.trim();
    const authorValue = bookAuthorInput.value.trim();
    const statusValue = bookStatusSelect.value;

    let hasError = false;

    // Validate Title: Strictly required
    if (!titleValue) {
      titleError.textContent = 'Please enter a title';
      bookTitleInput.classList.add('input-error');
      hasError = true;
    } else {
      titleError.textContent = '';
      bookTitleInput.classList.remove('input-error');
    }

    // Validate Author: Strictly required
    if (!authorValue) {
      authorError.textContent = 'Please enter an author';
      bookAuthorInput.classList.add('input-error');
      hasError = true;
    } else {
      authorError.textContent = '';
      bookAuthorInput.classList.remove('input-error');
    }

    if (hasError) {
      // Focus on first invalid field
      if (!titleValue) {
        bookTitleInput.focus();
      } else {
        bookAuthorInput.focus();
      }
      return;
    }

    // Create New Book Object (Newest first: will be added to top)
    const newBook = {
      id: 'book-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      title: titleValue,
      author: authorValue,
      status: statusValue,
      createdAt: Date.now()
    };

    // Prepend to array so it appears at top of the list (newest first)
    books.unshift(newBook);
    saveBooks();

    // Reset Form
    bookForm.reset();
    bookStatusSelect.value = 'To read';
    clearErrors();

    // Re-render
    renderApp();

    // Smooth focus back to title for quick next entry
    bookTitleInput.focus();
  }

  // =========================================================================
  // Status Changing & Deleting (Feature 4 & Optional Extras)
  // =========================================================================

  function changeBookStatus(bookId, newStatus) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    book.status = newStatus;
    saveBooks();
    renderApp();
  }

  function deleteBook(bookId) {
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) return;

    const book = books[bookIndex];
    const confirmed = window.confirm(`Are you sure you want to delete "${book.title}"?`);
    if (!confirmed) return;

    books.splice(bookIndex, 1);
    saveBooks();
    renderApp();
  }

  // =========================================================================
  // Search & Filtering (Feature 3)
  // =========================================================================

  function getFilteredBooks() {
    const query = currentSearchQuery.toLowerCase().trim();

    return books.filter(book => {
      // Status filter
      if (currentStatusFilter !== 'All' && book.status !== currentStatusFilter) {
        return false;
      }

      // Search query filter (matches title OR author, case-insensitive)
      if (query) {
        const titleMatch = book.title.toLowerCase().includes(query);
        const authorMatch = book.author.toLowerCase().includes(query);
        if (!titleMatch && !authorMatch) {
          return false;
        }
      }

      return true;
    });
  }

  // =========================================================================
  // Statistics & Counters (Feature 5 & Optional Extras)
  // =========================================================================

  function updateStats() {
    const total = books.length;
    const toReadCount = books.filter(b => b.status === 'To read').length;
    const readingCount = books.filter(b => b.status === 'Reading').length;
    const finishedCount = books.filter(b => b.status === 'Finished').length;

    // Stats Bar Cards
    statTotal.textContent = total;
    statToRead.textContent = toReadCount;
    statReading.textContent = readingCount;
    statFinished.textContent = finishedCount;

    // Filter Tab Count Badges
    countFilterAll.textContent = total;
    countFilterToRead.textContent = toReadCount;
    countFilterReading.textContent = readingCount;
    countFilterFinished.textContent = finishedCount;
  }

  // =========================================================================
  // UI Rendering
  // =========================================================================

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'To read':
        return 'badge-toread';
      case 'Reading':
        return 'badge-reading';
      case 'Finished':
        return 'badge-finished';
      default:
        return 'badge-toread';
    }
  }

  function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderApp() {
    updateStats();

    const filtered = getFilteredBooks();

    // Toggle clear search button
    clearSearchBtn.style.display = currentSearchQuery ? 'flex' : 'none';

    // Render list or empty state
    if (filtered.length === 0) {
      bookList.innerHTML = '';
      emptyState.style.display = 'block';

      if (currentSearchQuery) {
        emptyTitle.textContent = 'No matching books found';
        emptyDesc.textContent = `No books matched "${escapeHtml(currentSearchQuery)}". Try searching for a different title or author.`;
      } else if (currentStatusFilter !== 'All') {
        emptyTitle.textContent = `No books marked as "${currentStatusFilter}"`;
        emptyDesc.textContent = `You don't have any books in this category yet.`;
      } else {
        emptyTitle.textContent = 'Your reading list is empty';
        emptyDesc.textContent = 'Add your first book using the form on the left to start tracking!';
      }
      return;
    }

    emptyState.style.display = 'none';

    // Render cards
    bookList.innerHTML = filtered.map(book => {
      const badgeClass = getStatusBadgeClass(book.status);
      const formattedDate = formatDate(book.createdAt);

      return `
        <li class="book-card" data-id="${book.id}">
          <div class="book-info">
            <h3 class="book-title">${escapeHtml(book.title)}</h3>
            <div class="book-author">
              <span class="author-prefix">by</span>
              <strong>${escapeHtml(book.author)}</strong>
            </div>
            ${formattedDate ? `<div class="book-meta-date">Added on ${formattedDate}</div>` : ''}
          </div>

          <div class="book-actions">
            <!-- Interactive Status Switcher -->
            <div class="status-pill-control" title="Click to change reading status">
              <span class="status-badge ${badgeClass}">
                <span class="status-dot">●</span>
                <span>${escapeHtml(book.status)}</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 2px;">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
              <select class="status-change-select" aria-label="Change status for ${escapeHtml(book.title)}">
                <option value="To read" ${book.status === 'To read' ? 'selected' : ''}>To read</option>
                <option value="Reading" ${book.status === 'Reading' ? 'selected' : ''}>Reading</option>
                <option value="Finished" ${book.status === 'Finished' ? 'selected' : ''}>Finished</option>
              </select>
            </div>

            <!-- Delete Book Button -->
            <button type="button" class="btn-delete" title="Delete book" aria-label="Delete ${escapeHtml(book.title)}">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </li>
      `;
    }).join('');
  }

  // =========================================================================
  // Event Listeners
  // =========================================================================

  function setupEventListeners() {
    // Form submission
    bookForm.addEventListener('submit', handleFormSubmit);

    // Live validation cleanup when typing
    bookTitleInput.addEventListener('input', () => {
      if (bookTitleInput.value.trim()) {
        titleError.textContent = '';
        bookTitleInput.classList.remove('input-error');
      }
    });

    bookAuthorInput.addEventListener('input', () => {
      if (bookAuthorInput.value.trim()) {
        authorError.textContent = '';
        bookAuthorInput.classList.remove('input-error');
      }
    });

    // Real-time Search
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      renderApp();
    });

    // Clear Search
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      currentSearchQuery = '';
      searchInput.focus();
      renderApp();
    });

    // Status Filter Tabs
    filterTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab-btn');
      if (!tab) return;

      const filter = tab.dataset.filter;
      if (!filter) return;

      // Update active tab style
      filterTabs.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      tab.classList.add('active');

      currentStatusFilter = filter;
      renderApp();
    });

    // Delegated events on Book List (Status Change & Delete)
    bookList.addEventListener('change', (e) => {
      if (e.target.classList.contains('status-change-select')) {
        const card = e.target.closest('.book-card');
        if (!card) return;
        const bookId = card.dataset.id;
        const newStatus = e.target.value;
        changeBookStatus(bookId, newStatus);
      }
    });

    bookList.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.btn-delete');
      if (deleteBtn) {
        const card = deleteBtn.closest('.book-card');
        if (!card) return;
        const bookId = card.dataset.id;
        deleteBook(bookId);
      }
    });

    // Keyboard shortcut: Press Escape to clear search if search is focused
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchInput.value) {
        searchInput.value = '';
        currentSearchQuery = '';
        renderApp();
      }
    });
  }

  // Start Application
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
