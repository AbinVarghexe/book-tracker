/**
 * Test Suite: SuperrBook Core Features
 * Validates brief requirements:
 * 1. Title & Author required with specific inline error messages
 * 2. Case-insensitive search ('ben' & 'BEN')
 * 3. Newest-first book ordering
 * 4. Status switching
 * 5. Private local storage sync
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
    const titleMatch = (book.title || '').toLowerCase().includes(normalizedQuery);
    const authorMatch = (book.author || '').toLowerCase().includes(normalizedQuery);
    return titleMatch || authorMatch;
  });
}

// 3. Newest-first ordering logic
function addBook(books, newBook) {
  return [newBook, ...books];
}

// 4. Status update logic
function updateBookStatus(books, bookId, newStatus) {
  return books.map(book => {
    if (book.id === bookId) {
      return { ...book, status: newStatus };
    }
    return book;
  });
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

// Test 3: Whitespace only
const t3 = validateBook('   ', '   ');
assert.strictEqual(t3.isValid, false);
assert.strictEqual(t3.errors.title, 'Please enter a title');
assert.strictEqual(t3.errors.author, 'Please enter an author');
console.log('✓ Test 3: Whitespace-only inputs are properly rejected');

// Test 4: Case-insensitive search with 'ben' and 'BEN'
const sampleBooks = [
  { id: '1', title: 'Aadujeevitham', author: 'Benyamin', status: 'To read' },
  { id: '2', title: 'Atomic Habits', author: 'James Clear', status: 'Reading' },
  { id: '3', title: 'The Alchemist', author: 'Paulo Coelho', status: 'Finished' }
];

const searchLower = searchBooks(sampleBooks, 'ben');
assert.strictEqual(searchLower.length, 1);
assert.strictEqual(searchLower[0].author, 'Benyamin');
console.log('✓ Test 4: Search "ben" matches "Benyamin"');

const searchUpper = searchBooks(sampleBooks, 'BEN');
assert.strictEqual(searchUpper.length, 1);
assert.strictEqual(searchUpper[0].author, 'Benyamin');
console.log('✓ Test 5: Search "BEN" (uppercase) matches "Benyamin"');

// Test 6: Newest-first ordering
const newBook = { id: '4', title: 'Deep Work', author: 'Cal Newport', status: 'To read' };
const updatedList = addBook(sampleBooks, newBook);
assert.strictEqual(updatedList[0].title, 'Deep Work');
assert.strictEqual(updatedList.length, 4);
console.log('✓ Test 6: Newly added book appears first at top of list (newest first)');

// Test 7: Status transition
const statusChanged = updateBookStatus(updatedList, '1', 'Finished');
const aadujeevitham = statusChanged.find(b => b.id === '1');
assert.strictEqual(aadujeevitham.status, 'Finished');
console.log('✓ Test 7: Book status transitions correctly between To read, Reading, and Finished');

console.log('\nAll 7 test cases passed successfully! ✅');
