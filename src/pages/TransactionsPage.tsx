import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';

const TransactionsPage: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<TransactionList />} />
        <Route path="/new" element={<TransactionForm />} />
        <Route path="/edit/:id" element={<TransactionForm editMode />} />
      </Routes>
    </div>
  );
};

export default TransactionsPage;