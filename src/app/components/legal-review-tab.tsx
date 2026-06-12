import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { DatePicker } from "./ui/date-picker";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";

export interface Task {
  id: string;
  name: string;
  labels: string;
  description: string;
  reporter: string;
  assignee: string;
  startDate: Date | null;
  dueDate: Date | null;
  flagged: string;
  isDeliverable: string;
  timezone: string;
  priority: string;
  status: string;
  estimation: string;
  subtasks?: Task[];
}

export interface LegalReview {
  id: string;
  reviewNumber: string;
  description: string;
  linkedReview?: string;
  cpType: string;
  reviewedByLegal: boolean;
  contractDate: string;
  cpIssuanceDate: string;
  legalReviewStatus: string;
  additionalInsurance: string;
  insuranceStatus: string;
  dueDiligenceCompleted: boolean;
  eNumber: string;
  isNew?: boolean;
  tasks: Task[];
}

const defaultReview: LegalReview = {
  id: "single-review",
  reviewNumber: "REV-001",
  description: "",
  linkedReview: "none",
  cpType: "",
  reviewedByLegal: false,
  contractDate: "",
  cpIssuanceDate: "",
  legalReviewStatus: "",
  additionalInsurance: "No",
  insuranceStatus: "",
  dueDiligenceCompleted: false,
  eNumber: "",
  isNew: true,
  tasks: []
};

const initialTaskState: Partial<Task> = {
  name: "",
  labels: "none",
  description: "",
  reporter: "Nikhil Mathew",
  startDate: null,
  flagged: "No",
  isDeliverable: "none",
  timezone: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
  priority: "Medium",
  status: "TODO",
  assignee: "none",
  dueDate: null,
  estimation: ""
};

