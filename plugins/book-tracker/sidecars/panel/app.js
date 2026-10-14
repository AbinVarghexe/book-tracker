/**
 * SuperrBook — Tactile Book Tracker Application
 * Built with Vanilla JavaScript ES6+
 * Adheres to AGENTS.md, design.md tokens, and refero-design principles
 */

(function () {
  'use strict';

  // Primary localStorage key
  const STORAGE_KEY = 'superrbook_books_v1';
  const LEGACY_STORAGE_KEY = 'superrbook_books_guest';

  // Initial Seed Data for first-time visitors
  const INITIAL_SEED_BOOKS = [
    {
      id: 'book-seed-1',
      title: 'Aadujeevitham',
      author: 'Benyamin',
      status: 'To read',
      createdAt: Date.now() - 1000 * 60 * 60 * 24
    },
    {
      id: 'book-seed-2',
      title: 'Atomic Habits',
      author: 'James Clear',
      status: 'Reading',
      createdAt: Date.now() - 1000 * 60 * 60 * 48
    },
    {
      id: 'book-seed-3',
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      status: 'Finished',
      createdAt: Date.now() - 1000 * 60 * 60 * 72
    }
  ];

  // App State
  let books = [];
  let currentSearchQuery = '';
  let currentStatusFilter = 'All';

  // DOM Elements - Form & Inputs
  const bookForm = document.getElementById('bookForm');
  const bookTitleInput = document.getElementById('bookTitle');
  const bookAuthorInput = document.getElementById('bookAuthor');
  const bookStatusSelect = document.getElementById('bookStatus');
  const titleError = document.getElementById('titleError');
  const authorError = document.getElementById('authorError');

  // DOM Elements - Search & Filter
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const filterTabs = document.getElementById('filterTabs');
  const bookList = document.getElementById('bookList');
  const emptyState = document.getElementById('emptyState');
  const emptyTitle = document.getElementById('emptyTitle');
  const emptyDesc = document.getElementById('emptyDesc');
  const listHeading = document.getElementById('listHeading');
  const listSub = document.getElementById('listSub');

  // DOM Elements - Stats
  const statTotal = document.getElementById('statTotal');
  const statToRead = document.getElementById('statToRead');
  const statReading = document.getElementById('statReading');
  const statFinished = document.getElementById('statFinished');

  const countFilterAll = document.getElementById('countFilterAll');
  const countFilterToRead = document.getElementById('countFilterToRead');
  const countFilterReading = document.getElementById('countFilterReading');
  const countFilterFinished = document.getElementById('countFilterFinished');

  // Notebook Sticker Elements
  const stickerUserName = document.getElementById('stickerUserName');
  const stickerUserStatus = document.getElementById('stickerUserStatus');

  // =========================================================================
  // Initialization & Local Storage
  // =========================================================================

  function initApp() {
    loadBooks();
    setupEventListeners();
    renderApp();
  }

  function loadBooks() {
    try {
      let stored = localStorage.getItem(STORAGE_KEY);
      // Fallback/migrate from legacy key if primary doesn't exist
      if (!stored) {
        stored = localStorage.getItem(LEGACY_STORAGE_KEY);
      }

      if (stored) {
        books = JSON.parse(stored);
        if (!Array.isArray(books)) {
          books = [...INITIAL_SEED_BOOKS];
        }
      } else {
        books = [...INITIAL_SEED_BOOKS];
        saveBooks();
      }
    } catch (e) {
      console.error('Failed to load books from localStorage:', e);
      books = [...INITIAL_SEED_BOOKS];
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
  // Event Listeners
  // =========================================================================

  function setupEventListeners() {
    // Form submission
    if (bookForm) {
      bookForm.addEventListener('submit', handleFormSubmit);
    }

    // Real-time input validation clearance
    if (bookTitleInput) {
      bookTitleInput.addEventListener('input', () => {
        if (bookTitleInput.value.trim()) {
          clearInputError(bookTitleInput, titleError);
        }
      });
    }

    if (bookAuthorInput) {
      bookAuthorInput.addEventListener('input', () => {
        if (bookAuthorInput.value.trim()) {
          clearInputError(bookAuthorInput, authorError);
        }
      });
    }

    // Real-time search
    if (searchInput) {
      searchInput.addEventListener('input', handleSearchInput);
    }

    // Clear search
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          currentSearchQuery = '';
          clearSearchBtn.style.display = 'none';
          searchInput.focus();
          renderApp();
        }
      });
    }

    // Filter tab clicks
    if (filterTabs) {
      filterTabs.addEventListener('click', handleFilterClick);
    }

    // Event delegation on Book List for Status Change & Delete
    if (bookList) {
      bookList.addEventListener('change', handleListChange);
      bookList.addEventListener('click', handleListClick);
    }
  }

  // =========================================================================
  // Form Submission & Validation (Core Brief Requirements)
  // =========================================================================

  function handleFormSubmit(e) {
    e.preventDefault();

    const titleValue = bookTitleInput.value.trim();
    const authorValue = bookAuthorInput.value.trim();
    const statusValue = bookStatusSelect.value;

    let hasError = false;

    // Strict brief requirement: "Please enter a title"
    if (!titleValue) {
      showInputError(bookTitleInput, titleError, 'Please enter a title');
      hasError = true;
    } else {
      clearInputError(bookTitleInput, titleError);
    }

    // Strict brief requirement: "Please enter an author"
    if (!authorValue) {
      showInputError(bookAuthorInput, authorError, 'Please enter an author');
      hasError = true;
    } else {
      clearInputError(bookAuthorInput, authorError);
    }

    if (hasError) {
      // Focus first erroneous input
      if (!titleValue) {
        bookTitleInput.focus();
      } else if (!authorValue) {
        bookAuthorInput.focus();
      }
      return;
    }

    // Create new book object (newest first: placed at start of array)
    const newBook = {
      id: 'book-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      title: titleValue,
      author: authorValue,
      status: statusValue || 'To read',
      createdAt: Date.now()
    };

    // Prepend to books list
    books.unshift(newBook);
    saveBooks();

    // Reset Form
    bookForm.reset();
    bookStatusSelect.value = 'To read';
    clearInputError(bookTitleInput, titleError);
    clearInputError(bookAuthorInput, authorError);

    // Re-render
    renderApp();

    // Gentle focus return
    bookTitleInput.focus();
  }

  function showInputError(inputEl, errorEl, message) {
    if (inputEl) inputEl.classList.add('input-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }

  function clearInputError(inputEl, errorEl) {
    if (inputEl) inputEl.classList.remove('input-error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  }

  // =========================================================================
  // Search & Filter Logic
  // =========================================================================

  function handleSearchInput(e) {
    currentSearchQuery = e.target.value.trim();
    if (clearSearchBtn) {
      clearSearchBtn.style.display = currentSearchQuery ? 'flex' : 'none';
    }
    renderFilteredBooks();
  }

  function handleFilterClick(e) {
    const tabBtn = e.target.closest('.tab-btn');
    if (!tabBtn) return;

    const filter = tabBtn.getAttribute('data-filter');
    if (!filter) return;

    currentStatusFilter = filter;

    // Update active tab styles
    const allTabs = filterTabs.querySelectorAll('.tab-btn');
    allTabs.forEach(tab => tab.classList.remove('active'));
    tabBtn.classList.add('active');

    renderFilteredBooks();
  }

  // Case-insensitive matching for both title AND author
  function filterBooks() {
    let result = [...books];

    // Status filter
    if (currentStatusFilter && currentStatusFilter !== 'All') {
      result = result.filter(book => book.status === currentStatusFilter);
    }

    // Search query filter (matches "ben", "BEN", etc.)
    if (currentSearchQuery) {
      const q = currentSearchQuery.toLowerCase();
      result = result.filter(book => {
        const titleMatch = (book.title || '').toLowerCase().includes(q);
        const authorMatch = (book.author || '').toLowerCase().includes(q);
        return titleMatch || authorMatch;
      });
    }

    return result;
  }

  // =========================================================================
  // In-Card Status Changing & Deletion
  // =========================================================================

  function handleListChange(e) {
    const select = e.target.closest('.status-change-select');
    if (!select) return;

    const bookId = select.getAttribute('data-book-id');
    const newStatus = select.value;

    const book = books.find(b => b.id === bookId);
    if (book) {
      book.status = newStatus;
      saveBooks();
      renderApp();
    }
  }

  function handleListClick(e) {
    const deleteBtn = e.target.closest('.btn-delete-book');
    if (!deleteBtn) return;

    const bookId = deleteBtn.getAttribute('data-book-id');
    if (!bookId) return;

    // Find and remove book
    const index = books.findIndex(b => b.id === bookId);
    if (index !== -1) {
      books.splice(index, 1);
      saveBooks();
      renderApp();
    }
  }

  // =========================================================================
  // Rendering UI
  // =========================================================================

  function renderApp() {
    updateStatsBar();
    renderFilteredBooks();
    updateNotebookSticker();
  }

  function updateStatsBar() {
    const total = books.length;
    const toRead = books.filter(b => b.status === 'To read').length;
    const reading = books.filter(b => b.status === 'Reading').length;
    const finished = books.filter(b => b.status === 'Finished').length;

    // Top Stats Bar
    if (statTotal) statTotal.textContent = total;
    if (statToRead) statToRead.textContent = toRead;
    if (statReading) statReading.textContent = reading;
    if (statFinished) statFinished.textContent = finished;

    // Filter Tab Count Badges
    if (countFilterAll) countFilterAll.textContent = total;
    if (countFilterToRead) countFilterToRead.textContent = toRead;
    if (countFilterReading) countFilterReading.textContent = reading;
    if (countFilterFinished) countFilterFinished.textContent = finished;
  }

  function updateNotebookSticker() {
    if (stickerUserName) {
      stickerUserName.textContent = 'Avid Bookworm';
    }
    if (stickerUserStatus) {
      const count = books.length;
      stickerUserStatus.textContent = count === 1 ? '1 Book Tracked' : `${count} Books Tracked`;
    }
  }

  function renderFilteredBooks() {
    const filtered = filterBooks();

    // Update List Meta Heading
    if (listHeading) {
      if (currentStatusFilter === 'All') {
        listHeading.textContent = 'All Books';
      } else {
        listHeading.textContent = `${currentStatusFilter} Books`;
      }
    }

    if (listSub) {
      if (currentSearchQuery) {
        listSub.textContent = `Showing ${filtered.length} matching "${currentSearchQuery}"`;
      } else {
        listSub.textContent = `Showing ${filtered.length} books • Newest first`;
      }
    }

    // Toggle Empty State vs Book List
    if (filtered.length === 0) {
      if (bookList) bookList.innerHTML = '';
      if (emptyState) {
        emptyState.style.display = 'block';
        if (currentSearchQuery) {
          if (emptyTitle) emptyTitle.textContent = `No books match "${currentSearchQuery}"`;
          if (emptyDesc) emptyDesc.textContent = 'Check your spelling or search for another author or title keyword.';
        } else if (currentStatusFilter !== 'All') {
          if (emptyTitle) emptyTitle.textContent = `No books in "${currentStatusFilter}"`;
          if (emptyDesc) emptyDesc.textContent = `You don't have any books marked as "${currentStatusFilter}" yet.`;
        } else {
          if (emptyTitle) emptyTitle.textContent = 'Your bookshelf is empty';
          if (emptyDesc) emptyDesc.textContent = 'Add your first book using the form on the left to start tracking!';
        }
      }
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Build Book Cards HTML
    if (bookList) {
      bookList.innerHTML = filtered.map(book => createBookCardHTML(book)).join('');
    }
  }

  // Escape HTML helper to prevent XSS
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatDate(timestamp) {
    if (!timestamp) return 'Recently';
    const date = new Date(timestamp);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  function createBookCardHTML(book) {
    const safeTitle = escapeHTML(book.title);
    const safeAuthor = escapeHTML(book.author);
    const safeStatus = book.status || 'To read';
    const dateFormatted = formatDate(book.createdAt);

    let statusClass = 'badge-toread';
    let statusIcon = '⏳';
    if (safeStatus === 'Reading') {
      statusClass = 'badge-reading';
      statusIcon = '📖';
    } else if (safeStatus === 'Finished') {
      statusClass = 'badge-finished';
      statusIcon = '🏆';
    }

    // Get an initial letter for the tactile spine thumbnail
    const initialLetter = safeTitle.charAt(0).toUpperCase() || 'B';

    return `
      <li class="book-card" data-book-id="${book.id}">
        <!-- Tactile Spine Accent Stripe -->
        <div class="book-card-accent ${statusClass}"></div>

        <!-- Book Jacket Thumbnail -->
        <div class="book-spine-thumb ${statusClass}">
          <span class="spine-letter">${initialLetter}</span>
        </div>

        <!-- Book Core Information -->
        <div class="book-info">
          <h4 class="book-title" title="${safeTitle}">${safeTitle}</h4>
          <p class="book-author">
            <span class="author-prefix">by</span>
            <span class="author-name">${safeAuthor}</span>
          </p>
          <div class="book-meta-date">
            <svg class="meta-calendar-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Added on ${dateFormatted}</span>
          </div>
        </div>

        <!-- Book Actions: Interactive Status Dropdown & Delete -->
        <div class="book-actions">
          <!-- Status Selector Pill -->
          <div class="status-pill-control">
            <div class="status-badge ${statusClass}">
              <span class="status-icon">${statusIcon}</span>
              <span class="status-text">${safeStatus}</span>
              <svg class="status-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            <select class="status-change-select" data-book-id="${book.id}" aria-label="Change status for ${safeTitle}">
              <option value="To read" ${safeStatus === 'To read' ? 'selected' : ''}>To read</option>
              <option value="Reading" ${safeStatus === 'Reading' ? 'selected' : ''}>Reading</option>
              <option value="Finished" ${safeStatus === 'Finished' ? 'selected' : ''}>Finished</option>
            </select>
          </div>

          <!-- Delete Button -->
          <button type="button" class="btn-delete-book" data-book-id="${book.id}" title="Remove book from shelf" aria-label="Delete ${safeTitle}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </li>
    `;
  }

  // Kickstart Application on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
