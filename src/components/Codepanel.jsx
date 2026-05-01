import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate, useParams } from 'react-router';
import { Trash2, Plus, Code, Beaker, FileText, Save } from 'lucide-react';

const LANGUAGES = ["c++", "c", "java"];

// Updated schema to match your Mongoose "graph" spelling
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  tags: z.enum(['array', 'linkedlist', 'graph', 'dp']),
  visibleTestCases: z.array(z.object({
    input: z.string().min(1, 'Input is required'),
    output: z.string().min(1, 'Output is required'),
    explanation: z.string().min(1, 'Explanation is required'),
  })).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(z.object({
    input: z.string().min(1, 'Input is required'),
    output: z.string().min(1, 'Output is required'),
  })).min(1, 'At least one hidden test case required'),
  startCode: z.array(z.object({
    language: z.string(),
    initialCode: z.string(),
    hiddenStartCode: z.string(),
    functionCall: z.string()
  })),
  referenceSolution: z.array(z.object({
    language: z.string(),
    completeCode: z.string()
  }))
});

function AdminPanel() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
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

  useEffect(() => {
    if (id) {
      const fetchProblem = async () => {
        try {
          setLoading(true);
          const res = await axiosClient.get(`/problem/ProblemById/${id}`);
          reset(res.data);
        } catch (err) {
          console.error("Fetch Error:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchProblem();
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      // Filter out languages where the user didn't write any code
      const filteredData = {
        ...data,
        startCode: data.startCode.filter(c => c.initialCode.trim() !== ""),
        referenceSolution: data.referenceSolution.filter(s => s.completeCode.trim() !== "")
      };
  
      if (id) {
        await axiosClient.put(`/problem/update/${id}`, filteredData);
        alert('Problem updated successfully!');
      } else {
        await axiosClient.post('/problem/create', filteredData);
        alert('Problem created successfully!');
      }
      navigate('/admin');
    } catch (error) {
      console.error("Submission Error:", error);
      alert(`Error: ${error.response?.data || error.message}`);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  console.log("Validation Errors:", errors); // Add this line
  return (
    <div className="container mx-auto p-6 bg-base-300 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{id ? 'Edit Problem' : 'Create New Problem'}</h1>
        <div className="badge badge-secondary p-4">{id ? `Editing: ${id}` : 'Draft Mode'}</div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* --- SECTION 1: BASIC INFO --- */}
        <div className="card bg-base-100 shadow-xl p-6 border-t-4 border-primary">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-primary">
            <FileText size={22}/> Core Details
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="form-control">
              <label className="label font-medium">Problem Title</label>
              <input {...register('title')} placeholder="e.g. Two Sum" className={`input input-bordered ${errors.title && 'input-error'}`} />
              {errors.title && <p className="text-error text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div className="form-control">
              <label className="label font-medium">Problem Description (Markdown Supported)</label>
              <textarea {...register('description')} className={`textarea textarea-bordered h-32 ${errors.description && 'textarea-error'}`} />
              {errors.description && <p className="text-error text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="form-control flex-1">
                <label className="label font-medium">Difficulty</label>
                <select {...register('difficulty')} className="select select-bordered w-full">
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="form-control flex-1">
                <label className="label font-medium">Topic Tag</label>
                <select {...register('tags')} className="select select-bordered w-full text-capitalize">
                  <option value="array">Array</option>
                  <option value="linkedlist">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">Dynamic Programming</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: TEST CASES --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visible Test Cases */}
          <div className="card bg-base-100 shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2"><Beaker size={18} className="text-success"/> Public Test Cases</h2>
              <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="btn btn-sm btn-ghost text-success">
                <Plus size={16}/> Add
              </button>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {visibleFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-base-200 rounded-xl relative border border-base-300">
                   <button type="button" onClick={() => removeVisible(index)} className="absolute top-2 right-2 text-error hover:scale-110 transition-transform">
                    <Trash2 size={16}/>
                  </button>
                  <div className="grid gap-2">
                    <input {...register(`visibleTestCases.${index}.input`)} placeholder="Input" className="input input-sm input-bordered w-full" />
                    <input {...register(`visibleTestCases.${index}.output`)} placeholder="Expected Output" className="input input-sm input-bordered w-full" />
                    <textarea {...register(`visibleTestCases.${index}.explanation`)} placeholder="Explanation for the user..." className="textarea textarea-sm textarea-bordered w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hidden Test Cases */}
          <div className="card bg-base-100 shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2"><Beaker size={18} className="text-warning"/> Private (Judge) Cases</h2>
              <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="btn btn-sm btn-ghost text-warning">
                <Plus size={16}/> Add
              </button>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {hiddenFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-base-200 rounded-xl relative border border-base-300">
                  <button type="button" onClick={() => removeHidden(index)} className="absolute top-2 right-2 text-error hover:scale-110 transition-transform">
                    <Trash2 size={16}/>
                  </button>
                  <div className="grid gap-2">
                    <input {...register(`hiddenTestCases.${index}.input`)} placeholder="Input" className="input input-sm input-bordered w-full" />
                    <input {...register(`hiddenTestCases.${index}.output`)} placeholder="Expected Output" className="input input-sm input-bordered w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- SECTION 3: CODE TEMPLATES --- */}
        {LANGUAGES.map((lang, index) => (
        <div key={lang} className="collapse collapse-arrow bg-base-200">
          <input type="checkbox" defaultChecked={index === 0} /> 
          <div className="collapse-title text-md font-bold uppercase flex items-center gap-2">
            {lang}
          </div>
          <div className="collapse-content">
            {/* ADD THESE TWO HIDDEN INPUTS */}
            <input type="hidden" {...register(`startCode.${index}.language`)} value={lang} />
            <input type="hidden" {...register(`referenceSolution.${index}.language`)} value={lang} />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-2">
              <div className="form-control">
                <label className="label text-xs font-bold opacity-70">STARTER TEMPLATE</label>
                <textarea 
                  {...register(`startCode.${index}.initialCode`)} 
                  className="textarea textarea-bordered border-accent font-mono text-sm h-48 bg-neutral text-neutral-content"
                />
              </div>
              <div className="form-control">
                <label className="label text-xs font-bold opacity-60">HIDDEN SETUP (Before User Code)</label>
                <textarea {...register(`startCode.${index}.hiddenStartCode`)} placeholder="int n; cin >> n;" className="textarea textarea-bordered border-accent font-mono text-sm h-48 bg-neutral text-neutral-content"/>
              </div>

              <div className="form-control">
                <label className="label text-xs font-bold opacity-60">FUNCTION CALL (After User Code)</label>
                <textarea {...register(`startCode.${index}.functionCall`)} placeholder="cout << sumOfNumbers(n);" className="textarea textarea-bordered border-accent font-mono text-sm h-48 bg-neutral text-neutral-content" />
              </div>
              <div className="form-control">
                <label className="label text-xs font-bold opacity-70">REFERENCE SOLUTION</label>
                <textarea 
                  {...register(`referenceSolution.${index}.completeCode`)} 
                  className="textarea textarea-bordered border-accent font-mono text-sm h-48 bg-neutral text-neutral-content" 
                />
              </div>
            </div>
          </div>
        </div>
        ))}

        {/* --- SUBMIT BUTTON --- */}
        <div className="sticky bottom-4 z-10">
          <button type="submit" disabled={isSubmitting} className={`btn btn-primary btn-block shadow-2xl gap-2 text-lg h-16 ${isSubmitting && 'loading'}`}>
            {!isSubmitting && <Save size={20} />}
            {isSubmitting ? 'Processing Submission...' : id ? 'Update Challenge' : 'Publish Challenge'}
           
          </button>
        </div>

      </form>
    </div>
  );
}

export default AdminPanel;