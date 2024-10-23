import React, { useState } from 'react';
import { Hash, Link, Clock } from 'lucide-react';
import type { Block } from '../types';
import { formatDistanceToNow } from 'date-fns';

const initialBlocks: Block[] = [
  {
    index: 0,
    timestamp: Date.now(),
    transactions: [],
    previousHash: "0",
    hash: "000dc75a315c77a1f9c98fb6247d03dd18ac52632d7dc6a9920261d8109b37cf",
    nonce: 0
  }
];

const Blockchain: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [newTransaction, setNewTransaction] = useState({ from: '', to: '', amount: 0 });

  const addBlock = () => {
    const previousBlock = blocks[blocks.length - 1];
    const newBlock: Block = {
      index: previousBlock.index + 1,
      timestamp: Date.now(),
      transactions: [newTransaction],
      previousHash: previousBlock.hash,
      hash: Math.random().toString(36).substring(2),
      nonce: Math.floor(Math.random() * 100000)
    };
    setBlocks([...blocks, newBlock]);
    setNewTransaction({ from: '', to: '', amount: 0 });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Educational Blockchain Visualizer</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Add Transaction</h3>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="From"
            className="flex-1 p-2 border rounded"
            value={newTransaction.from}
            onChange={(e) => setNewTransaction({ ...newTransaction, from: e.target.value })}
          />
          <input
            type="text"
            placeholder="To"
            className="flex-1 p-2 border rounded"
            value={newTransaction.to}
            onChange={(e) => setNewTransaction({ ...newTransaction, to: e.target.value })}
          />
          <input
            type="number"
            placeholder="Amount"
            className="flex-1 p-2 border rounded"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
          />
          <button
            onClick={addBlock}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Mine Block
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div key={block.hash} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Block #{block.index}</span>
              <span className="text-gray-500 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatDistanceToNow(block.timestamp, { addSuffix: true })}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Hash className="w-4 h-4 mr-2" />
                <span className="font-mono">{block.hash.substring(0, 20)}...</span>
              </div>
              <div className="flex items-center">
                <Link className="w-4 h-4 mr-2" />
                <span className="font-mono">{block.previousHash.substring(0, 20)}...</span>
              </div>
            </div>
            {block.transactions.length > 0 && (
              <div className="mt-2 p-2 bg-white rounded">
                <div className="text-sm font-semibold mb-1">Transactions:</div>
                {block.transactions.map((tx, i) => (
                  <div key={i} className="text-sm">
                    {tx.from} → {tx.to}: {tx.amount} coins
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blockchain;