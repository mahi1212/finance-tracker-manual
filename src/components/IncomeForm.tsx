import React, { useState } from 'react';
import { Income, Project } from '../types';

interface IncomeFormProps {
  addIncome: (income: Income) => void;
  projects: Project[];
  darkMode: boolean;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ addIncome, projects, darkMode }) => {
  const [date, setDate] = useState('');
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && source && amount) {
      const newIncome: Income = {
        id: Date.now().toString(),
        date,
        source,
        amount: parseFloat(amount),
        description,
        projectId: projectId || undefined,
      };
      addIncome(newIncome);
      setDate('');
      setSource('');
      setAmount('');
      setDescription('');
      setProjectId('');
    }
  };

  const inputClass = `w-full p-2 rounded ${
    darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
  }`;

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Add Income</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="block mb-2">Source</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="block mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="block mb-2">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-2">Project (Optional)</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className={inputClass}
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        className={`mt-4 px-4 py-2 rounded ${
          darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
        } text-white`}
      >
        Add Income
      </button>
    </form>
  );
};

export default IncomeForm;