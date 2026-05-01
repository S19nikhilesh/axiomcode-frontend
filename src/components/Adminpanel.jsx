import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import { Trash2, Plus, Code, Beaker, FileText } from 'lucide-react';

// Zod schema matching your backend requirements
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  tags: z.enum(['array', 'linkedlist', 'garph', 'dp']),
  visibleTestCases: z.array(z.object({
    input: z.string().min(1, 'Input is required'),
    output: z.string().min(1, 'Output is required'),
    explanation: z.string().min(1, 'Explanation is required'),
  })).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(z.object({
    input: z.string().min(1, 'Input is required'),
    output: z.string().min(1, 'Output is required'),
  })),
  startCode: z.array(z.object({
    language: z.string(),
    initialCode: z.string(),
    hiddenStartCode: z.string(),
    functionCall: z.string()
  })),
  referenceSolution: z.array(z.object({
    language: z.string(),
    completeCode: z.string()
  })) // Match Mongoose 'required'
         // Match Mongoose 'required'
});

const LANGUAGES = ["c++", "c", "java"];

function Adminpanel() {
  const navigate = useNavigate();
  
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      difficulty: 'Easy',
      tags: 'array',
      visibleTestCases: [{ input: '', output: '', explanation: '' }],
      hiddenTestCases: [{ input: '', output: '' }],
      startCode: LANGUAGES.map(lang => ({ language: lang, initialCode: '',hiddenStartCode: '', functionCall: ''  })),
      referenceSolution: LANGUAGES.map(lang => ({ language: lang, completeCode: '' }))
    }
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: 'visibleTestCases' });
  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: 'hiddenTestCases' });

  const onSubmit = async (data) => {
    try {
      // Filter out empty code blocks before sending to avoid JDoodle errors
      const filteredData = {
        ...data,
        startCode: data.startCode.filter(c => c.initialCode.trim() !== ""),
        referenceSolution: data.referenceSolution.filter(s => s.completeCode.trim() !== "")
      };

      await axiosClient.post('/problem/create', filteredData);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data || error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-base-300 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Create New Problem</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* --- BASIC INFORMATION --- */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FileText size={20}/> Basic Information</h2>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Title</span></label>
              <input {...register('title')} className={`input input-bordered ${errors.title && 'input-error'}`} />
              {errors.title && <span className="text-error text-sm">{errors.title.message}</span>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Description</span></label>
              <textarea {...register('description')} className={`textarea textarea-bordered h-24 ${errors.description && 'textarea-error'}`} />
              {errors.description && <span className="text-error text-sm">{errors.description.message}</span>}
            </div>

            <div className="flex gap-4">
              <div className="form-control w-1/2">
                <label className="label"><span className="label-text">Difficulty</span></label>
                <select {...register('difficulty')} className="select select-bordered">
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="form-control w-1/2">
                <label className="label"><span className="label-text">Tag</span></label>
                <select {...register('tags')} className="select select-bordered">
                  <option value="array">Array</option>
                  <option value="linkedlist">Linked List</option>
                  <option value="garph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* --- TEST CASES --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Beaker size={20}/> Visible Test Cases</h2>
            {visibleFields.map((field, index) => (
              <div key={field.id} className="p-4 bg-base-200 rounded-lg mb-4 relative">
                <input {...register(`visibleTestCases.${index}.input`)} placeholder="Input" className="input input-sm w-full mb-2" />
                <input {...register(`visibleTestCases.${index}.output`)} placeholder="Output" className="input input-sm w-full mb-2" />
                <input {...register(`visibleTestCases.${index}.explanation`)} placeholder="Explanation" className="input input-sm w-full" />
                <button type="button" onClick={() => removeVisible(index)} className="absolute top-2 right-2 text-error"><Trash2 size={16}/></button>
              </div>
            ))}
            <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="btn btn-ghost btn-sm"><Plus size={16}/> Add Case</button>
          </div>

          <div className="card bg-base-100 shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Beaker size={20}/> Hidden Test Cases</h2>
            {hiddenFields.map((field, index) => (
              <div key={field.id} className="p-4 bg-base-200 rounded-lg mb-4 relative">
                <input {...register(`hiddenTestCases.${index}.input`)} placeholder="Input" className="input input-sm w-full mb-2" />
                <input {...register(`hiddenTestCases.${index}.output`)} placeholder="Output" className="input input-sm w-full" />
                <button type="button" onClick={() => removeHidden(index)} className="absolute top-2 right-2 text-error"><Trash2 size={16}/></button>
              </div>
            ))}
            <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="btn btn-ghost btn-sm"><Plus size={16}/> Add Case</button>
          </div>
        </div>

        {/* --- CODE TEMPLATES --- */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Code size={20}/> Code Templates & Solutions</h2>
          <div className="space-y-6">
            {LANGUAGES.map((lang, index) => (
              <div key={lang} className="border-t pt-4">
                <h3 className="font-bold uppercase text-primary mb-2">{lang}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <textarea {...register(`startCode.${index}.initialCode`)} placeholder="Initial Code (Starter)" className="textarea textarea-bordered font-mono text-sm h-32" />
                  <textarea {...register(`startCode.${index}.hiddenStartCode`)} placeholder="hidden start Code" className="textarea textarea-bordered font-mono text-sm h-32" />
                  <textarea {...register(`startCode.${index}.functionCall`)} placeholder="function call" className="textarea textarea-bordered font-mono text-sm h-32" />
                  <textarea {...register(`referenceSolution.${index}.completeCode`)} placeholder="Reference Solution (Must Pass)" className="textarea textarea-bordered textarea-primary font-mono text-sm h-32" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className={`btn btn-primary btn-block ${isSubmitting && 'loading'}`}>
          {isSubmitting ? 'Verifying & Saving...' : 'Create Problem'}
        </button>

      </form>
    </div>
  );
}

export default Adminpanel;