export function LegalReviewTab() {
  const [review, setReview] = useState<LegalReview>(defaultReview);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>(initialTaskState);
  const [createAnother, setCreateAnother] = useState(false);

  const updateReview = (field: keyof LegalReview, value: any) => {
    setReview(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveTask = () => {
    if (!newTask.name || !newTask.estimation || newTask.isDeliverable === "none") return;

    if (newTask.id) {
      // Edit existing task
      const updatedTasks = (review.tasks || []).map(task => 
        task.id === newTask.id ? { ...task, ...newTask } as Task : task
      );
      updateReview("tasks", updatedTasks);
      
      setNewTask(initialTaskState);
      setIsTaskModalOpen(false);
    } else {
      // Create new task
      const taskToSave: Task = {
        id: Math.random().toString(36).substr(2, 9),
        name: newTask.name || "",
        labels: newTask.labels || "none",
        description: newTask.description || "",
        reporter: newTask.reporter || "none",
        assignee: newTask.assignee || "none",
        startDate: newTask.startDate || null,
        dueDate: newTask.dueDate || null,
        flagged: newTask.flagged || "none",
        isDeliverable: newTask.isDeliverable || "none",
        timezone: newTask.timezone || "none",
        priority: newTask.priority || "none",
        status: newTask.status || "none",
        estimation: newTask.estimation || ""
      };

      updateReview("tasks", [...(review.tasks || []), taskToSave]);

      if (createAnother) {
        setNewTask(initialTaskState);
      } else {
        setNewTask(initialTaskState);
        setIsTaskModalOpen(false);
      }
    }
  };

  const handleCancelTask = () => {
    setNewTask(initialTaskState);
    setIsTaskModalOpen(false);
  };

  const handleEditTask = (task: Task) => {
    setNewTask(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="p-6 text-[13px]">
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* General Details Section */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">General Details</h3>
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <div className="text-gray-400 mb-1">Review Number</div>
              <Input 
                value={review.reviewNumber}
                disabled
                className="bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <div className="text-gray-400 mb-1">Link Review</div>
              <Select value={review.linkedReview} onValueChange={(val) => updateReview("linkedReview", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="none" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">none</SelectItem>
                  <SelectItem value="REV-001">REV-001</SelectItem>
                  <SelectItem value="REV-002">REV-002</SelectItem>
                  <SelectItem value="REV-003">REV-003</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <div className="text-gray-400 mb-1">Description</div>
              <Textarea 
                value={review.description}
                onChange={(e) => updateReview("description", e.target.value)}
                placeholder="Enter description..."
                className="min-h-[80px]"
              />
            </div>
          </div>
        </div>

        {/* Charter Party Section */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Charter Party</h3>
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <div className="text-gray-400 mb-1">Charter Party Type <span className="text-red-500">*</span></div>
              <Select value={review.cpType} onValueChange={(val) => updateReview("cpType", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="none" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select Type</SelectItem>
                  <SelectItem value="BIMCO">BIMCO</SelectItem>
                  <SelectItem value="Client CP">Client CP</SelectItem>
                  <SelectItem value="Frame Agreement">Frame Agreement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <Checkbox 
                id="reviewed-by-legal"
                checked={review.reviewedByLegal}
                onCheckedChange={(checked) => updateReview("reviewedByLegal", checked)}
              />
              <Label htmlFor="reviewed-by-legal" className="text-gray-900 font-medium cursor-pointer">Reviewed by Legal</Label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <div className="text-gray-400 mb-1">Contract / Recap Date</div>
              <DatePicker 
                value={review.contractDate} 
                onChange={(date) => updateReview("contractDate", date)} 
                placeholder="Select Date"
                disabled={(date) => date > new Date()}
              />
            </div>
            <div>
              <div className="text-gray-400 mb-1">Charter Party Issuance Date</div>
              <DatePicker 
                value={review.cpIssuanceDate} 
                onChange={(date) => updateReview("cpIssuanceDate", date)} 
                placeholder="Select Date"
                disabled={(date) => review.contractDate ? date < new Date(review.contractDate) : false}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-gray-400 mb-1">Legal Review Status</div>
              <Select value={review.legalReviewStatus} onValueChange={(val) => updateReview("legalReviewStatus", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="none" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select Status</SelectItem>
                  <SelectItem value="To be reviewed by Legal">To be reviewed by Legal</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Reviewed">Reviewed</SelectItem>
                  <SelectItem value="Not Required">Not Required</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Insurance Section */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Insurance</h3>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-gray-400 mb-3">Additional Insurance Required <span className="text-red-500">*</span></div>
              <RadioGroup 
                value={review.additionalInsurance} 
                onValueChange={(val) => updateReview("additionalInsurance", val)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="insurance-yes" />
                  <Label htmlFor="insurance-yes" className="font-normal cursor-pointer text-gray-900">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="insurance-no" />
                  <Label htmlFor="insurance-no" className="font-normal cursor-pointer text-gray-900">No</Label>
                </div>
              </RadioGroup>
            </div>
            {review.additionalInsurance === "Yes" && (
              <div>
                <div className="text-gray-400 mb-1">Insurance Status <span className="text-red-500">*</span></div>
                <Select value={review.insuranceStatus} onValueChange={(val) => updateReview("insuranceStatus", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="none" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select Status</SelectItem>
                    <SelectItem value="Reviewed by Insurance">Reviewed by Insurance</SelectItem>
                    <SelectItem value="Approved by Insurance">Approved by Insurance</SelectItem>
                    <SelectItem value="Signed Off">Signed Off</SelectItem>
                    <SelectItem value="Pending / To be signed">Pending / To be signed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Compliance Section */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Compliance</h3>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="due-diligence"
              checked={review.dueDiligenceCompleted}
              onCheckedChange={(checked) => updateReview("dueDiligenceCompleted", checked)}
            />
            <Label htmlFor="due-diligence" className="text-gray-900 font-medium cursor-pointer">Due Diligence Completed</Label>
          </div>
        </div>

        {/* Legal Filing Section */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Legal Filing</h3>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-gray-400 mb-1">E-Number</div>
              <Input 
                value={review.eNumber}
                onChange={(e) => updateReview("eNumber", e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                placeholder="Enter E-Number" 
                maxLength={50}
              />
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Tasks</h3>
            
            <Dialog open={isTaskModalOpen} onOpenChange={(open) => {
              setIsTaskModalOpen(open);
              if (!open) handleCancelTask();
            }}>
              <DialogTrigger asChild>
                <button 
                  onClick={() => setNewTask(initialTaskState)}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5 text-[13px] bg-blue-50 px-3 py-1.5 rounded transition-colors"
                >
                  <Plus className="size-3.5" /> Add Task
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b border-gray-100">
                  <DialogTitle className="text-xl font-medium text-gray-800">
                    {newTask.id ? "Edit Task" : "Add New Task"}
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    {newTask.id ? "Edit an existing task." : "Add a new task to this legal review."}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div>
                        <div className="text-gray-500 mb-1.5">Name <span className="text-red-500">*</span></div>
                        <Input 
                          value={newTask.name}
                          onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                          className={!newTask.name ? "border-b-red-500 rounded-none border-x-0 border-t-0 focus-visible:ring-0 px-0" : "border-b-gray-300 rounded-none border-x-0 border-t-0 focus-visible:ring-0 px-0"}
                        />
                      </div>
                      
                      <div>
                        <div className="text-gray-500 mb-1.5">Add Labels</div>
                        <Select value={newTask.labels} onValueChange={(val) => setNewTask({...newTask, labels: val})}>
                          <SelectTrigger className="border-b-gray-300 rounded-none border-x-0 border-t-0 focus:ring-0 px-0">
                            <SelectValue placeholder="none" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">none</SelectItem>
                            <SelectItem value="Label 1">Label 1</SelectItem>
                            <SelectItem value="Label 2">Label 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <div className="text-gray-500 mb-1.5">Description</div>
                        <Textarea 
                          value={newTask.description}
                          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                          className="border-b-gray-300 rounded-none border-x-0 border-t-0 focus-visible:ring-0 px-0 min-h-[60px] resize-none"
                        />
                      </div>

                      <div>
                        <div className="text-gray-500 mb-1.5">Reporter</div>
                        <Select value={newTask.reporter} onValueChange={(val) => setNewTask({...newTask, reporter: val})}>
                          <SelectTrigger className="border-b-gray-300 rounded-none border-x-0 border-t-0 focus:ring-0 px-0">
                            <SelectValue placeholder="none" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">none</SelectItem>
                            <SelectItem value="Nikhil Mathew">Nikhil Mathew</SelectItem>
                            <SelectItem value="John Doe">John Doe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <div className="text-gray-500 mb-1.5">Select Start Date</div>
                        <div className="border-b border-gray-300">
                          <DatePicker 
                            value={newTask.startDate} 
                            onChange={(date) => setNewTask({...newTask, startDate: date})} 
                            placeholder="none"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-500 mb-1.5">Flagged</div>
                        <Select value={newTask.flagged} onValueChange={(val) => setNewTask({...newTask, flagged: val})}>
                          <SelectTrigger className="border-b-gray-300 rounded-none border-x-0 border-t-0 focus:ring-0 px-0">
                            <SelectValue placeholder="none" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">none</SelectItem>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <div>
                        <div className="text-red-500 mb-1.5">Is Deliverable</div>
                        <Select value={newTask.isDeliverable} onValueChange={(val) => setNewTask({...newTask, isDeliverable: val})}>
                          <SelectTrigger className="border-b-red-500 rounded-none border-x-0 border-t-0 focus:ring-0 px-0 text-red-500">
                            <SelectValue placeholder="none" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">none</SelectItem>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <div className="text-gray-500 mb-1.5">Timezone</div>
                        <Select value={newTask.timezone} onValueChange={(val) => setNewTask({...newTask, timezone: val})}>
                          <SelectTrigger className="border-b-gray-300 rounded-none border-x-0 border-t-0 focus:ring-0 px-0">
                            <SelectValue placeholder="none" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">none</SelectItem>
                            <SelectItem value="(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi">(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi</SelectItem>
                            <SelectItem value="(UTC+00:00) London">(UTC+00:00) London</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <div className="text-gray-500 mb-1.5">Priority</div>
                        <Select value={newTask.priority} onValueChange={(val) => setNewTask({...newTask, priority: val})}>
                          <SelectTrigger className="border-b-gray-300 rounded-none border-x-0 border-t-0 focus:ring-0 px-0">
                            <SelectValue placeholder="none" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">none</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <div className="text-gray-500 mb-1.5">Status</div>
                        <Select value={newTask.status} onValueChange={(val) => setNewTask({...newTask, status: val})}>
                          <SelectTrigger className="border-b-gray-300 rounded-none border-x-0 border-t-0 focus:ring-0 px-0">
                            <SelectValue placeholder="none" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">none</SelectItem>
                            <SelectItem value="TODO">TODO</SelectItem>
                            <SelectItem value="IN PROGRESS">IN PROGRESS</SelectItem>
                            <SelectItem value="DONE">DONE</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <div className="text-gray-500 mb-1.5">Assignee</div>
                        <Select value={newTask.assignee} onValueChange={(val) => setNewTask({...newTask, assignee: val})}>
                          <SelectTrigger className="border-b-gray-300 rounded-none border-x-0 border-t-0 focus:ring-0 px-0">
                            <SelectValue placeholder="none" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">none</SelectItem>
                            <SelectItem value="Nikhil Mathew">Nikhil Mathew</SelectItem>
                            <SelectItem value="John Doe">John Doe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <div className="text-gray-500 mb-1.5">Select Due Date</div>
                        <div className="border-b border-gray-300">
                          <DatePicker 
                            value={newTask.dueDate} 
                            onChange={(date) => setNewTask({...newTask, dueDate: date})} 
                            placeholder="none"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="text-red-500 mb-1.5">Estimation <span className="text-red-500">*</span></div>
                        <Input 
                          value={newTask.estimation}
                          onChange={(e) => setNewTask({...newTask, estimation: e.target.value})}
                          placeholder="2w 4d 6h 45m"
                          className={!newTask.estimation ? "border-b-red-500 rounded-none border-x-0 border-t-0 focus-visible:ring-0 px-0 text-gray-500" : "border-b-gray-300 rounded-none border-x-0 border-t-0 focus-visible:ring-0 px-0"}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-white flex justify-end items-center gap-6 border-t border-gray-100">
                  {/* Hide Create Another checkbox when editing an existing task */}
                  {!newTask.id && (
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="create-another" 
                        checked={createAnother} 
                        onCheckedChange={(checked) => setCreateAnother(checked === true)} 
                      />
                      <Label htmlFor="create-another" className="text-gray-700 font-normal cursor-pointer">Create Another</Label>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button 
                      onClick={handleCancelTask}
                      className="px-4 py-1.5 text-gray-700 font-medium bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveTask}
                      disabled={!newTask.name || !newTask.estimation || newTask.isDeliverable === "none"}
                      className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 px-6 py-1.5 rounded font-medium transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {!review.tasks || review.tasks.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 border border-dashed border-gray-200 rounded-lg">
              <p className="text-gray-500 text-sm">No tasks added yet.</p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg bg-white overflow-hidden divide-y divide-gray-100 shadow-sm">
              <div className="grid grid-cols-12 gap-4 px-4 py-2.5 bg-gray-50 text-xs font-semibold text-gray-600 border-b border-gray-200 uppercase tracking-wider">
                <div className="col-span-4">Name</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Priority</div>
                <div className="col-span-2">Assignee</div>
                <div className="col-span-2">Due Date</div>
              </div>
              {review.tasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => handleEditTask(task)}
                  className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-gray-50 transition-colors text-gray-800 cursor-pointer"
                >
                  <div className="col-span-4 font-medium truncate pr-2" title={task.name}>{task.name}</div>
                  <div className="col-span-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-800">
                      {task.status}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium
                      ${task.priority === 'High' ? 'bg-red-50 text-red-700' : 
                        task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700' : 
                        'bg-green-50 text-green-700'}`}>
                      {task.priority === 'none' ? 'N/A' : task.priority}
                    </span>
                  </div>
                  <div className="col-span-2 text-gray-600 truncate pr-2" title={task.assignee === 'none' ? 'Unassigned' : task.assignee}>
                    {task.assignee === 'none' ? 'Unassigned' : task.assignee}
                  </div>
                  <div className="col-span-2 text-gray-600">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}