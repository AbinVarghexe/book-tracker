/**
 * SuperrBook — Book Tracker Application
 * Built with Vanilla JavaScript ES6+
 * Adheres to AGENTS.md and Superr Style Reference in design.md
 */

(function () {
  'use strict';

  // Base storage key prefix
  const STORAGE_PREFIX = 'superrbook_books_';
  const USER_STORAGE_KEY = 'superrbook_current_user';

  // Initial Seed Data for first-time visitors or new users
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
  let currentUser = null; // null = guest, or { id, name, email, avatar }
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

  // DOM Elements - Stats
  const statTotal = document.getElementById('statTotal');
  const statToRead = document.getElementById('statToRead');
  const statReading = document.getElementById('statReading');
  const statFinished = document.getElementById('statFinished');

  const countFilterAll = document.getElementById('countFilterAll');
  const countFilterToRead = document.getElementById('countFilterToRead');
  const countFilterReading = document.getElementById('countFilterReading');
  const countFilterFinished = document.getElementById('countFilterFinished');

  // DOM Elements - Auth & Profile
  const googleSignInBtn = document.getElementById('googleSignInBtn');
  const userProfileMenu = document.getElementById('userProfileMenu');
  const userChipBtn = document.getElementById('userChipBtn');
  const userAvatarImg = document.getElementById('userAvatarImg');
  const userDisplayName = document.getElementById('userDisplayName');
  const profileDropdown = document.getElementById('profileDropdown');
  const dropdownUserEmail = document.getElementById('dropdownUserEmail');
  const signOutBtn = document.getElementById('signOutBtn');
  const activeLibraryLabel = document.getElementById('activeLibraryLabel');

  // Notebook Sticker Elements
  const stickerUserName = document.getElementById('stickerUserName');
  const stickerUserStatus = document.getElementById('stickerUserStatus');

  // Auth Modal
  const authModal = document.getElementById('authModal');
  const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');

  // =========================================================================
  // Initialization & User Session
  // =========================================================================

  function initApp() {
    loadUserSession();
    loadBooksForCurrentUser();
    setupEventListeners();
    setupGoogleIdentity();
    renderApp();
  }

  function getUserStorageKey() {
    const userId = currentUser ? currentUser.id : 'guest';
    return STORAGE_PREFIX + userId;
  }

  function loadUserSession() {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        currentUser = JSON.parse(storedUser);
      }
    } catch (e) {
      console.error('Failed to load user session:', e);
      currentUser = null;
    }
    updateAuthUI();
  }

  function updateAuthUI() {
    if (currentUser) {
      googleSignInBtn.style.display = 'none';
      userProfileMenu.style.display = 'block';
      userAvatarImg.src = currentUser.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(currentUser.name);
      userDisplayName.textContent = currentUser.name.split(' ')[0];
      dropdownUserEmail.textContent = currentUser.email;
      activeLibraryLabel.textContent = `${currentUser.name}'s Library`;
      stickerUserName.textContent = currentUser.name;
    } else {
      googleSignInBtn.style.display = 'inline-flex';
      userProfileMenu.style.display = 'none';
      profileDropdown.classList.remove('open');
      activeLibraryLabel.textContent = 'Guest Library (Local)';
      stickerUserName.textContent = 'Avid Reader';
    }
  }

  // =========================================================================
  // LocalStorage Management per User
  // =========================================================================

  function loadBooksForCurrentUser() {
    const storageKey = getUserStorageKey();
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        books = JSON.parse(stored);
        if (!Array.isArray(books)) {
          books = INITIAL_SEED_BOOKS.slice();
          saveBooks();
        }
      } else {
        // First visit for this user / guest: Seed initial sample books
        books = INITIAL_SEED_BOOKS.slice();
        saveBooks();
      }
    } catch (e) {
      console.error('Failed to parse books from localStorage:', e);
      books = INITIAL_SEED_BOOKS.slice();
    }
  }

  function saveBooks() {
    const storageKey = getUserStorageKey();
    try {
      localStorage.setItem(storageKey, JSON.stringify(books));
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
      if (!titleValue) {
        bookTitleInput.focus();
      } else {
        bookAuthorInput.focus();
      }
      return;
    }

    // Create New Book Object (Newest first)
    const newBook = {
      id: 'book-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      title: titleValue,
      author: authorValue,
      status: statusValue,
      createdAt: Date.now()
    };

    // Prepend to array (newest first)
    books.unshift(newBook);
    saveBooks();

    // Reset Form
    bookForm.reset();
    bookStatusSelect.value = 'To read';
    clearErrors();

    // Re-render
    renderApp();
    bookTitleInput.focus();
  }

  // =========================================================================
  // Status Changing & Deleting
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
    const confirmed = window.confirm(`Remove "${book.title}" from your notebook?`);
    if (!confirmed) return;

    books.splice(bookIndex, 1);
    saveBooks();
    renderApp();
  }

  // =========================================================================
  // Search & Filtering
  // =========================================================================

  function getFilteredBooks() {
    const query = currentSearchQuery.toLowerCase().trim();

    return books.filter(book => {
      // Status filter
      if (currentStatusFilter !== 'All' && book.status !== currentStatusFilter) {
        return false;
      }

      // Case-insensitive title and author matching
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
  // Statistics & Counters
  // =========================================================================

  function updateStats() {
    const total = books.length;
    const toReadCount = books.filter(b => b.status === 'To read').length;
    const readingCount = books.filter(b => b.status === 'Reading').length;
    const finishedCount = books.filter(b => b.status === 'Finished').length;

    // Stat Cards
    statTotal.textContent = total;
    statToRead.textContent = toReadCount;
    statReading.textContent = readingCount;
    statFinished.textContent = finishedCount;

    // Filter Tab Badges
    countFilterAll.textContent = total;
    countFilterToRead.textContent = toReadCount;
    countFilterReading.textContent = readingCount;
    countFilterFinished.textContent = finishedCount;

    // Notebook sticker update
    stickerUserStatus.textContent = `${total} Book${total === 1 ? '' : 's'} Logged`;
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

    clearSearchBtn.style.display = currentSearchQuery ? 'flex' : 'none';

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

    bookList.innerHTML = filtered.map(book => {
      const badgeClass = getStatusBadgeClass(book.status);
      const formattedDate = formatDate(book.createdAt);

      return `
        <li class="book-card" data-id="${book.id}">
          <div class="book-card-accent ${badgeClass}"></div>
          <div class="book-info">
            <div class="book-title-row">
              <h4 class="book-title">${escapeHtml(book.title)}</h4>
            </div>
            <div class="book-author">
              <span class="author-prefix">by</span>
              <strong class="author-name">${escapeHtml(book.author)}</strong>
            </div>
            ${formattedDate ? `<div class="book-meta-date"><span class="meta-icon">📅</span> Added on ${formattedDate}</div>` : ''}
          </div>

          <div class="book-actions">
            <!-- Status Badge & Selector -->
            <div class="status-pill-control" title="Click to change reading status">
              <span class="status-badge ${badgeClass}">
                <span class="status-dot">●</span>
                <span class="status-text">${escapeHtml(book.status)}</span>
                <svg class="status-arrow" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
              <select class="status-change-select" aria-label="Change status for ${escapeHtml(book.title)}">
                <option value="To read" ${book.status === 'To read' ? 'selected' : ''}>To read</option>
                <option value="Reading" ${book.status === 'Reading' ? 'selected' : ''}>Reading</option>
                <option value="Finished" ${book.status === 'Finished' ? 'selected' : ''}>Finished</option>
              </select>
            </div>

            <!-- Delete Button -->
            <button type="button" class="btn-delete" title="Delete book" aria-label="Delete ${escapeHtml(book.title)}">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
  // Google Authentication & User Switching
  // =========================================================================

  function setupGoogleIdentity() {
    // If Google Identity Services script loads and client ID is provided in future:
    window.handleGoogleCredentialResponse = function (response) {
      try {
        // Decode JWT payload
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);

        signInUser({
          id: 'google-' + payload.sub,
          name: payload.name || 'Google User',
          email: payload.email || 'user@gmail.com',
          avatar: payload.picture
        });
      } catch (err) {
        console.error('Error decoding Google credential:', err);
      }
    };
  }

  function signInUser(userObj) {
    currentUser = userObj;
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } catch (e) {
      console.error('Failed to save user session:', e);
    }

    updateAuthUI();
    loadBooksForCurrentUser();
    renderApp();
    closeAuthModal();
  }

  function signOutUser() {
    currentUser = null;
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to remove user session:', e);
    }

    updateAuthUI();
    loadBooksForCurrentUser();
    renderApp();
  }

  function openAuthModal() {
    authModal.style.display = 'flex';
  }

  function closeAuthModal() {
    authModal.style.display = 'none';
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

      filterTabs.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      tab.classList.add('active');

      currentStatusFilter = filter;
      renderApp();
    });

    // Status Change & Delete on Book List
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

    // Auth interactions
    googleSignInBtn.addEventListener('click', openAuthModal);
    closeAuthModalBtn.addEventListener('click', closeAuthModal);

    // Profile dropdown toggle
    userChipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!profileDropdown.contains(e.target) && !userChipBtn.contains(e.target)) {
        profileDropdown.classList.remove('open');
      }
    });

    signOutBtn.addEventListener('click', () => {
      signOutUser();
    });

    // Demo Google accounts in modal
    document.querySelectorAll('.btn-demo-user').forEach(btn => {
      btn.addEventListener('click', () => {
        const userType = btn.dataset.user;
        if (userType === 'alex') {
          signInUser({
            id: 'demo-alex',
            name: 'Alex Reed',
            email: 'alex.reed@gmail.com',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'
          });
        } else if (userType === 'priya') {
          signInUser({
            id: 'demo-priya',
            name: 'Priya Nair',
            email: 'priya.nair@gmail.com',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80'
          });
        }
      });
    });

    // Close modal on outside click
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) {
        closeAuthModal();
      }
    });

    // Escape shortcut
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (authModal.style.display === 'flex') {
          closeAuthModal();
        } else if (searchInput.value) {
          searchInput.value = '';
          currentSearchQuery = '';
          renderApp();
        }
      }
    });
  }

  // Run on ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
