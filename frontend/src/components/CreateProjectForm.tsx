// src/components/CreateProjectForm.tsx
'use client';
import { useState } from 'react';

export const CreateProjectForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    description: '',
    category: 'Technology',
    // Funding Details
    fundingGoal: '',
    fundingGoalToken: 'ETH',
    deadline: '',
    // Milestones
    milestones: [{ title: '', description: '', amount: '', deadline: '' }],
    // Token Economics
    investorPercentage: 75,
    creatorPercentage: 20,
    platformPercentage: 5,
    revenueShare: 20
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMilestoneChange = (index: number, field: string, value: string) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index] = {
      ...newMilestones[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      milestones: newMilestones
    }));
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { title: '', description: '', amount: '', deadline: '' }]
    }));
  };

  const removeMilestone = (index: number) => {
    if (formData.milestones.length <= 1) return;
    const newMilestones = [...formData.milestones];
    newMilestones.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      milestones: newMilestones
    }));
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call a backend function to create the project
    alert('Project created successfully!');
  };

  // Calculate total percentage
  const totalPercentage = formData.investorPercentage + formData.creatorPercentage + formData.platformPercentage;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step indicator */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-700 z-0"></div>
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="relative z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= num ? 'bg-purple-600' : 'bg-gray-700'
              }`}
            >
              {num}
            </div>
            <div className="text-center mt-2 text-sm">
              {num === 1 && 'Basic Info'}
              {num === 2 && 'Details'}
              {num === 3 && 'Economics'}
              {num === 4 && 'Preview'}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Project Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Project Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your project title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Describe your project in detail"
                  required
                ></textarea>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Technology">Technology</option>
                  <option value="Music">Music</option>
                  <option value="Film">Film</option>
                  <option value="Art">Art</option>
                  <option value="Design">Design</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Teaser Media</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-12l-3.086-3.086a3.5 3.5 0 10-4.95 4.95L21 14m3.166 4.833L21 14m0 0l3.166-3.166m-3.166 3.166l3.166 3.166" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-400">
                    <span className="text-purple-500 font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">MP4, MOV, MP3, WAV up to 500MB</p>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Pitch Deck</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-12l-3.086-3.086a3.5 3.5 0 10-4.95 4.95L21 14m3.166 4.833L21 14m0 0l3.166-3.166m-3.166 3.166l3.166 3.166" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-400">
                    <span className="text-purple-500 font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF up to 100MB</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Funding Details */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Funding Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Funding Goal</label>
                <div className="relative">
                  <input
                    type="number"
                    name="fundingGoal"
                    value={formData.fundingGoal}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 pr-24 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.00"
                    required
                  />
                  <select
                    name="fundingGoalToken"
                    value={formData.fundingGoalToken}
                    onChange={handleInputChange}
                    className="absolute right-0 top-0 h-full bg-purple-600 text-white rounded-r-lg px-4 border-0 focus:outline-none"
                  >
                    <option value="ETH">ETH</option>
                    <option value="USDC">USDC</option>
                    <option value="USDT">USDT</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Campaign Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Milestones</label>
                <div className="space-y-4">
                  {formData.milestones.map((milestone, index) => (
                    <div key={index} className="border border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Milestone #{index + 1}</h3>
                        {formData.milestones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMilestone(index)}
                            className="text-red-500 hover:text-red-400"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Milestone title"
                          value={milestone.title}
                          onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        
                        <textarea
                          placeholder="Description"
                          value={milestone.description}
                          onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        ></textarea>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="number"
                            placeholder="Amount"
                            value={milestone.amount}
                            onChange={(e) => handleMilestoneChange(index, 'amount', e.target.value)}
                            className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          
                          <input
                            type="date"
                            placeholder="Deadline"
                            value={milestone.deadline}
                            onChange={(e) => handleMilestoneChange(index, 'deadline', e.target.value)}
                            className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="w-full py-2 border border-purple-600 text-purple-500 hover:bg-purple-600/20 rounded-lg"
                  >
                    + Add Milestone
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Token Economics */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Token Economics</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-gray-300">Token Distribution</label>
                  <span className={`font-medium ${totalPercentage === 100 ? 'text-green-500' : 'text-red-500'}`}>
                    {totalPercentage}/100%
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Investors</span>
                      <span className="text-sm">{formData.investorPercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.investorPercentage}
                      onChange={(e) => setFormData({...formData, investorPercentage: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Creator</span>
                      <span className="text-sm">{formData.creatorPercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.creatorPercentage}
                      onChange={(e) => setFormData({...formData, creatorPercentage: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Platform Fee</span>
                      <span className="text-sm">{formData.platformPercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.platformPercentage}
                      onChange={(e) => setFormData({...formData, platformPercentage: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
                
                {totalPercentage !== 100 && (
                  <p className="text-red-500 text-sm mt-2">Total percentage must equal 100%</p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Revenue Sharing</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.revenueShare}
                    onChange={(e) => setFormData({...formData, revenueShare: parseInt(e.target.value)})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                </div>
                <p className="text-gray-500 text-sm mt-2">
                  Percentage of future revenue that will be distributed to token holders
                </p>
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Vesting Schedule</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li className="flex justify-between">
                    <span>Cliff Period:</span>
                    <span>3 months (no tokens released)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Vesting Period:</span>
                    <span>12 months (tokens released linearly)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Preview */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Preview & Submit</h2>
            
            <div className="bg-gray-700/50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-4">{formData.title}</h3>
              <p className="text-gray-300 mb-4">{formData.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Category</p>
                  <p>{formData.category}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Funding Goal</p>
                  <p>{formData.fundingGoal} {formData.fundingGoalToken}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Deadline</p>
                  <p>{formData.deadline}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Revenue Share</p>
                  <p>{formData.revenueShare}% to token holders</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-bold mb-2">Token Distribution</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Investors:</span>
                    <span>{formData.investorPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Creator:</span>
                    <span>{formData.creatorPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform:</span>
                    <span>{formData.platformPercentage}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-2">Milestones</h4>
                <div className="space-y-3">
                  {formData.milestones.map((milestone, index) => (
                    <div key={index} className="bg-gray-800/50 p-3 rounded">
                      <p className="font-medium">{milestone.title}</p>
                      <p className="text-sm text-gray-400">{milestone.description}</p>
                      <p className="text-sm">{milestone.amount} ETH by {milestone.deadline || 'No deadline'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-bold mb-2">Terms & Conditions</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <label className="flex items-start">
                  <input type="checkbox" required className="mt-1 mr-2" />
                  <span>I agree to the terms and conditions of the platform</span>
                </label>
                <label className="flex items-start">
                  <input type="checkbox" required className="mt-1 mr-2" />
                  <span>I have the legal right to create this project and distribute tokens</span>
                </label>
                <label className="flex items-start">
                  <input type="checkbox" required className="mt-1 mr-2" />
                  <span>I understand the risks and responsibilities of crowdfunding</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className={`px-6 py-2 rounded-lg ${
              step === 1 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            Previous
          </button>
          
          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={totalPercentage !== 100 && step === 3}
              className={`px-6 py-2 rounded-lg ${
                (step === 3 && totalPercentage !== 100)
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            >
              Create Project
            </button>
          )}
        </div>
      </form>
    </div>
  );
};