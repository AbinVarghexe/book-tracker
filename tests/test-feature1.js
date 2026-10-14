/**
 * Test Suite: SuperrBook Core Features & Multi-User Isolation
 */

const assert = require('assert');

// 1. Validation logic
function validateBook(title, author) {
  const errors = {};
  const trimmedTitle = (title || '').trim();
  const trimmedAuthor = (author || '').trim();

  if (!trimmedTitle) {
    errors.title = 'Please enter a title';
  }
  if (!trimmedAuthor) {
    errors.author = 'Please enter an author';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: { title: trimmedTitle, author: trimmedAuthor }
  };
}

// 2. Case-insensitive search logic
function searchBooks(books, query) {
  const normalizedQuery = (query || '').toLowerCase().trim();
  if (!normalizedQuery) return books;
  return books.filter(book => {
    const titleMatch = book.title.toLowerCase().includes(normalizedQuery);
    const authorMatch = book.author.toLowerCase().includes(normalizedQuery);
    return titleMatch || authorMatch;
  });
}

// 3. Multi-user storage key logic
function getStorageKey(user) {
  return 'superrbook_books_' + (user ? user.id : 'guest');
}

console.log('--- Running SuperrBook Core Tests ---');

// Test 1: Empty title
const t1 = validateBook('', 'Benyamin');
assert.strictEqual(t1.isValid, false);
assert.strictEqual(t1.errors.title, 'Please enter a title');
console.log('✓ Test 1: Empty title correctly returns "Please enter a title"');

// Test 2: Empty author
const t2 = validateBook('Aadujeevitham', '');
assert.strictEqual(t2.isValid, false);
assert.strictEqual(t2.errors.author, 'Please enter an author');
console.log('✓ Test 2: Empty author correctly returns "Please enter an author"');

// Test 3: Case-insensitive search with 'ben' and 'BEN'
const sampleBooks = [
  { title: 'Aadujeevitham', author: 'Benyamin' },
  { title: 'Atomic Habits', author: 'James Clear' }
];

const searchLower = searchBooks(sampleBooks, 'ben');
assert.strictEqual(searchLower.length, 1);
assert.strictEqual(searchLower[0].author, 'Benyamin');
console.log('✓ Test 3: Search "ben" matches "Benyamin"');

const searchUpper = searchBooks(sampleBooks, 'BEN');
assert.strictEqual(searchUpper.length, 1);
assert.strictEqual(searchUpper[0].author, 'Benyamin');
console.log('✓ Test 4: Search "BEN" (uppercase) matches "Benyamin"');

// Test 4: Multi-user isolation
const guestKey = getStorageKey(null);
const alexKey = getStorageKey({ id: 'alex-123' });
assert.strictEqual(guestKey, 'superrbook_books_guest');
assert.strictEqual(alexKey, 'superrbook_books_alex-123');
assert.notStrictEqual(guestKey, alexKey);
console.log('✓ Test 5: Storage keys isolate books between Guest and Google users');

console.log('\nAll tests passed successfully! ✅');
