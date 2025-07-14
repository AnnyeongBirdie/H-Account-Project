import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, TrendingUp, TrendingDown, DollarSign, Wallet, Calendar, Filter } from 'lucide-react';
import './HouseholdAccountBook.css';

const HouseholdAccountBook = () => {
  const [transactions, setTransactions] = useState([]);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = {
    expense: ['식비', '교통비', '공과금', '유흥비', '의료비', '쇼핑', '교육비', '보험비', '기타'],
    income: ['월급여', '프리렌스수입', '투자', '선물', '기타']
  };

  const resetForm = () => {
    setFormData({
      type: 'expense',
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleSubmit = () => {
    if (!formData.amount || !formData.category || !formData.description) return;

    const newTransaction = {
      id: editingId || Date.now(),
      ...formData,
      amount: parseFloat(formData.amount),
      timestamp: new Date().toISOString()
    };

    if (editingId) {
      setTransactions(prev => prev.map(t => t.id === editingId ? newTransaction : t));
      setEditingId(null);
    } else {
      setTransactions(prev => [...prev, newTransaction]);
    }

    resetForm();
    setIsAddingTransaction(false);
  };

  const handleEdit = (transaction) => {
    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      description: transaction.description,
      date: transaction.date
    });
    setEditingId(transaction.id);
    setIsAddingTransaction(true);
  };

  const handleDelete = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="account-book-container">
      <div className="account-book-wrapper">
        {/* Header */}
        <div className="header-card">
          <h1 className="header-title">우리집 가계부</h1>
          <p className="header-subtitle">우리의 초.간.단 수입 및 지출 기록</p>
        </div>

        {/* Summary Cards */}
        <div className="summary-grid">
          <div className="summary-card income">
            <div className="summary-card-content">
              <div>
                <p className="summary-card-text">총 수입</p>
                <p className="summary-card-amount">₩{totalIncome.toFixed(2)}</p>
              </div>
              <TrendingUp className="summary-card-icon" />
            </div>
          </div>
          
          <div className="summary-card expense">
            <div className="summary-card-content">
              <div>
                <p className="summary-card-text">총 지출</p>
                <p className="summary-card-amount">₩{totalExpenses.toFixed(2)}</p>
              </div>
              <TrendingDown className="summary-card-icon" />
            </div>
          </div>
          
          <div className={`summary-card balance ${balance < 0 ? 'negative' : ''}`}>
            <div className="summary-card-content">
              <div>
                <p className="summary-card-text">잔액</p>
                <p className="summary-card-amount">₩{balance.toFixed(2)}</p>
              </div>
              <Wallet className="summary-card-icon" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-card">
          <div className="controls-content">
            <div className="controls-left">
              <button
                onClick={() => setIsAddingTransaction(true)}
                className="btn btn-primary"
              >
                <Plus className="btn-icon" />
                거래 내역 추가
              </button>
            </div>
            
            <div className="controls-right">
              <input
                type="text"
                placeholder="거래 내역 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">모두</option>
                <option value="income">수입</option>
                <option value="expense">지출</option>
              </select>
            </div>
          </div>
        </div>

        {/* Add/Edit Transaction Form */}
        {isAddingTransaction && (
          <div className="form-card">
            <h2 className="form-title">
              {editingId ? 'Edit Transaction' : '새로운 거래 내역 추가'}
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">종류</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value, category: ''})}
                  className="form-input"
                >
                  <option value="expense">지출</option>
                  <option value="income">수입</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">카테고리</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="form-input"
                  required
                >
                  <option value="">선택하세요</option>
                  {categories[formData.type].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">금액</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="form-input"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">내용</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="form-input"
                  placeholder="거래 내역 메모"
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn btn-primary"
                >
                  {editingId ? 'Update' : '저장'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingTransaction(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="btn btn-secondary"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transactions List */}
        <div className="transactions-card">
          <h2 className="transactions-title">최근 거래 내역</h2>
          
          {filteredTransactions.length === 0 ? (
            <div className="transactions-empty">
              <Wallet className="transactions-empty-icon" />
              <p className="transactions-empty-text">기록을 찾지 못했습니다</p>
              <p className="transactions-empty-subtext">첫 거래 내역을 저장 하세요</p>
            </div>
          ) : (
            <div className="transactions-list">
              {filteredTransactions
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map(transaction => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-left">
                    <div className="transaction-content">
                      <div className={`transaction-indicator ${transaction.type}`}></div>
                      <div>
                        <p className="transaction-description">{transaction.description}</p>
                        <p className="transaction-meta">{transaction.category} • {transaction.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="transaction-right">
                    <span className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </span>
                    <div className="transaction-actions">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="transaction-action-btn edit"
                      >
                        <Edit3 className="transaction-action-icon" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="transaction-action-btn delete"
                      >
                        <Trash2 className="transaction-action-icon" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HouseholdAccountBook;