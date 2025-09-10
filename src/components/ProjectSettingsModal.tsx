import React, { useState } from 'react';
import { X, Settings, Globe, BarChart3, Brain, Users, CreditCard, User, Beaker, Database, Github, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useApp } from '../context/AppContext';
interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const ProjectSettingsModal = ({
  isOpen,
  onClose
}: ProjectSettingsModalProps) => {
  const {
    state,
    dispatch
  } = useApp();
  const [activeSection, setActiveSection] = useState('project-settings');
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tempProjectName, setTempProjectName] = useState(state.projectName);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('last-7-days');
  const [knowledgeText, setKnowledgeText] = useState('');
  const [isKnowledgeSaved, setIsKnowledgeSaved] = useState(false);

  // Pricing state
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedCredits, setSelectedCredits] = useState('100');
  const [businessCredits, setBusinessCredits] = useState('100');

  // Account settings state
  const [username, setUsername] = useState('arshitjain');
  const [fullName, setFullName] = useState('Arshit Jain');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [personalLink, setPersonalLink] = useState('');
  const [hideProfilePicture, setHideProfilePicture] = useState(false);
  const [generationSound, setGenerationSound] = useState('first-generation');

  // Credit options
  const creditOptions = ['100', '200', '400', '800', '1200', '2000', '3000', '4000', '5000', '7500', '10000'];

  // Pricing logic
  const calculatePrice = (credits: string, plan: 'pro' | 'business') => {
    const creditAmount = parseInt(credits);
    let basePrice = creditAmount * 0.2; // $0.20 per credit for Pro

    if (plan === 'business') {
      basePrice = creditAmount * 0.4; // $0.40 per credit for Business
    }
    if (isAnnual) {
      return Math.round(basePrice * 0.75); // 25% discount for annual
    }
    return Math.round(basePrice);
  };
  const getAnnualSavings = (credits: string, plan: 'pro' | 'business') => {
    const monthlyPrice = calculatePrice(credits, plan);
    const annualPrice = Math.round(monthlyPrice * 0.75);
    return (monthlyPrice - annualPrice) * 12;
  };

  // Reset temp project name when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTempProjectName(state.projectName);
    }
  }, [isOpen, state.projectName]);
  const handleRenameProject = () => {
    dispatch({
      type: 'SET_PROJECT_NAME',
      payload: tempProjectName
    });
    setIsRenameDialogOpen(false);
  };
  const getChartData = (period: string) => {
    switch (period) {
      case 'last-7-days':
        return {
          labels: ['23 Jul', '25 Jul', '27 Jul', '29 Jul'],
          points: '0,180 300,180 350,20 400,20',
          yMax: 1
        };
      case 'last-30-days':
        return {
          labels: ['1 Jul', '10 Jul', '20 Jul', '30 Jul'],
          points: '0,150 100,120 200,80 300,40 400,30',
          yMax: 5
        };
      case 'last-90-days':
        return {
          labels: ['May', 'Jun', 'Jul', 'Aug'],
          points: '0,160 150,140 250,60 350,40 400,25',
          yMax: 10
        };
      default:
        return {
          labels: ['23 Jul', '25 Jul', '27 Jul', '29 Jul'],
          points: '0,180 300,180 350,20 400,20',
          yMax: 1
        };
    }
  };
  const chartData = getChartData(selectedTimePeriod);
  const handleSaveKnowledge = () => {
    // Save the knowledge to state or localStorage
    console.log('Saving knowledge:', knowledgeText);
    setIsKnowledgeSaved(true);

    // You could also save to app context or make an API call here
    // For now, we'll just show feedback that it's saved
    setTimeout(() => setIsKnowledgeSaved(false), 2000);
  };
  const handleCancelKnowledge = () => {
    setKnowledgeText('');
  };
  const sidebarSections = [{
    title: 'Project',
    items: [{
      id: 'project-settings',
      label: 'Project Settings',
      icon: Settings
    }, {
      id: 'domains',
      label: 'Domains',
      icon: Globe
    }, {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3
    }, {
      id: 'knowledge',
      label: 'Knowledge',
      icon: Brain
    }]
  }, {
    title: 'Workspace',
    items: [{
      id: 'workspace',
      label: "Demo's Prompt2App",
      icon: 'D',
      badge: true
    }, {
      id: 'billing',
      label: 'Plans & Billing',
      icon: CreditCard
    }, {
      id: 'people',
      label: 'People',
      icon: Users
    }]
  }, {
    title: 'Account',
    items: [{
      id: 'account',
      label: 'Arshit Jain',
      icon: User
    }]
  }, {
    title: 'Integrations',
    items: [{
      id: 'supabase',
      label: 'Supabase',
      icon: Database
    }, {
      id: 'github',
      label: 'GitHub',
      icon: Github
    }]
  }];
  const renderIcon = (icon: any, badge?: boolean) => {
    if (typeof icon === 'string') {
      return <div className="w-4 h-4 rounded-sm bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
          {icon}
        </div>;
    }
    const IconComponent = icon;
    return <IconComponent className="w-4 h-4" />;
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[min(95%,1400px)] min-w-[320px] max-w-[1400px] max-h-[85vh] p-0 gap-0 rounded-xl shadow-xl overflow-hidden fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col md:flex-row h-full max-h-[85vh]">
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-md hover:bg-gray-100 transition-colors" aria-label="Close settings">
            
          </button>

          {/* Mobile Sidebar - Accordion Style */}
          <div className="md:hidden border-b border-gray-200 w-full">
            <div className="p-6 pb-4">
              <h2 className="text-lg font-semibold mb-4">Settings</h2>
              <Select value={activeSection} onValueChange={setActiveSection}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sidebarSections.map(section => section.items.map(item => <SelectItem key={item.id} value={item.id}>
                        {item.label}
                      </SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden md:flex md:w-[280px] bg-gray-50 border-r border-gray-200 flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Settings</h2>
            </div>
            
            <ScrollArea className="flex-1 p-6 overflow-y-auto" style={{
            maxHeight: 'calc(85vh - 120px)'
          }}>
              {sidebarSections.map(section => <div key={section.title} className="mb-6">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-2">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map(item => <button key={item.id} onClick={() => setActiveSection(item.id)} className={`w-full flex items-center gap-3 px-2 py-2 text-sm rounded-md transition-colors ${activeSection === item.id ? 'bg-gray-200 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                        {renderIcon(item.icon, item.badge)}
                        <span className="truncate">{item.label}</span>
                      </button>)}
                  </div>
                </div>)}
            </ScrollArea>
          </div>

          {/* Right Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold">
                    {activeSection === 'domains' ? 'Domains' : activeSection === 'analytics' ? 'Analytics' : activeSection === 'knowledge' ? 'Knowledge' : activeSection === 'workspace' ? 'Workspace Settings' : activeSection === 'billing' ? 'Plans' : activeSection === 'account' ? 'Account Settings' : activeSection === 'github' ? 'GitHub' : 'Project Settings'}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {activeSection === 'domains' ? 'Publish your project to custom domains.' : activeSection === 'analytics' ? 'Measure how your published project is performing.' : activeSection === 'knowledge' ? 'Add custom knowledge to your project.' : activeSection === 'workspace' ? 'Workspaces allow you to collaborate on projects in real time.' : activeSection === 'billing' ? 'Choose the plan that fits your needs.' : activeSection === 'account' ? 'Personalize how others see and interact with you on Prompt2App.' : activeSection === 'github' ? 'Sync your project 2-way with GitHub to collaborate at source.' : 'Manage your project details, visibility, and preferences.'}
                  </p>
                </div>
                {(activeSection === 'knowledge' || activeSection === 'github') && <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Docs</span>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 cursor-pointer hover:border-gray-400 transition-colors">
                      <span className="text-xs font-medium text-gray-600">?</span>
                    </div>
                  </div>}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-8 py-6" style={{
              maxHeight: 'calc(85vh - 140px)'
            }}>
                <div className="pb-6">
                  {activeSection === 'project-settings' && <div className="space-y-8 max-w-4xl w-full">
                      {/* Overview Section */}
                      <div>
                        <h2 className="text-lg font-semibold mb-4">Overview</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           <div>
                             <label className="text-sm font-medium text-gray-700">Project name</label>
                             <p className="text-sm text-gray-900 mt-1">{state.projectName}</p>
                           </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Owner</label>
                            <p className="text-sm text-blue-600 mt-1 cursor-pointer">@Lj8amMNwPOWuat...</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Created at</label>
                            <p className="text-sm text-gray-900 mt-1">2025-07-27 10:40:40</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Messages count</label>
                            <p className="text-sm text-gray-900 mt-1">75</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">AI Edits count</label>
                            <p className="text-sm text-gray-900 mt-1">65</p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Project Visibility */}
                       <div>
                         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                           <div>
                             <label className="text-sm font-medium text-gray-700">
                               Project Visibility
                             </label>
                             <p className="text-xs text-gray-500 mt-1">
                               Keep your project hidden and prevent others from remixing it.
                             </p>
                           </div>
                            <Select defaultValue="workspace">
                              <SelectTrigger className="w-full sm:w-48">
                                <SelectValue />
                              </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="workspace">Workspace</SelectItem>
                               <SelectItem value="public">Public</SelectItem>
                               <SelectItem value="private">Private</SelectItem>
                             </SelectContent>
                           </Select>
                         </div>
                       </div>

                      <Separator />

                      {/* Project Category */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Project Category
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              Categorize your project to help others find it.
                            </p>
                          </div>
                           <Select>
                             <SelectTrigger className="w-full sm:w-48">
                               <SelectValue placeholder="Select category" />
                             </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="web-app">Web App</SelectItem>
                              <SelectItem value="landing-page">Landing Page</SelectItem>
                              <SelectItem value="portfolio">Portfolio</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator />

                      {/* Hide Lovable Badge */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Hide "Prompt2App" Badge
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              Remove the "Edit with Prompt2App" badge from your published work.
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>

                      <Separator />

                      {/* Rename Project */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Rename Project
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              Update your project's title.
                            </p>
                          </div>
                          <Button variant="default" size="sm" className="bg-black text-white hover:bg-black/90 w-full sm:w-auto" onClick={() => setIsRenameDialogOpen(true)}>
                            Rename
                          </Button>
                        </div>
                      </div>

                      <Separator />
                      
                      {/* Remix Project */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Remix Project
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              Duplicate this app in a new project.
                            </p>
                          </div>
                          <Button variant="default" size="sm" className="bg-black text-white hover:bg-black/90 w-full sm:w-auto">
                            Remix
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      {/* Transfer */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Transfer
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              Move this project to a different workspace.
                            </p>
                          </div>
                          <Button variant="default" size="sm" className="bg-black text-white hover:bg-black/90 w-full sm:w-auto">
                            Transfer
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      {/* Delete Project */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Delete Project
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              Permanently delete this project.
                            </p>
                          </div>
                          <Button variant="destructive" size="sm" className="w-full sm:w-auto" onClick={() => setIsDeleteDialogOpen(true)}>
                            Delete Project
                          </Button>
                        </div>
                      </div>
                    </div>}

                  {activeSection === 'domains' && <div className="space-y-8 max-w-4xl w-full">
                      {/* Connected Domains Section */}
                      <div>
                        <h2 className="text-lg font-semibold mb-2">Connected Domains</h2>
                        <p className="text-sm text-gray-600 mb-4">View or remove domains linked to your project.</p>
                        
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                           <div className="flex items-center gap-2">
                             <Globe className="w-4 h-4 text-gray-500" />
                             <span className="text-sm font-medium">{state.projectName}.prompt2app.com</span>
                           </div>
                          <Button variant="outline" size="sm">
                            <Globe className="w-4 h-4 mr-2" />
                            Open
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      {/* Add Existing Domain Section */}
                      <div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-lg font-semibold mb-2">Add Existing Domain</h2>
                            <p className="text-sm text-gray-600">Connect a domain you already own.</p>
                          </div>
                          <Button variant="default" size="sm" className="bg-black text-white hover:bg-black/90">
                            Connect Domain
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      {/* Purchase New Domain Section */}
                      <div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-lg font-semibold mb-2">Purchase New Domain</h2>
                            <p className="text-sm text-gray-600">Buy a new domain through Ionos.</p>
                          </div>
                          <Button variant="default" size="sm" className="bg-black text-white hover:bg-black/90">
                            Buy Domain
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      {/* How Domains Work Link */}
                      <div className="flex justify-end">
                        <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0">
                          How Domains Work →
                        </Button>
                      </div>
                    </div>}

                  {activeSection === 'analytics' && <div className="space-y-8 max-w-6xl w-full">
                      {/* Analytics Header with Current Visitors */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span className="text-sm text-gray-600">0 current visitors</span>
                          </div>
                        </div>
                        <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
                          <SelectTrigger className="w-full sm:w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="last-7-days">Last 7 days</SelectItem>
                            <SelectItem value="last-30-days">Last 30 days</SelectItem>
                            <SelectItem value="last-90-days">Last 90 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Analytics Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="p-4 border border-gray-200 rounded-lg bg-blue-50">
                          <div className="text-sm text-gray-600 mb-1">Visitors</div>
                          <div className="text-2xl font-semibold text-blue-600">2</div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="text-sm text-gray-600 mb-1">Pageviews</div>
                          <div className="text-2xl font-semibold">11</div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="text-sm text-gray-600 mb-1">Views Per Visit</div>
                          <div className="text-2xl font-semibold">5.5</div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="text-sm text-gray-600 mb-1">Visit Duration</div>
                          <div className="text-2xl font-semibold">46s</div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="text-sm text-gray-600 mb-1">Bounce Rate</div>
                          <div className="text-2xl font-semibold">0%</div>
                        </div>
                      </div>

                      {/* Analytics Note */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700">
                            <strong>Note:</strong> We started tracking analytics between the 4th and 7th of July. Data before this period is not available.
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 p-1 self-start sm:self-center">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Chart Placeholder */}
                      <div className="h-64 border border-gray-200 rounded-lg bg-gray-50 relative overflow-hidden">
                        <div className="absolute inset-0 flex flex-col">
                          {/* Chart Y-axis labels */}
                          <div className="flex-1 flex flex-col justify-between py-4 pl-4 pr-8 text-xs text-gray-500">
                            <span>{chartData.yMax}</span>
                            <span>{(chartData.yMax * 0.75).toFixed(2)}</span>
                            <span>{(chartData.yMax * 0.5).toFixed(2)}</span>
                            <span>{(chartData.yMax * 0.25).toFixed(2)}</span>
                            <span>0</span>
                          </div>
                          {/* Chart X-axis labels */}
                          <div className="flex justify-between px-4 py-2 text-xs text-gray-500 border-t border-gray-200">
                            {chartData.labels.map((label, index) => <span key={index}>{label}</span>)}
                          </div>
                        </div>
                        {/* Dynamic chart line */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
                          <polyline fill="none" stroke="#3b82f6" strokeWidth="2" points={chartData.points} />
                        </svg>
                      </div>

                      {/* Analytics Tables */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Sources and Pages */}
                        <div className="space-y-8">
                          {/* Source Table */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-sm font-medium text-gray-700">Source</h3>
                              <h3 className="text-sm font-medium text-gray-700">Visitors</h3>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <span className="text-sm font-medium text-blue-700">Direct</span>
                                <span className="text-sm font-medium">1</span>
                              </div>
                            </div>
                          </div>

                          {/* Page Table */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-sm font-medium text-gray-700">Page</h3>
                              <h3 className="text-sm font-medium text-gray-700">Visitors</h3>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <span className="text-sm font-medium text-purple-700">/</span>
                                <span className="text-sm font-medium">2</span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <span className="text-sm font-medium text-purple-700">/workspace</span>
                                <span className="text-sm font-medium">1</span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <span className="text-sm font-medium text-purple-700">/auth/signin</span>
                                <span className="text-sm font-medium">1</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Country and Device */}
                        <div className="space-y-8">
                          {/* Country Table */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-sm font-medium text-gray-700">Country</h3>
                              <h3 className="text-sm font-medium text-gray-700">Visitors</h3>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">🇮🇳</span>
                                  <span className="text-sm font-medium text-blue-700">India</span>
                                </div>
                                <span className="text-sm font-medium">2</span>
                              </div>
                            </div>
                          </div>

                          {/* Device Table */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-sm font-medium text-gray-700">Device</h3>
                              <h3 className="text-sm font-medium text-gray-700">Visitors</h3>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <span className="text-sm font-medium text-purple-700">Desktop</span>
                                <span className="text-sm font-medium">100.0%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>}

                  {activeSection === 'knowledge' && <div className="space-y-8 max-w-4xl w-full">
                      {/* Instructions & Guidelines Section */}
                      <div>
                        <h2 className="text-lg font-semibold mb-4">Instructions & Guidelines</h2>
                        <p className="text-sm text-gray-600 mb-6">
                          Provide guidelines and context to improve your project's edits. Use this space to:
                        </p>
                        
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 mb-6">
                          <li>Set project-specific rules or best practices.</li>
                          <li>Set coding style preferences (e.g. indentation, naming conventions).</li>
                          <li>Include external documentation or style guides.</li>
                        </ul>

                        <div className="relative">
                          <Textarea placeholder="Enter your instructions here..." className="min-h-[300px] resize-none border-2 border-gray-300 rounded-lg" value={knowledgeText} onChange={e => setKnowledgeText(e.target.value)} />
                          
                          <div className="flex justify-between items-center mt-4">
                            <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0">
                              Get Inspiration →
                            </Button>
                            
                            <div className="flex gap-3">
                              <Button variant="outline" onClick={handleCancelKnowledge}>
                                Cancel
                              </Button>
                              <Button className={`${isKnowledgeSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`} onClick={handleSaveKnowledge}>
                                {isKnowledgeSaved ? 'Saved!' : 'Save'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>}

                  {activeSection === 'workspace' && <div className="space-y-8 max-w-4xl w-full">
                      {/* Workspace Description */}
                      <div>
                        <p className="text-sm text-gray-600 mb-6">
                          Workspaces allow you to collaborate on projects in real time.
                        </p>
                      </div>

                      {/* Workspace Avatar */}
                      <div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-semibold mb-2">Workspace Avatar</h2>
                            <p className="text-sm text-gray-600">Set an avatar for your workspace.</p>
                          </div>
                          <div className="flex items-center gap-4 md:ml-auto">
                            <div className="w-16 h-16 rounded-lg bg-red-600 text-white text-2xl font-bold flex items-center justify-center">
                              D
                            </div>
                            <Button variant="outline" size="sm">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
                              </svg>
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Workspace Name */}
                      <div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-semibold mb-2">Workspace Name</h2>
                            <p className="text-sm text-gray-600">Your full workspace name, as visible to others.</p>
                          </div>
                          <div className="md:ml-auto">
                            <Input defaultValue="Demo's Prompt2App" className="w-full md:w-80" placeholder="Enter workspace name" />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Workspace Description */}
                      <div>
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-semibold mb-2">Workspace Description</h2>
                            <p className="text-sm text-gray-600">A short description about your workspace or team.</p>
                          </div>
                          <div className="md:ml-auto">
                            <Textarea placeholder="Description" className="w-full md:w-80 h-24" />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Leave Workspace */}
                      <div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-semibold mb-2">Leave Workspace</h2>
                            <p className="text-sm text-gray-600">
                              Leave the workspace (you will lose all access to projects inside this workspace).
                            </p>
                          </div>
                          <div className="md:ml-auto">
                            <Button variant="destructive" size="sm">
                              Leave Workspace
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>}

                  {activeSection === 'people' && <div className="space-y-6 max-w-4xl w-full">
                      {/* Description */}
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Inviting people to <span className="font-medium">Demo's Prompt2App's</span> workspace gives access to workspace shared projects and credits. You're using 5/20 seats. Need more? <a href="#" className="text-primary hover:underline">Contact us</a>.
                        </p>
                      </div>

                      {/* Invite new members */}
                      <div className="space-y-4">
                        <h3 className="text-base font-medium">Invite new members</h3>
                        <div className="flex gap-3">
                          <input type="email" placeholder="Add emails" className="flex-1 h-10 px-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md" />
                          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Invite
                          </Button>
                        </div>
                      </div>

                      {/* Members section */}
                      <div className="space-y-4">
                        <h3 className="text-base font-medium">Members</h3>
                        
                        {/* Search */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input type="text" placeholder="Search members by name or email..." className="w-full h-10 pl-10 pr-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md" />
                        </div>

                        {/* Filter tabs */}
                        <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
                          <button className="px-3 py-1.5 text-sm font-medium bg-background text-foreground rounded-md shadow-sm">
                            All
                          </button>
                          <button className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md">
                            Active
                          </button>
                          <button className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md">
                            Pending
                          </button>
                        </div>

                        {/* Members list */}
                        <div className="space-y-3">
                          {/* Member 1 */}
                          <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-medium">
                                P
                              </div>
                              <div>
                                <div className="text-sm font-medium">punith.kp@rakuten.com</div>
                                <div className="text-xs text-muted-foreground">punith.kp@rakuten.com</div>
                              </div>
                            </div>
                            <Select>
                              <SelectTrigger className="w-24 h-8">
                                <SelectValue placeholder="Admin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="member">Member</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Member 2 */}
                          <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                                A
                              </div>
                              <div>
                                <div className="text-sm font-medium">Arshit Jain <span className="text-muted-foreground">(you)</span></div>
                                <div className="text-xs text-muted-foreground">arshit20jain@gmail.com</div>
                              </div>
                            </div>
                            <Select>
                              <SelectTrigger className="w-24 h-8">
                                <SelectValue placeholder="Admin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="member">Member</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Member 3 */}
                          <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-medium">
                                A
                              </div>
                              <div>
                                <div className="text-sm font-medium">Anantha Sharma</div>
                                <div className="text-xs text-muted-foreground">anantha.sharma@rakuten...</div>
                              </div>
                            </div>
                            <Select>
                              <SelectTrigger className="w-24 h-8">
                                <SelectValue placeholder="Admin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="member">Member</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Member 4 */}
                          <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium">
                                S
                              </div>
                              <div>
                                <div className="text-sm font-medium">Sachin</div>
                                <div className="text-xs text-muted-foreground">harshdemo281@gmail.com</div>
                              </div>
                            </div>
                            <Select>
                              <SelectTrigger className="w-24 h-8">
                                <SelectValue placeholder="Owner" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="owner">Owner</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="member">Member</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Member 5 - Pending */}
                          <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
                                F
                              </div>
                              <div>
                                <div className="text-sm font-medium">Falak Shah</div>
                                <div className="text-xs text-muted-foreground">falak.shah@rakuten.com</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Invite sent</span>
                              <Select>
                                <SelectTrigger className="w-24 h-8">
                                  <SelectValue placeholder="Pending" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="member">Member</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Usage section */}
                      <div className="space-y-4">
                        <h3 className="text-base font-medium">Usage</h3>
                        <p className="text-sm text-muted-foreground">Showing usage for July 2025.</p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                                A
                              </div>
                              <span className="text-sm font-medium">Arshit Jain</span>
                            </div>
                            <span className="text-sm text-muted-foreground">100.60 credits used</span>
                          </div>
                          
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-medium">
                                S
                              </div>
                              <span className="text-sm font-medium">Sachin</span>
                            </div>
                            <span className="text-sm text-muted-foreground">39 credits used</span>
                          </div>
                        </div>
                      </div>
                    </div>}

                  {activeSection === 'billing' && <div className="space-y-6 max-w-4xl w-full">
                      {/* Current Plan Status */}
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm2 2h10v6H5v-6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">You're on Pro Plan</h3>
                          <p className="text-white/80">Renews Aug 16, 2025</p>
                        </div>
                        <Button variant="ghost" className="text-white border-white/20 hover:bg-white/10">
                          Manage
                        </Button>
                      </div>

                      {/* Credits Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Credits</h3>
                          <span className="text-sm text-muted-foreground">67.6 of 205 left</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{
                        width: '33%'
                      }}></div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Up to 200 credits rollover</span>
                            <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto"></div>
                            <span>Using monthly credits</span>
                          </div>
                          <p className="text-sm text-muted-foreground">200 monthly credits reset on 16th August</p>
                        </div>
                      </div>


                      {/* Available Plans */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold">Available Plans</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Pro Plan */}
                          <div className="border border-blue-500 bg-blue-50 rounded-lg p-6 relative">
                            <div className="absolute -top-3 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Current Plan
                            </div>
                            
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-2xl font-bold mb-2">Pro</h4>
                                <p className="text-sm text-muted-foreground">
                                  Designed for fast-moving teams building together in real time.
                                </p>
                              </div>
                              
                              <div>
                                <div className="mb-4">
                                  <span className="text-4xl font-bold">$20</span>
                                  <span className="text-muted-foreground text-lg ml-2">per month</span>
                                </div>
                                
                                <div className="flex items-center gap-3 mb-6">
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white"></div>
                                  <span className="text-sm text-muted-foreground">Annual</span>
                                </div>
                              </div>
                              
                              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3">
                                Upgrade
                              </Button>
                              
                              <Select value={selectedCredits} onValueChange={setSelectedCredits}>
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {creditOptions.map(credits => <SelectItem key={credits} value={credits}>
                                      {credits} credits / month
                                    </SelectItem>)}
                                </SelectContent>
                              </Select>
                              
                              <div className="space-y-3">
                                <p className="font-medium text-sm">Everything in Free, plus:</p>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3">
                                    <span className="text-green-500 text-sm">✓</span>
                                    <span className="text-sm">{selectedCredits} monthly credits</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-green-500 text-sm">✓</span>
                                    <span className="text-sm">5 daily credits (up to 150/month)</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-green-500 text-sm">✓</span>
                                    <span className="text-sm">Private projects</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-green-500 text-sm">✓</span>
                                    <span className="text-sm">User roles & permissions</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-green-500 text-sm">✓</span>
                                    <span className="text-sm">Custom domains</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-green-500 text-sm">✓</span>
                                    <span className="text-sm">Remove the Prompt2App badge</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-green-500 text-sm">✓</span>
                                    <span className="text-sm">Credit rollovers</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Business Plan */}
                          <div className="border border-gray-200 rounded-lg p-6 bg-white">
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-2xl font-bold mb-2">Business</h4>
                                <p className="text-sm text-muted-foreground">
                                  Advanced controls and power features for growing departments
                                </p>
                              </div>
                              
                              <div>
                                <div className="mb-4">
                                  <span className="text-4xl font-bold">$40</span>
                                  <span className="text-muted-foreground text-lg ml-2">per month</span>
                                </div>
                                
                                <div className="flex items-center gap-3 mb-6">
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white"></div>
                                  <span className="text-sm text-muted-foreground">Annual</span>
                                </div>
                              </div>
                              
                              <Button variant="outline" className="w-full border-2 font-medium py-3">
                                Upgrade
                              </Button>
                              
                              <Select value={businessCredits} onValueChange={setBusinessCredits}>
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {creditOptions.map(credits => <SelectItem key={credits} value={credits}>
                                      {credits} credits / month
                                    </SelectItem>)}
                                </SelectContent>
                              </Select>
                              
                              <div className="space-y-3">
                                <p className="font-medium text-sm">All features in Pro, plus:</p>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3">
                                    <span className="text-green-500 text-sm">✓</span>
                                    <span className="text-sm">{businessCredits} monthly credits</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-green-500 text-sm">✓</span>
                                    <span className="text-sm">5 daily credits (up to 150/month)</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-green-500 text-sm">✓</span>
                                    <span className="text-sm">SSO</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-green-500 text-sm">✓</span>
                                    <span className="text-sm">Personal Projects</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-green-500 text-sm">✓</span>
                                    <span className="text-sm">Opt out of data training</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-green-500 text-sm">✓</span>
                                    <span className="text-sm">Design templates</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Enterprise Plan */}
                          <div className="border border-gray-200 rounded-lg p-6 bg-white">
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-2xl font-bold mb-2">Enterprise</h4>
                                <p className="text-sm text-muted-foreground">
                                  Built for large orgs needing flexibility, scale, and governance.
                                </p>
                              </div>
                              
                              <div>
                                <div className="mb-4">
                                  <span className="text-2xl font-bold">Flexible billing</span>
                                </div>
                                
                                <div className="mb-6">
                                  <span className="text-sm text-muted-foreground">Custom plans</span>
                                </div>
                              </div>
                              
                              <Button variant="outline" className="w-full border-2 font-medium py-3">
                                Book a demo
                              </Button>
                              
                              <div className="space-y-3 pt-8">
                                <p className="font-medium text-sm">Everything in Business, plus:</p>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3">
                                    <span className="text-green-500 text-sm">✓</span>
                                    <span className="text-sm">Dedicated support</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-green-500 text-sm">✓</span>
                                    <span className="text-sm">Onboarding services</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-green-500 text-sm">✓</span>
                                    <span className="text-sm">Custom integrations</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-green-500 text-sm">✓</span>
                                    <span className="text-sm">Group-based access control</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-green-500 text-sm">✓</span>
                                    <span className="text-sm">Custom design systems</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>}

                  {activeSection === 'account' && <div className="space-y-8 max-w-2xl w-full">
                      {/* Account Settings Header */}
                      <div>
                        <h1 className="text-2xl font-bold mb-2">Account Settings</h1>
                        <p className="text-sm text-muted-foreground">
                          Personalize how others see and interact with you on Prompt2App.
                        </p>
                      </div>

                      <Separator />

                      {/* Your Avatar */}
                      <div>
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-semibold mb-2">Your Avatar</h2>
                            <p className="text-sm text-muted-foreground">Your avatar appears on Prompt2App and in email notifications.</p>
                          </div>
                          <div className="md:ml-auto">
                            <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                              A
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Username */}
                      <div>
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-semibold mb-2">Username</h2>
                            <p className="text-sm text-muted-foreground">This is your URL namespace within Prompt2App.</p>
                          </div>
                          <div className="md:ml-auto space-y-3">
                            <Input value={username} onChange={e => setUsername(e.target.value)} className="w-full md:w-80" />
                            <p className="text-sm text-muted-foreground">
                              prompt2app.dev/{username}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Email */}
                      <div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-semibold mb-2">Email</h2>
                            <p className="text-sm text-muted-foreground">This is the email address associated with your account.</p>
                          </div>
                          <div className="md:ml-auto">
                            <div className="text-sm text-muted-foreground">
                              arshit20jain@gmail.com
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Name */}
                      <div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-semibold mb-2">Name</h2>
                            <p className="text-sm text-muted-foreground">This is the name that will be displayed on your profile and projects.</p>
                          </div>
                          <div className="md:ml-auto">
                            <Input value={fullName} onChange={e => setFullName(e.target.value)} className="w-full md:w-80" />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Description */}
                      <div>
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-semibold mb-2">Description</h2>
                            <p className="text-sm text-muted-foreground">A short bio or description about yourself.</p>
                          </div>
                          <div className="md:ml-auto">
                            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell us about yourself..." className="w-full md:w-80 h-24" />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Location */}
                      <div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-semibold mb-2">Location</h2>
                            <p className="text-sm text-muted-foreground">Where are you based?</p>
                          </div>
                          <div className="md:ml-auto">
                            <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country" className="w-full md:w-80" />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Link */}
                      <div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-semibold mb-2">Link</h2>
                            <p className="text-sm text-muted-foreground">Add a link to your website, portfolio, or social media.</p>
                          </div>
                          <div className="md:ml-auto">
                            <Input value={personalLink} onChange={e => setPersonalLink(e.target.value)} placeholder="https://yourwebsite.com" className="w-full md:w-80" />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Hide Profile Picture */}
                      <div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-semibold mb-2">Hide Profile Picture</h2>
                            <p className="text-sm text-muted-foreground">Hide your profile picture from other users.</p>
                          </div>
                          <div className="md:ml-auto">
                            <Switch checked={hideProfilePicture} onCheckedChange={setHideProfilePicture} />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Generation complete sound */}
                      <div>
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-semibold mb-2">Generation complete sound</h2>
                            <p className="text-sm text-muted-foreground">Choose when to play a sound when generation is complete.</p>
                          </div>
                          <div className="md:ml-auto">
                            <RadioGroup value={generationSound} onValueChange={setGenerationSound} className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="first-generation" id="first-generation" />
                                <Label htmlFor="first-generation" className="text-sm">First Generation</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="always" id="always" />
                                <Label htmlFor="always" className="text-sm">Always</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="never" id="never" />
                                <Label htmlFor="never" className="text-sm">Never</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Link SSO */}
                      <div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-semibold mb-2">Link SSO</h2>
                            <p className="text-sm text-muted-foreground">Connect your account with single sign-on providers for easier access.</p>
                          </div>
                          <div className="md:ml-auto">
                            <Button variant="outline" size="sm">
                              Link SSO
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>}

                  {activeSection === 'github' && <div className="space-y-8 max-w-4xl w-full">
                      {/* Project Section */}
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                              Project 
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                Connected
                              </span>
                            </h2>
                            <p className="text-sm text-gray-600">
                              Connect your project to your GitHub organization in a 2-way sync.
                            </p>
                          </div>
                          <div className="ml-6">
                            <Button variant="outline" className="flex items-center gap-2 text-sm">
                              View on GitHub
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full border-t border-gray-200 my-6"></div>

                      {/* Clone Section */}
                      <div>
                        <h2 className="text-lg font-semibold mb-2">Clone</h2>
                        <p className="text-sm text-gray-600 mb-4">
                          Copy this repository to your local environment.
                        </p>
                        
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center gap-2 mb-3">
                            <button className="px-3 py-1 text-xs font-medium bg-white border rounded">HTTPS</button>
                            <button className="px-3 py-1 text-xs font-medium text-gray-600">SSH</button>
                            <button className="px-3 py-1 text-xs font-medium text-gray-600">GitHub CLI</button>
                          </div>
                          <div className="flex items-center gap-2">
                             <input 
                               type="text" 
                               value={`https://github.com/Arshit007/${state.projectName}.git`}
                               readOnly
                              className="flex-1 px-3 py-2 text-sm bg-white border rounded font-mono"
                            />
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full border-t border-gray-200 my-6"></div>

                      {/* Connected Account Section */}
                      <div>
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                              Connected Account 
                              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded">
                                Admin
                              </span>
                            </h2>
                            <p className="text-sm text-gray-600">
                              Add your GitHub account to manage connected organizations.
                            </p>
                          </div>
                          <div className="ml-6 flex flex-col items-end gap-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Github className="w-4 h-4" />
                              <span>Arshit007</span>
                            </div>
                            <Button className="bg-black text-white hover:bg-black/90 flex items-center gap-2">
                              <Github className="w-4 h-4" />
                              Connect GitHub
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>}

                  {/* Placeholder content for other sections */}
                  {activeSection !== 'project-settings' && activeSection !== 'domains' && activeSection !== 'analytics' && activeSection !== 'knowledge' && activeSection !== 'workspace' && activeSection !== 'people' && activeSection !== 'billing' && activeSection !== 'account' && activeSection !== 'github' && <div className="flex items-center justify-center h-64">
                      <p className="text-gray-500">Content for {activeSection} coming soon...</p>
                    </div>}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Rename Project Dialog */}
        <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Rename project</DialogTitle>
              <p className="text-sm text-gray-600">Give your project a new name.</p>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input id="project-name" value={tempProjectName} onChange={e => setTempProjectName(e.target.value)} className="mt-1" />
                <p className="text-xs text-gray-500 mt-2">
                  Use lowercase letters, numbers, and hyphens only.<br />
                  Name must start with a lowercase letter. Example: my-awesome-project
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRenameProject}>
                Rename Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Project Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your project
                "{state.projectName}" and remove all associated data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                Delete Project
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>;
};
export default ProjectSettingsModal;