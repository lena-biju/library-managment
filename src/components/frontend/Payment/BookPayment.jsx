import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import { getBookById } from '../../../booksData';
import './BookPayment.css';

const BookPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const action = searchParams.get('action');
  const bookId = searchParams.get('bookId');
  const book = getBookById(parseInt(bookId));

  if (!book) {
    navigate('/');
    return null;
  }

  // Set default prices if not available
  const bookPrice = book.price || 29.99;
  const rentPrice = book.rentPrice || 9.99;
  
  // Calculate amount based on action
  const amount = action === 'buy' ? bookPrice : rentPrice;
  const actionText = action === 'buy' ? 'Purchase' : 'Rent';

  const handlePayment = (event) => {
    event.preventDefault();
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      alert('Please login to continue');
      navigate('/login');
      return;
    }

    // Get existing transactions
    const allTransactions = JSON.parse(localStorage.getItem('userTransactions') || '{}');
    const userTransactions = allTransactions[currentUser.phone] || { purchased: [], rented: [] };

    // Add new transaction
    const newTransaction = {
      bookId: book.id,
      date: new Date().toISOString(),
      amount: amount,
      title: book.title
    };

    if (action === 'buy') {
      userTransactions.purchased.push(newTransaction);
    } else {
      userTransactions.rented.push({
        ...newTransaction,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      });
    }

    // Save updated transactions
    allTransactions[currentUser.phone] = userTransactions;
    localStorage.setItem('userTransactions', JSON.stringify(allTransactions));

    // Show success message and redirect
    alert('Payment Successful! You can now read the book.');
    navigate(`/book/${bookId}`);
  };

  return (
    <div className="book-payment-page">
      <Navigation />
      
      <main className="payment-content paper-background">
        <div className="payment-container">
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="book-info">
              <img src={`/${book.cover_image}`} alt={book.title} className="book-cover" />
              <div className="book-details">
                <h3>{book.title}</h3>
                <p className="author">by {book.author.name}</p>
                <p className="action-type">{actionText} Book</p>
                <div className="price-breakdown">
                  <p className="total">Total Amount: <span>${amount.toFixed(2)}</span></p>
                  {action === 'rent' && (
                    <p className="rental-note">*Rental period: 30 days</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="payment-section">
            <div className="payment-header">
              <h2>Payment Information</h2>
              <div className="card-brands">
                <img src="/assets/images/payment/visa.png" alt="Visa" />
                <img src="/assets/images/payment/mastercard.png" alt="Mastercard" />
                <img src="/assets/images/payment/rupay.png" alt="Rupay" />
              </div>
            </div>
            
            <form onSubmit={handlePayment} className="payment-form">
              <div className="form-group">
                <label htmlFor="card-number">Card Number*</label>
                <input 
                  type="text" 
                  id="card-number" 
                  className="form-input" 
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                />
              </div>

              <div className="form-row-split">
                <div className="form-group half">
                  <label htmlFor="exp-month">Exp. Month*</label>
                  <select id="exp-month" className="form-select" required>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = (i + 1).toString().padStart(2, '0');
                      return (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="form-group half">
                  <label htmlFor="exp-year">Exp. Year*</label>
                  <select id="exp-year" className="form-select" required>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = (new Date().getFullYear() + i).toString();
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="cvv">CVV*</label>
                <input 
                  type="text" 
                  id="cvv" 
                  className="form-input" 
                  placeholder="123"
                  maxLength="4"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="name-on-card">Name on Card*</label>
                <input 
                  type="text" 
                  id="name-on-card" 
                  className="form-input" 
                  placeholder="Name as shown on card"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => navigate(`/book/${bookId}`)}>
                  Cancel
                </button>
                <button type="submit" className="pay-now-btn">
                  Pay Now ${amount.toFixed(2)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookPayment; 