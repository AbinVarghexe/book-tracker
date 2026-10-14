/**
 * SuperrBook — Book Tracker Application
 * Built with Vanilla JavaScript ES6+
 * Adheres to AGENTS.md, Duolingo Style Reference, and custom 3D dropdown UI
 */

(function () {
  'use strict';

  // LocalStorage storage keys
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
  const bookStatusInput = document.getElementById('bookStatus');
  const titleError = document.getElementById('titleError');
  const authorError = document.getElementById('authorError');

  // Custom Form Dropdown Elements
  const formStatusContainer = document.getElementById('formStatusContainer');
  const formStatusTrigger = document.getElementById('formStatusTrigger');
  const formStatusTriggerIcon = document.getElementById('formStatusTriggerIcon');
  const formStatusTriggerText = document.getElementById('formStatusTriggerText');
  const formStatusMenu = document.getElementById('formStatusMenu');

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

  // =========================================================================
  // Initialization & Local Storage
  // =========================================================================

  function initApp() {
    loadBooks();
    setupEventListeners();
    setupFormCustomDropdown();
    renderApp();
  }

  function loadBooks() {
    try {
      let stored = localStorage.getItem(STORAGE_KEY);
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
  // Custom Form Dropdown Setup
  // =========================================================================

  function setupFormCustomDropdown() {
    if (!formStatusTrigger || !formStatusMenu) return;

    formStatusTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = formStatusMenu.style.display === 'flex';
      closeAllDropdowns();
      if (!isOpen) {
        formStatusMenu.style.display = 'flex';
        formStatusTrigger.setAttribute('aria-expanded', 'true');
      }
    });

    formStatusMenu.addEventListener('click', (e) => {
      const option = e.target.closest('.custom-option');
      if (!option) return;

      const val = option.getAttribute('data-value');
      setFormStatus(val);
      closeAllDropdowns();
    });
  }

  function setFormStatus(status) {
    if (bookStatusInput) {
      bookStatusInput.value = status;
    }

    let icon = '⏳';
    let label = 'To Read';

    if (status === 'Reading') {
      icon = '📖';
      label = 'Reading';
    } else if (status === 'Finished') {
      icon = '🏆';
      label = 'Finished';
    }

    if (formStatusTriggerIcon) formStatusTriggerIcon.textContent = icon;
    if (formStatusTriggerText) formStatusTriggerText.textContent = label;

    if (formStatusMenu) {
      const options = formStatusMenu.querySelectorAll('.custom-option');
      options.forEach(opt => {
        const isSelected = opt.getAttribute('data-value') === status;
        opt.classList.toggle('selected', isSelected);
        opt.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        const check = opt.querySelector('.option-check');
        if (check) check.style.display = isSelected ? 'inline' : 'none';
      });
    }
  }

  function closeAllDropdowns() {
    // Close form dropdown
    if (formStatusMenu) {
      formStatusMenu.style.display = 'none';
    }
    if (formStatusTrigger) {
      formStatusTrigger.setAttribute('aria-expanded', 'false');
    }

    // Close all open in-card popovers
    document.querySelectorAll('.card-status-popover').forEach(menu => {
      menu.style.display = 'none';
    });
    document.querySelectorAll('.status-btn-pill').forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  // =========================================================================
  // Event Listeners
  // =========================================================================

  function setupEventListeners() {
    // Form submission
    if (bookForm) {
      bookForm.addEventListener('submit', handleFormSubmit);
    }

    // Real-time input error clearing
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

    // Clear search button
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

    // Filter tab switching
    if (filterTabs) {
      filterTabs.addEventListener('click', handleFilterClick);
    }

    // Global click listener to close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-select-container') && !e.target.closest('.status-selector-container')) {
        closeAllDropdowns();
      }
    });

    // Escape key closes dropdowns
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllDropdowns();
      }
    });

    // In-card status change dropdown toggles & clicks
    if (bookList) {
      bookList.addEventListener('click', handleBookListClick);
    }
  }

  // =========================================================================
  // Form Submission & Validation (Core Brief Requirements)
  // =========================================================================

  function handleFormSubmit(e) {
    e.preventDefault();

    const titleValue = bookTitleInput.value.trim();
    const authorValue = bookAuthorInput.value.trim();
    const statusValue = bookStatusInput ? bookStatusInput.value : 'To read';

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
      if (!titleValue) {
        bookTitleInput.focus();
      } else if (!authorValue) {
        bookAuthorInput.focus();
      }
      return;
    }

    // Create new book (placed first: newest books first)
    const newBook = {
      id: 'book-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      title: titleValue,
      author: authorValue,
      status: statusValue || 'To read',
      createdAt: Date.now()
    };

    books.unshift(newBook);
    saveBooks();

    // Reset Form
    bookForm.reset();
    setFormStatus('To read');
    clearInputError(bookTitleInput, titleError);
    clearInputError(bookAuthorInput, authorError);

    // Re-render
    renderApp();
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
    const tabBtn = e.target.closest('.tab-pill');
    if (!tabBtn) return;

    const filter = tabBtn.getAttribute('data-filter');
    if (!filter) return;

    currentStatusFilter = filter;

    const allTabs = filterTabs.querySelectorAll('.tab-pill');
    allTabs.forEach(tab => tab.classList.remove('active'));
    tabBtn.classList.add('active');

    renderFilteredBooks();
  }

  function filterBooks() {
    let result = [...books];

    if (currentStatusFilter && currentStatusFilter !== 'All') {
      result = result.filter(book => book.status === currentStatusFilter);
    }

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
  // In-Card Custom Dropdown & Actions
  // =========================================================================

  function handleBookListClick(e) {
    // 1. Toggle In-Card Dropdown
    const triggerBtn = e.target.closest('.status-btn-pill');
    if (triggerBtn) {
      e.stopPropagation();
      const bookId = triggerBtn.getAttribute('data-book-id');
      const popover = document.getElementById(`statusPopover-${bookId}`);
      if (popover) {
        const isOpen = popover.style.display === 'flex';
        closeAllDropdowns();
        if (!isOpen) {
          popover.style.display = 'flex';
          triggerBtn.setAttribute('aria-expanded', 'true');
        }
      }
      return;
    }

    // 2. Select Option in Popover
    const optionEl = e.target.closest('.status-option');
    if (optionEl) {
      e.stopPropagation();
      const bookId = optionEl.getAttribute('data-book-id');
      const newStatus = optionEl.getAttribute('data-status');

      const book = books.find(b => b.id === bookId);
      if (book && newStatus) {
        book.status = newStatus;
        saveBooks();
        closeAllDropdowns();
        renderApp();
      }
      return;
    }

    // 3. Delete Book
    const deleteBtn = e.target.closest('.btn-delete-book');
    if (deleteBtn) {
      const bookId = deleteBtn.getAttribute('data-book-id');
      if (!bookId) return;

      const index = books.findIndex(b => b.id === bookId);
      if (index !== -1) {
        books.splice(index, 1);
        saveBooks();
        renderApp();
      }
    }
  }

  // =========================================================================
  // Rendering UI
  // =========================================================================

  function renderApp() {
    updateStatsBar();
    renderFilteredBooks();
  }

  function updateStatsBar() {
    const total = books.length;
    const toRead = books.filter(b => b.status === 'To read').length;
    const reading = books.filter(b => b.status === 'Reading').length;
    const finished = books.filter(b => b.status === 'Finished').length;

    if (statTotal) statTotal.textContent = total;
    if (statToRead) statToRead.textContent = toRead;
    if (statReading) statReading.textContent = reading;
    if (statFinished) statFinished.textContent = finished;

    if (countFilterAll) countFilterAll.textContent = total;
    if (countFilterToRead) countFilterToRead.textContent = toRead;
    if (countFilterReading) countFilterReading.textContent = reading;
    if (countFilterFinished) countFilterFinished.textContent = finished;
  }

  function renderFilteredBooks() {
    const filtered = filterBooks();

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
        listSub.textContent = `Showing ${filtered.length} books • Newest First`;
      }
    }

    if (filtered.length === 0) {
      if (bookList) bookList.innerHTML = '';
      if (emptyState) {
        emptyState.style.display = 'block';
        if (currentSearchQuery) {
          if (emptyTitle) emptyTitle.textContent = `No Books Match "${currentSearchQuery}"`;
          if (emptyDesc) emptyDesc.textContent = 'Check your spelling or search for another author or title keyword.';
        } else if (currentStatusFilter !== 'All') {
          if (emptyTitle) emptyTitle.textContent = `No Books in "${currentStatusFilter}"`;
          if (emptyDesc) emptyDesc.textContent = `You don't have any books marked as "${currentStatusFilter}" yet.`;
        } else {
          if (emptyTitle) emptyTitle.textContent = 'Your Bookshelf is Empty';
          if (emptyDesc) emptyDesc.textContent = 'Add your first book using the form on the left to start tracking!';
        }
      }
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    if (bookList) {
      bookList.innerHTML = filtered.map(book => createBookCardHTML(book)).join('');
    }
  }

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

    let statusClass = 'status-toread';
    let statusLabelCaps = 'TO READ';
    let statusIcon = '⏳';

    if (safeStatus === 'Reading') {
      statusClass = 'status-reading';
      statusLabelCaps = 'READING';
      statusIcon = '📖';
    } else if (safeStatus === 'Finished') {
      statusClass = 'status-finished';
      statusLabelCaps = 'FINISHED';
      statusIcon = '🏆';
    }

    const initialLetter = safeTitle.charAt(0).toUpperCase() || 'B';

    return `
      <li class="book-card" data-book-id="${book.id}">
        <!-- Book Jacket Badge Icon -->
        <div class="book-badge-icon ${statusClass}">
          <span class="badge-letter">${initialLetter}</span>
        </div>

        <!-- Book Details -->
        <div class="book-details">
          <h4 class="book-card-title" title="${safeTitle}">${safeTitle}</h4>
          <p class="book-card-author">
            <span class="by-text">By</span>
            <span class="author-name">${safeAuthor}</span>
          </p>
          <div class="book-card-meta">
            <svg class="meta-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Added on ${dateFormatted}</span>
          </div>
        </div>

        <!-- Custom 3D Dropdown Status Controls -->
        <div class="book-actions">
          <div class="status-selector-container">
            <button type="button" class="status-btn-pill ${statusClass}" data-book-id="${book.id}" aria-haspopup="listbox" aria-expanded="false" title="Click to change reading status">
              <span class="status-emoji">${statusIcon}</span>
              <span class="status-caps-text">${statusLabelCaps}</span>
              <svg class="chevron-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            <!-- Custom 3D Popover Menu -->
            <div class="card-status-popover" id="statusPopover-${book.id}" role="listbox" style="display: none;">
              <div class="status-option option-toread ${safeStatus === 'To read' ? 'active' : ''}" data-book-id="${book.id}" data-status="To read" role="option">
                <div class="option-content">
                  <span class="status-emoji">⏳</span>
                  <span class="status-option-title">TO READ</span>
                </div>
                ${safeStatus === 'To read' ? '<span class="status-check-mark">✓</span>' : ''}
              </div>
              <div class="status-option option-reading ${safeStatus === 'Reading' ? 'active' : ''}" data-book-id="${book.id}" data-status="Reading" role="option">
                <div class="option-content">
                  <span class="status-emoji">📖</span>
                  <span class="status-option-title">READING</span>
                </div>
                ${safeStatus === 'Reading' ? '<span class="status-check-mark">✓</span>' : ''}
              </div>
              <div class="status-option option-finished ${safeStatus === 'Finished' ? 'active' : ''}" data-book-id="${book.id}" data-status="Finished" role="option">
                <div class="option-content">
                  <span class="status-emoji">🏆</span>
                  <span class="status-option-title">FINISHED</span>
                </div>
                ${safeStatus === 'Finished' ? '<span class="status-check-mark">✓</span>' : ''}
              </div>
            </div>
          </div>

          <!-- Delete Button -->
          <button type="button" class="btn-delete-book" data-book-id="${book.id}" title="Remove from Bookshelf" aria-label="Delete ${safeTitle}">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
